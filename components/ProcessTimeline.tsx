"use client";

import { useState } from "react";
import { processSteps } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ProcessTimeline() {
  const [expandedStep, setExpandedStep] = useState<string | null>("research");

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-[var(--color-black)]">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          number="02"
          title="The Process"
          subtitle="Six stages from idea to shipped code"
        />

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-[var(--color-black70)]" />

          {/* Steps */}
          <div className="space-y-6">
            {processSteps.map((step, index) => {
              const isExpanded = expandedStep === step.id;

              return (
                <div key={step.id} className="relative pl-16 md:pl-20">
                  {/* Number circle */}
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    className={`
                      absolute left-0 w-12 h-12 md:w-16 md:h-16 rounded-full
                      flex items-center justify-center font-mono text-lg font-bold
                      transition-all duration-300 cursor-pointer
                      ${
                        isExpanded
                          ? "bg-[var(--color-aperol)] text-[var(--color-vanilla)] scale-110"
                          : "bg-[var(--color-black80)] text-[var(--color-black50)] hover:bg-[var(--color-black70)]"
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
                          ? "bg-[var(--color-black80)] border-[var(--color-aperol)]/30"
                          : "bg-[var(--color-charcoal)] border-[var(--color-black70)] hover:border-[var(--color-black50)]"
                      }
                    `}
                  >
                    {/* Header */}
                    <button
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--color-vanilla)]">
                          {step.title}
                        </h3>
                        <code className="text-sm font-mono text-[var(--color-aperol)]">
                          {step.command}
                        </code>
                      </div>
                      <svg
                        className={`w-5 h-5 text-[var(--color-black50)] transition-transform ${
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
                        <div className="px-5 pb-5 border-t border-[var(--color-black70)] pt-4">
                          <p className="text-[var(--color-black30)] mb-4">
                            {step.description}
                          </p>
                          <ul className="space-y-2">
                            {step.details.map((detail, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-sm"
                              >
                                <span className="text-[var(--color-aperol)] mt-0.5">
                                  →
                                </span>
                                <span className="text-[var(--color-vanilla)]">
                                  {detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loop indicator */}
        <div className="mt-12 p-6 rounded-xl bg-[var(--color-black80)] border border-[var(--color-black70)]">
          <h4 className="text-lg font-semibold text-[var(--color-vanilla)] mb-4 flex items-center gap-2">
            <span className="text-[var(--color-aperol)]">↻</span>
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
        </div>
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
    <div className="p-4 rounded-lg bg-[var(--color-black70)]">
      <span className="text-xs font-mono text-[var(--color-aperol)]">{loop}</span>
      <h5 className="font-medium text-[var(--color-vanilla)] mt-1">{title}</h5>
      <p className="text-sm text-[var(--color-black30)] mt-1">{description}</p>
    </div>
  );
}
