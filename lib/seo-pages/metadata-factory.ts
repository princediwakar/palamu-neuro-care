import { Metadata } from "next";
import { SeoPage, SpecialistSeoPage, DoctorSeoPage, Clinician, ConditionSeoPage, DiagnosticSeoPage, SymptomSeoPage } from "./types";
import { CLINIC, DOCTORS } from "./constants";
import { enToHiSlug, hiToEnSlug } from "./registry";
import { getContentDates } from "./content-dates";
import { getPlainText } from "@/components/seo/section-content";

interface JsonLdBase {
  "@context": "https://schema.org";
  "@type": string;
}

interface MedicalClinicLd extends JsonLdBase {
  "@type": "MedicalClinic";
  "@id": string;
  name: string;
  url: string;
  logo: string;
  telephone: string;
  email: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  openingHours: string;
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }[];
  alternateName: string;
  areaServed: { "@type": "Place"; name: string }[];
  image: { "@type": "ImageObject"; url: string; caption: string };
  sameAs: string[];
  hasMap: { "@type": "Map"; url: string };
  identifier: { "@type": "PropertyValue"; propertyID: string; value: string };
  author: { "@type": "Person"; name: string; url: string };
}

function getClinicianPerson(clinician: Clinician, lang: string = "en"): { "@type": "Person"; name: string; url: string } {
  const doctor = clinician === "dr-lahre" ? DOCTORS.lahre
    : clinician === "dr-prabha" ? DOCTORS.prabha : null;
  if (doctor) {
    const slug = lang === "hi" ? (enToHiSlug.get(doctor.slug) ?? doctor.slug) : doctor.slug;
    const prefix = lang === "hi" ? "/hi" : "";
    return { "@type": "Person", name: doctor.name, url: `${CLINIC.url}${prefix}/${slug}` };
  }
  return { "@type": "Person", name: CLINIC.name, url: CLINIC.url };
}

function getDoctorFromPage(page: SpecialistSeoPage | DoctorSeoPage) {
  if (page.doctorName.includes("Lahre")) return DOCTORS.lahre;
  if (page.doctorName.includes("Prabha")) return DOCTORS.prabha;
  return null;
}

function getSchemaDates(slug: string) {
  const dates = getContentDates(slug);
  const result: Record<string, string> = {};
  if (dates.datePublished) result.datePublished = dates.datePublished;
  if (dates.dateModified) result.dateModified = dates.dateModified;
  return result;
}

function getBreadcrumbLd(slug: string, title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...getSchemaDates(slug),
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: CLINIC.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: `${CLINIC.url}/${slug}`,
      },
    ],
  };
}

function getFaqLd(faqs: { question: string; answer: string }[], clinician: Clinician, slug: string, lang: string = "en") {
  const author = getClinicianPerson(clinician, lang);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...getSchemaDates(slug),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
        author,
      },
    })),
  };
}

function getPhysicianLd(page: SpecialistSeoPage | DoctorSeoPage) {
  const doctor = getDoctorFromPage(page);
  const profileUrl = doctor ? `${CLINIC.url}/${doctor.slug}` : undefined;

  const description =
    page.category === "doctor"
      ? (page as DoctorSeoPage).bio
      : (page as SpecialistSeoPage).specialistIntro;

  const education =
    page.category === "doctor" ? (page as DoctorSeoPage).education : [];

  const qualifications =
    page.category === "doctor"
      ? (page as DoctorSeoPage).qualifications
      : (page as SpecialistSeoPage).doctorQualifications;

  const specializations =
    page.category === "doctor"
      ? (page as DoctorSeoPage).specializations
      : [(page as SpecialistSeoPage).specialistType];

  const mapsLink =
    doctor === DOCTORS.lahre ? CLINIC.maps.lahre
    : doctor === DOCTORS.prabha ? CLINIC.maps.prabha
    : CLINIC.mapsUrl;
  const sameAs: string[] = [CLINIC.social.facebook, CLINIC.social.instagram, mapsLink];

  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": profileUrl,
    ...getSchemaDates(page.slug),
    name: page.doctorName,
    url: profileUrl,
    image: `${CLINIC.url}${page.doctorImage}`,
    description,
    medicalSpecialty:
      page.category === "doctor"
        ? (page as DoctorSeoPage).specializations[0]
        : (page as SpecialistSeoPage).specialistType,
    sameAs,
    alumniOf: education.map((e) => ({
      "@type": "CollegeOrUniversity",
      name: e.institution,
    })),
    hasCredential: (Array.isArray(qualifications) ? qualifications : [qualifications]).map(
      (q) => ({ "@type": "EducationalOccupationalCredential", name: q }),
    ),
    knowsAbout: specializations.map((s) => ({
      "@type": "MedicalCondition",
      name: s,
    })),
    parentOrganization: {
      "@type": "MedicalClinic",
      "@id": `${CLINIC.url}/#clinic`,
      name: CLINIC.name,
      url: CLINIC.url,
    },
    affiliation: {
      "@type": "MedicalClinic",
      name: CLINIC.name,
      url: CLINIC.url,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: CLINIC.address.street,
      addressLocality: CLINIC.address.city,
      addressRegion: CLINIC.address.state,
      postalCode: CLINIC.address.postalCode,
      addressCountry: CLINIC.address.country,
    },
    telephone: CLINIC.phone,
    author: getClinicianPerson(page.clinician, "en"),
  };
}

function getMedicalConditionLd(page: SeoPage, lang: string) {
  const conditionPage = page as ConditionSeoPage;
  const name =
    "conditionName" in page ? conditionPage.conditionName : page.title;
  const loc =
    lang === "hi" ? "में आमतौर पर इलाज किया जाता है" : "Commonly treated at";

  return {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    "@id": `${CLINIC.url}/${page.slug}`,
    ...getSchemaDates(page.slug),
    name,
    url: `${CLINIC.url}/${page.slug}`,
    description: getPlainText(conditionPage.whatIsIt),
    epidemiology: `${loc} ${CLINIC.name}, ${CLINIC.address.city}, ${CLINIC.address.state}.`,
    possibleSymptom: conditionPage.symptoms || [],
    associatedAnatomy: conditionPage.parentDepartment
      ? { "@type": "AnatomicalStructure", name: conditionPage.parentDepartment }
      : undefined,
    possibleTreatment: (conditionPage.treatmentApproach?.methods || []).map(
      (m) => ({ "@type": "MedicalTherapy", name: m.name }),
    ),
    author: getClinicianPerson(page.clinician, lang),
  };
}

function getMedicalProcedureLd(page: SeoPage, lang: string) {
  const procPage = page as DiagnosticSeoPage;
  const name = "testName" in page ? procPage.testName : page.title;
  const loc =
    lang === "hi" ? "पर किया जाता है" : "Performed at";

  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${CLINIC.url}/${page.slug}`,
    ...getSchemaDates(page.slug),
    name,
    url: `${CLINIC.url}/${page.slug}`,
    description: getPlainText(procPage.whatIsIt),
    howPerformed: `${loc} ${CLINIC.name}, ${CLINIC.address.city}, ${CLINIC.address.state}.`,
    preparation: (procPage.preparation || []).map((p) => ({
      "@type": "MedicalGuideline",
      name: p,
    })),
    author: getClinicianPerson(page.clinician, lang),
  };
}

function getMedicalSignOrSymptomLd(page: SeoPage, lang: string) {
  const name =
    "symptomName" in page ? (page as SymptomSeoPage).symptomName : page.title;
  const loc =
    lang === "hi" ? "में आमतौर पर इलाज किया जाता है" : "Commonly treated at";

  return {
    "@context": "https://schema.org",
    "@type": "MedicalSignOrSymptom",
    "@id": `${CLINIC.url}/${page.slug}`,
    ...getSchemaDates(page.slug),
    name,
    url: `${CLINIC.url}/${page.slug}`,
    description: page.metaDescription,
    possibleTreatment: `${loc} ${CLINIC.name}, ${CLINIC.address.city}, ${CLINIC.address.state}.`,
    author: getClinicianPerson(page.clinician, lang),
  };
}

function getClinicLd(clinician?: Clinician): MedicalClinicLd {
  const mapsSameAs =
    clinician === "dr-lahre" ? CLINIC.maps.lahre
    : clinician === "dr-prabha" ? CLINIC.maps.prabha
    : CLINIC.mapsUrl;

  const clinicLd: MedicalClinicLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${CLINIC.url}/#clinic`,
    name: CLINIC.name,
    url: CLINIC.url,
    logo: CLINIC.logo,
    telephone: CLINIC.phone,
    email: CLINIC.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CLINIC.address.street,
      addressLocality: CLINIC.address.city,
      addressRegion: CLINIC.address.state,
      postalCode: CLINIC.address.postalCode,
      addressCountry: CLINIC.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CLINIC.geo.latitude,
      longitude: CLINIC.geo.longitude,
    },
    openingHours: CLINIC.hours.full,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "20:00",
      },
    ],
    alternateName: CLINIC.alternateName,
    areaServed: CLINIC.serviceRegions.map((r) => ({ "@type": "Place" as const, name: r })),
    image: {
      "@type": "ImageObject",
      url: CLINIC.logo,
      caption: `${CLINIC.name} Logo`,
    },
    sameAs: [CLINIC.social.facebook, CLINIC.social.instagram, mapsSameAs],
    hasMap: {
      "@type": "Map",
      url: `https://www.google.com/maps/place/?q=place_id:${CLINIC.placeId}`,
    },
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Google Place ID",
      value: CLINIC.placeId,
    },
    author: getClinicianPerson(clinician ?? "both", "en"),
  };
  return clinicLd;
}

export function generateJsonLd(page: SeoPage, lang: string = "en"): object[] {
  const slug = page.slug;
  const title = page.title;
  const blocks: object[] = [
    getClinicLd(page.clinician),
    getBreadcrumbLd(slug, title),
  ];

  if (page.faqs.length > 0) {
    blocks.push(getFaqLd(page.faqs, page.clinician, slug, lang));
  }

  if (page.category === "symptom") {
    blocks.push(getMedicalSignOrSymptomLd(page, lang));
  } else {
    switch (page.jsonLdType) {
      case "Physician":
        blocks.push(getPhysicianLd(page as SpecialistSeoPage | DoctorSeoPage));
        break;
      case "MedicalCondition":
        blocks.push(getMedicalConditionLd(page, lang));
        break;
      case "MedicalProcedure":
        blocks.push(getMedicalProcedureLd(page, lang));
        break;
    }
  }

  return blocks;
}

export function generateMetadata(page: SeoPage, lang: string = "en"): Metadata {
  const slug = page.slug;
  const metaTitle = page.metaTitle;
  const metaDescription = page.metaDescription;
  const keywords = page.keywords;

  const isHi = lang === "hi";
  const enSlug = isHi ? (hiToEnSlug.get(slug) ?? slug) : slug;
  const hiSlug = isHi ? slug : (enToHiSlug.get(slug) ?? slug);

  const enUrl = `${CLINIC.url}/${enSlug}`;
  const hiUrl = `${CLINIC.url}/hi/${hiSlug}`;

  const contentDates = getContentDates(slug);
  const otherMeta: Record<string, string> = {};
  if (contentDates.datePublished) otherMeta["article:published_time"] = contentDates.datePublished;
  if (contentDates.dateModified) otherMeta["article:modified_time"] = contentDates.dateModified;

  return {
    title: {
      absolute: metaTitle,
    },
    description: metaDescription,
    keywords,
    alternates: {
      canonical: isHi ? hiUrl : enUrl,
      languages: {
        en: enUrl,
        hi: hiUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: isHi ? hiUrl : enUrl,
      siteName: CLINIC.name,
      type: "website",
      locale: isHi ? "hi_IN" : "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: otherMeta,
  };
}
