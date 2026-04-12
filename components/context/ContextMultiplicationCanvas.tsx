"use client";

import {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
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
  isPRD?: boolean;
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
  pillX: number;
  targetX: number;
  targetBoxIndex: number;
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

const BOX_SIZE = 2.0;
const BOX_Y = -0.5;
const BOX_GAP = 0.14;
const WT_ROW_Y = 1.8;

const C = {
  boxBorder: "#44403a",
  boxFill: "#0d0d0d",
  nodeLight: "#d6d3d1",
  nodeMid: "#a8a29e",
  nodeDim: "#78716c",
  brand: "#fe5102",
  brandGlow: "#ff7a38",
  taskNode: "#ff7a38",
  labelColor: "#78716c",
};

// ---------------------------------------------------------------------------
// Node generators
// ---------------------------------------------------------------------------

function makeResearchNodes(): NodeDef[] {
  const labels = [
    "findings.md", "summary.md", "patterns.md",
    "anti-patterns.md", "architecture.md", "conventions.md",
    "external/APIs", "external/docs", "internal/deps",
  ];
  return labels.map((label, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const s = i * 137.5;
    return {
      id: `r-${i}`,
      label,
      baseX: -0.5 + col * 0.5,
      baseY: 0.45 - row * 0.45,
      radius: 0.12 + (s % 5) * 0.008,
      color: i < 2 ? C.nodeLight : i < 5 ? C.nodeMid : C.nodeDim,
      phaseX: s % 6.28,
      phaseY: (s * 1.3) % 6.28,
      speedX: 0.35 + (s % 3) * 0.1,
      speedY: 0.45 + (s % 4) * 0.08,
      ampX: 0.04 + (s % 5) * 0.006,
      ampY: 0.04 + (s % 3) * 0.008,
      delay: i * 0.06,
    };
  });
}

function makePRDNode(): NodeDef {
  return {
    id: "prd-0",
    label: "PRD",
    baseX: 0,
    baseY: 0,
    radius: 0.42,
    color: C.brand,
    isPRD: true,
    phaseX: 1.2,
    phaseY: 0.8,
    speedX: 0.18,
    speedY: 0.22,
    ampX: 0.015,
    ampY: 0.015,
    delay: 0,
  };
}

function makeTaskNodes(): NodeDef[] {
  const labels = [
    "T001", "T002", "T005", "T006",
    "T010", "T011", "T016", "T020",
    "T003", "T007", "T012", "T015",
  ];
  return labels.map((label, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const s = (i + 10) * 97.3;
    return {
      id: `t-${i}`,
      label,
      baseX: -0.65 + col * 0.43,
      baseY: 0.4 - row * 0.4,
      radius: 0.09 + (s % 5) * 0.006,
      color: C.taskNode,
      phaseX: s % 6.28,
      phaseY: (s * 1.7) % 6.28,
      speedX: 0.4 + (s % 3) * 0.1,
      speedY: 0.35 + (s % 4) * 0.08,
      ampX: 0.04 + (s % 4) * 0.006,
      ampY: 0.04 + (s % 3) * 0.008,
      delay: i * 0.045,
    };
  });
}

// ---------------------------------------------------------------------------
// Box layout — centered
// ---------------------------------------------------------------------------

function getBoxLayout(stage: number): BoxDef[] {
  const s = BOX_SIZE;
  const g = BOX_GAP;

  if (stage === 0) {
    return [{ x: -s / 2, y: BOX_Y, width: s, height: s, label: "RESEARCH" }];
  }
  if (stage === 1) {
    const w = s * 2 + g;
    return [
      { x: -w / 2, y: BOX_Y, width: s, height: s, label: "RESEARCH" },
      { x: -w / 2 + s + g, y: BOX_Y, width: s, height: s, label: "PRD" },
    ];
  }
  const w = s * 3 + g * 2;
  return [
    { x: -w / 2, y: BOX_Y, width: s, height: s, label: "RESEARCH" },
    { x: -w / 2 + s + g, y: BOX_Y, width: s, height: s, label: "PRD" },
    { x: -w / 2 + (s + g) * 2, y: BOX_Y, width: s, height: s, label: "PRD TASKS" },
  ];
}

const WORKTREES: WorktreeDef[] = [
  { id: "wt-1a", label: "worktree 1a", pillX: -2.2, targetX: -2.15, targetBoxIndex: 0 },
  { id: "wt-1b", label: "worktree 1b", pillX: -0.7, targetX: -0.7, targetBoxIndex: 0 },
  { id: "wt-1c", label: "worktree 1c", pillX: 0.7, targetX: 0, targetBoxIndex: 1 },
  { id: "wt-1d", label: "worktree 1d", pillX: 2.2, targetX: 2.15, targetBoxIndex: 2 },
];

// ---------------------------------------------------------------------------
// PRD Gradient Circle (custom shader for radial gradient)
// ---------------------------------------------------------------------------

const prdVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const prdFragmentShader = `
  uniform float uTime;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5);
    float dist = length(vUv - center) * 2.0;

    // Pulsing glow
    float pulse = 0.85 + sin(uTime * 1.8) * 0.15;
    float hoverBoost = uHover * 0.2;

    // Radial gradient: bright center → dim edges
    vec3 coreColor = vec3(1.0, 0.42, 0.08);  // #fe6b14
    vec3 midColor  = vec3(0.996, 0.318, 0.008); // #fe5102
    vec3 edgeColor = vec3(0.7, 0.2, 0.0);

    vec3 color = mix(coreColor, midColor, smoothstep(0.0, 0.5, dist));
    color = mix(color, edgeColor, smoothstep(0.4, 0.9, dist));

    float alpha = (1.0 - smoothstep(0.7, 1.0, dist)) * (pulse + hoverBoost);

    // Soft outer glow
    float glow = exp(-dist * 2.0) * 0.3 * pulse;
    color += vec3(1.0, 0.5, 0.1) * glow;

    gl_FragColor = vec4(color, alpha);
  }
`;

function PRDOrb({
  visible,
  stageDelay,
  containerCenter,
}: {
  visible: boolean;
  stageDelay: number;
  containerCenter: [number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const [appeared, setAppeared] = useState(false);
  const scaleRef = useRef(0);
  const startTime = useRef<number | null>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
    }),
    []
  );

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
    if (!meshRef.current || !materialRef.current) return;
    const t = state.clock.elapsedTime;

    if (visible) {
      if (startTime.current === null) startTime.current = t;
      const elapsed = t - startTime.current;
      if (elapsed > stageDelay) {
        const springT = Math.min((elapsed - stageDelay) * 2.5, 1);
        scaleRef.current = 1 - Math.pow(1 - springT, 3);
        if (springT >= 1 && !appeared) setAppeared(true);
      }
    } else {
      scaleRef.current *= 0.88;
    }

    const s = scaleRef.current;
    meshRef.current.scale.set(s, s, s);
    materialRef.current.uniforms.uTime.value = t;
    materialRef.current.uniforms.uHover.value += (
      (hovered ? 1 : 0) - materialRef.current.uniforms.uHover.value
    ) * 0.1;
  });

  const handlePointerOver = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "auto";
  }, []);

  if (!visible && scaleRef.current < 0.01) return null;

  const r = 0.42;

  return (
    <mesh
      ref={meshRef}
      position={[containerCenter[0], containerCenter[1], 0.1]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <circleGeometry args={[r, 48]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={prdVertexShader}
        fragmentShader={prdFragmentShader}
        uniforms={uniforms}
        transparent
      />
      {hovered && appeared && (
        <Html
          center
          position={[0, r + 0.22, 0]}
          style={{ pointerEvents: "none", zIndex: 50 }}
        >
          <div
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              background: "#000",
              border: "1px solid #44403a",
              color: "#fffaee",
              fontSize: "11px",
              fontFamily: "var(--font-mono, monospace)",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            PRD
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Floating Node (research & task nodes)
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
  });

  const handlePointerOver = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
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
      <meshBasicMaterial
        color={hovered ? C.brandGlow : node.color}
        toneMapped={false}
      />
      {hovered && appeared && (
        <Html
          center
          position={[0, node.radius + 0.18, 0]}
          style={{ pointerEvents: "none", zIndex: 50 }}
        >
          <div
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              background: "#000",
              border: "1px solid #44403a",
              color: "#fffaee",
              fontSize: "11px",
              fontFamily: "var(--font-mono, monospace)",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
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
// Context Box
// ---------------------------------------------------------------------------

function ContextBox({ box, delay }: { box: BoxDef; delay: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const fillRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;
  }, [box.x]);

  const geo = useMemo(() => new THREE.PlaneGeometry(box.width, box.height), [box.width, box.height]);
  const edgeGeo = useMemo(() => {
    const g = new THREE.BoxGeometry(box.width, box.height, 0.001);
    return new THREE.EdgesGeometry(g);
  }, [box.width, box.height]);

  useFrame((state) => {
    if (!groupRef.current || !fillRef.current || !edgesRef.current) return;
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;

    if (elapsed > delay) {
      const p = Math.min((elapsed - delay) * 2.5, 1);
      progressRef.current = 1 - Math.pow(1 - p, 3);
    }

    const p = progressRef.current;
    groupRef.current.scale.set(p, p, 1);
    (fillRef.current.material as THREE.MeshBasicMaterial).opacity = p * 0.12;
    (edgesRef.current.material as THREE.LineBasicMaterial).opacity = p * 0.55;
    if (labelRef.current) labelRef.current.style.opacity = String(p);
  });

  const cx = box.x + box.width / 2;

  return (
    <group ref={groupRef} position={[cx, box.y, 0]}>
      <mesh ref={fillRef} geometry={geo}>
        <meshBasicMaterial color={C.boxFill} transparent opacity={0} />
      </mesh>
      <lineSegments ref={edgesRef} geometry={edgeGeo}>
        <lineBasicMaterial color={C.boxBorder} transparent opacity={0} />
      </lineSegments>
      <Html position={[0, -box.height / 2 - 0.24, 0]} center style={{ pointerEvents: "none" }}>
        <span
          ref={labelRef}
          style={{
            fontFamily: "var(--font-accent)",
            fontSize: "9px",
            color: C.labelColor,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            opacity: 0,
          }}
        >
          {box.label}
        </span>
      </Html>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Worktree connection (clean vertical dashed line + arrow dot)
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
  const lineRef = useRef<THREE.Mesh>(null);
  const dotRef = useRef<THREE.Mesh>(null);
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
      const p = Math.min((elapsed - delay) * 2, 1);
      setProgress(1 - Math.pow(1 - p, 3));
    }
  });

  if (progress < 0.01) return null;

  const box = boxLayout[wt.targetBoxIndex];
  if (!box) return null;

  const topY = WT_ROW_Y - 0.28;
  const bottomY = box.y + box.height / 2;
  const lineHeight = topY - bottomY;
  const midY = (topY + bottomY) / 2;

  // For worktrees that connect to a different X than their pill, we draw a slight curve
  const dx = wt.targetX - wt.pillX;
  const isStraight = Math.abs(dx) < 0.1;

  return (
    <group>
      {/* Pill label */}
      <Html position={[wt.pillX, WT_ROW_Y, 0]} center style={{ pointerEvents: "none" }}>
        <div
          style={{
            opacity: progress,
            display: "flex",
            alignItems: "center",
            gap: "3px",
            whiteSpace: "nowrap",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.5 }}>
            <path d="M8 1v6M5 4l3-3 3 3M3 8v4a2 2 0 002 2h6a2 2 0 002-2V8" stroke={C.brand} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "10px",
              color: C.nodeMid,
              letterSpacing: "0.02em",
            }}
          >
            {wt.label}
          </span>
        </div>
      </Html>

      {isStraight ? (
        /* Straight dashed vertical line */
        <mesh ref={lineRef} position={[wt.pillX, midY, 0]}>
          <planeGeometry args={[0.01, lineHeight * progress]} />
          <meshBasicMaterial color={C.brand} transparent opacity={progress * 0.4} />
        </mesh>
      ) : (
        /* Angled line: pill → target (two segments forming a bend) */
        <>
          {/* Vertical from pill */}
          <mesh position={[wt.pillX, (topY + midY) / 2, 0]}>
            <planeGeometry args={[0.01, (topY - midY) * progress]} />
            <meshBasicMaterial color={C.brand} transparent opacity={progress * 0.35} />
          </mesh>
          {/* Angled segment to target */}
          <mesh position={[(wt.pillX + wt.targetX) / 2, (midY + bottomY) / 2, 0]}
            rotation={[0, 0, Math.atan2(bottomY - midY, wt.targetX - wt.pillX)]}
          >
            <planeGeometry args={[Math.sqrt(dx * dx + (midY - bottomY) ** 2) * progress, 0.01]} />
            <meshBasicMaterial color={C.brand} transparent opacity={progress * 0.3} />
          </mesh>
        </>
      )}

      {/* Arrow dot at connection point */}
      <mesh ref={dotRef} position={[wt.targetX, bottomY, 0.05]}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial color={C.brand} transparent opacity={progress * 0.6} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Wave label
// ---------------------------------------------------------------------------

function WaveLabel({ visible, delay }: { visible: boolean; delay: number }) {
  const [opacity, setOpacity] = useState(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (visible) { startTime.current = null; setOpacity(0); }
    else { setOpacity(0); startTime.current = null; }
  }, [visible]);

  useFrame((state) => {
    if (!visible) return;
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    if (t - startTime.current > delay) {
      setOpacity(Math.min((t - startTime.current - delay) * 2.5, 1));
    }
  });

  if (opacity < 0.01) return null;

  return (
    <Html position={[-3.6, WT_ROW_Y, 0]} style={{ pointerEvents: "none" }}>
      <div
        style={{
          opacity,
          padding: "3px 10px",
          border: "1px solid #44403a",
          borderRadius: "5px",
          fontSize: "10px",
          color: "#a8a29e",
          fontFamily: "var(--font-mono, monospace)",
          whiteSpace: "nowrap",
          background: "rgba(13, 13, 13, 0.9)",
          letterSpacing: "0.02em",
        }}
      >
        Wave 1
      </div>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

const RESEARCH_NODES = makeResearchNodes();
const PRD_NODE_DEF = makePRDNode();
const TASK_NODES = makeTaskNodes();

function Scene({ activeStage }: { activeStage: number }) {
  const { viewport } = useThree();
  const boxes = useMemo(() => getBoxLayout(activeStage), [activeStage]);

  const scale = useMemo(() => {
    if (viewport.width < 5) return 0.42;
    if (viewport.width < 7) return 0.55;
    if (viewport.width < 10) return 0.7;
    return 0.8;
  }, [viewport.width]);

  const center = (i: number): [number, number] => {
    const b = boxes[i];
    return b ? [b.x + b.width / 2, b.y] : [0, 0];
  };

  return (
    <group scale={[scale, scale, scale]} position={[0, 0.15, 0]}>
      <ambientLight intensity={1.0} />

      {/* Boxes */}
      {boxes.map((box, i) => (
        <ContextBox key={`box-${i}-${activeStage}`} box={box} delay={i * 0.15} />
      ))}

      {/* Research nodes */}
      {RESEARCH_NODES.map((node) => (
        <FloatingNode
          key={node.id}
          node={node}
          visible={activeStage >= 0}
          stageDelay={0.25}
          containerCenter={center(0)}
        />
      ))}

      {/* PRD radial gradient orb */}
      {activeStage >= 1 && (
        <PRDOrb
          visible={activeStage >= 1}
          stageDelay={0.3}
          containerCenter={center(1)}
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
            containerCenter={center(2)}
          />
        ))}

      {/* Worktrees */}
      <WaveLabel visible={activeStage >= 3} delay={0.1} />
      {activeStage >= 3 &&
        WORKTREES.map((wt, i) => (
          <WorktreeConnection
            key={wt.id}
            wt={wt}
            visible={activeStage >= 3}
            delay={0.15 + i * 0.1}
            boxLayout={boxes}
          />
        ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

const STAGE_LABELS = ["Research", "PRD", "Task Briefs", "Worktrees"];

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
      {/* Effective Context label */}
      <span
        className="text-fg-tertiary text-[10px] uppercase tracking-wider shrink-0 hidden sm:block"
        style={{ fontFamily: "var(--font-accent)" }}
      >
        Effective Context
      </span>

      {/* Stage segments */}
      <div className="flex-1 flex gap-1">
        {STAGE_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => onStageChange(i)}
            className="flex-1 group cursor-pointer"
            title={label}
          >
            <div
              className="h-[3px] rounded-full overflow-hidden transition-all duration-300"
              style={{
                background: i <= activeStage ? "rgba(254, 81, 2, 0.18)" : "rgba(68, 64, 58, 0.4)",
              }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: i <= activeStage ? "100%" : "0%",
                  background: i <= activeStage ? "#fe5102" : "transparent",
                  transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Play / Pause */}
      <button
        onClick={onTogglePlay}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md border border-border-secondary text-fg-tertiary hover:text-fg-primary hover:border-border-primary transition-colors cursor-pointer"
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
// Export
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
      <ProgressBar
        activeStage={activeStage}
        onStageChange={onStageChange}
        playing={playing}
        onTogglePlay={onTogglePlay}
      />

      <div
        className="w-full border-b border-border-secondary"
        style={{ height: "clamp(260px, 34vw, 400px)" }}
      >
        <Canvas
          orthographic
          camera={{ zoom: 60, position: [0, 0.3, 10], near: 0.1, far: 100 }}
          dpr={[1, 2]}
          style={{ background: "transparent" }}
          gl={{ antialias: true, alpha: true }}
          onPointerMissed={() => { document.body.style.cursor = "auto"; }}
        >
          <Scene activeStage={activeStage} />
        </Canvas>
      </div>
    </div>
  );
}
