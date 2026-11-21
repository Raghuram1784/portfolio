"use client";

import { SquareTerminal } from "lucide-react";
import { OPEN_TERMINAL } from "@/components/layout/Terminal";
import { cn } from "@/lib/cn";

/** Opens the hidden terminal (also: ` or Ctrl/⌘ + K). */
export function TerminalButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_TERMINAL))}
      aria-label="Open terminal"
      title="Open terminal  ( ` or Ctrl+K )"
      className={cn("grid h-11 w-11 place-items-center rounded-full border transition-colors", className)}
    >
      <SquareTerminal size={18} />
    </button>
  );
}
