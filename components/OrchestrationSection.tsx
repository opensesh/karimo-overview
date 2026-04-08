"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { waveData } from "@/lib/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function OrchestrationSection() {
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
    <section className="section-padding container-wide bg-bg-secondary">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <SectionLabel>ORCHESTRATION</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-primary mt-4"
          >
            Wave-Based Execution
          </motion.h2>
        </div>

        {/* Wave visualization */}
        <div className="relative">
          {/* Main branch line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-border-secondary" />

          {/* Waves */}
          <div className="space-y-8">
            {waveData.map((wave, waveIndex) => {
              const isExpanded = expandedWave === wave.wave;

              return (
                <motion.div
                  key={wave.wave}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: waveIndex * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative"
                >
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
                            ? "bg-bg-brand-solid text-fg-primary"
                            : "bg-bg-tertiary text-fg-secondary hover:bg-border-primary"
                        }
                      `}
                    >
                      <span className="text-accent text-sm">Wave {wave.wave}</span>
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
                        <span className="text-accent text-xs text-fg-tertiary px-3 py-1 rounded-full bg-bg-tertiary">
                          Parallel execution → PRs to main
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Collapse animation */}
                  {waveIndex < waveData.length - 1 && (
                    <div className="flex justify-center my-4">
                      <svg
                        className="w-6 h-6 text-fg-tertiary"
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
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16"
        >
          <h4 className="text-heading text-lg text-fg-primary mb-6 text-center">
            Key Features
          </h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.button
                key={feature.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.4,
                  delay: 0.4 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() =>
                  setShowFeature(showFeature === feature.id ? null : feature.id)
                }
                className={`
                  p-4 rounded-xl text-left transition-all duration-300
                  ${
                    showFeature === feature.id
                      ? "bg-bg-brand-solid text-fg-primary"
                      : "bg-bg-tertiary text-fg-primary hover:bg-border-primary"
                  }
                `}
              >
                <span className="text-2xl">{feature.icon}</span>
                <h5 className="text-heading font-medium mt-2">{feature.title}</h5>
                <p
                  className={`text-body text-sm mt-1 ${
                    showFeature === feature.id
                      ? "text-fg-primary/80"
                      : "text-fg-secondary"
                  }`}
                >
                  {feature.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TaskCard({
  task,
  waveNumber,
}: {
  task: { id: string; name: string; status: string };
  waveNumber: number;
  side: "left" | "right";
}) {
  const statusColors = {
    complete: "bg-green-500/20 text-green-400 border-green-500/30",
    active: "bg-bg-brand-subtle text-fg-brand border-border-brand/30",
    pending: "bg-bg-tertiary text-fg-secondary border-border-secondary",
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
          <code className="text-accent text-xs opacity-70">{task.id}</code>
          <h5 className="text-heading font-medium mt-1">{task.name}</h5>
        </div>
        <span className="text-accent text-xs whitespace-nowrap">
          {statusLabels[task.status as keyof typeof statusLabels]}
        </span>
      </div>
      <div className="mt-3 text-accent text-xs opacity-60">
        Branch: worktree/prd-{waveNumber}-{task.id}
      </div>
    </div>
  );
}
