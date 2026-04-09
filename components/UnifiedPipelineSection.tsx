"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pipelinePhases, pipelineTimeline as T } from "@/lib/constants";
import { accordionContent, smoothTransition } from "@/lib/motion";

// ─── Types ─────────────────────────────────────────────────
type PipelinePhase = (typeof pipelinePhases)[number];

// ─── Animation Clock ───────────────────────────────────────
function useAnimClock(key: number) {
  const [now, setNow] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = performance.now();
    setNow(0);
    const tick = (t: number) => {
      const elapsed = t - (startRef.current ?? 0);
      if (elapsed <= T.done + 1000) {
        setNow(elapsed);
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setNow(T.done + 1000);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [key]);

  return now;
}

// ─── Step Chip ─────────────────────────────────────────────
function StepChip({
  label,
  visible,
  glowing,
  dimmed,
}: {
  label: string;
  visible: boolean;
  glowing: boolean;
  dimmed: boolean;
}) {
  return (
    <div
      className="text-heading whitespace-nowrap"
      style={{
        padding: "8px 16px",
        border: `1px solid ${dimmed ? "var(--border-tertiary)" : "var(--fg-primary)"}`,
        borderRadius: "4px",
        fontSize: "13px",
        letterSpacing: "0.12em",
        color: dimmed ? "var(--fg-tertiary)" : "var(--fg-primary)",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.88)",
        transition: "all 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: glowing
          ? "0 0 18px -3px rgba(255,250,238,0.12), inset 0 0 10px -3px rgba(255,250,238,0.05)"
          : "none",
      }}
    >
      {label}
    </div>
  );
}

// ─── Small Arrow Between Chips ─────────────────────────────
function SmallArrow({
  visible,
  dimmed,
}: {
  visible: boolean;
  dimmed: boolean;
}) {
  return (
    <svg
      width="18"
      height="8"
      viewBox="0 0 18 8"
      style={{
        opacity: visible ? (dimmed ? 0.15 : 0.4) : 0,
        transition: "opacity 0.25s ease",
        flexShrink: 0,
      }}
    >
      <line
        x1="0"
        y1="4"
        x2="12"
        y2="4"
        stroke="var(--fg-primary)"
        strokeWidth="1"
      />
      <polyline
        points="10,1.5 14,4 10,6.5"
        fill="none"
        stroke="var(--fg-primary)"
        strokeWidth="1"
      />
    </svg>
  );
}

// ─── Dashed Arrow Between Phases ───────────────────────────
function PhaseArrow({
  visible,
  dimmed,
}: {
  visible: boolean;
  dimmed: boolean;
}) {
  return (
    <svg
      width="24"
      height="8"
      viewBox="0 0 24 8"
      className="hidden md:block"
      style={{
        opacity: visible ? (dimmed ? 0.1 : 0.3) : 0,
        transition: "opacity 0.3s ease",
        flexShrink: 0,
        alignSelf: "flex-start",
        marginTop: "34px",
      }}
    >
      <line
        x1="2"
        y1="4"
        x2="16"
        y2="4"
        stroke="var(--fg-primary)"
        strokeWidth="1"
        strokeDasharray="3 2.5"
      />
      <polyline
        points="14,1.5 18,4 14,6.5"
        fill="none"
        stroke="var(--fg-primary)"
        strokeWidth="1"
      />
    </svg>
  );
}

// ─── Angular Loop SVG ──────────────────────────────────────
function AngularLoop({
  visible,
  looping,
  finished,
  width,
}: {
  visible: boolean;
  looping: boolean;
  finished: boolean;
  width: number;
}) {
  const h = 24;
  const inset = 16;
  const w = width;
  const pathD = `M ${w - inset} 0 L ${w - inset} ${h} L ${inset} ${h} L ${inset} 0`;
  const strokeColor = looping ? "var(--fg-primary)" : "var(--fg-tertiary)";
  const op = visible ? (looping ? 1 : finished ? 0.22 : 0.5) : 0;

  return (
    <svg
      width={w}
      height={h + 6}
      viewBox={`0 -3 ${w} ${h + 9}`}
      className="hidden md:block"
      style={{
        opacity: op,
        transition: "opacity 0.35s ease",
        overflow: "visible",
      }}
    >
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        style={{
          filter: looping
            ? "drop-shadow(0 0 3px rgba(255,250,238,0.2))"
            : "none",
        }}
      />
      <polyline
        points={`${inset - 3.5},5 ${inset},-1 ${inset + 3.5},5`}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {looping && (
        <circle
          r="2"
          fill="var(--bg-brand-solid)"
          style={{
            filter: "drop-shadow(0 0 4px rgba(254,81,2,0.6))",
          }}
        >
          <animateMotion
            dur="0.55s"
            repeatCount="indefinite"
            path={pathD}
          />
        </circle>
      )}
    </svg>
  );
}

// ─── Phase Card ────────────────────────────────────────────
function PhaseCard({
  phase,
  now,
  focused,
  otherFocused,
  onFocus,
}: {
  phase: PipelinePhase;
  now: number;
  focused: boolean;
  otherFocused: boolean;
  onFocus: (id: string | null) => void;
}) {
  const isLooping = now >= phase.loopStart && now < phase.loopEnd;
  const isFinished = now >= phase.loopEnd;
  const animDone = now >= T.done;

  const chipCount = phase.steps.length;
  const arrowCount = chipCount - 1;
  const estW = chipCount * 88 + arrowCount * 24;

  return (
    <div
      onClick={() => animDone && onFocus(focused ? null : phase.id)}
      className={`
        relative flex flex-col items-center gap-1 transition-all duration-[450ms]
        ${animDone ? "cursor-pointer" : "cursor-default"}
        ${focused ? "z-10" : "z-[1]"}
      `}
      style={{
        transform: focused
          ? "scale(1.08)"
          : otherFocused
            ? "scale(0.88)"
            : "scale(1)",
        opacity: otherFocused ? 0.25 : 1,
        transition:
          "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
      }}
    >
      {/* Bordered card wrapper — visible after animation */}
      <div
        className={`
          rounded-lg p-4 pb-2 transition-all duration-300
          ${
            animDone
              ? focused
                ? "border border-border-primary bg-bg-secondary/50"
                : "border border-border-secondary hover:border-border-primary hover:bg-bg-secondary/30"
              : "border border-transparent"
          }
        `}
      >
        {/* Steps row */}
        <div className="flex items-center gap-1.5 justify-center">
          {phase.steps.map((step, i) => (
            <div key={step} className="flex items-center gap-1.5">
              <StepChip
                label={step}
                visible={now >= phase.stepTimes[i]}
                glowing={isLooping}
                dimmed={otherFocused}
              />
              {i < chipCount - 1 && (
                <SmallArrow
                  visible={now >= phase.stepTimes[i + 1]}
                  dimmed={otherFocused}
                />
              )}
            </div>
          ))}
        </div>

        {/* Angular loop */}
        <div className="flex justify-center mt-0.5">
          <AngularLoop
            visible={now >= phase.loopStart}
            looping={isLooping}
            finished={isFinished}
            width={estW}
          />
        </div>

        {/* Label */}
        <div
          className="flex flex-col items-center mt-1"
          style={{
            opacity: now >= phase.loopStart ? 1 : 0,
            transform:
              now >= phase.loopStart ? "translateY(0)" : "translateY(5px)",
            transition: "all 0.4s ease",
          }}
        >
          <span
            className="text-heading text-lg tracking-wide"
            style={{
              color: isLooping
                ? "var(--fg-primary)"
                : "var(--fg-tertiary)",
              transition: "color 0.3s ease",
            }}
          >
            {phase.label}
          </span>
          <span
            className="text-body text-base tracking-normal"
            style={{
              color: isLooping
                ? "var(--fg-secondary)"
                : "var(--fg-tertiary)",
              transition: "color 0.3s ease",
            }}
          >
            {phase.sublabel}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Command Dropdown ──────────────────────────────────────
function CommandDropdown({
  command,
  defaultOpen,
}: {
  command: (typeof pipelinePhases)[number]["commands"][number];
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-border-secondary bg-bg-tertiary overflow-hidden transition-colors duration-200 hover:border-border-primary">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <h4 className="text-heading text-base text-fg-primary">
            {command.title}
          </h4>
          <code className="text-sm font-family-mono text-fg-brand">
            {command.command}
          </code>
        </div>
        <svg
          className={`w-4 h-4 text-fg-tertiary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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

      <motion.div
        initial={defaultOpen ? "expanded" : "collapsed"}
        animate={open ? "expanded" : "collapsed"}
        variants={accordionContent}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 border-t border-border-secondary pt-3">
          <p className="text-body text-sm text-fg-secondary mb-3">
            {command.description}
          </p>
          <ul className="space-y-1.5">
            {command.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="text-fg-brand mt-0.5">→</span>
                <span className="text-body text-fg-primary">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Strategic Loop Card ───────────────────────────────────
function StrategicLoopCard({
  phase,
}: {
  phase: PipelinePhase;
}) {
  return (
    <div className="rounded-lg bg-bg-tertiary border border-border-secondary p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-fg-brand text-lg">↻</span>
        <span className="text-accent text-xs text-fg-brand">
          Strategic Loop
        </span>
      </div>
      <h5 className="text-heading text-base text-fg-primary">
        {phase.strategicLoop.title}
      </h5>
      <p className="text-body text-sm text-fg-secondary mt-1.5 leading-relaxed">
        {phase.strategicLoop.description}
      </p>
    </div>
  );
}

// ─── Terminal Preview ──────────────────────────────────────
function TerminalPreview({ phase }: { phase: PipelinePhase }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-fg-tertiary hover:text-fg-secondary transition-colors duration-200 cursor-pointer"
      >
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="text-body">
          {open ? "Hide" : "View"} terminal preview
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-lg border border-border-secondary bg-bg-primary overflow-hidden">
              {/* Terminal chrome */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border-secondary">
                <div className="w-2.5 h-2.5 rounded-full bg-fg-tertiary/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-fg-tertiary/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-fg-tertiary/30" />
                <span className="ml-2 text-xs text-fg-tertiary font-family-mono">
                  terminal
                </span>
              </div>

              {/* Terminal body */}
              <div className="p-4 overflow-x-auto">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
                    },
                  }}
                  className="space-y-1"
                >
                  {phase.terminalLines.map((line, i) => (
                    <motion.div
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 4 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className={`font-family-mono text-sm whitespace-nowrap ${
                        line.type === "command"
                          ? "text-fg-brand"
                          : line.type === "blank"
                            ? ""
                            : "text-fg-secondary"
                      }`}
                    >
                      {line.type === "command" ? `$ ${line.text}` : line.text}
                      {line.type === "blank" && <br />}
                    </motion.div>
                  ))}
                  {/* Blinking cursor */}
                  <div className="flex items-center gap-1 font-family-mono text-sm text-fg-brand">
                    <span>$</span>
                    <span
                      className="inline-block w-2 h-4 bg-fg-primary"
                      style={{ animation: "cursor-blink 1s step-end infinite" }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Phase Detail Panel ────────────────────────────────────
function PhaseDetailPanel({ phaseId }: { phaseId: string | null }) {
  const phase = pipelinePhases.find((p) => p.id === phaseId);

  return (
    <AnimatePresence mode="wait">
      {phase && (
        <motion.div
          key={phase.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={smoothTransition}
          className="w-full max-w-3xl mx-auto mt-10 space-y-4"
        >
          {/* Phase title */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-accent text-xs text-fg-brand">
              {phase.label}
            </span>
            <span className="text-body text-sm text-fg-tertiary">
              {phase.sublabel}
            </span>
          </div>

          {/* Command dropdowns */}
          <div className="space-y-3">
            {phase.commands.map((cmd, i) => (
              <CommandDropdown
                key={cmd.id}
                command={cmd}
                defaultOpen={i === 0}
              />
            ))}
          </div>

          {/* Strategic loop + Terminal in a responsive grid */}
          <div className="grid md:grid-cols-2 gap-3">
            <StrategicLoopCard phase={phase} />
            <div className="flex flex-col justify-end">
              <TerminalPreview phase={phase} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Section ──────────────────────────────────────────
export function UnifiedPipelineSection() {
  const [runKey, setRunKey] = useState(0);
  const [focusedPhase, setFocusedPhase] = useState<string | null>(null);
  const now = useAnimClock(runKey);

  const replay = useCallback(() => {
    setFocusedPhase(null);
    setRunKey((k) => k + 1);
  }, []);

  const animDone = now >= T.done;

  return (
    <section id="pipeline" className="section-padding container-wide bg-bg-primary relative overflow-hidden">
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Pipeline timeline */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-3">
          {pipelinePhases.map((phase, i) => (
            <div
              key={phase.id}
              className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-3"
            >
              <PhaseCard
                phase={phase}
                now={now}
                focused={focusedPhase === phase.id}
                otherFocused={
                  focusedPhase !== null && focusedPhase !== phase.id
                }
                onFocus={setFocusedPhase}
              />
              {i < pipelinePhases.length - 1 && (
                <>
                  {/* Desktop: horizontal arrow */}
                  <PhaseArrow
                    visible={now >= pipelinePhases[i + 1].stepTimes[0]}
                    dimmed={
                      focusedPhase !== null &&
                      focusedPhase !== pipelinePhases[i + 1].id
                    }
                  />
                  {/* Mobile: vertical dashed connector */}
                  <div
                    className="md:hidden w-px h-6 border-l border-dashed border-border-secondary"
                    style={{
                      opacity:
                        now >= pipelinePhases[i + 1].stepTimes[0] ? 0.4 : 0,
                      transition: "opacity 0.3s ease",
                    }}
                  />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Hint text */}
        <div
          className="text-center mt-8 transition-opacity duration-500"
          style={{
            opacity: animDone && !focusedPhase ? 1 : 0,
            pointerEvents: animDone && !focusedPhase ? "auto" : "none",
          }}
        >
          <span className="text-body text-sm text-fg-tertiary">
            Click a loop to explore its commands
          </span>
        </div>

        {/* Detail panel */}
        <PhaseDetailPanel phaseId={focusedPhase} />

        {/* Replay button */}
        <div
          className="flex justify-center mt-8 transition-opacity duration-500"
          style={{
            opacity: animDone ? 1 : 0,
            pointerEvents: animDone ? "auto" : "none",
          }}
        >
          <button
            onClick={replay}
            className="text-heading text-xs tracking-widest uppercase text-fg-tertiary border border-border-secondary rounded px-4 py-1.5 hover:border-border-primary hover:text-fg-primary transition-all duration-200 cursor-pointer"
          >
            Replay
          </button>
        </div>
      </div>
    </section>
  );
}

export default UnifiedPipelineSection;
