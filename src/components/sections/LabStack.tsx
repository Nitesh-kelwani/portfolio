import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, Play, RotateCcw, ShieldAlert, ShieldCheck, Sparkle, X } from "lucide-react";
import { lab, labSection } from "@/data/content";
import { checkSql, fixedChunks, midSentenceCuts, segmentsOf, sentenceChunks } from "@/lib/lab";
import { spring } from "@/lib/motion";
import { Scene } from "@/components/ui/Landscape";
import { SectionHead } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/* ---------------- widgets ---------------- */

function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="flex rounded-xl bg-white/[0.05] p-1" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={value === o.v}
          onClick={() => onChange(o.v)}
          className={cn("relative flex-1 rounded-lg py-1.5 text-[13px] transition-colors", value === o.v ? "text-ink" : "text-muted hover:text-ink")}
        >
          {value === o.v && <motion.span layoutId={`seg-${label}`} className="absolute inset-0 rounded-lg bg-white/10" transition={spring.ui} />}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

const chunkColors = ["rgb(211 151 148 / 0.34)", "rgb(232 200 160 / 0.26)", "rgb(160 190 170 / 0.26)", "rgb(190 170 220 / 0.26)"];

function ChunkWidget() {
  const text = lab.chunkSample;
  const [mode, setMode] = useState<"fixed" | "sentence">("fixed");
  const [size, setSize] = useState(140);
  const chunks = useMemo(() => (mode === "fixed" ? fixedChunks(text, size, 24) : sentenceChunks(text, size, true)), [text, mode, size]);
  const segments = useMemo(() => segmentsOf(text, chunks), [text, chunks]);
  const cuts = midSentenceCuts(text, chunks);

  return (
    <div className="space-y-4">
      <Segmented
        label="Chunking strategy"
        value={mode}
        onChange={setMode}
        options={[
          { v: "fixed", label: "Fixed size" },
          { v: "sentence", label: "Sentence-aware" },
        ]}
      />
      <label className="block">
        <span className="flex justify-between text-[12px] text-faint">
          chunk size <span className="text-soft">{size} chars</span>
        </span>
        <input type="range" min={60} max={320} step={10} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-2 w-full" />
      </label>
      <p className="max-h-[150px] overflow-hidden rounded-xl bg-black/25 p-3 text-[12px] leading-[1.7] text-soft" aria-label="Chunked text preview">
        {segments.map((s) => (
          <span
            key={`${s.a}-${s.b}`}
            className={cn("rounded-[3px] transition-colors duration-300", s.covering.length > 1 && "underline decoration-white/60 underline-offset-4")}
            style={{ background: s.covering.length ? chunkColors[s.covering[0] % chunkColors.length] : undefined }}
          >
            {text.slice(s.a, s.b)}
          </span>
        ))}
      </p>
      <div className="grid grid-cols-2 divide-x divide-white/10">
        <div>
          <p className="text-[34px] leading-none font-light tracking-[-0.04em] text-ink">{chunks.length}</p>
          <p className="mt-1.5 text-[12px] text-faint">chunks</p>
        </div>
        <div className="pl-5">
          <p className={cn("text-[34px] leading-none font-light tracking-[-0.04em]", cuts ? "text-warn" : "text-live")}>{cuts}</p>
          <p className="mt-1.5 text-[12px] text-faint">cut mid-sentence</p>
        </div>
      </div>
    </div>
  );
}

function GuardWidget() {
  const [idx, setIdx] = useState(0);
  const [sql, setSql] = useState(lab.guardPresets[0].sql);
  const verdict = useMemo(() => checkSql(sql), [sql]);
  const pick = (i: number) => {
    setIdx(i);
    setSql(lab.guardPresets[i].sql);
  };

  return (
    <div className="space-y-3.5">
      <div>
        <p className="text-[12px] text-faint">Query</p>
        <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto">
          {lab.guardPresets.map((p, i) => (
            <button
              key={p.label}
              type="button"
              onClick={() => pick(i)}
              className={cn("shrink-0 rounded-lg px-2.5 py-1 text-[12px] transition-colors", idx === i && sql === p.sql ? "bg-white/15 text-ink" : "bg-white/[0.05] text-muted hover:text-ink")}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        spellCheck={false}
        rows={5}
        data-lenis-prevent
        aria-label="SQL to check"
        className="w-full resize-none rounded-xl bg-black/25 p-3 font-mono text-[11.5px] leading-5 text-soft outline-none focus:ring-1 focus:ring-white/20"
      />
      <motion.div
        key={String(verdict.allowed)}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px]", verdict.allowed ? "bg-live/10 text-live" : "bg-danger/10 text-danger")}
      >
        {verdict.allowed ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
        {verdict.allowed ? "Allowed: safe to execute" : "Blocked before it reaches the database"}
      </motion.div>
      <ul className="space-y-1.5">
        {verdict.rules.map((r) => (
          <li key={r.label} className="flex items-center gap-2 text-[12px]">
            {r.ok ? <Check className="h-3.5 w-3.5 text-live" /> : <X className="h-3.5 w-3.5 text-danger" />}
            <span className={r.ok ? "text-muted" : "text-ink"}>{r.label}</span>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button type="button" onClick={() => pick(0)} className="h-10 rounded-full bg-white/[0.07] text-[13px] text-soft transition-colors hover:bg-white/10">
          Reset
        </button>
        <button type="button" onClick={() => pick((idx + 1) % lab.guardPresets.length)} className="h-10 rounded-full bg-white/80 text-[13px] text-black transition-colors hover:bg-white">
          Try another
        </button>
      </div>
    </div>
  );
}

function StreamWidget() {
  const words = useMemo(() => lab.streamAnswer.split(" "), []);
  const TTFT = 350;
  const PER_WORD = 55;
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
  const panels = [
    { label: "Blocking", first: total, body: blockingDone ? lab.streamAnswer : "" },
    { label: "Streaming", first: TTFT, body: words.slice(0, streamed).join(" ") },
  ];

  return (
    <div className="space-y-3.5">
      {panels.map((p) => (
        <div key={p.label} className="rounded-xl bg-black/25 p-3">
          <p className="flex justify-between text-[12px] text-faint">
            {p.label}
            <span>{run ? `first words in ${secs(p.first)}` : "idle"}</span>
          </p>
          <p className="mt-2 min-h-[72px] text-[12.5px] leading-relaxed text-soft">
            {p.body}
            {run > 0 && !p.body && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/15 border-t-white/70 align-middle" />}
          </p>
        </div>
      ))}
      <div className="h-1 overflow-hidden rounded-full bg-white/[0.07]">
        <div className="h-full bg-white/60" style={{ width: `${(elapsed / total) * 100}%` }} />
      </div>
      <button type="button" onClick={() => setRun((r) => r + 1)} className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-white/80 text-[13px] text-black transition-colors hover:bg-white">
        {run ? <RotateCcw className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        {run ? "Run again" : "Run both"}
      </button>
    </div>
  );
}

/* ---------------- stacking cards ---------------- */

const widgets: ReactNode[] = [<ChunkWidget key="c" />, <GuardWidget key="g" />, <StreamWidget key="s" />];

function StackCard({ i, n, progress, children }: { i: number; n: number; progress: MotionValue<number>; children: ReactNode }) {
  const last = i === n - 1;
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.035]);
  const shade = useTransform(progress, [i / n, (i + 1) / n], [0, last ? 0 : 0.45]);
  return (
    <div className="md:sticky md:top-[88px]" style={{ zIndex: i + 1 }}>
      <motion.div style={{ scale }} className="relative origin-top">
        {children}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[24px] bg-black" style={{ opacity: shade }} />
      </motion.div>
    </div>
  );
}

/** Powder's "What you get": split cards that stick and stack as you scroll. */
export function LabStack() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const n = lab.cards.length;

  return (
    <section id="lab" className="relative mx-auto w-full max-w-[1112px] px-4 py-24 sm:px-6 md:py-32">
      <SectionHead tag={labSection.tag} title={labSection.title} muted={labSection.muted} side={labSection.side} />

      <div ref={container} className="mt-14 space-y-6 md:space-y-10">
        {lab.cards.map((c, i) => (
          <StackCard key={c.label} i={i} n={n} progress={scrollYProgress}>
            <article className="card grid overflow-hidden rounded-[24px] bg-[#0f0f0f] md:h-[580px] md:grid-cols-2">
              <div className={cn("flex flex-col p-7 sm:p-10", i % 2 === 1 && "md:order-2")}>
                <p className="flex items-center gap-2 text-[13px] text-soft">
                  <span className="h-1.5 w-1.5 rounded-full bg-soft" /> {c.label}
                </p>
                <h3 className="t-h3 mt-6 max-w-[380px] text-ink text-balance">{c.title}</h3>
                <p className="t-small mt-4 max-w-[340px] text-soft">{c.body}</p>
                <p className="mt-10 flex items-center gap-2 text-[13px] text-muted md:mt-auto">
                  <Sparkle className="h-3.5 w-3.5" strokeWidth={1.5} /> {c.note}
                </p>
              </div>
              <Scene className="flex min-h-[520px] items-center justify-center p-5 sm:p-8" photo={(["valley", "dusk", "forest"] as const)[i]} clouds={i === 1}>
                <div className="glass-soft relative z-10 w-full max-w-[400px] rounded-[22px] p-5">{widgets[i]}</div>
              </Scene>
            </article>
          </StackCard>
        ))}
      </div>
    </section>
  );
}
