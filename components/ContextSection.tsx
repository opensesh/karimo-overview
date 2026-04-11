"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useParallax } from "@/components/ui/ParallaxSection";
import { Modal } from "@/components/ui/Modal";
import { FileTree } from "@/components/vscode/FileTree";
import { EditorPanel } from "@/components/vscode/EditorPanel";
import type { FileNode } from "@/lib/vscode-data";

// ---------------------------------------------------------------------------
// Data: Three-layer progressive disclosure
// ---------------------------------------------------------------------------

const contextLayers = [
  {
    id: "l0",
    label: "L0",
    name: "Abstracts",
    tokens: "~100",
    description:
      "One-line summaries per agent, command, and skill. Used to verify items exist before loading more. Near-zero cost.",
    contents: ["Agent names", "Command signatures", "Skill identifiers"],
    alwaysLoaded: true,
  },
  {
    id: "l1",
    label: "L1",
    name: "Overviews",
    tokens: "~2k",
    description:
      "Category digests for agents, commands, and skills. Loaded at session start to discover what's available.",
    contents: ["Agent topology", "Command catalog", "Skill inventory"],
    alwaysLoaded: true,
  },
  {
    id: "l2",
    label: "L2",
    name: "Full Definitions",
    tokens: "~5k",
    description:
      "Complete agent, command, or skill file — loaded only when a specific agent is spawned or command is invoked.",
    contents: ["Agent instructions", "Command logic", "Skill knowledge"],
    alwaysLoaded: false,
  },
];

// Comparison data: basic plan mode vs KARIMO (framework context overhead)
const comparisonData = {
  planMode: {
    label: "Basic Plan Mode",
    totalConsumed: 48000,
    breakdown: [
      { label: "22 agent definitions", tokens: "~30k" },
      { label: "11 command files", tokens: "~10k" },
      { label: "9 skill files", tokens: "~8k" },
    ],
  },
  karimo: {
    label: "KARIMO Progressive",
    totalConsumed: 7500,
    breakdown: [
      { label: "Abstracts (L0)", tokens: "~100" },
      { label: "Overviews (L1)", tokens: "~2k" },
      { label: "On-demand (L2)", tokens: "~5.5k" },
    ],
  },
};

// Terminal preview content per layer
const terminalContent: Record<string, { filename: string; lines: string[] }> = {
  l0: {
    filename: "KARIMO_RULES.md",
    lines: [
      "# KARIMO Abstracts",
      "",
      "karimo-pm            → orchestration",
      "karimo-implementer   → code (≤4)",
      "karimo-implementer-opus → code (5+)",
      "karimo-interviewer   → PRD interviews",
      "karimo-brief-writer  → task briefs",
      "karimo-reviewer      → PRD validation",
      "...22 agents total",
    ],
  },
  l1: {
    filename: "agents.overview.md",
    lines: [
      "# Agent Overview — 22 agents",
      "",
      "Coordination:  pm, interviewer, investigator",
      "Research:      researcher, refiner",
      "Briefs:        brief-writer, reviewer, corrector",
      "Implementation: implementer, implementer-opus",
      "Testing:       tester, tester-opus",
      "Docs:          documenter, documenter-opus",
      "Integration:   review-architect, feedback-auditor",
      "Finalization:  pm-finalizer, pm-reviewer",
    ],
  },
  l2: {
    filename: ".claude/plugins/karimo/agents/karimo-implementer.md",
    lines: [
      "// Agent: karimo-implementer",
      "// Complexity: 1–4 (Sonnet)",
      "",
      "## Role",
      "Execute coding tasks from KARIMO PRDs.",
      "Write production code, follow existing patterns.",
      "",
      "## Tools",
      "Read, Write, Edit, Bash, Glob, Grep",
      "",
      "## Constraints",
      "- Must pass karimo-pm-reviewer",
      "- Worktree: .worktrees/{task-id}",
    ],
  },
};

// ---------------------------------------------------------------------------
// Data: Context multiplication pipeline + modal subtrees
// ---------------------------------------------------------------------------

const stageModalData: Record<string, { title: string; description: string; tree: FileNode; defaultFile: string; defaultTabs: string[] }> = {
  research: {
    title: "Research Output",
    description: "KARIMO scans your codebase and the web, producing structured findings that seed every downstream artifact.",
    tree: {
      name: "research",
      type: "directory",
      children: [
        { name: "summary.md", type: "file", contentKey: "research-summary" },
        { name: "findings.md", type: "file", contentKey: "research-findings" },
        { name: "meta.json", type: "file", contentKey: "research-meta" },
        {
          name: "internal",
          type: "directory",
          children: [
            { name: "structure.md", type: "file", contentKey: "internal-structure" },
            { name: "dependencies.md", type: "file", contentKey: "internal-deps" },
            { name: "patterns.md", type: "file", contentKey: "internal-patterns" },
            { name: "errors.md", type: "file", contentKey: "internal-errors" },
          ],
        },
        {
          name: "external",
          type: "directory",
          children: [
            { name: "best-practices.md", type: "file", contentKey: "external-practices" },
            { name: "libraries.md", type: "file", contentKey: "external-libs" },
            { name: "references.md", type: "file", contentKey: "external-refs" },
            { name: "sources.yaml", type: "file", contentKey: "external-sources" },
          ],
        },
      ],
    },
    defaultFile: "research-summary",
    defaultTabs: ["research-summary"],
  },
  prd: {
    title: "PRD & Execution Plan",
    description: "Your answers + research findings become a structured PRD with tasks, waves, and dependencies.",
    tree: {
      name: ".karimo/prds/002_framer-cms-migration",
      type: "directory",
      children: [
        { name: "PRD_framer-cms-migration.md", type: "file", contentKey: "prd" },
        { name: "tasks.yaml", type: "file", contentKey: "tasks" },
        { name: "execution_plan.yaml", type: "file", contentKey: "execution" },
        { name: "status.json", type: "file", contentKey: "status" },
      ],
    },
    defaultFile: "prd",
    defaultTabs: ["prd"],
  },
  briefs: {
    title: "Task Briefs",
    description: "Each task gets a self-contained brief with only the scope, constraints, and findings it needs.",
    tree: {
      name: "briefs",
      type: "directory",
      children: [
        { name: "briefs.overview.md", type: "file", contentKey: "briefs-overview" },
        { name: "T001_image-download-script.md", type: "file", contentKey: "brief-t001" },
        { name: "T002_typescript-schemas.md", type: "file", contentKey: "brief-t002" },
        { name: "T005_framer-cms-migration.md", type: "file", contentKey: "brief-t005" },
        { name: "T006_framer-cms-migration.md", type: "file", contentKey: "brief-t006" },
        { name: "T010_project-detail-page.md", type: "file", contentKey: "brief-t010" },
        { name: "T011_blog-mdx-renderer.md", type: "file", contentKey: "brief-t011" },
        { name: "T016_seo-metadata.md", type: "file", contentKey: "brief-t016" },
        { name: "T020_about-images.md", type: "file", contentKey: "brief-t020" },
      ],
    },
    defaultFile: "briefs-overview",
    defaultTabs: ["briefs-overview"],
  },
  worktrees: {
    title: "Parallel Worktrees",
    description: "Each brief spawns a fresh agent in its own worktree with a clean 1M window. The full project context is available.",
    tree: {
      name: ".karimo/prds/002_framer-cms-migration",
      type: "directory",
      children: [
        { name: "PRD_framer-cms-migration.md", type: "file", contentKey: "prd" },
        { name: "status.json", type: "file", contentKey: "status" },
        { name: "tasks.yaml", type: "file", contentKey: "tasks" },
        { name: "execution_plan.yaml", type: "file", contentKey: "execution" },
        { name: "metrics.json", type: "file", contentKey: "metrics" },
        {
          name: "briefs",
          type: "directory",
          children: [
            { name: "briefs.overview.md", type: "file", contentKey: "briefs-overview" },
            { name: "T001_image-download-script.md", type: "file", contentKey: "brief-t001" },
            { name: "T002_typescript-schemas.md", type: "file", contentKey: "brief-t002" },
          ],
        },
        {
          name: "research",
          type: "directory",
          children: [
            { name: "summary.md", type: "file", contentKey: "research-summary" },
            { name: "findings.md", type: "file", contentKey: "research-findings" },
          ],
        },
      ],
    },
    defaultFile: "status",
    defaultTabs: ["status"],
  },
};

// Collect all paths from a FileNode tree for pre-revealing
function collectPaths(node: FileNode, parentPath = ""): string[] {
  const path = parentPath ? `${parentPath}/${node.name}` : node.name;
  const paths = [path];
  if (node.children) {
    for (const child of node.children) {
      paths.push(...collectPaths(child, path));
    }
  }
  return paths;
}

const multiplicationStages = [
  {
    id: "research",
    label: "Research",
    description: "Scans your codebase and the web. Produces findings.md — patterns, conventions, and external context that agents would otherwise have to rediscover.",
    chips: ["findings.md", "conventions", "API docs"],
    multiplier: "1x",
  },
  {
    id: "prd",
    label: "PRD Interview",
    description: "Your answers + research findings become a structured PRD with tasks, waves, and dependencies. Context is distilled, not duplicated.",
    chips: ["PRD.md", "tasks.yaml", "execution plan"],
    multiplier: "4x",
  },
  {
    id: "briefs",
    label: "Task Briefs",
    description: "Each task gets a self-contained brief with only what it needs — scope, constraints, and findings relevant to that task. No cross-contamination.",
    chips: ["10+ isolated briefs", "scoped findings"],
    multiplier: "10x+",
  },
  {
    id: "worktrees",
    label: "Parallel Worktrees",
    description: "Each brief spawns a fresh agent in its own worktree with a clean 1M window. Waves run in parallel — context compounds across every session.",
    chips: ["1 window per task", "wave-parallel"],
    multiplier: "NxM",
  },
];

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function ContextSection() {
  const { ref: sectionRef, y } = useParallax(30);
  const [activeLayer, setActiveLayer] = useState("l0");

  return (
    <section ref={sectionRef} id="context" className="section-padding bg-bg-secondary overflow-hidden">
      <motion.div style={{ y }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-10 md:mb-12">
          <SectionLabel>CONTEXT</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-primary mt-4 max-w-3xl"
          >
            Thoughtful Architecture
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-body text-fg-secondary mt-4 max-w-2xl text-lg"
          >
            KARIMO is built around context optimization. There are three ways we achieve this:
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 space-y-2.5 max-w-2xl"
          >
            {[
              { name: "Progressive Disclosure", desc: "load abstracts before overviews, overviews before full definitions" },
              { name: "Context Multiplication", desc: "structure workflows so every session builds on the last" },
              { name: "Compound Learning", desc: "capture feedback that persists across every future PRD" },
            ].map((item, i) => (
              <div key={item.name} className="flex items-baseline gap-3">
                <span className="text-accent text-[10px] font-bold px-1.5 py-0.5 rounded bg-bg-brand-solid text-fg-primary shrink-0">
                  {i + 1}
                </span>
                <p className="text-body text-base text-fg-secondary">
                  <span className="text-fg-primary font-medium">{item.name}</span>
                  {" — "}{item.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── PART 1: Progressive Disclosure ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <span className="text-accent text-xs font-bold text-fg-tertiary uppercase tracking-wider">
            Part 1
          </span>
          <h3 className="text-display text-xl md:text-2xl text-fg-primary mt-2">
            Progressive Disclosure
          </h3>
          <p className="text-body text-fg-secondary mt-2 max-w-xl">
            Built on the{" "}
            <a
              href="https://github.com/volcengine/OpenViking"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-brand hover:underline"
            >
              OpenViking
            </a>{" "}
            protocol — agents load abstracts first, overviews second, and full
            definitions only when executing. No wasted tokens.
          </p>
        </motion.div>

        {/* Framework overhead comparison — side by side on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <TokenComparison />
        </motion.div>

        {/* Layer explorer — terminal LEFT, accordion RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch mb-32 md:mb-40">
          {/* Left: Terminal preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
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

        {/* ── PART 2: Context Multiplication ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <span className="text-accent text-xs font-bold text-fg-tertiary uppercase tracking-wider">
            Part 2
          </span>
          <h3 className="text-display text-xl md:text-2xl text-fg-primary mt-2">
            Context Multiplication
          </h3>
          <p className="text-body text-fg-secondary mt-2 max-w-xl">
            Each stage distills knowledge into artifacts that seed the next.
            A single 1M window becomes many focused sessions — research
            compounds, agents never start cold, and no two worktrees
            compete for the same context.
          </p>
        </motion.div>

        <ContextMultiplicationViz />

        {/* ── PART 3: Compound Learning ── */}
        <div className="mt-32 md:mt-40">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            <span className="text-accent text-xs font-bold text-fg-tertiary uppercase tracking-wider">
              Part 3
            </span>
            <h3 className="text-display text-xl md:text-2xl text-fg-primary mt-2">
              Compound Learning
            </h3>
            <p className="text-body text-fg-secondary mt-2 max-w-xl">
              At any point, run {" "}
              <span className="font-mono text-fg-primary text-sm">/karimo:feedback</span>{" "}
              to capture what you&apos;ve learned. Simple rules get saved instantly;
              complex problems trigger an investigation. Learnings persist
              across every future PRD — agents get smarter over time.
            </p>
          </motion.div>

          <CompoundLearningViz />
        </div>
      </div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Token comparison: unified single card
// ---------------------------------------------------------------------------

function TokenComparison() {
  const { planMode, karimo } = comparisonData;
  const maxTokens = planMode.totalConsumed;
  const karimoPercent = (karimo.totalConsumed / maxTokens) * 100;
  const ratio = Math.round(planMode.totalConsumed / karimo.totalConsumed);

  return (
    <div className="rounded-xl p-5 md:p-6 bg-bg-primary border border-border-secondary">
      <p className="text-body text-[10px] text-fg-tertiary mb-5 uppercase tracking-wider">
        Framework overhead
      </p>

      {/* Basic Plan Mode */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-display text-sm text-fg-primary">{planMode.label}</span>
          <span className="font-mono text-xs text-[#ff5f56]">
            {(planMode.totalConsumed / 1000).toFixed(0)}k tokens
          </span>
        </div>
        <div className="h-3 rounded-full bg-bg-tertiary overflow-hidden mb-3 relative">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full bg-[#ff5f56]"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {planMode.breakdown.map((seg) => (
            <span
              key={seg.label}
              className="text-body text-xs px-2 py-0.5 rounded bg-[#ff5f56]/10 text-[#ff5f56]"
            >
              {seg.label} {seg.tokens}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-secondary my-5" />

      {/* KARIMO */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-display text-sm text-fg-primary">{karimo.label}</span>
          <span className="font-mono text-xs text-[#27c93f]">
            {(karimo.totalConsumed / 1000).toFixed(1)}k tokens
          </span>
        </div>
        <div className="h-3 rounded-full bg-bg-tertiary overflow-hidden mb-3 relative">
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

// ---------------------------------------------------------------------------
// Context multiplication: desktop = 4-col grid, mobile = accordion
// ---------------------------------------------------------------------------

function ContextMultiplicationViz() {
  const [expandedStage, setExpandedStage] = useState(0);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [activeModalFile, setActiveModalFile] = useState<string | null>(null);
  const [modalTabs, setModalTabs] = useState<string[]>([]);

  const openStageModal = useCallback((stageId: string) => {
    const data = stageModalData[stageId];
    if (!data) return;
    setActiveModalFile(data.defaultFile);
    setModalTabs(data.defaultTabs);
    setOpenModal(stageId);
  }, []);

  const handleModalFileSelect = useCallback((contentKey: string) => {
    setActiveModalFile(contentKey);
    setModalTabs((prev) => (prev.includes(contentKey) ? prev : [...prev, contentKey]));
  }, []);

  const handleModalTabClose = useCallback((contentKey: string) => {
    setModalTabs((prev) => {
      const next = prev.filter((k) => k !== contentKey);
      if (contentKey === activeModalFile) {
        setActiveModalFile(next[next.length - 1] ?? null);
      }
      return next;
    });
  }, [activeModalFile]);

  const modalData = openModal ? stageModalData[openModal] : null;
  const revealedPaths = modalData ? new Set(collectPaths(modalData.tree)) : new Set<string>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-border-secondary bg-bg-primary overflow-hidden"
    >
      {/* Desktop: 4-column grid */}
      <div className="hidden lg:grid lg:grid-cols-4">
        {multiplicationStages.map((stage, i) => (
          <div
            key={stage.id}
            className={`
              p-5 md:p-6 flex flex-col
              ${i < multiplicationStages.length - 1 ? "border-r border-border-secondary" : ""}
            `}
          >
            {/* Stage number + arrow */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-accent text-[10px] font-bold px-1.5 py-0.5 rounded bg-bg-brand-solid text-fg-primary">
                {i + 1}
              </span>
              <span className="text-display text-sm text-fg-primary">
                {stage.label}
              </span>
              {i < multiplicationStages.length - 1 && (
                <span className="text-fg-tertiary text-xs ml-auto">→</span>
              )}
            </div>

            {/* Description */}
            <p className="text-body text-xs text-fg-secondary leading-relaxed mb-auto pb-4">
              {stage.description}
            </p>

            {/* Chips — pinned to bottom */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {stage.chips.map((chip) => (
                <span
                  key={chip}
                  className="text-body text-[10px] px-2 py-0.5 rounded bg-bg-secondary text-fg-tertiary font-mono"
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* See example button */}
            <button
              onClick={() => openStageModal(stage.id)}
              className="text-fg-brand text-xs hover:underline cursor-pointer text-left"
            >
              See example →
            </button>
          </div>
        ))}
      </div>

      {/* Mobile: accordion */}
      <div className="lg:hidden divide-y divide-border-secondary">
        {multiplicationStages.map((stage, i) => {
          const isOpen = expandedStage === i;

          return (
            <div key={stage.id}>
              <button
                onClick={() => setExpandedStage(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-accent text-[10px] font-bold px-1.5 py-0.5 rounded bg-bg-brand-solid text-fg-primary">
                    {i + 1}
                  </span>
                  <span className="text-display text-sm text-fg-primary">
                    {stage.label}
                  </span>
                </div>
                <span className="text-fg-tertiary text-sm select-none">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4">
                      <p className="text-body text-xs text-fg-secondary leading-relaxed mb-3">
                        {stage.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {stage.chips.map((chip) => (
                          <span
                            key={chip}
                            className="text-body text-[10px] px-2 py-0.5 rounded bg-bg-secondary text-fg-tertiary font-mono"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => openStageModal(stage.id)}
                        className="text-fg-brand text-xs hover:underline cursor-pointer"
                      >
                        See example →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Effective context — pipeline flow comparison */}
      <div className="border-t border-border-secondary p-5 md:p-6">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-body text-xs text-fg-tertiary uppercase tracking-wider">
            Effective context
          </span>
          <div className="flex-1 h-px bg-border-secondary" />
        </div>

        {/* Plan Mode row */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-display text-sm text-fg-primary">Basic Plan Mode</span>
            <span className="text-fg-tertiary text-xs">— linear</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 mb-2 overflow-x-auto">
            {["Session 1", "Session 2", "Session 3"].map((label, i) => (
              <div key={label} className="flex items-center gap-1.5 md:gap-2">
                <motion.div
                  className="rounded border border-[#ff5f56]/30 bg-[#ff5f56]/10 px-3 py-2 md:px-4 md:py-2.5 shrink-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-mono text-[10px] md:text-xs text-[#ff5f56]">1M</span>
                </motion.div>
                {i < 2 && (
                  <span className="text-fg-tertiary text-xs shrink-0">→</span>
                )}
              </div>
            ))}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="text-[10px] md:text-xs text-[#ff5f56]/60 font-mono ml-1 shrink-0"
            >
              resets each time
            </motion.span>
          </div>
          <p className="font-mono text-xs text-fg-tertiary">
            = <span className="text-[#ff5f56]">2-3M</span> effective tokens
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border-secondary" />
          <span className="text-[10px] text-fg-tertiary uppercase tracking-wider">vs</span>
          <div className="flex-1 h-px bg-border-secondary" />
        </div>

        {/* KARIMO row */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-display text-sm text-fg-primary">KARIMO</span>
            <span className="text-fg-tertiary text-xs">— compounding</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 mb-2 overflow-x-auto">
            {[
              { label: "1M", stage: "research", width: "px-3 py-2 md:px-4 md:py-2.5" },
              { label: "4M", stage: "PRD", width: "px-4 py-2.5 md:px-5 md:py-3" },
              { label: "40M", stage: "briefs", width: "px-5 py-3 md:px-7 md:py-3.5" },
            ].map((block, i) => (
              <div key={block.stage} className="flex items-center gap-1.5 md:gap-2">
                {i > 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.15 }}
                    className="text-[#27c93f] font-mono text-[10px] md:text-xs font-bold shrink-0"
                  >
                    {i === 1 ? "×4" : "×10"}
                  </motion.span>
                )}
                <motion.div
                  className={`rounded border border-[#27c93f]/40 bg-[#27c93f]/10 ${block.width} shrink-0`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-mono text-[10px] md:text-xs text-[#27c93f]">{block.label}</span>
                </motion.div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {["research", "PRD", "briefs"].map((stage) => (
              <span key={stage} className="text-body text-[10px] text-fg-tertiary font-mono">
                {stage}
              </span>
            ))}
          </div>
          <p className="font-mono text-xs text-fg-tertiary">
            = <span className="text-[#27c93f]">10-100M</span> effective tokens
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-body text-sm text-fg-secondary mt-6 text-center"
        >
          KARIMO turns a single 1M-token window into{" "}
          <span className="text-fg-primary font-mono text-xs">10-100M tokens</span>
          {" "}of effective, compounding context.
        </motion.p>
      </div>

      {/* Stage example modal */}
      {modalData && (
        <Modal
          isOpen={!!openModal}
          onClose={() => setOpenModal(null)}
          title={modalData.title}
          maxWidth="max-w-4xl"
        >
          <p className="text-body text-sm text-fg-secondary mb-4">
            {modalData.description}
          </p>
          <div
            className="rounded-xl overflow-hidden border border-border-secondary grid grid-cols-1 md:grid-cols-[220px_1fr]"
            style={{ height: "400px" }}
          >
            <div className="overflow-hidden md:border-r md:border-border-secondary h-full max-h-[160px] md:max-h-none">
              <FileTree
                tree={modalData.tree}
                activeFile={activeModalFile}
                onFileSelect={handleModalFileSelect}
                revealedPaths={revealedPaths}
                fillHeight
              />
            </div>
            <EditorPanel
              activeFile={activeModalFile}
              openTabs={modalTabs}
              onTabSelect={setActiveModalFile}
              onTabClose={handleModalTabClose}
              fillHeight
            />
          </div>
        </Modal>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Terminal preview — auto-sizes to match accordion height
// ---------------------------------------------------------------------------

function ContextTerminalPreview({ activeLayer }: { activeLayer: string }) {
  const layer = contextLayers.find((l) => l.id === activeLayer) || contextLayers[0];
  const content = terminalContent[activeLayer] || terminalContent.l0;

  return (
    <div className="rounded-xl overflow-hidden border border-border-secondary flex flex-col h-full">
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
      <div className="bg-[#0a0a0a] p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto flex-1">
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
                className={`whitespace-pre ${getContextLineColor(line)}`}
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
            {layer.tokens} / 1M
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#27c93f]"
            animate={{
              width:
                activeLayer === "l0"
                  ? "0.01%"
                  : activeLayer === "l1"
                    ? "0.2%"
                    : "0.5%",
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compound learning visualization
// ---------------------------------------------------------------------------

const learningSteps = [
  {
    id: "capture",
    label: "Capture",
    description:
      "Run /karimo:feedback with an observation. The system auto-detects whether it needs a quick rule or a deeper investigation.",
    chips: ["instant rules", "adaptive interview"],
  },
  {
    id: "store",
    label: "Store",
    description:
      "Learnings are saved to .karimo/learnings/ organized by category — patterns that work, anti-patterns to avoid, hard execution rules, and project-specific notes.",
    chips: ["patterns", "anti-patterns", "execution-rules"],
  },
  {
    id: "compound",
    label: "Compound",
    description:
      "Every future PRD and task brief loads relevant learnings automatically. Agents never repeat the same mistake — the project gets smarter with every cycle.",
    chips: ["informs PRDs", "seeds briefs", "prevents regressions"],
  },
];

function CompoundLearningViz() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      {/* Accordion cards — all viewports */}
      {learningSteps.map((step, i) => {
        const isOpen = !!expanded[step.id];

        return (
          <div
            key={step.id}
            className={`
              rounded-lg overflow-hidden transition-colors duration-200
              border bg-bg-primary
              ${isOpen ? "border-border-primary" : "border-border-secondary"}
            `}
          >
            <button
              onClick={() => toggle(step.id)}
              className="w-full flex items-center justify-between px-6 py-5 md:px-8 md:py-6 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-accent text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full bg-fg-tertiary/10 text-fg-tertiary">
                  {i + 1}
                </span>
                <h4 className="text-display text-lg md:text-xl text-fg-primary">
                  {step.label}
                </h4>
              </div>
              <div
                className={`
                  flex-shrink-0 w-8 h-8 flex items-center justify-center
                  rounded-lg transition-colors duration-200
                  ${isOpen
                    ? "bg-bg-brand-solid border border-transparent"
                    : "border border-border-secondary"
                  }
                `}
              >
                <span className="text-fg-primary text-sm leading-none select-none">
                  {isOpen ? "−" : "+"}
                </span>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 md:px-8 md:pb-8">
                    <p className="text-body text-sm text-fg-secondary leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {step.chips.map((chip) => (
                        <span
                          key={chip}
                          className="text-body text-xs px-2 py-1 rounded bg-bg-secondary text-fg-primary"
                        >
                          {chip}
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

      {/* CTA */}
      <p className="text-body text-sm text-fg-tertiary text-center pt-4">
        Open source — {" "}
        <a
          href="https://github.com/opensesh/KARIMO"
          target="_blank"
          rel="noopener noreferrer"
          className="text-fg-brand hover:underline"
        >
          contribute on GitHub
        </a>
        {" "} to help improve KARIMO as models evolve.
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getContextLineColor(line: string): string {
  if (line.startsWith("//") || line.startsWith("#")) return "text-fg-primary";
  if (line.startsWith("##")) return "text-fg-brand";
  if (line.includes(":") && !line.startsWith(" ") && !line.startsWith("-"))
    return "text-fg-brand";
  if (line.match(/^\s+- id:/) || line.match(/^\s+\w+:/))
    return "text-fg-secondary";
  if (line.includes("karimo-") || line.includes("complexity"))
    return "text-[#27c93f]";
  if (line.includes("#") && !line.startsWith("#"))
    return "text-fg-tertiary";
  if (line.includes("→") || line.startsWith("."))
    return "text-fg-secondary";
  if (line.startsWith("- ") || line.startsWith("  -"))
    return "text-fg-secondary";
  return "text-fg-secondary";
}
