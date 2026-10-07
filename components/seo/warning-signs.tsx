import { AlertTriangle } from "lucide-react";

export default function WarningSigns({ items, title }: { items: string[]; title: string }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-amber-50 dark:bg-amber-950 border-t border-b border-amber-200 dark:border-amber-800 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="size-6 text-amber-600 dark:text-amber-400" /> {title}
        </h2>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5 shrink-0">!</span>
              <span className="text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
