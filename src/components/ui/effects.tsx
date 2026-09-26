import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { BrandIcon } from "./BrandIcon";
import { cn } from "@/lib/utils";

/** Tile with a cursor-following glow (after Aceternity's Card Spotlight). */
export function GlowTile({ children, className }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const background = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgb(112 118 248 / 0.12), transparent 70%)`;

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  return (
    <div onMouseMove={onMove} onMouseLeave={() => { x.set(-500); y.set(-500); }} className={cn("tile group", className)}>
      <motion.div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background }} />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}

/** Logos on two counter-rotating rings (after Magic UI's Orbiting Circles). */
export function OrbitingIcons({ inner, outer, className, innerRadius = 54, outerRadius = 96 }: {
  inner: string[];
  outer: string[];
  className?: string;
  innerRadius?: number;
  outerRadius?: number;
}) {
  const ring = (items: string[], radius: number, duration: number, reverse = false) => (
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute top-1/2 left-1/2 rounded-full border border-line" style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }} />
      {items.map((name, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        return (
          <motion.div
            key={name}
            className="absolute top-1/2 left-1/2 grid h-9 w-9 place-items-center rounded-xl border border-line-strong bg-surface text-ink shadow-lg"
            style={{ x: Math.cos(angle) * radius - 18, y: Math.sin(angle) * radius - 18 }}
            animate={{ rotate: reverse ? 360 : -360 }}
            transition={{ duration, repeat: Infinity, ease: "linear" }}
            title={name}
          >
            <BrandIcon name={name} colored className="h-4.5 w-4.5" />
          </motion.div>
        );
      })}
    </motion.div>
  );
  return (
    <div className={cn("relative", className)} aria-label={`Daily drivers: ${[...inner, ...outer].join(", ")}`} role="img">
      {ring(outer, outerRadius, 70, true)}
      {ring(inner, innerRadius, 45)}
      <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_24px_6px_rgb(112_118_248/0.6)]" />
    </div>
  );
}

/** Giant outlined wordmark; a gradient stroke is revealed wherever the cursor goes (after Aceternity's Text Hover Effect). */
export function TextHoverEffect({ text, className }: { text: string; className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, "");
  const [pos, setPos] = useState({ cx: "50%", cy: "50%" });
  const [hovered, setHovered] = useState(false);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setDrawn(true), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function onMove(e: MouseEvent<SVGSVGElement>) {
    const r = svgRef.current!.getBoundingClientRect();
    setPos({ cx: `${((e.clientX - r.left) / r.width) * 100}%`, cy: `${((e.clientY - r.top) / r.height) * 100}%` });
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 900 170"
      className={cn("w-full select-none", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMove}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7076f8" />
          <stop offset="50%" stopColor="#c4c0ff" />
          <stop offset="100%" stopColor="#3ddc97" />
        </linearGradient>
        <radialGradient id={`r-${id}`} gradientUnits="userSpaceOnUse" r="22%" cx={pos.cx} cy={pos.cy}>
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id={`m-${id}`}>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#r-${id})`} />
        </mask>
      </defs>
      <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" className="font-serif text-[132px] italic" fill="transparent" stroke="rgb(255 255 255 / 0.07)" strokeWidth="1.2">
        {text}
      </text>
      <motion.text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-serif text-[132px] italic"
        fill="transparent"
        stroke="rgb(196 192 255 / 0.35)"
        strokeWidth="1.2"
        initial={{ strokeDashoffset: 6000, strokeDasharray: 6000 }}
        animate={drawn ? { strokeDashoffset: 0 } : undefined}
        transition={{ duration: 3.2, ease: "easeInOut" }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-serif text-[132px] italic"
        fill="transparent"
        stroke={`url(#g-${id})`}
        strokeWidth="1.6"
        mask={`url(#m-${id})`}
        style={{ opacity: hovered ? 1 : 0, transition: "opacity 300ms" }}
      >
        {text}
      </text>
    </svg>
  );
}
