"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTimeline } from "@/hooks/useTimeline";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { VSCodeEmulator, type MobilePanel } from "@/components/vscode/VSCodeEmulator";
import {
  FILE_TREE,
  CHAT_SCRIPT,
  TIMELINE_EVENTS,
  TIMELINE_DURATION,
} from "@/lib/vscode-data";

// ─── Scramble Text Hook ──────────────────────────────────

const SCRAMBLE_CHARS = "█▓▒░▮▯▰▱▣▤▥▦@#$%^&*_+[]{}|;:<>?~";

function useTextScrambleReveal(
  target: string,
  { duration = 800, delay = 0, enabled = true } = {}
) {
  // Initialize with target to avoid hydration mismatch (random chars differ server vs client)
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number>(0);
  const hasRun = useRef(false);
  const hasMounted = useRef(false);

  // After mount, replace with scrambled characters so the reveal effect is visible
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      setDisplay(
        Array.from({ length: target.length }, () =>
          SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        ).join("")
      );
    }
  }, [target]);

  useEffect(() => {
    if (!enabled || hasRun.current || !hasMounted.current) return;

    const timeout = setTimeout(() => {
      hasRun.current = true;
      const start = performance.now();

      function tick() {
        const elapsed = performance.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const revealed = Math.floor(eased * target.length);
        let result = "";

        for (let i = 0; i < target.length; i++) {
          if (i < revealed) {
            result += target[i];
          } else {
            result +=
              SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        }

        setDisplay(result);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(target);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, target, duration, delay]);

  return display;
}

// ─── Migration Stats Data ────────────────────────────────
// Ordered impressive-first for carousel

const MIGRATION_STATS = [
  { value: "~4,000", label: "Lines" },
  { value: "~2.5", label: "Hours" },
  { value: "39", label: "+ Files" },
  { value: "67", label: "Images" },
  { value: "20", label: "Tasks" },
  { value: "4", label: "Waves" },
];

const STATS_PER_PAGE = 3;

function StatItem({
  value,
  label,
  delay,
  inView,
}: {
  value: string;
  label: string;
  delay: number;
  inView: boolean;
}) {
  const display = useTextScrambleReveal(value, { delay, enabled: inView });

  return (
    <div className="flex flex-col items-center gap-0.5 min-w-0">
      <span
        className="text-brand-500 text-xl md:text-2xl font-bold text-center w-full"
        style={{ fontFamily: "var(--font-accent)", minHeight: "1.75rem" }}
      >
        {display}
      </span>
      <span
        className="text-[10px] text-fg-tertiary uppercase tracking-wider whitespace-nowrap"
        style={{ fontFamily: "var(--font-accent)", minHeight: "0.875rem" }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Key Statistics Carousel ─────────────────────────────

function KeyStatisticsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(MIGRATION_STATS.length / STATS_PER_PAGE);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-border-secondary bg-bg-secondary/30 px-4 py-3 sm:px-5 sm:py-4 shrink-0 w-full md:w-[280px]"
      style={{ backdropFilter: "blur(8px)" }}
    >
      {/* Header row with title + arrows */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[11px] text-fg-tertiary uppercase tracking-wider"
          style={{ fontFamily: "var(--font-accent)" }}
        >
          Key Statistics
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
            className="text-fg-tertiary hover:text-fg-primary transition-colors cursor-pointer p-0.5"
            aria-label="Previous stats"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8.5 3L4.5 7L8.5 11" />
            </svg>
          </button>
          <button
            onClick={() => setPage((p) => (p + 1) % totalPages)}
            className="text-fg-tertiary hover:text-fg-primary transition-colors cursor-pointer p-0.5"
            aria-label="Next stats"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5.5 3L9.5 7L5.5 11" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats row — fixed height prevents AnimatePresence exit from collapsing layout */}
      <div className="grid" style={{ height: "3.25rem" }}>
        {Array.from({ length: totalPages }).map((_, pi) => {
          const stats = MIGRATION_STATS.slice(
            pi * STATS_PER_PAGE,
            pi * STATS_PER_PAGE + STATS_PER_PAGE
          );
          const isActive = pi === page;
          return (
            <div
              key={pi}
              className="grid grid-cols-3 gap-4 sm:gap-6 pointer-events-none"
              style={{
                gridArea: "1 / 1",
                visibility: isActive ? "visible" : "hidden",
              }}
              aria-hidden={!isActive}
            >
              {isActive ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={page}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="col-span-3 grid grid-cols-3 gap-4 sm:gap-6 pointer-events-auto"
                  >
                    {stats.map((stat, i) => (
                      <StatItem
                        key={stat.label}
                        value={stat.value}
                        label={stat.label}
                        delay={i * 80}
                        inView={isInView}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-0.5 min-w-0">
                    <span
                      className="text-xl md:text-2xl font-bold"
                      style={{ fontFamily: "var(--font-accent)", minHeight: "1.75rem" }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-[10px] sm:text-[11px] uppercase tracking-wider whitespace-nowrap"
                      style={{ fontFamily: "var(--font-accent)", minHeight: "0.875rem" }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* Page dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className="cursor-pointer"
            aria-label={`Page ${i + 1}`}
          >
            <div
              className="w-1 h-1 rounded-full transition-colors duration-200"
              style={{
                background: i === page ? "#fe5102" : "#555",
              }}
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Chapters ─────────────────────────────────────────────

const CHAPTERS = [
  { label: "Before", time: 0, icon: "before" as const },
  { label: "Research", time: 2000 },
  { label: "Plan", time: 10000 },
  { label: "Review", time: 16000 },
  { label: "Run", time: 20000 },
  { label: "Merge", time: 34000 },
  { label: "Complete", time: 38000 },
  { label: "After", time: 42000, icon: "after" as const },
];

function getActiveChapter(currentTime: number): number {
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (currentTime >= CHAPTERS[i].time) return i;
  }
  return 0;
}

// ─── Derived State Helpers ────────────────────────────────

function deriveVisibleMessages(currentTime: number) {
  return CHAT_SCRIPT.filter((msg) => msg.timestamp <= currentTime);
}

function deriveRevealedPaths(currentTime: number) {
  const paths = new Set<string>();
  for (const event of TIMELINE_EVENTS) {
    if (event.time > currentTime) break;
    if (event.type === "tree-reveal") paths.add(event.payload);
  }
  return paths;
}

function deriveTimelineFile(currentTime: number): string | null {
  let file: string | null = null;
  for (const event of TIMELINE_EVENTS) {
    if (event.time > currentTime) break;
    if (event.type === "editor-content") file = event.payload;
  }
  return file;
}

function deriveTimelineTabs(currentTime: number): string[] {
  const tabs: string[] = [];
  for (const event of TIMELINE_EVENTS) {
    if (event.time > currentTime) break;
    if (event.type === "tab-open" && !tabs.includes(event.payload)) {
      tabs.push(event.payload);
    }
  }
  return tabs.slice(-5);
}

// ─── Speed Options ────────────────────────────────────────

const SPEEDS = [1, 2, 3] as const;

// ─── Control Bar ──────────────────────────────────────────
// Contains: chapters | progress bar | play/pause, restart, speed

function ControlBar({
  progress,
  currentTime,
  isPlaying,
  speed,
  hasStarted,
  onSeek,
  onTogglePlay,
  onRestart,
  onSetSpeed,
  onChapterClick,
}: {
  progress: number;
  currentTime: number;
  isPlaying: boolean;
  speed: number;
  hasStarted: boolean;
  onSeek: (time: number) => void;
  onTogglePlay: () => void;
  onRestart: () => void;
  onSetSpeed: (speed: number) => void;
  onChapterClick: (time: number) => void;
}) {
  const activeChapter = getActiveChapter(currentTime);

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onSeek(ratio * TIMELINE_DURATION);
  };

  return (
    <div
      className="rounded-xl border border-border-secondary bg-bg-secondary/50 px-3 py-2 sm:px-4 sm:py-3 mb-3 sm:mb-4 shrink-0 overflow-hidden"
      style={{ backdropFilter: "blur(8px)" }}
    >
      {/* Mobile: two-row layout / Desktop: single row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        {/* Chapters — horizontal scroll, no scrollbar */}
        <div
          className="flex gap-1 sm:gap-1.5 overflow-x-auto min-w-0 pb-0.5 sm:pb-0 hide-scrollbar"
        >
          {CHAPTERS.map((ch, i) => {
            const isActive = hasStarted && i === activeChapter;
            const isBookend = "icon" in ch;
            const isLast = i === CHAPTERS.length - 1;

            // Bookend chapters (Before/After) get a distinct blue-gray tint
            const bookendActiveBg = "rgba(120, 160, 200, 0.15)";
            const bookendActiveColor = "#8ab4d6";
            const bookendActiveBorder = "rgba(120, 160, 200, 0.3)";

            return (
              <div key={ch.label} className="flex items-center shrink-0">
                {/* Separator between bookends and workflow phases */}
                {i === 1 || isLast ? (
                  <div
                    className="w-px h-4 mx-1 sm:mx-1.5"
                    style={{ background: "#444" }}
                  />
                ) : null}
                <button
                  onClick={() => onChapterClick(ch.time)}
                  className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-xs transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
                  style={{
                    background: isActive
                      ? isBookend
                        ? bookendActiveBg
                        : "rgba(254, 81, 2, 0.15)"
                      : "transparent",
                    color: isActive
                      ? isBookend
                        ? bookendActiveColor
                        : "#ff7a38"
                      : "#78716c",
                    borderWidth: "1px",
                    borderColor: isActive
                      ? isBookend
                        ? bookendActiveBorder
                        : "rgba(254, 81, 2, 0.3)"
                      : "transparent",
                    borderStyle:
                      isBookend && isActive ? "dashed" : "solid",
                  }}
                >
                  {/* Before icon: eye */}
                  {"icon" in ch && ch.icon === "before" && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                  {/* After icon: check circle */}
                  {"icon" in ch && ch.icon === "after" && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  )}
                  {ch.label}
                </button>
              </div>
            );
          })}
        </div>

        {/* Playback controls — scrollable on mobile, right-aligned on desktop */}
        <div
          className="flex items-center justify-center sm:justify-end gap-2 shrink-0 overflow-x-auto min-w-0 sm:overflow-visible hide-scrollbar"
        >
          {/* Speed buttons */}
          <div className="flex items-center rounded-md overflow-hidden border border-border-secondary shrink-0">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => onSetSpeed(s)}
                className="px-2 py-0.5 sm:px-2 sm:py-1 text-[11px] sm:text-[11px] font-medium transition-colors cursor-pointer"
                style={{
                  background:
                    speed === s ? "rgba(254, 81, 2, 0.2)" : "transparent",
                  color: speed === s ? "#ff7a38" : "#78716c",
                }}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-border-secondary shrink-0" />

          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className="text-fg-tertiary hover:text-fg-primary transition-colors cursor-pointer p-1 shrink-0"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 14 14"
                fill="currentColor"
              >
                <rect x="2" y="1" width="3.5" height="12" rx="0.5" />
                <rect x="8.5" y="1" width="3.5" height="12" rx="0.5" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 14 14"
                fill="currentColor"
              >
                <path d="M3 1.5v11l9-5.5L3 1.5z" />
              </svg>
            )}
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="text-fg-tertiary hover:text-fg-primary transition-colors cursor-pointer p-1 shrink-0"
            aria-label="Restart"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M1.5 2v4h4" />
              <path d="M2.5 6A5 5 0 1 1 2 8.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="relative w-full h-1 rounded-full cursor-pointer group mt-2"
        style={{ background: "#333" }}
        onClick={handleBarClick}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-[width] duration-100"
          style={{ width: `${progress * 100}%`, background: "#fe5102" }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            left: `calc(${progress * 100}% - 5px)`,
            background: "#fe5102",
          }}
        />
        {/* Chapter tick marks */}
        {CHAPTERS.slice(1).map((ch) => (
          <div
            key={ch.label}
            className="absolute top-1/2 -translate-y-1/2 w-px h-2.5"
            style={{
              left: `${(ch.time / TIMELINE_DURATION) * 100}%`,
              background: "#555",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Blur Overlay ─────────────────────────────────────────

function BlurOverlay({ onPlay }: { onPlay: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer rounded-xl"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={onPlay}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col items-center gap-4"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110"
          style={{
            background: "rgba(254, 81, 2, 0.9)",
            boxShadow: "0 0 40px rgba(254, 81, 2, 0.3)",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#fff"
            className="ml-1"
          >
            <path d="M6 4v16l14-8L6 4z" />
          </svg>
        </div>
        <span className="text-sm text-fg-secondary">
          Click to watch the full migration
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────

export function LiveExampleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionInView = useInView(sectionRef, { margin: "100px" });
  const wasPlayingRef = useRef(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("chat");

  const timeline = useTimeline({
    duration: TIMELINE_DURATION,
    loop: true,
    autoPlay: false,
  });

  // Pause timeline when section leaves viewport; resume when it returns
  useEffect(() => {
    if (!sectionInView) {
      if (timeline.isPlaying) {
        wasPlayingRef.current = true;
        timeline.pause();
      }
    } else if (wasPlayingRef.current) {
      wasPlayingRef.current = false;
      timeline.play();
    }
  }, [sectionInView]); // eslint-disable-line react-hooks/exhaustive-deps

  // User interaction state
  const [userActiveFile, setUserActiveFile] = useState<string | null>(null);
  const [userTabs, setUserTabs] = useState<string[]>([]);
  const [userInteracted, setUserInteracted] = useState(false);

  // Derived timeline state
  const visibleMessages = useMemo(
    () => deriveVisibleMessages(timeline.currentTime),
    [timeline.currentTime]
  );
  const revealedPaths = useMemo(
    () => deriveRevealedPaths(timeline.currentTime),
    [timeline.currentTime]
  );
  const timelineFile = useMemo(
    () => deriveTimelineFile(timeline.currentTime),
    [timeline.currentTime]
  );
  const timelineTabs = useMemo(
    () => deriveTimelineTabs(timeline.currentTime),
    [timeline.currentTime]
  );
  const activeChapter = useMemo(
    () => getActiveChapter(timeline.currentTime),
    [timeline.currentTime]
  );

  // Merge user + timeline state
  const activeFile = userInteracted ? userActiveFile : timelineFile;
  const openTabs = userInteracted
    ? [...new Set([...timelineTabs, ...userTabs])]
    : timelineTabs;

  // ─── Handlers ───────────────────────────────────────────

  const handlePlay = useCallback(() => {
    setHasStarted(true);
    timeline.play();
  }, [timeline]);

  const handleFileSelect = useCallback(
    (contentKey: string) => {
      setUserInteracted(true);
      setUserActiveFile(contentKey);
      setUserTabs((prev) =>
        prev.includes(contentKey) ? prev : [...prev, contentKey].slice(-5)
      );
      timeline.pause();
      // On mobile, switch to editor panel when file is selected
      setMobilePanel("editor");
    },
    [timeline]
  );

  const handleTabSelect = useCallback(
    (contentKey: string) => {
      setUserInteracted(true);
      setUserActiveFile(contentKey);
      timeline.pause();
    },
    [timeline]
  );

  const handleTabClose = useCallback(
    (contentKey: string) => {
      setUserTabs((prev) => prev.filter((t) => t !== contentKey));
      if (userActiveFile === contentKey) {
        setUserActiveFile(null);
        setUserInteracted(false);
      }
    },
    [userActiveFile]
  );

  const handleTogglePlay = useCallback(() => {
    if (!timeline.isPlaying) {
      setHasStarted(true);
      setUserInteracted(false);
      setUserActiveFile(null);
    }
    timeline.toggle();
  }, [timeline]);

  const handleRestart = useCallback(() => {
    setHasStarted(true);
    setUserInteracted(false);
    setUserActiveFile(null);
    setUserTabs([]);
    timeline.restart();
  }, [timeline]);

  const handleChapterSeek = useCallback(
    (time: number) => {
      setHasStarted(true);
      setUserInteracted(false);
      setUserActiveFile(null);
      setUserTabs([]);
      timeline.seek(time);
    },
    [timeline]
  );

  return (
    <section
      ref={sectionRef}
      id="live-example"
      className="section-padding bg-bg-primary relative overflow-hidden min-h-screen flex flex-col"
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      {/* Full-height flex layout */}
      <div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col flex-1"
      >
        {/* Header — text left, stats carousel right on desktop */}
        <div className="pb-4 sm:pb-6 shrink-0 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8">
          {/* Left: label, headline, description */}
          <div className="min-w-0 flex-1">
            <SectionLabel>LIVE EXAMPLE</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-fg-primary mt-4"
            >
              A Real Migration, Start to Finish
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-body text-sm sm:text-base text-fg-secondary mt-2 sm:mt-3 max-w-2xl"
            >
              Recently, we migrated an entire Framer website to a custom Next.js
              codebase. This can never be done in one plan mode. We migrated all
              the content, images, compressed them, and built new web page structures.
            </motion.p>
          </div>

          {/* Right: Key Statistics carousel */}
          <div className="md:shrink-0">
            <KeyStatisticsCarousel />
          </div>
        </div>


        {/* Control bar */}
        <ControlBar
          progress={timeline.progress}
          currentTime={timeline.currentTime}
          isPlaying={timeline.isPlaying}
          speed={timeline.speed}
          hasStarted={hasStarted}
          onSeek={handleChapterSeek}
          onTogglePlay={handleTogglePlay}
          onRestart={handleRestart}
          onSetSpeed={timeline.setSpeed}
          onChapterClick={handleChapterSeek}
        />

        {/* Mobile navigation hint */}
        <p className="sm:hidden text-[10px] text-fg-tertiary text-center -mt-1 mb-2 shrink-0">
          Tap chapters to navigate &middot; Swipe Files, Editor, Chat below
        </p>

        {/* VS Code Emulator — fills remaining space */}
        <div
          className="relative flex-1 min-h-0 overflow-hidden pb-4 sm:pb-10 lg:max-h-[60vh]"
          onWheel={(e) => {
            const target = e.target as HTMLElement;
            const scrollable = target.closest("[data-vscode-scroll]");
            if (scrollable) {
              e.stopPropagation();
            }
          }}
        >
          {/* Blur overlay before play */}
          <AnimatePresence>
            {!hasStarted && <BlurOverlay onPlay={handlePlay} />}
          </AnimatePresence>

          {/* Desktop emulator */}
          <div className="hidden lg:block h-full">
            <VSCodeEmulator
              tree={FILE_TREE}
              activeFile={activeFile}
              openTabs={openTabs}
              visibleMessages={visibleMessages}
              revealedPaths={revealedPaths}
              currentTime={timeline.currentTime}
              activeChapter={activeChapter}
              onFileSelect={handleFileSelect}
              onTabSelect={handleTabSelect}
              onTabClose={handleTabClose}
            />
          </div>

          {/* Mobile/tablet emulator */}
          <div className="lg:hidden h-full">
            <VSCodeEmulator
              tree={FILE_TREE}
              activeFile={activeFile}
              openTabs={openTabs}
              visibleMessages={visibleMessages}
              revealedPaths={revealedPaths}
              currentTime={timeline.currentTime}
              activeChapter={activeChapter}
              onFileSelect={handleFileSelect}
              onTabSelect={handleTabSelect}
              onTabClose={handleTabClose}
              mobilePanel={mobilePanel}
              onMobilePanelChange={setMobilePanel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
