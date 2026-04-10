"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useParallax } from "@/components/ui/ParallaxSection";

const contextLayers = [
  {
    id: "l0",
    label: "L0",
    name: "Agent Overview",
    tokens: "~500",
    description:
      "KARIMO configuration digest — agent topology, available commands, workflow shape. Always loaded, near-zero cost.",
    contents: ["Agent types", "Commands & skills", "Workflow shape"],
    alwaysLoaded: true,
  },
  {
    id: "l1",
    label: "L1",
    name: "PRD & Execution Plan",
    tokens: "~2k",
    description:
      "Wave-based execution plan, task dependencies, and branch strategy. Loaded when the PM agent begins orchestration.",
    contents: ["Task graph", "Wave ordering", "Branch strategy"],
    alwaysLoaded: false,
  },
  {
    id: "l2",
    label: "L2",
    name: "Task Briefs",
    tokens: "~5k",
    description:
      "Self-contained task brief with scope, constraints, and target agent. Loaded per-task inside an isolated worktree.",
    contents: ["Scope & constraints", "Target agent", "Review gate"],
    alwaysLoaded: false,
  },
];

// Comparison data: typical plan mode vs KARIMO (200k window)
const WINDOW_SIZE = 200000;

const comparisonData = {
  typical: {
    label: "Typical Plan Mode",
    totalConsumed: 55000,
    breakdown: [
      { label: "MCP servers", tokens: "~25k" },
      { label: "System prompt", tokens: "~8k" },
      { label: "Plan mode overhead", tokens: "~22k" },
    ],
  },
  karimo: {
    label: "KARIMO",
    totalConsumed: 7500,
    breakdown: [
      { label: "Lean init", tokens: "~2k" },
      { label: "Layered context", tokens: "~5.5k" },
    ],
  },
};

// Terminal preview content per layer — real KARIMO examples
const terminalContent: Record<string, { filename: string; lines: string[] }> = {
  l0: {
    filename: "@CLAUDE.md",
    lines: [
      "# KARIMO Agent Configuration",
      "",
      "agents:     12 specialized (PM, reviewer, ...)",
      "commands:   plan, run, merge, research",
      "skills:     code-standards, testing, docs",
      "",
      ".karimo/prds/        → PRD artifacts",
      ".claude/commands/    → slash commands",
      ".claude/skills/      → auto-activate skills",
      "",
      "workflow:  research → plan → run → merge",
      "isolation: git worktree per task",
      "review:    Greptile + model escalation",
    ],
  },
  l1: {
    filename: "execution_plan.yaml",
    lines: [
      "# PRD: 001_user-auth",
      "",
      "waves:",
      "  - id: wave-1",
      "    tasks:",
      "      - 1a_auth-schema    # complexity: 3",
      "      - 1b_session-store  # complexity: 2",
      "",
      "  - id: wave-2",
      "    depends_on: [wave-1]",
      "    tasks:",
      "      - 2a_login-flow     # complexity: 5",
      "      - 2b_oauth-provider # complexity: 4",
      "",
      "branch: feature/user-auth",
      "merge_strategy: single PR to main",
    ],
  },
  l2: {
    filename: "briefs/1a_auth-schema.md",
    lines: [
      "// Task Brief — Auto-generated",
      "",
      "task:        1a_auth-schema",
      "agent:       karimo-implementer",
      "complexity:  3",
      "depends_on:  []",
      "",
      "## Scope",
      "- Create users table migration",
      "- Add session token schema",
      "- Wire Supabase RLS policies",
      "",
      "## Constraints",
      "- Must pass karimo-pm-reviewer",
      "- Worktree: .worktrees/1a_auth-schema",
    ],
  },
};

export function ContextSection() {
  const { ref: sectionRef, y } = useParallax(30);
  const [activeLayer, setActiveLayer] = useState("l0");

  return (
    <section ref={sectionRef} id="context" className="section-padding min-h-screen bg-bg-secondary overflow-hidden">
      <motion.div style={{ y }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10 md:mb-12">
          <SectionLabel>CONTEXT</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-primary mt-4 max-w-3xl"
          >
            Compressed Architecture
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-body text-fg-secondary mt-4 max-w-2xl text-lg"
          >
            Most agent frameworks dump entire files into the context window. KARIMO
            uses a three-layer progressive disclosure model built on the{" "}
            <a
              href="https://github.com/volcengine/OpenViking"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-brand hover:underline"
            >
              OpenViking
            </a>{" "}
            protocol by ByteDance — loading only what the agent needs, when it needs it.
          </motion.p>
        </div>

        {/* Token comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <TokenComparison />
        </motion.div>

        {/* Layer explorer — terminal LEFT, accordion RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Terminal preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-8"
          >
            <ContextTerminalPreview activeLayer={activeLayer} />
          </motion.div>

          {/* Right: Accordion layer cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {contextLayers.map((layer) => {
              const isExpanded = activeLayer === layer.id;

              return (
                <div
                  key={layer.id}
                  className={`
                    rounded-lg overflow-hidden transition-colors duration-200
                    bg-bg-primary border
                    ${isExpanded ? "border-border-primary" : "border-border-secondary"}
                  `}
                >
                  {/* Header button */}
                  <button
                    onClick={() => setActiveLayer(layer.id)}
                    className="w-full flex items-center justify-between px-6 py-6 md:px-8 md:py-7 text-left cursor-pointer"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`
                          text-accent text-xs font-bold px-2 py-0.5 rounded
                          ${isExpanded ? "bg-bg-brand-solid text-fg-primary" : "bg-bg-secondary text-fg-tertiary"}
                        `}
                      >
                        {layer.label}
                      </span>
                      <h3 className="text-display text-lg md:text-xl text-fg-primary">
                        {layer.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-accent text-xs text-fg-tertiary font-mono hidden sm:block">
                        {layer.tokens}
                      </span>
                      <div
                        className={`
                          flex-shrink-0 w-8 h-8 flex items-center justify-center
                          rounded-lg transition-colors duration-200
                          ${isExpanded
                            ? "bg-bg-brand-solid border border-transparent"
                            : "border border-border-secondary"
                          }
                        `}
                      >
                        <span className="text-fg-primary text-sm leading-none select-none">
                          {isExpanded ? "−" : "+"}
                        </span>
                      </div>
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
                          <p className="text-body text-sm text-fg-secondary leading-relaxed mb-4">
                            {layer.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {layer.contents.map((item) => (
                              <span
                                key={item}
                                className="text-body text-xs px-2 py-1 rounded bg-bg-secondary text-fg-primary"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
      </motion.div>
    </section>
  );
}

function TokenComparison() {
  const { typical, karimo } = comparisonData;
  const typicalPercent = (typical.totalConsumed / WINDOW_SIZE) * 100;
  const karimoPercent = (karimo.totalConsumed / WINDOW_SIZE) * 100;
  const ratio = Math.round(typical.totalConsumed / karimo.totalConsumed);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Typical plan mode */}
      <div className="rounded-xl p-5 md:p-6 bg-bg-primary border border-border-secondary">
        <div className="flex items-center justify-between mb-3">
          <span className="text-display text-sm text-fg-primary">{typical.label}</span>
          <span className="font-mono text-xs text-[#ff5f56]">
            {(typical.totalConsumed / 1000).toFixed(0)}k / {(WINDOW_SIZE / 1000).toFixed(0)}k
          </span>
        </div>
        <div className="h-4 rounded-full bg-bg-tertiary overflow-hidden mb-3 relative">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full bg-[#ff5f56]"
            initial={{ width: 0 }}
            whileInView={{ width: `${typicalPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {typical.breakdown.map((seg) => (
            <span
              key={seg.label}
              className="text-body text-xs px-2 py-0.5 rounded bg-[#ff5f56]/10 text-[#ff5f56]"
            >
              {seg.label} {seg.tokens}
            </span>
          ))}
        </div>
      </div>

      {/* KARIMO */}
      <div className="rounded-xl p-5 md:p-6 bg-bg-primary border border-border-primary">
        <div className="flex items-center justify-between mb-3">
          <span className="text-display text-sm text-fg-primary">{karimo.label}</span>
          <span className="font-mono text-xs text-[#27c93f]">
            {(karimo.totalConsumed / 1000).toFixed(1)}k / {(WINDOW_SIZE / 1000).toFixed(0)}k
          </span>
        </div>
        <div className="h-4 rounded-full bg-bg-tertiary overflow-hidden mb-3 relative">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full bg-[#27c93f]"
            initial={{ width: 0 }}
            whileInView={{ width: `${karimoPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {karimo.breakdown.map((seg) => (
            <span
              key={seg.label}
              className="text-body text-xs px-2 py-0.5 rounded bg-[#27c93f]/10 text-[#27c93f]"
            >
              {seg.label} {seg.tokens}
            </span>
          ))}
          <span className="text-body text-xs text-fg-tertiary ml-1">
            ~{ratio}x less
          </span>
        </div>
      </div>
    </div>
  );
}

function ContextTerminalPreview({ activeLayer }: { activeLayer: string }) {
  const layer = contextLayers.find((l) => l.id === activeLayer) || contextLayers[0];
  const content = terminalContent[activeLayer] || terminalContent.l0;

  return (
    <div className="rounded-xl overflow-hidden border border-border-secondary flex flex-col h-[500px]">
      {/* macOS title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-bg-secondary border-b border-border-secondary">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={content.filename}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-accent text-xs text-fg-tertiary ml-2"
          >
            {content.filename}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Terminal body */}
      <div className="bg-[#0a0a0a] p-6 font-mono text-xs sm:text-sm leading-loose overflow-x-auto flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLayer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {content.lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className={`whitespace-pre ${getContextLineColor(line, activeLayer)}`}
              >
                {line || "\u00A0"}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Token budget footer */}
      <div className="px-4 py-2.5 bg-bg-secondary border-t border-border-secondary">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-fg-tertiary font-mono">context budget</span>
          <span className="text-xs text-fg-primary font-mono">
            {layer.tokens} / 200k
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#27c93f]"
            animate={{
              width:
                activeLayer === "l0"
                  ? "0.25%"
                  : activeLayer === "l1"
                    ? "1.25%"
                    : "3.75%",
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

function getContextLineColor(line: string, layer: string): string {
  // Comments
  if (line.startsWith("//") || line.startsWith("#")) return "text-fg-primary";

  // Section markers
  if (line.startsWith("##")) return "text-fg-brand";

  // YAML keys
  if (line.includes(":") && !line.startsWith(" ") && !line.startsWith("-"))
    return "text-fg-brand";

  // Indented YAML keys (wave tasks, nested config)
  if (line.match(/^\s+- id:/) || line.match(/^\s+\w+:/))
    return "text-fg-secondary";

  // Task/agent references
  if (line.includes("karimo-") || line.includes("complexity"))
    return "text-[#27c93f]";

  // Inline comments
  if (line.includes("#") && !line.startsWith("#"))
    return "text-fg-tertiary";

  // Directory paths and arrows
  if (line.includes("→") || line.startsWith("."))
    return "text-fg-secondary";

  // List items
  if (line.startsWith("- ") || line.startsWith("  -"))
    return "text-fg-secondary";

  return "text-fg-secondary";
}
