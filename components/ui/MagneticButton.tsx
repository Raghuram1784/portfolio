"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { forwardRef, useRef, type ReactNode, type MouseEvent } from "react";
import { useFinePointer } from "@/lib/hooks";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "gold" | "ghost-light";

const variants: Record<Variant, string> = {
  primary:
    "bg-lapis-700 text-ivory shadow-[0_10px_30px_-10px_rgba(19,39,74,0.55)] hover:bg-lapis-800 dark:bg-gilt-300 dark:text-lapis-800 dark:hover:bg-gilt-200 dark:shadow-[0_10px_30px_-12px_rgba(235,211,160,0.4)]",
  outline:
    "border border-lapis-700/40 text-ink bg-transparent hover:border-gilt-500 hover:bg-gilt-200/40 dark:border-gilt-300/40 dark:hover:bg-gilt-300/10",
  gold: "bg-gilt-200 text-lapis-800 hover:bg-ivory shadow-[0_10px_30px_-12px_rgba(201,160,83,0.6)]",
  "ghost-light": "border border-ivory/30 text-ivory hover:border-gilt-300 hover:bg-ivory/10",
};

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  external?: boolean;
  download?: boolean;
  ariaLabel?: string;
}

/** CTA with a subtle magnetic pull on desktop pointers. */
export const MagneticButton = forwardRef<HTMLElement, Props>(function MagneticButton(
  { children, href, onClick, variant = "primary", className, external, download, ariaLabel },
  _ref,
) {
  const fine = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const local = useRef<HTMLElement | null>(null);

  const onMove = (e: MouseEvent) => {
    if (!fine || !local.current) return;
    const r = local.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const cls = cn(
    "group relative inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[0.95rem] font-semibold tracking-tight transition-colors duration-300 will-change-transform",
    variants[variant],
    className,
  );

  const common = {
    style: { x: sx, y: sy },
    onMouseMove: onMove,
    onMouseLeave: reset,
    whileTap: { scale: 0.97 },
    className: cls,
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <motion.a
        ref={(n: HTMLAnchorElement | null) => {
          local.current = n;
        }}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: "" } : {})}
        {...common}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      ref={(n: HTMLButtonElement | null) => {
        local.current = n;
      }}
      type="button"
      onClick={onClick}
      {...common}
    >
      {children}
    </motion.button>
  );
});
