"use client";

import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";
import { Globe01 } from "@untitledui/icons";
import { useViewport } from "./ViewportProvider";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 9L9 3M9 3H4M9 3v5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

const transition =
  "transition-transform duration-700 [transition-timing-function:var(--ease-power4-in-out)] motion-reduce:transition-none";

export function Navigation() {
  const { headerVisible } = useViewport();
  const [scrollProgress, setScrollProgress] = useState(0);
  const hasEntered = useRef(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrollProgress(Math.min(latest / 100, 1));
    if (!hasEntered.current && latest > 10) hasEntered.current = true;
  });

  const bgOpacity = scrollProgress;
  const bottomRadius = scrollProgress * 6;
  const contentPinch = scrollProgress * 16;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: headerVisible || !hasEntered.current ? 0 : -56 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="container-wide relative">
        {/* Background fill — frosted glass */}
        <div
          className="absolute inset-0 bg-bg-secondary backdrop-blur-md transition-all duration-300 ease-out"
          style={{
            opacity: bgOpacity,
            borderBottomLeftRadius: `${bottomRadius}px`,
            borderBottomRightRadius: `${bottomRadius}px`,
          }}
        />

        {/* Nav bar */}
        <nav
          className="relative flex items-center justify-between h-14 transition-[padding] duration-300 ease-out"
          style={{
            paddingLeft: `${contentPinch}px`,
            paddingRight: `${contentPinch}px`,
          }}
        >
          {/* Logo */}
          <a
            href="https://opensession.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center transition-opacity duration-200 hover:opacity-80"
            aria-label="Open Session"
          >
            <Image
              src="/logos/horizontal-vanilla.png"
              alt="Open Session"
              width={100}
              height={20}
              style={{ width: "100px", height: "auto" }}
              priority
            />
          </a>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Website icon */}
            <a
              href="https://opensession.co"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-fg-secondary hover:text-fg-primary hover:bg-bg-tertiary transition-colors"
              aria-label="Website"
            >
              <Globe01 className="w-4 h-4" />
            </a>

            {/* GitHub CTA */}
            <a
              href="https://github.com/opensesh/KARIMO"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-w-0 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap font-body font-medium uppercase tracking-normal outline-none rounded-[6px] overflow-hidden text-xs focus-visible:ring-2 focus-visible:ring-brand-500/50"
          >
            <span className="relative flex w-full items-center gap-1.5">
              {/* Left icon — hidden, spins in on hover */}
              <span
                className={`flex items-center justify-center size-8 origin-left -rotate-45 scale-0 group-hover:rotate-0 group-hover:scale-100 bg-fg-primary text-bg-primary ${transition}`}
              >
                <ArrowUpRight className="size-3" />
              </span>

              {/* Text — slides right on hover */}
              <span
                className={`flex w-full flex-1 items-center justify-center gap-2 h-8 px-4 -translate-x-[calc(32px+6px)] group-hover:translate-x-0 bg-fg-primary text-bg-primary ${transition}`}
              >
                <GitHubIcon className="size-3.5" />
                <span>GitHub</span>
              </span>

              {/* Right icon — visible, spins out on hover */}
              <span
                className={`flex items-center justify-center size-8 absolute right-0 z-10 origin-right rotate-0 scale-100 group-hover:-rotate-45 group-hover:scale-0 bg-fg-primary text-bg-primary ${transition}`}
              >
                <ArrowUpRight className="size-3" />
              </span>
            </span>
            </a>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
