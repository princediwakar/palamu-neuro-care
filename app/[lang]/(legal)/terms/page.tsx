import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "pages.terms" });
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
  };
}

type Section = { heading: string; body: string[] };

export default async function TermsOfService({ params }: PageProps) {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "pages.terms" });
  const sections = t.raw("sections") as unknown as Section[];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("lastUpdated")}</p>

      {sections.map((section, i) => (
        <section key={i}>
          <h2 className="text-2xl font-semibold">{section.heading}</h2>
          {section.body.map((para, j) => (
            <p key={j} className="mt-2">{para}</p>
          ))}
        </section>
      ))}
    </div>
  );
}
