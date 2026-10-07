#!/usr/bin/env npx tsx
/**
 * One-shot migration: converts all SEO data .ts files to JSON-backed
 * thin wrappers with { en, hi } localized strings.
 *
 * Run: npx tsx scripts/migrate-data.ts
 *
 * Unlike translate.ts, this script does NOT use ts-morph or dynamic imports.
 * It reads TS source, evaluates the array literal via a temp .mjs file that
 * imports from the original .ts using tsx's import hook.
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "lib", "seo-pages", "data");

// Barrel files: only re-export from numbered files — skip
const BARREL_FILES = new Set([
  "conditions.ts",
  "diagnostics.ts",
  "symptoms.ts",
  "info.ts",
]);

// Fields that stay as-is (enums, names, identifiers)
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
  "slug",
  "degree",
  "institution",
  "qualifications",
  "doctorQualifications",
  "specializations",
  "education",
  "relatedPages",
  "relatedConditions",
]);

function prepareForLocalization(obj: any): any {
  if (Array.isArray(obj)) {
    if (obj.length > 0 && obj.every((e) => typeof e === "string")) {
      return { en: obj, hi: [] };
    }
    return obj.map(prepareForLocalization);
  }

  if (obj !== null && typeof obj === "object") {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        if (IDENTITY_FIELDS.has(key)) {
          result[key] = value;
        } else {
          result[key] = { en: value, hi: "" };
        }
      } else if (
        Array.isArray(value) &&
        value.length > 0 &&
        value.every((e) => typeof e === "string")
      ) {
        if (IDENTITY_FIELDS.has(key)) {
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

function loadTsData(tsPath: string, exportName: string): any {
  const absPath = path.resolve(tsPath);
  // Create a temp .mjs file that statically imports the TS module and dumps
  // the exported array as JSON to stdout.
  const tmpDir = path.join(ROOT, "node_modules", ".tmp-migrate");
  fs.mkdirSync(tmpDir, { recursive: true });
  const tmpFile = path.join(tmpDir, `${exportName}.mjs`);

  const code = `import { ${exportName} } from ${JSON.stringify(absPath)};
process.stdout.write(JSON.stringify(${exportName}));\n`;

  fs.writeFileSync(tmpFile, code, "utf-8");

  try {
    const result = execSync(`npx tsx "${tmpFile}"`, {
      cwd: ROOT,
      encoding: "utf-8",
      timeout: 30_000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    const trimmed = result.trim();
    if (!trimmed) throw new Error("Empty output");
    return JSON.parse(trimmed);
  } finally {
    try {
      fs.unlinkSync(tmpFile);
    } catch {
      /* ok */
    }
  }
}

function getExportInfo(tsPath: string): { exportName: string; typeAnnotation: string } {
  const content = fs.readFileSync(tsPath, "utf-8");
  // Match: export const someName: SomeType[] = [
  const match = content.match(/export\s+const\s+(\w+)\s*:\s*(\w+(?:\[\])?)\s*=\s*\[/);
  if (!match) {
    throw new Error(`Could not parse export from ${path.basename(tsPath)}`);
  }
  return { exportName: match[1], typeAnnotation: match[2] };
}

function getTypeName(typeAnnotation: string): string {
  return typeAnnotation.replace("[]", "");
}

function getTypeImportPath(tsPath: string, typeName: string): string {
  const content = fs.readFileSync(tsPath, "utf-8");
  const regex = new RegExp(
    `import\\s*\\{[^}]*\\b${typeName}\\b[^}]*\\}\\s*from\\s*["']([^"']+)["']`
  );
  const match = content.match(regex);
  return match ? match[1] : "../types";
}

function migrateFile(tsPath: string): boolean {
  const basename = path.basename(tsPath);
  const jsonPath = tsPath.replace(/\.ts$/, ".json");

  // Already migrated?
  if (fs.existsSync(jsonPath)) {
    console.log(`  SKIP ${basename} — JSON already exists`);
    return false;
  }

  console.log(`  MIGRATE ${basename}...`);

  let info: { exportName: string; typeAnnotation: string };
  try {
    info = getExportInfo(tsPath);
  } catch (err: any) {
    console.error(`    ERROR: ${err.message}`);
    return false;
  }

  let data: any[];
  try {
    data = loadTsData(tsPath, info.exportName);
  } catch (err: any) {
    console.error(`    ERROR loading module: ${err.message}`);
    return false;
  }

  if (!Array.isArray(data)) {
    console.error(`    ERROR: not an array`);
    return false;
  }

  // Wrap strings in { en, hi }
  const localized = data.map(prepareForLocalization);

  // Write JSON
  fs.writeFileSync(jsonPath, JSON.stringify(localized, null, 2), "utf-8");
  console.log(`    → ${path.basename(jsonPath)} (${localized.length} items)`);

  // Rewrite .ts as thin wrapper
  const typeName = getTypeName(info.typeAnnotation);
  const importPath = getTypeImportPath(tsPath, typeName);
  const wrapper = `import data from "./${path.basename(jsonPath)}";
import type { ${typeName} } from "${importPath}";

export const ${info.exportName}: ${info.typeAnnotation} = data as ${info.typeAnnotation};
`;
  fs.writeFileSync(tsPath, wrapper, "utf-8");
  console.log(`    → ${basename} (thin wrapper)`);

  return true;
}

function main() {
  console.log("Palamu Neuro & Eye Care — Data Migration");
  console.log(`Data dir: ${DATA_DIR}\n`);

  const tsFiles = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".ts"))
    .filter((f) => !BARREL_FILES.has(f))
    .sort();

  console.log(`Found ${tsFiles.length} data files\n`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of tsFiles) {
    const result = migrateFile(path.join(DATA_DIR, file));
    if (result) migrated++;
    else if (fs.existsSync(path.join(DATA_DIR, file.replace(".ts", ".json")))) skipped++;
    else errors++;
  }

  console.log(`\nDone: ${migrated} migrated, ${skipped} skipped, ${errors} errors`);
}

main();
