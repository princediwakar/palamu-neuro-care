import { ConditionSeoPage } from "@/lib/seo-pages/types";
import { resolveSlug } from "@/lib/seo-pages/registry";
import { getClinicianName } from "@/lib/seo-pages/constants";
import { useTranslations } from "next-intl";
import RelatedPages from "@/components/seo/related-pages";
import ConditionCard from "@/components/seo/condition-card";
import WarningSigns from "@/components/seo/warning-signs";
import FaqSection from "@/components/seo/faq-section";
import SectionContent from "@/components/seo/section-content";
import BookAppointmentBtn from "@/components/BookAppointmentBtn";

export default function ConditionTemplate({ page, lang }: { page: ConditionSeoPage; lang: string }) {
  const t = useTranslations("templates.condition");
  const conditionName = page.conditionName;
  return (
    <article itemScope itemType="https://schema.org/MedicalCondition">
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

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">{t("whatIs", { condition: conditionName })}</h2>
        <SectionContent content={page.whatIsIt} />
      </section>

      <section className="bg-muted py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">{t("symptomsOf", { condition: conditionName })}</h2>
          <ul className="space-y-2">
            {page.symptoms.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-primary font-bold mt-0.5 shrink-0">&bull;</span>
                <span className="text-foreground">{s}</span>
              </li>
            ))}
          </ul>
        </div>
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

      {page.clinicStats && page.clinicStats.length > 0 && (
        <section className="bg-primary/5 py-10">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">{t("treatmentOutcomes")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {page.clinicStats.map((stat, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6 text-center">
                  <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-foreground font-medium">{stat.metric}</p>
                  {stat.timeframe && (
                    <p className="text-sm text-muted-foreground mt-1">{stat.timeframe}</p>
                  )}
                  {stat.sampleSize && (
                    <p className="text-sm text-muted-foreground mt-2">{stat.sampleSize}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">{t("causesAndRiskFactors")}</h2>
        <ul className="space-y-2">
          {page.causes.map((c, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-primary font-bold mt-0.5 shrink-0">&bull;</span>
              <span className="text-foreground">{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-muted py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">{t("diagnosticTests")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {page.diagnosticTests.map((test) => (
              <ConditionCard key={test.slug} condition={test} lang={lang} resolvedSlug={resolveSlug(test.slug, lang)} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">{t("treatmentApproach")}</h2>
        <p className="text-foreground mb-6">{page.treatmentApproach.intro}</p>
        <dl className="space-y-4">
          {page.treatmentApproach.methods.map((m, i) => (
            <div key={i} className="border border-border rounded-lg p-5">
              <dt className="text-lg font-semibold mb-2 text-primary">{m.name}</dt>
              <dd className="text-muted-foreground">{m.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <WarningSigns items={page.whenToSeeDoctor} title={t("whenToSeeDoctor")} />

      <FaqSection faqs={page.faqs} />

      <RelatedPages slugs={page.relatedPages} lang={lang} />
    </article>
  );
}
