import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowUp, ChevronDown, Sparkles } from "lucide-react";
import { buildCorpus, createRetriever, type Hit } from "@/lib/retrieval";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const suggestions = ["What have you built with RAG?", "Which LLM providers?", "Where did you intern?", "Tell me about MediRAG", "Certifications?", "How do you work?"];

const NOT_FOUND = "I couldn't find that anywhere on this page, and I'd rather say so than guess. Try rephrasing, or reach out directly.";

type Turn = { q: string; hits: Hit[]; confident: boolean; ms: number };

/** "Ask my portfolio": in-browser retrieval over this page, streamed back with citations. */
export function AskTile() {
  const search = useMemo(() => createRetriever(buildCorpus()), []);
  const [query, setQuery] = useState("");
  const [turn, setTurn] = useState<Turn | null>(null);
  const [typed, setTyped] = useState("");
  const [trace, setTrace] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => () => clearInterval(timer.current), []);

  function ask(q: string) {
    const t0 = performance.now();
    const r = search(q);
    const ms = performance.now() - t0;
    setTurn({ q, hits: r.hits, confident: r.confident, ms });
    setQuery("");
    setTrace(false);

    const full = r.confident && r.hits[0] ? r.hits[0].answer : NOT_FOUND;
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
    if (query.trim()) ask(query.trim());
  }

  const answer = turn?.confident && turn.hits[0] ? turn.hits[0].answer : NOT_FOUND;
  const streaming = turn !== null && typed.length < answer.length;

  return (
    <div className="tile flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-lilac" /> Ask my portfolio
        </p>
        <span className="font-mono text-[10px] tracking-wider text-faint uppercase">in-browser · cites sources</span>
      </div>

      <div ref={scroller} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4" data-lenis-prevent>
        {!turn && (
          <>
            <p className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm leading-relaxed text-muted">
              Hi! I answer questions about Nitesh from this page only, with sources. No LLM behind me, so no made-up facts.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => ask(s)} className="chip transition-colors hover:border-line-strong hover:text-ink">
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {turn && (
          <motion.div key={turn.q} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-accent/20 px-3.5 py-2 text-sm text-ink">{turn.q}</p>
            <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-line bg-white/[0.03] px-3.5 py-3 text-sm leading-relaxed text-ink">
              {typed}
              {streaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-lilac" />}
              {!streaming && turn.confident && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {turn.hits.slice(0, 3).map((h, i) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => scrollToId(h.anchor)}
                      className="rounded-md border border-accent/30 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] text-lilac hover:bg-accent/20"
                    >
                      [{i + 1}] {h.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {!streaming && (
              <div>
                <button type="button" onClick={() => setTrace((t) => !t)} className="flex items-center gap-1 font-mono text-[10px] text-faint hover:text-muted">
                  <ChevronDown className={cn("h-3 w-3 transition-transform", trace && "rotate-180")} />
                  retrieval trace · {turn.ms.toFixed(1)} ms · {turn.hits.length} chunks
                </button>
                <AnimatePresence initial={false}>
                  {trace && (
                    <motion.ol initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 space-y-1 overflow-hidden">
                      {turn.hits.map((h, i) => (
                        <li key={h.id} className="flex justify-between gap-3 rounded-lg border border-line bg-black/30 px-2.5 py-1.5 font-mono text-[10px] text-faint">
                          <span className="truncate text-muted">[{i + 1}] {h.section} · {h.title}</span>
                          <span className="shrink-0">kw #{h.bm25Rank ?? "–"} · fz #{h.fuzzyRank ?? "–"}</span>
                        </li>
                      ))}
                    </motion.ol>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-line p-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about projects, stack, experience…"
          className="h-10 min-w-0 flex-1 rounded-full border border-line bg-black/30 px-4 text-sm outline-none placeholder:text-faint focus:border-accent/50"
          aria-label="Ask a question about Nitesh"
        />
        <button type="submit" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-bg transition-opacity disabled:opacity-40" disabled={!query.trim()} aria-label="Ask">
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
