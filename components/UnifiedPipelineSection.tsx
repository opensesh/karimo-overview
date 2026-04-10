"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pipelinePhases } from "@/lib/constants";
import { smoothTransition } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

// ─── Types ─────────────────────────────────────────────────
type PipelinePhase = (typeof pipelinePhases)[number];
type LoopAnimState = "idle" | "playing" | "done";

// ─── Animation Constants ──────────────────────────────────
const CHIP_GLOW_MS = 400;
const RETURN_PULSE_MS = 1400; // 2 cycles at 0.7s each

// ─── Per-Loop Animation Clock ─────────────────────────────
function useLoopAnims() {
  const [states, setStates] = useState<Record<string, LoopAnimState>>({
    loop1: "idle",
    loop2: "idle",
    loop3: "idle",
  });
  const startTimes = useRef<Record<string, number>>({});
  const [elapsed, setElapsed] = useState<Record<string, number>>({
    loop1: 0,
    loop2: 0,
    loop3: 0,
  });
  const rafRef = useRef<number | null>(null);

  const startLoop = useCallback((loopId: string) => {
    setStates((s) => ({ ...s, [loopId]: "playing" }));
    startTimes.current[loopId] = performance.now();
  }, []);

  const resetAll = useCallback(() => {
    setStates({ loop1: "idle", loop2: "idle", loop3: "idle" });
    setElapsed({ loop1: 0, loop2: 0, loop3: 0 });
    startTimes.current = {};
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = performance.now();
      let anyPlaying = false;

      setElapsed((prev) => {
        const next = { ...prev };
        for (const loopId of Object.keys(startTimes.current)) {
          const start = startTimes.current[loopId];
          if (start != null) {
            const phase = pipelinePhases.find((p) => p.id === loopId);
            if (!phase) continue;
            const chipCount = phase.steps.length;
            const totalDuration = chipCount * CHIP_GLOW_MS + RETURN_PULSE_MS + 200;
            const e = now - start;
            next[loopId] = e;

            if (e < totalDuration) {
              anyPlaying = true;
            } else {
              // Mark as done
              setStates((s) =>
                s[loopId] === "playing" ? { ...s, [loopId]: "done" } : s,
              );
              delete startTimes.current[loopId];
            }
          }
        }
        return next;
      });

      if (anyPlaying || Object.keys(startTimes.current).length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    // Start RAF if any loop is playing
    const hasPlaying = Object.values(states).some((s) => s === "playing");
    if (hasPlaying && rafRef.current == null) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [states]);

  return { states, elapsed, startLoop, resetAll };
}

// ─── Sequential Glow State ───────────────────────────────
function getSequentialState(
  elapsed: number,
  chipCount: number,
): { chip: number; arrow: number; phase: "idle" | "forward" | "return" | "done" } {
  if (elapsed <= 0) return { chip: -1, arrow: -1, phase: "idle" };

  const forwardEnd = chipCount * CHIP_GLOW_MS;

  if (elapsed < forwardEnd) {
    const chipIdx = Math.min(
      Math.floor(elapsed / CHIP_GLOW_MS),
      chipCount - 1,
    );
    // Arrow glows when the chip after it is active
    const arrowIdx = chipIdx > 0 ? chipIdx - 1 : -1;
    return { chip: chipIdx, arrow: arrowIdx, phase: "forward" };
  }

  if (elapsed < forwardEnd + RETURN_PULSE_MS + 200) {
    return { chip: -1, arrow: -1, phase: "return" };
  }

  return { chip: -1, arrow: -1, phase: "done" };
}

// ─── Step Chip ─────────────────────────────────────────────
function StepChip({
  label,
  visible,
  isActiveChip,
  dimmed,
}: {
  label: string;
  visible: boolean;
  isActiveChip: boolean;
  dimmed: boolean;
}) {
  const borderColor = dimmed
    ? "var(--border-tertiary)"
    : isActiveChip
      ? "rgba(254,81,2,0.6)"
      : "var(--fg-primary)";

  const shadow = isActiveChip
    ? "0 0 24px -2px rgba(254,81,2,0.5), 0 0 10px -2px rgba(254,81,2,0.3), inset 0 0 8px -3px rgba(254,81,2,0.1)"
    : "none";

  return (
    <div
      className="text-heading whitespace-nowrap"
      style={{
        padding: "8px 16px",
        border: `1px solid ${borderColor}`,
        borderRadius: "4px",
        fontSize: "13px",
        letterSpacing: "0.12em",
        color: dimmed
          ? "var(--fg-tertiary)"
          : isActiveChip
            ? "var(--fg-primary)"
            : "var(--fg-primary)",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.88)",
        transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: shadow,
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
  glowing,
}: {
  visible: boolean;
  dimmed: boolean;
  glowing?: boolean;
}) {
  const color = glowing ? "#FE5102" : "var(--fg-primary)";
  return (
    <svg
      width="18"
      height="8"
      viewBox="0 0 18 8"
      style={{
        opacity: visible ? (dimmed ? 0.15 : glowing ? 0.7 : 0.4) : 0,
        transition: "opacity 0.25s ease",
        flexShrink: 0,
        filter: glowing
          ? "drop-shadow(0 0 3px rgba(254,81,2,0.4))"
          : "none",
      }}
    >
      <line x1="0" y1="4" x2="12" y2="4" stroke={color} strokeWidth="1" />
      <polyline
        points="10,1.5 14,4 10,6.5"
        fill="none"
        stroke={color}
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

// ─── Angular Loop SVG with glowing stroke pulse ───────────
function AngularLoop({
  visible,
  returnPulse,
  finished,
  width,
  loopId,
}: {
  visible: boolean;
  returnPulse: boolean;
  finished: boolean;
  width: number;
  loopId: string;
}) {
  const h = 24;
  const inset = 16;
  const w = width;
  const pathD = `M ${w - inset} 0 L ${w - inset} ${h} L ${inset} ${h} L ${inset} 0`;
  const baseColor = returnPulse ? "var(--fg-primary)" : "var(--fg-tertiary)";
  const op = visible ? (returnPulse ? 1 : finished ? 0.22 : 0.5) : 0;

  const rightDown = h;
  const across = w - 2 * inset;
  const leftUp = h;
  const totalLen = rightDown + across + leftUp;

  const gradId = `loop-pulse-${loopId}`;

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
      {returnPulse && (
        <defs>
          <linearGradient id={gradId} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="35%" stopColor="#FE5102" stopOpacity="0" />
            <stop offset="45%" stopColor="#FE5102" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFFAEE" stopOpacity="1" />
            <stop offset="55%" stopColor="#FE5102" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#FE5102" stopOpacity="0" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}

      {/* Base path */}
      <path
        d={pathD}
        fill="none"
        stroke={baseColor}
        strokeWidth="1.5"
        style={{
          filter: returnPulse
            ? "drop-shadow(0 0 3px rgba(255,250,238,0.15))"
            : "none",
        }}
      />

      {/* Glowing pulse — 2 cycles then stops */}
      {returnPulse && (
        <path
          d={pathD}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="4"
          strokeDasharray={`${totalLen * 0.25} ${totalLen * 0.75}`}
          style={{
            filter:
              "drop-shadow(0 0 6px rgba(254,81,2,0.7)) drop-shadow(0 0 12px rgba(254,81,2,0.3))",
          }}
        >
          <animate
            attributeName="stroke-dashoffset"
            values={`${totalLen};${-totalLen}`}
            dur="0.7s"
            repeatCount="2"
            fill="freeze"
          />
        </path>
      )}

      {/* Arrow head at top-left */}
      <polyline
        points={`${inset - 3.5},5 ${inset},-1 ${inset + 3.5},5`}
        fill="none"
        stroke={baseColor}
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ─── Phase Card (Desktop) ────────────────────────────────
function PhaseCard({
  phase,
  animState,
  animElapsed,
  focused,
  otherFocused,
  allDone,
  onFocus,
}: {
  phase: PipelinePhase;
  animState: LoopAnimState;
  animElapsed: number;
  focused: boolean;
  otherFocused: boolean;
  allDone: boolean;
  onFocus: (id: string) => void;
}) {
  const chipCount = phase.steps.length;
  const arrowCount = chipCount - 1;
  const estW = chipCount * 88 + arrowCount * 24;

  const isPlaying = animState === "playing";
  const isDone = animState === "done";
  const clickable = allDone || isDone;

  const glowState = isPlaying
    ? getSequentialState(animElapsed, chipCount)
    : { chip: -1, arrow: -1, phase: "done" as const };

  const showChips = isPlaying || isDone || allDone;
  const showReturnPulse = isPlaying && glowState.phase === "return";

  return (
    <div
      data-interactive
      onClick={() => clickable && !focused && onFocus(phase.id)}
      className={`
        relative flex flex-col items-center gap-1 transition-all duration-[450ms]
        ${clickable ? "cursor-pointer" : "cursor-default"}
        ${focused ? "z-10" : "z-[1]"}
      `}
      style={{
        transform: focused
          ? "scale(1.08)"
          : otherFocused
            ? "scale(0.88)"
            : "scale(1)",
        opacity: otherFocused ? 0.45 : 1,
        transition:
          "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
      }}
    >
      <div
        className={`
          rounded-lg p-4 pb-3 transition-all duration-300
          ${
            clickable
              ? focused
                ? "border border-border-primary bg-bg-secondary/50"
                : "border border-border-secondary hover:border-border-primary hover:bg-bg-secondary/30"
              : "border border-transparent"
          }
        `}
      >
        {/* Label */}
        <div
          className="flex flex-col items-center mb-3"
          style={{
            opacity: showChips ? 1 : 0,
            transform: showChips ? "translateY(0)" : "translateY(5px)",
            transition: "all 0.4s ease",
          }}
        >
          <span
            className="text-heading text-xl tracking-wide"
            style={{
              color: isPlaying ? "var(--fg-primary)" : "var(--fg-tertiary)",
              transition: "color 0.3s ease",
            }}
          >
            {phase.label}
          </span>
          <span
            className="text-body text-sm tracking-normal"
            style={{
              color: isPlaying
                ? "var(--fg-secondary)"
                : "var(--fg-tertiary)",
              transition: "color 0.3s ease",
            }}
          >
            {phase.sublabel}
          </span>
        </div>

        {/* Steps row */}
        <div className="flex items-center gap-1.5 justify-center">
          {phase.steps.map((step, i) => {
            const chipVisible =
              showChips &&
              (isPlaying ? animElapsed >= i * CHIP_GLOW_MS * 0.5 : true);
            return (
              <div key={step} className="flex items-center gap-1.5">
                <StepChip
                  label={step}
                  visible={chipVisible}
                  isActiveChip={isPlaying && glowState.chip === i}
                  dimmed={otherFocused}
                />
                {i < chipCount - 1 && (
                  <SmallArrow
                    visible={chipVisible}
                    dimmed={otherFocused}
                    glowing={isPlaying && glowState.arrow === i}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Angular loop */}
        <div className="flex justify-center mt-0.5">
          <AngularLoop
            visible={showChips}
            returnPulse={showReturnPulse}
            finished={isDone || allDone}
            width={estW}
            loopId={phase.id}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Loop Tab (collapsed) ─────────────────────────
function MobileLoopTab({
  phase,
  onClick,
}: {
  phase: PipelinePhase;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border-secondary bg-bg-tertiary hover:border-border-primary transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <span className="text-heading text-sm text-fg-primary">
          {phase.label}
        </span>
        <span className="text-body text-xs text-fg-tertiary">
          {phase.sublabel}
        </span>
      </div>
      <svg
        className="w-4 h-4 text-fg-tertiary"
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
  );
}

// ─── Mobile Expanded Card ────────────────────────────────
function MobileExpandedCard({
  phase,
  animState,
  animElapsed,
}: {
  phase: PipelinePhase;
  animState: LoopAnimState;
  animElapsed: number;
}) {
  const chipCount = phase.steps.length;
  const isPlaying = animState === "playing";
  const showChips = isPlaying || animState === "done";
  const glowState = isPlaying
    ? getSequentialState(animElapsed, chipCount)
    : { chip: -1, arrow: -1, phase: "done" as const };

  return (
    <div className="rounded-lg border border-border-primary bg-bg-secondary/50 p-4">
      {/* Label */}
      <div className="flex flex-col items-center mb-3">
        <span className="text-heading text-xl tracking-wide text-fg-primary">
          {phase.label}
        </span>
        <span className="text-body text-sm tracking-normal text-fg-secondary">
          {phase.sublabel}
        </span>
      </div>

      {/* Steps row */}
      <div className="flex items-center gap-1.5 justify-center">
        {phase.steps.map((step, i) => {
          const chipVisible =
            showChips &&
            (isPlaying ? animElapsed >= i * CHIP_GLOW_MS * 0.5 : true);
          return (
            <div key={step} className="flex items-center gap-1.5">
              <StepChip
                label={step}
                visible={chipVisible}
                isActiveChip={isPlaying && glowState.chip === i}
                dimmed={false}
              />
              {i < chipCount - 1 && (
                <SmallArrow
                  visible={chipVisible}
                  dimmed={false}
                  glowing={isPlaying && glowState.arrow === i}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mobile Loop Carousel ────────────────────────────────
function MobileLoopCarousel({
  activePhase,
  onSelectPhase,
  animStates,
  animElapsed,
}: {
  activePhase: string;
  onSelectPhase: (id: string) => void;
  animStates: Record<string, LoopAnimState>;
  animElapsed: Record<string, number>;
}) {
  return (
    <div className="flex flex-col gap-2">
      {pipelinePhases.map((phase) => {
        const isActive = phase.id === activePhase;
        if (isActive) {
          return (
            <MobileExpandedCard
              key={phase.id}
              phase={phase}
              animState={animStates[phase.id] ?? "idle"}
              animElapsed={animElapsed[phase.id] ?? 0}
            />
          );
        }
        return (
          <MobileLoopTab
            key={phase.id}
            phase={phase}
            onClick={() => onSelectPhase(phase.id)}
          />
        );
      })}
    </div>
  );
}

// ─── Compact Command Dropdown ─────────────────────────────
function CompactCommandDropdown({
  command,
  isOpen,
  onToggle,
}: {
  command: (typeof pipelinePhases)[number]["commands"][number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-lg border overflow-hidden transition-colors duration-200 ${
        isOpen
          ? "border-border-primary bg-bg-tertiary"
          : "border-border-secondary bg-bg-tertiary hover:border-border-primary"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full p-3 text-left flex items-center justify-between gap-3 cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          <h4 className="text-heading text-sm text-fg-primary truncate">
            {command.title}
          </h4>
          <code className="text-xs font-family-mono text-fg-brand shrink-0">
            {command.command}
          </code>
        </div>
        <svg
          className={`w-3.5 h-3.5 text-fg-tertiary transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
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

      {/* CSS transition for mobile compat — no Framer Motion */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-3 pb-3 border-t border-border-secondary pt-2.5">
          <p className="text-body text-xs text-fg-secondary mb-2">
            {command.description}
          </p>
          <ul className="space-y-1">
            {command.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <span className="text-fg-brand mt-0.5">→</span>
                <span className="text-body text-fg-primary">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Inline Terminal ──────────────────────────────────────
function InlineTerminal({
  lines,
  commandLabel,
}: {
  lines: ReadonlyArray<{ readonly type: string; readonly text: string }>;
  commandLabel: string;
}) {
  return (
    <div className="rounded-lg border border-border-secondary bg-bg-primary overflow-hidden min-h-[220px] flex flex-col">
      {/* Terminal chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border-secondary shrink-0">
        <div className="w-2 h-2 rounded-full bg-fg-tertiary/30" />
        <div className="w-2 h-2 rounded-full bg-fg-tertiary/30" />
        <div className="w-2 h-2 rounded-full bg-fg-tertiary/30" />
        <span className="ml-2 text-xs text-fg-tertiary font-family-mono">
          {commandLabel}
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-3 overflow-x-auto flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={commandLabel}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.06, delayChildren: 0.08 },
              },
            }}
            className="space-y-0.5"
          >
            {lines.map((line, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -4 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.2 }}
                className={`font-family-mono text-xs whitespace-nowrap ${
                  line.type === "command" ? "text-fg-brand" : "text-fg-secondary"
                }`}
              >
                {line.type === "command" ? `$ ${line.text}` : line.text}
              </motion.div>
            ))}
            {/* Blinking cursor */}
            <div className="flex items-center gap-1 font-family-mono text-xs text-fg-brand">
              <span>$</span>
              <span
                className="inline-block w-1.5 h-3.5 bg-fg-primary"
                style={{ animation: "cursor-blink 1s step-end infinite" }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Phase Detail Panel ────────────────────────────────────
function PhaseDetailPanel({ phaseId }: { phaseId: string | null }) {
  const phase = pipelinePhases.find((p) => p.id === phaseId);
  const [activeCommandIdx, setActiveCommandIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setActiveCommandIdx(0);
    setIsAutoPlaying(true);
  }, [phaseId]);

  useEffect(() => {
    if (!phase || !isAutoPlaying) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setActiveCommandIdx((prev) => (prev + 1) % phase.commands.length);
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [phase, isAutoPlaying]);

  const handleCommandToggle = (idx: number) => {
    setIsAutoPlaying(false);
    setActiveCommandIdx(activeCommandIdx === idx ? -1 : idx);
  };

  const activeCommand = phase?.commands[activeCommandIdx];

  return (
    <AnimatePresence mode="wait">
      {phase && (
        <motion.div
          data-interactive
          key={phase.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={smoothTransition}
          className="w-full max-w-5xl mx-auto mt-10"
        >
          {/* Phase title */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs text-fg-brand uppercase tracking-widest"
              style={{ fontFamily: "var(--font-accent)", fontWeight: 700 }}
            >
              {phase.label}
            </span>
            <span className="text-body text-sm text-fg-tertiary">
              {phase.sublabel}
            </span>
          </div>

          {/* 3-column grid (desktop) / single column (mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(0,1fr)_1fr] gap-4">
            {/* Explanation + Input/Output */}
            <div className="order-1 space-y-3">
              <div className="rounded-lg bg-bg-tertiary border border-border-secondary p-4">
                <span
                  className="text-xs text-fg-brand uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-accent)", fontWeight: 700 }}
                >
                  {phase.explanation.title}
                </span>
                <p className="text-body text-sm text-fg-secondary mt-2 leading-relaxed">
                  {phase.explanation.description}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {phase.explanation.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-fg-brand mt-0.5">→</span>
                      <span className="text-body text-fg-primary">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Input / Output */}
              <div className="rounded-lg bg-bg-tertiary border border-border-secondary p-3">
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <span
                      className="text-xs text-fg-brand uppercase tracking-widest shrink-0 mt-0.5"
                      style={{
                        fontFamily: "var(--font-accent)",
                        fontWeight: 700,
                      }}
                    >
                      INPUT
                    </span>
                    <span className="text-body text-sm text-fg-primary leading-relaxed">
                      {phase.inputOutput.input}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span
                      className="text-xs text-fg-brand uppercase tracking-widest shrink-0 mt-0.5"
                      style={{
                        fontFamily: "var(--font-accent)",
                        fontWeight: 700,
                      }}
                    >
                      OUTPUT
                    </span>
                    <span className="text-body text-sm text-fg-primary leading-relaxed">
                      {phase.inputOutput.output}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal (center) */}
            <div className="order-2 min-w-0">
              <InlineTerminal
                lines={
                  activeCommand?.terminalLines ??
                  phase.commands[0].terminalLines
                }
                commandLabel={
                  activeCommand?.command ?? phase.commands[0].command
                }
              />
            </div>

            {/* Command dropdowns */}
            <div className="order-3 space-y-2">
              {phase.commands.map((cmd, i) => (
                <CompactCommandDropdown
                  key={cmd.id}
                  command={cmd}
                  isOpen={activeCommandIdx === i}
                  onToggle={() => handleCommandToggle(i)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Section ──────────────────────────────────────────
export function UnifiedPipelineSection() {
  const [focusedPhase, setFocusedPhase] = useState<string>("loop1");
  const sectionRef = useRef<HTMLElement>(null);
  const hasTriggered = useRef(false);
  const { states, elapsed, startLoop, resetAll } = useLoopAnims();

  // Intersection Observer — trigger Loop 1 on scroll into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          startLoop("loop1");
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startLoop]);

  // Handle phase focus — trigger animation on click if idle
  const handleFocus = useCallback(
    (id: string) => {
      setFocusedPhase(id);
      if (states[id] === "idle") {
        startLoop(id);
      }
    },
    [states, startLoop],
  );

  const replay = useCallback(() => {
    setFocusedPhase("loop1");
    resetAll();
    hasTriggered.current = false;
    // Small delay so state clears before re-triggering
    requestAnimationFrame(() => {
      hasTriggered.current = true;
      startLoop("loop1");
    });
  }, [resetAll, startLoop]);

  const allDone = Object.values(states).every(
    (s) => s === "done" || s === "idle",
  ) && states.loop1 === "done";

  return (
    <section
      id="pipeline"
      ref={sectionRef}
      className="bg-bg-secondary relative overflow-hidden pt-8 pb-20"
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <SectionLabel>PROCESS</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-primary mt-4"
          >
            Code Sequence
          </motion.h2>
        </div>

        {/* Desktop: horizontal pipeline */}
        <div className="hidden md:flex md:items-start md:justify-center md:gap-6 max-w-5xl mx-auto">
          {pipelinePhases.map((phase, i) => (
            <div
              key={phase.id}
              className="flex items-start gap-6"
            >
              <PhaseCard
                phase={phase}
                animState={states[phase.id] ?? "idle"}
                animElapsed={elapsed[phase.id] ?? 0}
                focused={focusedPhase === phase.id}
                otherFocused={focusedPhase !== phase.id}
                allDone={allDone}
                onFocus={handleFocus}
              />
              {i < pipelinePhases.length - 1 && (
                <PhaseArrow
                  visible={
                    states[pipelinePhases[i + 1].id] !== "idle" || allDone
                  }
                  dimmed={focusedPhase !== pipelinePhases[i + 1].id}
                />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <MobileLoopCarousel
            activePhase={focusedPhase}
            onSelectPhase={handleFocus}
            animStates={states}
            animElapsed={elapsed}
          />
        </div>

        {/* Hint text */}
        <div
          className="text-center mt-8 transition-opacity duration-500"
          style={{
            opacity: allDone ? 1 : 0,
            pointerEvents: allDone ? "auto" : "none",
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
            opacity: allDone ? 1 : 0,
            pointerEvents: allDone ? "auto" : "none",
          }}
        >
          <button
            data-interactive
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
