"use client";
import dynamic from "next/dynamic";
import SectionSkeleton from "./section-skeleton";

interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  createdAt: Date;
}

const GalleryCarousel = dynamic(() => import("./GalleryCarousel"), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

export default function GalleryLazy({ images, lang }: { images: GalleryImage[]; lang?: string }) {
  return <GalleryCarousel images={images} lang={lang} />;
}
