import { specialistPages as enSpecialists } from "./data/en/specialists";
import { conditionPages as enConditions } from "./data/en/conditions";
import { diagnosticPages as enDiagnostics } from "./data/en/diagnostics";
import { symptomPages as enSymptoms } from "./data/en/symptoms";
import { locationPages as enLocations } from "./data/en/locations";
import { districtLocationPages as enDistricts } from "./data/en/locations-districts";
import { palamuLocationPages as enPalamu } from "./data/en/locations-palamu";
import { infoPages as enInfo } from "./data/en/info";
import { doctorPages as enDoctors } from "./data/en/doctors";

import { specialistPages as hiSpecialists } from "./data/hi/specialists";
import { conditionPages as hiConditions } from "./data/hi/conditions";
import { diagnosticPages as hiDiagnostics } from "./data/hi/diagnostics";
import { symptomPages as hiSymptoms } from "./data/hi/symptoms";
import { locationPages as hiLocations } from "./data/hi/locations";
import { districtLocationPages as hiDistricts } from "./data/hi/locations-districts";
import { palamuLocationPages as hiPalamu } from "./data/hi/locations-palamu";
import { infoPages as hiInfo } from "./data/hi/info";
import { doctorPages as hiDoctors } from "./data/hi/doctors";

import slugMaps from "./slug-maps.json";
import { SeoPage, SeoPageCategory } from "./types";

export const allEnPages: SeoPage[] = [
  ...enSpecialists,
  ...enConditions,
  ...enDiagnostics,
  ...enSymptoms,
  ...enLocations,
  ...enDistricts,
  ...enPalamu,
  ...enInfo,
  ...enDoctors,
];

export const allHiPages: SeoPage[] = [
  ...hiSpecialists,
  ...hiConditions,
  ...hiDiagnostics,
  ...hiSymptoms,
  ...hiLocations,
  ...hiDistricts,
  ...hiPalamu,
  ...hiInfo,
  ...hiDoctors,
];

const seoPageMapByEn = new Map<string, SeoPage>(
  allEnPages.map((p) => [p.slug, p])
);

const seoPageMapByHi = new Map<string, SeoPage>(
  allHiPages.map((p) => [p.slug, p])
);

// Cross-reference maps: en slug ↔ hi slug (explicit mapping from pre-generated maps file)
const rawMaps = slugMaps as { enToHi: Record<string, string>; hiToEn: Record<string, string> };
export const enToHiSlug = new Map(Object.entries(rawMaps.enToHi));
export const hiToEnSlug = new Map(Object.entries(rawMaps.hiToEn));

export function getSeoPage(slug: string, lang: string = "en"): SeoPage | undefined {
  if (lang === "hi") return seoPageMapByHi.get(slug);
  return seoPageMapByEn.get(slug);
}

export function resolveSlug(englishSlug: string, lang: string): string {
  if (lang === "en") return englishSlug;
  return enToHiSlug.get(englishSlug) ?? englishSlug;
}

export function getEnSlug(hiSlug: string): string {
  return hiToEnSlug.get(hiSlug) ?? hiSlug;
}

export function getAllSlugs(lang?: string): string[] {
  if (lang === "hi") return allHiPages.map((p) => p.slug);
  return allEnPages.map((p) => p.slug);
}

export function getPagesByCategory(category: SeoPageCategory, lang: string = "en"): SeoPage[] {
  const pages = lang === "hi" ? allHiPages : allEnPages;
  return pages.filter((p) => p.category === category);
}

export function getRelatedPages(
  slugs: string[],
  lang: string = "en"
): { slug: string; title: string }[] {
  return slugs
    .map((slug) => {
      if (lang === "hi") {
        const hiSlug = enToHiSlug.get(slug) ?? slug;
        const page = seoPageMapByHi.get(hiSlug);
        if (page) return { slug: hiSlug, title: page.title };
      }
      const page = seoPageMapByEn.get(slug);
      if (!page) return null;
      return { slug: page.slug, title: page.title };
    })
    .filter((p): p is { slug: string; title: string } => p !== null);
}

export function getAllKeywords(): string[] {
  return [...new Set(allEnPages.flatMap((p) => p.keywords))];
}

const countByCategory = (arr: SeoPage[], category: SeoPageCategory) =>
  arr.filter((p) => p.category === category).length;

export function getPageCounts(lang: string = "en"): Record<SeoPageCategory, number> {
  const pages = lang === "hi" ? allHiPages : allEnPages;
  return {
    specialist: countByCategory(pages, "specialist"),
    condition: countByCategory(pages, "condition"),
    diagnostic: countByCategory(pages, "diagnostic"),
    symptom: countByCategory(pages, "symptom"),
    location: countByCategory(pages, "location"),
    info: countByCategory(pages, "info"),
    doctor: countByCategory(pages, "doctor"),
  };
}
