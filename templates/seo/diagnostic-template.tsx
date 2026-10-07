import { DiagnosticSeoPage } from "@/lib/seo-pages/types";
import { getSeoPage, resolveSlug } from "@/lib/seo-pages/registry";
import { getClinicianName } from "@/lib/seo-pages/constants";
import { useTranslations } from "next-intl";
import RelatedPages from "@/components/seo/related-pages";
import ProcedureSteps from "@/components/seo/procedure-steps";
import FaqSection from "@/components/seo/faq-section";
import SectionContent from "@/components/seo/section-content";
import BookAppointmentBtn from "@/components/BookAppointmentBtn";

export default function DiagnosticTemplate({ page, lang }: { page: DiagnosticSeoPage; lang: string }) {
  const t = useTranslations("templates.diagnostic");
  const testName = page.testName;
  return (
    <article itemScope itemType="https://schema.org/MedicalProcedure">
      <section className="bg-card text-foreground py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-sm font-semibold tracking-wider uppercase text-primary/80">{page.hero.label}</span>
          <h1 className="text-3xl md:text-5xl font-bold mt-4 mb-6 break-words">{page.hero.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{page.hero.subtitle}</p>
          <div className="mt-8">
            <BookAppointmentBtn />
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">{t("whatIs", { test: testName })}</h2>
        <SectionContent content={page.whatIsIt} />
      </section>

      <section className="bg-muted py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">{t("whyItIsDone", { test: testName })}</h2>
          <ul className="space-y-2">
            {page.whyItIsDone.map((reason, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-primary font-bold mt-0.5 shrink-0">&bull;</span>
                <span className="text-foreground">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ProcedureSteps
        steps={page.procedureSteps}
        title={t("howItIsPerformed", { test: testName })}
      />

      <section className="bg-muted py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">{t("howToPrepare")}</h2>
          <ul className="space-y-2">
            {page.preparation.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-primary font-bold mt-0.5 shrink-0">&bull;</span>
                <span className="text-foreground">{p}</span>
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

      {page.relatedConditions.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-4">{t("relatedConditions")}</h2>
          <p className="text-foreground mb-4">{t("relatedConditionsIntro", { testName: page.testName })}</p>
          <ul className="flex flex-wrap gap-2 list-none p-0">
            {page.relatedConditions.map((slug) => {
              const resolved = resolveSlug(slug, lang);
              const resolvedPage = getSeoPage(resolved, lang);
              const displayName = resolvedPage?.title
                ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(" In Palamu", " in Palamu");
              const href = lang === "hi" ? `/hi/${resolved}` : `/${resolved}`;
              return (
                <li key={slug}>
                  <a href={href} className="inline-block px-4 py-2.5 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-colors">
                    {displayName}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <FaqSection faqs={page.faqs} />

      <RelatedPages slugs={page.relatedPages} lang={lang} />
    </article>
  );
}
