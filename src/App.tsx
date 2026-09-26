import { MotionConfig } from "motion/react";
import { useEffect } from "react";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { ProjectTabs } from "@/components/sections/ProjectTabs";
import { WhatIBuild } from "@/components/sections/WhatIBuild";
import { LabStack } from "@/components/sections/LabStack";
import { Toolbox } from "@/components/sections/Toolbox";
import { Journey } from "@/components/sections/Journey";
import { Numbers } from "@/components/sections/Numbers";
import { Faq } from "@/components/sections/Faq";
import { MoreBuilds } from "@/components/sections/MoreBuilds";
import { Cta } from "@/components/sections/Cta";
import { Footer } from "@/components/sections/Footer";
import { initSmoothScroll } from "@/lib/scroll";

export default function App() {
  useEffect(() => initSmoothScroll(), []);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-black">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Intro />
        <ProjectTabs />
        <WhatIBuild />
        <LabStack />
        <Toolbox />
        <Journey />
        <Numbers />
        <Faq />
        <MoreBuilds />
        <Cta />
      </main>
      <Footer />
    </MotionConfig>
  );
}
