import BookAppointmentBtn from "../BookAppointmentBtn";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { getTranslations } from "next-intl/server";

export default async function CTA({ lang }: { lang?: string }) {
  const t = await getTranslations("sections.cta");
  return (
    <section className="py-20 w-full relative mt-16 overflow-hidden">
      <div className="absolute inset-0 w-screen left-1/2 -translate-x-1/2 bg-zinc-100 dark:bg-zinc-900 border-y border-border" />
      <div className="relative z-10">
        <MaxWidthWrapper>
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
              {t("heading")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("description")}
            </p>
            <div className="mt-8">
              <BookAppointmentBtn buttonText={t("buttonText")} />
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  );
}
