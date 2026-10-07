import BookAppointmentBtn from "../BookAppointmentBtn";
import HeroCarousel from "./hero-carousel";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { getTranslations } from "next-intl/server";
import hero1 from "@/public/_static/illustrations/hero1.jpg";
import hero2 from "@/public/_static/illustrations/hero2.jpg";
import hero3 from "@/public/_static/illustrations/hero3.jpg";

export default async function HeroLanding({ lang }: { lang?: string }) {
  const t = await getTranslations("sections.hero");
  const images = [hero1, hero2, hero3];

  const heading = t.rich("heading", {
    highlight: (chunks) => <span className="text-primary">{chunks}</span>
  });

  const slideLabels = [t("slideLabels.0"), t("slideLabels.1"), t("slideLabels.2")];

  return (
    <section className="relative py-12 sm:py-16 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800"></div>
      </div>
      <MaxWidthWrapper className="flex flex-col items-center gap-6 lg:flex-row lg:gap-8 lg:items-center">
        <div className="space-y-8 lg:w-1/2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl break-words">
            {heading}
          </h1>
          <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
            {t("description")}
          </p>
          <p className="max-w-lg text-sm text-foreground sm:text-base">
            {t("trustBadge")}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <BookAppointmentBtn buttonText={t("bookButton")}/>
          </div>
        </div>
        <div className="w-full max-w-md lg:w-1/2 lg:max-w-none">
          <HeroCarousel images={images} slideLabels={slideLabels} />
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
