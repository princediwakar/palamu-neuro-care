"use client";

import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { MapPin } from "lucide-react";
import { CLINIC } from "@/lib/seo-pages/constants";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export default function MapAddress({ lang }: { lang?: string }) {
  const t = useTranslations("sections.map");
  const common = useTranslations("common");
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/20 to-teal-50/10"
    >
      <MaxWidthWrapper>
        <HeaderSection
          label={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div ref={ref} className="mt-8 flex flex-col items-center gap-6">
          <div className="rounded-lg overflow-hidden shadow-lg w-full max-w-4xl h-[300px] sm:h-[400px] lg:h-[450px] bg-muted/20">
            {visible ? (
              <iframe
                src={CLINIC.mapsEmbedUrl}
                width="100%"
                height="100%"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Palamu Neuro & Eye Care Location"
              />
            ) : null}
          </div>
          <Link
            href={CLINIC.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full transition-all hover:bg-primary/90"
          >
            <MapPin className="h-5 w-5" />
            <span>{common("getDirections")}</span>
          </Link>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
