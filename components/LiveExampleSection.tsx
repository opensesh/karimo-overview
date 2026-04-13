"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTimeline } from "@/hooks/useTimeline";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { VSCodeEmulator, type MobilePanel } from "@/components/vscode/VSCodeEmulator";
import {
  FILE_TREE,
  CHAT_SCRIPT,
  TIMELINE_EVENTS,
  TIMELINE_DURATION,
} from "@/lib/vscode-data";

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
      className="rounded-xl border border-border-secondary bg-bg-secondary/50 px-3 py-2 sm:px-4 sm:py-3 mb-3 sm:mb-4 shrink-0"
      style={{ backdropFilter: "blur(8px)" }}
    >
      {/* Mobile: two-row layout / Desktop: single row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        {/* Chapters — horizontal scroll, no scrollbar */}
        <div
          className="flex gap-1 sm:gap-1.5 overflow-x-auto min-w-0 pb-0.5 sm:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
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
                  className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-[11px] sm:text-xs transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
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
                    border: `1px solid ${
                      isActive
                        ? isBookend
                          ? bookendActiveBorder
                          : "rgba(254, 81, 2, 0.3)"
                        : "transparent"
                    }`,
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

        {/* Playback controls — centered on mobile, right-aligned on desktop */}
        <div className="flex items-center justify-center sm:justify-end gap-1.5 sm:gap-2 shrink-0">
          {/* Speed buttons */}
          <div className="flex items-center rounded-md overflow-hidden border border-border-secondary">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => onSetSpeed(s)}
                className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-[11px] font-medium transition-colors cursor-pointer"
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
          <div className="w-px h-4 bg-border-secondary" />

          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className="text-fg-tertiary hover:text-fg-primary transition-colors cursor-pointer p-1"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="currentColor"
              >
                <rect x="2" y="1" width="3.5" height="12" rx="0.5" />
                <rect x="8.5" y="1" width="3.5" height="12" rx="0.5" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
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
            className="text-fg-tertiary hover:text-fg-primary transition-colors cursor-pointer p-1"
            aria-label="Restart"
          >
            <svg
              width="14"
              height="14"
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
  const [hasStarted, setHasStarted] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("chat");

  const timeline = useTimeline({
    duration: TIMELINE_DURATION,
    loop: true,
    autoPlay: false,
  });

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
      id="live-example"
      className="bg-bg-primary relative overflow-hidden"
      style={{ minHeight: "100dvh" }}
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
        className="relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col"
        style={{ height: "100dvh" }}
      >
        {/* Header */}
        <div className="pt-16 sm:pt-20 pb-4 sm:pb-8 shrink-0">
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
            An entire Framer website migrated into a custom Next.js codebase.
            20 tasks, 4 waves, 39 files changed &mdash; all from a single KARIMO feature plan.
          </motion.p>
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
