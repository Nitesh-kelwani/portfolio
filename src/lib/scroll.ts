import Lenis from "lenis";

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: -24 } });
  let raf = 0;
  const loop = (t: number) => {
    lenis?.raf(t);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToId(id: string) {
  const el = id === "top" ? document.body : document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(id === "top" ? 0 : el, { offset: id === "top" ? 0 : -24, duration: 1.2 });
  else if (id === "top") window.scrollTo({ top: 0, behavior: "smooth" });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}
