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
    href: `${DOCS_BASE}/common-workflows`,
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
    href: `${DOCS_BASE}/sub-agents`,
    date: "Sep 2025",
  },
  {
    id: "skills",
    title: "Skills",
    description:
      "Reusable capability modules that extend agent knowledge and behavior.",
    href: `${DOCS_BASE}/slash-commands`,
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
    href: `${DOCS_BASE}/common-workflows`,
    date: "Sep 2025",
  },
  {
    id: "loop",
    title: "Loop Detection",
    description:
      "Automatic detection of revision loops prevents infinite cycles.",
    href: `${DOCS_BASE}/common-workflows`,
    date: "Sep 2025",
  },
  {
    id: "crash",
    title: "Crash Recovery",
    description:
      "Execution state reconstructed from git. Resume exactly where you left off.",
    href: `${DOCS_BASE}/common-workflows`,
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
      fill="currentColor"
      className={className}
      aria-label="Claude"
    >
      <path d="m3.127 10.604 3.135-1.76.053-.153-.053-.085H6.11l-.525-.032-1.791-.048-1.554-.065-1.505-.08-.38-.081L0 7.832l.036-.234.32-.214.455.04 1.009.069 1.513.105 1.097.064 1.626.17h.259l.036-.105-.089-.065-.068-.064-1.566-1.062-1.695-1.121-.887-.646-.48-.327-.243-.306-.104-.67.435-.48.585.04.15.04.593.456 1.267.981 1.654 1.218.242.202.097-.068.012-.049-.109-.181-.9-1.626-.96-1.655-.428-.686-.113-.411a2 2 0 0 1-.068-.484l.496-.674L4.446 0l.662.089.279.242.411.94.666 1.48 1.033 2.014.302.597.162.553.06.17h.105v-.097l.085-1.134.157-1.392.154-1.792.052-.504.25-.605.497-.327.387.186.319.456-.045.294-.19 1.23-.37 1.93-.243 1.29h.142l.161-.16.654-.868 1.097-1.372.484-.545.565-.601.363-.287h.686l.505.751-.226.775-.707.895-.585.759-.839 1.13-.524.904.048.072.125-.012 1.897-.403 1.024-.186 1.223-.21.553.258.06.263-.218.536-1.307.323-1.533.307-2.284.54-.028.02.032.04 1.029.098.44.024h1.077l2.005.15.525.346.315.424-.053.323-.807.411-3.631-.863-.872-.218h-.12v.073l.726.71 1.331 1.202 1.667 1.55.084.383-.214.302-.226-.032-1.464-1.101-.565-.497-1.28-1.077h-.084v.113l.295.432 1.557 2.34.08.718-.112.234-.404.141-.444-.08-.911-1.28-.94-1.44-.759-1.291-.093.053-.448 4.821-.21.246-.484.186-.403-.307-.214-.496.214-.98.258-1.28.21-1.016.19-1.263.112-.42-.008-.028-.092.012-.953 1.307-1.448 1.957-1.146 1.227-.274.109-.477-.247.045-.44.266-.39 1.586-2.018.956-1.25.617-.723-.004-.105h-.036l-4.212 2.736-.75.096-.324-.302.04-.496.154-.162 1.267-.871z" />
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
                 transition-all duration-300 flex-shrink-0 select-none
                 cursor-pointer"
      style={{ width: cardWidth, minWidth: cardWidth }}
      onClick={(e) => {
        if (!e.defaultPrevented) {
          window.open(feature.href, '_blank', 'noopener,noreferrer');
        }
      }}
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
            className="flex cursor-grab active:cursor-grabbing py-1"
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
