"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { adoptionPhases } from "@/lib/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function AdoptionSection() {
  const [activePhase, setActivePhase] = useState(1);

  return (
    <section className="section-padding container-wide bg-bg-primary">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <SectionLabel>ADOPTION</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-primary mt-4"
          >
            Three-Phase Progression
          </motion.h2>
        </div>

        {/* Phase selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {adoptionPhases.map((phase) => (
            <button
              key={phase.phase}
              onClick={() => setActivePhase(phase.phase)}
              className={`
                relative px-6 py-3 rounded-xl
                transition-all duration-300
                ${
                  activePhase === phase.phase
                    ? "bg-bg-brand-solid text-fg-primary"
                    : "bg-bg-secondary text-fg-secondary hover:text-fg-primary"
                }
              `}
            >
              <span className="text-accent block text-lg">Phase {phase.phase}</span>
              <span className="text-body block text-xs opacity-70">{phase.subtitle}</span>
            </button>
          ))}
        </motion.div>

        {/* Phase content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid lg:grid-cols-2 gap-8 items-start"
        >
          {/* Phase details */}
          <div className="space-y-6">
            {adoptionPhases.map((phase) => (
              <div
                key={phase.phase}
                className={`
                  transition-all duration-500
                  ${activePhase === phase.phase ? "opacity-100" : "opacity-0 hidden"}
                `}
              >
                <h3 className="text-display text-2xl text-fg-primary mb-4">
                  {phase.title}
                </h3>
                <ul className="space-y-3">
                  {phase.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-fg-brand mt-1">✓</span>
                      <span className="text-body text-fg-primary">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 rounded-lg bg-bg-secondary border border-border-secondary">
                  <span className="text-accent text-xs text-fg-tertiary">
                    REQUIREMENT
                  </span>
                  <p className="text-body text-fg-primary mt-1">
                    {phase.requirement}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Context architecture diagram */}
          <div className="bg-bg-secondary rounded-xl p-6 border border-border-secondary">
            <h4 className="text-heading text-lg text-fg-primary mb-6">
              Context Architecture
            </h4>
            <ContextDiagram activePhase={activePhase} />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 text-center"
        >
          <a
            href="https://github.com/opensesh/KARIMO"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-bg-brand-solid text-fg-primary font-semibold hover:opacity-90 transition-opacity"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Get Started with KARIMO
          </a>
          <p className="mt-4 text-body text-fg-tertiary text-sm">
            Run the install script and start with{" "}
            <code className="px-2 py-0.5 bg-bg-secondary rounded text-fg-brand">
              /karimo:research
            </code>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ContextDiagram({ activePhase }: { activePhase: number }) {
  const layers = [
    {
      id: "l1",
      label: "L1: Session Context",
      items: ["PRD state", "Task progress", "Wave execution"],
      alwaysActive: true,
    },
    {
      id: "l2",
      label: "L2: Project Context",
      items: ["Learnings", "Patterns", "Anti-patterns"],
      alwaysActive: true,
    },
    {
      id: "review",
      label: "Review Layer",
      items: ["Greptile rules", "Revision loops", "Model escalation"],
      requiredPhase: 2,
    },
    {
      id: "monitor",
      label: "Monitoring Layer",
      items: ["Dashboard", "Metrics", "PR tracking"],
      requiredPhase: 3,
    },
  ];

  return (
    <div className="space-y-4">
      {layers.map((layer) => {
        const isActive =
          layer.alwaysActive || (layer.requiredPhase && activePhase >= layer.requiredPhase);

        return (
          <div
            key={layer.id}
            className={`
              p-4 rounded-lg transition-all duration-300
              ${
                isActive
                  ? "bg-bg-tertiary border border-border-primary"
                  : "bg-bg-tertiary border border-border-secondary opacity-40"
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-accent text-sm ${
                  isActive ? "text-fg-brand" : "text-fg-tertiary"
                }`}
              >
                {layer.label}
              </span>
              {!layer.alwaysActive && (
                <span
                  className={`text-accent text-xs px-2 py-0.5 rounded ${
                    isActive
                      ? "bg-bg-brand-subtle text-fg-brand"
                      : "bg-bg-tertiary text-fg-tertiary"
                  }`}
                >
                  Phase {layer.requiredPhase}+
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {layer.items.map((item) => (
                <span
                  key={item}
                  className={`text-body text-xs px-2 py-1 rounded ${
                    isActive
                      ? "bg-bg-secondary text-fg-primary"
                      : "bg-bg-tertiary text-fg-tertiary"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
