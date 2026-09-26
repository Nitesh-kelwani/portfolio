import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { moreBuilds, moreSection } from "@/data/content";
import { fadeUp, stagger } from "@/lib/motion";
import { Scene, type SceneAccent } from "@/components/ui/Landscape";
import { SectionHead } from "@/components/ui/primitives";

const accents: SceneAccent[] = ["moon", "path", "tree"];

/** Powder's blog row: three image cards, title, meta. */
export function MoreBuilds() {
  return (
    <section id="more" className="relative mx-auto w-full max-w-[1112px] px-4 py-24 sm:px-6 md:py-32">
      <SectionHead
        tag={moreSection.tag}
        title={moreSection.title}
        muted={moreSection.muted}
        aside={
          <a href={moreSection.link.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 text-[15px] text-soft hover:text-ink">
            {moreSection.link.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        }
      />

      <motion.ul
        className="mt-14 grid gap-3 md:grid-cols-3"
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {moreBuilds.map((b, i) => (
          <motion.li key={b.name} variants={fadeUp}>
            <a href={b.repo} target="_blank" rel="noreferrer" className="group card flex h-full flex-col rounded-[20px] bg-[#0f0f0f] p-1.5">
              <div className="overflow-hidden rounded-[16px]">
                <Scene className="h-[200px] transition-transform duration-700 ease-out group-hover:scale-[1.05]" seedShift={b.scene * 11 + 40} accent={accents[i]} />
              </div>
              <div className="flex flex-1 flex-col px-5 pt-6 pb-5">
                <h3 className="text-[19px] leading-snug tracking-[-0.03em] text-ink text-balance">{b.name}</h3>
                <p className="t-small mt-auto pt-6 text-faint">
                  {b.topic} · {b.stack}
                </p>
              </div>
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
