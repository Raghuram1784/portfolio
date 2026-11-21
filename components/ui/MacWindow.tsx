import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** macOS-style window: title bar with the three traffic-light dots. */
export function MacWindow({ children, title, className, dark = true }: { children: ReactNode; title?: string; className?: string; dark?: boolean }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[14px] shadow-[0_2px_6px_rgba(0,0,0,0.18),0_50px_100px_-35px_rgba(0,0,0,0.7)] ring-1",
        dark ? "bg-[#0d0f14] ring-white/12" : "bg-white ring-black/10",
        className,
      )}
    >
      <div className={cn("relative flex h-8 items-center gap-2 px-3.5", dark ? "bg-[#1b1e25]" : "bg-[#eceef2]")}>
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        {title && (
          <span className={cn("absolute left-1/2 max-w-[60%] -translate-x-1/2 truncate font-mono text-[0.72rem]", dark ? "text-white/55" : "text-black/45")}>{title}</span>
        )}
      </div>
      {children}
    </div>
  );
}
