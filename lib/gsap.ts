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
  if (!el) {
    // not on the home page (e.g. a case study): go home, straight to that section
    window.location.href = id === "home" ? "/" : `/#${id}`;
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // The hero is pinned on desktop — its pin-spacer is the real scroll target.
  const target = id === "home" ? 0 : el;
  // the projects carousel is a full-screen pinned scene: land flush, not under-the-navbar
  const offset = target === 0 || id === "projects" ? 0 : 72;
  if (reduce) {
    const y = target === 0 ? 0 : el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y });
  } else {
    gsap.to(window, {
      duration: 1.1,
      ease: "power3.inOut",
      scrollTo: { y: target, offsetY: offset, autoKill: true },
    });
  }
  history.replaceState(null, "", id === "home" ? " " : `#${id}`);
}
