import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const JAIPUR = { lat: 26.91, lon: 75.79 };

/** A small dotted globe that keeps Jaipur in view, with a pulsing marker. */
export function Globe({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fibonacci lattice: evenly spread points on a sphere
    const N = 620;
    const pts: [number, number, number][] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      pts.push([Math.cos(th) * rad, y, Math.sin(th) * rad]);
    }
    const toVec = (lat: number, lon: number): [number, number, number] => {
      const la = (lat * Math.PI) / 180;
      const lo = (lon * Math.PI) / 180;
      return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
    };
    const marker = toVec(JAIPUR.lat, JAIPUR.lon);
    const baseYaw = (-JAIPUR.lon * Math.PI) / 180;
    const tilt = (JAIPUR.lat * Math.PI) / 180 * 0.8;

    let raf = 0;
    let visible = true;
    const draw = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.46;
      const cx = w / 2;
      const cy = h / 2;
      const yaw = baseYaw + (reduce ? 0 : Math.sin(now / 9000) * 0.55);
      const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
      const cosX = Math.cos(tilt), sinX = Math.sin(tilt);
      const project = ([x, y, z]: [number, number, number]) => {
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        return { x: cx + x1 * R, y: cy - y2 * R, z: z2 };
      };

      for (const p of pts) {
        const q = project(p);
        if (q.z < -0.15) continue;
        const a = 0.12 + Math.max(0, q.z) * 0.55;
        ctx.fillStyle = `rgba(196,192,255,${a})`;
        ctx.beginPath();
        ctx.arc(q.x, q.y, 0.6 + Math.max(0, q.z) * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      const m = project(marker);
      if (m.z > 0) {
        const pulse = reduce ? 0.5 : (now / 1600) % 1;
        ctx.strokeStyle = `rgba(112,118,248,${1 - pulse})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 3 + pulse * 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#3ddc97";
        ctx.beginPath();
        ctx.arc(m.x, m.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={cn("h-full w-full", className)} aria-hidden="true" />;
}
