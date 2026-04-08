"use client";

import { useState } from "react";
import { waveData } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function OrchestrationViz() {
  const [expandedWave, setExpandedWave] = useState<number | null>(1);
  const [showFeature, setShowFeature] = useState<string | null>(null);

  const features = [
    {
      id: "worktree",
      title: "Worktree Isolation",
      description:
        "Each task executes in its own git worktree. No conflicts, no race conditions.",
      icon: "🌳",
    },
    {
      id: "branch",
      title: "Branch Assertion",
      description:
        "PM Agent verifies branch state before and after each operation.",
      icon: "🔒",
    },
    {
      id: "loop",
      title: "Loop Detection",
      description:
        "Automatic detection of revision loops prevents infinite cycles.",
      icon: "↻",
    },
    {
      id: "crash",
      title: "Crash Recovery",
      description:
        "Execution state reconstructed from git. Resume exactly where you left off.",
      icon: "🔄",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-[var(--color-charcoal)]">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          number="03"
          title="Orchestration"
          subtitle="Wave-based parallel execution with worktree isolation"
        />

        {/* Wave visualization */}
        <div className="relative">
          {/* Main branch line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-[var(--color-black60)]" />

          {/* Waves */}
          <div className="space-y-8">
            {waveData.map((wave, waveIndex) => {
              const isExpanded = expandedWave === wave.wave;

              return (
                <div key={wave.wave} className="relative">
                  {/* Wave header */}
                  <button
                    onClick={() =>
                      setExpandedWave(isExpanded ? null : wave.wave)
                    }
                    className="relative z-10 mx-auto block"
                  >
                    <div
                      className={`
                        flex items-center gap-3 px-4 py-2 rounded-full
                        transition-all duration-300 cursor-pointer
                        ${
                          isExpanded
                            ? "bg-[var(--color-aperol)] text-[var(--color-vanilla)]"
                            : "bg-[var(--color-black80)] text-[var(--color-black30)] hover:bg-[var(--color-black70)]"
                        }
                      `}
                    >
                      <span className="font-mono text-sm">Wave {wave.wave}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Tasks */}
                  <div
                    className={`
                      grid transition-all duration-500
                      ${isExpanded ? "grid-rows-[1fr] mt-6" : "grid-rows-[0fr] mt-0"}
                    `}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col md:flex-row gap-4 justify-center">
                        {wave.tasks.map((task, taskIndex) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            waveNumber={wave.wave}
                            side={taskIndex % 2 === 0 ? "left" : "right"}
                          />
                        ))}
                      </div>

                      {/* Parallel indicator */}
                      <div className="flex justify-center mt-4">
                        <span className="text-xs font-mono text-[var(--color-black50)] px-3 py-1 rounded-full bg-[var(--color-black80)]">
                          Parallel execution → PRs to main
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Collapse animation */}
                  {waveIndex < waveData.length - 1 && (
                    <div className="flex justify-center my-4">
                      <svg
                        className="w-6 h-6 text-[var(--color-black50)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-16">
          <h4 className="text-lg font-semibold text-[var(--color-vanilla)] mb-6 text-center">
            Key Features
          </h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() =>
                  setShowFeature(showFeature === feature.id ? null : feature.id)
                }
                className={`
                  p-4 rounded-xl text-left transition-all duration-300
                  ${
                    showFeature === feature.id
                      ? "bg-[var(--color-aperol)] text-[var(--color-vanilla)]"
                      : "bg-[var(--color-black80)] text-[var(--color-vanilla)] hover:bg-[var(--color-black70)]"
                  }
                `}
              >
                <span className="text-2xl">{feature.icon}</span>
                <h5 className="font-medium mt-2">{feature.title}</h5>
                <p
                  className={`text-sm mt-1 ${
                    showFeature === feature.id
                      ? "text-[var(--color-vanilla)]/80"
                      : "text-[var(--color-black30)]"
                  }`}
                >
                  {feature.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TaskCard({
  task,
  waveNumber,
  side,
}: {
  task: { id: string; name: string; status: string };
  waveNumber: number;
  side: "left" | "right";
}) {
  const statusColors = {
    complete: "bg-green-500/20 text-green-400 border-green-500/30",
    active: "bg-[var(--color-aperol)]/20 text-[var(--color-aperol)] border-[var(--color-aperol)]/30",
    pending: "bg-[var(--color-black70)] text-[var(--color-black30)] border-[var(--color-black60)]",
  };

  const statusLabels = {
    complete: "✓ Merged",
    active: "● Running",
    pending: "○ Queued",
  };

  return (
    <div
      className={`
        p-4 rounded-xl border backdrop-blur-sm w-full md:w-64
        ${statusColors[task.status as keyof typeof statusColors]}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <code className="text-xs font-mono opacity-70">{task.id}</code>
          <h5 className="font-medium mt-1">{task.name}</h5>
        </div>
        <span className="text-xs font-mono whitespace-nowrap">
          {statusLabels[task.status as keyof typeof statusLabels]}
        </span>
      </div>
      <div className="mt-3 text-xs font-mono opacity-60">
        Branch: worktree/prd-{waveNumber}-{task.id}
      </div>
    </div>
  );
}
