import { cn } from "@/lib/cn";

/** Monogram: an italic serif R on royal blue with a single gold point. */
export function Logo({ className, size = 38 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={cn("shrink-0", className)} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#203a64" />
      <text x="30" y="47" textAnchor="middle" fontSize="42" fill="#faf5ec" style={{ fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic" }}>
        R
      </text>
      <circle cx="48" cy="44" r="4" fill="#c7a261" />
    </svg>
  );
}
