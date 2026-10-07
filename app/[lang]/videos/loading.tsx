export default function VideosLoading() {
  return (
    <div className="animate-pulse py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto h-[250px] sm:h-[300px] rounded-2xl bg-muted" />
        <div className="mt-12">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-muted" style={{ paddingBottom: "56.25%" }} />
            <div className="rounded-lg bg-muted" style={{ paddingBottom: "56.25%" }} />
            <div className="rounded-lg bg-muted" style={{ paddingBottom: "56.25%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
