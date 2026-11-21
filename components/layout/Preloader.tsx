"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { markIntroDone } from "@/lib/intro";

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Intro: the name assembles on navy with a 0→100 counter, then the curtain
 * lifts. Shown once per session; skipped entirely with reduced motion.
 */
export function Preloader() {
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("rr-intro") === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setShow(false);
      markIntroDone();
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    const D = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / D);
      setN(Math.round((1 - Math.pow(1 - k, 3)) * 100));
      if (k < 1) raf = requestAnimationFrame(tick);
      else
        window.setTimeout(() => {
          setShow(false);
          document.documentElement.style.overflow = "";
          try {
            sessionStorage.setItem("rr-intro", "1");
          } catch {}
          window.setTimeout(markIntroDone, 350);
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="pre"
          aria-hidden="true"
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-navy-900 p-6 text-ivory md:p-10"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 0.9, ease }}
        >
          <p className="font-mono text-[0.78rem] tracking-[0.12em] text-ivory/50 uppercase">Portfolio · 2026</p>
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="font-display text-[clamp(3.4rem,13vw,12rem)] leading-[0.9] font-semibold tracking-[-0.03em]"
            >
              {site.name}
              <span className="text-gold">.</span>
            </motion.p>
          </div>
          <div className="flex items-end justify-between">
            <p className="serif-it text-[1.3rem] text-ivory/70">Software · AI/ML · Full-Stack · Mobile</p>
            <p className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none font-semibold tabular-nums text-gold-light">{String(n).padStart(3, "0")}</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-ivory/10">
            <div className="h-full origin-left bg-gold" style={{ transform: `scaleX(${n / 100})` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
