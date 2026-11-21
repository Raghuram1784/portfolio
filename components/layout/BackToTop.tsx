"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { scrollToSection } from "@/lib/gsap";

const C = 2 * Math.PI * 22;

/** Floating back-to-top button whose gold ring shows how far you've read. */
export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 700));
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(v));
  return (
    <motion.button
      type="button"
      onClick={() => scrollToSection("home")}
      aria-label="Back to top"
      initial={false}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.6, pointerEvents: show ? "auto" : "none" }}
      transition={{ duration: 0.3 }}
      className="fixed right-5 bottom-5 z-[65] grid h-14 w-14 place-items-center rounded-full bg-navy-900/90 text-ivory shadow-[var(--shadow-soft)] backdrop-blur dark:bg-beige/90 dark:text-navy-900"
    >
      <svg viewBox="0 0 50 50" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="25" cy="25" r="22" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />
        <circle cx="25" cy="25" r="22" fill="none" stroke="#c7a261" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} />
      </svg>
      <ArrowUp size={18} />
    </motion.button>
  );
}
