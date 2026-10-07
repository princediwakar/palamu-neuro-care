"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import slugMaps from "@/lib/seo-pages/slug-maps.json";

interface LanguageSwitcherProps {
  currentLang: string;
  enHref?: string;
  hiHref?: string;
}

function resolveSeoSlug(pathname: string, fromLang: string, toLang: string): string | null {
  const rawPath = pathname.replace(/^\/hi/, "").replace(/^\//, "");
  if (!rawPath) return null;

  if (fromLang === "en" && toLang === "hi") {
    const hiSlug = slugMaps.enToHi[rawPath as keyof typeof slugMaps.enToHi];
    return hiSlug ? `/hi/${hiSlug}` : null;
  }
  if (fromLang === "hi" && toLang === "en") {
    const enSlug = slugMaps.hiToEn[rawPath as keyof typeof slugMaps.hiToEn];
    return enSlug ? `/${enSlug}` : null;
  }
  return null;
}

export default function LanguageSwitcher({ currentLang, enHref, hiHref }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("language");

  const alternateLabel = t("switchTo");

  let alternateHref: string;
  let targetLocale: string;
  if (currentLang === "en" && hiHref) {
    alternateHref = `/hi/${hiHref}`;
    targetLocale = "hi";
  } else if (currentLang === "hi" && enHref) {
    alternateHref = `/${enHref}`;
    targetLocale = "en";
  } else {
    const target = currentLang === "en" ? "hi" : "en";
    targetLocale = target;
    const resolved = resolveSeoSlug(pathname, currentLang, target);
    if (resolved) {
      alternateHref = resolved;
    } else if (currentLang === "en") {
      alternateHref = `/hi${pathname}`;
    } else {
      alternateHref = pathname.replace(/^\/hi/, "") || "/";
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000`;
    router.push(alternateHref);
  };

  return (
    <a
      href={alternateHref}
      onClick={handleClick}
      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-4 py-2.5 rounded-md border border-border hover:border-primary/40 cursor-pointer inline-flex items-center"
      aria-label={`Switch to ${alternateLabel}`}
    >
      {alternateLabel}
    </a>
  );
}
