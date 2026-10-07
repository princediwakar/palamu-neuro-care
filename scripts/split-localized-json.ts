/**
 * Splits { en, hi } localized JSON files into separate en/ and hi/ directories.
 * Run: npx tsx scripts/split-localized-json.ts
 */

import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(__dirname, "../lib/seo-pages/data");
const EN_DIR = path.join(DATA_DIR, "en");
const HI_DIR = path.join(DATA_DIR, "hi");

function isLocalizedObject(val: unknown): val is Record<string, unknown> {
  if (val === null || typeof val !== "object" || Array.isArray(val)) return false;
  const keys = Object.keys(val as Record<string, unknown>);
  return keys.length === 2 && keys.includes("en") && keys.includes("hi");
}

function extractLang(obj: unknown, lang: "en" | "hi"): unknown {
  if (obj === null || obj === undefined) return obj;

  if (isLocalizedObject(obj)) {
    return obj[lang];
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => extractLang(item, lang));
  }

  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = extractLang(value, lang);
    }
    return result;
  }

  return obj;
}

function main() {
  fs.mkdirSync(EN_DIR, { recursive: true });
  fs.mkdirSync(HI_DIR, { recursive: true });

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));

  console.log(`Found ${files.length} JSON files to split\n`);

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    const enData = extractLang(data, "en");
    const hiData = extractLang(data, "hi");

    fs.writeFileSync(path.join(EN_DIR, file), JSON.stringify(enData, null, 2), "utf-8");
    fs.writeFileSync(path.join(HI_DIR, file), JSON.stringify(hiData, null, 2), "utf-8");

    console.log(`  ✓ ${file} → en/${file}, hi/${file}`);
  }

  console.log(`\nDone. Split ${files.length} files into en/ and hi/ directories.`);
}

main();
