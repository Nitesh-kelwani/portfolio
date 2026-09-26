import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// Slow drifting curtains of indigo/violet light. Rendered at a fraction of the
// display resolution and stretched by CSS: the image is soft anyway, and it keeps
// the GPU cost tiny.
const FRAG = `
precision mediump float;
uniform vec2 r;
uniform float t;
uniform vec2 m;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1.0, 0.0)), f.x), mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * n(p); p = p * 2.03 + 1.7; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / r;
  vec2 p = uv * vec2(r.x / r.y, 1.0) * 1.35;
  float s = t * 0.03;
  vec2 warp = vec2(fbm(p + vec2(s, -s)), fbm(p * 1.4 - s));
  float f = fbm(p + warp * 1.6 + vec2(s * 0.7, 0.0) + (m - 0.5) * 0.25);
  float curtain = smoothstep(0.42, 0.95, f);
  float vfade = smoothstep(0.0, 0.45, uv.y) * (1.0 - smoothstep(0.82, 1.1, uv.y));
  vec3 indigo = vec3(0.44, 0.46, 0.97);
  vec3 violet = vec3(0.61, 0.55, 0.97);
  vec3 cyan = vec3(0.28, 0.62, 0.86);
  vec3 col = mix(indigo, violet, smoothstep(0.25, 0.85, warp.x));
  col = mix(col, cyan, smoothstep(0.55, 0.9, warp.y) * 0.35);
  float a = curtain * vfade * 0.9;
  gl_FragColor = vec4(col * a, a);
}`;

export function Aurora({ className, scale = 0.35 }: { className?: string; scale?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: true, powerPreference: "low-power" });
    if (!gl) return; // CSS gradient behind the canvas stays as the fallback

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    const uM = gl.getUniformLocation(prog, "m");

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      canvas.width = Math.max(2, Math.floor(canvas.clientWidth * scale));
      canvas.height = Math.max(2, Math.floor(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    const start = performance.now() - 20000;
    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.03;
      mouse.y += (mouse.ty - mouse.y) * 0.03;
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, (now - start) / 1000);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [scale]);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_20%,rgb(112_118_248/0.16),transparent_70%),radial-gradient(50%_40%_at_75%_30%,rgb(155_140_248/0.12),transparent_70%)]" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" style={{ imageRendering: "auto" }} />
    </div>
  );
}
