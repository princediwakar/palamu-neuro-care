import { getGalleryImages } from "@/utils/getGalleryImages";
import GalleryPage from "./Gallery";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "gallery" });
  return {
    title: { absolute: t("title") },
    description: t("subtitle"),
    alternates: {
      canonical: lang === "hi" ? "https://www.palamuneurocare.com/hi/gallery" : "https://www.palamuneurocare.com/gallery",
      languages: {
        en: "https://www.palamuneurocare.com/gallery",
        hi: "https://www.palamuneurocare.com/hi/gallery",
      },
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  setRequestLocale(lang);
  const images = await getGalleryImages();
  return <GalleryPage images={images} />;
}