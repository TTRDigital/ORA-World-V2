// Source: https://skiper-ui.com/registry/skiper58.json
"use client";

/**
 * Skiper 58 TextRoll, adapted for ORA World v2: the demo navigation list was removed and only the TextRoll
 * primitive kept. Spaces are rendered as non-breaking so multi-word labels keep their gaps, and the whole roll is
 * aria-hidden (each letter renders twice); the caller puts the real text in the link's aria-label.
 */
import { motion } from "framer-motion";
import React from "react";

import { cn } from "@/lib/utils";

const STAGGER = 0.035;

const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className, center = false }) => {
  const letters = children.split("").map((l) => (l === " " ? " " : l));
  const delayFor = (i: number) => (center ? STAGGER * Math.abs(i - (letters.length - 1) / 2) : STAGGER * i);
  return (
    <motion.span
      aria-hidden="true"
      initial="initial"
      whileHover="hovered"
      className={cn("relative block overflow-hidden", className)}
      style={{ lineHeight: 1.15 }}
    >
      <span className="block">
        {letters.map((l, i) => (
          <motion.span
            variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
            transition={{ ease: "easeInOut", delay: delayFor(i) }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </span>
      <span className="absolute inset-0 block">
        {letters.map((l, i) => (
          <motion.span
            variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
            transition={{ ease: "easeInOut", delay: delayFor(i) }}
            className="inline-block"
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
};

export { TextRoll };

/**
 * Skiper 58 TextRoll — React + Framer Motion
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version (credited in README.md).
 * - No attribution required with Skiper UI Pro.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
