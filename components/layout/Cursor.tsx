"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * A gilt dot + trailing ring. The ring swells over links/buttons and shows
 * a label over elements that declare `data-cursor="View"`.
 * Desktop pointers only; native cursor everywhere else.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const enabled = fine && !reduce;
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 300, damping: 28, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 300, damping: 28, mass: 0.5 });
  const [mode, setMode] = useState<"idle" | "link" | "label">("idle");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, [role=tab], input, textarea");
      if (t?.dataset.cursor) {
        setMode("label");
        setLabel(t.dataset.cursor);
      } else if (t) setMode("link");
      else setMode("idle");
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const size = mode === "label" ? 84 : mode === "link" ? 46 : 30;
  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ x: rx, y: ry }}
        className="pointer-events-none fixed top-0 left-0 z-[100]"
        animate={{ opacity: visible ? 1 : 0 }}
      >
        <motion.div
          animate={{ width: size, height: size }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className={
            "grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-[0.68rem] font-semibold tracking-[0.16em] uppercase " +
            (mode === "label"
              ? "border-transparent bg-lapis-700/90 text-gilt-200 backdrop-blur-sm dark:bg-gilt-300/90 dark:text-lapis-900"
              : "border-gilt-500/70")
          }
        >
          {mode === "label" ? label : null}
        </motion.div>
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ x, y }}
        animate={{ opacity: visible && mode !== "label" ? 1 : 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[100] -mt-[3px] -ml-[3px] h-1.5 w-1.5 rounded-full bg-gilt-500"
      />
    </>
  );
}
