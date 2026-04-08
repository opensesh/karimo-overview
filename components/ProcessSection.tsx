"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { processSteps } from "@/lib/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function ProcessSection() {
  const [expandedStep, setExpandedStep] = useState<string | null>("research");

  return (
    <section className="section-padding container-wide bg-bg-primary">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <SectionLabel>PROCESS</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-primary mt-4"
          >
            How KARIMO Works
          </motion.h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border-secondary" />

          {/* Steps */}
          <div className="space-y-6">
            {processSteps.map((step, index) => {
              const isExpanded = expandedStep === step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative pl-16 md:pl-20"
                >
                  {/* Number circle */}
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    className={`
                      absolute left-0 w-12 h-12 md:w-16 md:h-16 rounded-full
                      flex items-center justify-center text-accent text-sm
                      transition-all duration-300 cursor-pointer
                      ${
                        isExpanded
                          ? "bg-bg-brand-solid text-fg-primary scale-110"
                          : "bg-bg-tertiary text-fg-tertiary hover:bg-border-primary"
                      }
                    `}
                  >
                    {step.number}
                  </button>

                  {/* Content card */}
                  <div
                    className={`
                      rounded-xl border transition-all duration-300 overflow-hidden
                      ${
                        isExpanded
                          ? "bg-bg-tertiary border-border-brand/30"
                          : "bg-bg-secondary border-border-secondary hover:border-border-primary"
                      }
                    `}
                  >
                    {/* Header */}
                    <button
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4"
                    >
                      <div>
                        <h3 className="text-heading text-xl text-fg-primary">
                          {step.title}
                        </h3>
                        <code className="text-sm font-mono text-fg-brand">
                          {step.command}
                        </code>
                      </div>
                      <svg
                        className={`w-5 h-5 text-fg-tertiary transition-transform ${
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
                    </button>

                    {/* Expanded content */}
                    <div
                      className={`
                        grid transition-all duration-300
                        ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                      `}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 pb-5 border-t border-border-secondary pt-4">
                          <p className="text-body text-fg-secondary mb-4">
                            {step.description}
                          </p>
                          <ul className="space-y-2">
                            {step.details.map((detail, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-sm"
                              >
                                <span className="text-fg-brand mt-0.5">
                                  →
                                </span>
                                <span className="text-body text-fg-primary">
                                  {detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Loop indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 p-6 rounded-xl bg-bg-secondary border border-border-secondary"
        >
          <h4 className="text-heading text-lg text-fg-primary mb-4 flex items-center gap-2">
            <span className="text-fg-brand">↻</span>
            Strategic Looping
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            <LoopCard
              loop="Loop 1"
              title="Interview Refinement"
              description="PRD interviews refine until requirements are clear"
            />
            <LoopCard
              loop="Loop 2"
              title="Task Revision"
              description="Failed tasks get revised with model escalation"
            />
            <LoopCard
              loop="Loop 3"
              title="Review Revision"
              description="Code review triggers revision up to 3 times"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LoopCard({
  loop,
  title,
  description,
}: {
  loop: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-4 rounded-lg bg-bg-tertiary">
      <span className="text-accent text-xs text-fg-brand">{loop}</span>
      <h5 className="text-heading font-medium text-fg-primary mt-1">{title}</h5>
      <p className="text-body text-sm text-fg-secondary mt-1">{description}</p>
    </div>
  );
}
