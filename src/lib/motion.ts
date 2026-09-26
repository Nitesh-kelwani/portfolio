import type { Transition, Variants } from "motion/react";

// Every animation pulls its feel from here. Values are Powder's own:
// springs with duration 1 and no bounce, and a symmetric ease for the nav.
export const ease = [0.44, 0, 0.56, 1] as const;

export const spring = {
  enter: { type: "spring", bounce: 0, duration: 1 },
  ui: { type: "spring", bounce: 0, duration: 0.5 },
  snap: { type: "spring", stiffness: 500, damping: 40 },
} satisfies Record<string, Transition>;

/** Load-in: rise from y and fade, with Powder's spring and a delay. */
export const rise = (delay = 0, y = 24) => ({
  initial: { opacity: 0.001, y },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring.enter, delay },
});

export const fadeUp: Variants = {
  hidden: { opacity: 0.001, y: 24 },
  show: { opacity: 1, y: 0, transition: spring.enter },
};

export const stagger = (step = 0.1, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});
