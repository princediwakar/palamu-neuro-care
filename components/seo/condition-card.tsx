import Link from "next/link";

interface ConditionCardProps {
  condition: { name: string; description: string; slug: string };
  lang: string;
  resolvedSlug?: string;
}

export default function ConditionCard({ condition, lang, resolvedSlug }: ConditionCardProps) {
  const slug = resolvedSlug ?? condition.slug;
  const href = lang === "hi" ? `/hi/${slug}` : `/${slug}`;
  return (
    <Link
      href={href}
      className="block p-5 bg-secondary/30 rounded-lg hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] hover:-translate-y-1 transition-all duration-300 group"
    >
      <h3 className="font-semibold text-primary group-hover:text-primary transition-colors mb-2">
        {condition.name}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{condition.description}</p>
    </Link>
  );
}
