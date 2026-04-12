"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { staggerContainer, fadeInUp } from "@/lib/motion";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/opensesh",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "Figma",
    href: "https://figma.com/@opensession",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.564v4.49c0 2.476-2.014 4.49-4.49 4.49h-.074zm-.024-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019 3.019-1.354 3.019-3.019v-3.019H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.098-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019 3.019-1.354 3.019-3.019-1.354-3.019-3.019-3.019z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/opensessionco",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/opensession",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Substack",
    href: "https://substack.com/@opensession",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
      </svg>
    ),
  },
];

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

export function Footer() {
  const stripRef = useRef<HTMLDivElement>(null);
  const stripInView = useInView(stripRef, { once: true, margin: "-50px" });

  return (
    <footer>
      {/* ================================================================
          Broadcast Strip — Logo Video (bg) + CRT Overlay + Social
          ================================================================ */}
      <div className="relative bg-bg-brand-solid overflow-hidden" ref={stripRef}>
        {/* Logo oscillation video — left-aligned bg, behind CRT */}
        {stripInView && (
          <div className="absolute inset-0 pointer-events-none z-[2]">
            <div className="container-main h-full flex items-center">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="h-[60%] w-auto object-contain mix-blend-screen"
                src="/videos/logo-oscillation.mp4"
              />
            </div>
          </div>
        )}

        {/* CRT overlay video — on top of logo video */}
        {stripInView && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-40 pointer-events-none z-[3]"
            src="/videos/crt-overlay.mp4"
          />
        )}

        {/* Scanline CSS fallback */}
        <div
          className="absolute inset-0 pointer-events-none z-[4]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
          }}
        />

        {/* Content layer */}
        <motion.div
          className="container-main relative z-10 py-10 md:py-14 lg:py-16"
          variants={staggerContainer}
          initial="hidden"
          animate={stripInView ? "visible" : "hidden"}
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-between gap-6"
          >
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-end gap-4 md:gap-5 lg:gap-6 w-full"
            >
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-9 h-9 lg:w-auto lg:h-auto lg:px-3 lg:py-2 justify-center rounded-[6px] text-fg-on-brand hover:bg-white hover:text-bg-primary transition-all duration-200"
                  aria-label={link.label}
                >
                  {link.icon}
                  <span className="hidden lg:inline font-body font-medium uppercase tracking-normal text-xs">
                    {link.label}
                  </span>
                </a>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
