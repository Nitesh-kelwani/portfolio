import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, AtSign, Calendar, Search } from "lucide-react";
import { bookingHref, links, sections } from "@/data/content";
import { GithubIcon, LinkedinIcon } from "./primitives";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";

type Action = { id: string; label: string; hint: string; icon: React.ReactNode; run: () => void };

/** ⌘K / Ctrl+K command menu for jumping around the page. */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = useMemo<Action[]>(() => {
    const openUrl = (url: string) => () => window.open(url, "_blank", "noreferrer");
    return [
      ...sections.map((s) => ({ id: s.id, label: s.label, hint: "Jump to section", icon: <ArrowRight className="h-4 w-4" />, run: () => scrollToId(s.id) })),
      { id: "approach", label: "How I work", hint: "Jump to section", icon: <ArrowRight className="h-4 w-4" />, run: () => scrollToId("approach") },
      {
        id: "ask",
        label: "Ask my portfolio",
        hint: "Focus the chat",
        icon: <Search className="h-4 w-4" />,
        run: () => {
          scrollToId("top");
          setTimeout(() => document.querySelector<HTMLInputElement>('input[aria-label="Ask a question about Nitesh"]')?.focus(), 700);
        },
      },
      { id: "email", label: "Copy email", hint: links.email, icon: <AtSign className="h-4 w-4" />, run: () => void navigator.clipboard?.writeText(links.email) },
      { id: "call", label: "Let's talk", hint: links.booking ? "Opens scheduler" : "Opens email", icon: <Calendar className="h-4 w-4" />, run: () => (window.location.href = bookingHref) },
      { id: "github", label: "GitHub", hint: "github.com/Nitesh-kelwani", icon: <GithubIcon className="h-4 w-4" />, run: openUrl(links.github) },
      { id: "linkedin", label: "LinkedIn", hint: "linkedin.com/in/nitesh-kelwani", icon: <LinkedinIcon className="h-4 w-4" />, run: openUrl(links.linkedin) },
    ];
  }, []);

  const filtered = actions.filter((a) => `${a.label} ${a.hint}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => setCursor(0), [query]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    }
    if (e.key === "Enter" && filtered[cursor]) {
      filtered[cursor].run();
      onClose();
    }
    if (e.key === "Escape") onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 px-4 pt-[18vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={spring.ui}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-4 w-4 text-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a command or search…"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-faint"
              />
              <kbd className="font-mono text-[10px] text-faint">ESC</kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2" data-lenis-prevent>
              {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-faint">No results.</li>}
              {filtered.map((a, i) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => {
                      a.run();
                      onClose();
                    }}
                    className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm", i === cursor ? "bg-white/[0.06] text-ink" : "text-muted")}
                  >
                    <span className="text-faint">{a.icon}</span>
                    <span className="flex-1">{a.label}</span>
                    <span className="truncate font-mono text-[11px] text-faint">{a.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
