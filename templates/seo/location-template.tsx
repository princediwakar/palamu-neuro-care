import { LocationSeoPage } from "@/lib/seo-pages/types";
import { CLINIC } from "@/lib/seo-pages/constants";
import { useTranslations } from "next-intl";
import RelatedPages from "@/components/seo/related-pages";
import FaqSection from "@/components/seo/faq-section";
import BookAppointmentBtn from "@/components/BookAppointmentBtn";

export default function LocationTemplate({ page, lang }: { page: LocationSeoPage; lang: string }) {
  const t = useTranslations("templates.location");
  const td = useTranslations("doctors");
  const tc = useTranslations("common");
  const doctorName = page.clinician === "dr-lahre" ? td("lahreName") : td("prabhaName");
  const doctorTitle = page.clinician === "dr-lahre" ? td("lahreTitle") : td("prabhaTitle");
  const department = page.clinician === "dr-lahre" ? t("neurological") : t("ophthalmologyRetinal");
  const city = page.targetCity;
  return (
    <article itemScope itemType="https://schema.org/MedicalClinic">
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

      {page.cityHighlight && (
        <section className="max-w-5xl mx-auto px-4 py-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-foreground leading-relaxed">{page.cityHighlight}</p>
          </div>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">{t("doctorServing", { doctorTitle, city })}</h2>
        <p className="text-foreground text-lg mb-4">
          {t("clinicDescription", {
            doctorName,
            doctorTitle,
            department,
            city,
            state: page.targetState,
            distance: page.distanceFromPalamu,
          })}
        </p>
      </section>

      <section className="bg-muted py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">{t("travelInfo", { city })}</h2>
          <p className="text-foreground text-lg">{page.travelInfo}</p>
          <a href={page.clinician === "dr-lahre" ? CLINIC.maps.lahre : CLINIC.maps.prabha}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline mt-3 font-medium">
            {tc("getDirections")} &rarr;
          </a>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">{t("servicesAvailableFor", { city })}</h2>
        <ul className="space-y-2">
          {page.servicesOffered.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-primary font-bold mt-0.5 shrink-0">&#10003;</span>
              <span className="text-foreground">{s}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-muted py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">{t("areasWeServe", { city })}</h2>
          <div className="flex flex-wrap gap-2">
            {page.servingRegions.map((region) => (
              <span key={region} className="px-3 py-1.5 bg-card text-foreground rounded-full text-sm border border-border">
                {region}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{t("visitingFrom", { city })}</h2>
          <p className="text-primary-foreground/90 mb-6">
            {t("visitingDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+917779897207" className="bg-primary-foreground text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors">
              {t("callToBook", { phone: "7779897207" })}
            </a>
            <a href="tel:+919955707207" className="bg-primary-foreground text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors">
              {t("callToBook", { phone: "9955707207" })}
            </a>
            <a href="https://wa.me/7779897207" className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 dark:bg-green-800 dark:hover:bg-green-700 transition-colors">
              {t("whatsappUs")}
            </a>
          </div>
        </div>
      </section>

      <RelatedPages slugs={page.relatedPages} lang={lang} />

      <FaqSection faqs={page.faqs} />
    </article>
  );
}
