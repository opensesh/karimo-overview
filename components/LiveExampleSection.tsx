"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useTimeline } from "@/hooks/useTimeline";
import { useParallax } from "@/components/ui/ParallaxSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { VSCodeEmulator } from "@/components/vscode/VSCodeEmulator";
import {
  FILE_TREE,
  CHAT_SCRIPT,
  TIMELINE_EVENTS,
  TIMELINE_DURATION,
} from "@/lib/vscode-data";

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
  // Keep max 5 tabs
  return tabs.slice(-5);
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
    <div className="flex items-center gap-1">
      <button
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
  );
}

// ─── Progress Bar ─────────────────────────────────────────

function ProgressBar({
  progress,
  onSeek,
}: {
  progress: number;
  onSeek: (time: number) => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onSeek(ratio * TIMELINE_DURATION);
  };

  return (
    <div
      className="relative w-full h-1 rounded-full cursor-pointer mt-3 group"
      style={{ background: "#333" }}
      onClick={handleClick}
    >
      <div
        className="absolute left-0 top-0 h-full rounded-full transition-[width] duration-100"
        style={{ width: `${progress * 100}%`, background: "#007acc" }}
      />
      {/* Hover thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          left: `calc(${progress * 100}% - 5px)`,
          background: "#007acc",
        }}
      />
    </div>
  );
}

// ─── Mobile Fallback ──────────────────────────────────────

function MobileFallback() {
  const stats = [
    { value: "20", label: "Tasks" },
    { value: "4", label: "Waves" },
    { value: "39", label: "Files" },
    { value: "3h", label: "Total" },
  ];

  return (
    <div className="lg:hidden">
      <div className="rounded-xl border border-border-secondary bg-bg-tertiary p-6">
        <p className="text-body text-sm text-fg-secondary text-center mb-4">
          This interactive demo is best experienced on desktop.
        </p>
        <div className="flex justify-center gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-display text-2xl text-fg-primary">
                {stat.value}
              </div>
              <div className="text-accent text-[10px] tracking-wider text-fg-tertiary uppercase mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────

export function LiveExampleSection() {
  const { ref: sectionRef, y } = useParallax(30);
  const emulatorRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(emulatorRef, { once: true, margin: "-200px" });
  const hasStarted = useRef(false);

  const timeline = useTimeline({
    duration: TIMELINE_DURATION,
    loop: true,
    autoPlay: false,
  });

  // Auto-play when section enters viewport
  useEffect(() => {
    if (isInView && !hasStarted.current) {
      hasStarted.current = true;
      timeline.play();
    }
  }, [isInView, timeline]);

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

  // Merge user + timeline state
  const activeFile = userInteracted ? userActiveFile : timelineFile;
  const openTabs = userInteracted
    ? [...new Set([...timelineTabs, ...userTabs])]
    : timelineTabs;

  // Handlers
  const handleFileSelect = useCallback(
    (contentKey: string) => {
      setUserInteracted(true);
      setUserActiveFile(contentKey);
      setUserTabs((prev) =>
        prev.includes(contentKey) ? prev : [...prev, contentKey].slice(-5)
      );
      timeline.pause();
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
      setUserInteracted(false);
      setUserActiveFile(null);
    }
    timeline.toggle();
  }, [timeline]);

  const handleRestart = useCallback(() => {
    setUserInteracted(false);
    setUserActiveFile(null);
    setUserTabs([]);
    timeline.restart();
  }, [timeline]);

  return (
    <section
      ref={sectionRef}
      id="live-example"
      className="bg-bg-primary relative overflow-hidden py-16 lg:py-24"
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
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8 lg:mb-12">
            <SectionLabel>LIVE EXAMPLE</SectionLabel>
            <div className="flex items-center justify-between mt-4">
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-display text-3xl md:text-4xl lg:text-5xl text-fg-primary"
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
                  className="text-body text-base text-fg-secondary mt-3 max-w-2xl"
                >
                  An entire Framer website migrated into a custom Next.js codebase.
                  20 tasks, 4 waves, 39 files changed &mdash; all from a single plan
                  mode session. Explore the actual output below.
                </motion.p>
              </div>
              <div className="hidden lg:block">
                <PlaybackControls
                  isPlaying={timeline.isPlaying}
                  onTogglePlay={handleTogglePlay}
                  onRestart={handleRestart}
                />
              </div>
            </div>
          </div>

          {/* VS Code Emulator (desktop) */}
          <div ref={emulatorRef} className="hidden lg:block">
            <VSCodeEmulator
              tree={FILE_TREE}
              activeFile={activeFile}
              openTabs={openTabs}
              visibleMessages={visibleMessages}
              revealedPaths={revealedPaths}
              currentTime={timeline.currentTime}
              onFileSelect={handleFileSelect}
              onTabSelect={handleTabSelect}
              onTabClose={handleTabClose}
            />
            <ProgressBar progress={timeline.progress} onSeek={timeline.seek} />
          </div>

          {/* Mobile fallback */}
          <MobileFallback />
        </div>
      </motion.div>

    </section>
  );
}
