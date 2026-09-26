import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cta, links } from "@/data/content";
import { fadeUp, stagger } from "@/lib/motion";
import { CtaHills } from "@/components/ui/Landscape";
import { CopyButton, PillLink } from "@/components/ui/primitives";
import { AskWindow } from "./AskWindow";

/** Powder's closing section: copy and badges on the left, the app window bleeding off the right, hills below. */
export function Cta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const hillsY = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const windowY = useTransform(scrollYProgress, [0, 1], [120, 0]);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative isolate overflow-hidden pt-32 md:pt-44"
      style={{ background: "linear-gradient(180deg, #000 0%, #0b0f12 26%, #1f262b 58%, #4b4549 82%, #8e6f70 100%)" }}
    >
      <div className="mx-auto grid max-w-[1112px] gap-14 px-4 sm:px-6 md:grid-cols-[minmax(0,380px)_1fr] md:gap-10">
        <motion.div className="flex flex-col pb-10 md:pb-[230px]" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <motion.h2 variants={fadeUp} className="t-h2 text-ink">
            {cta.title} <span className="text-muted">{cta.muted}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="t-small mt-6 max-w-[300px] text-soft">
            {cta.body}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-1">
            <PillLink href={`mailto:${links.email}?subject=Hello%20Nitesh`}>{cta.button}</PillLink>
            <CopyButton text={links.email} label="Copy email" />
          </motion.div>
          <motion.ul variants={fadeUp} className="mt-16 flex items-center gap-6 md:mt-auto">
            {cta.badges.map((b, i) => (
              <li key={b.label} className="flex items-center gap-3">
                {i > 0 && <span className="mr-3 h-10 w-px bg-white/15" />}
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white/[0.07] text-[10px] font-medium tracking-tight text-soft shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)]">
                  {b.mark}
                </span>
                <span className="t-small text-soft">{b.label}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div style={{ y: windowY }} className="relative md:-mr-[max(24px,calc((100vw-1112px)/2+24px))]">
          <AskWindow variant="cta" className="h-[560px] md:h-[640px]" />
        </motion.div>
      </div>

      <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[200px] sm:h-[250px] md:h-[300px]" style={{ y: hillsY }}>
        <CtaHills />
      </motion.div>
    </section>
  );
}
