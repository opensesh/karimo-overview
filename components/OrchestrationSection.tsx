"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { orchestrationData, type PhaseId } from "@/lib/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PhaseToggle } from "@/components/orchestration/PhaseToggle";
import { GitGraph } from "@/components/orchestration/GitGraph";
import { GitGraphMobile } from "@/components/orchestration/GitGraphMobile";
import { PhaseDescription } from "@/components/orchestration/PhaseDescription";
const PHASE_ORDER: PhaseId[] = ["planning", "execution", "review"];

export function OrchestrationSection() {
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

  return (
    <section id="orchestration" className="section-padding bg-bg-secondary">
      {/* Header + Phase toggle — narrower container */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <SectionLabel>OVERVIEW</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-primary mt-4"
          >
            Workflow Overview
          </motion.h2>
        </div>

        <PhaseToggle
          phases={orchestrationData.phases}
          activePhase={activePhase}
          onPhaseChange={setActivePhase}
          onNavigate={handleNavigate}
          canGoPrev={currentIndex > 0}
          canGoNext={currentIndex < PHASE_ORDER.length - 1}
        />
      </div>

      {/* Graph + Description — wider container */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Desktop git graph */}
        <div className="hidden md:block">
          <GitGraph data={orchestrationData} activePhase={activePhase} />
        </div>

        {/* Mobile card layout */}
        <div className="md:hidden">
          <GitGraphMobile data={orchestrationData} activePhase={activePhase} />
        </div>

        {/* Phase description panel */}
        <PhaseDescription
          activePhase={activePhase}
          descriptions={orchestrationData.phaseDescriptions}
        />
      </div>
    </section>
  );
}
