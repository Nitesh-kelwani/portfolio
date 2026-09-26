import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Dusk landscape layers, graded from Unsplash photos (credits in README).
// Each hero layer is its own image so it can move at its own scroll speed.

export function HeroBackHills({ className }: { className?: string }) {
  return <img src="/scenes/hero-hills.webp" alt="" draggable={false} className={cn("h-full w-full object-cover object-top select-none", className)} />;
}

export function HeroFrontHills({ className }: { className?: string }) {
  return (
    <img
      src="/scenes/hero-forest.webp"
      alt=""
      draggable={false}
      className={cn("relative left-1/2 block h-auto w-full min-w-[960px] max-w-none -translate-x-1/2 select-none", className)}
    />
  );
}

export function CtaHills({ className }: { className?: string }) {
  return <img src="/scenes/cta-hills.webp" alt="" draggable={false} loading="lazy" className={cn("h-full w-full object-cover object-top select-none", className)} />;
}

export function Cloud({ className, variant = "a" }: { className?: string; variant?: "a" | "b" }) {
  return <img src={`/scenes/cloud-${variant}.webp`} alt="" draggable={false} loading="lazy" className={cn("pointer-events-none select-none", className)} />;
}

export type ScenePhoto = "dusk" | "valley" | "forest" | "golden";

/** A framed photo scene with optional drifting clouds; children render on top. */
export function Scene({ className, photo = "dusk", clouds = false, position = "50% 60%", children }: {
  className?: string;
  photo?: ScenePhoto;
  clouds?: boolean;
  position?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-[#1d2227]", className)}>
      <img
        src={`/scenes/scene-${photo}.webp`}
        alt=""
        draggable={false}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover select-none"
        style={{ objectPosition: position }}
      />
      {clouds && (
        <>
          <Cloud variant="a" className="absolute top-[6%] -left-[8%] w-[46%] animate-drift opacity-90" />
          <Cloud variant="b" className="absolute top-[2%] -right-[12%] w-[40%] animate-drift-slow opacity-80" />
        </>
      )}
      {children}
    </div>
  );
}
