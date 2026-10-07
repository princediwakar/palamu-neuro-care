import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../ThemeToggle";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { resolveSlug } from "@/lib/seo-pages/registry";
import { useTranslations } from "next-intl";

interface FooterLink {
  title: string;
  href: string;
}

interface FooterSection {
  title: string;
  items: FooterLink[];
}

function resolve(lang: string, slug: string) {
  return lang === "hi" ? resolveSlug(slug, "hi") : slug;
}

export default function SiteFooter({ className, lang }: React.HTMLAttributes<HTMLElement> & { lang: string }) {
  const prefix = lang === "hi" ? "/hi" : "";
  const tf = useTranslations("footer");
  const tc = useTranslations("clinic");
  const tcommon = useTranslations("common");

  const footerLinks: FooterSection[] = [
    {
      title: tf("quickLinks"),
      items: [
        { title: tf("home"), href: "/" },
        { title: tf("doctors"), href: "/doctors" },
        { title: tf("videos"), href: "/videos" },
        { title: tf("gallery"), href: "/gallery" },
      ],
    },
    {
      title: tf("ourSpecialists"),
      items: [
        { title: tf("neurologist"), href: `/${resolve(lang, "neurologist-in-palamu")}` },
        { title: tf("ophthalmologist"), href: `/${resolve(lang, "ophthalmologist-in-palamu")}` },
        { title: tf("eyeSpecialist"), href: `/${resolve(lang, "eye-doctor-in-palamu")}` },
        { title: tf("retinaSpecialist"), href: `/${resolve(lang, "retina-specialist-in-palamu")}` },
      ],
    },
    {
      title: tf("neuroConditions"),
      items: [
        { title: tf("migraine"), href: `/${resolve(lang, "migraine-treatment-in-palamu")}` },
        { title: tf("epilepsy"), href: `/${resolve(lang, "epilepsy-treatment-in-palamu")}` },
        { title: tf("stroke"), href: `/${resolve(lang, "stroke-rehabilitation-in-palamu")}` },
        { title: tf("spineBackPain"), href: `/${resolve(lang, "spine-treatment-in-palamu")}` },
        { title: tf("parkinsonsDisease"), href: `/${resolve(lang, "parkinsons-disease-treatment-in-palamu")}` },
        { title: tf("neuropathy"), href: `/${resolve(lang, "neuropathy-treatment-in-palamu")}` },
      ],
    },
    {
      title: tf("eyeConditions"),
      items: [
        { title: tf("cataract"), href: `/${resolve(lang, "cataract-surgery-in-palamu")}` },
        { title: tf("glaucoma"), href: `/${resolve(lang, "glaucoma-treatment-in-palamu")}` },
        { title: tf("diabeticRetinopathy"), href: `/${resolve(lang, "diabetic-retinopathy-treatment-in-palamu")}` },
        { title: tf("retinalDetachment"), href: `/${resolve(lang, "retinal-detachment-surgery-in-palamu")}` },
        { title: tf("macularDegeneration"), href: `/${resolve(lang, "macular-degeneration-treatment-in-palamu")}` },
      ],
    },
    {
      title: tf("company"),
      items: [
        { title: tf("neurology"), href: "/neurology" },
        { title: tf("ophthalmology"), href: "/ophthalmology" },
        { title: tf("privacy"), href: "/privacy" },
        { title: tf("terms"), href: "/terms" },
      ],
    },
  ];

  return (
    <footer
      className={cn(
        "border-t border-border/50 bg-background",
        className
      )}
    >
      <MaxWidthWrapper className="grid grid-cols-2 gap-x-8 gap-y-16 py-24 sm:grid-cols-3 lg:grid-cols-6 sm:py-32">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <span className="text-xs font-medium uppercase tracking-widest text-foreground">
              {section.title}
            </span>
            <ul className="mt-6 list-inside space-y-4">
              {section.items?.map((link) => (
                <li key={link.title}>
                  <Link
                    href={`${prefix}${link.href}`}
                    className="text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <h3 className="text-xs font-medium uppercase tracking-widest text-foreground">
            {tc("name")}
          </h3>
          <div className="mt-6 flex gap-2">
            <Link
              href="https://maps.app.goo.gl/PD9U5XX71NtYhjDFA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              {tc("fullAddress")}
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <a
              href="tel:+7779897207"
              className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              7779897207
            </a>
          </div>
        </div>
      </MaxWidthWrapper>

      <div className="py-8 border-t border-border/50">
        <MaxWidthWrapper className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs font-light text-center text-muted-foreground sm:text-left tracking-widest">
            &copy; {new Date().getFullYear()} {tcommon("copyright")}
          </p>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </MaxWidthWrapper>
      </div>
    </footer>
  );
}
