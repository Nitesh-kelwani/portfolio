import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { intro, introLogos } from "@/data/content";
import { fadeUp, stagger } from "@/lib/motion";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Reveal, SectionTag } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/** Powder's intro: the paragraph nearest the middle of the screen lights up. */
export function Intro() {
  const refs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const mid = window.innerHeight * 0.52;
      let best = 0;
      let bestD = Infinity;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs((r.top + r.bottom) / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="intro" className="relative mx-auto w-full max-w-[1112px] px-4 pt-28 pb-24 sm:px-6 md:pt-44 md:pb-32">
      <div className="mx-auto max-w-[540px]">
        <Reveal>
          <SectionTag>Intro</SectionTag>
        </Reveal>
        <div className="mt-8 space-y-10">
          {intro.map((p, i) => (
            <p
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={cn("t-lead text-pretty transition-colors duration-500", active === i ? "text-ink" : "text-white/25")}
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      <motion.ul
        className="mx-auto mt-24 flex max-w-[1080px] flex-wrap items-center justify-center gap-x-14 gap-y-8 md:mt-32 md:justify-between md:gap-0 md:px-20"
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        aria-label="Tools I use every day"
      >
        {introLogos.map((name) => (
          <motion.li key={name} variants={fadeUp} className="text-white/40 transition-colors hover:text-white/80" title={name}>
            <BrandIcon name={name} className="h-8 w-8" />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
