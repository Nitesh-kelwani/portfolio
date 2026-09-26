import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { offDuty, projects, type MockKind } from "@/data/content";
import { Chips, Container, GithubIcon, Reveal, SectionHeader, WindowFrame } from "@/components/ui/primitives";
import { ProjectMock } from "./mocks";
import { cn } from "@/lib/utils";

/** Small screens show each mock inline; it plays whenever the mock itself is on screen. */
function MobileMock({ slug, kind }: { slug: string; kind: MockKind }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px -15% 0px" });
  return (
    <div ref={ref} className="mb-7 aspect-[4/5] sm:aspect-[4/3] lg:hidden">
      <WindowFrame title={`${slug} — demo`}>
        <ProjectMock kind={kind} active={inView} />
      </WindowFrame>
    </div>
  );
}

/** Sticky-scroll showcase: text scrolls on the left, the live mock swaps on the right. */
export function SelectedWork() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = projects[active];

  return (
    <Container id="work" className="py-28 md:py-36">
      <SectionHeader
        eyebrow="Selected work"
        lead="Things I've built,"
        accent="in the open."
        body="Six systems, all open source. Scroll through them: each one shows how it works, not just what it is."
      />

      <div className="mt-10 grid gap-8 lg:mt-4 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          {projects.map((p, i) => (
            <article
              key={p.slug}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className="flex flex-col justify-center py-12 lg:min-h-[78vh] lg:py-0"
            >
              <MobileMock slug={p.slug} kind={p.mock} />
              <div className={cn("transition-opacity duration-500", active === i ? "lg:opacity-100" : "lg:opacity-35")}>
                <p className="font-mono text-xs text-faint">
                  {String(i + 1).padStart(2, "0")} <span className="text-line-strong">/</span> {String(projects.length).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{p.name}</h3>
                <p className="mt-2 font-serif text-xl text-lilac italic md:text-2xl">{p.tagline}</p>
                <p className="mt-4 leading-relaxed text-muted text-pretty">{p.description}</p>
                <ol className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-2 font-mono text-[11px] text-muted">
                  {p.flow.map((step, j) => (
                    <li key={step} className="flex items-center gap-1.5">
                      <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5">{step}</span>
                      {j < p.flow.length - 1 && <span className="text-faint">→</span>}
                    </li>
                  ))}
                </ol>
                <Chips items={p.stack} className="mt-5" />
                <a href={p.repo} target="_blank" rel="noreferrer" className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink">
                  <GithubIcon className="h-4 w-4" /> View the code
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </article>
          ))}

          <Reveal className="tile mt-6 flex items-start gap-4 p-5">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-lilac" />
            <div>
              <p className="text-sm font-medium">
                Off duty: {offDuty.name}{" "}
                <a href={offDuty.repo} target="_blank" rel="noreferrer" className="text-lilac hover:underline">
                  ↗
                </a>
              </p>
              <p className="mt-1 text-sm text-muted">{offDuty.blurb}</p>
            </div>
          </Reveal>
        </div>

        <div className="hidden lg:col-span-7 lg:block">
          <div className="sticky top-[13vh] h-[74vh]">
            <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,rgb(112_118_248/0.18),transparent)]" />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current.slug}
                className="absolute inset-0"
                initial={{ opacity: 0, y: 24, scale: 0.97, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -24, scale: 0.97, filter: "blur(6px)", transition: { duration: 0.25 } }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <WindowFrame title={`${current.slug} — demo`}>
                  <ProjectMock kind={current.mock} active />
                </WindowFrame>
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-1/2 -right-6 flex -translate-y-1/2 flex-col gap-2">
              {projects.map((p, i) => (
                <span key={p.slug} className={cn("h-1.5 w-1.5 rounded-full transition-all duration-300", i === active ? "h-5 bg-lilac" : "bg-white/15")} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
