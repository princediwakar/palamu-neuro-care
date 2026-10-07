export default function DoctorsLoading() {
  return (
    <div className="animate-pulse py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto h-[250px] sm:h-[300px] rounded-2xl bg-muted" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="h-8 w-64 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
            <div className="h-4 w-4/6 rounded bg-muted" />
          </div>
          <div className="h-64 sm:h-96 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
