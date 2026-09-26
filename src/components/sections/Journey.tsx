import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { journey, journeySection } from "@/data/content";
import { fadeUp, stagger } from "@/lib/motion";
import { SectionHead } from "@/components/ui/primitives";

/** Powder's changelog row: one line, a dot per entry, title, two-line note, date. */
export function Journey() {
  return (
    <section id="journey" className="relative mx-auto w-full max-w-[1112px] px-4 py-24 sm:px-6 md:py-32">
      <SectionHead
        tag={journeySection.tag}
        title={journeySection.title}
        muted={journeySection.muted}
        aside={
          <a href={journeySection.link.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 text-[15px] text-soft hover:text-ink">
            {journeySection.link.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        }
      />

      <motion.ol
        className="relative mt-14 grid gap-10 border-l border-white/10 pl-6 md:mt-16 md:grid-cols-5 md:gap-0 md:border-0 md:pl-0"
        variants={stagger(0.12, 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.span
          aria-hidden
          className="absolute top-[3px] right-0 left-0 hidden h-px origin-left bg-white/10 md:block"
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.2, ease: [0.44, 0, 0.56, 1] } } }}
        />
        {journey.map((m) => (
          <motion.li key={m.title} variants={fadeUp} className="relative md:pr-8">
            <span className="absolute top-[7px] -left-[28px] h-[7px] w-[7px] rounded-full bg-soft md:static md:block" />
            <h3 className="text-[14px] font-medium tracking-[-0.02em] text-ink md:mt-8">{m.title}</h3>
            <p className="t-small mt-2 line-clamp-2 text-muted">{m.body}</p>
            <p className="t-small mt-6 text-faint md:mt-8">{m.when}</p>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
