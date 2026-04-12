"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
  }, []);

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
    <section ref={sectionRef} id="orchestration" className="section-padding min-h-screen bg-bg-primary overflow-hidden">
      <motion.div style={{ y }}>
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
            Git Timeline
          </motion.h2>
        </div>

        <PhaseToggle
          phases={orchestrationData.phases}
          activePhase={activePhase}
          onPhaseChange={setActivePhase}
          onNavigate={handleNavigate}
          canGoPrev={currentIndex > 0}
          canGoNext={currentIndex < PHASE_ORDER.length - 1}
        >
          <TimelineLegend />
        </PhaseToggle>
      </div>

      {/* Graph + Description — wider container */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Height-locked wrapper — grows to tallest phase, never shrinks */}
        <div ref={graphRef}>
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
