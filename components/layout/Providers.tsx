"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // Pinned scroll stories break if the browser restores a mid-page position
  // before ScrollTrigger has measured — start reloads from the top instead.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="rr-theme">
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}
