"use client";

import { useEffect } from "react";
import { scrollToSection } from "@/lib/gsap";
import { useIntroDone } from "@/lib/intro";

/** Arriving at /#section (e.g. "All work" from a case study): glide there once the page has settled. */
export function HashScroll() {
  const done = useIntroDone();
  useEffect(() => {
    if (!done) return;
    const id = window.location.hash.slice(1);
    if (!id || !document.getElementById(id)) return;
    const t = window.setTimeout(() => scrollToSection(id), 500);
    return () => window.clearTimeout(t);
  }, [done]);
  return null;
}
