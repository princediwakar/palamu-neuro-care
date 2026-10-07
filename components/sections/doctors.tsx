import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import Image from "next/image";
import Link from "next/link";
import { HeaderSection } from "../shared/header-section";
import { getTranslations } from "next-intl/server";
import { resolveSlug } from "@/lib/seo-pages/registry";
import BookAppointmentBtn from "@/components/BookAppointmentBtn";

export default async function MeetTheDoctors({ lang }: { lang?: string }) {
  const t = await getTranslations("sections.doctors");
  const descriptions = t.raw("descriptions") as string[];
  const doctors = [
    {
      name: t("lahreName"),
      credentials: t("lahreCredentials"),
      image: "/_static/illustrations/yuvraj.jpeg",
      description: descriptions[0],
      slug: "dr-yuvraj-lahre-neurologist-palamu",
    },
    {
      name: t("prabhaName"),
      credentials: t("prabhaCredentials"),
      image: "/_static/illustrations/dibya.jpeg",
      description: descriptions[1],
      slug: "dr-dibya-prabha-ophthalmologist-palamu",
    },
  ];

  return (
    <section className=" py-12 sm:py-16 lg:py-20">
      <MaxWidthWrapper>
        <HeaderSection
          label={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg hover:border-primary/70"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) 50vw, 33vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-foreground">{doctor.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{doctor.credentials}</p>
                <p className="mt-4 text-base text-muted-foreground leading-relaxed">{doctor.description}</p>
                <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                  <BookAppointmentBtn buttonText={t("consultButton")} className="!px-4 !py-2 !text-sm w-full sm:w-auto" />
                  <Link
                    href={lang === "hi" ? `/hi/${resolveSlug(doctor.slug, "hi")}` : `/${doctor.slug}`}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
                  >
                    {t("learnMore")}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
