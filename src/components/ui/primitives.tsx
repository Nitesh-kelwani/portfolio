import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeUp, stagger } from "@/lib/motion";

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function Container({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("relative mx-auto w-full max-w-[1112px] px-4 sm:px-6", className)}>
      {children}
    </section>
  );
}

/** Small translucent pill with a dot: the label above every section title. */
export function SectionTag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("pill", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-soft" />
      {children}
    </span>
  );
}

/** Tag, two-tone headline (white then muted) and a short side paragraph. */
export function SectionHead({ tag, title, muted, side, aside, className }: {
  tag: string;
  title: string;
  muted?: string;
  side?: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("grid gap-6 md:grid-cols-[1fr_auto] md:items-end", className)}
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      <div>
        <motion.div variants={fadeUp}>
          <SectionTag>{tag}</SectionTag>
        </motion.div>
        <motion.h2 variants={fadeUp} className="t-h2 mt-5 max-w-[560px] text-balance">
          {title}
          {muted && <span className="text-muted"> {muted}</span>}
        </motion.h2>
      </div>
      {side && (
        <motion.p variants={fadeUp} className="t-small max-w-[300px] pb-2 text-soft md:max-w-[340px]">
          {side}
        </motion.p>
      )}
      {aside && <motion.div variants={fadeUp} className="pb-2">{aside}</motion.div>}
    </motion.div>
  );
}

/** Primary pill button (Powder's "Get started"). */
export function PillLink({ href, children, className, variant = "light", onClick }: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "light" | "dark";
  onClick?: () => void;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[15px] tracking-[-0.02em] transition-[background-color,transform] duration-300 active:scale-[0.97]",
        variant === "light" ? "bg-white/80 text-black hover:bg-white" : "bg-white/10 text-ink hover:bg-white/15",
        className,
      )}
    >
      {children}
    </a>
  );
}

/** Round 48px icon button (Powder's play button). */
export function RoundLink({ href, label, children, className }: { href: string; label: string; children: ReactNode; className?: string }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn("grid h-12 w-12 place-items-center rounded-full bg-white/10 text-ink backdrop-blur-md transition-colors hover:bg-white/20", className)}
    >
      {children}
    </a>
  );
}

export function RoundButton({ onClick, label, children, className, disabled }: {
  onClick: () => void;
  label: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className={cn("grid h-12 w-12 place-items-center rounded-full bg-white/10 text-ink transition-colors hover:bg-white/20 disabled:opacity-40", className)}
    >
      {children}
    </button>
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
      className={cn("inline-flex h-12 items-center gap-2 rounded-full px-5 text-[15px] tracking-[-0.02em] text-soft transition-colors hover:text-ink", className)}
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
      {copied ? "Copied" : label ?? text}
    </button>
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

export function KaggleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.83 23.84c-.02.1-.12.16-.3.16h-3.08a.4.4 0 0 1-.36-.2l-5.1-6.48-1.42 1.35v5.03c0 .2-.1.3-.3.3H5.87c-.2 0-.3-.1-.3-.3V.3c0-.2.1-.3.3-.3h2.4c.2 0 .3.1.3.3v14.37l6.13-6.2c.1-.1.2-.16.34-.16h3.2c.14 0 .23.06.27.18.04.13.03.22-.03.28l-6.47 6.28 6.75 8.47c.1.1.1.2.07.32" />
    </svg>
  );
}
