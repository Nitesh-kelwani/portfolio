import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { capabilities, capabilitiesSection } from "@/data/content";
import { fadeUp, stagger } from "@/lib/motion";
import { IsoArt } from "@/components/ui/IsoArt";
import { RoundButton, SectionHead } from "@/components/ui/primitives";

/** Powder's "Why" carousel: cards bleed off the right edge, arrows and a progress line below. */
export function WhatIBuild() {
  const track = useRef<HTMLDivElement>(null);
  const [prog, setProg] = useState({ left: 0, width: 0.3 });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const width = el.clientWidth / el.scrollWidth;
      setProg({ width, left: max > 0 ? (el.scrollLeft / max) * (1 - width) : 0 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 400) + 16), behavior: "smooth" });
  };

  return (
    <section id="build" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-[1112px] px-4 sm:px-6">
        <SectionHead tag={capabilitiesSection.tag} title={capabilitiesSection.title} muted={capabilitiesSection.muted} side={capabilitiesSection.side} />
      </div>

      <motion.div
        ref={track}
        className="no-scrollbar mt-14 snap-x snap-mandatory overflow-x-auto scroll-smooth"
        style={{ scrollPaddingLeft: "max(16px, calc((100vw - 1064px) / 2))" }}
        data-lenis-prevent-horizontal
      >
        <motion.ul
          className="flex w-max gap-4 pr-4"
          style={{ paddingLeft: "max(16px, calc((100vw - 1064px) / 2))" }}
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {capabilities.map((c) => (
            <motion.li key={c.title} variants={fadeUp} className="group card w-[82vw] max-w-[400px] shrink-0 snap-start rounded-[20px] p-2 sm:w-[400px]">
              <div className="relative aspect-square overflow-hidden rounded-[14px] bg-[#070707] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.05)]">
                <IsoArt kind={c.art} />
              </div>
              <div className="px-4 pt-6 pb-5">
                <h3 className="text-[16px] tracking-[-0.02em] text-ink">{c.title}</h3>
                <p className="t-small mt-2 max-w-[260px] text-muted">{c.body}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      <div className="mx-auto mt-8 flex max-w-[1112px] items-center gap-6 px-4 sm:px-6">
        <RoundButton onClick={() => step(-1)} label="Previous card">
          <ArrowLeft className="h-4 w-4" />
        </RoundButton>
        <div className="relative h-px flex-1 bg-white/10">
          <div className="absolute inset-y-0 bg-white/60 transition-[left] duration-150" style={{ width: `${prog.width * 100}%`, left: `${prog.left * 100}%` }} />
        </div>
        <RoundButton onClick={() => step(1)} label="Next card">
          <ArrowRight className="h-4 w-4" />
        </RoundButton>
      </div>
    </section>
  );
}
