import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Bit, the site's robot mascot. It blinks on its own; with `interactive` its
 * eyes follow the cursor anywhere on the page and a click makes it beam.
 */
export function Mascot({ size = 120, interactive = false, className }: { size?: number; interactive?: boolean; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/:/g, "");
  const px = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  const py = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  const [blink, setBlink] = useState(false);
  const [happy, setHappy] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t = 0;
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 130);
        loop();
      }, 2400 + Math.random() * 2800);
    };
    loop();
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!interactive || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height * 0.52);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 260);
      px.set((dx / d) * 5 * k);
      py.set((dy / d) * 4 * k);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive, px, py]);

  function beam() {
    if (!interactive) return;
    setHappy(true);
    window.setTimeout(() => setHappy(false), 1300);
  }

  const eye = "#7ef0c6";

  return (
    <motion.svg
      ref={ref}
      viewBox="0 0 128 128"
      width={size}
      height={size}
      className={cn(interactive && "cursor-pointer", className)}
      onClick={beam}
      whileHover={interactive ? { rotate: -5, scale: 1.03 } : undefined}
      whileTap={interactive ? { scale: 0.96 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      role="img"
      aria-label="Bit, a small robot mascot"
    >
      <defs>
        <linearGradient id={`head-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1efff" />
          <stop offset="1" stopColor="#b9b3fb" />
        </linearGradient>
        <radialGradient id={`bulb-${uid}`} cx="0.35" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#d9d6ff" />
          <stop offset="0.5" stopColor="#8b86fa" />
          <stop offset="1" stopColor="#5a5fe6" />
        </radialGradient>
        <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* antenna */}
      <line x1="64" y1="33" x2="64" y2="19" stroke="#c9c4ff" strokeWidth="4" strokeLinecap="round" />
      <motion.circle cx="64" cy="14" r="9" fill="#7076f8" filter={`url(#glow-${uid})`} animate={{ opacity: [0.9, 0.35, 0.9] }} transition={{ duration: 2.4, repeat: Infinity }} />
      <circle cx="64" cy="14" r="6.5" fill={`url(#bulb-${uid})`} />

      {/* ears */}
      <rect x="11" y="57" width="13" height="26" rx="6.5" fill="#a39df6" />
      <rect x="104" y="57" width="13" height="26" rx="6.5" fill="#a39df6" />

      {/* head + face screen */}
      <rect x="19" y="31" width="90" height="76" rx="29" fill={`url(#head-${uid})`} />
      <rect x="29" y="43" width="70" height="50" rx="20" fill="#13132a" />
      <rect x="33" y="46" width="30" height="6" rx="3" fill="#ffffff" opacity="0.06" />

      {/* eyes */}
      <motion.g style={{ x: px, y: py }}>
        {happy ? (
          <g stroke={eye} strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M44 69 Q51 59 58 69" />
            <path d="M70 69 Q77 59 84 69" />
          </g>
        ) : (
          <motion.g animate={{ scaleY: blink ? 0.1 : 1 }} transition={{ duration: 0.07 }}>
            <ellipse cx="51" cy="66" rx="7.5" ry="8.5" fill={eye} />
            <ellipse cx="77" cy="66" rx="7.5" ry="8.5" fill={eye} />
            <circle cx="53.8" cy="62.6" r="2.4" fill="#ffffff" opacity="0.95" />
            <circle cx="79.8" cy="62.6" r="2.4" fill="#ffffff" opacity="0.95" />
          </motion.g>
        )}
      </motion.g>

      {/* cheeks + smile */}
      <ellipse cx="39" cy="80" rx="5.5" ry="3.2" fill="#ff8fbc" opacity="0.6" />
      <ellipse cx="89" cy="80" rx="5.5" ry="3.2" fill="#ff8fbc" opacity="0.6" />
      <motion.path
        d={happy ? "M55 79 Q64 90 73 79" : "M57.5 80 Q64 85.5 70.5 80"}
        stroke={eye}
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={{ d: happy ? "M55 79 Q64 90 73 79" : "M57.5 80 Q64 85.5 70.5 80" }}
      />
    </motion.svg>
  );
}
