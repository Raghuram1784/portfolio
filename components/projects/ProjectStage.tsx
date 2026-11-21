"use client";

import type { Project } from "@/content/projects";
import { cn } from "@/lib/cn";

/** Small provenance badge — every exhibit says what kind of image it is. */
export function Provenance({ illustrative, className }: { illustrative?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-display text-[0.62rem] font-semibold tracking-[0.18em] uppercase backdrop-blur",
        illustrative ? "border-white/30 bg-black/35 text-white/85" : "border-white/25 bg-black/40 text-white/85",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", illustrative ? "bg-amber-300" : "bg-emerald-400")} />
      {illustrative ? "Illustrative artwork" : "Real screenshots"}
    </span>
  );
}

/**
 * Original illustrative artwork for projects without usable screenshots.
 * Always shown with the "Illustrative artwork" badge. AweTails: the
 * listen → transcribe → retrieve → respond loop as a living waveform.
 */
export function ProjectArt({ project, className }: { project: Project; className?: string }) {
  const { accent, ink } = project.brand;
  const steps = project.pipeline ?? [];
  return (
    <div className={cn("relative", className)}>
      <div data-layer="1" className="absolute inset-0 overflow-hidden rounded-2xl border border-white/15" style={{ background: "radial-gradient(80% 80% at 50% 40%, #1b2550 0%, #0b1020 75%)" }}>
        {/* concentric listening rings */}
        <svg viewBox="-200 -200 400 400" className="absolute top-[8%] left-1/2 h-[58%] -translate-x-1/2">
          {[60, 95, 130, 165].map((r, i) => (
            <circle key={r} r={r} fill="none" stroke={accent} strokeOpacity={0.5 - i * 0.1} className="anim-breathe" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
          <circle r="42" fill={accent} />
          <rect x="-10" y="-24" width="20" height="32" rx="10" fill="#0b1020" />
          <path d="M-18 0 a18 18 0 0 0 36 0 M0 18 v10" stroke="#0b1020" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
        {/* expressive waveform */}
        <div className="absolute inset-x-[8%] top-[64%] flex h-[16%] items-center justify-between">
          {Array.from({ length: 48 }, (_, i) => (
            <span
              key={i}
              className="anim-wave w-[1.1%] rounded-full"
              style={{
                height: `${Math.round(18 + Math.abs(Math.sin(i * 0.55)) * 82 * (1 - Math.abs(i - 24) / 30))}%`, // rounded: identical on server and client
                background: i % 6 === 0 ? accent : ink,
                opacity: i % 6 === 0 ? 1 : 0.55,
                animationDelay: `${(i % 8) * 0.11}s`,
              }}
            />
          ))}
        </div>
        {/* the loop, from the README pipeline */}
        <ol className="absolute inset-x-[6%] bottom-[5%] grid grid-cols-4 gap-2">
          {steps.map((s, i) => (
            <li key={s.label} className="rounded-xl border border-white/12 bg-white/[0.05] px-3 py-2 backdrop-blur-sm">
              <p className="font-display text-[0.62rem] font-semibold tracking-[0.18em]" style={{ color: accent }}>
                0{i + 1}
              </p>
              <p className="font-display text-sm font-semibold" style={{ color: ink }}>
                {s.label}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <Provenance illustrative className="absolute top-3 left-3 z-10" />
    </div>
  );
}
