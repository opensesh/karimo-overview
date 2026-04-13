"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

// ---------------------------------------------------------------------------
// Scramble text hook — one-shot reveal gated by `enabled`
// ---------------------------------------------------------------------------

const SCRAMBLE_CHARS = "█▓▒░▮▯▰▱▣▤▥▦@#$%^&*_+[]{}|;:<>?~";

function useTextScrambleReveal(
  target: string,
  { duration = 800, delay = 0, enabled = true } = {}
) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number>(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!enabled || hasRun.current) return;

    const timeout = setTimeout(() => {
      hasRun.current = true;
      const start = performance.now();

      function tick() {
        const elapsed = performance.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const revealed = Math.floor(eased * target.length);
        let result = "";

        for (let i = 0; i < target.length; i++) {
          if (i < revealed) {
            result += target[i];
          } else {
            result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        }

        setDisplay(result);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(target);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, target, duration, delay]);

  return display;
}

// ---------------------------------------------------------------------------
// Stats data
// ---------------------------------------------------------------------------

const MIGRATION_STATS = [
  { value: "20",     label: "Tasks" },
  { value: "4",      label: "Waves" },
  { value: "39",     label: "Files Changed" },
  { value: "~4,000", label: "Net Lines Added" },
  { value: "~2.5",   label: "Hours" },
  { value: "67",     label: "Images Compressed" },
];

// ---------------------------------------------------------------------------
// StatItem — each gets its own hook instance
// ---------------------------------------------------------------------------

interface StatItemProps {
  value: string;
  label: string;
  delay: number;
  inView: boolean;
}

function StatItem({ value, label, delay, inView }: StatItemProps) {
  const display = useTextScrambleReveal(value, { delay, enabled: inView });

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className="text-brand-500 text-2xl md:text-3xl font-bold"
        style={{ fontFamily: "var(--font-accent)" }}
      >
        {display}
      </span>
      <span className="text-body text-[11px] text-fg-tertiary uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Underline draw animation — types in from left, then triggers stats
// ---------------------------------------------------------------------------

const LINE_DURATION = 0.5;
const STATS_DELAY_AFTER_LINE = 500; // ms after line completes

// ---------------------------------------------------------------------------
// MigrationStats
// ---------------------------------------------------------------------------

export function MigrationStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });
  const [lineComplete, setLineComplete] = useState(false);

  return (
    <section className="bg-bg-primary relative overflow-hidden">
      <div
        ref={containerRef}
        className="max-w-5xl mx-auto px-6 py-16 md:py-20"
      >
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-body text-sm sm:text-base text-fg-secondary max-w-2xl mb-8"
        >
          We migrated an entire Figma site into a custom Next.js codebase — text,
          images, page structure, sitemap, all of it. KARIMO handled it
          autonomously, start to finish. Not a plan. An execution.
        </motion.p>

        {/* Underline draw effect */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: LINE_DURATION, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => {
            if (isInView) setLineComplete(true);
          }}
          className="h-px bg-border-secondary origin-left mb-8"
        />

        {/* Stats grid — reveals after underline completes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {MIGRATION_STATS.map((stat, i) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              delay={STATS_DELAY_AFTER_LINE + i * 80}
              inView={lineComplete}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
