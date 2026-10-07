import Image from "next/image";

interface PageHeaderProps {
  label: string;
  title: string;
  subtitle: string;
}

// ... existing code ...
export const PageHeader = ({ label, title, subtitle }: PageHeaderProps) => {
  return (
    <div className="relative h-[200px] sm:h-[250px] flex flex-col items-center justify-center text-center rounded-lg bg-zinc-950 dark:bg-zinc-900 overflow-hidden border border-border/50">
      <div className="relative z-10 space-y-4 px-6 max-w-3xl mx-auto">
        <span className="inline-block border border-zinc-700 text-zinc-300 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest">
          {label}
        </span>
        <h1 className="text-3xl sm:text-5xl font-light text-zinc-50 mt-4 tracking-tight">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 font-light mt-4">
          {subtitle}
        </p>
      </div>
    </div>
  );
};