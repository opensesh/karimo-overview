"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useParallax } from "@/components/ui/ParallaxSection";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import {
  LinkBroken01,
  Container,
  Compass01,
  CurrencyDollar,
  ChevronDown,
} from "@untitledui/icons";
import { ProblemComparisonCanvas } from "@/components/problem/ProblemComparisonCanvas";

// ---------------------------------------------------------------------------
// Problem card data
// ---------------------------------------------------------------------------

const PROBLEM_CARDS = [
  {
    icon: LinkBroken01,
    title: "Session Isolation",
    description:
      "Every session starts blank. Decisions, patterns, and architecture from the last run are gone — you re-explain your project each time.",
  },
  {
    icon: Container,
    title: "Context Ceiling",
    description:
      "A single session caps at ~200K-1M tokens. Hit the ceiling mid-feature and the agent forgets earlier decisions, contradicting itself.",
  },
  {
    icon: Compass01,
    title: "Limited Orchestration",
    description:
      "Sub-agents work in isolation with limited awareness of what others built. Without shared context, work has duplicates or conflicts.",
  },
  {
    icon: CurrencyDollar,
    title: "Cost Inefficiency",
    description:
      "Opus for a file rename. Opus for a test. Without complexity-based routing, premium tokens burn on tasks a lighter model handles fine.",
  },
];

// ---------------------------------------------------------------------------
// Mobile accordion item
// ---------------------------------------------------------------------------

function ProblemAccordion({
  card,
  index,
  isOpen,
  onToggle,
}: {
  card: (typeof PROBLEM_CARDS)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-border-secondary bg-bg-secondary overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <span className="text-heading text-xs text-fg-tertiary shrink-0 w-5 text-center">
          {String(index + 1).padStart(2, "0")}
        </span>
        <card.icon className="w-5 h-5 text-fg-brand shrink-0" />
        <h3 className="text-heading text-sm text-fg-primary flex-1">
          {card.title}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-fg-tertiary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-body text-sm text-fg-secondary leading-relaxed px-4 pb-4 pt-0">
              {card.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProblemSection() {
  const { ref: sectionRef, y } = useParallax(30);
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasInView = useInView(canvasRef, { margin: "100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      ref={sectionRef}
      id="the-problem"
      className="section-padding min-h-screen bg-bg-primary relative overflow-hidden flex flex-col justify-center"
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      <motion.div style={{ y }} className="relative">
        {/* Header — constrained width */}
        <div className="max-w-5xl mx-auto px-6 mb-8">
          <SectionLabel>THE PROBLEM</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-primary mt-4"
          >
            Plan Mode Doesn&apos;t Scale
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-body text-base text-fg-secondary mt-3 max-w-2xl"
          >
            Plan mode works great for boilerplate code. The limiting factor is{" "}
            <a
              href="https://en.wikipedia.org/wiki/Attention_Is_All_You_Need"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-fg-primary transition-colors"
            >
              quadratic attention
            </a>
            , and the workaround is harness engineering. With higher task complexity and duration, we need shared and optimized context for humans and agents.
          </motion.p>
        </div>

        {/* Comparison visual — constrained width */}
        <div ref={canvasRef} className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mb-12"
          >
            <ProblemComparisonCanvas paused={!canvasInView} />
          </motion.div>
        </div>

        {/* Problem cards — same max-width as content above */}
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          >
            {PROBLEM_CARDS.map((card, i) => (
              <motion.div key={card.title} variants={fadeInUp}>
                <ProblemAccordion
                  card={card}
                  index={i}
                  isOpen={openIndex === i}
                  onToggle={() =>
                    setOpenIndex(openIndex === i ? null : i)
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
