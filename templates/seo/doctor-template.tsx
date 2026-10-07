import Image from "next/image";
import { DoctorSeoPage } from "@/lib/seo-pages/types";
import { CLINIC } from "@/lib/seo-pages/constants";
import { useTranslations } from "next-intl";
import RelatedPages from "@/components/seo/related-pages";
import FaqSection from "@/components/seo/faq-section";
import { BookOpen, Building2, GraduationCap, Microscope, Star } from "lucide-react";
import BookAppointmentBtn from "@/components/BookAppointmentBtn";

type DoctorIcon = "graduationCap" | "bookOpen" | "microscope" | "building2";

function getEducationIcon(degree: string) {
  if (degree.includes("MBBS")) return GraduationCap;
  if (degree.includes("MD") || degree.includes("MS")) return BookOpen;
  if (degree.includes("DM") || degree.includes("Fellow")) return Microscope;
  return Building2;
}

export default function DoctorTemplate({ page, lang }: { page: DoctorSeoPage; lang: string }) {
  const t = useTranslations("templates.doctor");
  const tc = useTranslations("common");
  const ta = useTranslations("cta");
  const tcl = useTranslations("clinic");
  return (
    <article itemScope itemType="https://schema.org/Physician">
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

      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="shrink-0 relative w-48 h-48">
            <Image
              src={page.doctorImage}
              alt={page.doctorName}
              fill
              sizes="(max-width: 767px) 192px, 192px"
              className="rounded-2xl object-cover shadow-lg"
              priority
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{page.doctorName}</h2>
            <p className="text-primary font-medium mb-4">{page.qualifications}</p>
            <p className="text-foreground leading-relaxed">{page.bio}</p>
          </div>
        </div>
      </section>

      <section className="bg-muted py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{t("educationAndTraining")}</h2>
          <div className="space-y-4">
            {page.education.map((edu, i) => {
              const EduIcon = getEducationIcon(edu.degree);
              return (
              <div key={i} className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground shrink-0">
                  <EduIcon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                  <p className="text-muted-foreground">{edu.institution}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">{t("specializationsAndExpertise")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {page.specializations.map((spec, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <Star className="size-4 text-primary shrink-0 mt-0.5" />
              <span className="text-foreground">{spec}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted py-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{t("achievementsAndRecognition")}</h2>
          <div className="space-y-4">
            {page.achievements.map((achievement, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-lg font-semibold text-primary mb-2">{achievement.title}</h3>
                <p className="text-muted-foreground">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{t("bookAppointmentWith", { doctor: page.doctorName })}</h2>
          <p className="text-primary-foreground/90 mb-2">{t("visitClinic", { clinic: tcl("name") })}</p>
          <a href={page.clinician === "dr-lahre" ? CLINIC.maps.lahre : CLINIC.maps.prabha}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground hover:underline mb-6 font-medium">
            {tc("getDirections")} &rarr;
          </a>
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
