import { motion, type Variants } from "motion/react";
import { Download, FileText, Mic, Search, ShieldCheck, Volume2, Wrench } from "lucide-react";
import type { MockKind } from "@/data/content";
import { cn } from "@/lib/utils";

// Illustrative product sketches: sample data, real interaction patterns.
// Every mock replays its animation each time it becomes the active project.

const seq = (step = 0.12, delay = 0.1): Variants => ({ off: {}, on: { transition: { staggerChildren: step, delayChildren: delay } } });
const item: Variants = { off: { opacity: 0, y: 10 }, on: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };

function Bubble({ children, side = "left", className }: { children: React.ReactNode; side?: "left" | "right"; className?: string }) {
  return (
    <motion.div
      variants={item}
      className={cn(
        "max-w-[88%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed",
        side === "right" ? "ml-auto rounded-tr-sm bg-accent/20 text-ink" : "rounded-tl-sm border border-line bg-white/[0.03] text-ink",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

const Cite = ({ n }: { n: number }) => (
  <span className="mx-0.5 rounded border border-accent/40 bg-accent/15 px-1 font-mono text-[9px] text-lilac">{n}</span>
);

function Bar({ label, value, warn, active }: { label: string; value: number; warn?: boolean; active: boolean }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-[9px] text-faint">
        <span>{label}</span>
        <span>{active ? `${value}%` : ""}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-white/[0.06]">
        <motion.div
          className={cn("h-full rounded-full", warn ? "bg-warn/80" : "bg-gradient-to-r from-accent to-accent-2")}
          initial={false}
          animate={{ width: active ? `${value}%` : "0%" }}
          transition={{ duration: 1.1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function MediragMock({ active }: { active: boolean }) {
  return (
    <motion.div className="grid h-full grid-cols-5 gap-3 p-4" variants={seq()} initial="off" animate={active ? "on" : "off"}>
      <div className="col-span-3 flex flex-col gap-3">
        <Bubble side="right">Which medications were prescribed at discharge?</Bubble>
        <motion.div variants={item} className="rounded-xl border border-line bg-white/[0.02] p-3">
          <p className="text-[12px] leading-relaxed text-ink">
            Metformin 500 mg twice daily <Cite n={1} /> and atorvastatin 20 mg at night <Cite n={2} />. The insulin sliding scale was stopped before discharge <Cite n={3} />.
          </p>
          <div className="mt-3 space-y-2 border-t border-line pt-3">
            <Bar label="faithfulness" value={94} active={active} />
            <Bar label="context recall" value={88} active={active} />
            <Bar label="hallucination risk" value={6} warn active={active} />
          </div>
        </motion.div>
        <motion.div variants={item} className="flex gap-1.5">
          {["discharge_summary.pdf", "labs_march.pdf"].map((f) => (
            <span key={f} className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 font-mono text-[9px] text-muted">
              <FileText className="h-3 w-3" /> {f}
            </span>
          ))}
        </motion.div>
      </div>
      <motion.div variants={item} className="col-span-2 flex flex-col rounded-xl border border-line bg-black/30 p-3">
        <p className="font-mono text-[9px] tracking-wider text-faint uppercase">review source · [1] p.3</p>
        <div className="mt-3 space-y-1.5">
          {[90, 75, 82].map((w, i) => <div key={i} className="h-1.5 rounded bg-white/[0.06]" style={{ width: `${w}%` }} />)}
        </div>
        <motion.p
          className="mt-3 rounded-md px-1.5 py-1 text-[11px] leading-relaxed text-ink"
          initial={false}
          animate={{ backgroundColor: active ? "rgba(112,118,248,0.22)" : "rgba(112,118,248,0)" }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          DISCHARGE MEDICATIONS: Metformin 500 mg PO BD with meals.
        </motion.p>
        <div className="mt-3 space-y-1.5">
          {[70, 88, 60, 80, 45].map((w, i) => <div key={i} className="h-1.5 rounded bg-white/[0.06]" style={{ width: `${w}%` }} />)}
        </div>
        <p className="mt-auto pt-3 font-mono text-[9px] text-faint">section: Medications · chunk 14 of 41</p>
      </motion.div>
    </motion.div>
  );
}

function Typed({ lines, active, delay = 0.5 }: { lines: React.ReactNode[]; active: boolean; delay?: number }) {
  return (
    <motion.pre className="overflow-hidden rounded-xl border border-line bg-black/40 p-3 font-mono text-[11px] leading-5" initial="off" animate={active ? "on" : "off"} variants={seq(0.18, delay)}>
      {lines.map((l, i) => (
        <motion.div key={i} variants={{ off: { opacity: 0, x: -6 }, on: { opacity: 1, x: 0 } }}>
          {l}
        </motion.div>
      ))}
    </motion.pre>
  );
}

const K = ({ children }: { children: React.ReactNode }) => <span className="text-lilac">{children}</span>;
const S = ({ children }: { children: React.ReactNode }) => <span className="text-live">{children}</span>;
const N = ({ children }: { children: React.ReactNode }) => <span className="text-warn">{children}</span>;

function SqlMock({ active }: { active: boolean }) {
  const rows = [
    ["Aarav Traders", "₹4,21,800"],
    ["Blue Pine Co.", "₹3,57,200"],
    ["Kiran Foods", "₹2,98,450"],
    ["Northwind", "₹2,40,100"],
    ["Sunrise Retail", "₹1,96,900"],
  ];
  return (
    <motion.div className="flex h-full flex-col justify-center gap-3 p-5" variants={seq(0.15)} initial="off" animate={active ? "on" : "off"}>
      <Bubble side="right">Top 5 customers by revenue this year?</Bubble>
      <motion.div variants={item}>
        <Typed
          active={active}
          lines={[
            <><K>SELECT</K> customer, <K>SUM</K>(total) <K>AS</K> revenue</>,
            <><K>FROM</K> orders</>,
            <><K>WHERE</K> order_date {">="} <S>'2026-01-01'</S></>,
            <><K>GROUP BY</K> customer <K>ORDER BY</K> revenue <K>DESC</K></>,
            <><K>LIMIT</K> <N>5</N>;</>,
          ]}
        />
      </motion.div>
      <motion.div variants={item} className="flex flex-wrap gap-1.5 font-mono text-[9px]">
        <span className="inline-flex items-center gap-1 rounded-md border border-live/30 bg-live/10 px-1.5 py-0.5 text-live">
          <ShieldCheck className="h-3 w-3" /> read-only
        </span>
        <span className="rounded-md border border-line px-1.5 py-0.5 text-muted">1 statement</span>
        <span className="rounded-md border border-line px-1.5 py-0.5 text-muted">14 ms</span>
      </motion.div>
      <motion.div variants={item} className="overflow-hidden rounded-xl border border-line">
        {rows.map(([c, r], i) => (
          <div key={c} className={cn("flex justify-between px-3 py-1.5 font-mono text-[10.5px]", i % 2 ? "bg-white/[0.02]" : "")}>
            <span className="text-ink">{c}</span>
            <span className="text-muted">{r}</span>
          </div>
        ))}
      </motion.div>
      <Bubble>Aarav Traders leads this year, about 18% ahead of Blue Pine Co.</Bubble>
    </motion.div>
  );
}

function DocQaMock({ active }: { active: boolean }) {
  const docs = ["handbook.pdf", "policy.pdf", "faq.pdf"];
  return (
    <motion.div className="grid h-full grid-cols-2 gap-3 p-4" variants={seq(0.14)} initial="off" animate={active ? "on" : "off"}>
      <div className="relative">
        {docs.map((d, i) => (
          <motion.div
            key={d}
            variants={item}
            className="absolute inset-x-0 rounded-xl border border-line bg-[#101019] p-3"
            style={{ top: i * 26, bottom: (docs.length - 1 - i) * 10, zIndex: i }}
          >
            <p className="flex items-center gap-1.5 font-mono text-[9px] text-muted">
              <FileText className="h-3 w-3" /> {d}
            </p>
            <div className="mt-3 space-y-1.5">
              {[88, 72, 94, 60, 80, 70, 90, 55].map((w, j) => (
                <motion.div
                  key={j}
                  className="h-1.5 rounded"
                  style={{ width: `${w}%` }}
                  initial={false}
                  animate={{ backgroundColor: active && i === 1 && j === 3 ? "rgba(112,118,248,0.55)" : "rgba(255,255,255,0.06)" }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        <Bubble side="right">Can I work remotely on Fridays?</Bubble>
        <motion.div variants={item} className="rounded-lg border border-line bg-black/30 p-2.5 font-mono text-[10px] leading-4 text-muted">
          <span className="flex items-center gap-1 text-lilac">
            <Wrench className="h-3 w-3" /> tool call
          </span>
          search_docs(<span className="text-live">"remote work"</span>,<br />
          &nbsp;&nbsp;docs=[<span className="text-live">"policy.pdf"</span>])
        </motion.div>
        <motion.div variants={item} className="flex items-center gap-1.5 font-mono text-[10px] text-faint">
          <Search className="h-3 w-3" /> 3 passages · p.4 · p.5 · p.9
        </motion.div>
        <Bubble>
          Yes. Up to two remote days a week, Fridays included, with your manager's approval.
          <span className="mt-1.5 block font-mono text-[9px] text-lilac">[policy.pdf · p.4]</span>
        </Bubble>
      </div>
    </motion.div>
  );
}

function AuditMock({ active }: { active: boolean }) {
  const days = [
    ["M", 38], ["T", 52], ["W", 47], ["T", 91], ["F", 66], ["S", 58], ["S", 43],
  ] as const;
  return (
    <motion.div className="flex h-full flex-col gap-3 p-4" variants={seq(0.12)} initial="off" animate={active ? "on" : "off"}>
      <motion.div variants={item} className="flex items-center gap-2.5">
        <span className="h-8 w-8 rounded-full bg-gradient-to-br from-accent-2 to-warn" />
        <div>
          <p className="text-[12px] font-medium text-ink">@studio.handle</p>
          <p className="font-mono text-[9px] text-faint">last 30 posts · sample data</p>
        </div>
      </motion.div>
      <motion.div variants={item} className="grid grid-cols-3 gap-2">
        {[
          ["avg engagement", "4.8%"],
          ["best day", "Thursday"],
          ["top format", "Reels"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-line bg-white/[0.02] p-2">
            <p className="font-mono text-[8.5px] text-faint uppercase">{k}</p>
            <p className="mt-0.5 text-[13px] font-semibold text-ink">{v}</p>
          </div>
        ))}
      </motion.div>
      <motion.div variants={item} className="flex flex-1 items-end gap-2 rounded-xl border border-line bg-black/30 p-3">
        {days.map(([d, v], i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <motion.div
              className={cn("w-full rounded-md", v > 80 ? "bg-gradient-to-t from-accent to-accent-2" : "bg-white/[0.1]")}
              initial={false}
              animate={{ height: active ? `${v}%` : "4%" }}
              transition={{ duration: 0.9, delay: 0.6 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="font-mono text-[9px] text-faint">{d}</span>
          </div>
        ))}
      </motion.div>
      <motion.div variants={item} className="rounded-xl border border-accent/25 bg-accent/[0.07] p-2.5 text-[11.5px] leading-relaxed text-ink">
        <span className="font-mono text-[9px] text-lilac">LLM INSIGHT · </span>Captions that end with a question draw about twice the comments.
      </motion.div>
      <motion.button variants={item} type="button" tabIndex={-1} className="inline-flex w-fit items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[11px] font-medium text-bg">
        <Download className="h-3 w-3" /> audit_report.xlsx
      </motion.button>
    </motion.div>
  );
}

function VoiceMock({ active }: { active: boolean }) {
  const bars = Array.from({ length: 28 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 1.7)) * 0.75);
  return (
    <motion.div className="flex h-full flex-col items-center gap-3 p-4" variants={seq(0.16)} initial="off" animate={active ? "on" : "off"}>
      <motion.div variants={item} className="relative mt-2 grid h-16 w-16 place-items-center">
        {active && (
          <motion.span className="absolute inset-0 rounded-full border border-accent/50" animate={{ scale: [1, 1.6], opacity: [0.7, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
        )}
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-white shadow-[0_0_30px_rgb(112_118_248/0.5)]">
          <Mic className="h-6 w-6" />
        </span>
      </motion.div>
      <motion.div variants={item} className="flex h-10 items-center gap-[3px]">
        {bars.map((b, i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-lilac/80"
            animate={active ? { height: [`${b * 30}%`, `${(1 - b) * 70 + 30}%`, `${b * 30}%`] } : { height: "20%" }}
            transition={{ duration: 0.9 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>
      <motion.p variants={item} className="text-center font-serif text-lg italic text-ink">“Send five hundred dirhams to Sara.”</motion.p>
      <motion.div variants={item} className="w-full max-w-sm">
        <Typed
          active={active}
          delay={0.9}
          lines={[
            "{",
            <>&nbsp;&nbsp;<S>"intent"</S>: <S>"transfer"</S>,</>,
            <>&nbsp;&nbsp;<S>"amount"</S>: <N>500</N>, <S>"currency"</S>: <S>"AED"</S>,</>,
            <>&nbsp;&nbsp;<S>"beneficiary"</S>: <S>"Sara"</S>,</>,
            <>&nbsp;&nbsp;<S>"missing"</S>: [<S>"account_number"</S>]</>,
            "}",
          ]}
        />
      </motion.div>
      <Bubble className="flex max-w-sm items-center gap-2 self-stretch">
        <Volume2 className="h-3.5 w-3.5 shrink-0 text-lilac" /> Sure. What's Sara's account number?
      </Bubble>
    </motion.div>
  );
}

function PipelineMock({ active }: { active: boolean }) {
  const nodes = ["review.pdf", "embed · ada-002", "index · HNSW", "k-NN search", "grounded answer"];
  return (
    <motion.div className="grid h-full grid-cols-5 gap-4 p-4" variants={seq(0.12)} initial="off" animate={active ? "on" : "off"}>
      <div className="relative col-span-2 flex flex-col justify-between py-2">
        <div className="absolute top-4 bottom-4 left-[15px] w-px bg-line-strong" />
        {active && (
          <motion.span
            className="absolute left-[11px] h-2.5 w-2.5 rounded-full bg-lilac shadow-[0_0_14px_4px_rgb(196_192_255/0.6)]"
            animate={{ top: ["4%", "92%"] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
          />
        )}
        {nodes.map((n, i) => (
          <motion.div key={n} variants={item} className="relative flex items-center gap-3">
            <span className={cn("z-10 grid h-8 w-8 place-items-center rounded-full border font-mono text-[10px]", i === nodes.length - 1 ? "border-live/40 bg-live/10 text-live" : "border-line-strong bg-surface text-muted")}>
              {i + 1}
            </span>
            <span className="font-mono text-[11px] text-ink">{n}</span>
          </motion.div>
        ))}
      </div>
      <motion.div variants={item} className="col-span-3 self-center">
        <Typed
          active={active}
          delay={0.6}
          lines={[
            <><K>def</K> rag_pipeline(query):</>,
            <>&nbsp;&nbsp;create_or_update_index(idx)</>,
            <>&nbsp;&nbsp;doc = upload_pdf_review(pdf)</>,
            <>&nbsp;&nbsp;hits = vector_search(query, k=<N>3</N>)</>,
            <>&nbsp;&nbsp;<K>return</K> generate_answer(</>,
            <>&nbsp;&nbsp;&nbsp;&nbsp;query, hits, <S>"context only"</S>)</>,
          ]}
        />
      </motion.div>
    </motion.div>
  );
}

export function ProjectMock({ kind, active }: { kind: MockKind; active: boolean }) {
  switch (kind) {
    case "medirag":
      return <MediragMock active={active} />;
    case "sql":
      return <SqlMock active={active} />;
    case "docqa":
      return <DocQaMock active={active} />;
    case "audit":
      return <AuditMock active={active} />;
    case "voice":
      return <VoiceMock active={active} />;
    case "pipeline":
      return <PipelineMock active={active} />;
  }
}
