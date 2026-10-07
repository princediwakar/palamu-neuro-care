"use client";

export default function SeoPageError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-8">
        We encountered an error loading this page. Please try again or contact us.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
