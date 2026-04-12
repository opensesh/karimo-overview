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

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

const BOX_SIZE = 2.0;
const BOX_Y = -0.5;
const BOX_GAP = 0.14;
const WT_ROW_Y = 2.0;

const C = {
  boxBorder: "#44403a",
  boxFill: "#0d0d0d",
  nodeLight: "#e7e5e2",
  nodeMid: "#a8a29e",
  nodeDim: "#78716c",
  brand: "#fe5102",
  brandGlow: "#ff7a38",
  taskNode: "#ff7a38",
  labelColor: "#78716c",
};

// ---------------------------------------------------------------------------
// Node generators — bouncy atoms
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
      baseX: -0.48 + col * 0.48,
      baseY: 0.42 - row * 0.42,
      radius: 0.12 + (s % 5) * 0.008,
      color: i < 2 ? C.nodeLight : i < 5 ? C.nodeMid : C.nodeDim,
      phaseX: s % 6.28,
      phaseY: (s * 1.3) % 6.28,
      // Much faster and larger amplitude — bouncy atoms
      speedX: 1.2 + (s % 3) * 0.4,
      speedY: 1.5 + (s % 4) * 0.3,
      ampX: 0.12 + (s % 5) * 0.015,
      ampY: 0.12 + (s % 3) * 0.018,
      delay: i * 0.05,
    };
  });
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
      baseX: -0.6 + col * 0.4,
      baseY: 0.38 - row * 0.38,
      radius: 0.09 + (s % 5) * 0.006,
      color: C.taskNode,
      phaseX: s % 6.28,
      phaseY: (s * 1.7) % 6.28,
      // Bouncy like the research nodes
      speedX: 1.3 + (s % 3) * 0.35,
      speedY: 1.1 + (s % 4) * 0.3,
      ampX: 0.1 + (s % 4) * 0.012,
      ampY: 0.1 + (s % 3) * 0.014,
      delay: i * 0.04,
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

// ---------------------------------------------------------------------------
// PRD Orb — radial gradient shader with bigger pulse
// ---------------------------------------------------------------------------

const prdVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const prdFrag = `
  uniform float uTime;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5);
    float dist = length(vUv - center) * 2.0;

    float pulse = 0.8 + sin(uTime * 1.8) * 0.2;
    float hoverBoost = uHover * 0.25;

    vec3 coreColor = vec3(1.0, 0.45, 0.1);
    vec3 midColor  = vec3(0.996, 0.318, 0.008);
    vec3 edgeColor = vec3(0.6, 0.15, 0.0);

    vec3 color = mix(coreColor, midColor, smoothstep(0.0, 0.45, dist));
    color = mix(color, edgeColor, smoothstep(0.35, 0.85, dist));

    float alpha = (1.0 - smoothstep(0.65, 1.0, dist)) * (pulse + hoverBoost);

    float glow = exp(-dist * 1.8) * 0.35 * pulse;
    color += vec3(1.0, 0.5, 0.12) * glow;

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

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHover: { value: 0 },
  }), []);

  useEffect(() => {
    if (visible) { startTime.current = null; setAppeared(false); }
    else { scaleRef.current = 0; setAppeared(false); startTime.current = null; }
  }, [visible]);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const t = state.clock.elapsedTime;

    if (visible) {
      if (startTime.current === null) startTime.current = t;
      const elapsed = t - startTime.current;
      if (elapsed > stageDelay) {
        const springT = Math.min((elapsed - stageDelay) * 2.2, 1);
        scaleRef.current = 1 - Math.pow(1 - springT, 3);
        if (springT >= 1 && !appeared) setAppeared(true);
      }
    } else {
      scaleRef.current *= 0.85;
    }

    // Dramatic scale pulse — breathes in and out
    const breathe = 1 + Math.sin(t * 1.2) * 0.12;
    const s = scaleRef.current * breathe;
    meshRef.current.scale.set(s, s, s);

    materialRef.current.uniforms.uTime.value = t;
    materialRef.current.uniforms.uHover.value +=
      ((hovered ? 1 : 0) - materialRef.current.uniforms.uHover.value) * 0.08;
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
      position={[containerCenter[0], containerCenter[1], 0.1]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <circleGeometry args={[0.48, 48]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={prdVert}
        fragmentShader={prdFrag}
        uniforms={uniforms}
        transparent
      />
      {hovered && appeared && (
        <Html center position={[0, 0.6, 0]} style={{ pointerEvents: "none", zIndex: 50 }}>
          <div style={{
            padding: "4px 10px", borderRadius: "6px", background: "#000",
            border: "1px solid #44403a", color: "#fffaee", fontSize: "11px",
            fontFamily: "var(--font-mono, monospace)", whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}>
            PRD
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Floating Node — bouncy atom behavior
// ---------------------------------------------------------------------------

function FloatingNode({
  node,
  visible,
  stageDelay,
  containerCenter,
  containerHalfSize,
}: {
  node: NodeDef;
  visible: boolean;
  stageDelay: number;
  containerCenter: [number, number];
  containerHalfSize: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [appeared, setAppeared] = useState(false);
  const scaleRef = useRef(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (visible) { startTime.current = null; setAppeared(false); }
    else { scaleRef.current = 0; setAppeared(false); startTime.current = null; }
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

        // Bouncy atom — multiple sin waves layered for organic motion
        let dx = Math.sin(ft * node.speedX + node.phaseX) * node.ampX;
        dx += Math.sin(ft * node.speedX * 1.7 + node.phaseY) * node.ampX * 0.4;

        let dy = Math.sin(ft * node.speedY + node.phaseY) * node.ampY;
        dy += Math.sin(ft * node.speedY * 1.3 + node.phaseX) * node.ampY * 0.5;

        // Clamp to stay inside the container
        const limit = containerHalfSize - node.radius - 0.08;
        const rawX = node.baseX + dx;
        const rawY = node.baseY + dy;
        meshRef.current.position.x = containerCenter[0] + Math.max(-limit, Math.min(limit, rawX));
        meshRef.current.position.y = containerCenter[1] + Math.max(-limit, Math.min(limit, rawY));
      }
    } else {
      scaleRef.current *= 0.85;
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
      <meshBasicMaterial color={hovered ? C.brandGlow : node.color} toneMapped={false} />
      {hovered && appeared && (
        <Html center position={[0, node.radius + 0.18, 0]} style={{ pointerEvents: "none", zIndex: 50 }}>
          <div style={{
            padding: "4px 10px", borderRadius: "6px", background: "#000",
            border: "1px solid #44403a", color: "#fffaee", fontSize: "11px",
            fontFamily: "var(--font-mono, monospace)", whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}>
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

  useEffect(() => { startTime.current = null; }, [box.x]);

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
    (edgesRef.current.material as THREE.LineBasicMaterial).opacity = p * 0.5;
    if (labelRef.current) labelRef.current.style.opacity = String(p);
  });

  return (
    <group ref={groupRef} position={[box.x + box.width / 2, box.y, 0]}>
      <mesh ref={fillRef} geometry={geo}>
        <meshBasicMaterial color={C.boxFill} transparent opacity={0} />
      </mesh>
      <lineSegments ref={edgesRef} geometry={edgeGeo}>
        <lineBasicMaterial color={C.boxBorder} transparent opacity={0} />
      </lineSegments>
      <Html position={[0, -box.height / 2 - 0.24, 0]} center style={{ pointerEvents: "none" }}>
        <span ref={labelRef} style={{
          fontFamily: "var(--font-accent)", fontSize: "9px", color: C.labelColor,
          letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap", opacity: 0,
        }}>
          {box.label}
        </span>
      </Html>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Worktree Row — single horizontal row with Wave label, git icons, labels,
// and curved arrows down to boxes (matching Figma)
// ---------------------------------------------------------------------------

interface WTDef {
  id: string;
  label: string;
  /** Index into the boxLayout array this worktree connects to */
  targetBoxIndex: number;
  /** X position within the target box to connect to (0 = center) */
  targetOffsetX: number;
}

const WORKTREE_DEFS: WTDef[] = [
  { id: "wt-1a", label: "worktree 1a", targetBoxIndex: 0, targetOffsetX: 0 },
  { id: "wt-1b", label: "worktree 1b", targetBoxIndex: 1, targetOffsetX: 0 },
  { id: "wt-1c", label: "worktree 1c", targetBoxIndex: 2, targetOffsetX: -0.3 },
  { id: "wt-1d", label: "worktree 1d", targetBoxIndex: 2, targetOffsetX: 0.3 },
];

// Git branch icon SVG as inline data URI
const GIT_ICON = `data:image/svg+xml,${encodeURIComponent(
  '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M6 3a3 3 0 1 0-4 2.83V10a1 1 0 0 0 1 1h2a2 2 0 0 1 2 2v.17a3 3 0 1 0 2 0V13a4 4 0 0 0-4-4H3V5.83A3 3 0 0 0 6 3Z" fill="%23fe5102"/>' +
  '</svg>'
)}`;

function WorktreeRow({
  visible,
  boxLayout,
}: {
  visible: boolean;
  boxLayout: BoxDef[];
}) {
  const [progress, setProgress] = useState(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (visible) { startTime.current = null; setProgress(0); }
    else { setProgress(0); startTime.current = null; }
  }, [visible]);

  useFrame((state) => {
    if (!visible) return;
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;
    if (elapsed > 0.1) {
      const p = Math.min((elapsed - 0.1) * 1.8, 1);
      setProgress(1 - Math.pow(1 - p, 3));
    }
  });

  if (progress < 0.01) return null;

  // Position each worktree pill evenly across the row
  const totalWidth = BOX_SIZE * 3 + BOX_GAP * 2;
  const startX = -totalWidth / 2;

  return (
    <group>
      {/* Single HTML row for Wave label + worktree items */}
      <Html position={[0, WT_ROW_Y, 0]} center style={{ pointerEvents: "none" }}>
        <div
          style={{
            opacity: progress,
            display: "flex",
            alignItems: "center",
            gap: "24px",
            justifyContent: "center",
            whiteSpace: "nowrap",
          }}
        >
          {/* Wave 1 pill */}
          <div style={{
            padding: "4px 12px",
            border: "1px solid #44403a",
            borderRadius: "5px",
            fontSize: "11px",
            color: "#a8a29e",
            fontFamily: "var(--font-mono, monospace)",
            background: "rgba(13, 13, 13, 0.9)",
            letterSpacing: "0.03em",
            flexShrink: 0,
          }}>
            Wave 1
          </div>

          {/* Worktree items — evenly spaced */}
          {WORKTREE_DEFS.map((wt) => (
            <div key={wt.id} style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              flexShrink: 0,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={GIT_ICON} alt="" width={13} height={13} style={{ opacity: 0.6 }} />
              <span style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "11px",
                color: "#a8a29e",
                letterSpacing: "0.01em",
              }}>
                {wt.label}
              </span>
            </div>
          ))}
        </div>
      </Html>

      {/* Curved connection lines from each worktree down to its box */}
      {WORKTREE_DEFS.map((wt, i) => {
        const box = boxLayout[wt.targetBoxIndex];
        if (!box) return null;

        // Pill X position — evenly spaced across the row
        const pillX = startX + 0.8 + i * (totalWidth - 1.0) / (WORKTREE_DEFS.length - 1);
        // Target point on top of the box
        const targetX = box.x + box.width / 2 + wt.targetOffsetX;
        const topY = WT_ROW_Y - 0.2;
        const bottomY = box.y + box.height / 2;

        return (
          <WorktreeArrow
            key={wt.id}
            fromX={pillX}
            fromY={topY}
            toX={targetX}
            toY={bottomY}
            progress={progress}
            delay={i * 0.08}
          />
        );
      })}
    </group>
  );
}

// Bracket-style arrow: straight down, then curve to target box
function WorktreeArrow({
  fromX, fromY, toX, toY, progress, delay,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  delay: number;
}) {
  const [localProgress, setLocalProgress] = useState(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (progress > 0) { startTime.current = null; setLocalProgress(0); }
    else { setLocalProgress(0); startTime.current = null; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress > 0]);

  useFrame((state) => {
    if (progress < 0.01) return;
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;
    if (elapsed > delay) {
      const p = Math.min((elapsed - delay) * 2.5, 1);
      setLocalProgress(1 - Math.pow(1 - p, 3));
    }
  });

  // Bracket path: vertical down from label, then curve out to target
  const curve = useMemo(() => {
    const dx = toX - fromX;
    const verticalDrop = (fromY - toY) * 0.4; // go 40% straight down first
    const bendY = fromY - verticalDrop;

    // Cubic bezier: straight down, curve at the bend, arrive at target
    return new THREE.CubicBezierCurve3(
      new THREE.Vector3(fromX, fromY, 0),            // start: under label
      new THREE.Vector3(fromX, bendY, 0),             // control 1: straight down
      new THREE.Vector3(toX, bendY + dx * 0.15, 0),   // control 2: curve toward target
      new THREE.Vector3(toX, toY, 0)                  // end: top of box
    );
  }, [fromX, fromY, toX, toY]);

  const allPoints = useMemo(() => curve.getPoints(40), [curve]);

  const visiblePoints = useMemo(() => {
    const count = Math.max(2, Math.floor(allPoints.length * localProgress));
    return allPoints.slice(0, count);
  }, [allPoints, localProgress]);

  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(visiblePoints);
    const mat = new THREE.LineBasicMaterial({ color: C.brand, transparent: true, opacity: 0 });
    return new THREE.Line(geo, mat);
  }, [visiblePoints]);

  useFrame(() => {
    if (lineObj.material instanceof THREE.LineBasicMaterial) {
      lineObj.material.opacity = localProgress * 0.5;
    }
  });

  if (localProgress < 0.01) return null;

  return (
    <group>
      <primitive object={lineObj} />
      {/* Downward arrow at connection point */}
      {localProgress > 0.4 && (
        <mesh position={[toX, toY + 0.08, 0.05]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.05, 0.1, 3]} />
          <meshBasicMaterial color={C.brand} transparent opacity={localProgress * 0.6} />
        </mesh>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

const RESEARCH_NODES = makeResearchNodes();
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

  const center = useCallback((i: number): [number, number] => {
    const b = boxes[i];
    return b ? [b.x + b.width / 2, b.y] : [0, 0];
  }, [boxes]);

  const halfBox = BOX_SIZE / 2;

  return (
    <group scale={[scale, scale, scale]} position={[0, 0.15, 0]}>
      <ambientLight intensity={1.0} />

      {/* Boxes */}
      {boxes.map((box, i) => (
        <ContextBox key={`box-${i}-${activeStage}`} box={box} delay={i * 0.15} />
      ))}

      {/* Research nodes — bouncy atoms */}
      {RESEARCH_NODES.map((node) => (
        <FloatingNode
          key={node.id}
          node={node}
          visible={activeStage >= 0}
          stageDelay={0.25}
          containerCenter={center(0)}
          containerHalfSize={halfBox}
        />
      ))}

      {/* PRD orb — dramatic pulse */}
      {activeStage >= 1 && (
        <PRDOrb visible stageDelay={0.3} containerCenter={center(1)} />
      )}

      {/* Task nodes — bouncy atoms */}
      {activeStage >= 2 &&
        TASK_NODES.map((node) => (
          <FloatingNode
            key={node.id}
            node={node}
            visible
            stageDelay={0.2}
            containerCenter={center(2)}
            containerHalfSize={halfBox}
          />
        ))}

      {/* Worktree row */}
      <WorktreeRow visible={activeStage >= 3} boxLayout={boxes} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

const STAGE_LABELS = ["Research", "PRD", "Task Briefs", "Worktrees"];

function ProgressBar({
  activeStage, stageProgress, onStageChange, playing, onTogglePlay,
}: {
  activeStage: number;
  stageProgress: number;
  onStageChange: (stage: number) => void;
  playing: boolean;
  onTogglePlay: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 md:px-6">
      <span
        className="text-fg-tertiary text-[10px] uppercase tracking-wider shrink-0 hidden sm:block"
        style={{ fontFamily: "var(--font-accent)" }}
      >
        Effective Context
      </span>
      <div className="flex-1 flex gap-1">
        {STAGE_LABELS.map((label, i) => {
          // Determine fill width: completed stages = 100%, current = animated, future = 0%
          let fillWidth: string;
          if (i < activeStage) fillWidth = "100%";
          else if (i === activeStage) fillWidth = `${Math.round(stageProgress * 100)}%`;
          else fillWidth = "0%";

          return (
            <button
              key={label}
              onClick={() => onStageChange(i)}
              className="flex-1 group cursor-pointer"
              title={label}
            >
              <div
                className="h-[3px] rounded-full overflow-hidden"
                style={{
                  background: i <= activeStage ? "rgba(254, 81, 2, 0.18)" : "rgba(68, 64, 58, 0.4)",
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: fillWidth,
                    background: "#fe5102",
                    // No transition on current stage (it's driven by rAF), smooth on others
                    transition: i === activeStage ? "none" : "width 0.3s ease",
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
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
  stageProgress: number;
  onStageChange: (stage: number) => void;
  playing: boolean;
  onTogglePlay: () => void;
}

export function ContextMultiplicationCanvas({
  activeStage, stageProgress, onStageChange, playing, onTogglePlay,
}: ContextMultiplicationCanvasProps) {
  return (
    <div className="w-full">
      <ProgressBar
        activeStage={activeStage}
        stageProgress={stageProgress}
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
