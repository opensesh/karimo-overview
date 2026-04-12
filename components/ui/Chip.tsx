"use client";

interface ChipProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "muted";
  size?: "sm" | "md";
}

export function Chip({ children, variant = "default", size = "md" }: ChipProps) {
  const variants = {
    default: "bg-(--color-black80) text-(--color-vanilla)",
    accent: "bg-(--color-aperol) text-(--color-vanilla)",
    muted: "bg-(--color-black70) text-(--color-black30)",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}
