import CTA from '@/components/sections/cta';
import MaxWidthWrapper from '@/components/shared/max-width-wrapper';
import { PageHeader } from '@/components/shared/page-header';
import { resolveSlug } from '@/lib/seo-pages/registry';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "videos" });
  return {
    title: { absolute: t("title") },
    description: t("subtitle"),
    alternates: {
      canonical: lang === "hi" ? "https://www.palamuneurocare.com/hi/videos" : "https://www.palamuneurocare.com/videos",
      languages: {
        en: "https://www.palamuneurocare.com/videos",
        hi: "https://www.palamuneurocare.com/hi/videos",
      },
    },
  };
}

const VIDEO_SLUGS_NEURO = [
  'stroke-rehabilitation-in-palamu',
  'spine-treatment-in-palamu',
  'neuropathy-treatment-in-palamu',
];

const VIDEO_SLUGS_EYE = [
  'conjunctivitis-treatment-in-palamu',
  'cataract-surgery-in-palamu',
  'pterygium-treatment-in-palamu',
];

function getHref(index: number, isNeuro: boolean, lang: string): string | null {
  const enSlug = isNeuro ? VIDEO_SLUGS_NEURO[index] : VIDEO_SLUGS_EYE[index];
  if (!enSlug) return null;
  const slug = resolveSlug(enSlug, lang);
  return lang === 'hi' ? `/hi/${slug}` : `/${slug}`;
}

export default async function VideosPage({ params }: PageProps) {
  const { lang } = await params;
  const t = await getTranslations("videos");

  const neuroVideosRaw = t.raw("neuroVideos") as Array<{ title: string; description: string }>;
  const eyeVideosRaw = t.raw("eyeVideos") as Array<{ title: string; description: string }>;

  const neurologyVideos = [
    { id: 'PHQze2rOGZw', ...neuroVideosRaw[0] },
    { id: 'IGuz5F72I_w', ...neuroVideosRaw[1] },
    { id: '5gXXiVRGIFQ', ...neuroVideosRaw[2] },
  ];

  const ophthalmologyVideos = [
    { id: 'KniyYGHP2g8', ...eyeVideosRaw[0] },
    { id: 'TAsI7loKaeg', ...eyeVideosRaw[1] },
    { id: 'nHxAgFrICsw', ...eyeVideosRaw[2] },
  ];

  return (
    <section className="">
      <MaxWidthWrapper className="py-12 sm:py-16 lg:py-20">
        <PageHeader
          label={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <section className="py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">{t("neuroVideosTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {neurologyVideos.map((video, i) => (
                <div
                  key={video.id}
                  className="bg-card rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
                >
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                    <p className="text-muted-foreground">{video.description}</p>
                    {(() => {
                      const href = getHref(i, true, lang);
                      return href ? (
                        <Link
                          href={href}
                          className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          {t("learnMore")}
                        </Link>
                      ) : null;
                    })()}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <a
                href="https://www.youtube.com/@dr.yuvrajneuro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-primary hover:text-white transition-colors"
              >
                {t("viewAllNeuro")}
              </a>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 space-y-24 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">{t("eyeVideosTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ophthalmologyVideos.map((video, i) => (
                <div
                  key={video.id}
                  className="bg-card rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
                >
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                    <p className="text-muted-foreground">{video.description}</p>
                    {(() => {
                      const href = getHref(i, false, lang);
                      return href ? (
                        <Link
                          href={href}
                          className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          {t("learnMore")}
                        </Link>
                      ) : null;
                    })()}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <a
                href="https://www.youtube.com/@DrDibyaPrabha"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-primary hover:text-white transition-colors"
              >
                {t("viewAllEye")}
              </a>
            </div>
          </div>
        </section>
      </MaxWidthWrapper>
      <CTA lang={lang} />
    </section>
  );
}
