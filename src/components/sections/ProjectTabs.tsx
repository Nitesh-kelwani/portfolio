import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText, Menu, PanelLeftClose, Search, SquarePen } from "lucide-react";
import { projects, workSection } from "@/data/content";
import { spring } from "@/lib/motion";
import { Logo } from "@/components/ui/Logo";
import { Scene } from "@/components/ui/Landscape";
import { GithubIcon, Reveal, RoundButton, SectionHead } from "@/components/ui/primitives";
import { ProjectMock } from "./mocks";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;
const tabs = workSection.tabs.map((slug) => projects.find((p) => p.slug === slug)!);
const others = projects.filter((p) => !workSection.tabs.includes(p.slug));

/** Powder's "Core features": auto-advancing tabs over a framed landscape with an app window. */
export function ProjectTabs() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const inView = useInView(frame, { margin: "-20% 0px -20% 0px" });
  const p = tabs[i];

  useEffect(() => {
    if (!inView || paused) return;
    const t = window.setTimeout(() => setI((v) => (v + 1) % tabs.length), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [i, inView, paused]);

  const go = (n: number) => setI((n + tabs.length) % tabs.length);

  return (
    <section id="work" className="relative mx-auto w-full max-w-[1112px] px-4 py-24 sm:px-6 md:py-32">
      <SectionHead tag={workSection.tag} title={workSection.title} muted={workSection.muted} side={workSection.side} />

      <Reveal className="mt-12">
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Projects">
          <div className="grid min-w-[560px] grid-cols-4">
            {tabs.map((t, k) => (
              <button
                key={t.slug}
                type="button"
                role="tab"
                aria-selected={k === i}
                onClick={() => setI(k)}
                className={cn("relative h-10 rounded-full text-[15px] tracking-[-0.02em] transition-colors md:mx-3", k === i ? "text-ink" : "text-muted hover:text-ink")}
              >
                {k === i && <motion.span layoutId="work-tab" className="absolute inset-0 rounded-full bg-white/10" transition={spring.ui} />}
                <span className="relative">{t.short}</span>
                {k === i && !paused && inView && (
                  <motion.span
                    key={`bar-${i}`}
                    className="absolute inset-x-6 bottom-1 h-px origin-left bg-white/30"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-5">
        <div
          ref={frame}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          className="relative h-[560px] overflow-hidden rounded-[24px] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] md:h-[620px]"
        >
          <AnimatePresence initial={false}>
            <motion.div key={p.slug} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              <Scene className="h-full w-full" photo={(["dusk", "valley", "forest", "golden"] as const)[i]} clouds={i % 2 === 1} />
            </motion.div>
          </AnimatePresence>

          <div className="glass absolute inset-3 flex overflow-hidden rounded-[20px] sm:inset-x-8 sm:top-8 sm:bottom-8 md:inset-x-[72px] md:top-10 md:bottom-10">
            {/* sidebar */}
            <aside className="hidden w-[220px] shrink-0 flex-col border-r border-line p-4 md:flex">
              <div className="flex items-center justify-between">
                <Logo className="h-6 w-6 text-white/85" />
                <PanelLeftClose className="h-4 w-4 text-faint" />
              </div>
              <div className="mt-6 flex h-8 items-center justify-center gap-2 rounded-full bg-white/[0.07] text-[13px] text-soft">
                <SquarePen className="h-3.5 w-3.5" /> Projects
              </div>
              <ul className="mt-5 space-y-1">
                {tabs.map((t, k) => (
                  <li key={t.slug}>
                    <button
                      type="button"
                      onClick={() => setI(k)}
                      className={cn("flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors", k === i ? "bg-white/[0.07]" : "hover:bg-white/[0.04]")}
                    >
                      <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] text-ink">{t.name}</span>
                        <span className="block text-[11px] text-faint">{t.topic}</span>
                      </span>
                    </button>
                  </li>
                ))}
                {others.map((t) => (
                  <li key={t.slug} className="flex items-start gap-2.5 px-2.5 py-2 opacity-35">
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] text-ink">{t.name}</span>
                      <span className="block text-[11px] text-faint">{t.topic}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center gap-2.5 pt-4">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
                  <Logo className="h-4 w-4 text-ink" />
                </span>
                <span>
                  <span className="block text-[13px] text-ink">Nitesh Kelwani</span>
                  <span className="block text-[11px] text-faint">Open source</span>
                </span>
              </div>
            </aside>

            {/* main pane */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <p className="truncate text-[17px] tracking-[-0.02em] text-ink">{p.name}</p>
                <div className="flex items-center gap-3 text-faint">
                  <span className="hidden rounded-full bg-white/[0.07] px-3 py-1 text-[12px] text-soft sm:inline">illustrative</span>
                  <Search className="h-4 w-4" />
                  <Menu className="h-4 w-4" />
                </div>
              </div>
              <div className="relative min-h-0 flex-1">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={p.slug}
                    className="absolute inset-0"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={spring.ui}
                  >
                    <ProjectMock kind={p.mock} active />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-3.5">
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/80 px-3.5 text-[13px] text-black transition-colors hover:bg-white"
                >
                  <GithubIcon className="h-3.5 w-3.5" /> View source
                </a>
                {p.stack.slice(0, 4).map((s) => (
                  <span key={s} className="chip hidden sm:inline">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 flex items-center justify-between gap-4">
        <RoundButton onClick={() => go(i - 1)} label="Previous project">
          <ArrowLeft className="h-4 w-4" />
        </RoundButton>
        <AnimatePresence mode="wait" initial={false}>
          <motion.a
            key={p.slug}
            href={p.repo}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="group t-small max-w-[520px] text-center text-soft text-balance hover:text-ink"
          >
            {p.tagline} <ArrowUpRight className="inline h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.a>
        </AnimatePresence>
        <RoundButton onClick={() => go(i + 1)} label="Next project">
          <ArrowRight className="h-4 w-4" />
        </RoundButton>
      </div>
    </section>
  );
}
