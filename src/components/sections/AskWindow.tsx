import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowUp, CircleArrowRight, FileText, Menu, Search, Sparkles, X } from "lucide-react";
import { ask } from "@/data/content";
import { buildCorpus, createRetriever, type Hit } from "@/lib/retrieval";
import { scrollToId } from "@/lib/scroll";
import { spring } from "@/lib/motion";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type Turn = { q: string; hits: Hit[]; confident: boolean; ms: number };

const fade = (delay: number, animate: boolean) =>
  animate ? { initial: { opacity: 0.001 }, animate: { opacity: 1 }, transition: { ...spring.enter, delay } } : {};

/**
 * "Ask my portfolio", dressed as Powder's app window. Retrieval runs in the
 * browser over this page's own content and streams the best passage back, cited.
 */
export function AskWindow({ variant = "hero", className }: { variant?: "hero" | "cta"; className?: string }) {
  const search = useMemo(() => createRetriever(buildCorpus()), []);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [typed, setTyped] = useState("");
  const timer = useRef<number | undefined>(undefined);
  const scroller = useRef<HTMLDivElement>(null);
  const hero = variant === "hero";

  useEffect(() => () => clearInterval(timer.current), []);

  function run(q: string) {
    const t0 = performance.now();
    const r = search(q);
    const ms = performance.now() - t0;
    setTurn({ q, hits: r.hits, confident: r.confident, ms });
    setQuery("");

    const full = r.confident && r.hits[0] ? r.hits[0].answer : ask.notFound;
    clearInterval(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(full);
      return;
    }
    let i = 0;
    setTyped("");
    timer.current = window.setInterval(() => {
      i = Math.min(full.length, i + 3);
      setTyped(full.slice(0, i));
      scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
      if (i >= full.length) clearInterval(timer.current);
    }, 16);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) run(query.trim());
  }

  function reset() {
    clearInterval(timer.current);
    setTurn(null);
    setTyped("");
  }

  const answer = turn?.confident && turn.hits[0] ? turn.hits[0].answer : ask.notFound;
  const streaming = turn !== null && typed.length < answer.length;

  // Once the answer finishes, bring the source chips into view.
  useEffect(() => {
    if (!turn || streaming) return;
    const t = window.setTimeout(() => scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" }), 120);
    return () => clearTimeout(t);
  }, [turn, streaming]);

  return (
    <div className={cn("glass flex flex-col overflow-hidden rounded-t-[24px]", className)}>
      {/* chrome */}
      <div className="flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6">
        <Logo className="h-7 w-7 text-white/85" />
        <button
          type="button"
          onClick={reset}
          aria-label={turn ? "Start a new question" : "Menu"}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.06] text-soft transition-colors hover:bg-white/10"
        >
          {turn ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-[586px] flex-1 flex-col px-4 sm:px-0">
        {/* title or conversation */}
        <div className={cn("relative", hero ? "h-[178px] sm:h-[190px]" : "h-[150px] sm:h-[170px]")}>
          <AnimatePresence mode="popLayout">
            {!turn ? (
              <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} className="flex h-full flex-col items-center justify-center pb-2 text-center">
                <motion.h4 {...fade(0.3, hero)} className="t-h3 text-ink">
                  {ask.title}
                </motion.h4>
                <motion.p {...fade(0.4, hero)} className="t-small mt-2 text-muted">
                  {ask.sub}
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key={turn.q}
                ref={scroller}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                data-lenis-prevent
                className="no-scrollbar absolute inset-0 space-y-3 overflow-y-auto py-4 [mask-image:linear-gradient(to_bottom,transparent,black_14px,black_calc(100%-14px),transparent)]"
              >
                <p className="t-small ml-auto w-fit max-w-[85%] rounded-2xl bg-white/10 px-4 py-2.5 text-ink">{turn.q}</p>
                <div className="t-small max-w-[96%] text-soft">
                  {typed}
                  {streaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-soft" />}
                </div>
                {!streaming && turn.confident && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <p className="text-[12px] text-faint">
                      {turn.hits.length} sources · retrieved in {turn.ms.toFixed(1)} ms
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {turn.hits.map((h, i) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => scrollToId(h.anchor)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.07] px-2 py-1 text-[12px] text-soft transition-colors hover:bg-white/[0.12]"
                        >
                          <FileText className="h-3 w-3 text-faint" />
                          {h.section} · {h.title.length > 26 ? `${h.title.slice(0, 26)}…` : h.title}
                          <span className="grid h-4 w-4 place-items-center rounded bg-white/10 text-[10px]">{i + 1}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* input */}
        <motion.form
          {...fade(0.5, hero)}
          onSubmit={onSubmit}
          className="flex flex-col rounded-2xl bg-[rgb(23_23_23/0.5)] p-3.5 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)] sm:p-4"
        >
          <input
            id={hero ? "ask-input" : undefined}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ask.placeholder}
            aria-label="Ask a question about Nitesh"
            className="t-small h-9 w-full bg-transparent text-ink outline-none placeholder:text-faint"
          />
          <div className="mt-3 flex items-center justify-between sm:mt-5">
            <span className="flex items-center gap-1.5 text-[12px] text-faint">
              <Sparkles className="h-3.5 w-3.5" /> in-browser retrieval · cites sources
            </span>
            <button
              type="submit"
              disabled={!query.trim()}
              aria-label="Ask"
              className="grid h-7 w-7 place-items-center rounded-full bg-white/80 text-black transition-opacity disabled:opacity-50"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </motion.form>

        {/* categories */}
        <motion.div {...fade(0.6, hero)} className="mt-7 flex items-center gap-1 sm:mt-9">
          <div className="no-scrollbar flex gap-1 overflow-x-auto" role="tablist" aria-label="Question topics">
            {ask.categories.map((c, i) => (
              <button
                key={c.label}
                type="button"
                role="tab"
                aria-selected={cat === i}
                onClick={() => setCat(i)}
                className={cn("t-small shrink-0 rounded-lg px-3 py-1 transition-colors", cat === i ? "bg-white/10 text-ink" : "text-muted hover:text-ink")}
              >
                {c.label}
              </button>
            ))}
          </div>
          {!hero && <Search className="ml-auto h-4 w-4 shrink-0 text-faint" />}
        </motion.div>

        {/* suggestions */}
        <ul className="mt-3">
          {ask.categories[cat].suggestions.map((s, i) => (
            <motion.li key={`${cat}-${s}`} {...fade(0.7 + i * 0.1, hero)} className="border-b border-line last:border-0">
              <button
                type="button"
                onClick={() => run(s)}
                className="group t-small flex w-full items-center justify-between gap-3 py-3.5 text-left text-muted transition-colors hover:text-ink"
              >
                {s}
                <CircleArrowRight className="h-4 w-4 shrink-0 text-faint transition-colors group-hover:text-ink" strokeWidth={1.5} />
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
