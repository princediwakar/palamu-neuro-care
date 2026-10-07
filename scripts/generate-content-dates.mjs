import { execSync } from "child_process";
import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "lib/seo-pages/data");
const OUTPUT = join(process.cwd(), "lib/seo-pages/content-dates.json");

async function walk(dir) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      results.push(...(await walk(full)));
    } else if (e.name.endsWith(".json")) {
      results.push(full);
    }
  }
  return results;
}

function getGitDates(relPath) {
  try {
    const published = execSync(
      `git log --diff-filter=A --follow --format="%aI" -- "${relPath}" | tail -1`,
      { encoding: "utf-8" }
    ).trim();
    const modified = execSync(
      `git log -1 --format="%aI" -- "${relPath}"`,
      { encoding: "utf-8" }
    ).trim();
    if (published && modified) return { datePublished: published, dateModified: modified };
  } catch {
    // file not tracked in git yet
  }
  return null;
}

async function generate() {
  const files = await walk(DATA_DIR);
  const slugDates = {};

  for (const fullPath of files) {
    const relPath = fullPath.replace(process.cwd() + "/", "");
    const dates = getGitDates(relPath);
    if (!dates) continue;

    try {
      const content = await readFile(fullPath, "utf-8");
      const pages = JSON.parse(content);
      if (!Array.isArray(pages)) continue;

      for (const page of pages) {
        if (page.slug) {
          slugDates[page.slug] = dates;
        }
      }
    } catch {
      // skip unparseable files
    }
  }

  await writeFile(OUTPUT, JSON.stringify(slugDates, null, 2));
  console.log(`Generated content-dates.json with ${Object.keys(slugDates).length} slugs`);
}

generate();
