"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pipelinePhases } from "@/lib/constants";
import { smoothTransition } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

// ─── Types ─────────────────────────────────────────────────
type PipelinePhase = (typeof pipelinePhases)[number];

// ─── Step Chip ─────────────────────────────────────────────
function StepChip({
  label,
  dimmed,
  compact,
}: {
  label: string;
  dimmed: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className="text-heading whitespace-nowrap"
      style={{
        padding: compact ? "6px 10px" : "8px 16px",
        border: `1px solid ${dimmed ? "var(--border-tertiary)" : "var(--fg-primary)"}`,
        borderRadius: "4px",
        fontSize: compact ? "11px" : "13px",
        letterSpacing: "0.12em",
        color: dimmed ? "var(--fg-tertiary)" : "var(--fg-primary)",
        transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {label}
    </div>
  );
}

// ─── Small Arrow Between Chips ─────────────────────────────
function SmallArrow({ dimmed }: { dimmed: boolean }) {
  return (
    <svg
      width="18"
      height="8"
      viewBox="0 0 18 8"
      style={{
        opacity: dimmed ? 0.15 : 0.4,
        transition: "opacity 0.25s ease",
        flexShrink: 0,
      }}
    >
      <line x1="0" y1="4" x2="12" y2="4" stroke="var(--fg-primary)" strokeWidth="1" />
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
function PhaseArrow({ dimmed }: { dimmed: boolean }) {
  return (
    <svg
      width="24"
      height="8"
      viewBox="0 0 24 8"
      className="hidden md:block"
      style={{
        opacity: dimmed ? 0.1 : 0.3,
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

// ─── Angular Loop SVG (always visible, static) ─────────────
function AngularLoop({
  width,
  dimmed,
}: {
  width: number;
  dimmed: boolean;
}) {
  const h = 24;
  const inset = 16;
  const w = width;
  const pathD = `M ${w - inset} 0 L ${w - inset} ${h} L ${inset} ${h} L ${inset} 0`;

  return (
    <svg
      width={w}
      height={h + 6}
      viewBox={`0 -3 ${w} ${h + 9}`}
      className="hidden md:block"
      style={{
        opacity: dimmed ? 0.15 : 0.35,
        transition: "opacity 0.35s ease",
        overflow: "visible",
      }}
    >
      <path
        d={pathD}
        fill="none"
        stroke="var(--fg-tertiary)"
        strokeWidth="1.5"
      />
      <polyline
        points={`${inset - 3.5},5 ${inset},-1 ${inset + 3.5},5`}
        fill="none"
        stroke="var(--fg-tertiary)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ─── Phase Card (Desktop) ────────────────────────────────
function PhaseCard({
  phase,
  focused,
  otherFocused,
  onFocus,
}: {
  phase: PipelinePhase;
  focused: boolean;
  otherFocused: boolean;
  onFocus: (id: string) => void;
}) {
  const chipCount = phase.steps.length;
  const arrowCount = chipCount - 1;
  const estW = chipCount * 88 + arrowCount * 24;

  return (
    <div
      data-interactive
      onClick={() => !focused && onFocus(phase.id)}
      className={`
        relative flex flex-col items-center gap-1 cursor-pointer
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
            focused
              ? "border border-border-primary bg-bg-secondary/50"
              : "border border-border-secondary hover:border-border-primary hover:bg-bg-secondary/30"
          }
        `}
      >
        {/* Label */}
        <div className="flex flex-col items-center mb-3">
          <span className="text-body text-sm tracking-normal text-fg-tertiary">
            {phase.sublabel}
          </span>
          <span className="text-heading text-xl tracking-wide text-fg-primary">
            {phase.label}
          </span>
        </div>

        {/* Steps row */}
        <div className="flex items-center gap-1.5 justify-center">
          {phase.steps.map((step, i) => (
            <div key={step} className="flex items-center gap-1.5">
              <StepChip label={step} dimmed={otherFocused} />
              {i < chipCount - 1 && <SmallArrow dimmed={otherFocused} />}
            </div>
          ))}
        </div>

        {/* Angular loop */}
        <div className="flex justify-center mt-0.5">
          <AngularLoop width={estW} dimmed={otherFocused} />
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
      className="w-full flex items-center justify-between px-5 py-3.5 rounded-lg border border-border-secondary bg-bg-tertiary hover:border-border-primary transition-colors cursor-pointer"
    >
      <span className="text-heading text-sm text-fg-primary">
        {phase.label}
      </span>
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
function MobileExpandedCard({ phase }: { phase: PipelinePhase }) {
  const chipCount = phase.steps.length;

  return (
    <div className="rounded-lg border border-border-primary bg-bg-secondary/50 px-5 py-6">
      <div className="flex flex-col items-center mb-4">
        <span className="text-body text-sm tracking-normal text-fg-secondary">
          {phase.sublabel}
        </span>
        <span className="text-heading text-xl tracking-wide text-fg-primary">
          {phase.label}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {phase.steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <StepChip label={step} dimmed={false} compact />
            {i < chipCount - 1 && <SmallArrow dimmed={false} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mobile Loop Carousel ────────────────────────────────
function MobileLoopCarousel({
  activePhase,
  onSelectPhase,
}: {
  activePhase: string;
  onSelectPhase: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {pipelinePhases.map((phase) => {
        const isActive = phase.id === activePhase;
        if (isActive) {
          return <MobileExpandedCard key={phase.id} phase={phase} />;
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

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-3 pb-3 border-t border-border-secondary pt-2.5">
          <p className="text-body text-sm text-fg-secondary leading-relaxed">
            {command.description}
          </p>
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
    <div className="rounded-lg border border-border-secondary bg-bg-primary overflow-hidden h-full flex flex-col">
      {/* Terminal chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border-secondary shrink-0">
        <div className="w-2 h-2 rounded-full bg-fg-tertiary/30" />
        <div className="w-2 h-2 rounded-full bg-fg-tertiary/30" />
        <div className="w-2 h-2 rounded-full bg-fg-tertiary/30" />
        <span className="ml-2 text-xs text-fg-tertiary font-family-mono truncate">
          {commandLabel}
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-3 flex-1 overflow-hidden">
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
                className={`font-family-mono text-xs break-words whitespace-pre-wrap ${
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
          {/* 3-column grid — fixed height to prevent jumping between loops */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:h-[420px] md:items-stretch">
            {/* LEFT: Explanation + Input/Output */}
            <div className="order-1 flex flex-col gap-3 md:overflow-y-auto">
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
              </div>

              {/* Input / Output — fixed-width labels */}
              <div className="rounded-lg bg-bg-tertiary border border-border-secondary p-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span
                      className="text-xs text-fg-brand uppercase tracking-widest shrink-0 mt-0.5 w-14"
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
                      className="text-xs text-fg-brand uppercase tracking-widest shrink-0 mt-0.5 w-14"
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

            {/* CENTER: Terminal — fills full fixed height */}
            <div className="order-2 min-w-0 md:h-full">
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

            {/* RIGHT: Command dropdowns — scrolls if needed */}
            <div className="order-3 space-y-2 md:overflow-y-auto">
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

// ─── Playback Controls ───────────────────────────────────
function PlaybackControls({
  isPlaying,
  onTogglePlay,
  onRestart,
}: {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {/* Play/Pause */}
      <button
        data-interactive
        onClick={onTogglePlay}
        className="text-fg-tertiary hover:text-fg-primary transition-colors cursor-pointer p-1"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="2" y="1" width="3.5" height="12" rx="0.5" />
            <rect x="8.5" y="1" width="3.5" height="12" rx="0.5" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M3 1.5v11l9-5.5L3 1.5z" />
          </svg>
        )}
      </button>
      {/* Restart */}
      <button
        data-interactive
        onClick={onRestart}
        className="text-fg-tertiary hover:text-fg-primary transition-colors cursor-pointer p-1"
        aria-label="Restart"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1.5 2v4h4" />
          <path d="M2.5 6A5 5 0 1 1 2 8.5" />
        </svg>
      </button>
    </div>
  );
}

// ─── Main Section ──────────────────────────────────────────
export function UnifiedPipelineSection() {
  const [focusedPhase, setFocusedPhase] = useState<string>("loop1");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-play cycles through loops every 6s
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setFocusedPhase((prev) => {
        const idx = pipelinePhases.findIndex((p) => p.id === prev);
        return pipelinePhases[(idx + 1) % pipelinePhases.length].id;
      });
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying]);

  const handleFocus = (id: string) => {
    setIsAutoPlaying(false);
    setFocusedPhase(id);
  };

  const handleTogglePlay = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    setFocusedPhase("loop1");
    setIsAutoPlaying(true);
  };

  return (
    <section
      id="pipeline"
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
        {/* Header with playback controls */}
        <div className="mb-14">
          <SectionLabel>OVERVIEW</SectionLabel>
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-primary">
              Code Sequence
            </h2>
            <PlaybackControls
              isPlaying={isAutoPlaying}
              onTogglePlay={handleTogglePlay}
              onRestart={handleRestart}
            />
          </div>
        </div>

        {/* Desktop: horizontal pipeline */}
        <div className="hidden md:flex md:items-start md:justify-center md:gap-6 max-w-5xl mx-auto">
          {pipelinePhases.map((phase, i) => (
            <div key={phase.id} className="flex items-start gap-6">
              <PhaseCard
                phase={phase}
                focused={focusedPhase === phase.id}
                otherFocused={focusedPhase !== phase.id}
                onFocus={handleFocus}
              />
              {i < pipelinePhases.length - 1 && (
                <PhaseArrow
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
          />
        </div>

        {/* Hint text */}
        <div className="text-center mt-8">
          <span className="text-body text-sm text-fg-tertiary">
            Click a loop to explore its commands
          </span>
        </div>

        {/* Detail panel */}
        <PhaseDetailPanel phaseId={focusedPhase} />
      </div>
    </section>
  );
}

export default UnifiedPipelineSection;
