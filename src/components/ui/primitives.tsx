import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Section header: mono eyebrow + sans headline with an italic serif accent. */
export function SectionHeader({ eyebrow, lead, accent, body, className }: {
  eyebrow: string;
  lead: string;
  accent?: string;
  body?: string;
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-3xl", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-5xl md:text-6xl">
        <span className="text-gradient">{lead}</span>
        {accent && <span className="serif-accent"> {accent}</span>}
      </h2>
      {body && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted text-pretty">{body}</p>}
    </Reveal>
  );
}

export function Container({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </section>
  );
}

export function Chips({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <span key={item} className="chip">{item}</span>
      ))}
    </div>
  );
}

/** Stateful copy button: idle → copied ✓ → idle. */
export function CopyButton({ text, label, className }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${text}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 font-mono text-[13px] text-muted transition-colors hover:border-line-strong hover:text-ink",
        className,
      )}
      aria-live="polite"
    >
      <span className="relative h-4 w-4">
        <motion.span className="absolute inset-0" animate={{ opacity: copied ? 0 : 1, scale: copied ? 0.5 : 1 }}>
          <Copy className="h-4 w-4" />
        </motion.span>
        <motion.span className="absolute inset-0 text-live" initial={false} animate={{ opacity: copied ? 1 : 0, scale: copied ? 1 : 0.5 }}>
          <Check className="h-4 w-4" />
        </motion.span>
      </span>
      {copied ? "Copied to clipboard" : label ?? text}
    </button>
  );
}

/** A button that leans toward the cursor and springs back (after Aceternity's Magnetic Button). */
export function MagneticLink({ href, children, className, variant = "primary" }: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });

  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  const external = href.startsWith("http");
  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors",
        variant === "primary"
          ? "bg-ink text-bg shadow-[0_8px_30px_-8px_rgb(112_118_248/0.55)] hover:bg-white"
          : "border border-line-strong text-ink hover:bg-white/[0.04]",
        className,
      )}
    >
      {children}
    </motion.a>
  );
}

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex h-2 w-2", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-50" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
    </span>
  );
}

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/** macOS-style window chrome for the product mocks. */
export function WindowFrame({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line-strong bg-[#0b0b12] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]", className)}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        <span className="ml-3 truncate font-mono text-[11px] text-faint">{title}</span>
        <span className="ml-auto rounded-full border border-line px-2 py-0.5 font-mono text-[9px] tracking-wider text-faint uppercase">illustrative</span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
