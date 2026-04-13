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
import { CircleCheck, CircleX } from "lucide-react";

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
// Layout constants
// ---------------------------------------------------------------------------

const BOX_SIZE = 2.0;
const BOX_GAP = 0.7; // wider spacing between boxes
const SUB_AGENT_H = 0.5; // taller sub-agent blocks
const SUB_AGENT_GAP = 0.1;
const PLAN_Y = 2.0;
const KARIMO_Y = -2.4;

const C = {
  boxBorder: "#44403a",
  boxFill: "#0d0d0d",
  nodeLight: "#e7e5e2",
  nodeMid: "#a8a29e",
  nodeDim: "#78716c",
  brand: "#fe5102",
  brandGlow: "#ff7a38",
  taskNode: "#ff7a38",
  dimRed: "#6b3a3a",
  redBg: "#3a1c1c",
  labelColor: "#78716c",
  green: "#22c55e",
  greenDim: "#166534",
};

// ---------------------------------------------------------------------------
// PRD Orb shader (reused from ContextMultiplicationCanvas)
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

// ---------------------------------------------------------------------------
// Node generators — Plan Mode sessions
// ---------------------------------------------------------------------------

function makePlanSessionNodes(sessionIndex: number): NodeDef[] {
  const prefix = `plan-s${sessionIndex}`;
  const s = (sessionIndex * 3 + 1) * 137.5;

  const mainNode: NodeDef = {
    id: `${prefix}-main`,
    label: "1M",
    baseX: 0,
    baseY: 0.15,
    radius: 0.16,
    color: C.nodeLight,
    phaseX: s % 6.28,
    phaseY: (s * 1.3) % 6.28,
    speedX: 0.6 + sessionIndex * 0.12,
    speedY: 0.8 + sessionIndex * 0.1,
    ampX: 0.05,
    ampY: 0.05,
    delay: 0.1,
  };

  const extras: NodeDef[] = [0, 1, 2, 3].map((i) => {
    const si = (sessionIndex * 4 + i + 3) * 97.3;
    return {
      id: `${prefix}-e${i}`,
      label: "",
      baseX: -0.35 + (i % 2) * 0.7,
      baseY: -0.2 + Math.floor(i / 2) * 0.5,
      radius: 0.06 + (si % 5) * 0.004,
      color: i < 2 ? C.nodeMid : C.nodeDim,
      phaseX: si % 6.28,
      phaseY: (si * 1.7) % 6.28,
      speedX: 1.1 + (si % 3) * 0.3,
      speedY: 0.9 + (si % 4) * 0.25,
      ampX: 0.06,
      ampY: 0.06,
      delay: 0.15 + i * 0.04,
    };
  });

  return [mainNode, ...extras];
}

// Sub-agent definitions per session
interface SubAgentDef { label: string; width: number }

const PLAN_SUB_AGENTS: SubAgentDef[][] = [
  [{ label: "50K", width: 0.52 }, { label: "70K", width: 0.6 }, { label: "20K", width: 0.42 }],
  [{ label: "20K", width: 0.42 }, { label: "30K", width: 0.48 }, { label: "40K", width: 0.52 }],
  [{ label: "30K", width: 0.48 }, { label: "70K", width: 0.6 }],
];

// ---------------------------------------------------------------------------
// KARIMO node generators (from ContextMultiplicationCanvas)
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
      id: `r-${i}`, label,
      baseX: -0.5 + col * 0.5,
      baseY: 0.45 - row * 0.45,
      radius: 0.1 + (s % 5) * 0.006,
      color: i < 2 ? C.nodeLight : i < 5 ? C.nodeMid : C.nodeDim,
      phaseX: s % 6.28, phaseY: (s * 1.3) % 6.28,
      speedX: 0.8 + i * 0.15, speedY: 1.0 + i * 0.12,
      ampX: 0.08 + (s % 5) * 0.008, ampY: 0.08 + (s % 3) * 0.01,
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
      id: `t-${i}`, label,
      baseX: -0.6 + col * 0.4,
      baseY: 0.38 - row * 0.38,
      radius: 0.09 + (s % 5) * 0.006,
      color: C.taskNode,
      phaseX: s % 6.28, phaseY: (s * 1.7) % 6.28,
      speedX: 1.3 + (s % 3) * 0.35, speedY: 1.1 + (s % 4) * 0.3,
      ampX: 0.1 + (s % 4) * 0.012, ampY: 0.1 + (s % 3) * 0.014,
      delay: i * 0.04,
    };
  });
}

// Worktree bar definitions
interface WorktreeBarDef {
  label: string;
  targetWidth: number;
  tokens: string;
  color: string;
}

const WORKTREE_BARS: WorktreeBarDef[] = [
  { label: "Wave 1", targetWidth: 2.4, tokens: "~800K", color: C.brand },
  { label: "Wave 2", targetWidth: 3.2, tokens: "~1.2M", color: C.brandGlow },
  { label: "Wave 3", targetWidth: 1.8, tokens: "~500K", color: C.brand },
  { label: "Wave 4", targetWidth: 2.8, tokens: "~1M", color: C.brandGlow },
];

// ---------------------------------------------------------------------------
// Floating Node — bouncy atom
// ---------------------------------------------------------------------------

function FloatingNode({
  node, visible, stageDelay, containerCenter, containerHalfSize,
}: {
  node: NodeDef; visible: boolean; stageDelay: number;
  containerCenter: [number, number]; containerHalfSize: number;
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
        let dx = Math.sin(ft * node.speedX + node.phaseX) * node.ampX;
        dx += Math.sin(ft * node.speedX * 1.7 + node.phaseY) * node.ampX * 0.4;
        let dy = Math.sin(ft * node.speedY + node.phaseY) * node.ampY;
        dy += Math.sin(ft * node.speedY * 1.3 + node.phaseX) * node.ampY * 0.5;
        const limit = containerHalfSize - node.radius - 0.08;
        meshRef.current.position.x =
          containerCenter[0] + Math.max(-limit, Math.min(limit, node.baseX + dx));
        meshRef.current.position.y =
          containerCenter[1] + Math.max(-limit, Math.min(limit, node.baseY + dy));
      }
    } else { scaleRef.current *= 0.85; }
    const s = scaleRef.current;
    meshRef.current.scale.set(s, s, s);
  });

  const handlePointerOver = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer";
  }, []);
  const handlePointerOut = useCallback(() => {
    setHovered(false); document.body.style.cursor = "auto";
  }, []);

  if (!visible && scaleRef.current < 0.01) return null;

  return (
    <mesh ref={meshRef}
      position={[containerCenter[0] + node.baseX, containerCenter[1] + node.baseY, 0.1]}
      onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      <circleGeometry args={[node.radius, 32]} />
      <meshBasicMaterial color={hovered ? C.brandGlow : node.color} toneMapped={false} />
      {hovered && appeared && node.label && (
        <Html center position={[0, node.radius + 0.18, 0]} style={{ pointerEvents: "none", zIndex: 50 }}>
          <div style={{
            padding: "4px 10px", borderRadius: "6px", background: "#000",
            border: "1px solid #44403a", color: "#fffaee", fontSize: "11px",
            fontFamily: "var(--font-mono, monospace)", whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}>{node.label}</div>
        </Html>
      )}
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Context Box
// ---------------------------------------------------------------------------

function ContextBox({ box, delay, borderColor }: { box: BoxDef; delay: number; borderColor?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const fillRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => { startTime.current = null; }, [box.x, box.y]);

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
    (edgesRef.current.material as THREE.LineBasicMaterial).opacity = p * 0.85;
    if (labelRef.current) labelRef.current.style.opacity = String(p);
  });

  return (
    <group ref={groupRef} position={[box.x + box.width / 2, box.y + box.height / 2, 0]}>
      <mesh ref={fillRef} geometry={geo}>
        <meshBasicMaterial color={C.boxFill} transparent opacity={0} />
      </mesh>
      <lineSegments ref={edgesRef} geometry={edgeGeo}>
        <lineBasicMaterial color={borderColor ?? C.boxBorder} transparent opacity={0} />
      </lineSegments>
      {/* Upper-left label inside the box */}
      <Html
        position={[-box.width / 2 + 0.12, box.height / 2 - 0.12, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div ref={labelRef} style={{
          fontFamily: "var(--font-accent)", fontSize: "9px", color: borderColor ?? C.labelColor,
          letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap", opacity: 0,
        }}>
          {box.label}
        </div>
      </Html>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Token count badge below KARIMO boxes
// ---------------------------------------------------------------------------

function TokenBadge({ x, y, text, delay }: { x: number; y: number; text: string; delay: number }) {
  const [opacity, setOpacity] = useState(0);
  const startTime = useRef<number | null>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;
    if (elapsed > delay) {
      const p = Math.min((elapsed - delay) * 2.5, 1);
      setOpacity(1 - Math.pow(1 - p, 3));
    }
  });

  return (
    <Html position={[x, y, 0]} center style={{ pointerEvents: "none" }}>
      <span style={{
        opacity, fontFamily: "var(--font-mono, monospace)", fontSize: "9px",
        color: C.nodeMid, whiteSpace: "nowrap",
      }}>
        {text}
      </span>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// PRD Orb
// ---------------------------------------------------------------------------

function PRDOrb({ containerCenter, delay }: { containerCenter: [number, number]; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const [appeared, setAppeared] = useState(false);
  const scaleRef = useRef(0);
  const startTime = useRef<number | null>(null);

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uHover: { value: 0 } }), []);

  useEffect(() => { startTime.current = null; setAppeared(false); }, []);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;
    if (elapsed > delay) {
      const springT = Math.min((elapsed - delay) * 2.2, 1);
      scaleRef.current = 1 - Math.pow(1 - springT, 3);
      if (springT >= 1 && !appeared) setAppeared(true);
    }
    const breathe = 1 + Math.sin(t * 1.2) * 0.12;
    const s = scaleRef.current * breathe;
    meshRef.current.scale.set(s, s, s);
    materialRef.current.uniforms.uTime.value = t;
    materialRef.current.uniforms.uHover.value +=
      ((hovered ? 1 : 0) - materialRef.current.uniforms.uHover.value) * 0.08;
  });

  const handlePointerOver = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer";
  }, []);
  const handlePointerOut = useCallback(() => {
    setHovered(false); document.body.style.cursor = "auto";
  }, []);

  return (
    <mesh ref={meshRef} position={[containerCenter[0], containerCenter[1], 0.1]}
      onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      <circleGeometry args={[0.42, 48]} />
      <shaderMaterial ref={materialRef} vertexShader={prdVert} fragmentShader={prdFrag}
        uniforms={uniforms} transparent />
      {hovered && appeared && (
        <Html center position={[0, 0.55, 0]} style={{ pointerEvents: "none", zIndex: 50 }}>
          <div style={{
            padding: "4px 10px", borderRadius: "6px", background: "#000",
            border: "1px solid #44403a", color: "#fffaee", fontSize: "11px",
            fontFamily: "var(--font-mono, monospace)", whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}>PRD</div>
        </Html>
      )}
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Sub-agent blocks below Plan Mode boxes
// ---------------------------------------------------------------------------

function SubAgentBlock({
  x, y, width, label, delay,
}: {
  x: number; y: number; width: number; label: string; delay: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const fillRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(0);
  const startTime = useRef<number | null>(null);

  const h = SUB_AGENT_H;
  const geo = useMemo(() => new THREE.PlaneGeometry(width, h), [width]);
  const edgeGeo = useMemo(() => {
    const g = new THREE.BoxGeometry(width, h, 0.001);
    return new THREE.EdgesGeometry(g);
  }, [width]);

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
    (fillRef.current.material as THREE.MeshBasicMaterial).opacity = p * 0.1;
    (edgesRef.current.material as THREE.LineBasicMaterial).opacity = p * 0.6;
    if (labelRef.current) labelRef.current.style.opacity = String(p);
  });

  return (
    <group ref={groupRef} position={[x, y, 0]}>
      <mesh ref={fillRef} geometry={geo}>
        <meshBasicMaterial color={C.boxFill} transparent opacity={0} />
      </mesh>
      <lineSegments ref={edgesRef} geometry={edgeGeo}>
        <lineBasicMaterial color={C.nodeDim} transparent opacity={0} />
      </lineSegments>
      <Html position={[0, 0, 0]} center style={{ pointerEvents: "none" }}>
        <span ref={labelRef} style={{
          fontFamily: "var(--font-mono, monospace)", fontSize: "9px", color: C.nodeDim,
          letterSpacing: "0.04em", whiteSpace: "nowrap", opacity: 0,
        }}>{label}</span>
      </Html>
    </group>
  );
}

// Connector line from session box bottom to sub-agent
function SubAgentConnector({ fromX, fromY, toX, toY, delay }: {
  fromX: number; fromY: number; toX: number; toY: number; delay: number;
}) {
  const progressRef = useRef(0);
  const startTime = useRef<number | null>(null);

  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(fromX, fromY, 0), new THREE.Vector3(toX, toY, 0),
    ]);
    const mat = new THREE.LineBasicMaterial({ color: C.nodeDim, transparent: true, opacity: 0 });
    return new THREE.Line(geo, mat);
  }, [fromX, fromY, toX, toY]);

  useEffect(() => () => {
    lineObj.geometry.dispose(); (lineObj.material as THREE.Material).dispose();
  }, [lineObj]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;
    if (elapsed > delay) {
      const p = Math.min((elapsed - delay) * 2.5, 1);
      progressRef.current = 1 - Math.pow(1 - p, 3);
    }
    if (lineObj.material instanceof THREE.LineBasicMaterial) {
      lineObj.material.opacity = progressRef.current * 0.4;
    }
  });

  return <primitive object={lineObj} />;
}

// ---------------------------------------------------------------------------
// Dotted line + icon between boxes
// ---------------------------------------------------------------------------

function DottedConnector({
  fromX, toX, y, delay, variant,
}: {
  fromX: number; toX: number; y: number; delay: number;
  variant: "error" | "success";
}) {
  const progressRef = useRef(0);
  const startTime = useRef<number | null>(null);
  const [opacity, setOpacity] = useState(0);

  const lineColor = variant === "error" ? C.dimRed : C.greenDim;

  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(fromX, y, 0), new THREE.Vector3(toX, y, 0),
    ]);
    const mat = new THREE.LineDashedMaterial({
      color: lineColor, transparent: true, opacity: 0,
      dashSize: 0.1, gapSize: 0.08,
    });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    return line;
  }, [fromX, toX, y, lineColor]);

  useEffect(() => () => {
    lineObj.geometry.dispose(); (lineObj.material as THREE.Material).dispose();
  }, [lineObj]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;
    if (elapsed > delay) {
      const p = Math.min((elapsed - delay) * 2.0, 1);
      progressRef.current = 1 - Math.pow(1 - p, 3);
    }
    if (lineObj.material instanceof THREE.LineDashedMaterial) {
      lineObj.material.opacity = progressRef.current * 0.7;
    }
    setOpacity(progressRef.current);
  });

  const midX = (fromX + toX) / 2;

  return (
    <group>
      <primitive object={lineObj} />
      <Html position={[midX, y, 0]} center style={{ pointerEvents: "none" }}>
        {variant === "error" ? (
          <div style={{
            opacity, width: "22px", height: "22px",
            borderRadius: "50%", background: C.redBg,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CircleX size={16} color="#e05555" strokeWidth={2} />
          </div>
        ) : (
          <div style={{
            opacity, width: "22px", height: "22px",
            borderRadius: "50%", background: "rgba(22, 101, 52, 0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CircleCheck size={16} color={C.green} strokeWidth={2} />
          </div>
        )}
      </Html>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Worktree growing bars
// ---------------------------------------------------------------------------

function WorktreeBar({
  x, y, targetWidth, height, label, tokens, color, delay,
}: {
  x: number; y: number; targetWidth: number; height: number;
  label: string; tokens: string; color: string; delay: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const fillRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const progressRef = useRef(0);
  const startTime = useRef<number | null>(null);
  const [labelOpacity, setLabelOpacity] = useState(0);

  const geo = useMemo(() => new THREE.PlaneGeometry(targetWidth, height), [targetWidth, height]);
  const edgeGeo = useMemo(() => {
    const g = new THREE.BoxGeometry(targetWidth, height, 0.001);
    return new THREE.EdgesGeometry(g);
  }, [targetWidth, height]);

  useFrame((state) => {
    if (!groupRef.current || !fillRef.current || !edgesRef.current) return;
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;
    if (elapsed > delay) {
      const p = Math.min((elapsed - delay) * 1.2, 1);
      progressRef.current = 1 - Math.pow(1 - p, 3);
    }
    const p = progressRef.current;
    groupRef.current.scale.set(p, 1, 1);
    groupRef.current.position.x = x + (targetWidth * p) / 2;
    groupRef.current.position.y = y;
    (fillRef.current.material as THREE.MeshBasicMaterial).opacity = p * 0.15;
    (edgesRef.current.material as THREE.LineBasicMaterial).opacity = p * 0.7;
    setLabelOpacity(p > 0.5 ? (p - 0.5) * 2 : 0);
  });

  return (
    <group ref={groupRef} position={[x + targetWidth / 2, y, 0]}>
      <mesh ref={fillRef} geometry={geo}>
        <meshBasicMaterial color={C.boxFill} transparent opacity={0} />
      </mesh>
      <lineSegments ref={edgesRef} geometry={edgeGeo}>
        <lineBasicMaterial color={color} transparent opacity={0} />
      </lineSegments>
      <Html position={[0, 0, 0]} center style={{ pointerEvents: "none" }}>
        <div style={{
          display: "flex", gap: "8px", alignItems: "center",
          opacity: labelOpacity, transition: "opacity 0.2s",
        }}>
          <span style={{
            fontFamily: "var(--font-mono, monospace)", fontSize: "9px",
            color: C.nodeMid, whiteSpace: "nowrap",
          }}>{label}</span>
          <span style={{
            fontFamily: "var(--font-mono, monospace)", fontSize: "8px",
            color: C.nodeDim, whiteSpace: "nowrap",
          }}>{tokens}</span>
        </div>
      </Html>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Section header bar (full width, title left / effective tokens right)
// ---------------------------------------------------------------------------

function SectionHeader({
  y, title, titleColor, titleBorderColor, effectiveTokens, tokensColor, delay, width,
}: {
  y: number; title: string; titleColor: string; titleBorderColor: string;
  effectiveTokens: string; tokensColor: string; delay: number; width: number;
}) {
  const [opacity, setOpacity] = useState(0);
  const startTime = useRef<number | null>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;
    if (elapsed > delay) {
      const p = Math.min((elapsed - delay) * 2.5, 1);
      setOpacity(1 - Math.pow(1 - p, 3));
    }
  });

  return (
    <Html position={[0, y, 0]} center style={{ pointerEvents: "none" }}>
      <div style={{
        opacity, display: "flex", alignItems: "center", justifyContent: "space-between",
        width: `${width}px`, gap: "16px",
      }}>
        <div style={{
          padding: "4px 14px", border: `1px solid ${titleBorderColor}`,
          borderRadius: "5px", fontSize: "12px", color: titleColor,
          fontFamily: "var(--font-accent, monospace)", background: "rgba(13, 13, 13, 0.9)",
          letterSpacing: "0.08em", whiteSpace: "nowrap", textTransform: "uppercase",
        }}>{title}</div>
        <div style={{
          display: "flex", alignItems: "baseline", gap: "6px",
        }}>
          <span style={{
            fontFamily: "var(--font-accent, monospace)", fontSize: "9px",
            color: C.labelColor, letterSpacing: "0.08em", textTransform: "uppercase",
          }}>Effective Tokens:</span>
          <span style={{
            fontFamily: "var(--font-accent, monospace)", fontSize: "14px",
            fontWeight: 700, color: tokensColor, letterSpacing: "0.02em",
          }}>{effectiveTokens}</span>
        </div>
      </div>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Horizontal divider
// ---------------------------------------------------------------------------

function DividerLine({ y, width, delay }: { y: number; width: number; delay: number }) {
  const progressRef = useRef(0);
  const startTime = useRef<number | null>(null);

  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-width / 2, y, 0), new THREE.Vector3(width / 2, y, 0),
    ]);
    const mat = new THREE.LineBasicMaterial({ color: C.boxBorder, transparent: true, opacity: 0 });
    return new THREE.Line(geo, mat);
  }, [y, width]);

  useEffect(() => () => {
    lineObj.geometry.dispose(); (lineObj.material as THREE.Material).dispose();
  }, [lineObj]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;
    if (elapsed > delay) {
      const p = Math.min((elapsed - delay) * 2.0, 1);
      progressRef.current = 1 - Math.pow(1 - p, 3);
    }
    if (lineObj.material instanceof THREE.LineBasicMaterial) {
      lineObj.material.opacity = progressRef.current * 0.3;
    }
  });

  return <primitive object={lineObj} />;
}

// ---------------------------------------------------------------------------
// Pre-generated data
// ---------------------------------------------------------------------------

const PLAN_SESSION_NODES = [0, 1, 2].map((i) => makePlanSessionNodes(i));
const RESEARCH_NODES = makeResearchNodes();
const TASK_NODES = makeTaskNodes();

function getPlanBoxes(centerY: number): BoxDef[] {
  const s = BOX_SIZE;
  const g = BOX_GAP;
  const totalW = s * 3 + g * 2;
  const startX = -totalW / 2;
  return [0, 1, 2].map((i) => ({
    x: startX + i * (s + g),
    y: centerY - s / 2,
    width: s, height: s,
    label: `PLAN ${i + 1}`,
  }));
}

function getKarimoBoxes(centerY: number): BoxDef[] {
  const s = BOX_SIZE;
  const g = BOX_GAP;
  const totalW = s * 3 + g * 2;
  const startX = -totalW / 2;
  return [
    { x: startX, y: centerY - s / 2, width: s, height: s, label: "RESEARCH" },
    { x: startX + s + g, y: centerY - s / 2, width: s, height: s, label: "PRD" },
    { x: startX + (s + g) * 2, y: centerY - s / 2, width: s, height: s, label: "TASK BRIEFS" },
  ];
}

const KARIMO_TOKEN_LABELS = ["< 1,000,000", "< 1,000,000", "1,000,000+"];

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

function Scene() {
  const { viewport } = useThree();

  const scale = useMemo(() => {
    if (viewport.width < 5) return 0.24;
    if (viewport.width < 7) return 0.32;
    if (viewport.width < 10) return 0.46;
    return 0.56;
  }, [viewport.width]);

  // Header width in CSS pixels (scales with canvas)
  const headerWidth = useMemo(() => {
    if (viewport.width < 7) return 320;
    if (viewport.width < 10) return 520;
    return 700;
  }, [viewport.width]);

  const planBoxes = useMemo(() => getPlanBoxes(PLAN_Y), []);
  const karimoBoxes = useMemo(() => getKarimoBoxes(KARIMO_Y), []);
  const halfBox = BOX_SIZE / 2;

  const planCenter = useCallback((i: number): [number, number] => {
    const b = planBoxes[i];
    return [b.x + b.width / 2, b.y + b.height / 2];
  }, [planBoxes]);

  const karimoCenter = useCallback((i: number): [number, number] => {
    const b = karimoBoxes[i];
    return [b.x + b.width / 2, b.y + b.height / 2];
  }, [karimoBoxes]);

  // Worktree bar area
  const taskRightX = karimoBoxes[2].x + karimoBoxes[2].width + 0.2;
  const taskTopY = karimoBoxes[2].y + karimoBoxes[2].height;
  const barH = 0.42;
  const barGap = 0.1;

  return (
    <group scale={[scale, scale, scale]} position={[0, 0.3, 0]}>
      <ambientLight intensity={1.0} />

      {/* ================================================================= */}
      {/* PLAN MODE */}
      {/* ================================================================= */}

      <SectionHeader
        y={PLAN_Y + BOX_SIZE / 2 + 0.65}
        title="Plan Mode"
        titleColor={C.labelColor}
        titleBorderColor={C.boxBorder}
        effectiveTokens="1,000,000"
        tokensColor={C.labelColor}
        delay={0}
        width={headerWidth}
      />

      {/* Session boxes */}
      {planBoxes.map((box, i) => (
        <ContextBox key={`pb-${i}`} box={box} delay={i * 0.15} />
      ))}

      {/* Bouncy atoms */}
      {PLAN_SESSION_NODES.map((nodes, boxIdx) =>
        nodes.map((node) => (
          <FloatingNode key={node.id} node={node} visible stageDelay={0.25 + boxIdx * 0.2}
            containerCenter={planCenter(boxIdx)} containerHalfSize={halfBox} />
        ))
      )}

      {/* Sub-agent rectangles */}
      {PLAN_SUB_AGENTS.map((agents, boxIdx) => {
        const box = planBoxes[boxIdx];
        const boxCenterX = box.x + box.width / 2;
        const boxBottomY = box.y;
        const totalWidth = agents.reduce((acc, a) => acc + a.width, 0) + (agents.length - 1) * SUB_AGENT_GAP;
        let offsetX = -totalWidth / 2;

        return agents.map((agent, agentIdx) => {
          const ax = boxCenterX + offsetX + agent.width / 2;
          const ay = boxBottomY - SUB_AGENT_H / 2 - 0.25;
          offsetX += agent.width + SUB_AGENT_GAP;
          return (
            <group key={`sa-${boxIdx}-${agentIdx}`}>
              <SubAgentConnector
                fromX={boxCenterX} fromY={boxBottomY}
                toX={ax} toY={ay + SUB_AGENT_H / 2}
                delay={0.4 + boxIdx * 0.15 + agentIdx * 0.05}
              />
              <SubAgentBlock x={ax} y={ay} width={agent.width} label={agent.label}
                delay={0.4 + boxIdx * 0.15 + agentIdx * 0.05} />
            </group>
          );
        });
      })}

      {/* Dotted disconnect lines + X icons between sessions */}
      {[0, 1].map((i) => {
        const fromBox = planBoxes[i];
        const toBox = planBoxes[i + 1];
        return (
          <DottedConnector key={`dg-${i}`}
            fromX={fromBox.x + fromBox.width + 0.04}
            toX={toBox.x - 0.04}
            y={PLAN_Y} delay={0.5 + i * 0.15} variant="error" />
        );
      })}

      {/* ================================================================= */}
      {/* DIVIDER */}
      {/* ================================================================= */}

      <DividerLine y={0} width={14} delay={0.4} />

      {/* ================================================================= */}
      {/* KARIMO */}
      {/* ================================================================= */}

      <SectionHeader
        y={KARIMO_Y + BOX_SIZE / 2 + 0.65}
        title="KARIMO"
        titleColor={C.brand}
        titleBorderColor={C.brand}
        effectiveTokens="10,000,000 – 100,000,000+"
        tokensColor={C.brand}
        delay={0.5}
        width={headerWidth}
      />

      {/* Research, PRD, Task Briefs boxes */}
      {karimoBoxes.map((box, i) => (
        <ContextBox key={`kb-${i}`} box={box} delay={0.5 + i * 0.15} borderColor={C.brand} />
      ))}

      {/* Token count below each KARIMO box */}
      {karimoBoxes.map((box, i) => (
        <TokenBadge key={`tb-${i}`}
          x={box.x + box.width / 2}
          y={box.y - 0.25}
          text={KARIMO_TOKEN_LABELS[i]}
          delay={0.65 + i * 0.15}
        />
      ))}

      {/* Research nodes */}
      {RESEARCH_NODES.map((node) => (
        <FloatingNode key={node.id} node={node} visible stageDelay={0.6}
          containerCenter={karimoCenter(0)} containerHalfSize={halfBox} />
      ))}

      {/* PRD Orb */}
      <PRDOrb containerCenter={karimoCenter(1)} delay={0.75} />

      {/* Task nodes */}
      {TASK_NODES.map((node) => (
        <FloatingNode key={node.id} node={node} visible stageDelay={0.85}
          containerCenter={karimoCenter(2)} containerHalfSize={halfBox} />
      ))}

      {/* Dotted check lines between KARIMO boxes */}
      {[0, 1].map((i) => {
        const fromBox = karimoBoxes[i];
        const toBox = karimoBoxes[i + 1];
        return (
          <DottedConnector key={`kc-${i}`}
            fromX={fromBox.x + fromBox.width + 0.04}
            toX={toBox.x - 0.04}
            y={KARIMO_Y} delay={0.7 + i * 0.15} variant="success" />
        );
      })}

      {/* Worktree bars */}
      <Html position={[taskRightX + 1.4, taskTopY + 0.2, 0]} center style={{ pointerEvents: "none" }}>
        <span style={{
          fontFamily: "var(--font-accent, monospace)", fontSize: "9px",
          color: C.nodeMid, letterSpacing: "0.1em", textTransform: "uppercase",
        }}>Worktrees</span>
      </Html>
      {WORKTREE_BARS.map((bar, i) => (
        <WorktreeBar key={`wt-${i}`}
          x={taskRightX} y={taskTopY - 0.3 - i * (barH + barGap)}
          targetWidth={bar.targetWidth} height={barH}
          label={bar.label} tokens={bar.tokens} color={bar.color}
          delay={1.0 + i * 0.15} />
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export function ProblemComparisonCanvas() {
  return (
    <div
      className="w-full rounded-xl border border-border-secondary overflow-hidden"
      style={{ height: "clamp(400px, 55vw, 620px)" }}
    >
      <Canvas
        orthographic
        camera={{ zoom: 60, position: [0, 0, 10], near: 0.1, far: 100 }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => { document.body.style.cursor = "auto"; }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
