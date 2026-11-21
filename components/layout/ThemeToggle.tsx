"use client";

import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/cn";

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

/** Animated sun/moon toggle with a circular view-transition reveal where supported. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark";
    const doc = document as DocWithVT;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) {
      setTheme(next);
      return;
    }
    const x = e.clientX || window.innerWidth - 80;
    const y = e.clientY || 40;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        "relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-gilt-500/50 bg-gilt-200/40 text-lapis-800 transition-colors duration-300 hover:bg-gilt-200 dark:bg-gilt-300/10 dark:text-gilt-300 dark:hover:bg-gilt-300/20",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="grid place-items-center"
        >
          {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
