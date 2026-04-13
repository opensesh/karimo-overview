"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <p
        className="font-accent text-sm tracking-widest uppercase"
        style={{ color: "var(--fg-secondary)" }}
      >
        Error
      </p>
      <h1
        className="font-display text-3xl sm:text-4xl font-medium"
        style={{ color: "var(--fg-primary)" }}
      >
        Something went wrong
      </h1>
      <p
        className="text-base max-w-md"
        style={{ color: "var(--fg-secondary)" }}
      >
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        style={{
          background: "var(--button-primary-bg)",
          color: "var(--fg-primary)",
        }}
      >
        Try again
      </button>
    </main>
  );
}
