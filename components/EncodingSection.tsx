"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { orchestrationData, type PhaseId } from "@/lib/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useParallax } from "@/components/ui/ParallaxSection";
import { PhaseToggle } from "@/components/orchestration/PhaseToggle";
import { GitGraph } from "@/components/orchestration/GitGraph";
import { GitGraphMobile } from "@/components/orchestration/GitGraphMobile";
import { PhaseDescription } from "@/components/orchestration/PhaseDescription";
import { TimelineLegend } from "@/components/orchestration/TimelineLegend";
const PHASE_ORDER: PhaseId[] = ["planning", "execution", "review"];

export function EncodingSection() {
  const { ref: sectionRef, y } = useParallax(30);
  const [activePhase, setActivePhase] = useState<PhaseId>("planning");

  const currentIndex = PHASE_ORDER.indexOf(activePhase);

  const handleNavigate = useCallback(
    (direction: "prev" | "next") => {
      const newIndex =
        direction === "prev"
          ? Math.max(0, currentIndex - 1)
          : Math.min(PHASE_ORDER.length - 1, currentIndex + 1);
      setActivePhase(PHASE_ORDER[newIndex]);
    },
    [currentIndex]
  );

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < PHASE_ORDER.length - 1;

  return (
    <section ref={sectionRef} id="orchestration" className="section-padding min-h-screen bg-bg-secondary overflow-hidden">
      <motion.div style={{ y }}>
      {/* Header + Phase toggle — narrower container */}
      <div className="max-w-5xl mx-auto px-6">
        {/* Row 1: Label + Heading + Nav arrows + Legend */}
        <div className="mb-4">
          <SectionLabel>ENCODING</SectionLabel>
          <div className="flex items-center justify-between mt-4">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-primary"
            >
              Git Timeline
            </motion.h2>

            {/* Nav arrows + Legend */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavigate("prev")}
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
                onClick={() => handleNavigate("next")}
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
              <div className="w-px h-5 bg-border-secondary ml-1" />
              <TimelineLegend />
            </div>
          </div>
        </div>

        {/* Row 2: Phase tabs */}
        <PhaseToggle
          phases={orchestrationData.phases}
          activePhase={activePhase}
          onPhaseChange={setActivePhase}
        />
      </div>

      {/* Graph + Description — wider container */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Desktop git graph */}
        <div className="hidden md:block">
          <GitGraph
            key={`desktop-${activePhase}`}
            data={orchestrationData}
            activePhase={activePhase}
            shouldAnimate={true}
          />
        </div>

        {/* Mobile card layout */}
        <div className="md:hidden">
          <GitGraphMobile
            key={`mobile-${activePhase}`}
            data={orchestrationData}
            activePhase={activePhase}
            shouldAnimate={true}
          />
        </div>

        {/* Phase description panel */}
        <PhaseDescription
          activePhase={activePhase}
          descriptions={orchestrationData.phaseDescriptions}
          shouldAnimate={true}
        />
      </div>
      </motion.div>
    </section>
  );
}
