import { HeaderSection } from "@/components/shared/header-section";
import { Activity, ArrowRight, Bone, Brain, Eye } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { resolveSlug } from "@/lib/seo-pages/registry";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

// Destination pages for each service card title
const SERVICE_SLUGS = [
  "neurology",                    // Brain Care
  "ophthalmology",                // Eye Care
  "nerve-specialist-in-palamu",   // Nerve Care
  "retina-specialist-in-palamu",  // Retina Care
  "spine-doctor-in-palamu",       // Spine Care
];

const CONDITION_SLUGS: string[][] = [
  // Brain Care
  ["migraine-treatment-in-palamu", "epilepsy-treatment-in-palamu", "stroke-rehabilitation-in-palamu", "parkinsons-disease-treatment-in-palamu"],
  // Eye Care
  ["glaucoma-treatment-in-palamu", "cataract-surgery-in-palamu", "diabetic-retinopathy-treatment-in-palamu", "retinal-detachment-surgery-in-palamu"],
  // Nerve Care
  ["neuropathy-treatment-in-palamu", "carpal-tunnel-treatment-in-palamu", "neuropathy-treatment-in-palamu"],
  // Retina Care
  ["retinal-detachment-surgery-in-palamu", "macular-degeneration-treatment-in-palamu", "diabetic-retinopathy-treatment-in-palamu"],
  // Spine Care
  ["spine-treatment-in-palamu", "spine-treatment-in-palamu", "spine-treatment-in-palamu", "spine-treatment-in-palamu"],
];

export default async function Services({ lang }: { lang?: string }) {
  const t = await getTranslations("sections.services");
  const items = t.raw("items") as Array<{ title: string; description: string; conditions: string[] }>;
  type ServiceIconKey = "brain" | "eye" | "activity" | "eyeOff" | "bone";

  const iconMap: Record<ServiceIconKey, LucideIcon> = {
    brain: Brain,
    eye: Eye,
    activity: Activity,
    eyeOff: ArrowRight, // no EyeOff in use — maps to fallback
    bone: Bone,
  };

  const icons: ServiceIconKey[] = ["brain", "eye", "activity", "eyeOff", "bone"];

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <MaxWidthWrapper>
        <HeaderSection
          label={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service, i) => {
            const Icon = iconMap[icons[i]] || ArrowRight;
            // neurology/ophthalmology are standalone pages (not SEO dynamic slugs)
            const isStandalonePage = i === 0 || i === 1;
            const serviceSlug = isStandalonePage
              ? SERVICE_SLUGS[i]
              : resolveSlug(SERVICE_SLUGS[i], lang ?? "en");
            const serviceHref = lang === "hi"
              ? `/hi/${serviceSlug}`
              : `/${serviceSlug}`;
            return (
              <div
                className="group relative flex flex-col overflow-hidden rounded-lg bg-secondary/30 p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)]"
                key={service.title}
              >
                <div className="relative flex-1">
                  <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-200 group-hover:scale-110">
                    <Icon className="size-5 text-zinc-900 dark:text-zinc-100" />
                  </div>
                  <h3 className="text-xl font-medium tracking-tight">
                    <Link
                      href={serviceHref}
                      className="text-foreground before:absolute before:inset-0 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                      {service.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-muted-foreground font-light leading-relaxed">{service.description}</p>
                  
                  <div className="mt-8 relative z-20">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{t("conditionsWeTreat")}</h4>
                    <ul className="mt-4 space-y-2">
                      {service.conditions.map((condition, j) => {
                        const resolvedSlug = resolveSlug(CONDITION_SLUGS[i]?.[j] ?? "", lang ?? "en");
                        const href = lang === "hi" ? `/hi/${resolvedSlug}` : `/${resolvedSlug}`;
                        return (
                          <li key={j} className="text-sm">
                            <Link
                              href={href}
                              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            >
                              &mdash; {condition}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
