import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Play, RotateCcw, ShieldAlert, ShieldCheck, X } from "lucide-react";
import { lab } from "@/data/content";
import { Container, Reveal, SectionHeader } from "@/components/ui/primitives";
import { GlowTile } from "@/components/ui/effects";
import { cn } from "@/lib/utils";

/* ---------------- Chunk it ---------------- */

type Range = [number, number];

function fixedChunks(text: string, size: number, overlap: number): Range[] {
  const out: Range[] = [];
  let s = 0;
  while (s < text.length) {
    const e = Math.min(text.length, s + size);
    out.push([s, e]);
    if (e === text.length) break;
    s = Math.max(e - overlap, s + 1);
  }
  return out;
}

function sentenceRanges(text: string): Range[] {
  const out: Range[] = [];
  const re = /[^.!?]+[.!?]+["”’)]*\s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) out.push([m.index, m.index + m[0].length]);
  if (!out.length) out.push([0, text.length]);
  return out;
}

function sentenceChunks(text: string, size: number, overlapOne: boolean): Range[] {
  const sents = sentenceRanges(text);
  const out: Range[] = [];
  let i = 0;
  while (i < sents.length) {
    let j = i;
    while (j + 1 < sents.length && sents[j + 1][1] - sents[i][0] <= size) j++;
    out.push([sents[i][0], sents[j][1]]);
    if (j + 1 >= sents.length) break;
    i = overlapOne && j > i ? j : j + 1;
  }
  return out;
}

const chunkColors = ["rgb(112 118 248 / 0.28)", "rgb(155 140 248 / 0.28)", "rgb(61 180 220 / 0.22)", "rgb(61 220 151 / 0.2)"];

function ChunkIt() {
  const text = lab.chunkSample;
  const [mode, setMode] = useState<"fixed" | "sentence">("fixed");
  const [size, setSize] = useState(160);
  const [overlap, setOverlap] = useState(30);
  const [sentOverlap, setSentOverlap] = useState(true);

  const chunks = useMemo(
    () => (mode === "fixed" ? fixedChunks(text, size, overlap) : sentenceChunks(text, size, sentOverlap)),
    [text, mode, size, overlap, sentOverlap],
  );

  const sentenceEnds = useMemo(() => new Set(sentenceRanges(text).map((r) => r[1])), [text]);
  const midCuts = chunks.filter(([, e]) => e !== text.length && !sentenceEnds.has(e) && !/[.!?]\s*$/.test(text.slice(0, e))).length;
  const avg = Math.round(chunks.reduce((s, [a, b]) => s + (b - a), 0) / chunks.length);

  // split the text into segments between every chunk boundary
  const segments = useMemo(() => {
    const cuts = new Set<number>([0, text.length]);
    chunks.forEach(([a, b]) => {
      cuts.add(a);
      cuts.add(b);
    });
    const pts = [...cuts].sort((a, b) => a - b);
    return pts.slice(0, -1).map((a, k) => {
      const b = pts[k + 1];
      const covering = chunks.map((c, idx) => (c[0] <= a && c[1] >= b ? idx : -1)).filter((x) => x >= 0);
      return { a, b, covering };
    });
  }, [chunks, text]);

  return (
    <GlowTile className="p-6 lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">01 · Chunk it</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">What does your retriever actually see?</h3>
        </div>
        <div className="inline-flex rounded-full border border-line p-1 text-xs" role="radiogroup" aria-label="Chunking strategy">
          {(["fixed", "sentence"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => setMode(m)}
              className={cn("rounded-full px-3 py-1.5 transition-colors", mode === m ? "bg-white/10 text-ink" : "text-muted hover:text-ink")}
            >
              {m === "fixed" ? "Fixed size" : "Sentence-aware"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="flex justify-between font-mono text-[11px] text-muted">
            chunk size <span className="text-ink">{size} chars</span>
          </span>
          <input type="range" min={60} max={360} step={10} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-2 w-full" />
        </label>
        {mode === "fixed" ? (
          <label className="block">
            <span className="flex justify-between font-mono text-[11px] text-muted">
              overlap <span className="text-ink">{overlap} chars</span>
            </span>
            <input type="range" min={0} max={Math.min(120, size - 10)} step={5} value={Math.min(overlap, size - 10)} onChange={(e) => setOverlap(Number(e.target.value))} className="mt-2 w-full" />
          </label>
        ) : (
          <label className="flex items-center gap-2 self-end font-mono text-[11px] text-muted">
            <input type="checkbox" checked={sentOverlap} onChange={(e) => setSentOverlap(e.target.checked)} />
            overlap by one sentence
          </label>
        )}
      </div>

      <p className="mt-5 rounded-xl border border-line bg-black/30 p-4 text-[14px] leading-7 text-ink/90" aria-label="Chunked text preview">
        {segments.map((s) => {
          const overlapSeg = s.covering.length > 1;
          return (
            <span
              key={`${s.a}-${s.b}`}
              className={cn("rounded-[3px] transition-colors duration-300", overlapSeg && "underline decoration-warn decoration-2 underline-offset-4")}
              style={{ background: s.covering.length ? chunkColors[s.covering[0] % chunkColors.length] : undefined }}
            >
              {text.slice(s.a, s.b)}
            </span>
          );
        })}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[11px]">
        <div className="rounded-lg border border-line px-3 py-2">
          <p className="text-faint">chunks</p>
          <p className="text-base text-ink">{chunks.length}</p>
        </div>
        <div className="rounded-lg border border-line px-3 py-2">
          <p className="text-faint">avg length</p>
          <p className="text-base text-ink">{avg}</p>
        </div>
        <div className={cn("rounded-lg border px-3 py-2", midCuts ? "border-warn/30" : "border-live/30")}>
          <p className="text-faint">cut mid-sentence</p>
          <p className={cn("text-base", midCuts ? "text-warn" : "text-live")}>{midCuts}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-faint">
        Underlined text sits in two chunks at once. Sentence-aware splitting is the idea behind MediRAG's section-aware chunker.
      </p>
    </GlowTile>
  );
}

/* ---------------- Guard it ---------------- */

function checkSql(sql: string) {
  const hasComment = /--|\/\*/.test(sql);
  const stripped = sql
    .replace(/'(?:[^']|'')*'/g, "''")
    .replace(/--[^\n]*/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ");
  const statements = stripped.split(";").map((s) => s.trim()).filter(Boolean);
  const first = statements[0]?.match(/^\(*\s*(\w+)/)?.[1]?.toUpperCase();
  const forbidden = stripped.match(/\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|GRANT|REVOKE|MERGE|REPLACE|ATTACH|PRAGMA|EXEC)\b/i);
  const rules = [
    { label: "Exactly one statement", ok: statements.length === 1 },
    { label: "Starts with SELECT or WITH", ok: first === "SELECT" || first === "WITH" },
    { label: forbidden ? `No write keywords (found ${forbidden[1].toUpperCase()})` : "No write or schema keywords", ok: !forbidden },
    { label: "No comments that could hide code", ok: !hasComment },
  ];
  return { rules, allowed: rules.every((r) => r.ok) && statements.length > 0 };
}

function GuardIt() {
  const [sql, setSql] = useState(lab.guardPresets[0].sql);
  const verdict = useMemo(() => checkSql(sql), [sql]);

  return (
    <GlowTile className="p-6 lg:row-span-2">
      <p className="eyebrow">02 · Guard it</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">Would this query run?</h3>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {lab.guardPresets.map((p) => (
          <button key={p.label} type="button" onClick={() => setSql(p.sql)} className={cn("chip transition-colors hover:text-ink", sql === p.sql && "border-accent/50 text-ink")}>
            {p.label}
          </button>
        ))}
      </div>
      <textarea
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        spellCheck={false}
        rows={6}
        className="mt-3 min-h-[140px] w-full flex-1 resize-none rounded-xl border border-line bg-black/40 p-3 font-mono text-[12px] leading-5 text-ink outline-none focus:border-accent/50"
        data-lenis-prevent
        aria-label="SQL to check"
      />
      <motion.div
        key={String(verdict.allowed)}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "mt-3 flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium",
          verdict.allowed ? "border-live/30 bg-live/10 text-live" : "border-danger/30 bg-danger/10 text-danger",
        )}
      >
        {verdict.allowed ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
        {verdict.allowed ? "Allowed: safe to execute" : "Blocked before it reaches the database"}
      </motion.div>
      <ul className="mt-3 space-y-1.5">
        {verdict.rules.map((r) => (
          <li key={r.label} className="flex items-center gap-2 font-mono text-[11px]">
            {r.ok ? <Check className="h-3.5 w-3.5 text-live" /> : <X className="h-3.5 w-3.5 text-danger" />}
            <span className={r.ok ? "text-muted" : "text-ink"}>{r.label}</span>
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-3 text-xs text-faint">Deliberately strict. The same idea guards my SQL Chatbot.</p>
    </GlowTile>
  );
}

/* ---------------- Stream it ---------------- */

function StreamIt() {
  const words = useMemo(() => lab.streamAnswer.split(" "), []);
  const TTFT = 350;
  const PER_WORD = 45;
  const total = TTFT + words.length * PER_WORD;
  const [run, setRun] = useState(0);
  const [streamed, setStreamed] = useState(0);
  const [blockingDone, setBlockingDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!run) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStreamed(0);
    setBlockingDone(false);
    setElapsed(0);
    const start = performance.now();
    words.forEach((_, i) => timers.current.push(window.setTimeout(() => setStreamed(i + 1), TTFT + i * PER_WORD)));
    timers.current.push(window.setTimeout(() => setBlockingDone(true), total));
    const tick = window.setInterval(() => {
      const t = performance.now() - start;
      setElapsed(Math.min(t, total));
      if (t >= total) clearInterval(tick);
    }, 50);
    timers.current.push(tick);
    return () => timers.current.forEach((t) => (clearTimeout(t), clearInterval(t)));
  }, [run, words, total]);

  const secs = (ms: number) => `${(ms / 1000).toFixed(2)}s`;

  return (
    <GlowTile className="p-6 lg:col-span-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">03 · Stream it</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">Same answer, different wait.</h3>
        </div>
        <button type="button" onClick={() => setRun((r) => r + 1)} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-bg">
          {run ? <RotateCcw className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />} {run ? "Again" : "Run"}
        </button>
      </div>
      <div className="mt-4 grid flex-1 grid-cols-2 gap-2">
        {[
          { label: "blocking", first: total, body: blockingDone ? lab.streamAnswer : "" },
          { label: "streaming", first: TTFT, body: words.slice(0, streamed).join(" ") },
        ].map((panel) => (
          <div key={panel.label} className="flex min-h-[150px] flex-col rounded-xl border border-line bg-black/30 p-3">
            <p className="flex justify-between font-mono text-[10px] text-faint">
              {panel.label}
              <span>{run ? `first words ${secs(panel.first)}` : ""}</span>
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-ink/90">
              {panel.body}
              {run > 0 && !panel.body && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-faint border-t-lilac align-middle" />}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full bg-gradient-to-r from-accent to-accent-2" style={{ width: `${(elapsed / total) * 100}%` }} />
      </div>
      <p className="mt-2 font-mono text-[10px] text-faint">simulated timings · total {secs(total)} for both</p>
    </GlowTile>
  );
}

export function Lab() {
  return (
    <Container id="lab" className="py-28 md:py-36">
      <SectionHeader
        eyebrow="The lab"
        lead="Small demos,"
        accent="real ideas."
        body="Three things every LLM engineer wrestles with, turned into toys you can poke. Everything here runs in your browser."
      />
      <Reveal className="mt-14 grid gap-3 lg:grid-cols-3">
        <ChunkIt />
        <GuardIt />
        <StreamIt />
      </Reveal>
    </Container>
  );
}
