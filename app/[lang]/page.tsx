import HeroSection from '@/components/sections/hero-section'
import StatsBar from '@/components/sections/stats-bar'
import { getGalleryImages } from '@/utils/getGalleryImages'
import MaxWidthWrapper from '@/components/shared/max-width-wrapper'
import { HeaderSection } from '@/components/shared/header-section'
import { getFeaturedHomepageConditions } from '@/lib/seo-pages/featured-pages'
import ConditionGlowCard from '@/components/seo/condition-glow-card'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import type { Metadata } from "next";

// Above fold — SSR for SEO-critical medical content
import Services from '@/components/sections/services';
import Doctors from '@/components/sections/doctors';
import Benefits from '@/components/sections/benefits';
import FAQSection from '@/components/sections/faq';

// Server components — contribute zero JS to client bundle
import Testimonials from '@/components/sections/testimonials';
import CTA from '@/components/sections/cta';

// Below fold — lazy client wrappers (interactive, loaded on scroll)
import GalleryCarousel from '@/components/sections/gallery-lazy';
import MapAddress from '@/components/sections/map-lazy';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.palamuneurocare.com";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "homepage" });
  const isHi = lang === "hi";
  const enUrl = BASE_URL;
  const hiUrl = `${BASE_URL}/hi`;

  return {
    metadataBase: new URL(BASE_URL),
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    keywords: t("metaKeywords").split(",").map((k: string) => k.trim()),
    alternates: {
      canonical: isHi ? hiUrl : enUrl,
      languages: {
        en: enUrl,
        hi: hiUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: isHi ? hiUrl : enUrl,
      siteName: "Palamu Neuro & Eye Care",
      images: [{ url: `${BASE_URL}/_static/illustrations/hero1.jpg`, width: 1200, height: 630 }],
      locale: isHi ? "hi_IN" : "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: [`${BASE_URL}/_static/illustrations/hero1.jpg`],
    },
  };
}

const HomePage = async ({ params }: { params: Promise<{ lang: string }> }) => {
  const { lang } = await params;
  const images = await getGalleryImages();
  const featuredConditions = getFeaturedHomepageConditions(lang);
  const t = await getTranslations("homepage");

  return (
    <div>
      <HeroSection lang={lang} />
      <StatsBar lang={lang} />
      <Services lang={lang} />
      <Doctors lang={lang} />
      <section className="py-12 sm:py-16 lg:py-20">
        <MaxWidthWrapper>
          <HeaderSection
            label={t("conditionsLabel")}
            title={t("conditionsTitle")}
            subtitle={t("conditionsSubtitle")}
          />

          <div className="mt-12 space-y-10">
            {[
              { dept: "neurology" as const, labelKey: "neuroHeading" },
              { dept: "ophthalmology" as const, labelKey: "eyeHeading" },
            ].map(({ dept, labelKey }) => {
              const group = featuredConditions.filter((c) => c.department === dept);
              return (
                <div key={dept}>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    {t(labelKey)}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {group.map((c) => (
                      <ConditionGlowCard key={c.slug} {...c} lang={lang} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </MaxWidthWrapper>
      </section>
      <Benefits lang={lang} />
      <Testimonials lang={lang} />
      <GalleryCarousel images={images} lang={lang} />
      <FAQSection lang={lang} />
      <MapAddress lang={lang} />
      <CTA lang={lang} />
    </div>
  )
}

export default HomePage
