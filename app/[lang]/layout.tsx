import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/sections/navbar";
import SiteFooter from "@/components/sections/site-footer";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!routing.locales.includes(lang as "en" | "hi")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={lang}>
      <Navbar lang={lang} />
      <main className="pt-20">{children}</main>
      <SiteFooter lang={lang} />
    </NextIntlClientProvider>
  );
}
