"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import BookAppointmentBtn from "../BookAppointmentBtn";
import { ThemeToggle } from "../ThemeToggle";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";
import LanguageSwitcher from "../shared/language-switcher";

type NavKey = "doctors" | "neurology" | "ophthalmology" | "videos";

export const Navbar = ({
  lang,
  enHref,
  hiHref,
}: {
  lang: string;
  enHref?: string;
  hiHref?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const cta = useTranslations("cta");

  const prefix = lang === "hi" ? "/hi" : "";

  const isActive = (href: string) => {
    if (lang === "hi") return pathname === `/hi${href}` || pathname === href;
    return pathname === href;
  };

  const navLinks: NavKey[] = ["doctors", "neurology", "ophthalmology", "videos"];

  // Handle body scroll lock robustly
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* 1. THE HEADER SHELL */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 border-b border-border/50 ${
          isOpen ? "bg-background" : "bg-background/95 backdrop-blur-md"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 xl:px-6">
          <div className="flex items-center justify-between h-[72px]">
            
            {/* Logo - Force layout protection with flex-shrink-0 */}
            <Link 
              href={lang === "hi" ? "/hi" : "/"} 
              className="flex flex-shrink-0 items-center gap-3 z-50 relative py-2 group" 
              aria-label="logo"
            >
              <Image 
                src="/logo.jpg" 
                alt="Palamu Neuro & Eye Care Logo" 
                width={60} 
                height={60} 
                className="object-contain h-10 w-auto sm:h-12 transition-transform group-hover:scale-[1.02] rounded-sm mix-blend-multiply dark:mix-blend-normal" 
                priority 
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-base sm:text-lg font-medium tracking-tight text-foreground leading-tight">
                  Palamu Neuro & Eye Care
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-8" role="navigation" aria-label="Main navigation">
                {navLinks.map((href) => (
                  <Link
                    key={href}
                    href={`${prefix}/${href}`}
                    className={`text-sm font-light tracking-wide hover:text-foreground transition-colors ${
                      isActive(`/${href}`) ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {t(href)}
                  </Link>
                ))}
              </div>
              <LanguageSwitcher currentLang={lang} enHref={enHref} hiHref={hiHref} />
              <ThemeToggle />
              <a 
                href="tel:+917779897207" 
                className="flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground hover:text-primary transition-colors ml-2"
              >
                <Phone className="h-4 w-4 text-primary" />
                77798 97207
              </a>
            </div>

            {/* Hamburger Icon - Force layout protection with flex-shrink-0 */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden flex-shrink-0 p-3 -mr-2 rounded-md text-foreground hover:bg-muted transition-colors z-50 relative"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* 2. THE MOBILE MENU OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 top-[72px] z-40 bg-background lg:hidden overflow-y-auto"
          aria-modal="true"
          role="dialog"
        >
          <div className="flex flex-col items-center px-4 py-8 space-y-8 min-h-full">
            <div className="flex flex-col items-center space-y-6 w-full">
              {navLinks.map((href) => (
                <Link
                  key={href}
                  href={`${prefix}/${href}`}
                  className={`min-h-[44px] flex items-center text-2xl font-medium hover:text-primary transition-colors ${
                    isActive(`/${href}`) ? "text-primary" : "text-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {t(href)}
                </Link>
              ))}
            </div>

            <div className="w-full h-px bg-border max-w-[200px]" />

            <div className="flex flex-col items-center space-y-6 w-full pb-12">
              <LanguageSwitcher currentLang={lang} enHref={enHref} hiHref={hiHref} />
              <ThemeToggle />
              <div className="w-full flex justify-center mt-4">
                <a 
                  href="tel:+917779897207" 
                  className="flex items-center gap-3 text-xl font-semibold tracking-wide text-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-6 w-6 text-primary" />
                  77798 97207
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Navbar.displayName = "Navbar";