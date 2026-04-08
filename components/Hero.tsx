"use client";

import { stats } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-black)] to-[var(--color-charcoal)] -z-10" />

      {/* Content */}
      <div className="max-w-4xl">
        {/* Tag */}
        <div className="mb-6 opacity-0 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-black80)] text-[var(--color-black30)] text-sm font-mono">
            <span className="w-2 h-2 rounded-full bg-[var(--color-aperol)]" />
            Open Source
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 opacity-0 animate-fade-in-up stagger-1">
          KARIMO{" "}
          <span className="text-[var(--color-aperol)]">Unpacked</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-[var(--color-black30)] max-w-2xl mb-12 opacity-0 animate-fade-in-up stagger-2">
          What happens when you run{" "}
          <code className="px-2 py-0.5 bg-[var(--color-black80)] rounded text-[var(--color-vanilla)] font-mono text-lg">
            /karimo:plan
          </code>
          ? PRD interviews, agent orchestration, automated review—mapped step by step.
        </p>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-6 md:gap-10 opacity-0 animate-fade-in-up stagger-3">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold text-[var(--color-vanilla)]">
                {stat.value}
              </span>
              <span className="text-[var(--color-black50)] font-mono text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in-up stagger-4">
        <div className="flex flex-col items-center gap-2 text-[var(--color-black50)]">
          <span className="text-xs font-mono">SCROLL</span>
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
