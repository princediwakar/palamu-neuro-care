import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { getTranslations } from "next-intl/server";

export default async function StatsBar({ lang }: { lang?: string }) {
  const t = await getTranslations("sections.stats");

  const stats = [
    { value: t("patients"), label: t("patientsLabel") },
    { value: t("experience"), label: t("experienceLabel") },
    { value: t("specialists"), label: t("specialistsLabel") },
    { value: t("states"), label: t("statesLabel") },
  ];

  return (
    <section className="py-16 sm:py-24 border-y border-border/50 bg-background">
      <MaxWidthWrapper>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 divide-x divide-border/50">
          {stats.map((stat, index) => (
            <div key={stat.label} className={`flex flex-col items-center text-center ${index === 0 ? 'pl-0' : 'pl-8'}`}>
              <p className="text-4xl sm:text-6xl font-light tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
