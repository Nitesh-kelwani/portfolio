import { MotionConfig } from "motion/react";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { Dock } from "@/components/ui/Dock";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { HeroBento } from "@/components/sections/HeroBento";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Lab } from "@/components/sections/Lab";
import { Manifesto, Path } from "@/components/sections/Path";
import { Toolbox } from "@/components/sections/Toolbox";
import { Contact, Footer } from "@/components/sections/Contact";
import { initSmoothScroll } from "@/lib/scroll";

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => initSmoothScroll(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">
          Skip to content
        </a>
        <TopBar />
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        <main id="main">
          <HeroBento />
          <SelectedWork />
          <Lab />
          <Path />
          <Manifesto />
          <Toolbox />
          <Contact />
        </main>
        <Footer />
        <Dock onOpenPalette={() => setPaletteOpen(true)} />
      </div>
    </MotionConfig>
  );
}
