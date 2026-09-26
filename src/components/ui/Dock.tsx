import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Command, FlaskConical, Home, Layers, Mail, Route, Wrench } from "lucide-react";
import { links, sections, type SectionId } from "@/data/content";
import { GithubIcon, LinkedinIcon } from "./primitives";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const sectionIcons: Record<SectionId, ReactNode> = {
  top: <Home className="h-full w-full" />,
  work: <Layers className="h-full w-full" />,
  lab: <FlaskConical className="h-full w-full" />,
  path: <Route className="h-full w-full" />,
  toolbox: <Wrench className="h-full w-full" />,
  contact: <Mail className="h-full w-full" />,
};

function useActiveSection() {
  const [active, setActive] = useState<SectionId>("top");
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id as SectionId);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.6] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

function DockItem({ mouseX, label, active, onClick, href, children }: {
  mouseX: MotionValue<number>;
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const distance = useTransform(mouseX, (v) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return v - b.x - b.width / 2;
  });
  const size = useSpring(useTransform(distance, [-140, 0, 140], [40, 60, 40]), { mass: 0.1, stiffness: 180, damping: 13 });
  const icon = useSpring(useTransform(distance, [-140, 0, 140], [17, 25, 17]), { mass: 0.1, stiffness: 180, damping: 13 });

  const inner = (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "relative grid place-items-center rounded-full border transition-colors",
        active ? "border-accent/40 bg-accent/15 text-ink" : "border-line bg-white/[0.04] text-muted hover:text-ink",
      )}
    >
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 6, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 4, x: "-50%" }}
            className="pointer-events-none absolute -top-9 left-1/2 rounded-md border border-line bg-surface px-2 py-1 text-xs whitespace-nowrap text-ink"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span style={{ width: icon, height: icon }} className="grid place-items-center">
        {children}
      </motion.span>
      {active && <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-lilac" />}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={label} aria-current={active ? "true" : undefined}>
      {inner}
    </button>
  );
}

/** Floating dock with magnification (after Aceternity's Floating Dock). */
export function Dock({ onOpenPalette }: { onOpenPalette: () => void }) {
  const mouseX = useMotionValue(Infinity);
  const active = useActiveSection();

  return (
    <motion.nav
      aria-label="Sections"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 24 }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 flex h-[60px] -translate-x-1/2 items-end gap-2.5 rounded-full border border-line-strong bg-[#0c0c12]/85 px-2.5 pb-2.5 shadow-[0_20px_60px_-15px_rgb(0_0_0/0.9)] backdrop-blur-xl"
    >
      {sections.map((s) => (
        <DockItem key={s.id} mouseX={mouseX} label={s.label} active={active === s.id} onClick={() => scrollToId(s.id)}>
          {sectionIcons[s.id]}
        </DockItem>
      ))}
      <span className="mb-2 hidden h-6 w-px self-end bg-line-strong sm:block" />
      <div className="hidden items-end gap-2.5 sm:flex">
        <DockItem mouseX={mouseX} label="GitHub" href={links.github}>
          <GithubIcon className="h-full w-full" />
        </DockItem>
        <DockItem mouseX={mouseX} label="LinkedIn" href={links.linkedin}>
          <LinkedinIcon className="h-full w-full" />
        </DockItem>
        <DockItem mouseX={mouseX} label="Command menu  ⌘K" onClick={onOpenPalette}>
          <Command className="h-full w-full" />
        </DockItem>
      </div>
    </motion.nav>
  );
}
