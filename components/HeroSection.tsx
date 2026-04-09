"use client";

import { motion } from "framer-motion";
import { KARIMO_ASCII_ART } from "@/lib/constants";

const REPO_URL = "https://github.com/opensesh/KARIMO";

const badges = [
  { label: "License", value: "Apache 2.0" },
  { label: "version", value: "v7.21.0" },
  { label: "Claude Code", value: "Framework & Plugin" },
];

const featureLinks = [
  { text: "native worktree isolation", anchor: "#native-worktree-isolation" },
  { text: "sub-agents", anchor: "#sub-agents" },
  { text: "agent teams", anchor: "#agent-teams" },
  { text: "skills", anchor: "#skills" },
  { text: "hooks", anchor: "#hooks" },
  { text: "model routing", anchor: "#model-routing" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  return (
    <section
      id="overview"
      className="relative bg-bg-primary overflow-hidden pt-32 pb-16 px-6"
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      <div className="max-w-3xl mx-auto relative flex flex-col items-center text-center">
        {/* ASCII Art — desktop */}
        <div className="hidden sm:flex flex-col items-center relative">
          {KARIMO_ASCII_ART.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.5,
                delay: 0.3 + i * 0.08,
                ease,
              }}
              className="font-mono text-fg-brand whitespace-pre leading-tight select-none"
              style={{ fontSize: "clamp(0.35rem, 1.1vw, 0.75rem)" }}
            >
              {line}
            </motion.div>
          ))}
        </div>

        {/* ASCII Art — mobile fallback */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="sm:hidden font-display font-bold text-5xl text-fg-brand tracking-tight"
        >
          KARIMO
        </motion.h1>

        {/* Badge chips */}
        <div className="flex flex-wrap justify-center gap-3 mt-6 relative">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.9 + i * 0.08,
                ease,
              }}
              className="flex items-stretch rounded overflow-hidden border border-border-secondary text-xs font-mono"
            >
              <span className="px-2.5 py-1 bg-bg-tertiary text-fg-secondary">
                {badge.label}
              </span>
              <span className="px-2.5 py-1 bg-bg-secondary text-fg-primary">
                {badge.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2, ease }}
          className="max-w-lg mt-6 text-fg-secondary font-body leading-relaxed relative text-center"
        >
          KARIMO is a{" "}
          <strong className="text-fg-primary font-medium">
            framework and Claude Code plugin
          </strong>{" "}
          for PRD-driven autonomous development — leveraging Anthropic&apos;s
          latest innovations, including{" "}
          {featureLinks.map((link, i) => (
            <span key={link.anchor}>
              <a
                href={`${REPO_URL}${link.anchor}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-brand hover:underline"
              >
                {link.text}
              </a>
              {i < featureLinks.length - 2
                ? ", "
                : i === featureLinks.length - 2
                  ? ", and "
                  : ""}
            </span>
          ))}
          .
        </motion.p>

        {/* Philosophy blockquote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4, ease }}
          className="border-l border-border-brand pl-4 mt-5 text-fg-tertiary relative text-left"
        >
          <strong className="text-fg-secondary">Philosophy:</strong> You are the
          architect, agents are the builders
        </motion.blockquote>
      </div>
    </section>
  );
}
