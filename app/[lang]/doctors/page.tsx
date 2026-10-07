import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { PageHeader } from "@/components/shared/page-header";
import Image from "next/image";
import Link from "next/link";
import CTA from "@/components/sections/cta";
import { getTranslations } from "next-intl/server";
import { resolveSlug } from "@/lib/seo-pages/registry";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "doctors" });
  return {
    title: { absolute: t("title") },
    description: t("subtitle"),
    alternates: {
      canonical: lang === "hi" ? "https://www.palamuneurocare.com/hi/doctors" : "https://www.palamuneurocare.com/doctors",
      languages: {
        en: "https://www.palamuneurocare.com/doctors",
        hi: "https://www.palamuneurocare.com/hi/doctors",
      },
    },
  };
}

export default async function DoctorsPage({ params }: PageProps) {
  const { lang } = await params;
  const t = await getTranslations("doctors");

  return (
    <section className="bg-background">
      <MaxWidthWrapper className="py-24 sm:py-32 space-y-32 lg:py-40">
        <PageHeader
          label={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">{t("missionTitle")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("missionText1")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("missionText2")}
            </p>
          </div>
          <div className="relative h-64 sm:h-96 rounded-lg overflow-hidden">
            <Image
              src="/_static/illustrations/care.jpg"
              alt="Palamu Neuro & Eye Care Exterior"
              fill
              sizes="(max-width: 640px) calc(100vw - 48px), 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-16">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="relative h-full rounded-lg overflow-hidden">
              <Image
                src="/_static/illustrations/yuvraj.jpeg"
                alt={t("lahreName")}
                fill
                sizes="(max-width: 640px) calc(100vw - 48px), 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">{t("lahreName")}</h2>
              <p className="text-muted-foreground">{t("lahreQualifications")}</p>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-foreground">{t("educationAndTraining")}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 bg-secondary/30 rounded-lg">
                    <h5 className="font-medium text-foreground">{t("degreeMBBS")}</h5>
                    <p className="mt-1 text-sm text-muted-foreground">{t("lahreInstitution1")}</p>
                  </div>
                  <div className="p-6 bg-secondary/30 rounded-lg">
                    <h5 className="font-medium text-foreground">{t("lahreDegree2")}</h5>
                    <p className="mt-1 text-sm text-muted-foreground">{t("lahreInstitution2")}</p>
                  </div>
                  <div className="p-6 bg-secondary/30 rounded-lg">
                    <h5 className="font-medium text-foreground">{t("lahreDegree3")}</h5>
                    <p className="mt-1 text-sm text-muted-foreground">{t("lahreInstitution3")}</p>
                  </div>
                  <div className="p-6 bg-secondary/30 rounded-lg">
                    <h5 className="font-medium text-foreground">{t("lahreAchievement1Title")}</h5>
                    <p className="mt-1 text-sm text-muted-foreground">{t("lahreAchievement1Desc")}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-foreground">{t("achievements")}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 bg-secondary/30 rounded-lg">
                    <h5 className="font-medium text-foreground">{t("lahreAchievement2Title")}</h5>
                    <p className="mt-1 text-sm text-muted-foreground">{t("lahreAchievement2Desc")}</p>
                  </div>
                  <div className="p-6 bg-secondary/30 rounded-lg">
                    <h5 className="font-medium text-foreground">{t("lahreAchievement3Title")}</h5>
                    <p className="mt-1 text-sm text-muted-foreground">{t("lahreAchievement3Desc")}</p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {t("lahreBio")}
              </p>
              <Link
                href={lang === "hi" ? `/hi/${resolveSlug("dr-yuvraj-lahre-neurologist-palamu", "hi")}` : `/dr-yuvraj-lahre-neurologist-palamu`}
                className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t("viewFullProfile")}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="relative h-full rounded-lg overflow-hidden">
              <Image
                src="/_static/illustrations/dibya.jpeg"
                alt={t("prabhaName")}
                fill
                sizes="(max-width: 640px) calc(100vw - 48px), 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">{t("prabhaName")}</h2>
              <p className="text-muted-foreground">{t("prabhaQualifications")}</p>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-foreground">{t("educationAndTraining")}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 bg-secondary/30 rounded-lg">
                    <h5 className="font-medium text-foreground">{t("degreeMBBS")}</h5>
                    <p className="mt-1 text-sm text-muted-foreground">{t("prabhaInstitution1")}</p>
                  </div>
                  <div className="p-6 bg-secondary/30 rounded-lg">
                    <h5 className="font-medium text-foreground">{t("prabhaDegree2")}</h5>
                    <p className="mt-1 text-sm text-muted-foreground">{t("prabhaInstitution2")}</p>
                  </div>
                  <div className="p-6 bg-secondary/30 rounded-lg">
                    <h5 className="font-medium text-foreground">{t("prabhaDegree3")}</h5>
                    <p className="mt-1 text-sm text-muted-foreground">{t("prabhaInstitution3")}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-foreground">{t("specializations")}</h4>
                <ul className="space-y-3 text-muted-foreground">
                  {(t.raw("prabhaSpecializations") as string[]).map((s, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-3 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400"></span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {t("prabhaBio")}
              </p>
              <Link
                href={lang === "hi" ? `/hi/${resolveSlug("dr-dibya-prabha-ophthalmologist-palamu", "hi")}` : `/dr-dibya-prabha-ophthalmologist-palamu`}
                className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t("viewFullProfile")}
              </Link>
            </div>
          </div>
        </div>

      </MaxWidthWrapper>
      <CTA lang={lang} />
    </section>
  );
}
