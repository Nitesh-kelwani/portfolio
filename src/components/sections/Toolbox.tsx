import { motion } from "motion/react";
import { Bot, Rocket, Search, ShieldCheck } from "lucide-react";
import { orbitTools, toolColumns, toolboxSection } from "@/data/content";
import { fadeUp, stagger } from "@/lib/motion";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Logo } from "@/components/ui/Logo";
import { SectionHead } from "@/components/ui/primitives";

const colIcons = { search: Search, bot: Bot, shield: ShieldCheck, rocket: Rocket };
const RINGS = [170, 290, 410];
const PER_RING = [4, 6, 6];

/** Powder's integrations hub: tools orbit the mark on half-circle rings. */
export function Toolbox() {
  // Spread the tools evenly around full circles so they rise and set over the horizon as the rings turn.
  let k = 0;
  const placed = RINGS.flatMap((r, ring) =>
    Array.from({ length: PER_RING[ring] }, (_, j) => ({
      name: orbitTools[k++ % orbitTools.length],
      r,
      ring,
      angle: (j / PER_RING[ring]) * 360 + ring * 23,
    })),
  );

  return (
    <section id="toolbox" className="relative mx-auto w-full max-w-[1112px] px-4 py-24 sm:px-6 md:py-32">
      <SectionHead tag={toolboxSection.tag} title={toolboxSection.title} muted={toolboxSection.muted} side={toolboxSection.side} />

      <div className="relative mt-10 md:mt-16">
        <div className="relative h-[300px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)] sm:h-[380px] md:h-[440px]">
          <div className="absolute bottom-0 left-1/2 h-0 w-0 scale-[0.62] sm:scale-[0.8] md:scale-100">
            <svg className="absolute -top-[440px] -left-[440px] h-[880px] w-[880px] overflow-visible" viewBox="-440 -440 880 880" aria-hidden="true">
              {RINGS.map((r) => (
                <circle key={r} r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" />
              ))}
              <circle r={100} fill="none" stroke="rgb(255 255 255 / 0.06)" />
              {Array.from({ length: 13 }, (_, i) => {
                const a = (i / 12) * Math.PI;
                return <line key={i} x1={Math.cos(a) * 60} y1={-Math.sin(a) * 60} x2={Math.cos(a) * 430} y2={-Math.sin(a) * 430} stroke="rgb(255 255 255 / 0.05)" />;
              })}
            </svg>

            {RINGS.map((r, ring) => {
              const dir = ring % 2 ? -1 : 1;
              const duration = 90 + ring * 30;
              return (
                <motion.div key={r} className="absolute top-0 left-0" animate={{ rotate: dir * 360 }} transition={{ duration, repeat: Infinity, ease: "linear" }}>
                  {placed
                    .filter((p) => p.ring === ring)
                    .map((p) => (
                      <div key={`${p.name}-${p.angle}`} className="absolute top-0 left-0" style={{ transform: `rotate(${p.angle}deg) translateX(${p.r}px)` }}>
                        {/* counter-rotate so every icon stays upright */}
                        <motion.div
                          className="-mt-7 -ml-7 grid h-14 w-14 place-items-center rounded-full bg-[#141414] text-white/70 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)]"
                          initial={{ rotate: -p.angle }}
                          animate={{ rotate: -p.angle - dir * 360 }}
                          transition={{ duration, repeat: Infinity, ease: "linear" }}
                          title={p.name}
                        >
                          <BrandIcon name={p.name} className="h-6 w-6" />
                        </motion.div>
                      </div>
                    ))}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        <div className="absolute bottom-0 left-1/2 grid h-[92px] w-[92px] -translate-x-1/2 translate-y-1/2 place-items-center rounded-full bg-black shadow-[0_0_0_1px_rgb(255_255_255/0.1)]">
          <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#1b1b1b] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12),0_0_40px_rgb(211_151_148/0.15)]">
            <Logo className="h-8 w-8 text-white/85" />
          </div>
        </div>
      </div>

      <motion.ul
        className="mt-24 grid gap-y-8 sm:grid-cols-2 md:mt-28 md:grid-cols-4"
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {toolColumns.map((c) => {
          const Icon = colIcons[c.icon];
          return (
            <motion.li key={c.title} variants={fadeUp} className="border-l border-white/10 py-1 pr-6 pl-5">
              <h3 className="text-[15px] font-medium tracking-[-0.02em] text-ink">{c.title}</h3>
              <p className="t-small mt-2 max-w-[210px] text-muted">{c.body}</p>
              <Icon className="mt-8 h-[18px] w-[18px] text-soft" strokeWidth={1.5} />
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
