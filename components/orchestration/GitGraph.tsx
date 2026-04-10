"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { OrchestrationData, PhaseId } from "@/lib/constants";
import { Folder, FolderCode } from "@untitledui/icons";

interface GitGraphProps {
  data: OrchestrationData;
  activePhase: PhaseId;
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function BranchNode({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex-shrink-0 w-7 h-7 ${className}`}>
      <div className="absolute inset-0 rounded-full border-[3px] border-fg-brand bg-bg-secondary" />
      <div className="absolute inset-0 m-auto rounded-full bg-fg-brand w-3 h-3" />
    </div>
  );
}

function FeatureNode({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex-shrink-0 w-7 h-7 ${className}`}>
      <div className="absolute inset-0 rounded-full border-[3px] border-fg-brand bg-bg-secondary" />
      <div className="absolute inset-0 m-auto rounded-full bg-bg-primary w-3 h-3" />
    </div>
  );
}

function StepLabel({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mt-3">
      <p className="text-fg-primary text-[13px] font-semibold whitespace-nowrap" style={{ fontFamily: "var(--font-body)" }}>
        {title}
      </p>
      <p className="text-fg-tertiary text-[11px] mt-0.5 whitespace-nowrap" style={{ fontFamily: "var(--font-mono, monospace)" }}>
        {subtitle}
      </p>
    </div>
  );
}

function TaskBriefPill({ id, color }: { id: string; color: string }) {
  return (
    <div
      className="px-2 py-1 rounded text-[10px] font-semibold border whitespace-nowrap"
      style={{
        fontFamily: "var(--font-mono, monospace)",
        backgroundColor: `${color}15`,
        borderColor: `${color}40`,
        color,
      }}
    >
      {id}
    </div>
  );
}

// ─── Wave lifecycle (compact) ────────────────────────────────────────────────

function WaveLifecycle({ data }: { data: OrchestrationData }) {
  const completedWaves = data.execution.waves.filter(w => w.tasks.every(t => t.status === "complete"));
  const activeWave = data.execution.waves.find(w => w.tasks.some(t => t.status === "active"));
  const pendingWaves = data.execution.waves.filter(w => w.tasks.every(t => t.status === "pending"));

  return (
    <div className="p-4 rounded-lg bg-bg-tertiary/50 border border-border-secondary space-y-3 self-start">
      <p className="text-fg-primary text-[10px] font-semibold uppercase tracking-wider" style={{ fontFamily: "var(--font-accent, sans-serif)" }}>
        Feature Branch State
      </p>

      {completedWaves.length > 0 && (
        <div className="space-y-1">
          <p className="text-[9px] text-fg-tertiary uppercase tracking-wider" style={{ fontFamily: "var(--font-accent, sans-serif)" }}>
            Merged
          </p>
          {completedWaves.map(w => (
            <div key={w.wave} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: w.color }} />
              <span className="text-fg-secondary text-[10px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>
                W{w.wave} — {w.tasks.length} merged
              </span>
              <span className="text-green-400 text-[9px]">✓</span>
            </div>
          ))}
        </div>
      )}

      {activeWave && (
        <div className="space-y-1">
          <p className="text-[9px] text-fg-tertiary uppercase tracking-wider" style={{ fontFamily: "var(--font-accent, sans-serif)" }}>
            Running
          </p>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: activeWave.color }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-fg-primary text-[10px] font-medium" style={{ fontFamily: "var(--font-mono, monospace)" }}>
              W{activeWave.wave} — {activeWave.tasks.filter(t => t.status === "active").length} active
            </span>
          </div>
          <div className="flex gap-0.5 ml-3.5">
            {activeWave.tasks.map(task => (
              <motion.div
                key={task.id}
                className="h-1.5 flex-1 rounded-sm border"
                style={{
                  backgroundColor: task.status === "active" ? `${activeWave.color}66` : "var(--bg-tertiary)",
                  borderColor: task.status === "active" ? `${activeWave.color}80` : "var(--border-secondary)",
                }}
                animate={task.status === "active" ? { opacity: [0.6, 1, 0.6] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      )}

      {pendingWaves.length > 0 && (
        <div className="space-y-1">
          <p className="text-[9px] text-fg-tertiary uppercase tracking-wider" style={{ fontFamily: "var(--font-accent, sans-serif)" }}>
            Queued
          </p>
          {pendingWaves.map(w => (
            <div key={w.wave} className="flex items-center gap-2 opacity-40">
              <div className="w-1.5 h-1.5 rounded-full border" style={{ borderColor: w.color }} />
              <span className="text-fg-tertiary text-[10px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>
                W{w.wave} — {w.tasks.length} waiting
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-border-secondary">
        <p className="text-fg-tertiary text-[9px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>
          Worktrees close → atomic commits → merge to feature
        </p>
      </div>
    </div>
  );
}

// ─── PR Card (split from PRPreview) ─────────────────────────────────────────

function PRCard({ data }: { data: OrchestrationData }) {
  return (
    <div className="rounded-lg border border-border-secondary bg-bg-tertiary/50 overflow-hidden">
      <div className="px-3 py-2.5 border-b border-border-secondary flex items-center gap-2">
        <div className="w-3.5 h-3.5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
        </div>
        <p className="text-fg-primary text-[11px] font-semibold" style={{ fontFamily: "var(--font-body)" }}>
          feat(auth): implement auth system
        </p>
      </div>
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex items-center gap-2 text-[10px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>
          <span className="text-fg-tertiary">{data.featureBranch}</span>
          <span className="text-fg-tertiary">→</span>
          <span className="text-fg-primary">main</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-fg-tertiary">
          <span className="px-1 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">+1,247</span>
          <span className="px-1 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">-89</span>
          <span className="ml-auto">12 files</span>
        </div>
        <p className="text-fg-tertiary text-[9px] pt-1" style={{ fontFamily: "var(--font-mono, monospace)" }}>
          PR merged to main — passed all tests
        </p>
      </div>
    </div>
  );
}

// ─── Review Loop Card ────────────────────────────────────────────────────────

function ReviewLoop() {
  return (
    <div className="rounded-lg border border-border-secondary bg-bg-tertiary/50 p-3 space-y-2.5">
      <p className="text-fg-primary text-[11px] font-semibold" style={{ fontFamily: "var(--font-body)" }}>
        Automated Review Loop
      </p>
      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-fg-brand/20 border border-fg-brand/40 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-[7px] text-fg-brand font-bold">1</span>
          </div>
          <div>
            <p className="text-fg-secondary text-[10px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>Greptile review — 3 findings</p>
            <p className="text-fg-tertiary text-[9px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>Sonnet auto-fixed → pushed revision</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-fg-brand/20 border border-fg-brand/40 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-[7px] text-fg-brand font-bold">2</span>
          </div>
          <div>
            <p className="text-fg-secondary text-[10px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>Greptile re-review — 1 finding</p>
            <p className="text-fg-tertiary text-[9px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>Escalated to Opus → resolved</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-[7px] text-green-400">✓</span>
          </div>
          <p className="text-green-400 text-[10px] font-medium" style={{ fontFamily: "var(--font-mono, monospace)" }}>
            Review passed — ready to merge
          </p>
        </div>
      </div>
      <div className="pt-1.5 border-t border-border-secondary">
        <p className="text-fg-tertiary text-[9px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>
          Up to 3 loops • Sonnet → Opus escalation
        </p>
      </div>
    </div>
  );
}

// ─── Phase-specific layouts ─────────────────────────────────────────────────

function PlanningPhase({ data }: { data: OrchestrationData }) {
  const waveColor = (w: number) => data.waveMappings.find(m => m.wave === w)?.color ?? "#787878";

  return (
    <div className="relative">
      {/* MAIN label */}
      <p className="text-fg-tertiary text-[11px] uppercase tracking-[0.1em] mb-3" style={{ fontFamily: "var(--font-accent, sans-serif)" }}>
        Main
      </p>

      {/* Main branch line — spans across grid from first node center to last node center */}
      <div className="relative">
        <div className="absolute left-[14px] right-[14px] h-[3px] bg-fg-brand" style={{ top: 14 }} />

        <div className="grid grid-cols-4 gap-8">
          {/* Research */}
          <div>
            <BranchNode className="relative z-10" />
            <StepLabel title="Research" subtitle="/karimo:research" />
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Folder width={14} height={14} className="text-fg-secondary" />
                  <span className="text-fg-primary text-[11px] font-medium">External</span>
                </div>
                <div className="flex flex-wrap gap-1 pl-5">
                  {data.research.external.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-bg-brand-subtle border border-border-brand/30 text-fg-brand" style={{ fontFamily: "var(--font-mono, monospace)" }}>{item.label}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <FolderCode width={14} height={14} className="text-fg-secondary" />
                  <span className="text-fg-primary text-[11px] font-medium">Internal</span>
                </div>
                <div className="flex flex-wrap gap-1 pl-5">
                  {data.research.internal.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-bg-brand-subtle border border-border-brand/30 text-fg-brand" style={{ fontFamily: "var(--font-mono, monospace)" }}>{item.label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Create PRD */}
          <div>
            <BranchNode className="relative z-10" />
            <StepLabel title="Create PRD" subtitle="/karimo:plan" />
            <div className="mt-4">
              <div className="inline-flex px-3 py-1.5 rounded-md bg-bg-brand-solid text-fg-primary text-[11px] font-semibold">
                {data.prdName}
              </div>
            </div>
          </div>

          {/* Task Briefs */}
          <div>
            <BranchNode className="relative z-10" />
            <StepLabel title="Task Briefs" subtitle="/karimo:run" />
            <div className="mt-4 grid grid-cols-2 gap-1">
              {data.taskBriefs.map((brief) => (
                <TaskBriefPill key={brief.id} id={brief.id} color={waveColor(brief.wave)} />
              ))}
            </div>
          </div>

          {/* Dependency Graph */}
          <div>
            <BranchNode className="relative z-10" />
            <StepLabel title="Dependency Graph" subtitle="/karimo:run" />
            <div className="mt-4 space-y-2">
              {data.waveMappings.map((mapping) => (
                <div key={mapping.wave} className="flex items-center gap-3">
                  <span className="text-fg-secondary text-[11px] w-12 flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>Wave {mapping.wave}</span>
                  <div className="flex gap-0.5">
                    {mapping.taskIds.map((taskId) => (
                      <div key={taskId} className="h-3.5 w-10 rounded-sm" style={{ backgroundColor: `${mapping.color}40`, border: `1px solid ${mapping.color}60` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExecutionPhase({ data }: { data: OrchestrationData }) {
  return (
    <div className="relative">
      {/* MAIN label */}
      <p className="text-fg-tertiary text-[11px] uppercase tracking-[0.1em] mb-3" style={{ fontFamily: "var(--font-accent, sans-serif)" }}>
        Main
      </p>

      {/* Main branch line — just the fork node area */}
      <div className="relative">
        <div className="absolute left-0 right-0 h-[3px] bg-fg-brand" style={{ top: 14 }} />

        {/* Two nodes: Execute (left) and Inspect (right) */}
        <div className="flex items-start justify-between">
          <div>
            <BranchNode className="relative z-10" />
            <StepLabel title="Execute" subtitle="/karimo:run" />
          </div>
          <div className="text-right">
            <BranchNode className="relative z-10 ml-auto" />
            <StepLabel title="Inspect" subtitle="Code Review" />
          </div>
        </div>
      </div>

      {/* Content below: feature branch + wave lifecycle */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-8 mt-4">
        {/* Left: feature branch + worktrees */}
        <div className="min-w-0">
          <div className="relative ml-3.5">
            {/* Vertical line from fork to merge */}
            <div className="absolute left-0 top-0 w-[3px] bg-fg-brand rounded-full" style={{ height: "100%" }} />

            <div className="pl-7">
              {/* Feature Branch header */}
              <div className="flex items-center gap-3 mb-4 pt-2">
                <FeatureNode />
                <div>
                  <p className="text-fg-primary text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)" }}>Feature Branch</p>
                  <p className="text-fg-tertiary text-[11px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>{data.prdName}</p>
                </div>
              </div>

              {/* Worktree area */}
              <div className="relative border-l-[3px] border-fg-brand/50 ml-3.5 pl-6">
                <div className="mb-3">
                  <p className="text-fg-primary text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)" }}>Worktrees</p>
                  <p className="text-fg-tertiary text-[11px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>Isolated Local</p>
                </div>

                <div className="space-y-2">
                  {data.execution.waves.map((wave) => (
                    <div key={wave.wave} className="flex items-center gap-3">
                      <span className="text-fg-secondary text-[11px] w-12 flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>Wave {wave.wave}</span>
                      <div className="flex gap-0.5 flex-1 max-w-[280px]">
                        {wave.tasks.map((task) => {
                          const filled = task.status !== "pending";
                          const opacity = task.status === "complete" ? 0.8 : task.status === "active" ? 0.4 : 0.1;
                          return (
                            <div key={task.id} className="flex-1 flex flex-col items-center gap-0.5">
                              <motion.div
                                className="h-3 w-full rounded-sm border"
                                style={{
                                  backgroundColor: filled ? `${wave.color}${Math.round(opacity * 255).toString(16).padStart(2, "0")}` : "var(--bg-tertiary)",
                                  borderColor: filled ? `${wave.color}60` : "var(--border-secondary)",
                                }}
                                animate={task.status === "active" ? { opacity: [0.5, 1, 0.5] } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <span className="text-[8px]" style={{ fontFamily: "var(--font-mono, monospace)", color: wave.color, opacity: 0.7 }}>
                                {task.id.replace("PRD-", "")}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Merge to feature */}
                <div className="mt-4 flex items-center gap-3">
                  <FeatureNode />
                  <div>
                    <p className="text-fg-primary text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)" }}>Merge to Feature</p>
                    <p className="text-fg-tertiary text-[11px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>Worktree commits → feature branch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: wave lifecycle panel */}
        <WaveLifecycle data={data} />
      </div>
    </div>
  );
}

function ReviewPhase({ data }: { data: OrchestrationData }) {
  return (
    <div className="relative">
      {/* MAIN label */}
      <p className="text-fg-tertiary text-[11px] uppercase tracking-[0.1em] mb-3" style={{ fontFamily: "var(--font-accent, sans-serif)" }}>
        Main
      </p>

      {/* Main branch line with 3 nodes */}
      <div className="relative">
        <div className="absolute left-[14px] right-[14px] h-[3px] bg-fg-brand" style={{ top: 14 }} />

        <div className="grid grid-cols-3 gap-8">
          {/* Inspect */}
          <div>
            <BranchNode className="relative z-10" />
            <StepLabel title="Inspect" subtitle="Code Review" />
          </div>

          {/* Fix Errors */}
          <div>
            <BranchNode className="relative z-10" />
            <StepLabel title="Fix Errors" subtitle="Auto or Manual" />
          </div>

          {/* Merge */}
          <div>
            <BranchNode className="relative z-10" />
            <StepLabel title="Merge" subtitle="Pass tests to main" />
          </div>
        </div>
      </div>

      {/* Content aligned under each node */}
      <div className="grid grid-cols-3 gap-8 mt-6">
        {/* Under Inspect: branch structure */}
        <div>
          <div className="relative ml-3.5">
            <div className="absolute left-0 top-0 w-[3px] bg-fg-brand rounded-full" style={{ height: "100%" }} />

            <div className="pl-7 pt-2">
              <div className="flex items-center gap-3 mb-4">
                <FeatureNode />
                <div>
                  <p className="text-fg-primary text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)" }}>PR Created</p>
                  <p className="text-fg-tertiary text-[11px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>feature &gt; main</p>
                </div>
              </div>

              <div className="border-l-[3px] border-fg-brand/50 ml-3.5 pl-6 pb-2">
                <div className="flex items-center gap-3">
                  <FeatureNode />
                  <div>
                    <p className="text-fg-primary text-[13px] font-semibold" style={{ fontFamily: "var(--font-body)" }}>Merged to Main</p>
                    <p className="text-fg-tertiary text-[11px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>Clean atomic history</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Under Fix Errors: automated review loop */}
        <div>
          <ReviewLoop />
        </div>

        {/* Under Merge: PR card */}
        <div>
          <PRCard data={data} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const phaseTransition = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
};

export function GitGraph({ data, activePhase }: GitGraphProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activePhase}
        {...phaseTransition}
      >
        {activePhase === "planning" && <PlanningPhase data={data} />}
        {activePhase === "execution" && <ExecutionPhase data={data} />}
        {activePhase === "review" && <ReviewPhase data={data} />}
      </motion.div>
    </AnimatePresence>
  );
}
