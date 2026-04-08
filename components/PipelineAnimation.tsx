"use client";

import { useState, useEffect } from "react";

const pipelineStages = [
  { id: "research", label: "Research", icon: "🔍", command: "/karimo:research" },
  { id: "plan", label: "Plan", icon: "📋", command: "/karimo:plan" },
  { id: "run", label: "Run", icon: "⚡", command: "/karimo:run" },
  { id: "review", label: "Review", icon: "🔎", command: "Auto-Review" },
  { id: "merge", label: "Merge", icon: "🔀", command: "/karimo:merge" },
];

export function PipelineAnimation() {
  const [activeStage, setActiveStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % pipelineStages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <div
      className="py-16 px-6"
      onMouseEnter={() => setIsAnimating(false)}
      onMouseLeave={() => setIsAnimating(true)}
    >
      {/* Pipeline visualization */}
      <div className="relative max-w-4xl mx-auto">
        {/* Connection line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--color-black70)] -translate-y-1/2" />

        {/* Progress line */}
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-[var(--color-aperol)] -translate-y-1/2 transition-all duration-500"
          style={{
            width: `${(activeStage / (pipelineStages.length - 1)) * 100}%`,
          }}
        />

        {/* Stages */}
        <div className="relative flex justify-between">
          {pipelineStages.map((stage, index) => {
            const isActive = index === activeStage;
            const isPast = index < activeStage;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(index)}
                className="group flex flex-col items-center gap-3 focus:outline-none"
              >
                {/* Node */}
                <div
                  className={`
                    relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center
                    transition-all duration-300 cursor-pointer
                    ${
                      isActive
                        ? "bg-[var(--color-aperol)] scale-110 shadow-lg shadow-[var(--color-aperol)]/30"
                        : isPast
                        ? "bg-[var(--color-black60)]"
                        : "bg-[var(--color-black80)] group-hover:bg-[var(--color-black70)]"
                    }
                  `}
                >
                  <span className="text-xl md:text-2xl">{stage.icon}</span>

                  {/* Pulse ring for active */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full border-2 border-[var(--color-aperol)] animate-ping opacity-50" />
                  )}
                </div>

                {/* Label */}
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`
                      font-semibold text-sm md:text-base transition-colors
                      ${isActive ? "text-[var(--color-vanilla)]" : "text-[var(--color-black50)]"}
                    `}
                  >
                    {stage.label}
                  </span>
                  <code
                    className={`
                      text-xs font-mono px-2 py-0.5 rounded
                      ${
                        isActive
                          ? "bg-[var(--color-aperol)]/20 text-[var(--color-aperol)]"
                          : "text-[var(--color-black60)]"
                      }
                    `}
                  >
                    {stage.command}
                  </code>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage details */}
      <div className="mt-12 max-w-2xl mx-auto text-center">
        <div className="p-6 rounded-xl bg-[var(--color-black80)] border border-[var(--color-black70)]">
          <StageDetails stage={pipelineStages[activeStage]} />
        </div>
      </div>

      {/* Auto-play indicator */}
      <div className="mt-6 flex justify-center">
        <span className="text-xs text-[var(--color-black50)] font-mono">
          {isAnimating ? "Auto-playing • Hover to pause" : "Paused • Move away to resume"}
        </span>
      </div>
    </div>
  );
}

function StageDetails({ stage }: { stage: (typeof pipelineStages)[number] }) {
  const details: Record<string, { description: string; agents: string[] }> = {
    research: {
      description: "Gather context about your codebase, dependencies, and existing patterns.",
      agents: ["Investigator Agent", "Researcher Agent"],
    },
    plan: {
      description: "Interactive PRD interviews that define requirements and break down tasks.",
      agents: ["Interviewer Agent", "Refiner Agent", "Brief Writer"],
    },
    run: {
      description: "Execute tasks with coordinated agents working in isolated worktrees.",
      agents: ["PM Agent", "Implementer", "Tester", "Documenter"],
    },
    review: {
      description: "Automated code review with revision loops and model escalation.",
      agents: ["Review Architect", "Greptile / Claude Review"],
    },
    merge: {
      description: "Create final PR consolidating all changes with full audit trail.",
      agents: ["PM Finalizer", "Coverage Reviewer"],
    },
  };

  const info = details[stage.id];

  return (
    <div className="space-y-4">
      <p className="text-[var(--color-vanilla)] text-lg">{info.description}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {info.agents.map((agent) => (
          <span
            key={agent}
            className="px-3 py-1 text-sm font-mono rounded-full bg-[var(--color-black70)] text-[var(--color-black30)]"
          >
            {agent}
          </span>
        ))}
      </div>
    </div>
  );
}
