import { motion, type Variants } from "motion/react";
import { ArrowDown, ArrowUpRight, BadgeCheck } from "lucide-react";
import { bookingHref, dailyDrivers, hero, links, mascot, profile } from "@/data/content";
import { Aurora } from "@/components/ui/Aurora";
import { Mascot } from "@/components/ui/Mascot";
import { Globe } from "@/components/ui/Globe";
import { OrbitingIcons } from "@/components/ui/effects";
import { CopyButton, GithubIcon, LiveDot, MagneticLink } from "@/components/ui/primitives";
import { useLocalTime } from "@/components/ui/TopBar";
import { AskTile } from "./AskTile";
import { stagger } from "@/lib/motion";

const tileIn: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 160, damping: 22 } },
};

export function HeroBento() {
  const time = useLocalTime(profile.timeZone);

  return (
    <section id="top" className="relative isolate pt-20 pb-16 md:pt-24">
      <Aurora className="-z-10 h-[1000px] [mask-image:linear-gradient(to_bottom,black_45%,transparent)]" />

      <motion.div
        className="mx-auto grid max-w-7xl gap-3 px-4 sm:px-6 md:grid-cols-6 lg:auto-rows-[224px] lg:grid-cols-12 lg:px-8"
        variants={stagger(0.08, 0.1)}
        initial="hidden"
        animate="show"
      >
        {/* Intro */}
        <motion.div variants={tileIn} className="tile flex flex-col p-6 sm:p-8 md:col-span-6 lg:col-span-8 lg:row-span-2">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 className="mt-5 text-[2.9rem] leading-[0.98] font-semibold tracking-[-0.04em] text-balance sm:text-6xl xl:text-7xl">
            <span className="text-gradient">{hero.lead}</span> <span className="serif-accent pr-1">{hero.accent}</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted text-pretty sm:text-base">{hero.body}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <MagneticLink href={bookingHref}>
              Let's talk <ArrowUpRight className="h-4 w-4" />
            </MagneticLink>
            <MagneticLink href="#work" variant="ghost">
              Selected work <ArrowDown className="h-4 w-4" />
            </MagneticLink>
            <CopyButton text={links.email} label="Copy email" className="py-3" />
          </div>
          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            {hero.badges.map((b, i) => (
              <a key={b.label} href={b.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted transition-colors hover:text-ink">
                {i === 0 ? <BadgeCheck className="h-3.5 w-3.5 text-lilac" /> : <GithubIcon className="h-3.5 w-3.5" />}
                {b.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Mascot */}
        <motion.div variants={tileIn} className="tile flex h-[460px] flex-col md:col-span-3 lg:col-span-4 lg:row-span-3 lg:h-auto">
          <div className="absolute inset-0 dots opacity-40" />
          <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(112_118_248/0.28),transparent)]" />
          <p className="relative p-6 font-serif text-3xl text-lilac italic">{mascot.greeting}</p>
          <div className="relative grid flex-1 place-items-center">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
              <Mascot size={236} interactive />
            </motion.div>
            <motion.div
              className="absolute bottom-6 h-3 w-28 rounded-[50%] bg-black/60 blur-[6px]"
              animate={{ scaleX: [1, 0.82, 1], opacity: [0.7, 0.45, 0.7] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="relative p-6 pt-0 text-sm leading-relaxed text-muted">{mascot.body}</p>
        </motion.div>

        {/* Ask my portfolio */}
        <motion.div variants={tileIn} className="h-[460px] md:col-span-3 lg:col-span-5 lg:row-span-2 lg:h-auto">
          <AskTile />
        </motion.div>

        {/* Now */}
        <motion.div variants={tileIn} className="tile flex min-h-[180px] flex-col justify-between p-6 md:col-span-3 lg:col-span-3">
          <p className="eyebrow flex items-center gap-2">
            <LiveDot /> Now
          </p>
          <p className="text-lg leading-snug font-medium tracking-tight text-balance">{hero.now}</p>
        </motion.div>

        {/* Location */}
        <motion.div variants={tileIn} className="tile min-h-[180px] p-6 md:col-span-3 lg:col-span-3">
          <p className="eyebrow">Based in</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {profile.city}, {profile.country}
          </p>
          <p className="mt-1 font-mono text-xs text-muted">{time} IST · UTC+5:30</p>
          <Globe className="absolute -right-8 -bottom-10 h-48 w-48 opacity-90" />
        </motion.div>

        {/* Daily drivers */}
        <motion.div variants={tileIn} className="tile flex min-h-[200px] items-center gap-2 overflow-hidden p-4 md:col-span-6 lg:col-span-4">
          <OrbitingIcons inner={dailyDrivers.slice(0, 3)} outer={dailyDrivers.slice(3)} innerRadius={42} outerRadius={80} className="h-[196px] w-[196px] shrink-0" />
          <div className="min-w-0 pr-2">
            <p className="eyebrow">Daily drivers</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{dailyDrivers.join(" · ")}</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
