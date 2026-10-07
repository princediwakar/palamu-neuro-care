import { SpecialistSeoPage } from "@/lib/seo-pages/types";
import { resolveSlug } from "@/lib/seo-pages/registry";
import { getClinicianName } from "@/lib/seo-pages/constants";
import { useTranslations } from "next-intl";
import RelatedPages from "@/components/seo/related-pages";
import DoctorHighlightCard from "@/components/seo/doctor-highlight-card";
import ConditionCard from "@/components/seo/condition-card";
import ServiceCard from "@/components/seo/service-card";
import FaqSection from "@/components/seo/faq-section";
import BookAppointmentBtn from "@/components/BookAppointmentBtn";

export default function SpecialistTemplate({ page, lang }: { page: SpecialistSeoPage; lang: string }) {
  const t = useTranslations("templates.specialist");
  const td = useTranslations("doctors");
  const tcl = useTranslations("clinic");
  const doctorName = page.clinician === "dr-lahre" ? td("lahreName") : td("prabhaName");
  return (
    <article itemScope itemType="https://schema.org/Physician">
      <section className="relative h-[250px] sm:h-[300px] flex flex-col items-center justify-center text-center rounded-lg bg-zinc-950 dark:bg-zinc-900 border border-border/50 mx-4 mt-8 px-6 max-w-6xl xl:mx-auto">
        <span className="inline-block border border-zinc-700 text-zinc-300 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
          {page.hero.label}
        </span>
        <h1 className="text-3xl sm:text-5xl font-light text-zinc-50 mb-4 tracking-tight break-words">{page.hero.title}</h1>
        <p className="text-base sm:text-lg text-zinc-400 font-light max-w-3xl mx-auto">{page.hero.subtitle}</p>
        <div className="mt-8">
          <BookAppointmentBtn />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <DoctorHighlightCard page={page} lang={lang} />
      </section>

      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">{t("whatIsA", { specialist: page.specialistType })}</h2>
        <p className="text-foreground leading-relaxed text-lg">{page.specialistIntro}</p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{t("conditionsTreated")}</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
          {page.conditionsTreated.map((c) => (
            <li key={c.slug}>
              <ConditionCard condition={c} lang={lang} resolvedSlug={resolveSlug(c.slug, lang)} />
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-muted py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{t("servicesOffered")}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
            {page.servicesOffered.map((s) => (
              <li key={s.name}>
                <ServiceCard service={s} lang={lang} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">{t("whyChoose", { doctor: doctorName, clinic: tcl("name") })}</h2>
        <ul className="space-y-3 list-none p-0">
          {page.whyChooseUs.map((reason, i) => (
            <li key={i} className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <span className="text-primary font-bold mt-0.5 shrink-0">&#10003;</span>
              <span className="text-foreground">{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      {page.clinicalObservations && page.clinicalObservations.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-6">{t("clinicalObservations")}</h2>
          <div className="space-y-6">
            {page.clinicalObservations.map((obs, i) => (
              <div key={i} className="border border-border rounded-lg p-6 bg-card">
                <h3 className="font-semibold text-foreground mb-3">{obs.palamuObservation}</h3>
                <p className="text-sm text-muted-foreground mb-3">{t("standardMedicalLiterature")}</p>
                <p className="text-muted-foreground mb-4">{obs.standardView}</p>
                <p className="text-foreground">{obs.treatmentModification}</p>
                <p className="text-sm text-muted-foreground mt-4">
                  &mdash; <strong>{getClinicianName(obs.clinician, lang)}</strong>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <RelatedPages slugs={page.relatedPages} lang={lang} />

      <FaqSection faqs={page.faqs} />
    </article>
  );
}
