import Image from "next/image";
import { SpecialistSeoPage } from "@/lib/seo-pages/types";
import { DOCTORS, CLINIC } from "@/lib/seo-pages/constants";

export default function DoctorHighlightCard({ page, lang }: { page: SpecialistSeoPage; lang: string }) {
  const doctor = page.clinician === "dr-lahre" ? DOCTORS.lahre : DOCTORS.prabha;
  return (
    <div className="bg-secondary/30 rounded-2xl p-8 md:p-10">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <Image
          src={page.doctorImage}
          alt={page.doctorName}
          width={160}
          height={160}
          className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-md shrink-0"
        />
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-foreground">{page.doctorName}</h3>
          <div className="flex flex-wrap gap-1.5 mt-2 justify-center md:justify-start">
            {page.doctorQualifications.map((q, i) => (
              <span key={i} className="text-sm bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                {q}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed max-w-xl">
            {page.specialistIntro}
          </p>
        </div>
      </div>
    </div>
  );
}
