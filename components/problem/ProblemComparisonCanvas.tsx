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

const BOX_W = 1.6;
const BOX_H = 1.6;
const BOX_GAP = 0.2;

const C = {
  boxBorder: "#44403a",
  boxFill: "#0d0d0d",
  nodeLight: "#e7e5e2",
  nodeMid: "#a8a29e",
  nodeDim: "#78716c",
  brand: "#fe5102",
  brandGlow: "#ff7a38",
  dimRed: "#6b3a3a",
  labelColor: "#78716c",
};

// ---------------------------------------------------------------------------
// Node generators — bouncy atoms (mirrors ContextMultiplicationCanvas)
// ---------------------------------------------------------------------------

function makeSessionNodes(sessionIndex: number, side: "left" | "right"): NodeDef[] {
  const prefix = `${side}-s${sessionIndex}`;
  const s = (sessionIndex * 3 + 1) * 137.5;

  // Main context node
  const mainNode: NodeDef = {
    id: `${prefix}-main`,
    label: "~1M tokens",
    baseX: 0,
    baseY: 0.15,
    radius: 0.18,
    color: C.nodeLight,
    phaseX: s % 6.28,
    phaseY: (s * 1.3) % 6.28,
    speedX: 0.6 + sessionIndex * 0.12,
    speedY: 0.8 + sessionIndex * 0.1,
    ampX: 0.06,
    ampY: 0.06,
    delay: 0.1,
  };

  // Sub-agent nodes
  const subLabels = ["70K", "50K", "20K"];
  const subColors =
    side === "right"
      ? [C.brand, C.nodeMid, C.brandGlow]
      : [C.nodeDim, C.nodeDim, C.nodeDim];

  const subNodes: NodeDef[] = subLabels.map((label, i) => {
    const si = (sessionIndex * 3 + i + 5) * 97.3;
    return {
      id: `${prefix}-sub${i}`,
      label: `${label}`,
      baseX: -0.35 + i * 0.35,
      baseY: -0.25,
      radius: 0.09 + (si % 5) * 0.004,
      color: subColors[i],
      phaseX: si % 6.28,
      phaseY: (si * 1.7) % 6.28,
      speedX: 1.1 + (si % 3) * 0.3,
      speedY: 0.9 + (si % 4) * 0.25,
      ampX: 0.07 + (si % 4) * 0.008,
      ampY: 0.07 + (si % 3) * 0.01,
      delay: 0.15 + i * 0.05,
    };
  });

  return [mainNode, ...subNodes];
}

// ---------------------------------------------------------------------------
// Box layouts for each side
// ---------------------------------------------------------------------------

function getLeftBoxes(): BoxDef[] {
  const totalW = BOX_W * 3 + BOX_GAP * 2;
  const startX = -totalW / 2;
  return [0, 1, 2].map((i) => ({
    x: startX + i * (BOX_W + BOX_GAP),
    y: -BOX_H / 2,
    width: BOX_W,
    height: BOX_H,
    label: `SESSION ${i + 1}`,
  }));
}

function getRightBoxes(): BoxDef[] {
  const totalH = BOX_H * 3 + BOX_GAP * 2;
  const startY = totalH / 2 - BOX_H;
  return [0, 1, 2].map((i) => ({
    x: -BOX_W / 2,
    y: startY - i * (BOX_H + BOX_GAP),
    width: BOX_W,
    height: BOX_H,
    label: `WAVE ${i + 1}`,
  }));
}

// ---------------------------------------------------------------------------
// Floating Node — bouncy atom behavior (same as ContextMultiplicationCanvas)
// ---------------------------------------------------------------------------

function FloatingNode({
  node,
  visible,
  stageDelay,
  containerCenter,
  containerHalfW,
  containerHalfH,
}: {
  node: NodeDef;
  visible: boolean;
  stageDelay: number;
  containerCenter: [number, number];
  containerHalfW: number;
  containerHalfH: number;
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

        // Bouncy atom — multiple sin waves layered for organic motion
        let dx = Math.sin(ft * node.speedX + node.phaseX) * node.ampX;
        dx += Math.sin(ft * node.speedX * 1.7 + node.phaseY) * node.ampX * 0.4;

        let dy = Math.sin(ft * node.speedY + node.phaseY) * node.ampY;
        dy += Math.sin(ft * node.speedY * 1.3 + node.phaseX) * node.ampY * 0.5;

        const limitX = containerHalfW - node.radius - 0.08;
        const limitY = containerHalfH - node.radius - 0.08;
        const rawX = node.baseX + dx;
        const rawY = node.baseY + dy;
        meshRef.current.position.x =
          containerCenter[0] + Math.max(-limitX, Math.min(limitX, rawX));
        meshRef.current.position.y =
          containerCenter[1] + Math.max(-limitY, Math.min(limitY, rawY));
      }
    } else {
      scaleRef.current *= 0.85;
    }

    const s = scaleRef.current;
    meshRef.current.scale.set(s, s, s);
  });

  const handlePointerOver = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHovered(true);
      document.body.style.cursor = "pointer";
    },
    []
  );

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "auto";
  }, []);

  if (!visible && scaleRef.current < 0.01) return null;

  return (
    <mesh
      ref={meshRef}
      position={[
        containerCenter[0] + node.baseX,
        containerCenter[1] + node.baseY,
        0.1,
      ]}
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
// Context Box (same pattern as ContextMultiplicationCanvas)
// ---------------------------------------------------------------------------

function ContextBox({
  box,
  delay,
  borderColor,
}: {
  box: BoxDef;
  delay: number;
  borderColor?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const fillRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;
  }, [box.x, box.y]);

  const geo = useMemo(
    () => new THREE.PlaneGeometry(box.width, box.height),
    [box.width, box.height]
  );
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
    <group
      ref={groupRef}
      position={[box.x + box.width / 2, box.y + box.height / 2, 0]}
    >
      <mesh ref={fillRef} geometry={geo}>
        <meshBasicMaterial color={C.boxFill} transparent opacity={0} />
      </mesh>
      <lineSegments ref={edgesRef} geometry={edgeGeo}>
        <lineBasicMaterial
          color={borderColor ?? C.boxBorder}
          transparent
          opacity={0}
        />
      </lineSegments>
      <Html
        position={[0, -box.height / 2 - 0.2, 0]}
        center
        style={{ pointerEvents: "none" }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: "var(--font-accent)",
            fontSize: "9px",
            color: borderColor ?? C.labelColor,
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
// Dashed disconnect line between left-side boxes
// ---------------------------------------------------------------------------

function DisconnectLine({
  fromX,
  fromY,
  toX,
  toY,
  delay,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  delay: number;
}) {
  const progressRef = useRef(0);
  const startTime = useRef<number | null>(null);

  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(fromX, fromY, 0),
      new THREE.Vector3(toX, toY, 0),
    ]);
    const mat = new THREE.LineDashedMaterial({
      color: C.nodeDim,
      transparent: true,
      opacity: 0,
      dashSize: 0.08,
      gapSize: 0.06,
    });
    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    return line;
  }, [fromX, fromY, toX, toY]);

  useEffect(() => {
    return () => {
      lineObj.geometry.dispose();
      (lineObj.material as THREE.Material).dispose();
    };
  }, [lineObj]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (startTime.current === null) startTime.current = t;
    const elapsed = t - startTime.current;
    if (elapsed > delay) {
      const p = Math.min((elapsed - delay) * 2.5, 1);
      progressRef.current = 1 - Math.pow(1 - p, 3);
    }
    if (lineObj.material instanceof THREE.LineDashedMaterial) {
      lineObj.material.opacity = progressRef.current * 0.6;
    }
  });

  return <primitive object={lineObj} />;
}

// ---------------------------------------------------------------------------
// X marker between disconnected sessions
// ---------------------------------------------------------------------------

function DisconnectMarker({
  x,
  y,
  delay,
}: {
  x: number;
  y: number;
  delay: number;
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
    <Html position={[x, y, 0]} center style={{ pointerEvents: "none" }}>
      <span
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "14px",
          fontWeight: 700,
          color: C.dimRed,
          opacity,
        }}
      >
        ✗
      </span>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Connection arrow between right-side boxes (same as WorktreeArrow)
// ---------------------------------------------------------------------------

function ConnectionArrow({
  fromX,
  fromY,
  toX,
  toY,
  delay,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  delay: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  const allPoints = useMemo(() => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const midY = fromY + dy * 0.5;

    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(fromX, fromY, 0),
      new THREE.Vector3(fromX + dx * 0.1, midY, 0),
      new THREE.Vector3(toX - dx * 0.1, midY, 0),
      new THREE.Vector3(toX, toY, 0)
    );
    return curve.getPoints(40);
  }, [fromX, fromY, toX, toY]);

  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(allPoints);
    const mat = new THREE.LineBasicMaterial({
      color: C.brand,
      transparent: true,
      opacity: 0,
    });
    return new THREE.Line(geo, mat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromX, fromY, toX, toY]);

  const arrowObj = useMemo(() => {
    const size = 0.07;
    const pts = [
      new THREE.Vector3(toX - size, toY + size * 1.2, 0),
      new THREE.Vector3(toX, toY, 0),
      new THREE.Vector3(toX + size, toY + size * 1.2, 0),
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: C.brand,
      transparent: true,
      opacity: 0,
    });
    return new THREE.Line(geo, mat);
  }, [toX, toY]);

  useEffect(() => {
    return () => {
      lineObj.geometry.dispose();
      (lineObj.material as THREE.Material).dispose();
      arrowObj.geometry.dispose();
      (arrowObj.material as THREE.Material).dispose();
    };
  }, [lineObj, arrowObj]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (startTimeRef.current === null) startTimeRef.current = t;
    const elapsed = t - startTimeRef.current;
    if (elapsed > delay) {
      const p = Math.min((elapsed - delay) * 2.0, 1);
      progressRef.current = 1 - Math.pow(1 - p, 3);
    }

    const lp = progressRef.current;

    const count = Math.max(2, Math.floor(allPoints.length * lp));
    const visible = allPoints.slice(0, count);
    lineObj.geometry.dispose();
    lineObj.geometry = new THREE.BufferGeometry().setFromPoints(visible);
    if (lineObj.material instanceof THREE.LineBasicMaterial) {
      lineObj.material.opacity = lp * 0.65;
    }

    if (arrowObj.material instanceof THREE.LineBasicMaterial) {
      arrowObj.material.opacity = lp > 0.4 ? lp * 0.65 : 0;
    }

    if (groupRef.current) {
      groupRef.current.visible = lp > 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={lineObj} />
      <primitive object={arrowObj} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Check marker between connected sessions
// ---------------------------------------------------------------------------

function ConnectMarker({
  x,
  y,
  delay,
}: {
  x: number;
  y: number;
  delay: number;
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
    <Html position={[x, y, 0]} center style={{ pointerEvents: "none" }}>
      <span
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "14px",
          fontWeight: 700,
          color: C.brand,
          opacity,
        }}
      >
        ✓
      </span>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Side labels
// ---------------------------------------------------------------------------

function SideLabel({
  x,
  y,
  text,
  color,
  borderColor,
  delay,
}: {
  x: number;
  y: number;
  text: string;
  color: string;
  borderColor: string;
  delay: number;
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
    <Html position={[x, y, 0]} center style={{ pointerEvents: "none" }}>
      <div
        style={{
          opacity,
          padding: "4px 12px",
          border: `1px solid ${borderColor}`,
          borderRadius: "5px",
          fontSize: "11px",
          color,
          fontFamily: "var(--font-accent, monospace)",
          background: "rgba(13, 13, 13, 0.9)",
          letterSpacing: "0.08em",
          whiteSpace: "nowrap",
          textTransform: "uppercase",
        }}
      >
        {text}
      </div>
    </Html>
  );
}

// ---------------------------------------------------------------------------
// Pre-generated node data
// ---------------------------------------------------------------------------

const LEFT_NODES = [0, 1, 2].map((i) => makeSessionNodes(i, "left"));
const RIGHT_NODES = [0, 1, 2].map((i) => makeSessionNodes(i, "right"));
const LEFT_BOXES = getLeftBoxes();
const RIGHT_BOXES = getRightBoxes();

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

function Scene() {
  const { viewport } = useThree();

  const scale = useMemo(() => {
    if (viewport.width < 5) return 0.32;
    if (viewport.width < 7) return 0.42;
    if (viewport.width < 10) return 0.58;
    return 0.7;
  }, [viewport.width]);

  const isMobile = viewport.width < 7;

  // On mobile, stack the two panels vertically
  const leftOffset: [number, number, number] = isMobile
    ? [0, 1.8, 0]
    : [-3.2, 0, 0];
  const rightOffset: [number, number, number] = isMobile
    ? [0, -2.8, 0]
    : [3.2, 0, 0];

  const leftBoxHalfW = BOX_W / 2;
  const leftBoxHalfH = BOX_H / 2;
  const rightBoxHalfW = BOX_W / 2;
  const rightBoxHalfH = BOX_H / 2;

  return (
    <group scale={[scale, scale, scale]} position={[0, isMobile ? 0.5 : 0.1, 0]}>
      <ambientLight intensity={1.0} />

      {/* ---- LEFT SIDE: Plan Mode (disconnected) ---- */}
      <group position={leftOffset}>
        <SideLabel
          x={0}
          y={BOX_H / 2 + 0.5}
          text="Plan Mode"
          color={C.labelColor}
          borderColor={C.boxBorder}
          delay={0}
        />

        {LEFT_BOXES.map((box, i) => (
          <ContextBox key={`lb-${i}`} box={box} delay={i * 0.15} />
        ))}

        {LEFT_NODES.map((nodes, boxIdx) => {
          const box = LEFT_BOXES[boxIdx];
          const center: [number, number] = [
            box.x + box.width / 2,
            box.y + box.height / 2,
          ];
          return nodes.map((node) => (
            <FloatingNode
              key={node.id}
              node={node}
              visible
              stageDelay={0.25 + boxIdx * 0.2}
              containerCenter={center}
              containerHalfW={leftBoxHalfW}
              containerHalfH={leftBoxHalfH}
            />
          ));
        })}

        {/* Dashed lines + X markers between boxes */}
        {[0, 1].map((i) => {
          const fromBox = LEFT_BOXES[i];
          const toBox = LEFT_BOXES[i + 1];
          const fromX = fromBox.x + fromBox.width;
          const toX = toBox.x;
          const midX = (fromX + toX) / 2;
          const midY = fromBox.y + fromBox.height / 2;
          return (
            <group key={`disc-${i}`}>
              <DisconnectLine
                fromX={fromX + 0.02}
                fromY={midY}
                toX={toX - 0.02}
                toY={midY}
                delay={0.4 + i * 0.15}
              />
              <DisconnectMarker
                x={midX}
                y={midY + 0.22}
                delay={0.5 + i * 0.15}
              />
            </group>
          );
        })}
      </group>

      {/* ---- RIGHT SIDE: KARIMO (connected) ---- */}
      <group position={rightOffset}>
        <SideLabel
          x={0}
          y={RIGHT_BOXES[0].y + RIGHT_BOXES[0].height + 0.4}
          text="KARIMO"
          color={C.brand}
          borderColor={C.brand}
          delay={0.5}
        />

        {RIGHT_BOXES.map((box, i) => (
          <ContextBox
            key={`rb-${i}`}
            box={box}
            delay={0.5 + i * 0.15}
            borderColor={C.brand}
          />
        ))}

        {RIGHT_NODES.map((nodes, boxIdx) => {
          const box = RIGHT_BOXES[boxIdx];
          const center: [number, number] = [
            box.x + box.width / 2,
            box.y + box.height / 2,
          ];
          return nodes.map((node) => (
            <FloatingNode
              key={node.id}
              node={node}
              visible
              stageDelay={0.7 + boxIdx * 0.2}
              containerCenter={center}
              containerHalfW={rightBoxHalfW}
              containerHalfH={rightBoxHalfH}
            />
          ));
        })}

        {/* Solid connection arrows + check markers between boxes */}
        {[0, 1].map((i) => {
          const fromBox = RIGHT_BOXES[i];
          const toBox = RIGHT_BOXES[i + 1];
          const fromX = fromBox.x + fromBox.width / 2;
          const fromY = fromBox.y;
          const toX = toBox.x + toBox.width / 2;
          const toY = toBox.y + toBox.height;
          const midX = (fromX + toX) / 2 + 0.3;
          const midY = (fromY + toY) / 2;
          return (
            <group key={`conn-${i}`}>
              <ConnectionArrow
                fromX={fromX}
                fromY={fromY - 0.02}
                toX={toX}
                toY={toY + 0.02}
                delay={0.8 + i * 0.2}
              />
              <ConnectMarker
                x={midX}
                y={midY}
                delay={1.0 + i * 0.2}
              />
            </group>
          );
        })}
      </group>
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
      style={{ height: "clamp(280px, 38vw, 440px)" }}
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
        <Scene />
      </Canvas>
    </div>
  );
}
