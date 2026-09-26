import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faq, faqSection, links } from "@/data/content";
import { spring } from "@/lib/motion";
import { scrollToId } from "@/lib/scroll";
import { Reveal, SectionHead } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

function askPortfolio() {
  scrollToId("top");
  window.setTimeout(() => document.getElementById("ask-input")?.focus({ preventScroll: true }), 1100);
}

/** Powder's FAQ: topic tabs on the left, a "Got questions?" card, accordions on the right. */
export function Faq() {
  const [group, setGroup] = useState(0);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative mx-auto w-full max-w-[1112px] px-4 py-24 sm:px-6 md:py-32">
      <SectionHead tag={faqSection.tag} title={faqSection.title} muted={faqSection.muted} side={faqSection.side} />

      <div className="mt-14 grid gap-8 md:grid-cols-[290px_1fr] md:gap-7">
        <Reveal className="flex flex-col gap-8">
          <div className="no-scrollbar flex gap-1 overflow-x-auto md:flex-col" role="tablist" aria-label="FAQ topics">
            {faq.map((g, i) => (
              <button
                key={g.group}
                type="button"
                role="tab"
                aria-selected={group === i}
                onClick={() => {
                  setGroup(i);
                  setOpen(0);
                }}
                className={cn("relative h-10 shrink-0 rounded-full px-5 text-[15px] tracking-[-0.02em] transition-colors", group === i ? "text-ink" : "text-muted hover:text-ink")}
              >
                {group === i && <motion.span layoutId="faq-tab" className="absolute inset-0 rounded-full bg-white/10" transition={spring.ui} />}
                <span className="relative">{g.group}</span>
              </button>
            ))}
          </div>

          <div className="card mt-auto hidden rounded-[20px] bg-[#111] p-6 md:block">
            <h3 className="text-[20px] tracking-[-0.03em] text-ink">Got questions?</h3>
            <p className="t-small mt-3 text-muted">Ask my portfolio anything, or send an email. I read every message.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" onClick={askPortfolio} className="h-10 rounded-full bg-white/80 px-4 text-[13px] text-black transition-colors hover:bg-white">
                Ask my portfolio
              </button>
              <a href={`mailto:${links.email}`} className="inline-flex h-10 items-center rounded-full bg-white/[0.07] px-4 text-[13px] text-soft transition-colors hover:bg-white/10">
                Email
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul key={group} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="space-y-2">
              {faq[group].items.map((it, i) => {
                const isOpen = open === i;
                return (
                  <li key={it.q} className="rounded-[16px] bg-[#111] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.05)]">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="text-[15px] tracking-[-0.02em] text-ink">{it.q}</span>
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[0.06]">
                        <ChevronDown className={cn("h-4 w-4 text-soft transition-transform duration-300", isOpen && "rotate-180")} />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={spring.ui}
                          className="overflow-hidden"
                        >
                          <p className="t-small max-w-[600px] px-5 pb-6 text-muted sm:px-6">{it.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </motion.ul>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
