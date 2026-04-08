"use client";

interface ArrowProps {
  direction?: "right" | "down";
  animated?: boolean;
  className?: string;
}

export function Arrow({ direction = "right", animated = false, className = "" }: ArrowProps) {
  const rotation = direction === "down" ? "rotate-90" : "";

  return (
    <svg
      className={`w-6 h-6 ${rotation} ${animated ? "animate-pulse-slow" : ""} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function FlowArrow({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-6 overflow-hidden ${className}`}>
      <svg
        className="w-full h-6 text-[var(--color-black50)]"
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="12"
          x2="90"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <polygon points="90,6 100,12 90,18" fill="currentColor" />
      </svg>
      <div className="absolute inset-0 animate-flow">
        <div className="h-full w-8 bg-gradient-to-r from-transparent via-[var(--color-aperol)] to-transparent opacity-50" />
      </div>
    </div>
  );
}
