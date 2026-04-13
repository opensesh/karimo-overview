"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pipelinePhases } from "@/lib/constants";
import { smoothTransition } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useParallax } from "@/components/ui/ParallaxSection";

// ─── Types ─────────────────────────────────────────────────
type PipelinePhase = (typeof pipelinePhases)[number];

// ─── Animation Step Map ────────────────────────────────────
const STEP_MAP = [
  { phase: "loop1", chip: -1, loop: false, bookend: "configure" as const, cmdIdx: undefined },
  { phase: "loop1", chip: 0,  loop: false, bookend: null, cmdIdx: 0 },
  { phase: "loop1", chip: 1,  loop: false, bookend: null, cmdIdx: 1 },
  { phase: "loop1", chip: -1, loop: true,  bookend: null, cmdIdx: 2 },
  { phase: "loop2", chip: 0,  loop: false, bookend: null, cmdIdx: 0 },
  { phase: "loop2", chip: 1,  loop: false, bookend: null, cmdIdx: 1 },
  { phase: "loop2", chip: -1, loop: true,  bookend: null, cmdIdx: undefined },
  { phase: "loop3", chip: 0,  loop: false, bookend: null, cmdIdx: 0 },
  { phase: "loop3", chip: 1,  loop: false, bookend: null, cmdIdx: 1 },
  { phase: "loop3", chip: -1, loop: true,  bookend: null, cmdIdx: 2 },
  { phase: "loop3", chip: -1, loop: false, bookend: "merge" as const, cmdIdx: undefined },
] as const;

const STEP_DURATION = 1200;

// ─── Bookend Label (Configure / Merge) ────────────────────
function BookendLabel({
  label,
  description,
  side = "left",
  active = false,
}: {
  label: string;
  description: string;
  side?: "left" | "right";
  active?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open, close]);

  const tooltipPosition = side === "left" ? "left-0" : "right-0";

  return (
    <div ref={ref} className="relative flex items-center gap-1 shrink-0">
      <span
        className="text-accent text-[10px] tracking-[0.16em] transition-colors duration-200"
        style={{
          color: active ? "var(--bg-brand-solid)" : "var(--fg-tertiary)",
          animation: active ? "chip-pulse 1.2s ease-in-out" : "none",
        }}
      >
        {label}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="w-3.5 h-3.5 rounded-full border border-border-secondary flex items-center justify-center text-fg-tertiary hover:text-fg-secondary hover:border-border-primary transition-colors cursor-pointer"
        aria-label={`About ${label}`}
      >
        <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
          <path
            d="M3.5 1.5V1.5M3.5 3V5.5"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full mt-2 ${tooltipPosition} w-52 rounded-lg border border-border-secondary bg-bg-secondary px-3 py-2.5 shadow-lg z-50`}
          >
            <p className="text-body text-xs text-fg-secondary leading-relaxed">
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Step Chip ─────────────────────────────────────────────
function StepChip({
  label,
  dimmed,
  compact,
  active,
}: {
  label: string;
  dimmed: boolean;
  compact?: boolean;
  active?: boolean;
}) {
  const isActive = active && !dimmed;

  return (
    <div
      className="text-heading whitespace-nowrap"
      style={{
        padding: compact ? "6px 10px" : "8px 16px",
        border: `1px solid ${
          isActive
            ? "var(--bg-brand-solid)"
            : dimmed
              ? "var(--border-tertiary)"
              : "var(--fg-primary)"
        }`,
        borderRadius: "4px",
        fontSize: compact ? "11px" : "13px",
        letterSpacing: "0.12em",
        color: isActive
          ? "var(--bg-brand-solid)"
          : dimmed
            ? "var(--fg-tertiary)"
            : "var(--fg-primary)",
        transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
        animation: isActive ? "chip-pulse 1.2s ease-in-out" : "none",
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
        marginTop: "72px",
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
  width,
  dimmed,
  className,
  animating,
}: {
  width: number;
  dimmed: boolean;
  className?: string;
  animating?: boolean;
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
      className={className}
      style={{
        opacity: dimmed ? 0.15 : 0.35,
        transition: "opacity 0.35s ease",
        overflow: "visible",
      }}
    >
      {/* Base gray path */}
      <path
        d={pathD}
        fill="none"
        stroke="var(--fg-tertiary)"
        strokeWidth="1.5"
      />

      {/* Orange animated overlay */}
      {animating && (
        <motion.path
          d={pathD}
          fill="none"
          stroke="var(--bg-brand-solid)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity: 1 }}
        />
      )}

      {/* Base arrowhead */}
      <polyline
        points={`${inset - 3.5},5 ${inset},-1 ${inset + 3.5},5`}
        fill="none"
        stroke="var(--fg-tertiary)"
        strokeWidth="1.5"
      />

      {/* Orange arrowhead — appears at end of trace */}
      {animating && (
        <motion.polyline
          points={`${inset - 3.5},5 ${inset},-1 ${inset + 3.5},5`}
          fill="none"
          stroke="var(--bg-brand-solid)"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.15 }}
          style={{ opacity: 0 }}
        />
      )}
    </svg>
  );
}

// ─── Phase Card (Desktop) ────────────────────────────────
function PhaseCard({
  phase,
  focused,
  otherFocused,
  onFocus,
  activeChipIndex = -1,
  loopAnimating = false,
}: {
  phase: PipelinePhase;
  focused: boolean;
  otherFocused: boolean;
  onFocus: (id: string) => void;
  activeChipIndex?: number;
  loopAnimating?: boolean;
}) {
  const chipCount = phase.steps.length;
  const estW = chipCount * 88 + (chipCount - 1) * 24;
  const loopNum = phase.id.replace("loop", "");

  return (
    <div
      data-interactive
      onClick={() => !focused && onFocus(phase.id)}
      className={`
        relative flex flex-col items-center gap-1 cursor-pointer w-full
        ${focused ? "z-10" : "z-[1]"}
      `}
      style={{
        transform: focused
          ? "scale(1.08)"
          : otherFocused
            ? "scale(0.88)"
            : "scale(1)",
        opacity: otherFocused ? 0.55 : 1,
        transition:
          "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
      }}
    >
      <div
        className={`
          w-full rounded-lg p-4 pb-3 transition-all duration-300
          ${
            focused
              ? "bg-bg-secondary/50"
              : "border border-border-secondary hover:border-border-primary hover:bg-bg-secondary/30"
          }
        `}
        style={focused ? { border: "1px solid var(--bg-brand-solid)" } : undefined}
      >
        {/* Tag + Title */}
        <div className="flex flex-col items-center mb-3">
          <span
            className="text-accent text-[10px] tracking-[0.2em] mb-1 transition-colors duration-200"
            style={{
              color: focused
                ? 'var(--bg-brand-solid)'
                : 'var(--fg-tertiary)',
            }}
          >
            LOOP {loopNum}
          </span>
          <span className="text-heading text-xl tracking-wide text-fg-primary">
            {phase.label}
          </span>
        </div>

        {/* Steps row */}
        <div className="flex items-center gap-1.5 justify-center">
          {phase.steps.map((step, i) => (
            <div key={step} className="flex items-center gap-1.5">
              <StepChip
                label={step}
                dimmed={otherFocused}
                active={activeChipIndex === i}
              />
              {i < chipCount - 1 && <SmallArrow dimmed={otherFocused} />}
            </div>
          ))}
        </div>

        {/* Angular loop */}
        <div className="flex justify-center mt-0.5">
          <AngularLoop
            width={estW}
            dimmed={otherFocused}
            className="hidden md:block"
            animating={loopAnimating}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Loop Item (animated accordion) ──────────────
function MobileLoopItem({
  phase,
  isActive,
  onSelect,
  activeChipIndex = -1,
  loopAnimating = false,
}: {
  phase: PipelinePhase;
  isActive: boolean;
  onSelect: () => void;
  activeChipIndex?: number;
  loopAnimating?: boolean;
}) {
  const chipCount = phase.steps.length;

  return (
    <motion.div
      layout
      className={`
        rounded-lg overflow-hidden cursor-pointer
        ${isActive
          ? "bg-bg-secondary/50"
          : "border border-border-secondary bg-bg-tertiary hover:border-border-primary"
        }
      `}
      style={isActive ? { border: "1px solid var(--bg-brand-solid)" } : undefined}
      transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      onClick={() => !isActive && onSelect()}
    >
      {/* Header — always visible */}
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-accent text-[10px] tracking-[0.16em]"
            animate={{ color: isActive ? "var(--bg-brand-solid)" : "var(--fg-tertiary)" }}
            transition={{ duration: 0.25 }}
          >
            LOOP {phase.id.replace("loop", "")}
          </motion.span>
          <span className="text-heading text-sm text-fg-primary">
            {phase.label}
          </span>
        </div>
        <motion.svg
          className="w-4 h-4 text-fg-tertiary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </div>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-1.5 flex-nowrap">
                  {phase.steps.flatMap((step, i) => {
                    const els = [
                      <StepChip
                        key={step}
                        label={step}
                        dimmed={false}
                        compact
                        active={activeChipIndex === i}
                      />,
                    ];
                    if (i < chipCount - 1) {
                      els.push(<SmallArrow key={`arrow-${i}`} dimmed={false} />);
                    }
                    return els;
                  })}
                </div>
                <div className="mt-0.5">
                  <AngularLoop
                    width={chipCount * 72 + (chipCount - 1) * 24}
                    dimmed={false}
                    animating={loopAnimating}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Mobile Loop Carousel ────────────────────────────────
function MobileLoopCarousel({
  activePhase,
  onSelectPhase,
  configureActive,
  mergeActive,
  activeChipIndex,
  loopAnimating,
  animatingPhase,
}: {
  activePhase: string;
  onSelectPhase: (id: string) => void;
  configureActive?: boolean;
  mergeActive?: boolean;
  activeChipIndex?: number;
  loopAnimating?: boolean;
  animatingPhase?: string | null;
}) {
  return (
    <motion.div layout className="flex flex-col gap-2">
      {/* Configure bookend */}
      <BookendLabel
        label="CONFIGURE"
        side="left"
        active={configureActive}
        description="Auto-detects your stack, sets build/test/lint commands, and generates .karimo/config.yaml before the first loop begins."
      />

      {pipelinePhases.map((phase) => (
        <MobileLoopItem
          key={phase.id}
          phase={phase}
          isActive={phase.id === activePhase}
          onSelect={() => onSelectPhase(phase.id)}
          activeChipIndex={animatingPhase === phase.id ? activeChipIndex : -1}
          loopAnimating={animatingPhase === phase.id && loopAnimating}
        />
      ))}

      {/* Merge bookend */}
      <BookendLabel
        label="MERGE"
        side="left"
        active={mergeActive}
        description="Validates the feature branch, runs your full test suite, and creates a single consolidated PR to main with a complete audit trail."
      />
    </motion.div>
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
function PhaseDetailPanel({
  phaseId,
  syncedCommandIndex,
}: {
  phaseId: string | null;
  syncedCommandIndex?: number;
}) {
  const phase = pipelinePhases.find((p) => p.id === phaseId);
  const [activeCommandIdx, setActiveCommandIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [lockedHeight, setLockedHeight] = useState<number | undefined>(undefined);

  // Measure grid after each phase renders and lock to the tallest observed
  useEffect(() => {
    if (!gridRef.current) return;
    const frame = requestAnimationFrame(() => {
      if (!gridRef.current) return;
      const h = gridRef.current.scrollHeight;
      setLockedHeight((prev) => (prev === undefined ? h : Math.max(prev, h)));
    });
    return () => cancelAnimationFrame(frame);
  }, [phaseId, activeCommandIdx]);

  useEffect(() => {
    setActiveCommandIdx(0);
    setIsAutoPlaying(true);
  }, [phaseId]);

  // Sync from parent animation when playing
  useEffect(() => {
    if (syncedCommandIndex !== undefined) {
      setActiveCommandIdx(syncedCommandIndex);
      setIsAutoPlaying(false);
    }
  }, [syncedCommandIndex]);

  useEffect(() => {
    if (!phase || !isAutoPlaying || syncedCommandIndex !== undefined) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setActiveCommandIdx((prev) => (prev + 1) % phase.commands.length);
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [phase, isAutoPlaying, syncedCommandIndex]);

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
          {/* 3-column grid — height locks to tallest observed loop */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-stretch"
            style={lockedHeight ? { minHeight: `${lockedHeight}px` } : undefined}
          >
            {/* LEFT: Explanation + Input/Output */}
            <div className="order-1 flex flex-col gap-3">
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

            {/* RIGHT: Command dropdowns */}
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
export function OverviewSection() {
  const { ref: sectionRef, y } = useParallax(30);

  // Animation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState(-1);
  const [manualPhase, setManualPhase] = useState("loop1");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derive everything from animationStep
  const currentStep = animationStep >= 0 ? STEP_MAP[animationStep] : null;
  const focusedPhase = currentStep?.phase ?? manualPhase;
  const activeChipIndex = currentStep?.chip ?? -1;
  const loopAnimating = currentStep?.loop ?? false;
  const configureActive = currentStep?.bookend === "configure";
  const mergeActive = currentStep?.bookend === "merge";
  const syncedCommandIdx = isPlaying && currentStep?.cmdIdx !== undefined
    ? currentStep.cmdIdx
    : undefined;

  // Animation timer — recursive setTimeout
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => {
      setAnimationStep((prev) => (prev + 1) % STEP_MAP.length);
    }, STEP_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, animationStep]);

  const handleFocus = (id: string) => {
    setIsPlaying(false);
    setAnimationStep(-1);
    setManualPhase(id);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => {
      if (!prev) {
        // Starting playback
        if (animationStep < 0) setAnimationStep(0);
        return true;
      }
      return false;
    });
  };

  const handleRestart = () => {
    setAnimationStep(0);
    setManualPhase("loop1");
    setIsPlaying(true);
  };

  return (
    <section
      ref={sectionRef}
      id="pipeline"
      className="bg-bg-secondary relative overflow-hidden pt-16 md:pt-20 lg:pt-24 pb-16 md:pb-20 lg:pb-24 min-h-screen flex flex-col justify-center"
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      <motion.div style={{ y }} className="relative">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header with playback controls */}
        <div className="mb-6">
          <SectionLabel>OVERVIEW</SectionLabel>
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-primary">
              Code Sequence
            </h2>
            <PlaybackControls
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onRestart={handleRestart}
            />
          </div>
        </div>

        {/* Hint text */}
        <div className="text-center mb-8">
          <span className="text-body text-sm text-fg-tertiary">
            Click a loop to explore its commands
          </span>
        </div>

        {/* Desktop: horizontal pipeline with bookend labels */}
        <div className="hidden md:flex md:items-start md:justify-center md:gap-4 max-w-5xl mx-auto">
          {/* Configure bookend */}
          <div className="shrink-0 mr-2" style={{ alignSelf: "flex-start", marginTop: "72px" }}>
            <BookendLabel
              label="CONFIGURE"
              side="left"
              active={configureActive}
              description="Auto-detects your stack, sets build/test/lint commands, and generates .karimo/config.yaml before the first loop begins."
            />
          </div>

          {pipelinePhases.map((phase, i) => (
            <div key={phase.id} className="flex items-start gap-4" style={{ flex: "1 1 0" }}>
              <PhaseCard
                phase={phase}
                focused={focusedPhase === phase.id}
                otherFocused={focusedPhase !== phase.id}
                onFocus={handleFocus}
                activeChipIndex={currentStep?.phase === phase.id ? activeChipIndex : -1}
                loopAnimating={currentStep?.phase === phase.id && loopAnimating}
              />
              {i < pipelinePhases.length - 1 && (
                <PhaseArrow
                  dimmed={focusedPhase !== pipelinePhases[i + 1].id}
                />
              )}
            </div>
          ))}

          {/* Merge bookend */}
          <div className="shrink-0 ml-2" style={{ alignSelf: "flex-start", marginTop: "72px" }}>
            <BookendLabel
              label="MERGE"
              side="right"
              active={mergeActive}
              description="Validates the feature branch, runs your full test suite, and creates a single consolidated PR to main with a complete audit trail."
            />
          </div>
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <MobileLoopCarousel
            activePhase={focusedPhase}
            onSelectPhase={handleFocus}
            configureActive={configureActive}
            mergeActive={mergeActive}
            activeChipIndex={activeChipIndex}
            loopAnimating={loopAnimating}
            animatingPhase={currentStep?.phase ?? null}
          />
        </div>

        {/* Detail panel */}
        <PhaseDetailPanel
          phaseId={focusedPhase}
          syncedCommandIndex={syncedCommandIdx}
        />
      </div>
      </motion.div>
    </section>
  );
}

export default OverviewSection;
