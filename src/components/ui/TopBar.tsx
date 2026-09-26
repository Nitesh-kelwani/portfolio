import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { bookingHref, profile } from "@/data/content";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { Mascot } from "./Mascot";

export function useLocalTime(timeZone: string) {
  const fmt = () => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15_000);
    return () => clearInterval(id);
  }, [timeZone]); // fmt only closes over timeZone
  return time;
}

export function TopBar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const time = useLocalTime(profile.timeZone);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled ? "border-b border-line bg-bg/70 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => scrollToId("top")} className="flex items-center gap-3 text-left" aria-label="Back to top">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#23214d] to-[#0f0f1f] ring-1 ring-line-strong">
            <Mascot size={30} />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight">{profile.name}</span>
            <span className="block font-mono text-[11px] text-faint">{profile.role}</span>
          </span>
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 font-mono text-xs text-muted md:flex" title="Local time in Jaipur">
            <span className="h-1.5 w-1.5 rounded-full bg-live" />
            {profile.city} · {time} IST
          </span>
          <a
            href={bookingHref}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-colors hover:bg-white"
          >
            Let's talk <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
