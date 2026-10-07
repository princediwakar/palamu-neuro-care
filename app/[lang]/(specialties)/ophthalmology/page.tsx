import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { PageHeader } from "@/components/shared/page-header";
import { Camera, Check, Clock, Eye, Pill, Search, ShieldCheck, Stethoscope, Syringe, Target, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ophthalmologyIconMap: Record<string, LucideIcon> = {
  users: Users,
  clock: Clock,
  check: Check,
  eye: Eye,
  search: Search,
  syringe: Syringe,
  target: Target,
  zap: Zap,
  camera: Camera,
  shieldCheck: ShieldCheck,
  pill: Pill,
  stethoscope: Stethoscope,
};
import CTA from "@/components/sections/cta";
import ConditionCard from "@/components/seo/condition-card";
import { getPlainText } from "@/components/seo/section-content";
import { getPagesByCategory, getSeoPage, resolveSlug } from "@/lib/seo-pages/registry";
import { CLINIC } from "@/lib/seo-pages/constants";
import type { ConditionSeoPage, DiagnosticSeoPage, DoctorSeoPage, SpecialistSeoPage, SymptomSeoPage } from "@/lib/seo-pages/types";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "pages.ophthalmology" });
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
  };
}

type Service = { name: string; details: string; benefits: string[] };
type Department = { title: string; description: string; services: Service[] };

const OPHTHALMOLOGY_SERVICE_SLUGS: string[][] = [
  [
    "diabetic-retinopathy-treatment-in-palamu",
    "retinal-laser-treatment-in-palamu",
    "vitrectomy-in-palamu",
    "cataract-surgery-in-palamu",
    "fundus-photography-in-palamu",
    "oct-scan-in-palamu",
    "octa-scan-in-palamu",
    "retinal-detachment-surgery-in-palamu",
    "endophthalmitis-treatment-in-palamu",
    "macular-hole-surgery-in-palamu",
    "armd-treatment-in-palamu",
    "ocular-oncology-in-palamu",
  ],
  [
    "oct-scan-in-palamu",
    "visual-field-testing-in-palamu",
  ],
];

const FEATURED_OPHTHALMOLOGY_SLUGS = [
  "dr-dibya-prabha-ophthalmologist-palamu",
];

function getDepartmentJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      "@id": `${CLINIC.url}/ophthalmology#clinic`,
      name: `${CLINIC.name} - Ophthalmology Department`,
      url: `${CLINIC.url}/ophthalmology`,
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
      medicalSpecialty: "Ophthalmology",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: CLINIC.url },
        { "@type": "ListItem", position: 2, name: "Ophthalmology", item: `${CLINIC.url}/ophthalmology` },
      ],
    },
  ];
}

export default async function OphthalmologyPage({ params }: PageProps) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "pages.ophthalmology" });
  const departments = t.raw("departments") as unknown as Department[];

  const allConditions = getPagesByCategory("condition", lang) as ConditionSeoPage[];
  const ophthalmologyConditions = allConditions.filter(
    (c) => c.parentDepartment === "ophthalmology"
  );

  const allDiagnostics = getPagesByCategory("diagnostic", lang) as DiagnosticSeoPage[];
  const ophthalmologyDiagnostics = allDiagnostics.filter(
    (d) => d.parentDepartment === "ophthalmology" || d.parentDepartment === "both"
  );

  const allSymptoms = getPagesByCategory("symptom", lang) as SymptomSeoPage[];
  const ophthalmologySymptoms = allSymptoms.filter(
    (s) => s.clinician === "dr-prabha"
  );

  const featuredSpecialists = FEATURED_OPHTHALMOLOGY_SLUGS.map((slug) => {
    const lookupSlug = lang === "hi" ? resolveSlug(slug, "hi") : slug;
    const page = getSeoPage(lookupSlug, lang) as any;
    if (!page) return null;
    return {
      slug: resolveSlug(slug, lang),
      name: page.doctorName || page.title,
      image: page.doctorImage || undefined,
      qualifications: page.doctorQualifications || (page.qualifications ? [page.qualifications] : []),
      intro: page.specialistIntro || page.bio || "",
    };
  }).filter(Boolean) as {
    slug: string;
    name: string;
    image?: string;
    qualifications: string[];
    intro: string;
  }[];

  const jsonLdBlocks = getDepartmentJsonLd();

  return (
    <section className="">
      <MaxWidthWrapper className="py-12 sm:py-16 space-y-24 lg:py-20">
        <PageHeader
          label={t("headerLabel")}
          title={t("headerTitle")}
          subtitle={t("headerSubtitle")}
        />

        {/* Stats Banner */}
        <div className="grid grid-cols-3 gap-6 sm:gap-8">
          {[
            { icon: "users" as const, value: t("stats.patientsTreated"), label: t("stats.patientsTreatedLabel") },
            { icon: "clock" as const, value: t("stats.experience"), label: t("stats.experienceLabel") },
            { icon: "check" as const, value: t("stats.successRate"), label: t("stats.successRateLabel") },
          ].map((stat, i) => {
            const StatIcon = ophthalmologyIconMap[stat.icon] || Eye;
            return (
              <div
                key={i}
                className="text-center p-6 bg-card border border-border rounded-xl"
              >
                <StatIcon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Departments & Services */}
        <div className="space-y-12">
          {departments.map((dept, index) => {
            const deptIcons = ["eye", "search"] as const;
            const Icon = ophthalmologyIconMap[deptIcons[index]] || Eye;
            return (
              <div key={index} className="relative">
                <div className="absolute left-5 top-0 h-full w-0.5 bg-border" aria-hidden="true" />
                <div className="relative pl-16">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{dept.title}</h2>
                  <p className="mt-2 text-muted-foreground">{dept.description}</p>
                  <div className="mt-6 space-y-4">
                    {dept.services.map((svc, subIndex) => {
                      const subIcons = [
                        "syringe", "target", "zap", "eye", "camera", "eye",
                        "eye", "eye", "shieldCheck", "eye", "pill", "stethoscope",
                        "eye", "eye",
                      ];
                      const SubIcon = ophthalmologyIconMap[subIcons[subIndex]] || Eye;
                      const slug = OPHTHALMOLOGY_SERVICE_SLUGS[index]?.[subIndex];
                      const resolvedSlug = slug ? resolveSlug(slug, lang) : null;
                      const href = resolvedSlug
                        ? lang === "hi" ? `/hi/${resolvedSlug}` : `/${resolvedSlug}`
                        : null;

                      return (
                        <div
                          key={subIndex}
                          className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border hover:border-primary/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <SubIcon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground">{svc.name}</h3>
                          </div>
                          <p className="mt-2 text-muted-foreground">{svc.details}</p>
                          <div className="mt-4 space-y-2">
                            <h4 className="text-lg font-semibold text-foreground">{t("keyBenefits")}</h4>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {svc.benefits.map((benefit, bi) => (
                                <li key={bi}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                          {href && (
                            <Link
                              href={href}
                              className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                              {t("learnMore")}
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Common Conditions */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
            {t("commonConditions.heading")}
          </h2>
          <p className="mt-3 text-muted-foreground text-center max-w-2xl mx-auto">
            {t("commonConditions.subtitle")}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ophthalmologyConditions.map((c) => (
              <ConditionCard
                key={c.slug}
                condition={{ name: c.conditionName, description: getPlainText(c.whatIsIt), slug: c.slug }}
                lang={lang}
                resolvedSlug={resolveSlug(c.slug, lang)}
              />
            ))}
          </div>
        </div>

        {/* Diagnostic Tests */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
            {t("diagnosticTests.heading")}
          </h2>
          <p className="mt-3 text-muted-foreground text-center max-w-2xl mx-auto">
            {t("diagnosticTests.subtitle")}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ophthalmologyDiagnostics.map((d) => (
              <ConditionCard
                key={d.slug}
                condition={{ name: d.testName, description: getPlainText(d.whatIsIt), slug: d.slug }}
                lang={lang}
                resolvedSlug={resolveSlug(d.slug, lang)}
              />
            ))}
          </div>
        </div>

        {/* Common Symptoms */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
            {t("commonSymptoms.heading")}
          </h2>
          <p className="mt-3 text-muted-foreground text-center max-w-2xl mx-auto">
            {t("commonSymptoms.subtitle")}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ophthalmologySymptoms.map((s) => (
              <ConditionCard
                key={s.slug}
                condition={{ name: s.symptomName, description: s.hero.subtitle, slug: s.slug }}
                lang={lang}
                resolvedSlug={resolveSlug(s.slug, lang)}
              />
            ))}
          </div>
        </div>

        {/* Meet Our Specialists */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
            {t("meetOurSpecialists.heading")}
          </h2>
          <p className="mt-3 text-muted-foreground text-center max-w-2xl mx-auto">
            {t("meetOurSpecialists.subtitle")}
          </p>
          <div className="mt-8 flex justify-center gap-6">
            {featuredSpecialists.map((specialist) => {
              const href = lang === "hi" ? `/hi/${specialist.slug}` : `/${specialist.slug}`;
              return (
                <Link
                  key={specialist.slug}
                  href={href}
                  className="block p-6 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-md transition-all group"
                >
                  {specialist.image && (
                    <Image
                      src={specialist.image}
                      alt={specialist.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-primary/20"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-foreground text-center group-hover:text-primary transition-colors">
                    {specialist.name}
                  </h3>
                  {specialist.qualifications.length > 0 && (
                    <p className="mt-2 text-sm text-muted-foreground text-center">
                      {specialist.qualifications[0]}
                    </p>
                  )}
                  {specialist.intro && (
                    <p className="mt-3 text-sm text-muted-foreground text-center line-clamp-3">
                      {specialist.intro}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary group-hover:text-primary/80 transition-colors justify-center w-full">
                    {t("learnMore")}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </MaxWidthWrapper>

      <CTA />

      {/* JSON-LD */}
      {jsonLdBlocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </section>
  );
}
