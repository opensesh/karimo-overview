"use client";

import { motion } from "framer-motion";
import { GitBranch02, Lock01, RefreshCcw01, Shield01 } from "@untitledui/icons";
import type { ComponentType, SVGProps } from "react";

interface ClaudeFeature {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  href: string;
}

const claudeFeatures: ClaudeFeature[] = [
  {
    id: "worktree",
    title: "Worktree Isolation",
    description:
      "Each task executes in its own git worktree. No conflicts, no race conditions.",
    icon: GitBranch02,
    href: "https://docs.anthropic.com/en/docs/claude-code/cli-usage#agents",
  },
  {
    id: "branch",
    title: "Branch Assertion",
    description:
      "PM Agent verifies branch state before and after each operation.",
    icon: Lock01,
    href: "https://docs.anthropic.com/en/docs/claude-code/cli-usage#agents",
  },
  {
    id: "loop",
    title: "Loop Detection",
    description:
      "Automatic detection of revision loops prevents infinite cycles.",
    icon: RefreshCcw01,
    href: "https://docs.anthropic.com/en/docs/claude-code/cli-usage#agents",
  },
  {
    id: "crash",
    title: "Crash Recovery",
    description:
      "Execution state reconstructed from git. Resume exactly where you left off.",
    icon: Shield01,
    href: "https://docs.anthropic.com/en/docs/claude-code/cli-usage#agents",
  },
];

function ClaudeLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-label="Claude"
    >
      <path d="M16.091 2.91a1.476 1.476 0 0 0-2.013.545L8.098 13.47a.124.124 0 0 0 .048.169.124.124 0 0 0 .063.017.122.122 0 0 0 .108-.063l4.09-7.003a1.476 1.476 0 0 1 2.013-.545 1.479 1.479 0 0 1 .544 2.016L9.66 17.352a3.342 3.342 0 0 1-2.032 1.567 3.352 3.352 0 0 1-2.532-.332 3.351 3.351 0 0 1-1.57-2.034 3.356 3.356 0 0 1 .331-2.537L9.9 3.458a5.282 5.282 0 0 1 7.2-1.95 5.286 5.286 0 0 1 1.95 7.207l-6.834 11.7a1.476 1.476 0 1 1-2.558-1.474l6.835-11.7a2.339 2.339 0 0 0-.863-3.193 2.334 2.334 0 0 0-3.19.864l-5.976 10.23a.127.127 0 0 0 .047.17.131.131 0 0 0 .063.017.126.126 0 0 0 .108-.063l4.092-7.01a1.476 1.476 0 0 1 2.557 1.474l-4.09 7.007a3.087 3.087 0 0 1-4.217.906 3.085 3.085 0 0 1-.905-4.22l5.976-10.23a5.288 5.288 0 0 1 7.2-1.95 5.29 5.29 0 0 1 1.95 7.206l-6.834 11.7a4.43 4.43 0 0 1-6.047 1.637 4.434 4.434 0 0 1-1.636-6.05l5.305-9.29a1.476 1.476 0 0 1 2.557 1.474l-5.305 9.291a1.487 1.487 0 0 0 .545 2.013c.71.413 1.612.172 2.017-.537l6.833-11.7a2.339 2.339 0 0 0-.863-3.193 2.334 2.334 0 0 0-3.19.864L6.132 14.358a3.085 3.085 0 0 0 4.312 4.221l.008-.005.007-.004a3.31 3.31 0 0 0 1.259-1.265l5.305-9.08a4.43 4.43 0 0 0-1.636-6.05 4.425 4.425 0 0 0-6.047 1.636L3.378 14.37a6.384 6.384 0 0 0 2.36 8.717 6.38 6.38 0 0 0 8.714-2.36l6.834-11.7A6.384 6.384 0 0 0 18.927.31a6.384 6.384 0 0 0-8.715 2.359L4.24 13.213a4.437 4.437 0 0 0 1.636 6.052 4.43 4.43 0 0 0 6.047-1.637l5.974-10.228a1.476 1.476 0 0 1 2.013-.545 1.479 1.479 0 0 1 .544 2.016l-5.976 10.23a7.384 7.384 0 0 1-10.071 2.726A7.385 7.385 0 0 1 1.68 11.76l5.973-10.559A9.341 9.341 0 0 1 20.38 2.91z" />
    </svg>
  );
}

export function ClaudeFeatures() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mt-16"
    >
      <h4 className="text-heading text-lg text-fg-primary mb-6 text-center flex items-center justify-center gap-2">
        <ClaudeLogo className="w-5 h-5 text-fg-brand" />
        Claude Features
      </h4>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {claudeFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.a
              key={feature.id}
              href={feature.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.4,
                delay: 0.4 + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group p-4 rounded-xl text-left bg-bg-tertiary border border-border-secondary
                         hover:border-border-brand transition-all duration-300
                         hover:-translate-y-0.5"
            >
              <Icon
                width={24}
                height={24}
                className="text-fg-brand"
              />
              <h5 className="text-heading font-medium mt-2 text-fg-primary">
                {feature.title}
              </h5>
              <p className="text-body text-sm mt-1 text-fg-secondary group-hover:text-fg-primary/80 transition-colors">
                {feature.description}
              </p>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
}
