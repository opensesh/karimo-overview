"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PhaseId, PhaseDescription as PhaseDescriptionType } from "@/lib/constants";

interface PhaseDescriptionProps {
  activePhase: PhaseId;
  descriptions: Record<PhaseId, PhaseDescriptionType>;
}

export function PhaseDescription({ activePhase, descriptions }: PhaseDescriptionProps) {
  const desc = descriptions[activePhase];

  return (
    <div className="mt-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-lg bg-bg-tertiary border border-border-secondary p-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: title + description */}
            <div>
              <p
                className="text-fg-brand text-[10px] font-semibold uppercase tracking-widest mb-2"
                style={{ fontFamily: "var(--font-accent, sans-serif)" }}
              >
                {desc.title}
              </p>
              <p
                className="text-fg-secondary text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {desc.description}
              </p>
            </div>

            {/* Right: how it works */}
            <div>
              <p
                className="text-fg-tertiary text-[10px] font-semibold uppercase tracking-widest mb-2"
                style={{ fontFamily: "var(--font-accent, sans-serif)" }}
              >
                How It Works
              </p>
              <ul className="space-y-1.5">
                {desc.howItWorks.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-fg-brand text-[11px] mt-px flex-shrink-0">→</span>
                    <span
                      className="text-fg-secondary text-[12px] leading-relaxed"
                      style={{ fontFamily: "var(--font-mono, monospace)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
