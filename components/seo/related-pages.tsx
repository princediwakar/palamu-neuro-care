import { getRelatedPages } from "@/lib/seo-pages/registry";
import { useTranslations } from "next-intl";

export default function RelatedPages({ slugs, lang }: { slugs: string[]; lang: string }) {
  const pages = getRelatedPages(slugs, lang);
  const t = useTranslations("common");
  if (pages.length === 0) return null;
  return (
    <section className="bg-muted py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("alsoExplore")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {pages.map((p) => (
            <a
              key={p.slug}
              href={lang === "hi" ? `/hi/${p.slug}` : `/${p.slug}`}
              className="p-5 bg-secondary/30 rounded-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] hover:-translate-y-1 transition-all duration-300 group"
            >
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors line-clamp-2">
                {p.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
