interface HeaderSectionProps {
  label: string;
  title: string;
  subtitle: string;
}

export const HeaderSection = ({ label, title, subtitle }: HeaderSectionProps) => {
  return (
    <div className="text-center space-y-4">
      {/* Label */}
      <span className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
        {label}
      </span>

      {/* Title */}
      <h2 className="text-4xl sm:text-5xl font-bold text-foreground mt-4">
        {title}
      </h2>

      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};