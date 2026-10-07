#!/usr/bin/env tsx
/**
 * scripts/translate.ts
 *
 * Standalone Node.js script (run with `npx tsx scripts/translate.ts`) that:
 *   1. Migrates TypeScript SEO page data files → JSON (one-time)
 *   2. Translates English strings in those JSON files to Hindi via OpenAI
 *   3. Translates messages/en.json → messages/hi.json
 *
 * Idempotent: if a `hi` key already exists and is non-empty, it is skipped.
 *
 * Usage:
 *   npx tsx scripts/translate.ts --all        # migrate + translate (default)
 *   npx tsx scripts/translate.ts --migrate     # TS → JSON only
 *   npx tsx scripts/translate.ts --translate   # translate JSON only
 *   npx tsx scripts/translate.ts --fast        # use gpt-4o-mini instead of gpt-4o
 *   npx tsx scripts/translate.ts --dry-run     # print what would happen without changes
 */

import { Project, Node, type VariableDeclaration } from "ts-morph";
import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import * as url from "url";

// ─── Resolve project root (works regardless of CWD) ───────────────────────
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "lib", "seo-pages", "data");
const MESSAGES_DIR = path.join(ROOT, "messages");

// ─── CLI flags ────────────────────────────────────────────────────────────
const args = new Set(process.argv.slice(2));
const FLAG_MIGRATE = args.has("--migrate");
const FLAG_TRANSLATE = args.has("--translate");
const FLAG_ALL = args.has("--all") || (!FLAG_MIGRATE && !FLAG_TRANSLATE);
const FLAG_FAST = args.has("--fast");
const FLAG_DRY_RUN = args.has("--dry-run");
const MODEL = FLAG_FAST ? "deepseek-v4-flash" : "deepseek-v4-pro";
const MAX_RPS = 1; // requests per second
const OPENAI_API_KEY=process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_KEY=process.env.DEEPSEEK_API_KEY;
// ─── Barrel files (only re-export from numbered files — skip migration) ───
const BARREL_FILES = new Set([
  "conditions.ts",
  "diagnostics.ts",
  "symptoms.ts",
  "info.ts",
  "specialists.ts", // included for safety — specialists.ts is actually a data file
]);

// Barrel detection: a file is a barrel if it has no ArrayLiteralExpression
// at the top-level export declaration (i.e., it only spreads other arrays).

// ─── OpenAI client ────────────────────────────────────────────────────────
function getOpenAI(): OpenAI {
  const apiKey = OPENAI_API_KEY;
  const baseURL = 'https://api.deepseek.com'
  if (!apiKey) {
    console.error("ERROR: OPENAI_API_KEY environment variable is not set.");
    process.exit(1);
  }
  return new OpenAI({ apiKey, baseURL });
}

// ─── Rate limiter ─────────────────────────────────────────────────────────
let lastRequestTime = 0;
async function rateLimit(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < 1000 / MAX_RPS) {
    await new Promise((r) => setTimeout(r, 1000 / MAX_RPS - elapsed));
  }
  lastRequestTime = Date.now();
}

// ─── System prompt for OpenAI translations ────────────────────────────────
const SYSTEM_PROMPT = `You are a professional Hindi translator specialized in medical content. Translate the given English text to natural, colloquial Hindi as spoken in Palamu, Jharkhand.

CRITICAL: Write the ENTIRE translation in Devanagari script. Every word must be Hindi — do NOT leave any English words in the output except as noted below.

Rules:
1. EVERYTHING goes into Devanagari: common words (in, with, from, your, the, is, our, for, and, to, of, a, an), medical terms (Neurologist→न्यूरोलॉजिस्ट, MRI→एमआरआई, Retina→रेटिना, Cataract→मोतियाबिंद, EEG→ईईजी, Migraine→माइग्रेन), adjectives, verbs, prepositions — ALL in Hindi/Devanagari.
2. ONLY these stay in English script: brand names (Palamu Neuro & Eye Care), doctor names (Dr. Yuvraj Lahre, Dr. Dibya Prabha), institution acronyms (AIIMS, RIMS, DM, MD), and place names already in English (Jharkhand, Bihar, etc.).
3. Use conversational Hindi that patients in Jharkhand/Bihar would naturally speak — not bookish/Shuddh Hindi.
4. Maintain the exact same JSON structure and array lengths.
5. NEVER translate code values, enum keys, or technical identifiers.
6. Return ONLY the translated text, never add explanations.`;

// ─── Step 1: TS → JSON Migration ─────────────────────────────────────────

interface DataFileInfo {
  /** Absolute path to the .ts file */
  tsPath: string;
  /** Absolute path to the .json file that will be created */
  jsonPath: string;
  /** Name of the exported const (e.g., "conditionPages1") */
  exportName: string;
  /** Type annotation string (e.g., "ConditionSeoPage[]") */
  typeAnnotation: string;
  /** Import path for the type (e.g., "../types") */
  typeImportPath: string;
  /** Name of the imported type (e.g., "ConditionSeoPage") */
  typeName: string;
}

/**
 * Determine if a .ts file is a barrel (only re-exports) or contains actual
 * data. Barrels should be skipped during migration.
 *
 * Detection logic:
 * 1. Known barrel files (by name) that are PURE re-exports → skip
 * 2. Files that have already been migrated (corresponding .json exists) → NOT a barrel
 * 3. Files with inline object literal data (contain "slug:") → NOT a barrel
 */
function isBarrelFile(tsPath: string): boolean {
  const basename = path.basename(tsPath);

  // If a corresponding JSON file already exists, this .ts file has already
  // been migrated (or was manually created) — it's a data wrapper, not a barrel.
  const jsonPath = tsPath.replace(/\.ts$/, ".json");
  if (fs.existsSync(jsonPath)) return false;

  // Known barrel names — but double-check that they aren't data files in
  // disguise (some files like specialists.ts have the name of a barrel
  // but actually contain inline data).
  if (BARREL_FILES.has(basename)) {
    const content = fs.readFileSync(tsPath, "utf-8");
    // If the file has object literal properties (like "slug:"), it's data.
    if (content.includes("slug:")) return false;
    // Otherwise it's a barrel.
    return true;
  }

  return false;
}

/**
 * Use ts-morph to extract the export name, type annotation, and type import
 * from a .ts data file.
 */
function extractExportInfo(tsPath: string): Omit<DataFileInfo, "jsonPath"> {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(tsPath);
  const basename = path.basename(tsPath);

  // Find the first exported variable declaration
  const exportedDecls = sourceFile.getExportedDeclarations();
  const entries = Array.from(exportedDecls.entries());

  if (entries.length === 0) {
    throw new Error(`No exported declarations found in ${basename}`);
  }

  // Take the first export name and its declaration
  const [exportName, declarations] = entries[0];
  const decl = declarations[0];

  if (!Node.isVariableDeclaration(decl)) {
    throw new Error(`Export "${exportName}" in ${basename} is not a variable declaration`);
  }

  const varDecl = decl as VariableDeclaration;
  const typeNode = varDecl.getTypeNode();
  const typeAnnotation = typeNode?.getText() ?? "any";

  // Extract the type name (e.g., "ConditionSeoPage[]" → ["ConditionSeoPage", "[]"])
  const typeMatch = typeAnnotation.match(/^(\w+)(\[\])?$/);
  const typeName = typeMatch ? typeMatch[1] : "any";

  // Find the import declaration for this type
  let typeImportPath = "../types";
  const importDecls = sourceFile.getImportDeclarations();
  for (const imp of importDecls) {
    const namedImports = imp.getNamedImports();
    for (const ni of namedImports) {
      if (ni.getName() === typeName) {
        typeImportPath = imp.getModuleSpecifierValue();
        break;
      }
    }
  }

  return { tsPath, exportName, typeAnnotation, typeImportPath, typeName };
}

/**
 * Dynamically import a .ts file and return its exported array value.
 *
 * Because the user runs this script with `npx tsx`, the tsx loader is already
 * active and `await import()` handles .ts files transparently.  We also handle
 * the case where the file has already been migrated to a thin wrapper that
 * re-exports from a JSON file.
 */
async function loadTsData(tsPath: string, exportName: string): Promise<unknown> {
  try {
    // Use a cache-busting query string so repeated runs pick up fresh data.
    const url = `file://${tsPath}?t=${Date.now()}`;
    const mod = await import(url);
    if (!(exportName in mod)) {
      throw new Error(
        `Export "${exportName}" not found in ${path.basename(tsPath)}`
      );
    }
    return (mod as any)[exportName];
  } catch (err: any) {
    throw new Error(
      `Failed to import ${path.basename(tsPath)}: ${err.message}`
    );
  }
}

/**
 * Migrate a single .ts data file to JSON + thin TypeScript wrapper.
 */
async function migrateFile(info: DataFileInfo): Promise<void> {
  const basename = path.basename(info.tsPath);
  console.log(`  Migrating ${basename}...`);

  // Load the TypeScript module to get the actual data
  let data: unknown;
  try {
    data = await loadTsData(info.tsPath, info.exportName);
  } catch (err: any) {
    console.error(`    ERROR loading ${basename}: ${err.message}`);
    return;
  }

  if (!Array.isArray(data)) {
    console.error(`    ERROR: exported value "${info.exportName}" in ${basename} is not an array`);
    return;
  }

  // Prepare localized format: strings become { en, hi }, arrays of strings
  // become { en: [...], hi: [...] }
  const localizedData = data.map((item: any) => prepareForLocalization(item));

  if (FLAG_DRY_RUN) {
    console.log(`    [DRY RUN] Would write ${info.jsonPath} (${localizedData.length} items)`);
    console.log(`    [DRY RUN] Would rewrite ${basename} as thin wrapper`);
    return;
  }

  // Write JSON
  fs.writeFileSync(info.jsonPath, JSON.stringify(localizedData, null, 2), "utf-8");
  console.log(`    Wrote ${path.basename(info.jsonPath)} (${localizedData.length} items)`);

  // Rewrite .ts file as thin wrapper
  const relativeJsonPath = `./${path.basename(info.jsonPath)}`;
  const jsDocNote = `/**\n * Auto-generated thin wrapper — source of truth is ${path.basename(info.jsonPath)}.\n * Generated by scripts/translate.ts --migrate\n */`;
  const wrapper = `${jsDocNote}
import data from "${relativeJsonPath}";
import type { ${info.typeName} } from "${info.typeImportPath}";

export const ${info.exportName}: ${info.typeAnnotation} = data as ${info.typeAnnotation};
`;

  fs.writeFileSync(info.tsPath, wrapper, "utf-8");
  console.log(`    Rewrote ${basename} as thin wrapper`);
}

/**
 * Convert a plain page object to the localized format that the types expect.
 * Plain strings → { en: string, hi: "" }
 * Plain string arrays → { en: string[], hi: [] }
 * Objects are recursed into.
 */
function prepareForLocalization(obj: any): any {
  if (Array.isArray(obj)) {
    // If it's an array of strings, wrap as { en: [...], hi: [...] }
    if (obj.length > 0 && obj.every((e) => typeof e === "string")) {
      return { en: obj, hi: [] };
    }
    // Otherwise recurse into each element
    return obj.map(prepareForLocalization);
  }

  if (obj !== null && typeof obj === "object") {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        // Wrap plain strings as { en, hi } EXCEPT for identity/enum fields
        if (isIdentityField(key)) {
          result[key] = value;
        } else {
          result[key] = { en: value, hi: "" };
        }
      } else if (Array.isArray(value) && value.length > 0 && value.every((e) => typeof e === "string")) {
        // Array of strings → { en, hi }
        if (isIdentityField(key) || isProperNameField(key)) {
          result[key] = value;
        } else {
          result[key] = { en: value, hi: [] };
        }
      } else {
        result[key] = prepareForLocalization(value);
      }
    }
    return result;
  }

  return obj;
}

/** Fields that should NEVER be wrapped in { en, hi } (enums, proper names, URLs). */
const IDENTITY_FIELDS = new Set([
  "category",
  "clinician",
  "jsonLdType",
  "canonical",
  "parentDepartment",
  "doctorName",
  "doctorImage",
  "icon",
  "step",
  "slug", // top-level slug handled specially in translation; nested slugs stay plain
  "degree",
  "institution",
  "qualifications",
  "doctorQualifications",
  "specializations",
  "education",
  "relatedPages",
  "relatedConditions",
]);

function isIdentityField(key: string): boolean {
  return IDENTITY_FIELDS.has(key);
}

function isProperNameField(key: string): boolean {
  return (
    key === "doctorQualifications" ||
    key === "specializations" ||
    key === "education" ||
    key === "relatedPages" ||
    key === "relatedConditions" ||
    key === "servingRegions" // location names that should stay as-is
  );
}

/**
 * Run the TS → JSON migration for all data files.
 */
async function migrateAll(): Promise<void> {
  console.log("\n═══ Step 1: TS → JSON Migration ═══\n");

  if (!fs.existsSync(DATA_DIR)) {
    console.error(`ERROR: Data directory not found: ${DATA_DIR}`);
    process.exit(1);
  }

  const tsFiles = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".ts"))
    .sort();

  const dataFiles = tsFiles.filter((f) => !isBarrelFile(path.join(DATA_DIR, f)));

  // Check if JSON files already exist
  const existingJson = dataFiles.filter((f) =>
    fs.existsSync(path.join(DATA_DIR, f.replace(".ts", ".json")))
  );

  if (existingJson.length > 0) {
    console.log(
      `  ${existingJson.length} JSON file(s) already exist — skipping migration.\n` +
        `  To force re-migration, delete the .json files first.\n` +
        `  Existing: ${existingJson.map((f) => f.replace(".ts", ".json")).join(", ")}`
    );

    if (!FLAG_DRY_RUN) {
      // Check if all JSON files exist
      const allExist = dataFiles.every((f) =>
        fs.existsSync(path.join(DATA_DIR, f.replace(".ts", ".json")))
      );
      if (allExist) {
        console.log("  All JSON files exist. Migration already complete.\n");
        return;
      }
    }
  }

  // Filter to only files that don't have JSON yet
  const toMigrate = dataFiles.filter(
    (f) => !fs.existsSync(path.join(DATA_DIR, f.replace(".ts", ".json")))
  );

  if (toMigrate.length === 0) {
    console.log("  No files to migrate.\n");
    return;
  }

  console.log(`  Found ${toMigrate.length} .ts file(s) to migrate:\n`);

  const results: DataFileInfo[] = [];
  for (const file of toMigrate) {
    const tsPath = path.join(DATA_DIR, file);
    try {
      const info = extractExportInfo(tsPath);
      const jsonPath = tsPath.replace(/\.ts$/, ".json");
      results.push({ ...info, jsonPath });
    } catch (err: any) {
      console.error(`  ERROR extracting info from ${file}: ${err.message}`);
    }
  }

  console.log("");
  for (const info of results) {
    await migrateFile(info);
  }

  // Update barrel files to point to JSON wrappers
  if (!FLAG_DRY_RUN) {
    await updateBarrelFiles();
  }

  console.log("\n  Migration complete.\n");
}

/**
 * After migration, ensure barrel files still work by checking that they
 * re-export from the thin wrapper .ts files (which now import from JSON).
 * The barrel files should not need changes since the thin wrappers keep
 * the same export names.
 */
async function updateBarrelFiles(): Promise<void> {
  console.log("  Verifying barrel files...");
  const barrelNames = ["conditions.ts", "diagnostics.ts", "symptoms.ts", "info.ts", "locations.ts"];

  for (const barrel of barrelNames) {
    const barrelPath = path.join(DATA_DIR, barrel);
    if (!fs.existsSync(barrelPath)) continue;

    const content = fs.readFileSync(barrelPath, "utf-8");

    // Check if it's a true barrel (has spread syntax or is just re-exports)
    const isSpreadBarrel = content.includes("...");
    const importsFrom = content.match(/from\s+"\.\/([^"]+)"/g) ?? [];

    if (isSpreadBarrel) {
      console.log(`    ${barrel} — barrel OK (uses spread syntax)`);
    } else {
      // This file has inline data — it was already a data file before migration.
      // If it hasn't been converted to a wrapper yet, convert it.
      const jsonExists = fs.existsSync(barrelPath.replace(/\.ts$/, ".json"));
      if (!jsonExists) {
        console.log(`    ${barrel} — appears to have inline data; will be migrated separately`);
      } else {
        console.log(`    ${barrel} — already migrated to JSON-backed wrapper`);
      }
    }
  }
}

// ─── Step 2: Translate JSON ──────────────────────────────────────────────

interface TranslationTask {
  /** Short index key used in the OpenAI prompt (e.g., "k0", "k1"). */
  key: string;
  /** Path to set the translated value at (e.g., "title.hi", "keywords.hi"). */
  path: string;
  /** English text to translate (string for simple fields, string[] for arrays). */
  en: string | string[];
  /** Whether this is a slug (needs Hinglish, not Devanagari). */
  isSlug: boolean;
}

/**
 * Recursively walk a page object (already in localized JSON format) and
 * collect every translatable unit whose `hi` side is still empty.
 *
 * Three target shapes are recognised:
 *   1. LocalizedString  — { en: string,  hi: string  }
 *   2. LocalizedArray   — { en: string[], hi: string[] }
 *   3. Pre-migration leaf strings (fallback — shouldn't appear after --migrate).
 */
function collectTranslationTasks(
  obj: any,
  prefix: string = ""
): TranslationTask[] {
  const tasks: TranslationTask[] = [];

  if (obj === null || obj === undefined) return tasks;

  if (typeof obj === "string") {
    // Pre-migration plain string — wrap in a task so we never lose text.
    const isSlug = prefix === "slug" || prefix.endsWith(".slug");
    tasks.push({ key: "", path: prefix, en: obj, isSlug });
    return tasks;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      tasks.push(...collectTranslationTasks(item, `${prefix}[${i}]`));
    });
    return tasks;
  }

  if (typeof obj !== "object") return tasks;

  // ── LocalizedArray: { en: string[], hi: string[] } ──────────────────
  if (
    "en" in obj &&
    "hi" in obj &&
    Array.isArray(obj.en) &&
    Array.isArray(obj.hi) &&
    Object.keys(obj).length === 2
  ) {
    if (obj.hi.length === 0) {
      const isSlug = prefix === "slug" || prefix.endsWith(".slug");
      tasks.push({ key: "", path: prefix + ".hi", en: obj.en, isSlug });
    }
    return tasks;
  }

  // ── LocalizedString: { en: string, hi: string } ─────────────────────
  if (
    "en" in obj &&
    "hi" in obj &&
    typeof obj.en === "string" &&
    Object.keys(obj).length === 2
  ) {
    if (!obj.hi || obj.hi === "") {
      const isSlug = prefix === "slug" || prefix.endsWith(".slug");
      tasks.push({ key: "", path: prefix + ".hi", en: obj.en, isSlug });
    }
    // hi is already set → skip (idempotency)
    return tasks;
  }

  // ── Regular object — recurse into each key ──────────────────────────
  for (const [key, value] of Object.entries(obj)) {
    // Never walk into identity/enum fields (they carry no user-facing text).
    if (isIdentityField(key) && key !== "slug") continue;

    const childPrefix = prefix ? `${prefix}.${key}` : key;
    tasks.push(...collectTranslationTasks(value, childPrefix));
  }

  return tasks;
}

/**
 * Set a value at a dotted path inside an object tree.
 * Supports array indices via the `foo[n]` segment syntax.
 * `value` may be a string or an array (for localized-array hi fields).
 */
function setAtPath(obj: any, dotPath: string, value: unknown): void {
  const parts = parsePath(dotPath);

  let current: any = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (typeof part === "number") {
      if (!Array.isArray(current)) {
        throw new Error(
          `Expected array at segment [${part}] in "${dotPath}"`
        );
      }
      if (current[part] === undefined) {
        throw new Error(`Missing index ${part} in "${dotPath}"`);
      }
      current = current[part];
    } else {
      if (current[part] === undefined || current[part] === null) {
        throw new Error(`Missing key "${part}" in "${dotPath}"`);
      }
      current = current[part];
    }
  }

  const last = parts[parts.length - 1];
  if (typeof last === "number") {
    if (!Array.isArray(current)) {
      throw new Error(`Expected array at final segment in "${dotPath}"`);
    }
    current[last] = value;
  } else {
    current[last] = value;
  }
}

function parsePath(p: string): Array<string | number> {
  return p.split(".").flatMap((seg) => {
    // "faqs[0]"  → ["faqs", 0]
    const m = seg.match(/^(\w+)\[(\d+)\]$/);
    if (m) return [m[1], parseInt(m[2], 10)];
    // "[0]" → [0] (bare index, rare)
    const b = seg.match(/^\[(\d+)\]$/);
    if (b) return [parseInt(b[1], 10)];
    return [seg];
  });
}

/**
 * Translate all outstanding fields in a single page object.
 */
async function translatePageObject(
  page: any,
  pageIndex: number,
  totalPages: number,
  openai: OpenAI
): Promise<void> {
  const tasks = collectTranslationTasks(page);

  if (tasks.length === 0) {
    console.log(
      `    Page ${pageIndex + 1}/${totalPages}: fully translated — skipping`
    );
    return;
  }

  const slugTasks = tasks.filter((t) => t.isSlug);
  const regularTasks = tasks.filter((t) => !t.isSlug);

  const label =
    regularTasks.length > 0 ? `${regularTasks.length} field(s)` : "";
  const slugLabel =
    slugTasks.length > 0 ? ` + ${slugTasks.length} slug(s)` : "";

  console.log(
    `    Page ${pageIndex + 1}/${totalPages}: translating ${label}${slugLabel}`
  );

  if (regularTasks.length > 0) {
    await translateRegularTasks(regularTasks, page, openai);
  }

  if (slugTasks.length > 0) {
    await translateSlugTasks(slugTasks, page, openai);
  }
}

// ── Regular-string batch translation ─────────────────────────────────────

async function translateRegularTasks(
  tasks: TranslationTask[],
  page: any,
  openai: OpenAI
): Promise<void> {
  // Assign short keys so the prompt is compact.
  const inputMap: Record<string, string | string[]> = {};
  for (let i = 0; i < tasks.length; i++) {
    const key = `k${i}`;
    tasks[i].key = key;
    inputMap[key] = tasks[i].en;
  }

  const userMessage = `Translate EVERY English value below to FULL Hindi (Devanagari script). Not a single English word should remain except proper names.

Rules:
- EVERY common word MUST be in Devanagari: "in"→"में", "with"→"के साथ", "from"→"से", "your"→"आपका", "the"→"यह", "our"→"हमारा", "and"→"और", "for"→"के लिए", etc.
- Medical terms transliterated to Devanagari: Neurologist→न्यूरोलॉजिस्ट, MRI→एमआरआई, Retina→रेटिना, EEG→ईईजी, Migraine→माइग्रेन, etc.
- ONLY keep these in English: brand names (Palamu Neuro & Eye Care), doctor names, institution codes (AIIMS, RIMS, DM, MD).
- Use natural Jharkhand/Bihar colloquial Hindi.
- For array values, return an array of translated strings of same length.
- Return ONLY valid JSON — no markdown, no explanation.

Example:
  Input: "Get expert migraine treatment in Palamu at Palamu Neuro & Eye Care"
  BAD: "Get एक्सपर्ट माइग्रेन इलाज in पलामू at Palamu Neuro & Eye Care"
  GOOD: "पलामू न्यूरो एंड आई केयर क्लिनिक में पलामू में एक्सपर्ट माइग्रेन का इलाज कराएं"

Input:
${JSON.stringify(inputMap, null, 2)}`;

  await rateLimit();

  let responseContent = "";
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 16000,
    });
    responseContent = response.choices[0]?.message?.content?.trim() ?? "";
  } catch (err: any) {
    console.error(`      OpenAI API error: ${err.message}`);
    return;
  }

  if (!responseContent) {
    console.error("      Empty response from OpenAI");
    return;
  }

  // Parse the response JSON, stripping any code fences.
  let translations: Record<string, string | string[]>;
  try {
    const jsonStr = responseContent
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
    translations = JSON.parse(jsonStr);
  } catch {
    console.error(
      `      Failed to parse OpenAI response as JSON. Raw: ${responseContent.slice(0, 200)}...`
    );
    return;
  }

  // Apply translations.
  let applied = 0;
  for (const task of tasks) {
    const hiValue = translations[task.key];
    if (hiValue === undefined || hiValue === null) continue;
    if (typeof hiValue === "string" && hiValue.trim() === "") continue;

    try {
      setAtPath(page, task.path, hiValue);
      applied++;
    } catch (err: any) {
      console.error(`      Failed to set "${task.path}": ${err.message}`);
    }
  }
  console.log(`      Applied ${applied} translation(s)`);
}

// ── Slug batch translation ────────────────────────────────────────────────

async function translateSlugTasks(
  tasks: TranslationTask[],
  page: any,
  openai: OpenAI
): Promise<void> {
  // Build a map of original English slug → task
  const slugMap = new Map<string, TranslationTask>();
  const enSlugs: string[] = [];

  for (const task of tasks) {
    const slug = typeof task.en === "string" ? task.en : task.en[0] ?? "";
    slugMap.set(slug, task);
    enSlugs.push(slug);
  }

  const userMessage = `Convert these English URL slugs to Hinglish (Latin script ONLY — NO Devanagari characters).

Examples:
  "migraine-treatment-in-palamu" → "migraine-ka-ilaj-palamu-mein"
  "best-neurologist-in-palamu" → "best-neurologist-palamu-mein"
  "eeg-test-in-palamu" → "eeg-test-palamu-mein"

Rules:
- Use ONLY English/Latin letters a-z and hyphens. No Devanagari, no special chars.
- Keep city/state names in English (Palamu, Jamshedpur, Jharkhand)
- Use conversational Hinglish: "ka", "mein", "ki", "ke", "kya", "kare"
- Lowercase only, hyphens as separators

Slugs:
${enSlugs.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Return a JSON object mapping each original slug (key) → Hinglish slug (value).
Return ONLY valid JSON.`;

  await rateLimit();

  let responseContent = "";
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a Hinglish transliteration expert. Convert English medical URL slugs to Hinglish. Return ONLY valid JSON.",
        },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });
    responseContent = response.choices[0]?.message?.content?.trim() ?? "";
  } catch (err: any) {
    console.error(`      OpenAI API error (slugs): ${err.message}`);
    return;
  }

  if (!responseContent) {
    console.error("      Empty response from OpenAI for slugs");
    return;
  }

  let translations: Record<string, string>;
  try {
    const jsonStr = responseContent
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
    translations = JSON.parse(jsonStr);
  } catch {
    console.error(
      `      Failed to parse slug response. Raw: ${responseContent.slice(0, 200)}...`
    );
    return;
  }

  let applied = 0;
  for (const [enSlug, hiSlug] of Object.entries(translations)) {
    if (!hiSlug || hiSlug.trim() === "") continue;
    const task = slugMap.get(enSlug);
    if (!task) continue;

    try {
      // Slugs are stored as plain strings during migration.  Replace with
      // the { en, hi } object that the TypeScript types expect.
      const originalEn =
        typeof task.en === "string" ? task.en : task.en[0] ?? "";
      setAtPath(page, task.path, {
        en: originalEn,
        hi: hiSlug.trim(),
      });
      applied++;
    } catch (err: any) {
      console.error(
        `      Failed to set slug "${task.path}": ${err.message}`
      );
    }
  }
  console.log(`      Applied ${applied} slug translation(s)`);
}

/**
 * Translate all JSON data files found in the data directory.
 */
async function translateAllJson(): Promise<void> {
  console.log("\n═══ Step 2: Translate SEO Page JSON ═══\n");

  if (!fs.existsSync(DATA_DIR)) {
    console.error(`ERROR: Data directory not found: ${DATA_DIR}`);
    process.exit(1);
  }

  const jsonFiles = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  if (jsonFiles.length === 0) {
    console.log(
      "  No JSON files found. Run --migrate first to create them.\n"
    );
    return;
  }

  console.log(
    `  Found ${jsonFiles.length} JSON file(s): ${jsonFiles.join(", ")}\n`
  );

  const openai = getOpenAI();

  for (const jsonFile of jsonFiles) {
    const jsonPath = path.join(DATA_DIR, jsonFile);
    console.log(`  Processing ${jsonFile}...`);

    let data: any[];
    try {
      data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    } catch (err: any) {
      console.error(`    ERROR reading ${jsonFile}: ${err.message}`);
      continue;
    }

    if (!Array.isArray(data)) {
      console.error(`    ERROR: ${jsonFile} does not contain a top-level array`);
      continue;
    }

    let fileTotal = 0;
    for (let i = 0; i < data.length; i++) {
      const before = countTranslationTasks(data[i]);
      if (before === 0) {
        console.log(
          `    Page ${i + 1}/${data.length}: fully translated — skipping`
        );
        continue;
      }

      await translatePageObject(data[i], i, data.length, openai);

      const after = countTranslationTasks(data[i]);
      fileTotal += before - after;
    }

    if (!FLAG_DRY_RUN) {
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf-8");
      console.log(
        `  Updated ${jsonFile} (${fileTotal} new translation(s))\n`
      );
    } else {
      console.log(
        `  [DRY RUN] Would update ${jsonFile} (${fileTotal} new translation(s))\n`
      );
    }
  }

  console.log("  Translation of SEO page JSON complete.\n");
}

/**
 * Return the number of translatable units whose `hi` side is still empty.
 */
function countTranslationTasks(obj: any): number {
  return collectTranslationTasks(obj).length;
}

// ─── Step 3: UI Strings ──────────────────────────────────────────────────

/**
 * Translate messages/en.json → messages/hi.json
 */
async function translateMessages(): Promise<void> {
  console.log("\n═══ Step 3: Translate UI Messages ═══\n");

  const enPath = path.join(MESSAGES_DIR, "en.json");
  const hiPath = path.join(MESSAGES_DIR, "hi.json");

  if (!fs.existsSync(enPath)) {
    console.error(`ERROR: ${enPath} not found`);
    return;
  }

  const enMessages = JSON.parse(fs.readFileSync(enPath, "utf-8"));
  const hiMessages = fs.existsSync(hiPath)
    ? JSON.parse(fs.readFileSync(hiPath, "utf-8"))
    : {};

  // Collect all translatable strings from en.json
  function collectMessages(
    obj: Record<string, any>,
    prefix: string = ""
  ): Array<{ key: string; en: string }> {
    const result: Array<{ key: string; en: string }> = [];
    for (const [k, v] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${k}` : k;
      if (typeof v === "string") {
        result.push({ key: fullKey, en: v });
      } else if (typeof v === "object" && v !== null && !Array.isArray(v)) {
        result.push(...collectMessages(v, fullKey));
      }
    }
    return result;
  }

  const allMessages = collectMessages(enMessages);

  // Filter out already-translated
  function getHiValue(obj: Record<string, any>, keyPath: string): string | undefined {
    const parts = keyPath.split(".");
    let current: any = obj;
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    return typeof current === "string" ? current : undefined;
  }

  const toTranslate = allMessages.filter((m) => {
    const existing = getHiValue(hiMessages, m.key);
    return !existing || existing.trim() === "";
  });

  if (toTranslate.length === 0) {
    console.log("  All UI messages already translated. Skipping.\n");
    return;
  }

  console.log(`  Found ${toTranslate.length} message(s) to translate (${allMessages.length - toTranslate.length} already done)\n`);

  const openai = getOpenAI();

  // Process in chunks of 20 to avoid empty responses or truncation
  const CHUNK_SIZE = 20;
  let applied = 0;

  for (let i = 0; i < toTranslate.length; i += CHUNK_SIZE) {
    const chunk = toTranslate.slice(i, i + CHUNK_SIZE);
    console.log(`  Processing chunk ${Math.floor(i/CHUNK_SIZE) + 1} of ${Math.ceil(toTranslate.length/CHUNK_SIZE)} (${chunk.length} strings)...`);

    const inputMap: Record<string, string> = {};
    for (const m of chunk) {
      inputMap[m.key] = m.en;
    }

    const userMessage = `Translate each English UI string to FULL Hindi (Devanagari script). Return a JSON object with the SAME keys and Hindi translations.

These are UI strings for a medical clinic website.

CRITICAL: Every word must be in Devanagari except proper names.
- "in"→"में", "with"→"के साथ", "your"→"आपका", "our"→"हमारा", "and"→"और", etc.
- Medical terms: Neurologist→न्यूरोलॉजिस्ट, MRI→एमआरआई, Ophthalmology→ऑफ्थैल्मोलॉजी
- Only keep in English: brand names (Palamu Neuro & Eye Care), doctor names, institution codes (AIIMS, RIMS)
- Use natural Jharkhand/Bihar colloquial Hindi

Input:
${JSON.stringify(inputMap, null, 2)}

Return ONLY valid JSON, no explanation.`;

    await rateLimit();

    let response;
    try {
      response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      });
    } catch (err: any) {
      console.error(`  OpenAI API error on chunk: ${err.message}`);
      continue;
    }

    const content = response.choices[0]?.message?.content?.trim() ?? "";
    if (!content) {
      console.error("  Empty response from OpenAI for chunk");
      continue;
    }

    let translations: Record<string, string>;
    try {
      const jsonStr = content.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      translations = JSON.parse(jsonStr);
    } catch {
      console.error(`  Failed to parse OpenAI response for chunk. Raw: ${content.slice(0, 300)}...`);
      continue;
    }

    function setHiMessage(obj: Record<string, any>, keyPath: string, value: string): void {
      const parts = keyPath.split(".");
      let current = obj;
      for (let j = 0; j < parts.length - 1; j++) {
        if (!current[parts[j]]) {
          current[parts[j]] = {};
        }
        current = current[parts[j]];
      }
      current[parts[parts.length - 1]] = value;
    }

    for (const [keyPath, hiValue] of Object.entries(translations)) {
      if (!hiValue || hiValue.trim() === "") continue;
      setHiMessage(hiMessages, keyPath, hiValue);
      applied++;
    }
  }

  console.log(`  Applied ${applied} translations`);

  if (!FLAG_DRY_RUN) {
    fs.writeFileSync(hiPath, JSON.stringify(hiMessages, null, 2), "utf-8");
    console.log(`  Wrote ${path.basename(hiPath)}\n`);
  } else {
    console.log(`  [DRY RUN] Would write ${path.basename(hiPath)}\n`);
  }

  console.log("  UI messages translation complete.\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║   Palamu Neuro & Eye Care Website — Translation Script           ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log(`\n  Model: ${MODEL}`);
  if (FLAG_DRY_RUN) console.log("  Mode: DRY RUN (no changes will be written)");
  console.log(`  Data dir: ${DATA_DIR}`);
  console.log(`  Messages dir: ${MESSAGES_DIR}`);

  if (FLAG_ALL || FLAG_MIGRATE) {
    await migrateAll();
  }

  if (FLAG_ALL || FLAG_TRANSLATE) {
    await translateAllJson();
    await translateMessages();
  }

  console.log("Done.\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
