import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { contactHref, hero, links } from "@/data/content";
import { rise, spring } from "@/lib/motion";
import { HeroBackHills, HeroFrontHills } from "@/components/ui/Landscape";
import { GithubIcon, PillLink, RoundLink } from "@/components/ui/primitives";
import { AskWindow } from "./AskWindow";

// Powder's hero: dusk gradient, two hill layers and an app window, each moving
// at its own speed. Parallax factors measured from the original: 0.31 / 0.20 / 0.17.
export function Hero() {
  const { scrollY } = useScroll();
  const backY = useTransform(scrollY, [0, 1600], [0, 1600 * 0.31], { clamp: true });
  const windowY = useTransform(scrollY, [0, 1600], [0, 1600 * 0.2], { clamp: true });
  const frontY = useTransform(scrollY, [0, 1600], [0, 1600 * 0.17], { clamp: true });

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* sky */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(200% 83% at 50% 0, #1b2228 0%, #353f44 42%, #d39794 100%)" }}
        initial={{ opacity: 0.001 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring.ui }}
      />

      {/* far hills */}
      <motion.div className="absolute inset-x-0 bottom-0 -z-10 h-[300px] will-change-transform sm:h-[420px] lg:h-[526px]" style={{ y: backY }}>
        <motion.div className="h-full" {...rise(0, 72)}>
          <HeroBackHills />
        </motion.div>
      </motion.div>

      {/* copy */}
      <div className="relative mx-auto flex max-w-[1112px] flex-col items-center px-4 pt-[124px] text-center sm:px-6 md:pt-[160px]">
        <motion.a
          {...rise(0)}
          href={hero.badge.href}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex h-[30px] max-w-full items-center gap-2 rounded-full bg-white/10 py-0 pr-1 pl-4 backdrop-blur-md transition-colors hover:bg-white/15"
        >
          <span className="t-small truncate text-soft">{hero.badge.label}</span>
          <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-white/10 transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="h-3 w-3 text-soft" />
          </span>
        </motion.a>

        <motion.h1 {...rise(0.1)} className="t-h1 mt-6 text-balance text-ink">
          {hero.title[0]}
          <br className="hidden sm:block" /> {hero.title[1]}
        </motion.h1>

        <motion.p {...rise(0.2)} className="t-small mt-4 text-soft">
          {hero.sub[0]}
          <br className="hidden sm:block" /> {hero.sub[1]}
        </motion.p>

        <div className="mt-8 flex items-center gap-1">
          <motion.div {...rise(0.3)}>
            <PillLink href={contactHref}>{hero.cta}</PillLink>
          </motion.div>
          <motion.div {...rise(0.4)}>
            <RoundLink href={links.github} label="GitHub">
              <GithubIcon className="h-[18px] w-[18px]" />
            </RoundLink>
          </motion.div>
        </div>
      </div>

      {/* app window */}
      <motion.div className="relative mx-auto mt-16 max-w-[992px] px-4 will-change-transform sm:mt-20 sm:px-4" style={{ y: windowY }}>
        <AskWindow variant="hero" className="h-[640px] sm:h-[720px]" />
      </motion.div>

      {/* near forest: sits above the window so it sinks into the landscape */}
      <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[300px] will-change-transform sm:h-[380px] lg:h-[490px]" style={{ y: frontY }}>
        <motion.div className="h-full" initial={{ y: 48 }} animate={{ y: 0 }} transition={spring.enter}>
          <HeroFrontHills />
        </motion.div>
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}
