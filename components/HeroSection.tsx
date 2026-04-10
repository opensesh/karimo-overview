"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { KARIMO_ASCII_ART } from "@/lib/constants";
import { ClaudeFeatures } from "@/components/orchestration/ClaudeFeatures";
import { BackgroundPlus } from "@/components/ui/BackgroundPlus";

function useMeshGradient(sectionRef: React.RefObject<HTMLElement | null>) {
  const meshRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 50, y: 50 });
  const current = useRef({ x: 50, y: 50 });
  const raf = useRef<number>(0);

  const lerp = useCallback(() => {
    const ease = 0.04;
    current.current.x += (mouse.current.x - current.current.x) * ease;
    current.current.y += (mouse.current.y - current.current.y) * ease;

    const cx = current.current.x;
    const cy = current.current.y;

    if (meshRef.current) {
      meshRef.current.style.background = [
        `radial-gradient(ellipse 80% 60% at ${cx}% ${cy}%, var(--bg-brand-subtle) 0%, transparent 70%)`,
        `radial-gradient(ellipse 60% 50% at ${100 - cx}% ${100 - cy}%, var(--bg-tertiary) 0%, transparent 60%)`,
        `radial-gradient(ellipse 100% 80% at 50% 50%, var(--bg-secondary) 0%, transparent 80%)`,
      ].join(", ");
    }

    raf.current = requestAnimationFrame(lerp);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 100;
      mouse.current.y = ((e.clientY - rect.top) / rect.height) * 100;
    };

    const onLeave = () => {
      mouse.current.x = 50;
      mouse.current.y = 50;
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(lerp);

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [sectionRef, lerp]);

  return meshRef;
}

interface HeroSectionProps {
  version?: string | null;
}

function useVersion(serverVersion?: string | null) {
  const [version, setVersion] = useState(serverVersion ?? null);
  const [loading, setLoading] = useState(!serverVersion);

  useEffect(() => {
    if (serverVersion) return;

    fetch("https://api.github.com/repos/opensesh/KARIMO/releases/latest", {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.tag_name) setVersion(data.tag_name);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [serverVersion]);

  return { version, loading };
}

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroSection({ version: serverVersion }: HeroSectionProps) {
  const { version, loading } = useVersion(serverVersion);
  const sectionRef = useRef<HTMLElement>(null);
  const meshRef = useMeshGradient(sectionRef);
  return (
    <section
      ref={sectionRef}
      id="overview"
      className="relative bg-bg-secondary overflow-hidden pt-40 pb-12 px-6 min-h-screen flex flex-col justify-center"
    >
      {/* Layer 1: Plus pattern background */}
      <BackgroundPlus />

      {/* Layer 2: Dark color mesh (follows mouse with drag) */}
      <div
        ref={meshRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 80% 60% at 50% 50%, var(--bg-brand-subtle) 0%, transparent 70%)",
            "radial-gradient(ellipse 60% 50% at 50% 50%, var(--bg-tertiary) 0%, transparent 60%)",
            "radial-gradient(ellipse 100% 80% at 50% 50%, var(--bg-secondary) 0%, transparent 80%)",
          ].join(", "),
          opacity: 0.25,
        }}
      />

      {/* Layer 3: Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      {/* Layer 4: Content */}
      <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center text-center">
        {/* ASCII Art — desktop */}
        <div className="hidden sm:flex flex-col items-center relative">
          {KARIMO_ASCII_ART.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)", scale: 0.97 }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.3 + i * 0.08,
                ease,
              }}
              className="font-mono text-aperol whitespace-pre leading-tight select-none"
              style={{ fontSize: "clamp(0.35rem, 1.1vw, 0.75rem)" }}
            >
              {line}
            </motion.div>
          ))}
        </div>

        {/* ASCII Art — mobile fallback */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="sm:hidden font-display font-bold text-4xl text-aperol tracking-tight"
        >
          KARIMO
        </motion.h1>

        {/* Badge chips */}
        <div className="flex flex-wrap justify-center gap-3 mt-6 relative">
          {[
            { label: "License", value: "Apache 2.0" },
            {
              label: "version",
              value: loading ? null : (version ?? "—"),
            },
            { label: "Claude Code", value: "Framework & Plugin" },
          ].map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.9 + i * 0.1,
                ease,
                scale: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.9 + i * 0.1,
                },
              }}
              className="flex items-stretch rounded overflow-hidden border border-border-secondary text-xs font-mono"
            >
              <span className="px-2.5 py-1 bg-bg-tertiary text-fg-secondary">
                {badge.label}
              </span>
              <span className="px-2.5 py-1 bg-bg-secondary text-fg-primary min-w-[4ch] text-center">
                {badge.value ?? (
                  <span className="inline-block w-12 h-3.5 rounded-sm bg-fg-primary/10 animate-pulse" />
                )}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Philosophy blockquote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, ease }}
          className="border-l-0 sm:border-l border-border-brand sm:pl-4 my-6 text-fg-tertiary relative text-center sm:text-left"
        >
          <strong className="text-fg-secondary">Philosophy:</strong> You are the
          architect; agents are the builders
        </motion.blockquote>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 1.4, ease }}
          className="max-w-lg text-fg-secondary font-body leading-relaxed relative text-center"
        >
          An open source Claude Code plugin using Anthropic&apos;s latest innovations
          <br />
          for PRD-driven autonomous development.
        </motion.p>

      </div>

      {/* Claude Features — breaks out of max-w-3xl to use full section width */}
      <div className="relative z-10 max-w-5xl mx-auto mt-8 px-4">
        <ClaudeFeatures />
      </div>
    </section>
  );
}
