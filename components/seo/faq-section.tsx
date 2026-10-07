import { useTranslations } from "next-intl";

interface FaqItem {
  question: string;
  answer: string;
  bluf?: string;
}

export default function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const t = useTranslations("common");
  if (faqs.length === 0) return null;
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{t("frequentlyAskedQuestions")}</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <details key={index} className="group bg-secondary/30 rounded-lg">
            <summary className="cursor-pointer px-5 py-4 font-medium text-foreground hover:text-primary transition-colors list-none [&::-webkit-details-marker]:hidden">
              {faq.question}
            </summary>
            <div className="px-5 pb-4 text-muted-foreground leading-relaxed">
              {faq.bluf && <strong className="block mb-2 text-foreground">{faq.bluf}</strong>}
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
