"use client"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { HeaderSection } from "@/components/shared/header-section";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

export default function FAQSection({ lang }: { lang?: string }) {
  const t = useTranslations("sections.faq");
  const questions = t.raw("questions") as Array<{ question: string; answer: string }>;
  return (
    <section className="py-12 ">
      <MaxWidthWrapper>
        <HeaderSection
          label={t("label")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <Accordion type="single" collapsible className="mt-8 space-y-4">
          {questions.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </MaxWidthWrapper>
    </section>
  );
}
