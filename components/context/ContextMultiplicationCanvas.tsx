"use client";

import {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, QuadraticBezierLine } from "@react-three/drei";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NodeDef {
  id: string;
  label: string;
  baseX: number;
  baseY: number;
  radius: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  phaseX: number;
  phaseY: number;
  speedX: number;
  speedY: number;
  ampX: number;
  ampY: number;
  delay: number;
}

interface BoxDef {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

interface WorktreeDef {
  id: string;
  label: string;
  x: number;
  wave: number;
  targetX: number;
  targetBoxIndex: number;
}

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const BOX_SIZE = 2.0; // square boxes
const BOX_Y = -0.6;
const BOX_GAP = 0.12;
const WORKTREE_Y = 2.0;

const COLORS = {
  boxBorder: "#44403a",
  boxFill: "#1c1a17",
  nodeMuted: "#a8a29e",
  nodeResearch: "#d6d3d1",
  brandOrange: "#fe5102",
  brandGlow: "#ff7a38",
  taskNode: "#ff7a38",
};

// ---------------------------------------------------------------------------
// Stable node data (generated once via useMemo in Scene)
// ---------------------------------------------------------------------------

function makeResearchNodes(): NodeDef[] {
  const types = [
    "findings.md",
    "summary.md",
    "patterns.md",
    "anti-patterns.md",
    "architecture.md",
    "conventions.md",
    "external/APIs",
    "external/docs",
    "internal/deps",
  ];
  // Deterministic "random" using index
  return types.map((label, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const seed = i * 137.5;
    return {
      id: `r-${i}`,
      label,
      baseX: -0.55 + col * 0.55,
      baseY: 0.5 - row * 0.5,
      radius: 0.11 + (seed % 7) * 0.01,
      color: i < 3 ? COLORS.nodeResearch : COLORS.nodeMuted,
      phaseX: (seed % 6.28),
      phaseY: ((seed * 1.3) % 6.28),
      speedX: 0.4 + (seed % 3) * 0.1,
      speedY: 0.5 + (seed % 4) * 0.08,
      ampX: 0.06 + (seed % 5) * 0.008,
      ampY: 0.06 + (seed % 3) * 0.01,
      delay: i * 0.07,
    };
  });
}

function makePRDNode(): NodeDef {
  return {
    id: "prd-0",
    label: "PRD",
    baseX: 0,
    baseY: 0,
    radius: 0.38,
    color: COLORS.brandOrange,
    emissive: COLORS.brandOrange,
    emissiveIntensity: 0.8,
    phaseX: 1.2,
    phaseY: 0.8,
    speedX: 0.2,
    speedY: 0.25,
    ampX: 0.02,
    ampY: 0.02,
    delay: 0,
  };
}

function makeTaskNodes(): NodeDef[] {
  const tasks = [
    "T001", "T002", "T005", "T006",
    "T010", "T011", "T016", "T020",
    "T003", "T007", "T012", "T015",
  ];
  return tasks.map((label, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const seed = (i + 10) * 97.3;
    return {
      id: `t-${i}`,
      label,
      baseX: -0.7 + col * 0.47,
      baseY: 0.45 - row * 0.45,
      radius: 0.09 + (seed % 5) * 0.008,
      color: COLORS.taskNode,
      emissive: COLORS.brandOrange,
      emissiveIntensity: 0.25,
      phaseX: (seed % 6.28),
      phaseY: ((seed * 1.7) % 6.28),
      speedX: 0.45 + (seed % 3) * 0.12,
      speedY: 0.35 + (seed % 4) * 0.1,
      ampX: 0.05 + (seed % 4) * 0.008,
      ampY: 0.05 + (seed % 3) * 0.01,
      delay: i * 0.05,
    };
  });
}

// ---------------------------------------------------------------------------
// Box layout calculator — centers all boxes in the scene
// ---------------------------------------------------------------------------

function getBoxLayout(stage: number): BoxDef[] {
  if (stage === 0) {
    return [
      { x: -BOX_SIZE / 2, y: BOX_Y, width: BOX_SIZE, height: BOX_SIZE, label: "RESEARCH" },
    ];
  }
  if (stage === 1) {
    const total = BOX_SIZE * 2 + BOX_GAP;
    const startX = -total / 2;
    return [
      { x: startX, y: BOX_Y, width: BOX_SIZE, height: BOX_SIZE, label: "RESEARCH" },
      { x: startX + BOX_SIZE + BOX_GAP, y: BOX_Y, width: BOX_SIZE, height: BOX_SIZE, label: "PRD" },
    ];
  }
  // stages 2 and 3
  const total = BOX_SIZE * 3 + BOX_GAP * 2;
  const startX = -total / 2;
  return [
    { x: startX, y: BOX_Y, width: BOX_SIZE, height: BOX_SIZE, label: "RESEARCH" },
    { x: startX + BOX_SIZE + BOX_GAP, y: BOX_Y, width: BOX_SIZE, height: BOX_SIZE, label: "PRD" },
    { x: startX + (BOX_SIZE + BOX_GAP) * 2, y: BOX_Y, width: BOX_SIZE, height: BOX_SIZE, label: "PRD TASKS" },
  ];
}

// Worktree definitions
const WORKTREES: WorktreeDef[] = [
  { id: "wt-1a", label: "worktree 1a", x: -2.2, wave: 1, targetX: -2.2, targetBoxIndex: 0 },
  { id: "wt-1b", label: "worktree 1b", x: -0.7, wave: 1, targetX: -0.7, targetBoxIndex: 0 },
  { id: "wt-1c", label: "worktree 1c", x: 0.7, wave: 1, targetX: 0, targetBoxIndex: 1 },
  { id: "wt-1d", label: "worktree 1d", x: 2.2, wave: 1, targetX: 2.2, targetBoxIndex: 2 },
];

// ---------------------------------------------------------------------------
// Floating Node
// ---------------------------------------------------------------------------

function FloatingNode({
  node,
  visible,
  stageDelay,
  containerCenter,
}: {
  node: NodeDef;
  visible: boolean;
  stageDelay: number;
  containerCenter: [number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const [appeared, setAppeared] = useState(false);
  const scaleRef = useRef(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (visible) {
      startTime.current = null;
      setAppeared(false);
    } else {
      scaleRef.current = 0;
      setAppeared(false);
      startTime.current = null;
    }
  }, [visible]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    if (visible) {
      if (startTime.current === null) startTime.current = t;
      const elapsed = t - startTime.current;
      const totalDelay = stageDelay + node.delay;

      if (elapsed > totalDelay) {
        const springT = Math.min((elapsed - totalDelay) * 3, 1);
        scaleRef.current = 1 - Math.pow(1 - springT, 3);
        if (springT >= 1 && !appeared) setAppeared(true);

        const ft = elapsed - totalDelay;
        meshRef.current.position.x =
          containerCenter[0] + node.baseX + Math.sin(ft * node.speedX + node.phaseX) * node.ampX;
        meshRef.current.position.y =
          containerCenter[1] + node.baseY + Math.sin(ft * node.speedY + node.phaseY) * node.ampY;
      }
    } else {
      scaleRef.current *= 0.88;
    }

    const s = scaleRef.current;
    meshRef.current.scale.set(s, s, s);

    // Pulse for PRD orb
    if (node.emissiveIntensity && node.emissiveIntensity > 0.5 && materialRef.current) {
      const pulse = 0.6 + Math.sin(t * 1.5) * 0.3;
      materialRef.current.emissiveIntensity = hovered ? 1.2 : pulse;
    }
  });

  const handlePointerOver = useCallback((e: THREE.Event) => {
    (e as unknown as { stopPropagation: () => void }).stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "auto";
  }, []);

  if (!visible && scaleRef.current < 0.01) return null;

  return (
    <mesh
      ref={meshRef}
      position={[containerCenter[0] + node.baseX, containerCenter[1] + node.baseY, 0.1]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <circleGeometry args={[node.radius, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color={hovered ? COLORS.brandGlow : node.color}
        emissive={node.emissive || "#000000"}
        emissiveIntensity={node.emissiveIntensity || 0}
        toneMapped={false}
      />
      {hovered && appeared && (
        <Html
          center
          position={[0, node.radius + 0.2, 0]}
          style={{ pointerEvents: "none", zIndex: 50 }}
        >
          <div
            className="px-2.5 py-1.5 rounded-md text-xs font-mono whitespace-nowrap shadow-lg"
            style={{
              background: "#000000",
              border: "1px solid #44403a",
              color: "#fffaee",
            }}
          >
            {node.label}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Context Box (2D rectangle with edges)
// ---------------------------------------------------------------------------

function ContextBox({
  box,
  visible,
  delay,
}: {
  box: BoxDef;
  visible: boolean;
  delay: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const progressRef = useRef(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (visible) startTime.current = null;
  }, [visible]);

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(box.width, box.height),
    [box.width, box.height]
  );

  const edgesGeometry = useMemo(() => {
    const boxGeo = new THREE.BoxGeometry(box.width, box.height, 0.001);
    return new THREE.EdgesGeometry(boxGeo);
  }, [box.width, box.height]);

  useFrame((state) => {
    if (!meshRef.current || !edgesRef.current || !groupRef.current) return;
    const t = state.clock.elapsedTime;

    if (visible) {
      if (startTime.current === null) startTime.current = t;
      const elapsed = t - startTime.current;
      if (elapsed > delay) {
        const p = Math.min((elapsed - delay) * 2.5, 1);
        progressRef.current = 1 - Math.pow(1 - p, 3);
      }
    } else {
      progressRef.current *= 0.9;
    }

    const p = progressRef.current;
    groupRef.current.scale.set(p, p, 1);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = p * 0.15;
    (edgesRef.current.material as THREE.LineBasicMaterial).opacity = p * 0.7;
  });

  const cx = box.x + box.width / 2;
  const cy = box.y;

  return (
    <group ref={groupRef} position={[cx, cy, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial
          color={COLORS.boxFill}
          transparent
          opacity={0}
        />
      </mesh>
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial
          color={COLORS.boxBorder}
          transparent
          opacity={0}
        />
      </lineSegments>
      <Html
        position={[0, -box.height / 2 - 0.22, 0]}
        center
        style={{ pointerEvents: "none" }}
      >
        <span
          style={{
            fontFamily: "var(--font-accent)",
            fontSize: "9px",
            color: "#78716c",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            opacity: progressRef.current,
          }}
        >
          {box.label}
        </span>
      </Html>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Worktree connection with curved line
// ---------------------------------------------------------------------------

function WorktreeConnection({
  wt,
  visible,
  delay,
  boxLayout,
}: {
  wt: WorktreeDef;
  visible: boolean;
  delay: number;
  boxLayout: BoxDef[];
}) {
  const [progress, setProgress] = useState(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (visible) {
      startTime.current = null;
      setProgress(0);
    } else {
      setProgress(0);
      startTime.current = null;
    }
  }, [visible]);

  useFrame((state) => {
    if (!visible) return;
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;
    if (elapsed > delay) {
      const p = Math.min((elapsed - delay) * 1.8, 1);
      setProgress(1 - Math.pow(1 - p, 3));
    }
  });

  if (progress < 0.01) return null;

  const pillY = WORKTREE_Y;
  const targetBox = boxLayout[wt.targetBoxIndex];
  if (!targetBox) return null;

  const lineEndY = targetBox.y + targetBox.height / 2;
  const midX = (wt.x + wt.targetX) / 2;
  const midY = (pillY - 0.3 + lineEndY) / 2;

  return (
    <group>
      {/* Pill */}
      <Html position={[wt.x, pillY, 0]} center style={{ pointerEvents: "none" }}>
        <div
          style={{
            opacity: progress,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: "11px", color: "#78716c" }}>&#9095;</span>
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "10px",
              color: "#a8a29e",
            }}
          >
            {wt.label}
          </span>
        </div>
      </Html>

      {/* Curved connection */}
      <QuadraticBezierLine
        start={[wt.x, pillY - 0.25, 0] as unknown as THREE.Vector3}
        end={[wt.targetX, lineEndY, 0] as unknown as THREE.Vector3}
        mid={[midX, midY, 0] as unknown as THREE.Vector3}
        color={COLORS.brandOrange}
        lineWidth={1}
        transparent
        opacity={progress * 0.4}
        dashed
        dashScale={15}
        dashSize={1}
        gapSize={1}
      />

      {/* Arrow head dot */}
      <mesh position={[wt.targetX, lineEndY, 0.05]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial
          color={COLORS.brandOrange}
          transparent
          opacity={progress * 0.5}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Wave label
// ---------------------------------------------------------------------------

function WaveLabel({
  visible,
  delay,
}: {
  visible: boolean;
  delay: number;
}) {
  const [opacity, setOpacity] = useState(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (visible) {
      startTime.current = null;
      setOpacity(0);
    } else {
      setOpacity(0);
      startTime.current = null;
    }
  }, [visible]);

  useFrame((state) => {
    if (!visible) return;
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;
    if (elapsed > delay) {
      setOpacity(Math.min((elapsed - delay) * 2.5, 1));
    }
  });

  if (opacity < 0.01) return null;

  return (
    <Html position={[-3.8, WORKTREE_Y, 0]} style={{ pointerEvents: "none" }}>
      <div
        style={{
          opacity,
          padding: "2px 8px",
          border: "1px solid #44403a",
          borderRadius: "4px",
          fontSize: "10px",
          color: "#a8a29e",
          fontFamily: "var(--font-mono, monospace)",
          whiteSpace: "nowrap",
          background: "rgba(28, 26, 23, 0.8)",
        }}
      >
        Wave 1
      </div>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Main Scene
// ---------------------------------------------------------------------------

const RESEARCH_NODES = makeResearchNodes();
const PRD_NODE = makePRDNode();
const TASK_NODES = makeTaskNodes();

function Scene({ activeStage }: { activeStage: number }) {
  const { viewport } = useThree();
  const boxes = useMemo(() => getBoxLayout(activeStage), [activeStage]);

  const scale = useMemo(() => {
    if (viewport.width < 5) return 0.42;
    if (viewport.width < 7) return 0.55;
    if (viewport.width < 10) return 0.7;
    return 0.82;
  }, [viewport.width]);

  // Box centers for positioning nodes inside
  const researchCenter: [number, number] = useMemo(() => {
    const b = boxes[0];
    return [b.x + b.width / 2, b.y];
  }, [boxes]);

  const prdCenter: [number, number] = useMemo(() => {
    if (boxes.length < 2) return [0, 0];
    const b = boxes[1];
    return [b.x + b.width / 2, b.y];
  }, [boxes]);

  const taskCenter: [number, number] = useMemo(() => {
    if (boxes.length < 3) return [0, 0];
    const b = boxes[2];
    return [b.x + b.width / 2, b.y];
  }, [boxes]);

  return (
    <group scale={[scale, scale, scale]} position={[0, 0.2, 0]}>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 2, 5]} intensity={0.3} />

      {/* Context boxes */}
      {boxes.map((box, i) => (
        <ContextBox
          key={`box-${i}-${activeStage}`}
          box={box}
          visible
          delay={i * 0.2}
        />
      ))}

      {/* Research nodes */}
      {RESEARCH_NODES.map((node) => (
        <FloatingNode
          key={node.id}
          node={node}
          visible={activeStage >= 0}
          stageDelay={0.3}
          containerCenter={researchCenter}
        />
      ))}

      {/* PRD orb */}
      {activeStage >= 1 && (
        <FloatingNode
          key="prd"
          node={PRD_NODE}
          visible={activeStage >= 1}
          stageDelay={0.3}
          containerCenter={prdCenter}
        />
      )}

      {/* Task nodes */}
      {activeStage >= 2 &&
        TASK_NODES.map((node) => (
          <FloatingNode
            key={node.id}
            node={node}
            visible={activeStage >= 2}
            stageDelay={0.2}
            containerCenter={taskCenter}
          />
        ))}

      {/* Worktree wave + connections */}
      <WaveLabel visible={activeStage >= 3} delay={0.1} />
      {activeStage >= 3 &&
        WORKTREES.map((wt, i) => (
          <WorktreeConnection
            key={wt.id}
            wt={wt}
            visible={activeStage >= 3}
            delay={0.2 + i * 0.12}
            boxLayout={boxes}
          />
        ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Progress bar (HTML overlay)
// ---------------------------------------------------------------------------

const STAGE_LABELS = ["Research", "PRD", "Task Briefs", "Worktrees"];
const PHASE_DURATION = 3000; // ms per phase
const TOTAL_DURATION = PHASE_DURATION * 4;

function ProgressBar({
  activeStage,
  onStageChange,
  playing,
  onTogglePlay,
}: {
  activeStage: number;
  onStageChange: (stage: number) => void;
  playing: boolean;
  onTogglePlay: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 md:px-6">
      {/* Stage segments */}
      <div className="flex-1 flex gap-1">
        {STAGE_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => onStageChange(i)}
            className="flex-1 group cursor-pointer"
          >
            <div
              className="h-1 rounded-full overflow-hidden transition-all duration-200"
              style={{
                background: i <= activeStage ? "rgba(254, 81, 2, 0.2)" : "rgba(68, 64, 58, 0.5)",
              }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: i < activeStage ? "100%" : i === activeStage ? "100%" : "0%",
                  background: "#fe5102",
                  transition: i === activeStage ? "none" : "width 0.3s ease",
                }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Play/Pause */}
      <button
        onClick={onTogglePlay}
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md border border-border-secondary text-fg-tertiary hover:text-fg-primary hover:border-border-primary transition-colors cursor-pointer"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <rect x="1" y="1" width="3" height="8" rx="0.5" />
            <rect x="6" y="1" width="3" height="8" rx="0.5" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <polygon points="2,1 9,5 2,9" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------

interface ContextMultiplicationCanvasProps {
  activeStage: number;
  onStageChange: (stage: number) => void;
  playing: boolean;
  onTogglePlay: () => void;
}

export function ContextMultiplicationCanvas({
  activeStage,
  onStageChange,
  playing,
  onTogglePlay,
}: ContextMultiplicationCanvasProps) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <ProgressBar
        activeStage={activeStage}
        onStageChange={onStageChange}
        playing={playing}
        onTogglePlay={onTogglePlay}
      />

      {/* Three.js canvas */}
      <div
        className="w-full border-b border-border-secondary"
        style={{ height: "clamp(240px, 32vw, 380px)" }}
      >
        <Canvas
          orthographic
          camera={{ zoom: 60, position: [0, 0.3, 10], near: 0.1, far: 100 }}
          dpr={[1, 2]}
          style={{ background: "transparent" }}
          gl={{ antialias: true, alpha: true }}
          onPointerMissed={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <Scene activeStage={activeStage} />
        </Canvas>
      </div>
    </div>
  );
}
