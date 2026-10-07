export default function GalleryLoading() {
  return (
    <div className="animate-pulse py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto h-[250px] sm:h-[300px] rounded-2xl bg-muted" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="aspect-square rounded-xl bg-muted" />
          <div className="aspect-square rounded-xl bg-muted" />
          <div className="aspect-square rounded-xl bg-muted" />
          <div className="aspect-square rounded-xl bg-muted" />
          <div className="aspect-square rounded-xl bg-muted" />
          <div className="aspect-square rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
