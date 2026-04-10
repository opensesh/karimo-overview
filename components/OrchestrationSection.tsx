"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
  const [animatedPhases, setAnimatedPhases] = useState<Set<PhaseId>>(new Set());
  const [resetKey, setResetKey] = useState(0);
  const graphRef = useRef<HTMLDivElement>(null);
  const maxHeightRef = useRef(0);

  const currentIndex = PHASE_ORDER.indexOf(activePhase);

  // Track the tallest phase and lock the container to that height
  useEffect(() => {
    const el = graphRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const h = entry.contentRect.height;
      if (h > maxHeightRef.current) {
        maxHeightRef.current = h;
        el.style.minHeight = `${h}px`;
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [resetKey]);
  const shouldAnimate = !animatedPhases.has(activePhase);

  const handleAnimationComplete = useCallback(() => {
    setAnimatedPhases((prev) => new Set(prev).add(activePhase));
  }, [activePhase]);

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

  const handleReset = useCallback(() => {
    setAnimatedPhases(new Set());
    setResetKey((prev) => prev + 1);
    setActivePhase("planning");
    maxHeightRef.current = 0;
    if (graphRef.current) graphRef.current.style.minHeight = "";
  }, []);

  return (
    <section id="orchestration" className="section-padding bg-bg-secondary">
      {/* Header + Phase toggle — narrower container */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <SectionLabel>ENCODING</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-primary mt-4"
          >
            Git Encoding Timeline
          </motion.h2>
        </div>

        <PhaseToggle
          phases={orchestrationData.phases}
          activePhase={activePhase}
          onPhaseChange={setActivePhase}
          onNavigate={handleNavigate}
          onReset={handleReset}
          canGoPrev={currentIndex > 0}
          canGoNext={currentIndex < PHASE_ORDER.length - 1}
        />
      </div>

      {/* Graph + Description — wider container */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Height-locked wrapper — grows to tallest phase, never shrinks */}
        <div ref={graphRef}>
          {/* Desktop git graph */}
          <div className="hidden md:block">
            <GitGraph
              key={`desktop-${resetKey}`}
              data={orchestrationData}
              activePhase={activePhase}
              shouldAnimate={shouldAnimate}
              onAnimationComplete={handleAnimationComplete}
            />
          </div>

          {/* Mobile card layout */}
          <div className="md:hidden">
            <GitGraphMobile
              key={`mobile-${resetKey}`}
              data={orchestrationData}
              activePhase={activePhase}
              shouldAnimate={shouldAnimate}
              onAnimationComplete={handleAnimationComplete}
            />
          </div>
        </div>

        {/* Phase description panel */}
        <PhaseDescription
          activePhase={activePhase}
          descriptions={orchestrationData.phaseDescriptions}
          shouldAnimate={shouldAnimate}
        />
      </div>
    </section>
  );
}
