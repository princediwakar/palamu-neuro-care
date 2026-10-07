import { InfoContentBlock } from "@/lib/seo-pages/types";
import SectionContent from "@/components/seo/section-content";

export default function ProcedureSteps({
  steps,
  title,
}: {
  steps: { step: number; title: string; description: string | InfoContentBlock[] }[];
  title: string;
}) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-8 text-center">{title}</h2>
      <ol className="space-y-6 list-none p-0">
        {steps.map((s) => (
          <li key={s.step} className="flex gap-4">
            <div className="shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
              {s.step}
            </div>
            <div className="pt-1.5">
              <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
              <SectionContent content={s.description} className="text-muted-foreground text-sm leading-relaxed" />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
