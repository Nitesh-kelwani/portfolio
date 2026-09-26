import {
  siDocker, siFastapi, siGit, siGooglegemini, siHuggingface, siLangchain, siMediapipe, siMlflow, siOpencv,
  siPandas, siPostgresql, siPython, siPytorch, siReact, siRedis, siScikitlearn, siSqlalchemy, siStreamlit,
  siTypescript, type SimpleIcon,
} from "simple-icons";
import { cn } from "@/lib/utils";

const icons: Record<string, SimpleIcon> = {
  Python: siPython,
  FastAPI: siFastapi,
  PostgreSQL: siPostgresql,
  Redis: siRedis,
  Docker: siDocker,
  React: siReact,
  TypeScript: siTypescript,
  PyTorch: siPytorch,
  LangChain: siLangchain,
  Gemini: siGooglegemini,
  "Hugging Face": siHuggingface,
  Streamlit: siStreamlit,
  "scikit-learn": siScikitlearn,
  pandas: siPandas,
  Git: siGit,
  MLflow: siMlflow,
  OpenCV: siOpencv,
  MediaPipe: siMediapipe,
  SQLAlchemy: siSqlalchemy,
};

// Brands without an icon in simple-icons get a clean monogram instead.
const monograms: Record<string, string> = {
  LangGraph: "LG",
  "Azure OpenAI": "AO",
  "Azure AI Search": "AS",
  "Document Intelligence": "DI",
  Groq: "GQ",
  LiteLLM: "LL",
  FAISS: "FS",
};

function readableHex(hex: string) {
  // Dark brand colours disappear on a near-black page; lift them.
  const n = parseInt(hex, 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum < 0.35 ? "#e6e6ee" : `#${hex}`;
}

export function BrandIcon({ name, className, colored = false }: { name: string; className?: string; colored?: boolean }) {
  const icon = icons[name];
  if (icon) {
    return (
      <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} fill={colored ? readableHex(icon.hex) : "currentColor"} role="img" aria-label={name}>
        <path d={icon.path} />
      </svg>
    );
  }
  return (
    <span
      className={cn("grid h-5 w-5 place-items-center rounded-md border border-current/30 font-mono text-[8px] leading-none font-medium", className)}
      role="img"
      aria-label={name}
    >
      {monograms[name] ?? name.slice(0, 2).toUpperCase()}
    </span>
  );
}
