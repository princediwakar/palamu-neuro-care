import { Activity, ArrowRight, Heart, Star, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import Link from "next/link";
import { useTranslations } from "next-intl";

type InfoLandingIcon = "star" | "heart" | "activity" | "users";

const iconMap: Record<InfoLandingIcon, LucideIcon> = {
  star: Star,
  heart: Heart,
  activity: Activity,
  users: Users,
};

export default function WhyClinicExcels() {
  const t = useTranslations("sections.infoLanding");
  const strengths = t.raw("strengths") as Array<{ title: string; description: string }>;
  const icons: InfoLandingIcon[] = ["star", "heart", "activity", "users"];

  return (
    <section className=" py-12 sm:py-16 lg:py-20">
      <MaxWidthWrapper>
        <h2 className="text-center font-heading text-2xl text-foreground md:text-4xl lg:text-5xl mb-12">
          {t("heading")}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map((strength, index) => {
            const Icon = iconMap[icons[index]] || ArrowRight;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/70"
              >
                <div className="relative">
                  <div className="relative flex size-14 rounded-xl border border-border  shadow-sm transition-all group-hover:rotate-6">
                    <Icon className="relative m-auto size-7 text-primary transition-colors group-hover:text-secondary" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground">{strength.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{strength.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="https://wa.me/[ClinicNumber]?text=Hi,%20I%20want%20to%20book%20an%20appointment%20for%20neurology%20or%20eye%20care."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-full transition-all hover:bg-primary/90"
          >
            {t("buttonText")}
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}