import {
  siC, siCplusplus, siDart, siDocker, siExpress, siFastapi, siFlutter, siGit, siHuggingface, siJavascript, siLangchain,
  siLinux, siMeta, siMongodb, siMysql, siNestjs, siNextdotjs, siNodedotjs, siOpenjdk, siPostgresql, siPython, siReact,
  siSpringboot, siTailwindcss, siTypescript, siPrisma, siVercel, siRazorpay, siPytorch, siOpencv, siVite, siRadixui,
  siScikitlearn, siSqlalchemy, siShadcnui, siSocketdotio, siGooglegemini, siFramer, siAndroid, siLeaflet, siNeon, siXyflow,
  siFlask, siHtml5, siCss, siStreamlit, type SimpleIcon,
} from "simple-icons";
import { BrainCircuit, ChartColumn, Cloud, Cpu, Database, FileSearch, HeartPulse, Layers, Leaf, MessageSquareText, Mic, QrCode, Radio, ScanEye, Share2, Sparkles, Webhook, type LucideIcon } from "lucide-react";

/** Brand logos (Simple Icons, CC0) for tools; line icons for concepts. */
const BRAND: Record<string, SimpleIcon> = {
  Python: siPython, Java: siOpenjdk, C: siC, "C++": siCplusplus, JavaScript: siJavascript, TypeScript: siTypescript,
  React: siReact, "Next.js": siNextdotjs, "Tailwind CSS": siTailwindcss, Flutter: siFlutter, Dart: siDart,
  "Node.js": siNodedotjs, "Express.js": siExpress, NestJS: siNestjs, "Spring Boot": siSpringboot, FastAPI: siFastapi,
  LangChain: siLangchain, FAISS: siMeta, Transformers: siHuggingface, PostgreSQL: siPostgresql, MySQL: siMysql,
  MongoDB: siMongodb, Git: siGit, Docker: siDocker, Linux: siLinux,
  // used on the project case-study pages
  "React 19": siReact, Express: siExpress, Prisma: siPrisma, "Neon PostgreSQL": siNeon, Razorpay: siRazorpay,
  "Razorpay (test mode)": siRazorpay, Vercel: siVercel, PyTorch: siPytorch, OpenCV: siOpencv, Vite: siVite,
  "Radix UI": siRadixui, "scikit-learn": siScikitlearn, SQLAlchemy: siSqlalchemy, "shadcn/ui": siShadcnui,
  "Socket.IO": siSocketdotio, "Google Gemini": siGooglegemini, "Framer Motion": siFramer, Android: siAndroid,
  "React Leaflet": siLeaflet, "@xyflow/react": siXyflow, Flask: siFlask, HTML: siHtml5, CSS: siCss, Streamlit: siStreamlit,
};
const CONCEPT: Record<string, LucideIcon> = {
  SQL: Database, "REST APIs": Webhook, "Machine Learning": BrainCircuit, "Deep Learning": Layers, NLP: MessageSquareText,
  LLMs: Sparkles, RAG: FileSearch, AWS: Cloud,
  "MegaDetector V6": ScanEye, BioCLIP: Leaf, BioClinicalBERT: HeartPulse, NetworkX: Share2, "Groq LLM": Cpu, Groq: Cpu,
  Recharts: ChartColumn, WebSockets: Radio, "QR codes": QrCode, "Web Speech API": Mic,
};
// near-black brand marks are drawn in the current text colour so they stay visible in dark mode
const MONO = new Set(["Next.js", "Express.js", "Express", "Linux", "Vercel", "shadcn/ui", "Socket.IO", "Prisma", "Framer Motion"]);

export function TechIcon({ name, size = 20 }: { name: string; size?: number }) {
  const b = BRAND[name];
  if (b) {
    return (
      <svg role="img" aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill={MONO.has(name) ? "currentColor" : `#${b.hex}`}>
        <path d={b.path} />
      </svg>
    );
  }
  const Icon = CONCEPT[name] ?? Sparkles;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" className="text-accent" />;
}

/** App-style icon (macOS squircle): brand colour with a white or dark mark; concepts get a navy/gold tile. */
export function AppIcon({ name, size = 64 }: { name: string; size?: number }) {
  const b = BRAND[name];
  const radius = size * 0.24;
  if (b) {
    const hex = MONO.has(name) ? "111827" : b.hex;
    const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), bl = parseInt(hex.slice(4, 6), 16);
    const light = (0.299 * r + 0.587 * g + 0.114 * bl) / 255 > 0.7;
    return (
      <span
        className="grid place-items-center shadow-[0_10px_24px_-10px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.35)]"
        style={{ width: size, height: size, borderRadius: radius, background: `linear-gradient(160deg, #${hex}, #${hex}dd)` }}
      >
        <svg role="img" aria-hidden="true" viewBox="0 0 24 24" width={size * 0.52} height={size * 0.52} fill={light ? "#111827" : "#ffffff"}>
          <path d={b.path} />
        </svg>
      </span>
    );
  }
  const Icon = CONCEPT[name] ?? Sparkles;
  return (
    <span
      className="grid place-items-center shadow-[0_10px_24px_-10px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
      style={{ width: size, height: size, borderRadius: radius, background: "linear-gradient(160deg, #365783, #111f36)" }}
    >
      <Icon size={size * 0.48} strokeWidth={1.7} color="#e6c990" aria-hidden="true" />
    </span>
  );
}
