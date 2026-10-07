import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeoPage, getAllSlugs } from "@/lib/seo-pages/registry";
import { generateMetadata as seoMetadata } from "@/lib/seo-pages/metadata-factory";
import { getContentDates } from "@/lib/seo-pages/content-dates";

import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLdScripts from "@/components/seo/json-ld";
import ClinicInfoBar from "@/components/seo/clinic-info-bar";
import CTA from "@/components/sections/cta";

import SpecialistTemplate from "@/templates/seo/specialist-template";
import ConditionTemplate from "@/templates/seo/condition-template";
import DiagnosticTemplate from "@/templates/seo/diagnostic-template";
import SymptomTemplate from "@/templates/seo/symptom-template";
import LocationTemplate from "@/templates/seo/location-template";
import InfoTemplate from "@/templates/seo/info-template";
import DoctorTemplate from "@/templates/seo/doctor-template";

interface PageProps {
  params: Promise<{ slug: string; lang: string }>;
}

export async function generateStaticParams() {
  const allEn = getAllSlugs("en").map((slug) => ({ slug, lang: "en" }));
  const allHi = getAllSlugs("hi").map((slug) => ({ slug, lang: "hi" }));
  return [...allEn, ...allHi];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const page = getSeoPage(slug, lang);
  if (!page) return {};
  return seoMetadata(page, lang);
}

function renderTemplate(page: ReturnType<typeof getSeoPage>, lang: string) {
  if (!page) return null;
  switch (page.category) {
    case "specialist":
      return <SpecialistTemplate page={page} lang={lang} />;
    case "condition":
      return <ConditionTemplate page={page} lang={lang} />;
    case "diagnostic":
      return <DiagnosticTemplate page={page} lang={lang} />;
    case "symptom":
      return <SymptomTemplate page={page} lang={lang} />;
    case "location":
      return <LocationTemplate page={page} lang={lang} />;
    case "info":
      return <InfoTemplate page={page} lang={lang} />;
    case "doctor":
      return <DoctorTemplate page={page} lang={lang} />;
  }
}

export default async function SeoPage({ params }: PageProps) {
  const { slug, lang } = await params;
  const page = getSeoPage(slug, lang);

  if (!page) {
    notFound();
  }

  const dates = getContentDates(page.slug);

  return (
    <>
      <JsonLdScripts page={page} lang={lang} />
      <Breadcrumbs slug={page.slug} title={page.title} lang={lang} category={page.category} />
      {renderTemplate(page, lang)}

      {dates.datePublished && (
        <div className="max-w-6xl mx-auto px-4 pb-2 text-xs text-muted-foreground">
          {lang === "hi" ? "प्रकाशित" : "Published"}: {new Date(dates.datePublished).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { year: "numeric", month: "long", day: "numeric" })}
          {dates.dateModified && dates.dateModified !== dates.datePublished && (
            <> &middot; {lang === "hi" ? "अद्यतन" : "Updated"}: {new Date(dates.dateModified).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { year: "numeric", month: "long", day: "numeric" })}</>
          )}
        </div>
      )}

      <ClinicInfoBar lang={lang} />
      <CTA lang={lang} />
    </>
  );
}
