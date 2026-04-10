"use client";

import { motion } from "framer-motion";
import type { PhaseId, OrchestrationPhase } from "@/lib/constants";

interface PhaseToggleProps {
  phases: OrchestrationPhase[];
  activePhase: PhaseId;
  onPhaseChange: (phase: PhaseId) => void;
  onNavigate?: (direction: "prev" | "next") => void;
  onReset?: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
}

export function PhaseToggle({
  phases,
  activePhase,
  onPhaseChange,
  onNavigate,
  onReset,
  canGoPrev = true,
  canGoNext = true,
}: PhaseToggleProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {/* Left-aligned toggle */}
      <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-bg-tertiary">
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

      {/* Right-aligned nav buttons */}
      {onNavigate && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("prev")}
            disabled={!canGoPrev}
            className="w-8 h-8 rounded-md bg-bg-tertiary flex items-center justify-center
                       text-fg-secondary hover:text-fg-primary hover:bg-border-primary
                       disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Previous phase"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => onNavigate("next")}
            disabled={!canGoNext}
            className="w-8 h-8 rounded-md bg-bg-tertiary flex items-center justify-center
                       text-fg-secondary hover:text-fg-primary hover:bg-border-primary
                       disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Next phase"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {onReset && (
            <>
              <div className="w-px h-5 bg-border-secondary ml-1" />
              <button
                onClick={onReset}
                className="w-8 h-8 rounded-md bg-bg-tertiary flex items-center justify-center
                           text-fg-secondary hover:text-fg-primary hover:bg-border-primary
                           transition-all duration-200"
                aria-label="Reset animations"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 1 9 9" />
                  <polyline points="1 7 3 12 8 10" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
