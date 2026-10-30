import type { Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import { sansFont, serifFont } from "@/app/fonts";
import { SWUpdateToast } from "@/components/shared/sw-update-toast";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/sections/navbar";
import SiteFooter from "@/components/sections/site-footer";

import "../globals.css";

export { metadata } from "@/app/metadata";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-T6K2PGHS";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!routing.locales.includes(lang as any)) {
    notFound();
  }

  setRequestLocale(lang);

  const messages = await getMessages();

  return (
    <html lang={lang} className={`${sansFont.variable} ${serifFont.variable}`} suppressHydrationWarning>
      <head>
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages} locale={lang}>
            <Navbar lang={lang} />
            <main className="pt-[72px]">{children}</main>
            <SiteFooter lang={lang} />
          </NextIntlClientProvider>
          <SWUpdateToast />
        </ThemeProvider>
      </body>
    </html>
  );
}
