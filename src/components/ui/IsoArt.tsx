import type { ReactNode } from "react";
import type { IsoKind } from "@/data/content";
import { cn } from "@/lib/utils";

// Original isometric line illustrations for the "What I build" cards.
// A tiny projection helper turns (x, y, z) into screen points.

type P = [number, number, number];
const iso = ([x, y, z]: P): [number, number] => [200 + (x - y) * 0.866, 236 + (x + y) * 0.5 - z];
const pts = (list: P[]) => list.map((p) => iso(p).map((v) => v.toFixed(1)).join(",")).join(" ");

const STROKE = "rgb(255 255 255 / 0.62)";
const FAINT = "rgb(255 255 255 / 0.28)";

function Box({ at: [x, y, z], size: [w, d, h], lit = false }: { at: P; size: P; lit?: boolean }) {
  return (
    <g stroke={STROKE} strokeWidth="1.1" strokeLinejoin="round">
      <polygon points={pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]])} fill="rgb(255 255 255 / 0.035)" />
      <polygon points={pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]])} fill="rgb(255 255 255 / 0.015)" />
      <polygon points={pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={lit ? "rgb(255 243 240 / 0.14)" : "rgb(255 255 255 / 0.07)"} />
    </g>
  );
}

function Ring({ c: [cx, cy, z], r, dashed = false, fill = "none" }: { c: P; r: number; dashed?: boolean; fill?: string }) {
  const list: P[] = Array.from({ length: 48 }, (_, i) => {
    const t = (i / 48) * Math.PI * 2;
    return [cx + r * Math.cos(t), cy + r * Math.sin(t), z];
  });
  return <polygon points={pts(list)} fill={fill} stroke={dashed ? FAINT : STROKE} strokeWidth="1.1" strokeDasharray={dashed ? "3 4" : undefined} />;
}

function Line({ a, b, faint = false, dashed = false }: { a: P; b: P; faint?: boolean; dashed?: boolean }) {
  const [x1, y1] = iso(a);
  const [x2, y2] = iso(b);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={faint ? FAINT : STROKE} strokeWidth="1.1" strokeDasharray={dashed ? "3 4" : undefined} strokeLinecap="round" />;
}

function Dot({ at, r = 2.6 }: { at: P; r?: number }) {
  const [x, y] = iso(at);
  return <circle cx={x} cy={y} r={r} fill="rgb(255 243 240 / 0.8)" />;
}

function Retrieval() {
  return (
    <>
      {[0, 44, 88].map((z, i) => (
        <g key={z}>
          <Box at={[-72, -52, z]} size={[144, 104, 4]} lit={i === 2} />
          {[-30, -8, 14].map((y) => (
            <Line key={y} a={[-54, y, z + 4]} b={[i === 2 ? 30 : 44, y, z + 4]} faint />
          ))}
        </g>
      ))}
      <Line a={[0, 0, 96]} b={[0, 0, 170]} dashed faint />
      <Ring c={[0, 0, 170]} r={34} fill="rgb(255 255 255 / 0.04)" />
      <Ring c={[0, 0, 170]} r={24} dashed />
      <Line a={[24, 24, 170]} b={[52, 52, 170]} />
      {([[-40, 60, 120], [50, -70, 140], [70, 20, 110], [-60, -40, 150]] as P[]).map((p, i) => (
        <Dot key={i} at={p} />
      ))}
    </>
  );
}

function Agents() {
  const nodes: P[] = [[-110, -10, 0], [30, -110, 0], [40, 40, 0]];
  const mid = (p: P): P => [p[0] + 25, p[1] + 25, 25];
  return (
    <>
      <Ring c={[0, -10, 0]} r={112} dashed />
      {nodes.map((a, i) => (
        <Line key={i} a={mid(a)} b={mid(nodes[(i + 1) % 3])} faint />
      ))}
      {nodes.map((n, i) => (
        <Box key={i} at={n} size={[50, 50, 50]} lit={i === 1} />
      ))}
      <Line a={[0, -10, 25]} b={[0, -10, 150]} dashed faint />
      <circle cx={iso([0, -10, 150])[0]} cy={iso([0, -10, 150])[1]} r="18" fill="rgb(255 255 255 / 0.06)" stroke={STROKE} strokeWidth="1.1" />
      <circle cx={iso([0, -10, 150])[0]} cy={iso([0, -10, 150])[1]} r="6" fill="rgb(255 243 240 / 0.8)" />
      {nodes.map((n, i) => (
        <Line key={`s${i}`} a={[0, -10, 150]} b={[n[0] + 25, n[1] + 25, 50]} dashed faint />
      ))}
    </>
  );
}

function Evals() {
  const heights = [36, 62, 88, 122];
  return (
    <>
      <Box at={[-104, -64, 0]} size={[208, 128, 6]} />
      {heights.map((h, i) => (
        <Box key={i} at={[-90 + i * 50, -14, 6]} size={[24, 24, h]} lit={i === 3} />
      ))}
      <Line a={[-104, 70, 6]} b={[104, 70, 6]} faint dashed />
      {(() => {
        const [x, y] = iso([70, -60, 190]);
        return (
          <g>
            <circle cx={x} cy={y} r="22" fill="rgb(255 255 255 / 0.05)" stroke={STROKE} strokeWidth="1.1" />
            <path d={`M${x - 9} ${y} l6 6 l12 -13`} fill="none" stroke="rgb(255 243 240 / 0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })()}
    </>
  );
}

function Guardrails() {
  const panels = Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2);
  const back = panels.filter((t) => Math.sin(t) + Math.cos(t) < 0);
  const front = panels.filter((t) => Math.sin(t) + Math.cos(t) >= 0);
  const panel = (t: number, k: number, fill: string) => {
    const r = 96;
    const t2 = t + 0.32;
    const a: P = [r * Math.cos(t), r * Math.sin(t), 0];
    const b: P = [r * Math.cos(t2), r * Math.sin(t2), 0];
    return (
      <polygon key={k} points={pts([a, b, [b[0], b[1], 58], [a[0], a[1], 58]])} fill={fill} stroke={STROKE} strokeWidth="1" strokeLinejoin="round" />
    );
  };
  const [sx, sy] = iso([0, 0, 170]);
  return (
    <>
      <Ring c={[0, 0, 0]} r={120} dashed />
      {back.map((t, k) => panel(t, k, "rgb(255 255 255 / 0.02)"))}
      <Box at={[-26, -26, 0]} size={[52, 52, 52]} lit />
      {front.map((t, k) => panel(t, k + 20, "rgb(255 255 255 / 0.05)"))}
      <path
        d={`M${sx} ${sy - 28} l24 9 v14 c0 16 -11 26 -24 32 c-13 -6 -24 -16 -24 -32 v-14 Z`}
        fill="rgb(255 255 255 / 0.05)"
        stroke={STROKE}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d={`M${sx - 8} ${sy + 1} l6 6 l11 -12`} fill="none" stroke="rgb(255 243 240 / 0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function Gateway() {
  const targets: P[] = [[-150, -150, 0], [-10, -190, 0], [120, -150, 0]];
  return (
    <>
      <Line a={[0, 150, 0]} b={[0, 0, 0]} faint />
      {targets.map((t, i) => (
        <Line key={i} a={[0, -10, 0]} b={[t[0] + 18, t[1] + 18, 0]} faint dashed={i !== 1} />
      ))}
      {targets.map((t, i) => (
        <Box key={i} at={t} size={[36, 36, 36]} lit={i === 1} />
      ))}
      <Box at={[-70, -12, 0]} size={[22, 22, 96]} />
      <Box at={[48, -12, 0]} size={[22, 22, 96]} />
      <Box at={[-70, -12, 96]} size={[140, 22, 18]} lit />
      {([[0, 110, 4], [0, 70, 4], [0, 30, 4]] as P[]).map((p, i) => (
        <Dot key={i} at={p} r={2.2} />
      ))}
    </>
  );
}

const arts: Record<IsoKind, () => ReactNode> = {
  retrieval: Retrieval,
  agents: Agents,
  evals: Evals,
  guardrails: Guardrails,
  gateway: Gateway,
};

export function IsoArt({ kind, className }: { kind: IsoKind; className?: string }) {
  const Art = arts[kind];
  return (
    <svg viewBox="0 0 400 400" className={cn("h-full w-full", className)} aria-hidden="true">
      <g stroke="rgb(255 255 255 / 0.05)" strokeWidth="1">
        {[-120, 0, 120, 240, 360].map((o) => (
          <line key={o} x1={o} y1={420} x2={o + 420} y2={-20} />
        ))}
      </g>
      <g className="transition-transform duration-700 ease-out group-hover:-translate-y-2">
        <Art />
      </g>
    </svg>
  );
}
