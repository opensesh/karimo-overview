"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, useMotionValueEvent, animate } from "framer-motion";
import { ChevronLeft, ChevronRight, LinkExternal01 } from "@untitledui/icons";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface ClaudeFeature {
  id: string;
  title: string;
  description: string;
  href: string;
  date: string;
}

const DOCS_BASE = "https://docs.anthropic.com/en/docs/claude-code";

const claudeFeatures: ClaudeFeature[] = [
  {
    id: "worktree",
    title: "Worktree Isolation",
    description:
      "Each task executes in its own git worktree. No conflicts, no race conditions.",
    href: `${DOCS_BASE}/cli-usage#agents`,
    date: "Mar 2026",
  },
  {
    id: "subagents",
    title: "Sub-Agents",
    description:
      "Spawn focused child agents for parallel task execution across your codebase.",
    href: `${DOCS_BASE}/sub-agents`,
    date: "Jul 2025",
  },
  {
    id: "teams",
    title: "Agent Teams",
    description:
      "Coordinate multiple agents working on related tasks simultaneously.",
    href: `${DOCS_BASE}/cli-usage#agents`,
    date: "Sep 2025",
  },
  {
    id: "skills",
    title: "Skills",
    description:
      "Reusable capability modules that extend agent knowledge and behavior.",
    href: `${DOCS_BASE}/skills`,
    date: "Jan 2026",
  },
  {
    id: "hooks",
    title: "Hooks",
    description:
      "Lifecycle hooks for pre/post task automation and validation steps.",
    href: `${DOCS_BASE}/hooks`,
    date: "Jun 2025",
  },
  {
    id: "routing",
    title: "Model Routing",
    description:
      "Route tasks to optimal models based on complexity and cost constraints.",
    href: `${DOCS_BASE}/model-configuration`,
    date: "Jul 2025",
  },
  {
    id: "commands",
    title: "Commands",
    description:
      "Custom slash commands to streamline repetitive workflows and operations.",
    href: `${DOCS_BASE}/slash-commands`,
    date: "Mar 2025",
  },
  {
    id: "branch",
    title: "Branch Assertion",
    description:
      "PM Agent verifies branch state before and after each operation.",
    href: `${DOCS_BASE}/cli-usage#agents`,
    date: "Sep 2025",
  },
  {
    id: "loop",
    title: "Loop Detection",
    description:
      "Automatic detection of revision loops prevents infinite cycles.",
    href: `${DOCS_BASE}/cli-usage#agents`,
    date: "Sep 2025",
  },
  {
    id: "crash",
    title: "Crash Recovery",
    description:
      "Execution state reconstructed from git. Resume exactly where you left off.",
    href: `${DOCS_BASE}/cli-usage#agents`,
    date: "Sep 2025",
  },
];

/* ------------------------------------------------------------------ */
/*  Icon mapping                                                       */
/* ------------------------------------------------------------------ */

const ICON_INDICES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14] as const;

function getIconForFeature(featureIndex: number): string {
  const mapped = (featureIndex * 3) % ICON_INDICES.length;
  return `/icons/Claude-${ICON_INDICES[mapped]}.svg`;
}

/* ------------------------------------------------------------------ */
/*  Claude logo                                                        */
/* ------------------------------------------------------------------ */

function ClaudeLogo({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-label="Claude"
    >
      <g clipPath="url(#claude-feat-clip)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.613 0H12.387C14.374 0 16 1.633 16 3.63V12.37C16 14.367 14.374 16 12.387 16H3.613C1.626 16 0 14.367 0 12.37V3.63C0 1.633 1.626 0 3.613 0Z"
          fill="#FFFAEE"
        />
        <path
          d="M4.446 9.94L6.748 8.643L6.786 8.53L6.748 8.467L6.635 8.467L6.251 8.443L4.936 8.408L3.795 8.36L2.69 8.301L2.412 8.241L2.151 7.896L2.178 7.724L2.412 7.566L2.747 7.595L3.487 7.646L4.598 7.723L5.403 7.771L6.597 7.895H6.786L6.813 7.818L6.748 7.771L6.698 7.723L5.549 6.94L4.304 6.114L3.653 5.637L3.301 5.396L3.123 5.17L3.046 4.677L3.366 4.323L3.796 4.352L3.906 4.381L4.341 4.718L5.271 5.441L6.485 6.339L6.662 6.487L6.733 6.437L6.742 6.401L6.662 6.267L6.002 5.068L5.297 3.848L4.984 3.343L4.901 3.04C4.872 2.915 4.85 2.81 4.85 2.682L5.214 2.186L5.416 2.121L5.902 2.186L6.106 2.364L6.408 3.058L6.897 4.15L7.655 5.634L7.877 6.075L7.996 6.483L8.04 6.607L8.116 6.607V6.536L8.179 5.699L8.294 4.673L8.406 3.351L8.445 2.979L8.628 2.533L8.992 2.292L9.277 2.429L9.51 2.765L9.478 2.982L9.339 3.89L9.067 5.312L8.889 6.264H8.992L9.111 6.145L9.59 5.506L10.396 4.494L10.752 4.093L11.166 3.649L11.432 3.438L11.935 3.438L12.306 3.991L12.14 4.562L11.622 5.222L11.192 5.782L10.576 6.615L10.191 7.282L10.227 7.335L10.319 7.326L11.71 7.029L12.462 6.892L13.36 6.737L13.766 6.928L13.81 7.121L13.65 7.517L12.691 7.755L11.565 7.982L9.889 8.38L9.868 8.395L9.892 8.424L10.647 8.496L10.97 8.513H11.761L13.233 8.624L13.618 8.879L13.849 9.192L13.81 9.43L13.217 9.733L12.418 9.543L10.552 9.097L9.913 8.936L9.824 8.936V8.989L10.357 9.513L11.334 10.4L12.558 11.542L12.62 11.825L12.463 12.048L12.297 12.024L11.222 11.211L10.808 10.846L9.868 10.051L9.806 10.051V10.134L10.022 10.453L11.165 12.179L11.225 12.708L11.142 12.88L10.845 12.984L10.52 12.925L9.851 11.981L9.161 10.918L8.604 9.966L8.536 10.005L8.207 13.561L8.053 13.743L7.698 13.879L7.402 13.653L7.244 13.287L7.402 12.564L7.591 11.621L7.745 10.871L7.884 9.939L7.967 9.63L7.962 9.609L7.894 9.618L7.195 10.582L6.131 12.025L5.29 12.93L5.089 13.01L4.74 12.828L4.772 12.504L4.967 12.215L6.131 10.727L6.834 9.805L7.287 9.273L7.284 9.196H7.257L4.165 11.213L3.614 11.284L3.377 11.061L3.406 10.695L3.519 10.576L4.448 9.934L4.445 9.937L4.446 9.94Z"
          fill="#191919"
        />
      </g>
      <defs>
        <clipPath id="claude-feat-clip">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature card                                                       */
/* ------------------------------------------------------------------ */

function FeatureCard({
  feature,
  iconSrc,
  cardWidth,
}: {
  feature: ClaudeFeature;
  iconSrc: string;
  cardWidth: number;
}) {
  return (
    <div
      className="group block rounded-xl overflow-hidden
                 bg-bg-tertiary border border-border-secondary
                 hover:border-border-brand hover:-translate-y-1
                 transition-all duration-300 flex-shrink-0 select-none"
      style={{ width: cardWidth, minWidth: cardWidth }}
    >
      {/* Image area */}
      <div
        className="relative h-28 sm:h-32 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "var(--fg-brand)" }}
      >
        <img
          src={iconSrc}
          alt=""
          draggable={false}
          className="w-12 h-12 sm:w-14 sm:h-14 opacity-90 pointer-events-none
                     group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 text-left">
        <div className="flex items-start justify-between gap-2">
          <h5 className="text-fg-primary text-sm font-semibold">
            {feature.title}
          </h5>
          <LinkExternal01
            width={14}
            height={14}
            className="text-fg-tertiary group-hover:text-fg-brand transition-colors flex-shrink-0 mt-0.5"
          />
        </div>
        <p className="text-fg-secondary text-xs mt-1.5 leading-relaxed line-clamp-2">
          {feature.description}
        </p>
        <p className="text-fg-tertiary text-[11px] mt-3 font-mono uppercase tracking-wider">
          {feature.date}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const GAP = 16;
const TOTAL = claudeFeatures.length;
const SETS = 3;

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function ClaudeFeatures() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(240);

  const x = useMotionValue(0);

  // Drag state refs (no re-renders during drag)
  const pointerDown = useRef(false);
  const startPointerX = useRef(0);
  const startTrackX = useRef(0);
  const hasDragged = useRef(false);
  const lastPointerX = useRef(0);
  const lastTimestamp = useRef(0);
  const velocity = useRef(0);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  const setWidth = (cardWidth + GAP) * TOTAL;

  /* ---------- wrap: keep position in the middle third -------------- */
  const wrap = useCallback(
    (val: number) => {
      if (setWidth <= 0) return val;
      // Middle set occupies [-2*setWidth, -setWidth]
      const lo = -2 * setWidth;
      const hi = -setWidth;
      let v = val;
      while (v > hi) v -= setWidth;
      while (v < lo) v += setWidth;
      return v;
    },
    [setWidth]
  );

  /* ---------- responsive card width -------------------------------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      const cols = w < 640 ? 2 : 4;
      const gaps = (cols - 1) * GAP;
      setCardWidth(Math.max(140, (w - gaps) / cols));
      setVisibleCols(cols);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ---------- position the middle set on mount / resize ------------ */
  useEffect(() => {
    const v = wrap(-setWidth);
    x.jump(v);
  }, [setWidth, x, wrap]);

  /* ---------- navigate by n cards with spring animation ------------ */
  const slideTo = useCallback(
    (cards: number) => {
      animRef.current?.stop();
      const current = x.get();
      const target = wrap(current - cards * (cardWidth + GAP));

      // If wrapping would teleport visually, jump first
      if (Math.abs(target - current) > setWidth * 0.6) {
        const jumped = wrap(current);
        x.jump(jumped);
        const newTarget = wrap(jumped - cards * (cardWidth + GAP));
        animRef.current = animate(x, newTarget, {
          type: "spring",
          stiffness: 260,
          damping: 32,
          mass: 0.8,
        });
      } else {
        animRef.current = animate(x, target, {
          type: "spring",
          stiffness: 260,
          damping: 32,
          mass: 0.8,
        });
      }
    },
    [x, cardWidth, wrap, setWidth]
  );

  /* ---------- pointer-based drag (zero jank, 1:1 tracking) --------- */
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only primary button
      if (e.button !== 0) return;
      animRef.current?.stop();
      pointerDown.current = true;
      hasDragged.current = false;
      startPointerX.current = e.clientX;
      startTrackX.current = x.get();
      lastPointerX.current = e.clientX;
      lastTimestamp.current = e.timeStamp;
      velocity.current = 0;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [x]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerDown.current) return;
      const dx = e.clientX - startPointerX.current;
      if (Math.abs(dx) > 4) hasDragged.current = true;

      // Velocity tracking
      const dt = e.timeStamp - lastTimestamp.current;
      if (dt > 0) {
        velocity.current = ((e.clientX - lastPointerX.current) / dt) * 1000;
      }
      lastPointerX.current = e.clientX;
      lastTimestamp.current = e.timeStamp;

      // 1:1 track position
      const raw = startTrackX.current + dx;
      x.jump(wrap(raw));
    },
    [x, wrap]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerDown.current) return;
      pointerDown.current = false;
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

      const current = x.get();
      const step = cardWidth + GAP;
      const v = velocity.current;

      // Momentum: convert velocity into extra cards
      const momentumCards = Math.round(v / 600);
      let snapTarget: number;

      if (momentumCards !== 0) {
        // Fling: advance by momentum
        snapTarget = Math.round(current / step) * step + momentumCards * step;
      } else {
        // No fling: snap to nearest card edge
        snapTarget = Math.round(current / step) * step;
      }

      snapTarget = wrap(snapTarget);

      // Avoid visual jump from wrap
      if (Math.abs(snapTarget - current) > setWidth * 0.6) {
        x.jump(wrap(current));
        snapTarget = wrap(snapTarget);
      }

      animRef.current = animate(x, snapTarget, {
        type: "spring",
        stiffness: 200,
        damping: 28,
        mass: 0.6,
        velocity: v,
      });
    },
    [x, cardWidth, wrap, setWidth]
  );

  /* ---------- click guard: block link nav after drag ---------------- */
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  /* ---------- progress tracking ------------------------------------ */
  const [progress, setProgress] = useState(0);
  const [visibleCols, setVisibleCols] = useState(4);

  useMotionValueEvent(x, "change", (latest) => {
    if (setWidth <= 0) return;
    // x grows more negative as you advance right, so invert
    const offset = -(latest + setWidth);
    const p = ((offset % setWidth) + setWidth) % setWidth / setWidth;
    setProgress(p);
  });

  /* ---------- entrance animation ---------------------------------- */
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  /* ---------- render ----------------------------------------------- */
  return (
    <div className="mt-12">
      {/* Header row: left-aligned title + chip with progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between mb-5 px-2 sm:px-12"
      >
        {/* Left: logo + title */}
        <div className="flex items-center gap-2.5">
          <ClaudeLogo />
          <h4 className="text-heading text-lg text-fg-primary font-medium">
            Claude Features
          </h4>
        </div>

        {/* Right: count chip + progress bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-fg-secondary px-2.5 py-1 rounded-md
                           bg-bg-tertiary border border-border-secondary">
            <span className="text-fg-brand font-semibold">{TOTAL}</span>
            <span className="text-fg-tertiary"> total</span>
          </span>

          {/* Progress bar — thumb shows visible window within total */}
          <div className="w-16 sm:w-24 h-1.5 rounded-full bg-border-secondary relative overflow-hidden">
            <motion.div
              className="absolute top-0 h-full rounded-full"
              style={{
                width: `${(visibleCols / TOTAL) * 100}%`,
                left: `${progress * (1 - visibleCols / TOTAL) * 100}%`,
                backgroundColor: "var(--fg-brand)",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Carousel row: arrow | cards | arrow */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={showCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3"
      >
        {/* Left arrow */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showCards ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => slideTo(-1)}
          aria-label="Previous feature"
          className="hidden sm:flex flex-shrink-0 p-2 rounded-full
                     bg-bg-secondary border border-border-secondary
                     text-fg-secondary hover:text-fg-primary hover:border-border-primary
                     transition-all duration-200 shadow-md"
        >
          <ChevronLeft width={18} height={18} />
        </motion.button>

        {/* Card track viewport */}
        <div
          ref={containerRef}
          className="overflow-hidden flex-1 touch-pan-y"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)',
          }}
          aria-roledescription="carousel"
          aria-label="Claude Features carousel"
        >
          <motion.div
            ref={trackRef}
            className="flex cursor-grab active:cursor-grabbing"
            style={{ x, gap: GAP }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onClickCapture={onClickCapture}
          >
            {Array.from({ length: TOTAL * SETS }, (_, i) => {
              const dataIndex = i % TOTAL;
              const feature = claudeFeatures[dataIndex];
              return (
                <motion.a
                  key={`c-${i}`}
                  href={feature.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                  className="contents"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={
                    showCards
                      ? { opacity: 1, y: 0, scale: 1 }
                      : {}
                  }
                  transition={{
                    duration: 0.5,
                    delay: Math.min(i, 4) * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <FeatureCard
                    feature={feature}
                    iconSrc={getIconForFeature(dataIndex)}
                    cardWidth={cardWidth}
                  />
                </motion.a>
              );
            })}
          </motion.div>
        </div>

        {/* Right arrow */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showCards ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => slideTo(1)}
          aria-label="Next feature"
          className="hidden sm:flex flex-shrink-0 p-2 rounded-full
                     bg-bg-secondary border border-border-secondary
                     text-fg-secondary hover:text-fg-primary hover:border-border-primary
                     transition-all duration-200 shadow-md"
        >
          <ChevronRight width={18} height={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}
