export default function SeoPageLoading() {
  return (
    <div className="animate-pulse">
      <div className="bg-card py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="h-4 w-24 bg-muted rounded mx-auto" />
          <div className="h-10 w-3/4 bg-muted rounded mt-6 mx-auto" />
          <div className="h-5 w-1/2 bg-muted rounded mt-4 mx-auto" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-4">
        <div className="h-6 w-48 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-4/6 bg-muted rounded" />
      </div>
    </div>
  );
}
