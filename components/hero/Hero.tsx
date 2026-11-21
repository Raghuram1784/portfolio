"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { ArrowDown, ArrowRight, Download } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { site } from "@/content/site";
import { gsap, ScrollTrigger, scrollToSection, useGSAP } from "@/lib/gsap";
import { useGpuTier } from "@/lib/hooks";
import { useIntroDone } from "@/lib/intro";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => null });
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Hero: the name on a living shader background (Nebula) that reacts to the
 * cursor. The introduction drifts away as you scroll into the work.
 */
export function Hero({ resumeAvailable }: { resumeAvailable: boolean }) {
  const section = useRef<HTMLElement>(null);
  const progress = useRef({ current: 0 }).current;
  const pointer = useRef({ x: 0, y: 0 }).current;
  const tier = useGpuTier();
  const go = useIntroDone();
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const use3D = tier === "full" || tier === "lite";
  const { resolvedTheme } = useTheme();
  const light = resolvedTheme !== "dark";
  useEffect(() => {
    if (!section.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(section.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointer]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();
      // every screen size: the introduction drifts up and fades as you scroll past
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: 0.5 } });
        tl.to(q("[data-copy]"), { yPercent: -18, opacity: 0 }, 0).to(q("[data-cue]"), { opacity: 0, duration: 0.2 }, 0);
      });
    },
    { scope: section },
  );

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => window.clearTimeout(id);
  }, [ready]);

  return (
    <section id="home" ref={section} aria-label="Introduction" className="relative isolate z-10 overflow-hidden bg-bg">
      {/* animated gradient fallback; the WebGL silk covers it when available */}
      <div aria-hidden="true" className="hero-flow pointer-events-none absolute inset-0 -z-10" />
      {use3D && (
        <motion.div aria-hidden="true" className="absolute inset-0 -z-[5]" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 1.2, ease }}>
          <HeroScene progress={progress} pointer={pointer} active={inView} light={light} variant={5 /* Nebula */} onReady={onReady} />
        </motion.div>
      )}

      <div className="container-x relative z-20 flex min-h-[100svh] flex-col items-center justify-center pt-28 pb-20 text-center">
        {/* ---------- name & introduction ---------- */}
        <div data-copy className="flex flex-col items-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={go ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.8, ease, delay: 0.1 }} className="label justify-center">
            <b>Portfolio · 2026</b> Hyderabad, India
          </motion.p>

          <h1 className="mt-7">
            <span className="sr-only">{site.name}</span>
            <span aria-hidden="true" className="block overflow-hidden pb-[0.06em] text-[clamp(3.6rem,13vw,12rem)] leading-[0.9] font-semibold tracking-[-0.03em] whitespace-nowrap text-ink">
              {site.name.split("").map((ch, i) => (
                <motion.span key={i} className="inline-block" initial={{ y: "105%" }} animate={go ? { y: "0%" } : undefined} transition={{ duration: 1, ease, delay: 0.25 + i * 0.04 }}>
                  {ch}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={go ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease, delay: 0.8 }}
            className="mt-6 max-w-[40rem] text-[clamp(1.45rem,2.4vw,2.3rem)] leading-[1.18] text-ink"
          >
            <span className="serif-it text-accent">builds intelligent products</span>, from agentic commerce to wildlife protection and clinical AI.
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={go ? { opacity: 1 } : undefined} transition={{ duration: 0.9, delay: 1 }} className="mt-5 font-mono text-[0.82rem] leading-relaxed tracking-wide text-muted">
            Software Engineering · AI/ML · Full-Stack · Mobile
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={go ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.9, ease, delay: 1.1 }} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton onClick={() => scrollToSection("projects")}>
              See the work <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton variant="outline" onClick={() => scrollToSection("contact")}>
              Get in touch
            </MagneticButton>
            {resumeAvailable && (
              <MagneticButton variant="outline" href={site.resumePath} download>
                <Download size={17} /> Résumé
              </MagneticButton>
            )}
            <span className="mx-1 hidden h-8 w-px bg-line sm:block" />
            {[
              { href: site.socials.github, label: "GitHub", Icon: GithubIcon },
              { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
            ].map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} profile`} className="grid h-12 w-12 place-items-center rounded-full border border-line bg-bg/40 text-ink backdrop-blur transition-colors hover:border-gold hover:text-accent">
                <Icon size={19} />
              </a>
            ))}
          </motion.div>
        </div>

      </div>

      <div data-cue className="pointer-events-none absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 font-mono text-[0.76rem] tracking-[0.12em] text-muted uppercase md:flex">
        Scroll into the work <ArrowDown size={14} className="text-accent" />
      </div>
    </section>
  );
}
