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
import { ArrowRight, CircleCheck, CircleX, RotateCcw } from "lucide-react";

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

const BOX_SIZE = 2.2;
const BOX_HEIGHT = 1.6;
const BOX_GAP = 0.85;
const SECTION_WIDTH = BOX_SIZE * 3 + BOX_GAP * 2; // 8.8 — uniform width for both sections
const PRD_WIDTH = 1.6; // PRD is smaller (single orb)
const SUB_AGENT_H = 0.28;
const SUB_AGENT_GAP = 0.1;
const CENTER_Y = 0; // both modes render centered

// ---------------------------------------------------------------------------
// Sequential animation delays
// ---------------------------------------------------------------------------

const P = {
  header: 0.0,
  box: (i: number) => 0.4 + i * 0.8,
  atoms: (i: number) => 0.6 + i * 0.8,
  subAgents: (i: number) => 0.8 + i * 0.8,
  disconnect: 2.8,
  tokens: 3.3,
};

const K = {
  header: 0.0,
  researchBox: 0.4,
  researchNodes: 0.6,
  seamCheck: (i: number) => 1.0 + i * 0.8,
  prdBox: 1.2,
  prdOrb: 1.4,
  taskBox: 2.0,
  taskNodes: 2.2,
  worktreeConn: (i: number) => 2.6 + i * 0.1,
  worktreeBar: (i: number) => 2.8 + i * 0.2,
  tokens: 3.6,
};

const C = {
  boxBorder: "#44403a",
  boxFill: "#0d0d0d",
  nodeLight: "#e7e5e2",
  nodeMid: "#a8a29e",
  nodeDim: "#78716c",
  brand: "#fe5102",
  brandGlow: "#ff7a38",
  taskNode: "#ff7a38",
  dimRed: "#8b4a4a",
  redBg: "#3a1c1c",
  dimOrange: "#6b3a1a",
  orangeBg: "rgba(101, 52, 22, 0.4)",
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
  [{ label: "50K", width: 0.58 }, { label: "70K", width: 0.58 }, { label: "20K", width: 0.58 }],
  [{ label: "20K", width: 0.58 }, { label: "30K", width: 0.58 }, { label: "40K", width: 0.58 }],
  [{ label: "30K", width: 0.58 }, { label: "70K", width: 0.58 }],
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
  segments: string[];
  color: string;
}

const WORKTREE_BARS: WorktreeBarDef[] = [
  { label: "Wave 1", targetWidth: 2.2, segments: ["800K", "200K", "1M"], color: C.brand },
  { label: "Wave 2", targetWidth: 2.2, segments: ["1.2M", "400K"], color: C.brandGlow },
  { label: "Wave 3", targetWidth: 2.2, segments: ["2M", "600K", "400K"], color: C.brand },
];

// ---------------------------------------------------------------------------
// Floating Node — bouncy atom
// ---------------------------------------------------------------------------

function FloatingNode({
  node, visible, stageDelay, containerCenter, containerHalfW, containerHalfH, topInset = 0,
}: {
  node: NodeDef; visible: boolean; stageDelay: number;
  containerCenter: [number, number]; containerHalfW: number; containerHalfH: number;
  topInset?: number;
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
        const limitX = containerHalfW - node.radius - 0.08;
        const limitYBottom = containerHalfH - node.radius - 0.08;
        const limitYTop = containerHalfH - topInset - node.radius - 0.08;
        const yOffset = -topInset / 2; // shift center down when top is inset
        meshRef.current.position.x =
          containerCenter[0] + Math.max(-limitX, Math.min(limitX, node.baseX + dx));
        meshRef.current.position.y =
          containerCenter[1] + yOffset + Math.max(-limitYBottom, Math.min(limitYTop, node.baseY + dy));
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
      position={[containerCenter[0] + node.baseX, containerCenter[1] - topInset / 2 + node.baseY, 0.1]}
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

function ContextBox({ box, delay, borderColor, tokenLabel }: {
  box: BoxDef; delay: number; borderColor?: string; tokenLabel?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const fillRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLSpanElement>(null);
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
    if (tokenRef.current) tokenRef.current.style.opacity = String(p);
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
      {/* Upper-right token label inside the box */}
      {tokenLabel && (
        <Html
          position={[box.width / 2 - 0.12, box.height / 2 - 0.12, 0]}
          style={{ pointerEvents: "none" }}
        >
          <span ref={tokenRef} style={{
            fontFamily: "var(--font-mono, monospace)", fontSize: "8px", color: C.nodeDim,
            whiteSpace: "nowrap", opacity: 0, transform: "translateX(-100%)", display: "inline-block",
          }}>
            {tokenLabel}
          </span>
        </Html>
      )}
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
          lineHeight: 1, display: "block",
        }}>{label}</span>
      </Html>
    </group>
  );
}

// Connector line from session box bottom to sub-agent
function SubAgentConnector({ fromX, fromY, toX, toY, delay, color = C.nodeDim }: {
  fromX: number; fromY: number; toX: number; toY: number; delay: number; color?: string;
}) {
  const progressRef = useRef(0);
  const startTime = useRef<number | null>(null);

  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(fromX, fromY, 0), new THREE.Vector3(toX, toY, 0),
    ]);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 });
    return new THREE.Line(geo, mat);
  }, [fromX, fromY, toX, toY, color]);

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
  variant: "error" | "success" | "brand";
}) {
  const progressRef = useRef(0);
  const startTime = useRef<number | null>(null);
  const [opacity, setOpacity] = useState(0);

  const lineColor = variant === "error" ? C.dimRed : variant === "brand" ? C.dimOrange : C.greenDim;

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
            borderRadius: "50%",
            background: variant === "brand" ? C.orangeBg : "rgba(22, 101, 52, 0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CircleCheck size={16} color={variant === "brand" ? C.brand : C.green} strokeWidth={2} />
          </div>
        )}
      </Html>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Green check icon at KARIMO box seams
// ---------------------------------------------------------------------------

function SeamCheckIcon({ x, y, delay }: { x: number; y: number; delay: number }) {
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
    <Html position={[x, y, 0.2]} center style={{ pointerEvents: "none" }}>
      <div style={{
        opacity, width: "22px", height: "22px",
        borderRadius: "50%", background: "rgba(22, 101, 52, 0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <CircleCheck size={16} color={C.green} strokeWidth={2} />
      </div>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Worktree growing bars
// ---------------------------------------------------------------------------

function WorktreeBar({
  x, y, targetWidth, height, label, segments, color, delay,
}: {
  x: number; y: number; targetWidth: number; height: number;
  label: string; segments: string[]; color: string; delay: number;
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
      <Html position={[-targetWidth / 2 + 0.08, 0, 0]} style={{ pointerEvents: "none" }}>
        <div style={{
          display: "flex", alignItems: "center",
          opacity: labelOpacity, transition: "opacity 0.2s",
          whiteSpace: "nowrap",
        }}>
          <span style={{
            fontFamily: "var(--font-mono, monospace)", fontSize: "8px",
            color: C.nodeMid, paddingRight: "6px",
          }}>{label}</span>
          {segments.map((seg, i) => (
            <span key={i} style={{
              fontFamily: "var(--font-mono, monospace)", fontSize: "7px",
              color: C.nodeDim,
              borderLeft: `1px solid ${color}`,
              paddingLeft: "4px", paddingRight: "4px",
              opacity: 0.8,
            }}>{seg}</span>
          ))}
        </div>
      </Html>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Section header bar (full width, title left / effective tokens right)
// ---------------------------------------------------------------------------

function SectionHeader({
  y, title, titleColor, titleBorderColor, effectiveTokens, tokensColor, delay, tokensDelay, width,
}: {
  y: number; title: string; titleColor: string; titleBorderColor: string;
  effectiveTokens: string; tokensColor: string; delay: number; tokensDelay?: number; width: number;
}) {
  const [titleOpacity, setTitleOpacity] = useState(0);
  const [tokensOpacity, setTokensOpacity] = useState(0);
  const startTime = useRef<number | null>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;
    if (elapsed > delay) {
      const p = Math.min((elapsed - delay) * 2.5, 1);
      setTitleOpacity(1 - Math.pow(1 - p, 3));
    }
    const td = tokensDelay ?? delay;
    if (elapsed > td) {
      const p = Math.min((elapsed - td) * 2.5, 1);
      setTokensOpacity(1 - Math.pow(1 - p, 3));
    }
  });

  return (
    <Html position={[0, y, 0]} center style={{ pointerEvents: "none" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: `${width}px`, gap: "16px",
      }}>
        <div style={{
          opacity: titleOpacity,
          padding: "4px 14px", border: `1px solid ${titleBorderColor}`,
          borderRadius: "5px", fontSize: "12px", color: titleColor,
          fontFamily: "var(--font-accent, monospace)", background: "rgba(13, 13, 13, 0.9)",
          letterSpacing: "0.08em", whiteSpace: "nowrap", textTransform: "uppercase",
        }}>{title}</div>
        <div style={{
          opacity: tokensOpacity,
          display: "flex", alignItems: "baseline", gap: "6px",
        }}>
          <span style={{
            fontFamily: "var(--font-accent, monospace)", fontSize: width < 300 ? "7px" : "9px",
            color: C.labelColor, letterSpacing: "0.08em", textTransform: "uppercase",
          }}>Effective Tokens:</span>
          <span style={{
            fontFamily: "var(--font-accent, monospace)", fontSize: width < 300 ? "11px" : "14px",
            fontWeight: 700, color: tokensColor, letterSpacing: "0.02em",
          }}>{effectiveTokens}</span>
        </div>
      </div>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Pre-generated data
// ---------------------------------------------------------------------------

const PLAN_SESSION_NODES = [0, 1, 2].map((i) => makePlanSessionNodes(i));
const RESEARCH_NODES = makeResearchNodes();
const TASK_NODES = makeTaskNodes();

function getPlanBoxes(centerY: number): BoxDef[] {
  const w = BOX_SIZE;
  const h = BOX_HEIGHT;
  const g = BOX_GAP;
  const totalW = w * 3 + g * 2;
  const startX = -totalW / 2;
  return [0, 1, 2].map((i) => ({
    x: startX + i * (w + g),
    y: centerY - h / 2,
    width: w, height: h,
    label: `PLAN ${i + 1}`,
  }));
}

function getKarimoBoxes(centerY: number): BoxDef[] {
  const h = BOX_HEIGHT;
  const startX = -SECTION_WIDTH / 2;
  const rw = BOX_SIZE;   // Research — same as Plan boxes
  const pw = PRD_WIDTH;  // PRD — smaller
  const tw = BOX_SIZE;   // Task Briefs — same as Plan boxes
  return [
    { x: startX, y: centerY - h / 2, width: rw, height: h, label: "RESEARCH" },
    { x: startX + rw, y: centerY - h / 2, width: pw, height: h, label: "PRD" },
    { x: startX + rw + pw, y: centerY - h / 2, width: tw, height: h, label: "TASK BRIEFS" },
  ];
}

const KARIMO_TOKEN_LABELS = ["< 1M", "< 1M", "1M+"];

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

function Scene({ mode }: { mode: "plan" | "karimo" }) {
  const { viewport } = useThree();

  const scale = useMemo(() => {
    if (viewport.width < 5) return 0.32;
    if (viewport.width < 7) return 0.42;
    if (viewport.width < 10) return 0.725;
    return 0.9;
  }, [viewport.width]);

  // Header width in CSS pixels — uniform for both sections
  const headerWidth = useMemo(() => {
    return Math.round(SECTION_WIDTH * scale * 80);
  }, [scale]);

  const planBoxes = useMemo(() => getPlanBoxes(CENTER_Y), []);
  const karimoBoxes = useMemo(() => getKarimoBoxes(CENTER_Y), []);
  const halfW = BOX_SIZE / 2;
  const halfH = BOX_HEIGHT / 2;

  const planCenter = useCallback((i: number): [number, number] => {
    const b = planBoxes[i];
    return [b.x + b.width / 2, b.y + b.height / 2];
  }, [planBoxes]);

  const karimoCenter = useCallback((i: number): [number, number] => {
    const b = karimoBoxes[i];
    return [b.x + b.width / 2, b.y + b.height / 2];
  }, [karimoBoxes]);

  // Worktree bar area
  const taskRightX = karimoBoxes[2].x + karimoBoxes[2].width + 0.4;
  const barH = 0.38;
  const barGap = 0.18;
  const totalBarsH = WORKTREE_BARS.length * barH + (WORKTREE_BARS.length - 1) * barGap;
  const barStartY = CENTER_Y + totalBarsH / 2 - barH / 2;

  const karimoBoxDelays = [K.researchBox, K.prdBox, K.taskBox];

  return (
    <group scale={[scale, scale, scale]} position={[0, 0, 0]}>
      <ambientLight intensity={1.0} />

      {/* ================================================================= */}
      {/* PLAN MODE */}
      {/* ================================================================= */}

      {mode === "plan" && (
        <>
          <SectionHeader
            y={CENTER_Y + BOX_HEIGHT / 2 + 0.5}
            title="Plan Mode"
            titleColor={C.labelColor}
            titleBorderColor={C.boxBorder}
            effectiveTokens="1 – 2M"
            tokensColor={C.labelColor}
            delay={P.header}
            tokensDelay={P.tokens}
            width={headerWidth}
          />

          {/* Session boxes */}
          {planBoxes.map((box, i) => (
            <ContextBox key={`pb-${i}`} box={box} delay={P.box(i)} tokenLabel="1M" />
          ))}

          {/* Bouncy atoms */}
          {PLAN_SESSION_NODES.map((nodes, boxIdx) =>
            nodes.map((node) => (
              <FloatingNode key={node.id} node={node} visible stageDelay={P.atoms(boxIdx)}
                containerCenter={planCenter(boxIdx)} containerHalfW={halfW} containerHalfH={halfH} />
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
              const ay = boxBottomY - SUB_AGENT_H / 2 - 0.08;
              offsetX += agent.width + SUB_AGENT_GAP;
              return (
                <group key={`sa-${boxIdx}-${agentIdx}`}>
                  <SubAgentConnector
                    fromX={boxCenterX} fromY={boxBottomY}
                    toX={ax} toY={ay + SUB_AGENT_H / 2}
                    delay={P.subAgents(boxIdx) + agentIdx * 0.05}
                  />
                  <SubAgentBlock x={ax} y={ay} width={agent.width} label={agent.label}
                    delay={P.subAgents(boxIdx) + agentIdx * 0.05} />
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
                y={CENTER_Y} delay={P.disconnect + i * 0.15} variant="error" />
            );
          })}
        </>
      )}

      {/* ================================================================= */}
      {/* KARIMO */}
      {/* ================================================================= */}

      {mode === "karimo" && (
        <>
          <SectionHeader
            y={CENTER_Y + BOX_HEIGHT / 2 + 0.5}
            title="KARIMO"
            titleColor={C.brand}
            titleBorderColor={C.brand}
            effectiveTokens="10 – 100M+"
            tokensColor={C.brand}
            delay={K.header}
            tokensDelay={K.tokens}
            width={headerWidth}
          />

          {/* Research, PRD, Task Briefs boxes */}
          {karimoBoxes.map((box, i) => (
            <ContextBox key={`kb-${i}`} box={box} delay={karimoBoxDelays[i]} borderColor={C.brand}
              tokenLabel={KARIMO_TOKEN_LABELS[i]} />
          ))}

          {/* Green check icons at box seams */}
          {[0, 1].map((i) => {
            const seamX = karimoBoxes[i].x + karimoBoxes[i].width;
            return (
              <SeamCheckIcon key={`sc-${i}`} x={seamX} y={CENTER_Y} delay={K.seamCheck(i)} />
            );
          })}

          {/* Research nodes */}
          {RESEARCH_NODES.map((node) => (
            <FloatingNode key={node.id} node={node} visible stageDelay={K.researchNodes}
              containerCenter={karimoCenter(0)} containerHalfW={karimoBoxes[0].width / 2} containerHalfH={halfH}
              topInset={0.3} />
          ))}

          {/* PRD Orb */}
          <PRDOrb containerCenter={karimoCenter(1)} delay={K.prdOrb} />

          {/* Task nodes */}
          {TASK_NODES.map((node) => (
            <FloatingNode key={node.id} node={node} visible stageDelay={K.taskNodes}
              containerCenter={karimoCenter(2)} containerHalfW={karimoBoxes[2].width / 2} containerHalfH={halfH}
              topInset={0.3} />
          ))}

          {/* Task Briefs → Worktree connectors */}
          {WORKTREE_BARS.map((_bar, i) => {
            const taskBox = karimoBoxes[2];
            const fromX = taskBox.x + taskBox.width;
            const fromY = CENTER_Y;
            const toX = taskRightX;
            const toY = barStartY - i * (barH + barGap);
            return (
              <SubAgentConnector key={`tw-${i}`}
                fromX={fromX} fromY={fromY}
                toX={toX} toY={toY}
                delay={K.worktreeConn(i)}
                color={C.brand}
              />
            );
          })}

          {/* Worktree bars */}
          {WORKTREE_BARS.map((bar, i) => (
            <WorktreeBar key={`wt-${i}`}
              x={taskRightX} y={barStartY - i * (barH + barGap)}
              targetWidth={bar.targetWidth} height={barH}
              label={bar.label} segments={bar.segments} color={bar.color}
              delay={K.worktreeBar(i)} />
          ))}
        </>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

const CANVAS_MIN_WIDTH = 720;

export function ProblemComparisonCanvas({ paused = false }: { paused?: boolean }) {
  const [sceneKey, setSceneKey] = useState(0);
  const [activeMode, setActiveMode] = useState<"plan" | "karimo">("plan");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => { if (el.scrollLeft > 10) setHasScrolled(true); };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleModeChange = (mode: "plan" | "karimo") => {
    if (mode !== activeMode) {
      setActiveMode(mode);
      setSceneKey((k) => k + 1);
      setHasScrolled(false);
      if (scrollRef.current) scrollRef.current.scrollLeft = 0;
    }
  };

  return (
    <div className="w-full rounded-xl border border-border-secondary overflow-hidden relative">
      {/* Sticky controls — always visible */}
      <div className="sticky left-0 top-0 z-10 pointer-events-none" style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
        {/* Mode toggle */}
        <div className="absolute top-3 right-14 flex rounded-lg border border-border-secondary bg-bg-secondary/80 backdrop-blur-sm overflow-hidden pointer-events-auto">
          <button
            onClick={() => handleModeChange("plan")}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors duration-200 ${
              activeMode === "plan"
                ? "bg-bg-primary text-fg-primary"
                : "text-fg-tertiary hover:text-fg-secondary"
            }`}
            style={{ fontFamily: "var(--font-body, sans-serif)" }}
          >
            Plan
          </button>
          <button
            onClick={() => handleModeChange("karimo")}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors duration-200 ${
              activeMode === "karimo"
                ? "bg-bg-primary text-fg-primary"
                : "text-fg-tertiary hover:text-fg-secondary"
            }`}
            style={{ fontFamily: "var(--font-body, sans-serif)" }}
          >
            Karimo
          </button>
        </div>

        {/* Restart */}
        <button
          onClick={() => { setSceneKey((k) => k + 1); setHasScrolled(false); }}
          className="absolute top-3 right-3 p-2 rounded-lg border border-border-secondary bg-bg-secondary/80 backdrop-blur-sm text-fg-tertiary hover:text-fg-primary hover:border-border-primary transition-colors duration-200 pointer-events-auto"
          aria-label="Replay animation"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Scrollable canvas area */}
      <div
        ref={scrollRef}
        className="overflow-x-auto overflow-y-hidden relative"
        style={{ height: isMobile ? 280 : "clamp(300px, 35vw, 425px)" }}
      >
        <div style={{ minWidth: isMobile ? CANVAS_MIN_WIDTH : "100%", height: "100%" }}>
          <Canvas
            orthographic
            camera={{ zoom: 80, position: [0, 0, 10], near: 0.1, far: 100 }}
            frameloop={paused ? "never" : "always"}
            dpr={[1, 1.5]}
            style={{ background: "transparent" }}
            gl={{ antialias: true, alpha: true }}
            onPointerMissed={() => { document.body.style.cursor = "auto"; }}
          >
            <Scene key={sceneKey} mode={activeMode} />
          </Canvas>
        </div>
      </div>

      {/* Scroll hint — mobile only */}
      {isMobile && !hasScrolled && (
        <div
          className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 text-fg-tertiary transition-opacity duration-500 pointer-events-none"
          style={{ fontFamily: "var(--font-body, sans-serif)", fontSize: "11px" }}
        >
          <span>Scroll right to see more</span>
          <ArrowRight size={12} />
        </div>
      )}
    </div>
  );
}
