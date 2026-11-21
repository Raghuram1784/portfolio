"use client";

import { useEffect, useState } from "react";

/** Set by the preloader when its curtain lifts; hero entrances wait for it. */
export function markIntroDone() {
  (window as unknown as { __introDone?: boolean }).__introDone = true;
  window.dispatchEvent(new Event("intro-done"));
}

export function useIntroDone() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if ((window as unknown as { __introDone?: boolean }).__introDone) return setDone(true);
    const on = () => setDone(true);
    window.addEventListener("intro-done", on);
    const fallback = window.setTimeout(on, 3500); // never block the page
    return () => {
      window.removeEventListener("intro-done", on);
      window.clearTimeout(fallback);
    };
  }, []);
  return done;
}
