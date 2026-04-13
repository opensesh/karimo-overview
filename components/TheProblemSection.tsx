"use client";

import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useParallax } from "@/components/ui/ParallaxSection";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { LinkBroken01, Container, Compass01, CurrencyDollar } from "@untitledui/icons";
import { ProblemComparisonCanvas } from "@/components/problem/ProblemComparisonCanvas";

// ---------------------------------------------------------------------------
// Problem card data
// ---------------------------------------------------------------------------

const PROBLEM_CARDS = [
  {
    icon: LinkBroken01,
    title: "Session Isolation",
    description:
      "Each Claude Code session starts with a blank slate. Context from your last session \u2014 decisions made, patterns discovered, architecture established \u2014 is gone. You're re-explaining your project from scratch every time.",
  },
  {
    icon: Container,
    title: "Context Ceiling",
    description:
      "A single session caps at ~200K tokens. For any feature touching more than a few files, you hit the ceiling mid-implementation. The agent forgets earlier decisions and starts contradicting itself.",
  },
  {
    icon: Compass01,
    title: "No Orchestration",
    description:
      "Plan mode helps you think, but doesn't execute across sessions. There's no foreman coordinating the work \u2014 every sub-agent shows up and does their own thing with no awareness of what others built.",
  },
  {
    icon: CurrencyDollar,
    title: "Cost Inefficiency",
    description:
      "Using Opus for a simple file rename. Using Opus for writing a test. Without complexity-based routing, you burn premium tokens on tasks that a lighter model handles just as well.",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TheProblemSection() {
  const { ref: sectionRef, y } = useParallax(30);

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
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
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
              Each session is a silo. No memory between runs, no coordination
              across agents, no way to scale beyond a single context window.
            </motion.p>
          </div>

          {/* Comparison visual */}
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
            <ProblemComparisonCanvas />
          </motion.div>

          {/* Problem cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {PROBLEM_CARDS.map((card) => (
              <motion.div
                key={card.title}
                variants={fadeInUp}
                className="rounded-xl border border-border-secondary bg-bg-secondary p-5"
              >
                <card.icon className="w-5 h-5 text-fg-brand mb-3" />
                <h3 className="text-heading text-base text-fg-primary mb-1.5">
                  {card.title}
                </h3>
                <p className="text-body text-sm text-fg-secondary leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
