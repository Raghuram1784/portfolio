import Image from "next/image";
import type { Shot } from "@/content/projects";
import { cn } from "@/lib/cn";

/**
 * A real application screenshot in a minimal window frame.
 * Sized by width; height follows the screenshot's own aspect ratio,
 * so interfaces are never cropped into unreadable slivers.
 */
export function Screen({
  shot,
  className,
  priority,
  loading,
  sizes = "(max-width: 1024px) 92vw, 66vw",
  bar = true,
  tone = "dark",
  style,
  ...rest
}: {
  shot: Shot;
  className?: string;
  priority?: boolean;
  /** "eager" for screens inside pinned scroll stages (lazy-loading can't see transformed elements) */
  loading?: "eager" | "lazy";
  sizes?: string;
  bar?: boolean;
  tone?: "dark" | "light";
  style?: React.CSSProperties;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "style">) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[12px] shadow-[0_2px_6px_rgba(0,0,0,0.12),0_40px_90px_-30px_rgba(0,0,0,0.55)] ring-1",
        tone === "dark" ? "bg-[#0b1424] ring-white/10" : "bg-white ring-black/10",
        className,
      )}
      style={style}
      {...rest}
    >
      {bar && (
        <div className={cn("flex h-7 items-center gap-1.5 px-3", tone === "dark" ? "bg-white/[0.06]" : "bg-black/[0.04]")}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={cn("h-2 w-2 rounded-full", tone === "dark" ? "bg-white/25" : "bg-black/15")} />
          ))}
        </div>
      )}
      <div className="relative w-full" style={{ aspectRatio: `${shot.w} / ${shot.h}` }}>
        <Image src={shot.src} alt={shot.alt} fill sizes={sizes} priority={priority} loading={priority ? undefined : loading} className="object-cover object-top" draggable={false} />
      </div>
    </div>
  );
}
