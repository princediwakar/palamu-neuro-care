export default function SectionSkeleton() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-muted rounded mx-auto mb-8" />
        <div className="h-64 bg-muted/50 rounded-xl" />
      </div>
    </section>
  );
}
