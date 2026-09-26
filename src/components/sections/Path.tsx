import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { manifesto, path } from "@/data/content";
import { Container, SectionHeader } from "@/components/ui/primitives";
import { fadeUp } from "@/lib/motion";

/** Horizontal, scroll-driven journey on desktop; a plain vertical list on small screens. */
export function Path() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="path" ref={sectionRef} className="relative">
      {/* desktop: pinned horizontal track */}
      <div className="hidden lg:block" style={{ height: `calc(100vh + ${distance}px)` }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-8">
            <SectionHeader eyebrow="Path" lead="Three years," accent="compounding." body="From a BCA classroom to shipping LLM systems. Keep scrolling." />
          </div>
          <motion.div ref={trackRef} style={{ x }} className="mt-14 flex w-max gap-5 pr-[10vw] pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            {path.map((m, i) => (
              <article key={m.title} className="tile relative flex h-[300px] w-[360px] shrink-0 flex-col p-7">
                <span className="pointer-events-none absolute -top-6 -right-2 font-serif text-[9rem] leading-none text-white/[0.04] italic select-none">
                  {m.when.match(/\d{4}/)?.[0]?.slice(2) ?? "∞"}
                </span>
                <p className="font-mono text-xs text-lilac">{m.when}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-balance">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{m.body}</p>
                <p className="mt-auto font-mono text-[10px] text-faint">
                  {String(i + 1).padStart(2, "0")} / {String(path.length).padStart(2, "0")}
                </p>
              </article>
            ))}
          </motion.div>
          <div className="mx-auto mt-10 w-full max-w-7xl px-8">
            <div className="h-px w-full bg-line">
              <motion.div className="h-px origin-left bg-gradient-to-r from-accent via-lilac to-live" style={{ scaleX: progress }} />
            </div>
          </div>
        </div>
      </div>

      {/* mobile / tablet */}
      <Container className="py-24 lg:hidden">
        <SectionHeader eyebrow="Path" lead="Three years," accent="compounding." body="From a BCA classroom to shipping LLM systems." />
        <ol className="mt-10 space-y-3">
          {path.map((m) => (
            <motion.li key={m.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }} className="tile p-5">
              <p className="font-mono text-xs text-lilac">{m.when}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{m.body}</p>
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function Word({ children, progress, range, accent }: { children: string; progress: MotionValue<number>; range: [number, number]; accent: boolean }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={accent ? "serif-accent" : undefined}>
      {children}{" "}
    </motion.span>
  );
}

/** A single paragraph that lights up word by word as it scrolls past (after Magic UI's Text Reveal). */
export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });

  // *asterisks* in the copy mark phrases set in the italic serif accent
  let inAccent = false;
  const tokens = manifesto.split(" ").map((raw) => {
    const starts = raw.startsWith("*");
    const ends = raw.endsWith("*") || /\*[.,;:!?]$/.test(raw);
    if (starts) inAccent = true;
    const accent = inAccent;
    if (ends) inAccent = false;
    return { word: raw.replace(/\*/g, ""), accent };
  });

  return (
    <Container id="approach" className="py-32 md:py-44">
      <div ref={ref} className="mx-auto max-w-5xl">
        <p className="eyebrow">How I work</p>
        <p className="mt-8 text-[1.9rem] leading-[1.2] font-medium tracking-[-0.02em] text-ink md:text-5xl md:leading-[1.15]">
          {tokens.map((t, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / tokens.length, (i + 1) / tokens.length]} accent={t.accent}>
              {t.word}
            </Word>
          ))}
        </p>
      </div>
    </Container>
  );
}
