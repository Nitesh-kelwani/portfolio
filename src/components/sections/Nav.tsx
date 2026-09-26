import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { contactHref, nav } from "@/data/content";
import { ease, fadeUp, stagger } from "@/lib/motion";
import { scrollToId } from "@/lib/scroll";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function go(id: string) {
    setOpen(false);
    scrollToId(id);
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0.001, y: -36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/85 via-black/45 to-transparent transition-opacity duration-500",
            scrolled || open ? "opacity-100" : "opacity-0",
          )}
        />
        <nav className="relative mx-auto flex h-16 max-w-[1112px] items-center justify-between px-4 sm:px-6" aria-label="Main">
          <a href="#top" onClick={(e) => (e.preventDefault(), go("top"))} className="flex items-center gap-2.5" aria-label="Nitesh Kelwani, home">
            <Logo className="h-7 w-7 text-ink" />
          </a>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
            {nav.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => (e.preventDefault(), go(l.id))}
                  className="t-small text-soft transition-colors hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={contactHref}
            className="t-small hidden h-9 items-center rounded-full bg-white/10 px-4 text-ink backdrop-blur-md transition-colors hover:bg-white/15 md:inline-flex"
          >
            Get in touch
          </a>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative grid h-10 w-10 place-items-center md:hidden"
          >
            <motion.span className="absolute h-[1.5px] w-6 rounded bg-ink" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} />
            <motion.span className="absolute h-[1.5px] w-6 rounded bg-ink" animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden"
          >
            <motion.ul variants={stagger(0.06, 0.1)} initial="hidden" animate="show" className="flex h-full flex-col justify-center gap-2 px-6">
              {nav.map((l) => (
                <motion.li key={l.id} variants={fadeUp}>
                  <a href={`#${l.id}`} onClick={(e) => (e.preventDefault(), go(l.id))} className="t-h2 block py-2 text-ink">
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.li variants={fadeUp} className="pt-6">
                <a href={contactHref} className="inline-flex h-12 items-center rounded-full bg-white/80 px-7 text-black">
                  Get in touch
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
