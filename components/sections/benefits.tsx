import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Activity, ArrowRight, Brain, Eye, Heart, Star, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { HeaderSection } from "../shared/header-section";
import { getTranslations } from "next-intl/server";

type BenefitIcon = "star" | "heart" | "activity" | "users" | "eye" | "brain";

const iconMap: Record<BenefitIcon, LucideIcon> = {
  star: Star,
  heart: Heart,
  activity: Activity,
  users: Users,
  eye: Eye,
  brain: Brain,
};

export default async function Benefits({ lang }: { lang?: string }) {
  const t = await getTranslations("sections.benefits");
  const items = t.raw("items") as Array<{ title: string; description: string }>;
  const icons: BenefitIcon[] = ["star", "heart", "activity", "users", "eye", "brain"];

  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-zinc-50 dark:bg-zinc-950 border-y border-border/50">
      <MaxWidthWrapper>
        <HeaderSection
          label={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = iconMap[icons[index]] || ArrowRight;
            return (
              <div
                key={index}
                className="group relative flex flex-col overflow-hidden rounded-lg bg-white dark:bg-zinc-900 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)]"
              >
                <div className="relative flex-1">
                  <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 transition-transform duration-500 group-hover:scale-110">
                    <Icon className="size-5 text-zinc-900 dark:text-zinc-100" />
                  </div>
                  <h3 className="text-lg font-medium tracking-tight text-foreground">{item.title}</h3>
                  <p className="mt-3 text-muted-foreground font-light leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
