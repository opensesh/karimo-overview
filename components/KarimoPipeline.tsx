"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Brand Tokens ───────────────────────────────────────────
const C = {
  black: "#000000",
  charcoal: "#191919",
  vanilla: "#FFFAEE",
  aperol: "#FE5102",
  black80: "#383838",
  black70: "#4A4A4A",
  black60: "#595959",
  black50: "#787878",
  black30: "#C7C7C7",
  black10: "#F0F0F0",
};

const FONTS = {
  medium: "https://www.opensesh.app/api/brand/assets/download/open-session/fonts/NeueHaasDisplayMedium 2.woff2",
  bold: "https://www.opensesh.app/api/brand/assets/download/open-session/fonts/NeueHaasDisplayBold.ttf",
  light: "https://www.opensesh.app/api/brand/assets/download/open-session/fonts/NeueHaasDisplayLight.woff2",
};

// ─── Timeline (ms) ~4.8s total ──────────────────────────────
const T = {
  research: 100, plan: 350, loop1In: 550, loop1End: 1500,
  run: 1600, tasks: 1800, autoReview: 2000, loop2In: 2200, loop2End: 3150,
  orchestrate: 3250, inspect: 3450, loop3In: 3650, loop3End: 4600,
  done: 4800,
};

interface Phase {
  id: string;
  label: string;
  sublabel: string;
  steps: string[];
  desc: string;
  loopStart: number;
  loopEnd: number;
  stepTimes: number[];
}

const PHASES: Phase[] = [
  {
    id: "loop1", label: "Loop 1", sublabel: "Human",
    steps: ["RESEARCH", "PLAN"],
    desc: "You define what to build. A structured interview captures requirements, the investigator scans your codebase, and a PRD is generated optimized for agent comprehension.",
    loopStart: T.loop1In, loopEnd: T.loop1End,
    stepTimes: [T.research, T.plan],
  },
  {
    id: "loop2", label: "Loop 2", sublabel: "Claude",
    steps: ["RUN", "TASKS", "AUTO-REVIEW"],
    desc: "Agents decompose the PRD into isolated task briefs, execute in parallel git worktrees, and Greptile auto-reviews each PR with revision loops.",
    loopStart: T.loop2In, loopEnd: T.loop2End,
    stepTimes: [T.run, T.tasks, T.autoReview],
  },
  {
    id: "loop3", label: "Loop 3", sublabel: "Configurable",
    steps: ["ORCHESTRATE", "INSPECT"],
    desc: "The review-architect validates integration across task PRs, reconciles conflicts, and prepares the feature branch for your final merge approval.",
    loopStart: T.loop3In, loopEnd: T.loop3End,
    stepTimes: [T.orchestrate, T.inspect],
  },
];

// ─── Clock ──────────────────────────────────────────────────
function useAnimClock(key: number) {
  const [now, setNow] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = performance.now();
    setNow(0);
    const tick = (t: number) => {
      setNow(t - (startRef.current ?? 0));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [key]);

  return now;
}

// ─── Chip ───────────────────────────────────────────────────
function Chip({ label, visible, glowing, dimmed }: {
  label: string;
  visible: boolean;
  glowing: boolean;
  dimmed: boolean;
}) {
  return (
    <div style={{
      padding: "7px 14px",
      border: `1.5px solid ${dimmed ? C.black70 : C.vanilla}`,
      borderRadius: "2px",
      fontFamily: "'NeueHaas', 'Helvetica Neue', sans-serif",
      fontWeight: 500,
      fontSize: "11.5px",
      letterSpacing: "0.14em",
      color: dimmed ? C.black60 : C.vanilla,
      opacity: visible ? 1 : 0,
      transform: visible ? "scale(1)" : "scale(0.88)",
      transition: "all 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
      whiteSpace: "nowrap",
      boxShadow: glowing
        ? `0 0 18px -3px rgba(255,250,238,0.12), inset 0 0 10px -3px rgba(255,250,238,0.05)`
        : "none",
    }}>
      {label}
    </div>
  );
}

// ─── Small arrow between chips ──────────────────────────────
function SmallArrow({ visible, dimmed }: { visible: boolean; dimmed: boolean }) {
  return (
    <svg width="18" height="8" viewBox="0 0 18 8" style={{
      opacity: visible ? (dimmed ? 0.15 : 0.4) : 0,
      transition: "opacity 0.25s ease",
      flexShrink: 0,
    }}>
      <line x1="0" y1="4" x2="12" y2="4" stroke={C.vanilla} strokeWidth="1" />
      <polyline points="10,1.5 14,4 10,6.5" fill="none" stroke={C.vanilla} strokeWidth="1" />
    </svg>
  );
}

// ─── Dashed arrow between phases ────────────────────────────
function PhaseArrow({ visible, dimmed }: { visible: boolean; dimmed: boolean }) {
  return (
    <svg width="24" height="8" viewBox="0 0 24 8" style={{
      opacity: visible ? (dimmed ? 0.1 : 0.3) : 0,
      transition: "opacity 0.3s ease",
      flexShrink: 0,
      alignSelf: "flex-start",
      marginTop: "10px",
    }}>
      <line x1="2" y1="4" x2="16" y2="4" stroke={C.vanilla} strokeWidth="1" strokeDasharray="3 2.5" />
      <polyline points="14,1.5 18,4 14,6.5" fill="none" stroke={C.vanilla} strokeWidth="1" />
    </svg>
  );
}

// ─── Angular Loop (line down, across, up) ───────────────────
function AngularLoop({ visible, looping, finished, width }: {
  visible: boolean;
  looping: boolean;
  finished: boolean;
  width: number;
}) {
  const h = 24;
  const inset = 16;
  const w = width;
  const pathD = `M ${w - inset} 0 L ${w - inset} ${h} L ${inset} ${h} L ${inset} 0`;
  const strokeColor = looping ? C.vanilla : C.black60;
  const op = visible ? (looping ? 1 : finished ? 0.22 : 0.5) : 0;

  return (
    <svg width={w} height={h + 6} viewBox={`0 -3 ${w} ${h + 9}`} style={{
      opacity: op,
      transition: "opacity 0.35s ease",
      overflow: "visible",
    }}>
      <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="1.5"
        style={{ filter: looping ? "drop-shadow(0 0 3px rgba(255,250,238,0.2))" : "none" }}
      />
      <polyline
        points={`${inset - 3.5},5 ${inset},-1 ${inset + 3.5},5`}
        fill="none" stroke={strokeColor} strokeWidth="1.5"
      />
      {looping && (
        <circle r="2" fill={C.aperol} style={{ filter: "drop-shadow(0 0 4px rgba(254,81,2,0.6))" }}>
          <animateMotion dur="0.55s" repeatCount="indefinite" path={pathD} />
        </circle>
      )}
    </svg>
  );
}

// ─── Phase Group ────────────────────────────────────────────
function PhaseGroup({ phase, now, focused, otherFocused, onFocus }: {
  phase: Phase;
  now: number;
  focused: boolean;
  otherFocused: boolean;
  onFocus: (id: string | null) => void;
}) {
  const isLooping = now >= phase.loopStart && now < phase.loopEnd;
  const isFinished = now >= phase.loopEnd;
  const isFocused = focused;

  const chipCount = phase.steps.length;
  const arrowCount = chipCount - 1;
  const estW = chipCount * 80 + arrowCount * 24;

  return (
    <div
      onClick={() => onFocus(isFocused ? null : phase.id)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        cursor: now >= T.done ? "pointer" : "default",
        transform: isFocused ? "scale(1.22)" : otherFocused ? "scale(0.78)" : "scale(1)",
        opacity: otherFocused ? 0.2 : 1,
        transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
        zIndex: isFocused ? 10 : 1,
        position: "relative",
      }}
    >
      {/* Steps */}
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        {phase.steps.map((step, i) => (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Chip
              label={step}
              visible={now >= phase.stepTimes[i]}
              glowing={isLooping}
              dimmed={otherFocused}
            />
            {i < chipCount - 1 && (
              <SmallArrow visible={now >= phase.stepTimes[i + 1]} dimmed={otherFocused} />
            )}
          </div>
        ))}
      </div>

      {/* Angular loop */}
      <AngularLoop
        visible={now >= phase.loopStart}
        looping={isLooping}
        finished={isFinished}
        width={estW}
      />

      {/* Label */}
      <div style={{
        opacity: now >= phase.loopStart ? 1 : 0,
        transform: now >= phase.loopStart ? "translateY(0)" : "translateY(5px)",
        transition: "all 0.4s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0px",
        marginTop: "-2px",
      }}>
        <span style={{
          fontFamily: "'NeueHaas', 'Helvetica Neue', sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "0.08em",
          color: isLooping ? C.vanilla : C.black50,
          transition: "color 0.3s ease",
        }}>
          {phase.label}
        </span>
        <span style={{
          fontFamily: "'NeueHaasLight', 'Helvetica Neue', sans-serif",
          fontSize: "13px",
          fontWeight: 300,
          letterSpacing: "0.04em",
          color: isLooping ? C.black30 : C.black60,
          transition: "color 0.3s ease",
        }}>
          {phase.sublabel}
        </span>
      </div>

      {/* Description on focus */}
      {isFocused && (
        <div style={{
          marginTop: "10px",
          maxWidth: "260px",
          fontFamily: "'NeueHaasLight', 'Helvetica Neue', sans-serif",
          fontSize: "11px",
          lineHeight: 1.6,
          color: C.black30,
          textAlign: "center",
          letterSpacing: "0.015em",
          animation: "fadeUp 0.35s ease",
        }}>
          {phase.desc}
        </div>
      )}
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────
export function KarimoPipeline() {
  const [runKey, setRunKey] = useState(0);
  const [focusedPhase, setFocusedPhase] = useState<string | null>(null);
  const now = useAnimClock(runKey);

  const replay = useCallback(() => {
    setFocusedPhase(null);
    setRunKey((k) => k + 1);
  }, []);

  const s = (ms: number) => now >= ms;

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'NeueHaas';
          src: url('${FONTS.medium}') format('woff2');
          font-weight: 500; font-display: swap;
        }
        @font-face {
          font-family: 'NeueHaasBold';
          src: url('${FONTS.bold}') format('truetype');
          font-weight: 700; font-display: swap;
        }
        @font-face {
          font-family: 'NeueHaasLight';
          src: url('${FONTS.light}') format('woff2');
          font-weight: 300; font-display: swap;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        width: "100%",
        minHeight: "100vh",
        background: C.black,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        padding: "60px 20px",
      }}>
        {/* Noise */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.025, pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }} />

        {/* Title */}
        <div style={{
          position: "absolute",
          top: "28px",
          fontFamily: "'NeueHaasLight', 'Helvetica Neue', sans-serif",
          fontSize: "9.5px",
          letterSpacing: "0.35em",
          color: C.black60,
          textTransform: "uppercase",
          opacity: s(100) ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}>
          KARIMO — HOW IT WORKS
        </div>

        {/* Pipeline */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {PHASES.map((phase, i) => (
            <div key={phase.id} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <PhaseGroup
                phase={phase}
                now={now}
                focused={focusedPhase === phase.id}
                otherFocused={focusedPhase !== null && focusedPhase !== phase.id}
                onFocus={setFocusedPhase}
              />
              {i < PHASES.length - 1 && (
                <PhaseArrow
                  visible={s(PHASES[i + 1].stepTimes[0])}
                  dimmed={focusedPhase !== null && focusedPhase !== PHASES[i + 1].id}
                />
              )}
            </div>
          ))}
        </div>

        {/* Phase toggle tabs */}
        {s(T.done) && (
          <div style={{
            display: "flex",
            gap: "8px",
            marginTop: "32px",
            animation: "fadeUp 0.4s ease",
          }}>
            {PHASES.map((p) => {
              const active = focusedPhase === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setFocusedPhase(active ? null : p.id)}
                  style={{
                    fontFamily: "'NeueHaas', 'Helvetica Neue', sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.13em",
                    textTransform: "uppercase",
                    color: active ? C.vanilla : C.black50,
                    background: active ? "rgba(255,250,238,0.06)" : "transparent",
                    border: `1px solid ${active ? C.black50 : C.black80}`,
                    borderRadius: "2px",
                    padding: "5px 12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = C.black60;
                      e.currentTarget.style.color = C.black30;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.borderColor = C.black80;
                      e.currentTarget.style.color = C.black50;
                    }
                  }}
                >
                  {p.sublabel}
                </button>
              );
            })}
          </div>
        )}

        {/* Replay */}
        {s(T.done + 500) && (
          <button
            onClick={replay}
            style={{
              position: "absolute",
              bottom: "24px",
              fontFamily: "'NeueHaas', 'Helvetica Neue', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: C.black60,
              background: "none",
              border: `1px solid ${C.black80}`,
              borderRadius: "2px",
              padding: "5px 14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.black50;
              e.currentTarget.style.color = C.vanilla;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.black80;
              e.currentTarget.style.color = C.black60;
            }}
          >
            REPLAY
          </button>
        )}
      </div>
    </>
  );
}

export default KarimoPipeline;
