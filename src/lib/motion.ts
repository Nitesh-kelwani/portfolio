import type { Transition, Variants } from "motion/react";

// Every animation pulls its feel from here, so tuning the site happens in one file.
export const spring = {
  snap: { type: "spring", stiffness: 700, damping: 45 },
  ui: { type: "spring", stiffness: 300, damping: 32 },
  gentle: { type: "spring", stiffness: 110, damping: 20 },
} satisfies Record<string, Transition>;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export const stagger = (step = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});
