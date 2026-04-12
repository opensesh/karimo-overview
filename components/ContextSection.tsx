"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useParallax } from "@/components/ui/ParallaxSection";
import { Modal } from "@/components/ui/Modal";
import { FileTree } from "@/components/vscode/FileTree";
import { EditorPanel } from "@/components/vscode/EditorPanel";
import { ContextMultiplicationCanvas } from "@/components/context/ContextMultiplicationCanvas";
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

// ---------------------------------------------------------------------------
// Data: Complexity vs Duration chart
// ---------------------------------------------------------------------------

interface ChartPoint {
  id: "plan-mode" | "karimo" | "mythos";
  label: string;
  modelLabel: string;
  /** The dot position (complexity = y, duration midpoint = x) */
  position: { x: number; y: number };
  /** Duration range for the triangle base on the X-axis */
  durationRange: [number, number];
  shape: "triangle" | "dot";
  disabled?: boolean;
  dotColor: string;
  gradientId: string;
  detail: {
    title: string;
    subtitle: string;
    description: string;
    context?: { label: string; formula: string; percent: number; color: string };
  };
}

const chartPoints: ChartPoint[] = [
  {
    id: "plan-mode",
    label: "Plan Mode",
    modelLabel: "Opus 4.6",
    position: { x: 2, y: 3 },
    durationRange: [1, 3],
    shape: "triangle",
    dotColor: "#78716c",
    gradientId: "grad-plan",
    detail: {
      title: "Static Planning",
      subtitle: "Plan Mode",
      description:
        "A single session with a flat 1M context window. Each new session starts from scratch — no memory, no compounding. Limited to simple, short-duration tasks.",
      context: {
        label: "1M tokens",
        formula: "1M per session (flat, no compounding)",
        percent: 15,
        color: "#78716c",
      },
    },
  },
  {
    id: "karimo",
    label: "KARIMO",
    modelLabel: "Opus 4.6",
    position: { x: 4, y: 6 },
    durationRange: [2, 6],
    shape: "triangle",
    dotColor: "#fe5102",
    gradientId: "grad-karimo",
    detail: {
      title: "Progressive Planning",
      subtitle: "KARIMO",
      description:
        "Context compounds across sessions. Research seeds PRDs, PRDs seed briefs, briefs seed parallel worktrees. Each stage multiplies the effective context window.",
      context: {
        label: "10–100M effective",
        formula: "1M × tasks × research depth",
        percent: 70,
        color: "#fe5102",
      },
    },
  },
  {
    id: "mythos",
    label: "KARIMO",
    modelLabel: "Mythos",
    position: { x: 7, y: 9 },
    durationRange: [5, 9],
    shape: "triangle",
    disabled: true,
    dotColor: "#ff7a38",
    gradientId: "grad-mythos",
    detail: {
      title: "Better Models, Better Results",
      subtitle: "KARIMO + Mythos",
      description:
        "KARIMO gets better as models get better. The context architecture is already in place — when a more capable model arrives, complexity and duration scale automatically. No structural changes needed.",
    },
  },
];

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
    <section ref={sectionRef} id="context" className="section-padding min-h-screen bg-bg-primary overflow-hidden">
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
            className="text-body text-fg-secondary mt-4 max-w-2xl text-lg leading-relaxed"
          >
            In plan mode, you get a single 1M-token session — static, flat, and isolated.
            KARIMO expands that into progressive, compounding context that grows across
            every session through progressive disclosure, context multiplication, and
            compound learning — distilling knowledge at each stage so agents only load
            what they need, every session builds on the last, and feedback persists
            across every future PRD.
          </motion.p>
        </div>

        {/* Complexity vs Duration chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
        >
          <ComplexityDurationChart />
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-24 md:mb-32">
          <div className="flex-1 h-px bg-border-secondary" />
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

        {/* Layer explorer — terminal LEFT, accordion RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch mb-24 md:mb-32">
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

        {/* Divider */}
        <div className="flex items-center gap-4 mb-24 md:mb-32">
          <div className="flex-1 h-px bg-border-secondary" />
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

        {/* Divider */}
        <div className="flex items-center gap-4 mt-24 md:mt-32">
          <div className="flex-1 h-px bg-border-secondary" />
        </div>

        {/* ── PART 3: Compound Learning ── */}
        <div className="mt-24 md:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-accent text-xs font-bold text-fg-tertiary uppercase tracking-wider">
              Part 3
            </span>
            <h3 className="text-display text-xl md:text-2xl text-fg-primary mt-2">
              Compound Learning
            </h3>
            <p className="text-body text-fg-secondary mt-3 max-w-2xl leading-relaxed">
              At any point, run{" "}
              <span className="font-mono text-fg-primary text-sm">/karimo:feedback</span>{" "}
              to capture issues or potential improvements. Observations move through a
              capture stage, then get stored as summarized learnings in the KARIMO
              learnings folder — patterns that work, anti-patterns to avoid, execution
              rules, and product-specific notes. These compound over time: every future
              PRD and task brief loads in relevant learnings for that specific task.
              Agents never repeat the same mistake twice.
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-body text-sm text-fg-tertiary mt-6"
            >
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
            </motion.p>
          </motion.div>
        </div>
      </div>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Complexity vs Duration chart
// ---------------------------------------------------------------------------

const CHART = { w: 500, h: 220, pad: { top: 16, right: 20, bottom: 40, left: 48 } } as const;
const CHART_AREA = {
  x0: CHART.pad.left,
  x1: CHART.w - CHART.pad.right,
  y0: CHART.pad.top,
  y1: CHART.h - CHART.pad.bottom,
};

function toChartX(val: number) {
  return CHART_AREA.x0 + (val / 10) * (CHART_AREA.x1 - CHART_AREA.x0);
}
function toChartY(val: number) {
  return CHART_AREA.y1 - (val / 10) * (CHART_AREA.y1 - CHART_AREA.y0);
}

const springEase = [0.16, 1, 0.3, 1] as const;
const DOT_R = 6;
const OUTLINE_R = 12;

function ComplexityDurationChart() {
  const [activeId, setActiveId] = useState<string>("karimo");
  const [isOpen, setIsOpen] = useState(true);
  const activePoint = chartPoints.find((p) => p.id === activeId) ?? chartPoints[1];

  const gridLines = [2, 4, 6, 8];

  // KARIMO and Mythos dot positions for the dashed connector
  const karimoPos = chartPoints[1];
  const mythosPos = chartPoints[2];

  return (
    <div className="rounded-xl border border-border-secondary bg-bg-primary overflow-hidden">
      {/* Collapsible header */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-6 md:px-8 md:py-7 text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <h3 className="text-display text-lg md:text-xl text-fg-primary">
          Capability Comparison
        </h3>
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
            transition={{ duration: 0.4, ease: springEase }}
            className="overflow-hidden"
          >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] gap-6 items-center px-6 pb-6 md:px-8 md:pb-8">
        {/* SVG Chart */}
        <div>
          <svg
            viewBox={`0 0 ${CHART.w} ${CHART.h}`}
            className="w-full h-auto"
            role="img"
            aria-label="Complexity vs Duration chart comparing Plan Mode, KARIMO, and Mythos"
          >
            <defs>
              <linearGradient id="grad-plan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#78716c" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#57534e" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="grad-karimo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fe5102" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ff7a38" stopOpacity="0.06" />
              </linearGradient>
              <radialGradient id="grad-mythos" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff7a38" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fe5102" stopOpacity="0.2" />
              </radialGradient>
              {/* Mythos uses disabled dashed state, no glow needed */}
            </defs>

            {/* Grid lines */}
            <g opacity="0.06">
              {gridLines.map((v) => (
                <g key={v}>
                  <line
                    x1={toChartX(v)} y1={CHART_AREA.y0}
                    x2={toChartX(v)} y2={CHART_AREA.y1}
                    stroke="#a8a29e" strokeWidth="1"
                  />
                  <line
                    x1={CHART_AREA.x0} y1={toChartY(v)}
                    x2={CHART_AREA.x1} y2={toChartY(v)}
                    stroke="#a8a29e" strokeWidth="1"
                  />
                </g>
              ))}
            </g>

            {/* Y-axis only — no bottom stroke */}
            <line
              x1={CHART_AREA.x0} y1={CHART_AREA.y0}
              x2={CHART_AREA.x0} y2={CHART_AREA.y1}
              stroke="#363230" strokeWidth="1"
            />

            {/* Axis labels */}
            <text
              x={CHART_AREA.x0 + (CHART_AREA.x1 - CHART_AREA.x0) / 2}
              y={CHART.h - 4}
              textAnchor="middle"
              fill="#78716c"
              fontSize="10"
              style={{ fontFamily: "var(--font-accent)" }}
            >
              DURATION
            </text>
            <text
              x={12}
              y={CHART_AREA.y0 + (CHART_AREA.y1 - CHART_AREA.y0) / 2}
              textAnchor="middle"
              fill="#78716c"
              fontSize="10"
              style={{ fontFamily: "var(--font-accent)" }}
              transform={`rotate(-90, 12, ${CHART_AREA.y0 + (CHART_AREA.y1 - CHART_AREA.y0) / 2})`}
            >
              COMPLEXITY
            </text>

            {/* Tick labels */}
            {gridLines.map((v) => (
              <g key={`tick-${v}`}>
                <text
                  x={toChartX(v)} y={CHART_AREA.y1 + 16}
                  textAnchor="middle" fill="#78716c" fontSize="9"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {v}
                </text>
                <text
                  x={CHART_AREA.x0 - 10} y={toChartY(v) + 3}
                  textAnchor="end" fill="#78716c" fontSize="9"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {v}
                </text>
              </g>
            ))}

            {/* Dashed connector line: KARIMO → Mythos */}
            <motion.line
              x1={toChartX(karimoPos.position.x)}
              y1={toChartY(karimoPos.position.y)}
              x2={toChartX(mythosPos.position.x)}
              y2={toChartY(mythosPos.position.y)}
              stroke="#ff7a38"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.8, delay: 0.8, ease: springEase }}
            />

            {/* Surface-area triangles (rendered first, behind dots) */}
            {chartPoints.filter((p) => p.shape === "triangle").map((point, i) => {
              const dotX = toChartX(point.position.x);
              const dotY = toChartY(point.position.y);
              const leftX = toChartX(point.durationRange[0]);
              const rightX = toChartX(point.durationRange[1]);
              const baseY = CHART_AREA.y1;
              const isActive = point.id === activeId;

              const activeOpacity = point.disabled ? 0.3 : 1;
              const inactiveOpacity = point.disabled ? 0.15 : 0.4;

              return point.disabled ? (
                /* Disabled: two dashed side lines only (no bottom edge) */
                <motion.g
                  key={`tri-${point.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? activeOpacity : inactiveOpacity }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.3, ease: springEase }}
                >
                  <line x1={dotX} y1={dotY} x2={leftX} y2={baseY}
                    stroke={point.dotColor} strokeWidth="1" strokeDasharray="4 3" />
                  <line x1={dotX} y1={dotY} x2={rightX} y2={baseY}
                    stroke={point.dotColor} strokeWidth="1" strokeDasharray="4 3" />
                </motion.g>
              ) : (
                <motion.polygon
                  key={`tri-${point.id}`}
                  points={`${dotX},${dotY} ${leftX},${baseY} ${rightX},${baseY}`}
                  fill={`url(#${point.gradientId})`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? activeOpacity : inactiveOpacity }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.3, ease: springEase }}
                />
              );
            })}

            {/* Data point dots + labels */}
            {chartPoints.map((point, i) => {
              const cx = toChartX(point.position.x);
              const cy = toChartY(point.position.y);
              const isActive = point.id === activeId;
              const delay = 0.2 + i * 0.3;

              return (
                <motion.g
                  key={point.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay, ease: springEase }}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveId(point.id)}
                  onMouseEnter={() => setActiveId(point.id)}
                >
                  {/* Hit area */}
                  <circle cx={cx} cy={cy} r="24" fill="transparent" />

                  {/* Hover outline ring */}
                  <circle
                    cx={cx} cy={cy} r={OUTLINE_R}
                    fill="none"
                    stroke={point.disabled ? "#57534e" : point.dotColor}
                    strokeWidth={isActive ? "1.5" : "0"}
                    opacity={isActive ? 0.6 : 0}
                    strokeDasharray={point.disabled ? "3 3" : "none"}
                    style={{ transition: "stroke-width 0.3s, opacity 0.3s" }}
                  />

                  {/* Main dot — disabled uses a muted brand fill, no dashed stroke */}
                  <circle
                    cx={cx} cy={cy} r={DOT_R}
                    fill={point.disabled ? "#44403a" : point.dotColor}
                    opacity={point.disabled ? 0.6 : (isActive ? 1 : 0.5)}
                    style={{ transition: "opacity 0.3s" }}
                  />

                  {/* Label background for readability over pyramids */}
                  <rect
                    x={cx - 36} y={cy + DOT_R + 4}
                    width="72" height="24"
                    rx="4"
                    fill="#000000"
                    opacity={isActive ? 0.7 : 0.5}
                  />
                  {/* Label */}
                  <text
                    x={cx}
                    y={cy + DOT_R + 15}
                    textAnchor="middle"
                    fill={isActive ? "#fffaee" : "#78716c"}
                    fontSize="10"
                    style={{ fontFamily: "var(--font-accent)", transition: "fill 0.3s" }}
                  >
                    {point.label}
                  </text>
                  {/* Model label */}
                  <text
                    x={cx}
                    y={cy + DOT_R + 25}
                    textAnchor="middle"
                    fill="#57534e"
                    fontSize="8"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {point.modelLabel}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel — fixed height for consistency */}
        <div className="h-[280px] md:h-[260px]">
          <AnimatePresence mode="wait">
            <ChartDetailPanel key={activePoint.id} point={activePoint} />
          </AnimatePresence>
        </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chart detail panel
// ---------------------------------------------------------------------------

function ChartDetailPanel({ point }: { point: ChartPoint }) {
  const { detail } = point;

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.3, ease: springEase }}
      className="rounded-lg border border-border-secondary bg-bg-secondary p-5 h-full flex flex-col justify-center"
    >
      <span className="text-accent text-[10px] text-fg-tertiary uppercase tracking-wider">
        {detail.subtitle}
      </span>
      <h4 className="text-display text-lg text-fg-primary mt-1">
        {detail.title}
      </h4>
      <p className="text-body text-sm text-fg-secondary mt-3 leading-relaxed">
        {detail.description}
      </p>

      {detail.context && (
        <div className="mt-4 pt-4 border-t border-border-secondary">
          <div className="flex items-center justify-between mb-2">
            <span className="text-body text-[10px] text-fg-tertiary uppercase tracking-wider">
              Effective context
            </span>
            <span className="font-mono text-xs text-fg-primary">
              {detail.context.label}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-bg-primary overflow-hidden relative">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{ backgroundColor: detail.context.color }}
              initial={{ width: 0 }}
              animate={{ width: `${detail.context.percent}%` }}
              transition={{ duration: 0.6, delay: 0.15, ease: springEase }}
            />
          </div>
          <p className="font-mono text-[10px] text-fg-tertiary mt-1.5">
            {detail.context.formula}
          </p>
        </div>
      )}
    </motion.div>
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
  const [playing, setPlaying] = useState(true);
  const [stageProgress, setStageProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const stageStartRef = useRef(Date.now());

  const STAGE_DURATION = 3000; // ms per stage

  // Smooth timer using rAF
  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }
    stageStartRef.current = Date.now();
    setStageProgress(0);

    const tick = () => {
      const elapsed = Date.now() - stageStartRef.current;
      const p = Math.min(elapsed / STAGE_DURATION, 1);
      setStageProgress(p);

      if (p >= 1) {
        setExpandedStage((prev) => (prev + 1) % 4);
        stageStartRef.current = Date.now();
        setStageProgress(0);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const handleStageSelect = useCallback((i: number) => {
    setPlaying(false);
    setExpandedStage(i);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

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
      {/* Three.js visualization with progress bar */}
      <ContextMultiplicationCanvas
        activeStage={expandedStage}
        stageProgress={stageProgress}
        onStageChange={handleStageSelect}
        playing={playing}
        onTogglePlay={handleTogglePlay}
      />

      {/* Desktop: 4-column grid */}
      <div className="hidden lg:grid lg:grid-cols-4">
        {multiplicationStages.map((stage, i) => (
          <div
            key={stage.id}
            onMouseEnter={() => handleStageSelect(i)}
            className={`
              p-5 md:p-6 flex flex-col cursor-pointer transition-colors duration-200
              ${i < multiplicationStages.length - 1 ? "border-r border-border-secondary" : ""}
              ${expandedStage === i ? "bg-bg-secondary/40" : "hover:bg-bg-secondary/20"}
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
                onClick={() => handleStageSelect(isOpen ? -1 : i)}
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

      {/* Stage example modal */}
      {modalData && (
        <Modal
          isOpen={!!openModal}
          onClose={() => setOpenModal(null)}
          title={modalData.title}
          maxWidth="max-w-5xl"
          allowFullscreen
        >
          <p className="text-body text-sm text-fg-secondary mb-4">
            {modalData.description}
          </p>
          <div
            className="rounded-xl overflow-hidden border border-border-secondary grid grid-cols-1 md:grid-cols-[220px_1fr] flex-1"
            style={{ minHeight: "500px", height: "clamp(500px, 60vh, 700px)" }}
          >
            <div className="overflow-hidden md:border-r md:border-border-secondary h-full max-h-[160px] md:max-h-none">
              <FileTree
                tree={modalData.tree}
                activeFile={activeModalFile}
                onFileSelect={handleModalFileSelect}
                revealedPaths={revealedPaths}
                activeChapter={0}
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
