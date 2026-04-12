"use client";

interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
}

export function SectionHeader({ number, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-(--color-aperol) font-mono text-sm">
          {number}
        </span>
        <div className="h-px w-12 bg-(--color-black50)" />
      </div>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-(--color-black30) text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
