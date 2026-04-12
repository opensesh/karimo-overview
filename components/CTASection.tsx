"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useParallax } from "@/components/ui/ParallaxSection";

// ---------------------------------------------------------------------------
// Scramble text hook
// ---------------------------------------------------------------------------

const SCRAMBLE_CHARS = "█▓▒░▮▯▰▱▣▤▥▦@#$%^&*_+[]{}|;:<>?~";

function useTextScrambleCycle(
  words: string[],
  {
    typeDuration = 600,
    pauseDuration = 2000,
    deleteDuration = 300,
  } = {}
) {
  const [display, setDisplay] = useState(words[0]);
  const indexRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function scrambleTo(target: string, duration: number, onDone: () => void) {
      const start = performance.now();
      const maxLen = Math.max(display.length, target.length);

      function tick() {
        const elapsed = performance.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const revealed = Math.floor(eased * target.length);
        let result = "";

        for (let i = 0; i < maxLen; i++) {
          if (i < revealed) {
            result += target[i];
          } else if (i < target.length) {
            result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        }

        setDisplay(result);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(target);
          onDone();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    function cycle() {
      const nextIndex = (indexRef.current + 1) % words.length;
      scrambleTo("", deleteDuration, () => {
        indexRef.current = nextIndex;
        scrambleTo(words[nextIndex], typeDuration, () => {
          timeout = setTimeout(cycle, pauseDuration);
        });
      });
    }

    timeout = setTimeout(cycle, pauseDuration);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return display;
}

// ---------------------------------------------------------------------------
// Rotating words
// ---------------------------------------------------------------------------

const ROTATING_WORDS = ["today", "right now", "vibe coding", "building", "shipping"];

// ---------------------------------------------------------------------------
// CTASection
// ---------------------------------------------------------------------------

export function CTASection() {
  const { ref: sectionRef, y } = useParallax(30);
  const scrambleDisplay = useTextScrambleCycle(ROTATING_WORDS);

  return (
    <section ref={sectionRef} id="quickstart" className="min-h-screen flex items-center bg-bg-primary overflow-hidden">
      <motion.div style={{ y }} className="w-full">
      <div className="max-w-5xl mx-auto px-6 w-full py-16">
        {/* Eyebrow */}
        <SectionLabel>LET&apos;S BEGIN...</SectionLabel>

        {/* Heading with rotating word */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 mt-4"
        >
          <h2 className="text-display text-4xl md:text-5xl lg:text-6xl text-fg-primary">
            Get started{" "}
            <span
              className="text-brand-500 inline-block"
              style={{ minWidth: "8ch" }}
            >
              {scrambleDisplay || "\u00A0"}
            </span>
          </h2>
        </motion.div>

        {/* Two options aligned to the same grid as the sections above */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Option 1: Terminal */}
            <div className="rounded-xl p-6 md:p-8 bg-bg-secondary border border-border-secondary">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-accent text-xs font-bold px-2 py-0.5 rounded bg-bg-tertiary text-fg-tertiary">
                  OPTION 1
                </span>
                <span className="text-display text-lg text-fg-primary">Terminal</span>
              </div>
              <p className="text-body text-sm text-fg-secondary mb-5">
                Clone the repo and run the install script from your terminal.
              </p>
              <div className="rounded-lg bg-[#0a0a0a] p-4 font-mono text-sm overflow-x-auto">
                <div className="text-fg-secondary mb-1">
                  <span className="text-brand-500">$</span>{" "}
                  <span className="text-fg-primary">git clone https://github.com/opensesh/KARIMO</span>
                </div>
                <div className="text-fg-secondary">
                  <span className="text-brand-500">$</span>{" "}
                  <span className="text-fg-primary">bash KARIMO/.karimo/install.sh ./my-project</span>
                </div>
              </div>
              <a
                href="https://github.com/opensesh/KARIMO"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 text-body text-sm text-brand-500 hover:underline"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </div>

            {/* Option 2: Claude Code */}
            <div className="rounded-xl p-6 md:p-8 bg-bg-secondary border border-border-secondary">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-accent text-xs font-bold px-2 py-0.5 rounded bg-bg-tertiary text-fg-tertiary">
                  OPTION 2
                </span>
                <span className="text-display text-lg text-fg-primary">Claude Code</span>
              </div>
              <p className="text-body text-sm text-fg-secondary mb-5">
                Paste this prompt into Claude Code and it will handle the rest.
              </p>
              <div className="rounded-lg bg-[#0a0a0a] p-4 font-mono text-sm overflow-x-auto">
                <span className="text-fg-secondary">
                  Clone{" "}
                  <span className="text-brand-500">github.com/opensesh/KARIMO</span>
                  {" "}and run the install script to set up KARIMO in this project.
                </span>
              </div>
              <p className="mt-5 text-body text-xs text-fg-tertiary">
                Works in Claude Code CLI, desktop app, or IDE extensions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      </motion.div>
    </section>
  );
}
