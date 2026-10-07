import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { patientTestimonials } from "@/config/landing";
import { getTranslations } from "next-intl/server";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

function avatarColor(name: string) {
  const colors = [
    "bg-zinc-900",
    "bg-zinc-800",
    "bg-zinc-700",
    "bg-zinc-600",
    "bg-zinc-500",
    "bg-zinc-400",
    "bg-zinc-950",
    "bg-zinc-300",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default async function Testimonials({ lang }: { lang?: string }) {
  const t = await getTranslations("sections.testimonials");
  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-background">
      <MaxWidthWrapper className="flex flex-col gap-16">
        <HeaderSection
          label={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="column-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
          {patientTestimonials.map((item) => (
            <div className="break-inside-avoid" key={item.name}>
              <div className="group relative rounded-lg bg-secondary/30 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)]">
                <div className="flex flex-col">
                  <div className="relative mb-6 flex items-center gap-4">
                    <div
                      className={`flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarColor(item.name)}`}
                      aria-hidden="true"
                    >
                      {getInitials(item.name)}
                    </div>
                    <div>
                      <p className="text-base font-medium text-foreground tracking-tight">
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground font-light">
                        {item.location}
                      </p>
                    </div>
                  </div>
                  <q className="text-muted-foreground font-light leading-relaxed transition-all group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                    {t(`reviews.${item.id}`)}
                  </q>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
