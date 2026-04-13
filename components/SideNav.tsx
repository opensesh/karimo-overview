"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useViewport } from "./ViewportProvider";

const sections = [
  { id: "home", number: "00", label: "Home" },
  { id: "pipeline", number: "01", label: "Overview" },
  { id: "live-example", number: "02", label: "Example" },
  { id: "orchestration", number: "03", label: "Encoding" },
  { id: "context", number: "04", label: "Context" },
  { id: "adoption", number: "05", label: "Adoption" },
  { id: "quickstart", number: "06", label: "Start" },
];

const HEADER_HEIGHT = 56;

export function SideNav() {
  const { headerVisible, lockHeader } = useViewport();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      // Simple approach: iterate top→bottom, last section whose top
      // is near or above the viewport top wins.
      let active = "home";
      for (const s of sections) {
        if (s.id === "home") continue;
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= HEADER_HEIGHT + 120) {
          active = s.id;
        }
      }
      setActiveSection(active);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    lockHeader();
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const top =
      el.getBoundingClientRect().top +
      window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0, y: headerVisible ? 4 : 0 }}
      transition={{ duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Page sections"
      className="group/nav fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col rounded-lg border border-border-secondary bg-bg-secondary/80 backdrop-blur-md py-2 px-1.5 overflow-hidden"
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className={`
              flex items-center gap-3 py-2 px-2 rounded-md transition-colors duration-200
              ${isActive ? "bg-bg-tertiary/60" : "hover:bg-bg-tertiary/30"}
            `}
          >
            {/* Active bar */}
            <div
              className={`w-0.5 h-5 rounded-full shrink-0 transition-all duration-300 ${
                isActive
                  ? "bg-fg-brand"
                  : "bg-border-secondary"
              }`}
            />
            {/* Number */}
            <span
              className={`text-accent text-[10px] leading-none shrink-0 transition-colors duration-300 ${
                isActive ? "text-fg-brand" : "text-fg-tertiary"
              }`}
            >
              {section.number}
            </span>
            {/* Label — all labels appear on container hover */}
            <span
              className={`text-xs font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-out max-w-0 opacity-0 group-hover/nav:max-w-[10rem] group-hover/nav:opacity-100 ${
                isActive ? "text-fg-primary" : "text-fg-tertiary"
              }`}
            >
              {section.label}
            </span>
          </button>
        );
      })}
    </motion.nav>
  );
}
