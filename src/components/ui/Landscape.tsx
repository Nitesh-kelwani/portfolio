import { useId, useMemo, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

// An original dusk landscape, drawn in code. Each layer is its own SVG so the
// hero can move them at different speeds, exactly like Powder's parallax.
// Ridges are sums of seeded sine waves; the forest layer gets a displacement
// filter for a leafy edge and noise-driven light and shade.

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Ridge = {
  base: number;
  amp: number;
  seed: number;
  waves?: number;
  step?: number;
  stops: [number, string, number?][];
  rim?: number;
};

function ridgePoints(r: Ridge, w: number) {
  const rand = rng(r.seed);
  const waves = r.waves ?? 3;
  const comps = Array.from({ length: waves }, (_, i) => ({
    a: (r.amp / (i + 1) ** 0.85) * (0.65 + rand() * 0.6),
    f: (0.0022 + rand() * 0.0018) * (i + 1) ** 1.45,
    p: rand() * Math.PI * 2,
  }));
  const step = r.step ?? 24;
  const pts: [number, number][] = [];
  for (let x = -60; x <= w + 60; x += step) {
    pts.push([x, r.base - comps.reduce((s, c) => s + c.a * Math.sin(x * c.f + c.p), 0)]);
  }
  return pts;
}

function curve(pts: [number, number][]) {
  let d = "";
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0]},${p2[1].toFixed(1)}`;
  }
  return d;
}

function ridgePaths(r: Ridge, w: number, h: number) {
  const pts = ridgePoints(r, w);
  const top = `M${pts[0][0]},${pts[0][1].toFixed(1)}${curve(pts)}`;
  const fill = `M${pts[0][0]},${h + 40} L${pts[0][0]},${pts[0][1].toFixed(1)}${curve(pts)} L${pts[pts.length - 1][0]},${h + 40} Z`;
  return { top, fill };
}

function HillsSvg({ w = 1600, h, ridges, haze, className, style, trees }: {
  w?: number;
  h: number;
  ridges: Ridge[];
  haze?: [string, number];
  className?: string;
  style?: CSSProperties;
  trees?: { x: number; ridge: number; s: number }[];
}) {
  const uid = useId().replace(/:/g, "");
  const paths = useMemo(() => ridges.map((r) => ridgePaths(r, w, h)), [ridges, w, h]);
  const planted = useMemo(
    () =>
      trees?.map((t) => {
        const line = ridgePoints(ridges[t.ridge], w);
        const near = line.reduce((a, b) => (Math.abs(b[0] - t.x) < Math.abs(a[0] - t.x) ? b : a));
        return { ...t, y: near[1] + 3 };
      }) ?? [],
    [trees, ridges, w],
  );

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMax slice" className={cn("block h-full w-full", className)} style={style} aria-hidden="true">
      <defs>
        {ridges.map((r, i) => (
          <linearGradient key={i} id={`${uid}g${i}`} x1="0" y1={r.base - r.amp * 1.2} x2="0" y2={h} gradientUnits="userSpaceOnUse">
            {r.stops.map(([o, c, a], j) => (
              <stop key={j} offset={o} stopColor={c} stopOpacity={a ?? 1} />
            ))}
          </linearGradient>
        ))}
        <filter id={`${uid}grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 -0.2" result="a" />
          <feComposite in="a" in2="SourceGraphic" operator="in" result="g" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="g" />
          </feMerge>
        </filter>
        <filter id={`${uid}soft`} x="-2%" y="-10%" width="104%" height="120%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
        {haze && (
          <linearGradient id={`${uid}haze`} x1="0" y1={ridges[0].base - ridges[0].amp * 1.4} x2="0" y2={ridges[0].base + h * 0.35} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={haze[0]} stopOpacity={haze[1]} />
            <stop offset="1" stopColor={haze[0]} stopOpacity="0" />
          </linearGradient>
        )}
      </defs>

      {paths.map((p, i) => {
        const r = ridges[i];
        return (
          <g key={i}>
            <path d={p.fill} fill={`url(#${uid}g${i})`} filter={`url(#${uid}grain)`} />
            {haze && i === 0 && <path d={p.fill} fill={`url(#${uid}haze)`} />}
            {r.rim ? <path d={p.top} fill="none" stroke="#ffd9cf" strokeOpacity={r.rim} strokeWidth="1.6" filter={`url(#${uid}soft)`} /> : null}
            {planted
              .filter((t) => t.ridge === i)
              .map((t, k) => (
                <g key={k} transform={`translate(${t.x} ${t.y.toFixed(1)}) scale(${t.s * 1.35} ${t.s})`} fill="#241c19">
                  <path d="M0 2 C -4.5 -10, -6.5 -30, -1 -58 Q 0 -62, 1 -58 C 6.5 -30, 4.5 -10, 0 2 Z" />
                </g>
              ))}
          </g>
        );
      })}
    </svg>
  );
}


/* ---------------- Forest ---------------- */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function mix(c1: string, c2: string, t: number) {
  const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [a, b] = [p(c1), p(c2)];
  return `#${a.map((v, i) => Math.round(lerp(v, b[i], t)).toString(16).padStart(2, "0")).join("")}`;
}

/** Rows of rounded tree crowns, lit from above by the dusk sky, fading to black. */
function ForestSvg({ w = 1600, h = 490, top = 262, rows = 9, seed = 5, className }: {
  w?: number;
  h?: number;
  top?: number;
  rows?: number;
  seed?: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const { crowns, bands, palette } = useMemo(() => {
    const r = rng(seed);
    const palette = Array.from({ length: rows }, (_, i) => {
      const t = i / Math.max(rows - 1, 1);
      return {
        hi: mix("#c49290", "#7d5b56", t),
        mid: mix("#7f6158", "#2c271d", t),
        lo: mix("#3d342b", "#090806", t),
      };
    });
    const crowns: { x: number; y: number; r: number; row: number }[] = [];
    const bands: string[] = [];
    for (let row = 0; row < rows; row++) {
      const rad = 8 + row * 4.2;
      const y0 = top + row * rad * 0.78;
      const hill = (x: number) => Math.sin(x * 0.0031 + row * 1.7 + seed) * (26 - row * 2.4) + Math.sin(x * 0.011 + row * 0.6) * 8;
      let d = `M-60,${h + 20}`;
      for (let x = -60; x <= w + 60; x += 40) d += ` L${x},${(y0 - hill(x) + rad * 0.35).toFixed(1)}`;
      bands.push(`${d} L${w + 60},${h + 20} Z`);
      let x = -rad;
      while (x < w + rad) {
        const tall = r() < 0.08 ? 1.45 : 1;
        crowns.push({ x, y: y0 - hill(x) + (r() - 0.5) * rad * 0.8 - (tall - 1) * rad, r: rad * (0.62 + r() * 0.7) * tall, row });
        x += rad * (0.85 + r() * 0.6);
      }
    }
    return { crowns, bands, palette };
  }, [w, h, top, rows, seed]);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMax slice" className={cn("block h-full w-full", className)} aria-hidden="true">
      <defs>
        {palette.map((c, i) => (
          <radialGradient key={i} id={`${uid}c${i}`} cx="0.4" cy="0.26" r="0.78">
            <stop offset="0" stopColor={c.hi} />
            <stop offset="0.5" stopColor={c.mid} />
            <stop offset="1" stopColor={c.lo} />
          </radialGradient>
        ))}
        <linearGradient id={`${uid}fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="0.8" stopColor="#000" stopOpacity="1" />
        </linearGradient>
        <filter id={`${uid}leaf`} x="-2%" y="-10%" width="104%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="3" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="11" xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.13 0.18" numOctaves="3" seed={seed + 3} result="t" />
          <feColorMatrix in="t" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" result="tg" />
          <feComposite in="shape" in2="tg" operator="arithmetic" k1="1.05" k2="0.42" k3="0" k4="-0.03" result="tex" />
          <feComposite in="tex" in2="shape" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${uid}leaf)`}>
        {palette.map((c, row) => (
          <g key={row}>
            <path d={bands[row]} fill={c.lo} />
            {crowns
              .filter((k) => k.row === row)
              .map((k, i) => (
                <circle key={i} cx={k.x.toFixed(1)} cy={k.y.toFixed(1)} r={k.r.toFixed(1)} fill={`url(#${uid}c${row})`} />
              ))}
          </g>
        ))}
      </g>
      <rect width={w} height={h} fill={`url(#${uid}fade)`} />
    </svg>
  );
}

/* ---------------- Presets ---------------- */

const heroBack: Ridge[] = [
  { base: 58, amp: 30, seed: 11, stops: [[0, "#8f7475"], [0.3, "#6a5859"], [1, "#3a3234"]], rim: 0.45 },
  { base: 118, amp: 46, seed: 23, stops: [[0, "#857161"], [0.22, "#585040"], [1, "#24231b"]], rim: 0.5 },
  { base: 196, amp: 42, seed: 37, stops: [[0, "#66634a"], [0.3, "#3d3d2d"], [1, "#141410"]], rim: 0.42 },
];

const rolling: Ridge[] = [
  { base: 540, amp: 46, seed: 41, stops: [[0, "#a27f7d"], [0.4, "#735e5d"], [1, "#3e3637"]], rim: 0.35 },
  { base: 620, amp: 70, seed: 53, stops: [[0, "#8b7563"], [0.25, "#5b5140"], [1, "#24231b"]], rim: 0.5 },
  { base: 740, amp: 60, seed: 67, stops: [[0, "#6c6a4c"], [0.3, "#404030"], [1, "#12120e"]], rim: 0.45 },
  { base: 860, amp: 50, seed: 79, stops: [[0, "#4e4e38"], [0.35, "#26261c"], [1, "#0a0a08"]], rim: 0.3 },
];

const ctaRidges: Ridge[] = [
  { base: 225, amp: 34, seed: 91, stops: [[0, "#9c7b78"], [0.35, "#6e5654"], [1, "#2e2625"]], rim: 0.45 },
  { base: 290, amp: 50, seed: 103, stops: [[0, "#8d6f64"], [0.3, "#5e4b42"], [1, "#1e1916"]], rim: 0.5 },
  { base: 360, amp: 38, seed: 117, stops: [[0, "#6a584d"], [0.35, "#3a3029"], [1, "#050404"]], rim: 0.35 },
];

export function HeroBackHills({ className }: { className?: string }) {
  return <HillsSvg h={526} ridges={heroBack} haze={["#d39794", 0.32]} className={className} />;
}

export function HeroFrontHills({ className }: { className?: string }) {
  return <ForestSvg className={className} />;
}

export function CtaHills({ className }: { className?: string }) {
  return (
    <HillsSvg
      h={420}
      ridges={ctaRidges}
      haze={["#d39794", 0.22]}
      className={className}
      trees={[
        { x: 790, ridge: 1, s: 0.6 },
        { x: 812, ridge: 1, s: 0.82 },
        { x: 836, ridge: 1, s: 0.56 },
      ]}
    />
  );
}

/** Soft, lit cloud. */
export function Cloud({ className, seed = 3 }: { className?: string; seed?: number }) {
  const uid = useId().replace(/:/g, "");
  const puffs = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: 11 }, (_, i) => ({ cx: 70 + i * 26 + r() * 20, cy: 120 - Math.sin((i / 10) * Math.PI) * 38 + r() * 14, r: 34 + r() * 30 }));
  }, [seed]);
  return (
    <svg viewBox="0 0 440 220" className={cn("pointer-events-none", className)} aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e1dc" />
          <stop offset="0.55" stopColor="#c9adac" />
          <stop offset="1" stopColor="#7f6a6d" />
        </linearGradient>
        <filter id={`${uid}f`} x="-20%" y="-30%" width="140%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="34" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      <g filter={`url(#${uid}f)`} fill={`url(#${uid}c)`}>
        {puffs.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} />
        ))}
        <rect x="60" y="120" width="320" height="50" rx="25" />
      </g>
    </svg>
  );
}

export type SceneAccent = "none" | "tree" | "moon" | "path";

const skyGradient = "linear-gradient(180deg, #1a2025 0%, #333b40 34%, #6c5a5c 60%, #b88684 80%, #d39794 92%)";

/** A full framed scene: sky, rolling hills, optional clouds and a small accent. */
export function Scene({ className, accent = "none", clouds = false, seedShift = 0, children }: {
  className?: string;
  accent?: SceneAccent;
  clouds?: boolean;
  seedShift?: number;
  children?: React.ReactNode;
}) {
  const ridges = useMemo(() => rolling.map((r, i) => ({ ...r, seed: r.seed + seedShift * 13 + i })), [seedShift]);
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: skyGradient }}>
      <div className="absolute inset-x-0 top-[38%] h-[40%] bg-[radial-gradient(60%_60%_at_50%_100%,rgb(255_205_190/0.35),transparent)]" />
      {accent === "moon" && <div className="absolute top-[20%] left-[64%] h-[9%] w-auto aspect-square rounded-full bg-[#f6e3dc] shadow-[0_0_60px_20px_rgb(246_227_220/0.25)]" />}
      {clouds && (
        <>
          <Cloud seed={seedShift + 5} className="absolute top-[8%] -left-[10%] w-[55%] animate-drift opacity-80" />
          <Cloud seed={seedShift + 9} className="absolute top-[2%] right-[-18%] w-[48%] animate-drift-slow opacity-70" />
        </>
      )}
      <HillsSvg h={1000} ridges={ridges} haze={["#d39794", 0.5]} className="absolute inset-0" />
      {accent === "tree" && (
        <svg viewBox="0 0 100 100" className="absolute bottom-[36%] left-[44%] w-[18%]" aria-hidden="true">
          <path d="M50 100 L50 62" stroke="#231b19" strokeWidth="2.4" />
          <g fill="#c98f94">
            <circle cx="50" cy="48" r="17" />
            <circle cx="37" cy="54" r="12" />
            <circle cx="63" cy="54" r="12" />
            <circle cx="45" cy="38" r="11" />
            <circle cx="57" cy="39" r="11" />
          </g>
          <g fill="#8e5c62" opacity="0.7">
            <circle cx="56" cy="58" r="9" />
            <circle cx="42" cy="60" r="7" />
          </g>
        </svg>
      )}
      {accent === "path" && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[42%] w-full" aria-hidden="true">
          <path d="M47 0 C 46 30, 30 60, 18 100 L 40 100 C 46 62, 50 30, 49 0 Z" fill="#c9a6a0" opacity="0.28" />
        </svg>
      )}
      {children}
    </div>
  );
}
