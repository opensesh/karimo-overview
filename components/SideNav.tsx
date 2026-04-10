"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const sections = [
  { id: "home", number: "00", label: "Home" },
  { id: "pipeline", number: "01", label: "Overview" },
  { id: "orchestration", number: "02", label: "Encoding" },
  { id: "adoption", number: "03", label: "Option" },
  { id: "context", number: "04", label: "Context" },
  { id: "quickstart", number: "05", label: "Start" },
];

export function SideNav() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sections.map((s) => ({
        id: s.id,
        offset: s.id === "home" ? 0 : (document.getElementById(s.id)?.offsetTop || 0),
      }));

      const scrollPosition = window.scrollY + 200;

      for (let i = offsets.length - 1; i >= 0; i--) {
        if (scrollPosition >= offsets[i].offset) {
          setActiveSection(offsets[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
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
