import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <p
        className="font-accent text-sm tracking-widest uppercase"
        style={{ color: "var(--fg-secondary)" }}
      >
        404
      </p>
      <h1
        className="font-display text-3xl sm:text-4xl font-medium"
        style={{ color: "var(--fg-primary)" }}
      >
        Page not found
      </h1>
      <p
        className="text-base max-w-md"
        style={{ color: "var(--fg-secondary)" }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        style={{
          background: "var(--button-primary-bg)",
          color: "var(--fg-primary)",
        }}
      >
        Back to home
      </Link>
    </main>
  );
}
