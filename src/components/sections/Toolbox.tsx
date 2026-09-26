import { motion } from "motion/react";
import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { certifications, toolbox, toolboxTargets } from "@/data/content";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Container, Reveal, SectionHeader } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/** Skills ↔ projects: hovering a tool lights up exactly where it has been used. */
export function Toolbox() {
  const [active, setActive] = useState<string | null>(null);
  const tool = toolbox.flatMap((g) => g.tools).find((t) => t.name === active);

  return (
    <Container id="toolbox" className="py-28 md:py-36">
      <SectionHeader
        eyebrow="Toolbox"
        lead="The tools, and"
        accent="where they earn their keep."
        body="Hover or tap a tool to light up the projects it powers. No skill bars, no percentages, just receipts."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-12">
        <Reveal className="space-y-8 lg:col-span-7">
          <div onMouseLeave={() => setActive(null)} className="space-y-8">
            {toolbox.map((g) => (
              <div key={g.group}>
                <p className="eyebrow">{g.group}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {g.tools.map((t) => {
                    const on = active === t.name;
                    return (
                      <button
                        key={t.name}
                        type="button"
                        onMouseEnter={() => setActive(t.name)}
                        onFocus={() => setActive(t.name)}
                        onClick={() => setActive((a) => (a === t.name ? null : t.name))}
                        aria-pressed={on}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-200",
                          on ? "border-accent/50 bg-accent/10 text-ink" : "border-line bg-white/[0.02] text-muted hover:text-ink",
                          active && !on && "opacity-50",
                        )}
                      >
                        <BrandIcon name={t.name} colored={on} className="h-4.5 w-4.5 shrink-0" />
                        <span className="truncate">{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="lg:col-span-5">
          <div className="tile p-5 lg:sticky lg:top-24">
            <p className="eyebrow">{tool ? `${tool.name} → used in` : "Where things get used"}</p>
            <ul className="mt-4 space-y-1.5">
              {toolboxTargets.map((tg) => {
                const on = !tool || tool.usedIn.includes(tg.key);
                return (
                  <motion.li
                    key={tg.key}
                    animate={{ opacity: on ? 1 : 0.2, x: tool && on ? 4 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={cn("rounded-xl border px-4 py-2.5", tool && on ? "border-accent/35 bg-accent/[0.07]" : "border-line bg-white/[0.02]")}
                  >
                    <p className="text-sm font-medium text-ink">{tg.name}</p>
                    <p className="text-xs text-muted">{tg.note}</p>
                  </motion.li>
                );
              })}
            </ul>
            <div className="mt-5 border-t border-line pt-5">
              <p className="eyebrow">Certifications</p>
              <ul className="mt-3 space-y-2">
                {certifications.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-muted">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-lilac" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
