import { SymptomSeoPage } from "@/lib/seo-pages/types";
import { getClinicianName } from "@/lib/seo-pages/constants";
import { useTranslations } from "next-intl";
import RelatedPages from "@/components/seo/related-pages";
import WarningSigns from "@/components/seo/warning-signs";
import FaqSection from "@/components/seo/faq-section";
import BookAppointmentBtn from "@/components/BookAppointmentBtn";

export default function SymptomTemplate({ page, lang }: { page: SymptomSeoPage; lang: string }) {
  const t = useTranslations("templates.symptom");
  const td = useTranslations("doctors");
  const tc = useTranslations("cta");
  const doctorName = page.clinician === "dr-lahre" ? td("lahreName") : td("prabhaName");
  const symptomName = page.symptomName;
  return (
    <article itemScope itemType="https://schema.org/MedicalSymptom">
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

      <WarningSigns items={page.whenToWorry} title={t("whenToWorry")} />

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">{t("possibleCauses")}</h2>
        <div className="space-y-4">
          {page.possibleCauses.map((c, i) => (
            <div key={i} className="border border-border rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-primary">{c.cause}</h3>
              <p className="text-muted-foreground">{c.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary/5 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">{t("whichSpecialistToSee")}</h2>
          <p className="text-foreground text-lg">{page.whichSpecialistToSee}</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">{t("diagnosticApproach")}</h2>
        <p className="text-foreground leading-relaxed text-lg">{page.diagnosticApproach}</p>
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

      <section className="bg-primary text-primary-foreground py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{t("experiencing", { symptom: symptomName })}</h2>
          <p className="text-primary-foreground/90 mb-6">{t("ctaDescription", { doctorName })}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+7779897207" className="bg-primary-foreground text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors">{tc("callToBook", { phone: "7779897207" })}</a>
            <a href="https://wa.me/7779897207" className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 dark:bg-green-800 dark:hover:bg-green-700 transition-colors">{tc("whatsappUs")}</a>
          </div>
        </div>
      </section>

      <FaqSection faqs={page.faqs} />

      <RelatedPages slugs={page.relatedPages} lang={lang} />
    </article>
  );
}
