import { enToHiSlug, getSeoPage, resolveSlug } from "./registry";

interface FeaturedPage {
  slug: string;
  title: string;
  shortName: string;
  label: string;
  department: "neurology" | "ophthalmology";
}

function resolve(slugs: string[], lang: string = "en"): FeaturedPage[] {
  return slugs
    .map((slug) => {
      const lookupSlug = lang === "hi" ? enToHiSlug.get(slug) ?? slug : slug;
      const page = getSeoPage(lookupSlug, lang);
      if (!page) return null;
      const resolvedSlug = resolveSlug(slug, lang);
      const department =
        page.category === "condition" && "parentDepartment" in page
          ? (page as { parentDepartment: string }).parentDepartment as "neurology" | "ophthalmology"
          : "neurology";
      return {
        slug: resolvedSlug,
        title: page.title,
        shortName: "conditionName" in page ? (page as { conditionName: string }).conditionName : page.title,
        label: page.hero.label,
        department,
      };
    })
    .filter((p): p is FeaturedPage => p !== null);
}

const homepageSlugs = [
  "migraine-treatment-in-palamu",
  "epilepsy-treatment-in-palamu",
  "stroke-rehabilitation-in-palamu",
  "parkinsons-disease-treatment-in-palamu",
  "spine-treatment-in-palamu",
  "cataract-surgery-in-palamu",
  "glaucoma-treatment-in-palamu",
  "diabetic-retinopathy-treatment-in-palamu",
  "retinal-detachment-surgery-in-palamu",
  "macular-degeneration-treatment-in-palamu",
];

const footerSpecialistSlugs = [
  "neurologist-in-palamu",
  "best-neurologist-in-palamu",
  "brain-doctor-in-palamu",
  "ophthalmologist-in-palamu",
  "eye-doctor-in-palamu",
  "retina-specialist-in-palamu",
];

const footerNeuroSlugs = [
  "migraine-treatment-in-palamu",
  "epilepsy-treatment-in-palamu",
  "stroke-rehabilitation-in-palamu",
  "spine-treatment-in-palamu",
  "parkinsons-disease-treatment-in-palamu",
  "neuropathy-treatment-in-palamu",
];

const footerEyeSlugs = [
  "cataract-surgery-in-palamu",
  "glaucoma-treatment-in-palamu",
  "diabetic-retinopathy-treatment-in-palamu",
  "retinal-detachment-surgery-in-palamu",
  "macular-degeneration-treatment-in-palamu",
];

export function getFeaturedHomepageConditions(lang: string = "en"): FeaturedPage[] {
  return resolve(homepageSlugs, lang);
}

export function getFeaturedFooterSpecialists(lang: string = "en"): FeaturedPage[] {
  return resolve(footerSpecialistSlugs, lang);
}

export function getFeaturedFooterNeuroConditions(lang: string = "en"): FeaturedPage[] {
  return resolve(footerNeuroSlugs, lang);
}

export function getFeaturedFooterEyeConditions(lang: string = "en"): FeaturedPage[] {
  return resolve(footerEyeSlugs, lang);
}
