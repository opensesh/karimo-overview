"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import {
  CATEGORY_META,
  architectureRoot,
  type ArchNode,
  type Category,
} from "@/lib/architectureData";
import { accordionContent, smoothTransition } from "@/lib/motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

// ---------------------------------------------------------------------------
// Squarified treemap (Bruls/Huijsen) — single-level, normalized to canvas size
// ---------------------------------------------------------------------------

interface Tile {
  node: ArchNode;
  x: number;
  y: number;
  w: number;
  h: number;
}

function worstRatio(row: number[], side: number): number {
  if (row.length === 0) return Infinity;
  let rMin = Infinity;
  let rMax = -Infinity;
  let sum = 0;
  for (const r of row) {
    if (r < rMin) rMin = r;
    if (r > rMax) rMax = r;
    sum += r;
  }
  const s2 = sum * sum;
  const side2 = side * side;
  return Math.max((side2 * rMax) / s2, s2 / (side2 * rMin));
}

function layoutRow(
  row: { node: ArchNode; value: number }[],
  rect: { x: number; y: number; w: number; h: number },
  rowSum: number,
): { tiles: Tile[]; rect: { x: number; y: number; w: number; h: number } } {
  const tiles: Tile[] = [];
  const horizontal = rect.w >= rect.h;
  const rowThickness = rowSum / (horizontal ? rect.h : rect.w);

  if (horizontal) {
    let yCursor = rect.y;
    for (const item of row) {
      const tileH = item.value / rowThickness;
      tiles.push({
        node: item.node,
        x: rect.x,
        y: yCursor,
        w: rowThickness,
        h: tileH,
      });
      yCursor += tileH;
    }
    return {
      tiles,
      rect: {
        x: rect.x + rowThickness,
        y: rect.y,
        w: rect.w - rowThickness,
        h: rect.h,
      },
    };
  }

  let xCursor = rect.x;
  for (const item of row) {
    const tileW = item.value / rowThickness;
    tiles.push({
      node: item.node,
      x: xCursor,
      y: rect.y,
      w: tileW,
      h: rowThickness,
    });
    xCursor += tileW;
  }
  return {
    tiles,
    rect: {
      x: rect.x,
      y: rect.y + rowThickness,
      w: rect.w,
      h: rect.h - rowThickness,
    },
  };
}

function squarify(
  nodes: ArchNode[],
  width: number,
  height: number,
): Tile[] {
  if (nodes.length === 0 || width <= 0 || height <= 0) return [];

  const totalValue = nodes.reduce((acc, n) => acc + Math.max(n.fileCount, 1), 0);
  const totalArea = width * height;
  const scale = totalArea / totalValue;

  const queue = [...nodes]
    .map((node) => ({ node, value: Math.max(node.fileCount, 1) * scale }))
    .sort((a, b) => b.value - a.value);

  let rect = { x: 0, y: 0, w: width, h: height };
  const tiles: Tile[] = [];
  let row: { node: ArchNode; value: number }[] = [];
  let rowSum = 0;

  while (queue.length > 0) {
    const next = queue[0];
    const side = Math.min(rect.w, rect.h);
    const candidateRow = [...row.map((r) => r.value), next.value];
    const currentRatio = worstRatio(
      row.map((r) => r.value),
      side,
    );
    const candidateRatio = worstRatio(candidateRow, side);

    if (row.length === 0 || candidateRatio <= currentRatio) {
      row.push(next);
      rowSum += next.value;
      queue.shift();
    } else {
      const { tiles: rowTiles, rect: nextRect } = layoutRow(row, rect, rowSum);
      tiles.push(...rowTiles);
      rect = nextRect;
      row = [];
      rowSum = 0;
    }
  }

  if (row.length > 0) {
    const { tiles: rowTiles } = layoutRow(row, rect, rowSum);
    tiles.push(...rowTiles);
  }

  return tiles;
}

// ---------------------------------------------------------------------------
// Hooks & helpers
// ---------------------------------------------------------------------------

function useElementSize<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => {
      const rect = node.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

function walkPath(root: ArchNode, path: string[]): ArchNode {
  let current = root;
  for (const segment of path) {
    const next = current.children?.find((c) => c.id === segment);
    if (!next) return current;
    current = next;
  }
  return current;
}

function totalDescendantFiles(node: ArchNode): number {
  if (!node.children?.length) return node.fileCount;
  return node.children.reduce((acc, c) => acc + totalDescendantFiles(c), 0);
}

const CATEGORY_ORDER: Category[] = [
  "agents",
  "skills",
  "commands",
  "templates",
  "hooks",
  "plugins",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ArchitectureExplorer() {
  const [pathStack, setPathStack] = useState<string[]>([]);
  const [selected, setSelected] = useState<ArchNode | null>(null);
  const [hover, setHover] = useState<ArchNode | null>(null);
  const reduceMotion = useReducedMotion();

  const canvasRef = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(canvasRef);

  const currentNode = useMemo(
    () => walkPath(architectureRoot, pathStack),
    [pathStack],
  );
  const children = useMemo(
    () => currentNode.children ?? [],
    [currentNode],
  );

  const tiles = useMemo(() => {
    if (width < 1 || height < 1) return [];
    return squarify(children, width, height);
  }, [children, width, height]);

  const drillInto = useCallback((node: ArchNode) => {
    if (node.children?.length) {
      setPathStack((prev) => [...prev, node.id]);
      setSelected(null);
    } else {
      setSelected(node);
    }
  }, []);

  const popTo = useCallback((index: number) => {
    setPathStack((prev) => prev.slice(0, index));
    setSelected(null);
  }, []);

  const goBack = useCallback(() => {
    setPathStack((prev) => prev.slice(0, -1));
    setSelected(null);
  }, []);

  // Escape: clear selection → pop path → no-op
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selected) {
        setSelected(null);
      } else if (pathStack.length > 0) {
        setPathStack((prev) => prev.slice(0, -1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathStack.length, selected]);

  const breadcrumbSegments = [
    { id: "__root__", label: "KARIMO" },
    ...pathStack.map((id, i) => {
      const node = walkPath(architectureRoot, pathStack.slice(0, i + 1));
      return { id, label: node.name };
    }),
  ];

  return (
    <div>
      <SectionLabel>02.1 — ARCHITECTURE EXPLORER</SectionLabel>
      <div className="mt-4 mb-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <h3 className="text-display text-2xl md:text-3xl lg:text-4xl text-fg-primary">
          Inside the framework
        </h3>
        <p className="text-body text-sm text-fg-tertiary md:max-w-sm md:text-right">
          Click around the source tree to see what KARIMO actually ships with.
        </p>
      </div>

      <Legend />

      <Breadcrumb
        segments={breadcrumbSegments}
        onJump={popTo}
        onBack={goBack}
        canGoBack={pathStack.length > 0}
      />

      {/* Desktop treemap */}
      <div className="hidden md:block">
        <div
          ref={canvasRef}
          className="relative w-full overflow-hidden rounded-xl border border-border-secondary bg-bg-tertiary/40"
          style={{ height: "min(60vh, 520px)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pathStack.join("/") || "__root__"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.22 }}
              className="absolute inset-0"
            >
              {tiles.map((tile, i) => (
                <TreemapTile
                  key={tile.node.id}
                  tile={tile}
                  index={i}
                  hovered={hover?.id === tile.node.id}
                  selected={selected?.id === tile.node.id}
                  onHover={setHover}
                  onSelect={drillInto}
                  reduceMotion={!!reduceMotion}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <HoverHint hovered={hover} />
      </div>

      {/* Mobile stacked list */}
      <div className="md:hidden">
        <MobileList
          nodes={children}
          selected={selected}
          onDrill={drillInto}
          onSelect={(node) => setSelected(node)}
          onClear={() => setSelected(null)}
        />
      </div>

      <AnimatePresence mode="wait">
        {selected ? (
          <InfoBox
            key={selected.id}
            node={selected}
            onClose={() => setSelected(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function Legend() {
  return (
    <ul
      role="list"
      className="mt-3 mb-6 flex flex-wrap gap-x-4 gap-y-2 text-mono text-[11px] uppercase tracking-[0.16em] text-fg-tertiary"
    >
      {CATEGORY_ORDER.map((key) => {
        const meta = CATEGORY_META[key];
        return (
          <li key={key} className="flex items-center gap-2">
            <span
              className="block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: meta.stroke }}
              aria-hidden
            />
            <span>{meta.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

interface BreadcrumbProps {
  segments: { id: string; label: string }[];
  onJump: (index: number) => void;
  onBack: () => void;
  canGoBack: boolean;
}

function Breadcrumb({ segments, onJump, onBack, canGoBack }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Architecture path"
      className="mb-3 flex items-center gap-2 text-mono text-[12px] tracking-wide text-fg-tertiary"
    >
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border-secondary text-fg-secondary transition hover:border-border-primary hover:text-fg-primary disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Back one level"
      >
        <ChevronLeft size={14} aria-hidden />
      </button>
      <ol className="flex flex-wrap items-center gap-1.5">
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1;
          return (
            <li key={`${segment.id}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight
                  size={12}
                  className="text-fg-tertiary/60"
                  aria-hidden
                />
              )}
              {isLast ? (
                <span className="text-fg-primary">{segment.label}</span>
              ) : (
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  className="text-fg-tertiary transition hover:text-fg-primary"
                >
                  {segment.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface TreemapTileProps {
  tile: Tile;
  index: number;
  hovered: boolean;
  selected: boolean;
  onHover: (node: ArchNode | null) => void;
  onSelect: (node: ArchNode) => void;
  reduceMotion: boolean;
}

function TreemapTile({
  tile,
  index,
  hovered,
  selected,
  onHover,
  onSelect,
  reduceMotion,
}: TreemapTileProps) {
  const meta = CATEGORY_META[tile.node.category];
  const isLeaf = !tile.node.children?.length;
  const totalFiles = totalDescendantFiles(tile.node);

  const minSide = Math.min(tile.w, tile.h);
  const showLabel = minSide >= 56;
  const showCount = minSide >= 80;

  const style: CSSProperties = {
    left: tile.x,
    top: tile.y,
    width: Math.max(tile.w - 4, 0),
    height: Math.max(tile.h - 4, 0),
    backgroundColor: meta.fill,
    borderColor: hovered || selected ? meta.text : meta.stroke,
    color: meta.text,
  };

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.32, delay: Math.min(index * 0.018, 0.18), ease: [0.16, 1, 0.3, 1] }
      }
      onMouseEnter={() => onHover(tile.node)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(tile.node)}
      onBlur={() => onHover(null)}
      onClick={() => onSelect(tile.node)}
      aria-label={`${tile.node.name}, ${totalFiles} ${totalFiles === 1 ? "file" : "files"}, ${meta.label}${
        isLeaf ? "" : `, contains ${tile.node.children?.length} items`
      }`}
      style={style}
      className="group absolute m-0.5 flex flex-col justify-between overflow-hidden rounded-md border p-3 text-left transition-[border-color,box-shadow,filter] duration-200 hover:brightness-110 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-aperol) focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
    >
      {showLabel ? (
        <>
          <div className="text-mono text-[12px] font-semibold leading-tight">
            {tile.node.name}
          </div>
          {showCount ? (
            <div className="text-mono text-[10px] uppercase tracking-[0.14em] opacity-70">
              {totalFiles} {totalFiles === 1 ? "file" : "files"}
            </div>
          ) : null}
        </>
      ) : (
        <span className="sr-only">{tile.node.name}</span>
      )}
    </motion.button>
  );
}

function HoverHint({ hovered }: { hovered: ArchNode | null }) {
  return (
    <div className="mt-3 min-h-[2.25rem] text-body text-sm text-fg-tertiary">
      <AnimatePresence mode="wait">
        {hovered ? (
          <motion.div
            key={hovered.id}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.18 }}
            className="flex flex-wrap items-center gap-x-2 gap-y-1"
          >
            <span
              className="block h-2 w-2 rounded-full"
              style={{ backgroundColor: CATEGORY_META[hovered.category].stroke }}
              aria-hidden
            />
            <span className="text-mono text-[11px] uppercase tracking-[0.16em] text-fg-tertiary">
              {CATEGORY_META[hovered.category].label}
            </span>
            <span className="text-fg-secondary">{hovered.name}</span>
            {hovered.description ? (
              <span className="text-fg-tertiary">— {hovered.description}</span>
            ) : null}
          </motion.div>
        ) : (
          <motion.span
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="text-fg-tertiary/60"
          >
            Hover a tile to peek inside, click to drill down.
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MobileListProps {
  nodes: ArchNode[];
  selected: ArchNode | null;
  onDrill: (node: ArchNode) => void;
  onSelect: (node: ArchNode) => void;
  onClear: () => void;
}

function MobileList({
  nodes,
  selected,
  onDrill,
  onSelect,
  onClear,
}: MobileListProps) {
  return (
    <ul role="list" className="space-y-2">
      {nodes.map((node) => {
        const meta = CATEGORY_META[node.category];
        const isLeaf = !node.children?.length;
        const totalFiles = totalDescendantFiles(node);
        const isExpanded = isLeaf && selected?.id === node.id;

        const handleTap = () => {
          if (isLeaf) {
            if (isExpanded) onClear();
            else onSelect(node);
          } else {
            onDrill(node);
          }
        };

        return (
          <li
            key={node.id}
            className="overflow-hidden rounded-lg border border-border-secondary bg-bg-tertiary/40"
          >
            <button
              type="button"
              onClick={handleTap}
              className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-bg-tertiary/70"
              aria-expanded={isLeaf ? isExpanded : undefined}
            >
              <span
                aria-hidden
                className="block h-9 w-1 rounded-full"
                style={{ backgroundColor: meta.stroke }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-mono text-sm text-fg-primary truncate">
                  {node.name}
                </div>
                <div className="text-mono text-[10px] uppercase tracking-[0.16em] text-fg-tertiary">
                  {meta.label} · {totalFiles}{" "}
                  {totalFiles === 1 ? "file" : "files"}
                </div>
              </div>
              <ChevronRight
                size={14}
                className="text-fg-tertiary"
                aria-hidden
              />
            </button>

            <AnimatePresence initial={false}>
              {isLeaf && isExpanded && node.description ? (
                <motion.div
                  key="content"
                  variants={accordionContent}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="overflow-hidden"
                >
                  <div className="border-t border-border-secondary px-4 py-3">
                    <p className="text-body text-sm text-fg-secondary">
                      {node.description}
                    </p>
                    {node.githubUrl ? (
                      <a
                        href={node.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-mono text-xs text-(--color-aperol) hover:underline"
                      >
                        View on GitHub
                        <ExternalLink size={12} aria-hidden />
                      </a>
                    ) : null}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

interface InfoBoxProps {
  node: ArchNode;
  onClose: () => void;
}

function InfoBox({ node, onClose }: InfoBoxProps) {
  const meta = CATEGORY_META[node.category];
  const totalFiles = totalDescendantFiles(node);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={smoothTransition}
      className="mt-6 hidden rounded-xl border border-border-secondary bg-bg-tertiary/60 p-5 md:block"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-mono text-[10px] uppercase tracking-[0.18em] text-fg-tertiary">
            <span
              className="block h-2 w-2 rounded-full"
              style={{ backgroundColor: meta.stroke }}
              aria-hidden
            />
            {meta.label}
            <span className="text-fg-tertiary/40">·</span>
            <span>
              {totalFiles} {totalFiles === 1 ? "file" : "files"}
            </span>
          </div>
          <h4 className="mt-2 text-display text-xl text-fg-primary">
            {node.name}
          </h4>
          {node.description ? (
            <p className="mt-2 text-body text-sm text-fg-secondary">
              {node.description}
            </p>
          ) : null}
          {node.githubUrl ? (
            <a
              href={node.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-mono text-xs text-(--color-aperol) hover:underline"
            >
              View on GitHub
              <ExternalLink size={12} aria-hidden />
            </a>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-secondary text-fg-tertiary transition hover:border-border-primary hover:text-fg-primary"
        >
          <X size={14} aria-hidden />
        </button>
      </div>
    </motion.div>
  );
}
