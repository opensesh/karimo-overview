"use client";

import { motion } from "framer-motion";
import type { PhaseId, OrchestrationPhase } from "@/lib/constants";

interface PhaseToggleProps {
  phases: OrchestrationPhase[];
  activePhase: PhaseId;
  onPhaseChange: (phase: PhaseId) => void;
}

export function PhaseToggle({
  phases,
  activePhase,
  onPhaseChange,
}: PhaseToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-bg-tertiary mb-8">
      {phases.map((phase) => {
        const isActive = activePhase === phase.id;
        return (
          <button
            key={phase.id}
            onClick={() => onPhaseChange(phase.id)}
            className="relative px-4 py-2 rounded-md transition-colors duration-200"
          >
            {isActive && (
              <motion.div
                layoutId="phase-indicator"
                className="absolute inset-0 rounded-md bg-bg-brand-solid"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 text-accent text-sm whitespace-nowrap ${
                isActive ? "text-fg-primary" : "text-fg-secondary"
              }`}
            >
              <span className="hidden sm:inline">{phase.label}</span>
              <span className="sm:hidden">{phase.shortLabel}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
