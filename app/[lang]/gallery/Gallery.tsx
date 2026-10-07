"use client"
import { useState } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { useTranslations } from "next-intl";

interface ImageType {
  src: string;
  alt: string;
  width: number;
  height: number;
  createdAt: Date;
}

interface GalleryPageProps {
  images: ImageType[];
}

export default function GalleryPage({ images }: GalleryPageProps) {
  const [visibleImages, setVisibleImages] = useState(6);
  const t = useTranslations("gallery");
  const common = useTranslations("common");

  const sortedImages = [...images].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const loadMoreImages = () => {
    setVisibleImages((prev) => prev + 6);
  };

  return (
    <section className="bg-background">
      <MaxWidthWrapper className="py-24 sm:py-32 space-y-32 lg:py-40">
        <PageHeader
          label={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sortedImages.slice(0, visibleImages).map((image, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden transition-all duration-500 hover:opacity-90"
              style={{ width: "100%", height: "400px" }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                sizes="(max-width: 639px) 100vw, 50vw"
                className="w-full h-full object-cover"
                priority={index < 3}
              />
            </div>
          ))}
        </div>
        {visibleImages < sortedImages.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMoreImages}
              className="px-8 py-3 bg-primary text-primary-foreground text-sm font-medium uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all duration-300"
            >
              {common("loadMore")}
            </button>
          </div>
        )}
      </MaxWidthWrapper>
    </section>
  );
}
