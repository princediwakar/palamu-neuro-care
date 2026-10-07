interface BreadcrumbCategory {
  label: { en: string; hi: string };
  route?: string;
}

const BREADCRUMB_CATEGORIES: Record<string, BreadcrumbCategory> = {
  specialist: { label: { en: "Specialists", hi: "विशेषज्ञ" }, route: "doctors" },
  doctor: { label: { en: "Doctors", hi: "डॉक्टर" }, route: "doctors" },
};

export default function Breadcrumbs({
  slug,
  title,
  lang,
  category,
}: {
  slug: string;
  title: string;
  lang: string;
  category?: string;
}) {
  const homeLabel = lang === "hi" ? "होम" : "Home";
  const homeHref = lang === "hi" ? "/hi" : "/";
  const cat = category ? BREADCRUMB_CATEGORIES[category] : null;
  return (
    <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 py-3 text-sm">
      <ol className="flex items-center gap-2 text-muted-foreground flex-wrap">
        <li>
          <a href={homeHref} className="hover:text-primary transition-colors">{homeLabel}</a>
        </li>
        <li className="text-muted-foreground/50">/</li>
        {cat && (
          <>
            <li>
              {cat.route ? (
                <a href={lang === "hi" ? `/hi/${cat.route}` : `/${cat.route}`} className="hover:text-primary transition-colors">
                  {lang === "hi" ? cat.label.hi : cat.label.en}
                </a>
              ) : (
                <span className="text-foreground/70">{lang === "hi" ? cat.label.hi : cat.label.en}</span>
              )}
            </li>
            <li className="text-muted-foreground/50">/</li>
          </>
        )}
        <li className="text-foreground font-medium truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}
