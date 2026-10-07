"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselApi, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  lang?: string;
}

export default function GalleryCarousel({ images, lang }: GalleryPageProps) {
  const [api, setApi] = useState<CarouselApi>();
  const t = useTranslations("gallery");
  const common = useTranslations("common");
  const sortedImages = [...images].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [api]);

  const prefix = lang === "hi" ? "/hi" : "";

  return (
    <section className="py-12 sm:py-16 lg:py-20 ">
      <MaxWidthWrapper>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">{t("title")}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {sortedImages.map((image, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="relative h-[250px] sm:h-[350px] lg:h-[400px]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={800}
                    height={400}
                    className="rounded-xl shadow-lg object-cover w-full h-full"
                    priority={index < 2}
                    sizes="(max-width: 767px) 100vw, 50vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="flex justify-center mt-8">
          <Link href={`${prefix}/gallery`}>
            <Button variant="outline" className="text-lg px-8 py-6 rounded-4xl cursor-pointer">
              {common("loadMore")}
            </Button>
          </Link>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
