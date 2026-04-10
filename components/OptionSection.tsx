"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adoptionPhases } from "@/lib/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Chip } from "@/components/ui/Chip";
import { useParallax } from "@/components/ui/ParallaxSection";

// ---------------------------------------------------------------------------
// Terminal preview content per phase
// ---------------------------------------------------------------------------

const terminalPreviews: Record<number, { command: string; lines: string[] }> = {
  1: {
    command: "/karimo:run --prd framer-cms-migration",
    lines: [
      "◆ Loading PRD: framer-cms-migration",
      "  20 tasks across 4 waves",
      "",
      "Wave 1 — Foundation (4 tasks, 13 complexity)",
      "├─ T001  Image download script      ████████████ done",
      "├─ T002  TypeScript schemas          ████████████ done",
      "├─ T003  Content directory structure  ████████████ done",
      "└─ T004  next.config.ts update       ████████████ done",
      "",
      "Wave 2 — Content Migration (5 tasks)",
      "├─ T005  Migrate 5 projects          ██████░░░░░░ running",
      "├─ T006  Convert blog HTML→MDX       ░░░░░░░░░░░░ queued",
      "├─ T007  Free resources + assets     ░░░░░░░░░░░░ queued",
      "├─ T008  Legal pages                 ░░░░░░░░░░░░ queued",
      "└─ T013  Playbook scaffolding        ░░░░░░░░░░░░ queued",
      "",
      "✓ 4/20 tasks complete · Wave 1 PR merged",
    ],
  },
  2: {
    command: "/karimo:run --prd framer-cms-migration --review",
    lines: [
      "◆ Review gate enabled (Greptile + Claude)",
      "",
      "T005  Migrate 5 projects  ·  PR #42",
      "├─ Greptile review ········· 3 findings (1 P1, 2 P3)",
      "│  P1: Missing alt text on hero images",
      "│  → Auto-fix applied (revision 1/3)",
      "├─ Claude review ··········· approved",
      "├─ Revision loop ··········· 1 revision, passed",
      "└─ Status: ✓ merged",
      "",
      "T006  Convert blog HTML→MDX  ·  PR #43",
      "├─ Greptile review ········· 5 findings (2 P1, 3 P2)",
      "│  P1: Unclosed JSX tags in post-3.mdx",
      "│  P1: Missing frontmatter fields",
      "│  → Escalating Sonnet → Opus",
      "├─ Revision loop ··········· 2 revisions, passed",
      "└─ Status: ✓ merged",
    ],
  },
  3: {
    command: "/karimo:dashboard --prd framer-cms-migration",
    lines: [
      "┌─────────────────────────────────────────┐",
      "│  KARIMO Dashboard · framer-cms-migration │",
      "├─────────────────────────────────────────┤",
      "│  Status:    COMPLETE                     │",
      "│  Progress:  20/20 tasks (100%)           │",
      "│  Waves:     4/4 complete                 │",
      "│  Branch:    feat/framer-cms-migration    │",
      "├─────────────────────────────────────────┤",
      "│  Wave 1  ████████████████  4/4  ✓       │",
      "│  Wave 2  ████████████████  5/5  ✓       │",
      "│  Wave 3  ████████████████  7/7  ✓       │",
      "│  Wave 4  ████████████████  4/4  ✓       │",
      "├─────────────────────────────────────────┤",
      "│  Reviews:   12 passed, 0 blocked         │",
      "│  Revisions: 8 total (avg 0.4/task)       │",
      "│  Escalations: 2 (Sonnet → Opus)          │",
      "└─────────────────────────────────────────┘",
    ],
  },
};

// ---------------------------------------------------------------------------
// OptionSection
// ---------------------------------------------------------------------------

export function OptionSection() {
  const { ref: sectionRef, y } = useParallax(30);
  const [expandedPhase, setExpandedPhase] = useState(1);

  const togglePhase = (phase: number) => {
    if (expandedPhase === phase) return;
    setExpandedPhase(phase);
  };

  const activePreview = terminalPreviews[expandedPhase] || terminalPreviews[1];

  return (
    <section ref={sectionRef} id="adoption" className="section-padding min-h-screen bg-bg-primary overflow-hidden">
      <motion.div style={{ y }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <SectionLabel>OPTION</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-primary mt-4"
          >
            Three-Phased Approach
          </motion.h2>
        </div>

        {/* Two-panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left: Accordion cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {adoptionPhases.map((phase) => {
              const isExpanded = expandedPhase === phase.phase;

              return (
                <div
                  key={phase.phase}
                  className={`
                    rounded-lg overflow-hidden transition-colors duration-200
                    bg-bg-secondary border
                    ${isExpanded ? "border-border-primary" : "border-border-secondary"}
                  `}
                >
                  {/* Header button */}
                  <button
                    onClick={() => togglePhase(phase.phase)}
                    className="w-full flex items-center justify-between px-6 py-5 md:px-8 md:py-6 text-left cursor-pointer"
                    aria-expanded={isExpanded}
                  >
                    <h3 className="text-display text-xl md:text-2xl text-fg-primary">
                      <span className="text-fg-tertiary mr-2">{phase.phase}.</span>
                      {phase.title}
                    </h3>
                    <div
                      className={`
                        flex-shrink-0 w-10 h-10 flex items-center justify-center
                        rounded-lg transition-colors duration-200
                        ${isExpanded
                          ? "bg-bg-brand-solid border border-transparent"
                          : "border border-border-secondary"
                        }
                      `}
                    >
                      <span className="text-fg-primary text-lg leading-none select-none">
                        {isExpanded ? "−" : "+"}
                      </span>
                    </div>
                  </button>

                  {/* Collapsible content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 md:px-8 md:pb-8">
                          <p className="text-body text-fg-secondary mb-6 leading-relaxed">
                            {phase.description}
                          </p>

                          {/* Feature chips */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            {phase.features.map((feature) => (
                              <Chip key={feature} variant="default" size="sm">
                                {feature}
                              </Chip>
                            ))}
                          </div>

                          {/* Objective */}
                          <div className="p-4 rounded-lg bg-bg-tertiary border border-border-secondary">
                            <span className="text-accent text-xs text-fg-tertiary uppercase tracking-wider">
                              Objective
                            </span>
                            <p className="text-body text-fg-primary mt-1">
                              {phase.objective}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>

          {/* Right: Terminal preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <TerminalPreview
              command={activePreview.command}
              lines={activePreview.lines}
              phase={expandedPhase}
            />
          </motion.div>
        </div>

      </div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// TerminalPreview
// ---------------------------------------------------------------------------

function TerminalPreview({
  command,
  lines,
  phase,
}: {
  command: string;
  lines: string[];
  phase: number;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-border-secondary flex flex-col h-full">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-bg-secondary border-b border-border-secondary">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-accent text-xs text-fg-tertiary ml-2">
          Phase {phase}
        </span>
      </div>

      {/* Terminal body */}
      <div className="bg-[#0a0a0a] p-4 sm:p-5 font-mono text-[11px] sm:text-xs leading-relaxed overflow-hidden flex-1">
        {/* Command prompt */}
        <div className="mb-3 break-all">
          <span className="text-fg-brand">$</span>{" "}
          <span className="text-fg-primary">{command}</span>
        </div>

        {/* Output lines */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className={`whitespace-pre-wrap ${getLineColor(line)}`}
              >
                {line || "\u00A0"}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function getLineColor(line: string): string {
  if (line.startsWith("✓") || line.includes("done") || line.includes("✓")) {
    return "text-[#27c93f]";
  }
  if (line.includes("running") || (line.includes("██") && line.includes("░"))) {
    return "text-fg-brand";
  }
  if (line.includes("queued") || line.includes("░░░░")) {
    return "text-fg-tertiary";
  }
  if (line.startsWith("◆") || line.startsWith("│") || line.startsWith("┌") || line.startsWith("├") || line.startsWith("└")) {
    return "text-fg-secondary";
  }
  if (line.includes("P1:") || line.includes("→")) {
    return "text-fg-secondary";
  }
  if (line.includes("Wave") || line.includes("KARIMO")) {
    return "text-fg-primary";
  }
  return "text-fg-secondary";
}
