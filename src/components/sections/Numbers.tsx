import { animate, motion, useInView, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck, CircleCheck, Layers, Sparkles } from "lucide-react";
import { numbers, numbersSection } from "@/data/content";
import { fadeUp, stagger } from "@/lib/motion";
import { Cloud, Scene } from "@/components/ui/Landscape";
import { Reveal, SectionTag } from "@/components/ui/primitives";

const smallIcons = { layers: Layers, badge: BadgeCheck, sparkles: Sparkles, check: CircleCheck };

function Count({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const [v, setV] = useState(0);
  useEffect(() => mv.on("change", (x) => setV(Math.round(x))), [mv]);
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [inView, mv, to]);
  return (
    <span ref={ref} className={className}>
      {v}
    </span>
  );
}

function Word({ word, i, n, progress }: { word: string; i: number; n: number; progress: MotionValue<number> }) {
  const start = (i / n) * 0.75;
  const opacity = useTransform(progress, [start, start + 0.25], [0.28, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block pr-[0.26em]">
      {word}
    </motion.span>
  );
}

/** Powder's numbers: a headline that brightens word by word, tall landscape stat cards, drifting clouds. */
export function Numbers() {
  const head = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: head, offset: ["start 0.9", "start 0.35"] });
  const words = numbersSection.title.split(" ");

  const cards = useRef<HTMLDivElement>(null);
  const { scrollYProgress: cardsP } = useScroll({ target: cards, offset: ["start end", "end start"] });
  const cloudA = useTransform(cardsP, [0, 1], [80, -120]);
  const cloudB = useTransform(cardsP, [0, 1], [40, -60]);

  return (
    <section id="numbers" className="relative mx-auto w-full max-w-[1112px] px-4 py-24 sm:px-6 md:py-32">
      <Reveal>
        <SectionTag>{numbersSection.tag}</SectionTag>
      </Reveal>
      <h2 ref={head} className="t-h2 mt-5 max-w-[560px]">
        {words.map((w, i) => (
          <Word key={i} word={w} i={i} n={words.length} progress={scrollYProgress} />
        ))}
      </h2>

      <div ref={cards} className="relative mt-14 grid gap-5 md:grid-cols-2">
        {numbers.big.map((b, i) => (
          <Reveal key={b.label} delay={i * 0.1} className={i === 1 ? "md:mt-14" : ""}>
            <Scene className="h-[520px] rounded-[20px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] md:h-[640px]" photo={i === 0 ? "dusk" : "golden"} position="50% 70%">
              <div className="relative z-10 p-7 sm:p-8">
                <p className="flex items-baseline gap-3 leading-none tracking-[-0.05em] text-ink">
                  <Count to={b.value} className="text-[88px] font-normal sm:text-[104px]" />
                  <span className="text-[64px] font-extralight text-white/80 sm:text-[76px]">{b.unit}</span>
                </p>
                <p className="t-small mt-6 max-w-[250px] text-soft">{b.body}</p>
              </div>
              <span className="pill absolute bottom-6 left-6 z-10 bg-white/10 text-soft backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-soft" /> {b.label}
              </span>
            </Scene>
          </Reveal>
        ))}

        <motion.div className="pointer-events-none absolute top-[42%] -left-[6%] z-20 w-[34%] opacity-90" style={{ y: cloudA }}>
          <Cloud variant="a" className="w-full" />
        </motion.div>
        <motion.div className="pointer-events-none absolute top-[4%] -right-[4%] z-20 w-[22%] opacity-80" style={{ y: cloudB }}>
          <Cloud variant="b" className="w-full" />
        </motion.div>
      </div>

      <motion.ul
        className="mt-20 grid gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-24 md:grid-cols-4"
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {numbers.small.map((s) => {
          const Icon = smallIcons[s.icon];
          return (
            <motion.li key={s.body} variants={fadeUp}>
              <Icon className="h-5 w-5 text-soft" strokeWidth={1.4} />
              <p className="mt-10 text-[40px] leading-none font-light tracking-[-0.04em] text-ink">
                <Count to={s.value} />
                {s.suffix}
              </p>
              <p className="t-small mt-3 max-w-[220px] text-muted">{s.body}</p>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
