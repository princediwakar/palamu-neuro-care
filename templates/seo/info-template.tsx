import { InfoSeoPage } from "@/lib/seo-pages/types";
import { useTranslations } from "next-intl";
import RelatedPages from "@/components/seo/related-pages";
import FaqSection from "@/components/seo/faq-section";
import SectionContent from "@/components/seo/section-content";
import { BarChart, Brain, Camera, Clock, Eye, Handshake, Heart, Microscope, Pill, ShieldCheck, Stethoscope, Syringe, Target, Zap, ClipboardList } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import BookAppointmentBtn from "@/components/BookAppointmentBtn";

const iconMap: Record<string, LucideIcon> = {
  Brain,
  Eye,
  Heart,
  Activity: BarChart,
  Shield: ShieldCheck,
  Scan: Microscope,
  Pill,
  Hand: Handshake,
  Zap,
  Camera,
  Target,
  Syringe,
  Scalpel: Stethoscope,
  Clock,
  Stethoscope,
  Clipboard: ClipboardList,
};

export default function InfoTemplate({ page, lang }: { page: InfoSeoPage; lang: string }) {
  const t = useTranslations("templates.info");
  const td = useTranslations("doctors");
  const ta = useTranslations("cta");
  const doctorName = page.clinician === "dr-lahre" ? td("lahreName") : page.clinician === "dr-prabha" ? td("prabhaName") : `Dr. Yuvraj Lahre & Dr. Dibya Prabha`;
  return (
    <article>
      <section className="bg-card text-foreground py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-sm font-semibold tracking-wider uppercase text-primary/80">{page.hero.label}</span>
          <h1 className="text-3xl md:text-5xl font-bold mt-4 mb-6">{page.hero.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{page.hero.subtitle}</p>
          <div className="mt-8">
            <BookAppointmentBtn />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10 overflow-x-hidden">
        {page.sections.length >= 4 && (
          <nav aria-label={lang === "hi" ? "इस पेज पर" : "On this page"} className="bg-muted/50 border border-border rounded-lg p-5">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {lang === "hi" ? "इस पेज पर" : "On this page"}
            </p>
            <ol className="space-y-1.5 list-decimal list-inside">
              {page.sections.map((section, i) => (
                <li key={i}>
                  <a href={`#section-${i}`} className="text-sm text-primary hover:underline">{section.heading}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {page.sections.map((section, i) => (
          <section key={i} id={`section-${i}`} className={i % 2 === 0 ? "scroll-mt-20" : "bg-muted -mx-4 sm:mx-0 px-6 sm:px-8 py-10 rounded-lg scroll-mt-20"}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              {section.icon && iconMap[section.icon] && (() => { const Icon = iconMap[section.icon]; return <Icon className="size-6 text-primary" />; })()}
              {section.heading}
            </h2>
            <SectionContent content={section.content} />
          </section>
        ))}
      </div>

      <section className="bg-primary text-primary-foreground py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{page.callToAction}</h2>
          <p className="text-primary-foreground/90 mb-6">{t("consultAt", { doctor: doctorName })}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+917779897207" className="bg-primary-foreground text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors">{ta("callToBook", { phone: "7779897207" })}</a>
            <a href="tel:+919955707207" className="bg-primary-foreground text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors">{ta("callToBook", { phone: "9955707207" })}</a>
            <a href="https://wa.me/7779897207" className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 dark:bg-green-800 dark:hover:bg-green-700 transition-colors">{ta("whatsappUs")}</a>
          </div>
        </div>
      </section>

      <RelatedPages slugs={page.relatedPages} lang={lang} />

      <FaqSection faqs={page.faqs} />
    </article>
  );
}
