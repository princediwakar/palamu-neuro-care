import Link from "next/link";
import { Brain, Eye } from "lucide-react";

interface ConditionGlowCardProps {
  slug: string;
  shortName: string;
  label: string;
  department: "neurology" | "ophthalmology";
  lang: string;
}

const deptConfig = {
  neurology: { icon: Brain, dot: "bg-zinc-800 dark:bg-zinc-200" },
  ophthalmology: { icon: Eye, dot: "bg-zinc-500 dark:bg-zinc-400" },
};

export default function ConditionGlowCard({ slug, shortName, label, department, lang }: ConditionGlowCardProps) {
  const href = lang === "hi" ? `/hi/${slug}` : `/${slug}`;
  const config = deptConfig[department];
  const Icon = config.icon;

  return (
    <Link
      href={href}
      className="block p-5 bg-secondary/30 rounded-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="flex items-start gap-3 mb-2">
        <Icon className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {shortName}
        </h3>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">{label}</p>
    </Link>
  );
}
