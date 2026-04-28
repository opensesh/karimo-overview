"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen01, XClose } from "@untitledui/icons";
import { agentAssignments, type AgentRole } from "@/lib/constants";
import { AGENT_STYLES, AGENT_ICON } from "./AgentRow";

// ─── Agent metadata (reused from old AgentLegend) ──────────────────────────

const ROLE_META: Record<AgentRole, { label: string; description: string }> = {
  coordinator: {
    label: "Coordinator",
    description: "Orchestrates workflows, manages branches, spawns sub-agents, and sequences execution waves.",
  },
  "sub-agent": {
    label: "Sub-Agent",
    description: "Performs focused tasks — code generation, testing, investigation, documentation, and review fixes.",
  },
  team: {
    label: "Team Agent",
    description: "Specialized review and validation roles that assess quality across multiple files and concerns.",
  },
};

const STEP_LABELS: Record<string, string> = {
  "planning:research": "Research",
  "planning:create-prd": "Create PRD",
  "planning:task-briefs": "Task Briefs",
  "planning:dependency": "Dependency Graph",
  "execution:execute": "Execute",
  "execution:inspect": "Inspect",
  "review:inspect": "Inspect",
  "review:fix-errors": "Fix Errors",
  "review:merge": "Merge",
};

function getAgentsByRole(role: AgentRole) {
  const seen = new Set<string>();
  const agents: { name: string; steps: string[] }[] = [];
  for (const [key, defs] of Object.entries(agentAssignments)) {
    for (const def of defs) {
      if (def.role !== role) continue;
      if (!seen.has(def.name)) {
        seen.add(def.name);
        agents.push({ name: def.name, steps: [key] });
      } else {
        agents.find(a => a.name === def.name)!.steps.push(key);
      }
    }
  }
  return agents;
}

// ─── Wave colors ────────────────────────────────────────────────────────────

const WAVES = [
  { wave: 1, color: "#22c55e", label: "Wave 1" },
  { wave: 2, color: "#f59e0b", label: "Wave 2" },
  { wave: 3, color: "#3b82f6", label: "Wave 3" },
  { wave: 4, color: "#a855f7", label: "Wave 4" },
];

// ─── Section IDs + tooltip ──────────────────────────────────────────────────

type SectionId = "branches" | "phases" | "tasks-waves" | "agents";

const SECTION_TOOLTIPS: Record<SectionId, string> = {
  branches: "Nodes and lines for main and feature branches",
  phases: "Planning, Execution, and Review phase tabs",
  "tasks-waves": "Wave colors, task statuses, and parallelizable groups",
  agents: "Coordinator, sub-agent, and team roles",
};

function HoverTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute left-5 top-full z-20 mt-1 rounded-md border border-border-secondary bg-bg-primary px-2 py-1 text-[10px] text-fg-secondary whitespace-nowrap shadow-lg"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Single-open accordion section ──────────────────────────────────────────

function LegendSection({
  id,
  title,
  isOpen,
  onOpen,
  children,
}: {
  id: SectionId;
  title: string;
  isOpen: boolean;
  onOpen: (id: SectionId) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <HoverTooltip label={SECTION_TOOLTIPS[id]}>
        <button
          type="button"
          onClick={() => onOpen(id)}
          aria-expanded={isOpen}
          className="flex w-full items-center gap-2 cursor-pointer select-none py-2 text-left"
        >
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-fg-tertiary flex-shrink-0"
          >
            <path d="M9 18l6-6-6-6" />
          </motion.svg>
          <span
            className="text-fg-primary text-[13px] font-semibold"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {title}
          </span>
          <div className="flex-1 h-px bg-border-secondary/50" />
        </button>
      </HoverTooltip>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.2, ease: "easeOut" },
            }}
            className="overflow-hidden"
          >
            <div className="pb-3 pt-1 pl-5 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LegendItem({ visual, label, description }: {
  visual: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 flex items-center justify-center mt-0.5">
        {visual}
      </div>
      <div className="min-w-0">
        <p className="text-fg-primary text-[12px] font-semibold" style={{ fontFamily: "var(--font-body)" }}>
          {label}
        </p>
        <p className="text-fg-tertiary text-[11px] mt-0.5 leading-snug" style={{ fontFamily: "var(--font-body)" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export function TimelineLegend() {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<SectionId>("branches");
  const handleClose = useCallback(() => setOpen(false), []);
  const handleSectionOpen = useCallback((id: SectionId) => setOpenSection(id), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  return (
    <>
      {/* Trigger — icon button matching nav button style */}
      <button
        onClick={() => setOpen(true)}
        className="w-8 h-8 rounded-md bg-bg-tertiary flex items-center justify-center
                   text-fg-secondary hover:text-fg-primary hover:bg-border-primary
                   transition-all duration-200"
        aria-label="Open legend"
      >
        <BookOpen01 width={14} height={14} />
      </button>

      {/* Modal — portaled to body to escape transform ancestors */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-bg-primary/70 backdrop-blur-sm"
                onClick={handleClose}
              />

              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
              >
              <div className="pointer-events-auto w-full max-w-xs sm:max-w-sm max-h-[80vh] overflow-y-auto rounded-xl bg-bg-secondary border border-border-secondary shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-border-secondary sticky top-0 bg-bg-secondary z-10">
                  <div>
                    <h3 className="text-fg-primary text-sm sm:text-base font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                      Git Timeline Legend
                    </h3>
                    <p className="text-fg-tertiary text-[10px] sm:text-[11px] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                      Visual guide to the timeline
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-fg-tertiary hover:text-fg-primary hover:bg-bg-tertiary transition-colors duration-150"
                    aria-label="Close legend"
                  >
                    <XClose width={16} height={16} />
                  </button>
                </div>

                {/* Sections */}
                <div className="px-4 sm:px-5 py-3 sm:py-4 space-y-1">

                  {/* ── Branches ── */}
                  <LegendSection id="branches" title="Branches" isOpen={openSection === "branches"} onOpen={handleSectionOpen}>
                    <LegendItem
                      visual={
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full border-[2px] border-fg-brand bg-bg-secondary relative flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-fg-brand" />
                          </div>
                        </div>
                      }
                      label="Main Branch Node"
                      description="Marks a stage on the primary development line"
                    />
                    <LegendItem
                      visual={<div className="w-8 h-[3px] bg-fg-brand rounded-full" />}
                      label="Main Branch Line"
                      description="Horizontal line connecting stages on main"
                    />
                    <LegendItem
                      visual={
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full border-[2px] border-fg-brand bg-bg-secondary relative flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-bg-primary" />
                          </div>
                        </div>
                      }
                      label="Feature Branch Node"
                      description="Activity on an isolated feature branch forked from main"
                    />
                    <LegendItem
                      visual={<div className="w-8 h-5 border-l-[3px] border-fg-brand/50 ml-[9px]" />}
                      label="Branch Activity"
                      description="Vertical line indicating worktree scope or branch depth"
                    />
                  </LegendSection>

                  {/* ── Phases ── */}
                  <LegendSection id="phases" title="Phases" isOpen={openSection === "phases"} onOpen={handleSectionOpen}>
                    <LegendItem
                      visual={
                        <span className="px-2 py-1 rounded-md bg-bg-brand-solid text-fg-primary text-[9px] font-semibold whitespace-nowrap">
                          Active
                        </span>
                      }
                      label="Active Phase"
                      description="The currently selected phase tab — highlighted in orange"
                    />
                    <LegendItem
                      visual={
                        <span className="px-2 py-1 rounded-md bg-bg-tertiary text-fg-secondary text-[9px] font-semibold whitespace-nowrap">
                          Inactive
                        </span>
                      }
                      label="Inactive Phase"
                      description="Other phases available to navigate to"
                    />
                    <div className="space-y-1.5 pl-11">
                      {[
                        { label: "Planning", desc: "Research, PRD creation, task decomposition" },
                        { label: "Execution", desc: "Parallel wave execution in git worktrees" },
                        { label: "Review & Merge", desc: "Automated code review, fixes, and merge to main" },
                      ].map(p => (
                        <div key={p.label} className="flex items-baseline gap-2">
                          <span className="text-fg-primary text-[11px] font-semibold w-24 flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>
                            {p.label}
                          </span>
                          <span className="text-fg-tertiary text-[11px]" style={{ fontFamily: "var(--font-body)" }}>
                            {p.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </LegendSection>

                  {/* ── Tasks & Waves ── */}
                  <LegendSection id="tasks-waves" title="Tasks & Waves" isOpen={openSection === "tasks-waves"} onOpen={handleSectionOpen}>
                    <div className="space-y-2">
                      {WAVES.map(w => (
                        <div key={w.wave} className="flex items-center gap-3">
                          <div className="w-8 flex justify-center">
                            <div
                              className="w-5 h-3 rounded-sm"
                              style={{ backgroundColor: `${w.color}40`, border: `1px solid ${w.color}60` }}
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[12px] font-semibold" style={{ fontFamily: "var(--font-body)", color: w.color }}>
                              {w.label}
                            </span>
                            <span className="text-fg-tertiary text-[11px] ml-2" style={{ fontFamily: "var(--font-body)" }}>
                              Parallelizable group
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-border-secondary/30 space-y-2">
                      <LegendItem
                        visual={
                          <div
                            className="px-1.5 py-0.5 rounded text-[8px] font-semibold border"
                            style={{
                              fontFamily: "var(--font-mono, monospace)",
                              backgroundColor: "#22c55e15",
                              borderColor: "#22c55e40",
                              color: "#22c55e",
                            }}
                          >
                            Task
                          </div>
                        }
                        label="Task Brief"
                        description="Individual work unit — color matches its wave"
                      />
                      <div className="flex items-center gap-4 pl-11">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: "#22c55ecc", border: "1px solid #22c55e60" }} />
                          <span className="text-fg-tertiary text-[10px]" style={{ fontFamily: "var(--font-body)" }}>Complete</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: "#22c55e66", border: "1px solid #22c55e60" }} />
                          <span className="text-fg-tertiary text-[10px]" style={{ fontFamily: "var(--font-body)" }}>Active</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-2.5 rounded-sm bg-bg-tertiary border border-border-secondary" />
                          <span className="text-fg-tertiary text-[10px]" style={{ fontFamily: "var(--font-body)" }}>Pending</span>
                        </div>
                      </div>
                    </div>
                  </LegendSection>

                  {/* ── Agents ── */}
                  <LegendSection id="agents" title="Agents" isOpen={openSection === "agents"} onOpen={handleSectionOpen}>
                    {(["coordinator", "sub-agent", "team"] as AgentRole[]).map((role) => {
                      const meta = ROLE_META[role];
                      const styles = AGENT_STYLES[role];
                      const Icon = AGENT_ICON[role];
                      const agents = getAgentsByRole(role);

                      return (
                        <div key={role} className="space-y-2">
                          <div className="flex items-start gap-3">
                            <div className="w-8 flex justify-center flex-shrink-0 mt-0.5">
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                                style={{ backgroundColor: styles.bg, border: `1px solid ${styles.border}` }}
                              >
                                <Icon width={12} height={12} style={{ color: styles.text }} />
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-fg-primary text-[12px] font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                                {meta.label}
                              </p>
                              <p className="text-fg-tertiary text-[11px] mt-0.5 leading-snug" style={{ fontFamily: "var(--font-body)" }}>
                                {meta.description}
                              </p>
                            </div>
                          </div>

                          <div className="pl-11 space-y-1">
                            {agents.map(agent => (
                              <div key={agent.name} className="flex items-center gap-2 flex-wrap">
                                <span className="text-[11px] font-semibold" style={{ fontFamily: "var(--font-body)", color: styles.text }}>
                                  {agent.name}
                                </span>
                                <span className="text-fg-tertiary/30 text-[10px]">→</span>
                                {agent.steps.map(s => (
                                  <span
                                    key={s}
                                    className="px-1.5 py-0.5 rounded text-[9px] bg-bg-tertiary border border-border-secondary text-fg-tertiary"
                                    style={{ fontFamily: "var(--font-body)" }}
                                  >
                                    {STEP_LABELS[s] ?? s}
                                  </span>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </LegendSection>

                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body)}
    </>
  );
}
