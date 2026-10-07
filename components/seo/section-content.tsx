import { InfoContentBlock } from "@/lib/seo-pages/types";
import { Activity, Brain, Camera, Circle, ClipboardList, Clock, Eye, Heart, Microscope, Pill, ShieldCheck, Stethoscope, Syringe, Target, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function getPlainText(content: string | InfoContentBlock[]): string {
  if (typeof content === "string") return content;
  return content
    .map((block) => {
      switch (block.type) {
        case "paragraphs": return block.items.join(" ");
        case "bullets": return block.items.join(" ");
        case "highlight": return block.text;
        case "cards": return block.items.map(c => `${c.title}: ${c.description}`).join(" ");
        case "steps": return block.items.map(s => `${s.title}: ${s.description}`).join(" ");
      }
    })
    .join(" ");
}

const cardIconMap: Record<string, LucideIcon> = {
  Brain,
  Eye,
  Heart,
  Activity,
  Shield: ShieldCheck,
  Pill,
  Zap,
  Clock,
  Stethoscope,
  Target,
  Syringe,
  Microscope,
  Camera,
  Clipboard: ClipboardList,
};

export default function SectionContent({ content, className }: { content: string | InfoContentBlock[]; className?: string }) {
  if (typeof content === "string") {
    return <p className={className ?? "text-foreground leading-relaxed text-base"}>{content}</p>;
  }

  return (
    <div className="space-y-4">
      {content.map((block, i) => {
        switch (block.type) {
          case "paragraphs":
            return (
              <div key={i} className="space-y-3">
                {block.items.map((text, j) => (
                  <p key={j} className="text-foreground leading-relaxed text-base">{text}</p>
                ))}
              </div>
            );
          case "bullets":
            return (
              <ul key={i} className="space-y-2.5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Circle className="size-1.5 mt-2.5 shrink-0 fill-primary text-primary" />
                    <span className="text-foreground text-base leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "highlight":
            return (
              <div key={i} className="rounded-lg p-6 bg-secondary/30 border-l-4 border-l-zinc-900 dark:border-l-zinc-100">
                {block.title && <p className="font-semibold text-foreground mb-2">{block.title}</p>}
                <p className="text-foreground leading-relaxed text-base">{block.text}</p>
              </div>
            );
          case "cards":
            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {block.items.map((card, j) => {
                  const CardIcon = card.icon ? cardIconMap[card.icon] : null;
                  return (
                    <div
                      key={j}
                      className="rounded-lg p-6 bg-secondary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        {CardIcon ? (
                          <div className="size-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <CardIcon className="size-5 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="size-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-primary-foreground">{card.title.charAt(0)}</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground mb-1">{card.title}</p>
                          <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          case "steps":
            return (
              <ol key={i} className="space-y-5 list-none p-0">
                {block.items.map((step, j) => (
                  <li key={j} className="flex gap-4">
                    <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                      {j + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground mb-1">{step.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            );
        }
      })}
    </div>
  );
}
