"use client";

import { useRef } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * Returns a ref to attach to the section element and a `y` MotionValue
 * that drives a subtle parallax on the section's inner content.
 *
 * Attach `ref` to the outer `<section>`, then pass `y` into a
 * `<motion.div style={{ y }}>` wrapping the section content.
 */
export function useParallax(offset = 30): {
  ref: React.RefObject<HTMLElement | null>;
  y: MotionValue<number>;
} {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return { ref, y };
}
