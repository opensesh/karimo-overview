"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { OrchestrationData, PhaseId } from "@/lib/constants";
import { GitBranch02, GitCommit, GitMerge, GitPullRequest } from "@untitledui/icons";
import { phaseStagger, fadeInUp } from "@/lib/motion";

interface GitGraphMobileProps {
  data: OrchestrationData;
  activePhase: PhaseId;
  shouldAnimate: boolean;
  onAnimationComplete?: () => void;
}

function MobileCard({
  label,
  sublabel,
  icon: Icon,
  children,
  isLast = false,
  branchType = "main",
}: {
  label: string;
  sublabel: string;
  icon: typeof GitCommit;
  children?: React.ReactNode;
  isLast?: boolean;
  branchType?: "main" | "feature";
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative pl-8"
    >
      {!isLast && (
        <div
          className={`absolute left-[11px] top-7 bottom-0 w-px ${
            branchType === "feature"
              ? "border-l-2 border-dashed border-fg-brand/30"
              : "border-l-2 border-solid border-fg-brand/50"
          }`}
        />
      )}
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-bg-secondary border-2 border-fg-brand flex items-center justify-center">
        <Icon width={11} height={11} className="text-fg-brand" />
      </div>
      <div className="pb-5">
        <p className="text-fg-primary text-sm font-semibold" style={{ fontFamily: "var(--font-body)" }}>
          {label}
        </p>
        <p className="text-fg-tertiary text-xs mt-0.5" style={{ fontFamily: "var(--font-mono, monospace)" }}>
          {sublabel}
        </p>
        {children && <div className="mt-3">{children}</div>}
      </div>
    </motion.div>
  );
}

function MainBranchIndicator() {
  return (
    <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-3">
      <div className="w-2 h-2 rounded-full bg-fg-brand" />
      <span
        className="text-fg-tertiary text-[10px] uppercase tracking-widest"
        style={{ fontFamily: "var(--font-accent, sans-serif)" }}
      >
        Main
      </span>
      <div className="flex-1 h-px bg-fg-brand/30" />
    </motion.div>
  );
}

export function GitGraphMobile({ data, activePhase, shouldAnimate, onAnimationComplete }: GitGraphMobileProps) {
  const waveColor = (w: number) => data.waveMappings.find(m => m.wave === w)?.color ?? "#787878";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activePhase}
        variants={phaseStagger}
        initial={shouldAnimate ? "hidden" : false}
        animate="visible"
        exit="exit"
        onAnimationComplete={onAnimationComplete}
      >
        {activePhase === "planning" && (
          <>
            <MainBranchIndicator />
            <MobileCard label="Research" sublabel="/karimo:research" icon={GitCommit}>
              <div className="flex flex-wrap gap-1.5">
                {data.research.external.map((item, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-bg-brand-subtle border border-border-brand/30 text-fg-brand" style={{ fontFamily: "var(--font-mono, monospace)" }}>
                    {item.label}
                  </span>
                ))}
                {data.research.internal.map((item, i) => (
                  <span key={`int-${i}`} className="px-2 py-0.5 rounded text-[10px] bg-bg-brand-subtle border border-border-brand/30 text-fg-brand" style={{ fontFamily: "var(--font-mono, monospace)" }}>
                    {item.label}
                  </span>
                ))}
              </div>
            </MobileCard>
            <MobileCard label="Create PRD" sublabel="/karimo:plan" icon={GitCommit}>
              <span className="inline-flex px-3 py-1 rounded bg-bg-brand-solid text-fg-primary text-[11px] font-semibold">
                {data.prdName}
              </span>
            </MobileCard>
            <MobileCard label="Task Briefs" sublabel="/karimo:run" icon={GitCommit}>
              <div className="flex flex-wrap gap-1">
                {data.taskBriefs.map((brief) => (
                  <span
                    key={brief.id}
                    className="px-1.5 py-0.5 rounded text-[9px] font-semibold border"
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      backgroundColor: `${waveColor(brief.wave)}15`,
                      borderColor: `${waveColor(brief.wave)}40`,
                      color: waveColor(brief.wave),
                    }}
                  >
                    {brief.id}
                  </span>
                ))}
              </div>
            </MobileCard>
            <MobileCard label="Dependency Graph" sublabel="tasks.yaml" icon={GitCommit} isLast>
              <div className="space-y-1.5">
                {data.waveMappings.map((mapping) => (
                  <div key={mapping.wave} className="flex items-center gap-2">
                    <span className="text-fg-secondary text-[10px] w-10" style={{ fontFamily: "var(--font-body)" }}>W{mapping.wave}</span>
                    <div className="flex gap-0.5">
                      {mapping.taskIds.map((id) => (
                        <div key={id} className="h-2.5 w-8 rounded-sm" style={{ backgroundColor: `${mapping.color}40`, border: `1px solid ${mapping.color}60` }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </MobileCard>
          </>
        )}

        {activePhase === "execution" && (
          <>
            {/* Main branch context at the top */}
            <MainBranchIndicator />

            {/* Fork indicator */}
            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-2 pl-1">
              <div className="w-3 h-px bg-fg-brand/50" />
              <span className="text-fg-tertiary text-[9px] uppercase tracking-wider" style={{ fontFamily: "var(--font-accent, sans-serif)" }}>
                fork → {data.featureBranch}
              </span>
            </motion.div>

            <MobileCard label="Feature Branch" sublabel={data.prdName} icon={GitBranch02} branchType="feature">
              <p className="text-fg-tertiary text-[10px]" style={{ fontFamily: "var(--font-mono, monospace)" }}>
                Forked from main
              </p>
            </MobileCard>
            {data.execution.waves.map((wave) => (
              <MobileCard
                key={wave.wave}
                label={`Wave ${wave.wave}`}
                sublabel={`${wave.tasks.length} parallel tasks`}
                icon={GitBranch02}
                branchType="feature"
              >
                <div className="flex gap-0.5 max-w-[200px]">
                  {wave.tasks.map((task) => {
                    const filled = task.status !== "pending";
                    const opacity = task.status === "complete" ? 0.8 : task.status === "active" ? 0.4 : 0.1;
                    return (
                      <div key={task.id} className="flex-1 flex flex-col items-center gap-0.5">
                        <div
                          className="h-3 w-full rounded-sm border"
                          style={{
                            backgroundColor: filled ? `${wave.color}${Math.round(opacity * 255).toString(16).padStart(2, "0")}` : "var(--bg-tertiary)",
                            borderColor: filled ? `${wave.color}60` : "var(--border-secondary)",
                          }}
                        />
                        <span className="text-[8px]" style={{ fontFamily: "var(--font-mono, monospace)", color: wave.color, opacity: 0.7 }}>
                          {task.id.replace("PRD-", "")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </MobileCard>
            ))}
            <MobileCard label="Merge to Feature" sublabel="Worktree commits → feature branch" icon={GitMerge} branchType="feature">
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-px bg-fg-brand/50" />
                <span className="text-fg-tertiary text-[9px] uppercase tracking-wider" style={{ fontFamily: "var(--font-accent, sans-serif)" }}>
                  merge → main
                </span>
              </div>
            </MobileCard>

            {/* Return to main indicator */}
            <MainBranchIndicator />
          </>
        )}

        {activePhase === "review" && (
          <>
            <MainBranchIndicator />
            <MobileCard label="PR Created" sublabel="feature > main" icon={GitPullRequest} />
            {data.reviewSteps.map((step, i) => (
              <MobileCard
                key={step.id}
                label={step.label}
                sublabel={step.sublabel}
                icon={step.id === "merge" ? GitMerge : GitCommit}
                isLast={i === data.reviewSteps.length - 1}
              />
            ))}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
