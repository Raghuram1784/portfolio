"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };

/** Smoothly scroll to a section id, compensating for the floating navbar. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // The hero is pinned on desktop — its pin-spacer is the real scroll target.
  const target = id === "home" ? 0 : el;
  if (reduce) {
    const y = target === 0 ? 0 : el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y });
  } else {
    gsap.to(window, {
      duration: 1.1,
      ease: "power3.inOut",
      scrollTo: { y: target, offsetY: target === 0 ? 0 : 72, autoKill: true },
    });
  }
  history.replaceState(null, "", id === "home" ? " " : `#${id}`);
}
