export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            You appear to be offline
          </h1>
          <p className="text-muted-foreground">
            Please check your internet connection and try again.
          </p>
        </div>

        <hr className="border-border" />

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            आप ऑफ़लाइन हैं
          </h2>
          <p className="text-muted-foreground">
            कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          Retry Connection / पुनः प्रयास करें
        </button>
      </div>
    </div>
  );
}
