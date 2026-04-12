"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
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
// Constants
// ---------------------------------------------------------------------------

const BOX_HEIGHT = 1.8;
const BOX_Y = -0.4;
const BOX_GAP = 0.15;
const WORKTREE_Y = 2.2;
const WAVE_GAP = 0.7;

const COLORS = {
  boxBorder: "#363230",
  boxFill: "#1c1a17",
  nodeMuted: "#57534e",
  nodeResearch: "#a8a29e",
  nodeBrief: "#78716c",
  brandOrange: "#fe5102",
  brandGlow: "#ff7a38",
  fg: "#fffaee",
  fgSecondary: "#a8a29e",
  fgTertiary: "#78716c",
  bgPrimary: "#000000",
  bgSecondary: "#191919",
  borderSecondary: "#363230",
  worktreeWave1: "#fe5102",
  worktreeWave2: "#ff7a38",
};

// ---------------------------------------------------------------------------
// Node data generators
// ---------------------------------------------------------------------------

function makeResearchNodes(): NodeDef[] {
  const types = [
    "findings.md",
    "summary.md",
    "internal/structure",
    "internal/patterns",
    "external/best-practices",
    "external/libraries",
    "internal/dependencies",
    "external/references",
    "conventions",
    "internal/errors",
  ];

  return types.map((label, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    return {
      id: `research-${i}`,
      label,
      baseX: -3.2 + col * 0.55,
      baseY: BOX_Y + 0.45 - row * 0.55,
      radius: 0.12 + Math.random() * 0.06,
      color: i < 2 ? COLORS.nodeResearch : COLORS.nodeMuted,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      speedX: 0.3 + Math.random() * 0.4,
      speedY: 0.4 + Math.random() * 0.3,
      ampX: 0.04 + Math.random() * 0.06,
      ampY: 0.04 + Math.random() * 0.06,
      delay: i * 0.08,
    };
  });
}

function makePRDNode(): NodeDef {
  return {
    id: "prd-0",
    label: "PRD",
    baseX: -0.9,
    baseY: BOX_Y,
    radius: 0.28,
    color: COLORS.brandOrange,
    emissive: COLORS.brandOrange,
    emissiveIntensity: 0.6,
    phaseX: 1.2,
    phaseY: 0.8,
    speedX: 0.25,
    speedY: 0.3,
    ampX: 0.03,
    ampY: 0.03,
    delay: 0,
  };
}

function makeBriefNodes(): NodeDef[] {
  const tasks = [
    "T001",
    "T002",
    "T005",
    "T006",
    "T010",
    "T011",
    "T016",
    "T020",
    "T003",
    "T007",
  ];

  return tasks.map((label, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    return {
      id: `brief-${i}`,
      label,
      baseX: 0.3 + col * 0.55,
      baseY: BOX_Y + 0.35 - row * 0.55,
      radius: 0.1 + Math.random() * 0.04,
      color: COLORS.nodeBrief,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      speedX: 0.35 + Math.random() * 0.35,
      speedY: 0.35 + Math.random() * 0.35,
      ampX: 0.03 + Math.random() * 0.05,
      ampY: 0.03 + Math.random() * 0.05,
      delay: i * 0.06,
    };
  });
}

const RESEARCH_NODES = makeResearchNodes();
const PRD_NODE = makePRDNode();
const BRIEF_NODES = makeBriefNodes();

// Box definitions per stage
const BOXES: BoxDef[][] = [
  // Stage 0: Research only
  [{ x: -3.5, y: BOX_Y, width: 2.6, height: BOX_HEIGHT, label: "Research" }],
  // Stage 1: Research + PRD
  [
    { x: -3.5, y: BOX_Y, width: 2.6, height: BOX_HEIGHT, label: "Research" },
    { x: -3.5 + 2.6 + BOX_GAP, y: BOX_Y, width: 1.2, height: BOX_HEIGHT, label: "PRD" },
  ],
  // Stage 2: Research + PRD + Briefs
  [
    { x: -3.5, y: BOX_Y, width: 2.6, height: BOX_HEIGHT, label: "Research" },
    { x: -3.5 + 2.6 + BOX_GAP, y: BOX_Y, width: 1.2, height: BOX_HEIGHT, label: "PRD" },
    {
      x: -3.5 + 2.6 + BOX_GAP + 1.2 + BOX_GAP,
      y: BOX_Y,
      width: 3.0,
      height: BOX_HEIGHT,
      label: "Task Briefs",
    },
  ],
  // Stage 3: Same boxes + worktrees above
  [
    { x: -3.5, y: BOX_Y, width: 2.6, height: BOX_HEIGHT, label: "Research" },
    { x: -3.5 + 2.6 + BOX_GAP, y: BOX_Y, width: 1.2, height: BOX_HEIGHT, label: "PRD" },
    {
      x: -3.5 + 2.6 + BOX_GAP + 1.2 + BOX_GAP,
      y: BOX_Y,
      width: 3.0,
      height: BOX_HEIGHT,
      label: "Task Briefs",
    },
  ],
];

const WORKTREES: WorktreeDef[] = [
  { id: "wt-t001", label: "T001", x: -2.8, wave: 1, targetX: -3.2, targetBoxIndex: 0 },
  { id: "wt-t002", label: "T002", x: -1.8, wave: 1, targetX: -2.5, targetBoxIndex: 0 },
  { id: "wt-t005", label: "T005", x: -0.8, wave: 1, targetX: -0.9, targetBoxIndex: 1 },
  { id: "wt-t006", label: "T006", x: 0.6, wave: 2, targetX: 0.5, targetBoxIndex: 2 },
  { id: "wt-t010", label: "T010", x: 1.6, wave: 2, targetX: 1.6, targetBoxIndex: 2 },
  { id: "wt-t011", label: "T011", x: 2.6, wave: 2, targetX: 2.7, targetBoxIndex: 2 },
];

// ---------------------------------------------------------------------------
// Floating Node component
// ---------------------------------------------------------------------------

function FloatingNode({
  node,
  visible,
  stageDelay,
}: {
  node: NodeDef;
  visible: boolean;
  stageDelay: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
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
        // Spring-in scale
        const springT = Math.min((elapsed - totalDelay) * 3, 1);
        const spring = 1 - Math.pow(1 - springT, 3);
        scaleRef.current = spring;

        if (springT >= 1 && !appeared) setAppeared(true);

        // Float
        const ft = elapsed - totalDelay;
        meshRef.current.position.x =
          node.baseX + Math.sin(ft * node.speedX + node.phaseX) * node.ampX;
        meshRef.current.position.y =
          node.baseY + Math.sin(ft * node.speedY + node.phaseY) * node.ampY;
      }
    } else {
      scaleRef.current *= 0.9;
    }

    const s = scaleRef.current;
    meshRef.current.scale.set(s, s, s);
  });

  const handlePointerOver = useCallback(() => {
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
      position={[node.baseX, node.baseY, 0.1]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[node.radius, 24, 24]} />
      <meshStandardMaterial
        color={hovered ? COLORS.brandGlow : node.color}
        emissive={node.emissive || node.color}
        emissiveIntensity={
          hovered
            ? (node.emissiveIntensity || 0.1) * 2
            : node.emissiveIntensity || 0.1
        }
        roughness={0.6}
        metalness={0.1}
      />
      {hovered && appeared && (
        <Html
          center
          distanceFactor={10}
          style={{ pointerEvents: "none" }}
        >
          <div className="px-2.5 py-1.5 rounded-md bg-bg-primary border border-border-secondary text-fg-primary text-xs font-mono whitespace-nowrap shadow-lg">
            {node.label}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Context Box component
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
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const scaleRef = useRef({ x: 0, opacity: 0 });
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (visible) {
      startTime.current = null;
    }
  }, [visible]);

  const geometry = useMemo(
    () => new THREE.BoxGeometry(box.width, box.height, 0.02),
    [box.width, box.height]
  );

  const edgesGeometry = useMemo(
    () => new THREE.EdgesGeometry(geometry),
    [geometry]
  );

  useFrame((state) => {
    if (!meshRef.current || !edgesRef.current) return;
    const t = state.clock.elapsedTime;

    if (visible) {
      if (startTime.current === null) startTime.current = t;
      const elapsed = t - startTime.current;

      if (elapsed > delay) {
        const progress = Math.min((elapsed - delay) * 2, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        scaleRef.current.x = eased;
        scaleRef.current.opacity = eased;
      }
    } else {
      scaleRef.current.x *= 0.92;
      scaleRef.current.opacity *= 0.92;
    }

    meshRef.current.scale.x = scaleRef.current.x;
    (meshRef.current.material as THREE.MeshStandardMaterial).opacity =
      scaleRef.current.opacity * 0.3;
    (edgesRef.current.material as THREE.LineBasicMaterial).opacity =
      scaleRef.current.opacity * 0.6;
  });

  const centerX = box.x + box.width / 2;
  const centerY = box.y;

  return (
    <group position={[centerX, centerY, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color={COLORS.boxFill}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial
          color={COLORS.boxBorder}
          transparent
          opacity={0}
        />
      </lineSegments>
      {/* Box label */}
      <Html
        position={[0, -box.height / 2 - 0.25, 0]}
        center
        style={{
          pointerEvents: "none",
          opacity: scaleRef.current.opacity,
        }}
      >
        <span
          className="text-fg-tertiary text-[10px] uppercase tracking-wider whitespace-nowrap"
          style={{ fontFamily: "var(--font-accent)" }}
        >
          {box.label}
        </span>
      </Html>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Worktree pill + connection line
// ---------------------------------------------------------------------------

function WorktreePill({
  wt,
  visible,
  delay,
}: {
  wt: WorktreeDef;
  visible: boolean;
  delay: number;
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
      const p = Math.min((elapsed - delay) * 1.5, 1);
      setProgress(1 - Math.pow(1 - p, 3));
    }
  });

  const pillY = WORKTREE_Y - (wt.wave - 1) * WAVE_GAP;
  const lineEndY = BOX_Y + BOX_HEIGHT / 2;

  if (progress < 0.01) return null;

  const linePoints: [number, number, number][] = [
    [wt.x, pillY - 0.2, 0],
    [wt.targetX, lineEndY, 0],
  ];

  return (
    <group>
      {/* Pill label */}
      <Html position={[wt.x, pillY, 0]} center style={{ pointerEvents: "none" }}>
        <div
          className="px-2 py-0.5 rounded border text-[10px] font-mono whitespace-nowrap"
          style={{
            opacity: progress,
            backgroundColor: wt.wave === 1 ? "rgba(254, 81, 2, 0.15)" : "rgba(255, 122, 56, 0.12)",
            borderColor: wt.wave === 1 ? "rgba(254, 81, 2, 0.4)" : "rgba(255, 122, 56, 0.3)",
            color: wt.wave === 1 ? COLORS.brandOrange : COLORS.brandGlow,
          }}
        >
          {wt.label}
        </div>
      </Html>

      {/* Connection line */}
      <Line
        points={linePoints}
        color={wt.wave === 1 ? COLORS.brandOrange : COLORS.brandGlow}
        lineWidth={1}
        opacity={progress * 0.35}
        transparent
        dashed
        dashSize={0.1}
        gapSize={0.08}
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Wave label
// ---------------------------------------------------------------------------

function WaveLabel({
  wave,
  y,
  visible,
  delay,
}: {
  wave: number;
  y: number;
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
      setOpacity(Math.min((elapsed - delay) * 2, 1));
    }
  });

  if (opacity < 0.01) return null;

  return (
    <Html position={[-4.5, y, 0]} style={{ pointerEvents: "none" }}>
      <span
        className="text-fg-tertiary text-[9px] uppercase tracking-wider whitespace-nowrap"
        style={{ fontFamily: "var(--font-accent)", opacity }}
      >
        Wave {wave}
      </span>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Main Scene
// ---------------------------------------------------------------------------

function Scene({ activeStage }: { activeStage: number }) {
  const { viewport } = useThree();
  const boxes = BOXES[Math.min(activeStage, 3)];

  // Determine scale based on viewport width
  const scale = useMemo(() => {
    if (viewport.width < 6) return 0.55;
    if (viewport.width < 9) return 0.7;
    return 0.85;
  }, [viewport.width]);

  return (
    <group scale={[scale, scale, scale]}>
      {/* Ambient light for the scene */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 5]} intensity={0.4} />

      {/* Context boxes */}
      {boxes.map((box, i) => (
        <ContextBox
          key={`${box.label}-${i}`}
          box={box}
          visible
          delay={i === 0 ? 0 : i * 0.3}
        />
      ))}

      {/* Research nodes — always visible once stage >= 0 */}
      {RESEARCH_NODES.map((node) => (
        <FloatingNode
          key={node.id}
          node={node}
          visible={activeStage >= 0}
          stageDelay={0.3}
        />
      ))}

      {/* PRD node — visible from stage 1 */}
      <FloatingNode
        node={PRD_NODE}
        visible={activeStage >= 1}
        stageDelay={0.4}
      />

      {/* Brief nodes — visible from stage 2 */}
      {BRIEF_NODES.map((node) => (
        <FloatingNode
          key={node.id}
          node={node}
          visible={activeStage >= 2}
          stageDelay={0.3}
        />
      ))}

      {/* Worktree labels and connections — stage 3 only */}
      <WaveLabel wave={1} y={WORKTREE_Y} visible={activeStage >= 3} delay={0.2} />
      <WaveLabel wave={2} y={WORKTREE_Y - WAVE_GAP} visible={activeStage >= 3} delay={0.5} />

      {WORKTREES.map((wt, i) => (
        <WorktreePill
          key={wt.id}
          wt={wt}
          visible={activeStage >= 3}
          delay={0.3 + i * 0.1}
        />
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Exported Canvas wrapper
// ---------------------------------------------------------------------------

interface ContextMultiplicationCanvasProps {
  activeStage: number;
}

export function ContextMultiplicationCanvas({
  activeStage,
}: ContextMultiplicationCanvasProps) {
  return (
    <div className="w-full border-b border-border-secondary" style={{ height: "clamp(220px, 30vw, 340px)" }}>
      <Canvas
        orthographic
        camera={{ zoom: 60, position: [0, 0.5, 10], near: 0.1, far: 100 }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene activeStage={activeStage} />
      </Canvas>
    </div>
  );
}
