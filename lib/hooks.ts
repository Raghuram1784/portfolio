"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export function useMediaQuery(query: string, initial = false) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => initial,
  );
}

export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

export type GpuTier = "full" | "lite" | "none" | "pending";

/** Rough capability check: decides between full 3D, lite 3D and the SVG fallback. */
export function useGpuTier(): GpuTier {
  const [tier, setTier] = useState<GpuTier>("pending");
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
      if (!gl) return setTier("none");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return setTier("none");
      const cores = navigator.hardwareConcurrency ?? 4;
      const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
      const small = window.innerWidth < 1024;
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
      const software = /swiftshader|llvmpipe|software/i.test(renderer);
      if (software) return setTier("none");
      setTier(small || cores <= 4 || mem <= 2 ? "lite" : "full");
    } catch {
      setTier("none");
    }
  }, []);
  return tier;
}
