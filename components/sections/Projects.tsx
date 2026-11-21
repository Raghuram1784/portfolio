"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { projects, type Project } from "@/content/projects";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { GithubIcon } from "@/components/ui/BrandIcons";
import Image from "next/image";
import { useTheme } from "next-themes";
import { MacWindow } from "@/components/ui/MacWindow";
import { ProjectArt } from "@/components/projects/ProjectStage";
import Link from "next/link";
import { useRouter } from "next/navigation";

const N = projects.length;
const pad = (n: number) => String(n).padStart(2, "0");
const ease = [0.22, 1, 0.36, 1] as const;

/** Width of the centre card (vw). The hero's camera lands at exactly this size. */
export const cardVW = (w: number) => (w >= 1024 ? 54 : 66);



function Card({ p, priority }: { p: Project; priority?: boolean }) {
  return (
    <MacWindow title={p.title}>
      {p.cover ? (
        <Image
          src={p.cover}
          alt={`${p.title}: designed cover with real screenshots`}
          width={1600}
          height={1000}
          priority={priority}
          loading={priority ? undefined : "eager"}
          sizes="(max-width: 768px) 90vw, 60vw"
          className="block h-auto w-full select-none"
          draggable={false}
        />
      ) : (
        <div className="relative aspect-[16/10]">
          <ProjectArt project={p} className="h-full w-full" />
        </div>
      )}
    </MacWindow>
  );
}

/** Every scene uses the product's own (dark) brand colours — never plain white. */
function sceneOf(p: Project, _dark: boolean) {
  return { bg: p.brand.bg, bg2: p.brand.bg2, ink: p.brand.ink, light: false };
}

function Info({ p, i, light, ink }: { p: Project; i: number; light?: boolean; ink: string }) {
  const ring = light ? "border-navy-900/20 hover:border-navy-900/50" : "border-white/25 hover:border-white/60";
  return (
    <div className="grid items-end gap-6 md:grid-cols-12" style={{ color: ink }}>
      <div className="md:col-span-7">
        <p className="font-mono text-[0.78rem] tracking-[0.1em] uppercase" style={{ color: p.brand.accent }}>
          {pad(i + 1)} / {pad(N)} · {p.discipline}
        </p>
        <h3 className="mt-2 text-[clamp(2.2rem,4.6vw,4.4rem)] leading-[0.95] font-semibold tracking-[-0.045em]" style={{ color: ink }}>
          {p.title}
        </h3>
        <p className="serif-it mt-2 text-[clamp(1.15rem,1.7vw,1.6rem)] leading-snug" style={{ color: p.brand.accent }}>
          {p.tagline}
        </p>
      </div>
      <div className="md:col-span-5 md:justify-self-end md:text-right">
        <p className="font-mono text-[0.74rem] leading-relaxed tracking-wide opacity-70">{p.tech.slice(0, 5).join(" · ")}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2.5 md:justify-end">
          <Link
            href={`/work/${p.slug}`}
            data-cursor="Open"
            className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.95rem] font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: p.brand.accent, color: light || isLight(p) ? "#fff" : p.brand.bg }}
          >
            Read the case study
            <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
          </Link>
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} on GitHub`} className={cn("grid h-11 w-11 place-items-center rounded-full border transition-colors", ring)}>
              <GithubIcon size={18} />
            </a>
          )}
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noopener noreferrer" className={cn("inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors", ring)}>
              <ExternalLink size={15} /> Live demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const isLight = (_p: Project) => false;

/* ------------------------------------------------------------------ */
/*  ≥768px: a pinned 3D coverflow driven by scroll (and drag/keys)      */
/* ------------------------------------------------------------------ */
function ScrollCarousel({ onOpen, dark }: { onOpen: (p: Project) => void; dark: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const darkRef = useRef(dark);
  const renderRef = useRef<() => void>(() => {});
  useEffect(() => {
    darkRef.current = dark;
    renderRef.current();
  }, [dark]);
  const st = useRef<ScrollTrigger | null>(null);
  const target = useRef<number | null>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root.current);
      const shades = gsap.utils.toArray<HTMLElement>("[data-shade]", root.current);
      const bg = root.current!.querySelector<HTMLElement>("[data-bg]")!;
      const glow = root.current!.querySelector<HTMLElement>("[data-glow]")!;
      const fill = root.current!.querySelector<HTMLElement>("[data-fill]")!;
      const state = { pos: 0 };

      const render = () => {
        const pos = state.pos;
        const W = window.innerWidth;
        const step = W >= 1024 ? 40 : W >= 768 ? 46 : 74; // vw between centre and neighbour
        cards.forEach((el, i) => {
          const d = i - pos;
          const ad = Math.abs(d);
          const x = Math.sign(d) * (ad <= 1 ? ad * step : step + (ad - 1) * 15);
          const ry = -Math.max(-1.6, Math.min(1.6, d)) * 36;
          const z = -Math.min(ad, 3) * 280;
          const s = 1 - Math.min(ad, 1) * 0.16;
          el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}vw, 0, ${z.toFixed(0)}px) rotateY(${ry.toFixed(2)}deg) scale(${s.toFixed(3)})`;
          el.style.opacity = String(ad > 2.6 ? 0 : Math.max(0, 1 - Math.max(0, ad - 1.5)));
          el.style.zIndex = String(100 - Math.round(ad * 10));
          el.style.pointerEvents = ad > 2.2 ? "none" : "auto";
          if (shades[i]) shades[i].style.opacity = String(Math.min(ad, 1) * 0.5);
        });
        // background follows the products' own brand colours
        const a = Math.floor(pos);
        const b = Math.min(N - 1, a + 1);
        const t = pos - a;
        const A = sceneOf(projects[a], darkRef.current);
        const B = sceneOf(projects[b], darkRef.current);
        bg.style.background = gsap.utils.interpolate(A.bg, B.bg, t);
        glow.style.background = `radial-gradient(60% 55% at 50% 42%, ${gsap.utils.interpolate(A.bg2, B.bg2, t)}, transparent 70%)`;
        fill.style.transform = `scaleX(${(pos / (N - 1)).toFixed(4)})`;
        const idx = Math.round(pos);
        setActive((v) => (v === idx ? v : idx));
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${(N - 1) * window.innerHeight * 0.7}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // snap to the NEAREST project (never overshoot to the next one), and to the
          // exact target while an arrow / click is moving the carousel
          snap: {
            snapTo: (v: number) => (target.current !== null ? target.current / (N - 1) : Math.round(v * (N - 1)) / (N - 1)),
            directional: false,
            duration: { min: 0.2, max: 0.6 },
            delay: 0.08,
            ease: "power2.inOut",
          },
        },
      });
      tl.to(state, { pos: N - 1, ease: "none", duration: 1, onUpdate: render });
      st.current = tl.scrollTrigger ?? null;
      renderRef.current = render;
      render();
      window.addEventListener("resize", render);
      return () => window.removeEventListener("resize", render);
    },
    { scope: root },
  );

  const goTo = useCallback((i: number) => {
    const s = st.current;
    if (!s) return;
    const k = Math.max(0, Math.min(N - 1, i));
    target.current = k;
    gsap.to(window, {
      scrollTo: s.start + (k / (N - 1)) * (s.end - s.start),
      duration: 0.9,
      ease: "power3.inOut",
      overwrite: true,
      onComplete: () => void window.setTimeout(() => (target.current = null), 700),
    });
  }, []);

  // drag (mouse, pen, touch on tablets) scrubs the carousel
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const onDown = (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    drag.current = { x: e.clientX, y: window.scrollY, moved: false };
  };
  const onMove = (e: PointerEvent) => {
    const s = st.current;
    if (!drag.current || !s) return;
    const dx = e.clientX - drag.current.x;
    if (!drag.current.moved && Math.abs(dx) > 6) {
      drag.current.moved = true;
      // capture only once it's a real drag, so plain clicks still reach the cards
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (!drag.current.moved) return;
    const perCard = (s.end - s.start) / (N - 1);
    window.scrollTo({ top: drag.current.y - (dx / (window.innerWidth * 0.35)) * perCard });
  };
  const onUp = () => {
    // keep "moved" readable by the card's click handler, then clear
    window.setTimeout(() => (drag.current = null), 0);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo((target.current ?? active) + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo((target.current ?? active) - 1);
    }
  };

  const p = projects[active];
  const sc = sceneOf(p, dark);
  const light = sc.light;

  return (
    <div
      ref={root}
      className="relative h-[100svh] cursor-grab touch-pan-y overflow-clip select-none active:cursor-grabbing"
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects: scroll, drag or use the arrow keys"
      tabIndex={0}
      onKeyDown={onKey}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div data-bg className="absolute inset-0" style={{ background: sceneOf(projects[0], dark).bg }} />
      <div data-glow aria-hidden="true" className="absolute inset-0" />

      {/* header */}
      <div className="container-x relative z-[200] flex items-center justify-between pt-24">
        <p className={cn("font-mono text-[0.8rem] tracking-[0.1em] uppercase transition-colors", light ? "text-navy-900/60" : "text-white/60")}>
          <span className={light ? "text-gold-deep" : "text-gold-light"}>01</span> Selected work
        </p>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => goTo((target.current ?? active) - 1)} aria-label="Previous project" className={cn("grid h-12 w-12 place-items-center rounded-full border backdrop-blur transition-colors", light ? "border-navy-900/20 text-navy-900 hover:border-navy-900/50" : "border-white/25 text-white hover:border-white/60")}>
            <ArrowLeft size={19} />
          </button>
          <button type="button" onClick={() => goTo((target.current ?? active) + 1)} aria-label="Next project" className="grid h-12 w-12 place-items-center rounded-full text-navy-900 transition-transform hover:scale-105" style={{ background: p.brand.accent }}>
            <ArrowRight size={19} />
          </button>
        </div>
      </div>

      {/* the 3D carousel */}
      <div className="absolute inset-x-0 top-[150px] bottom-[max(30%,250px)] [perspective:1800px]">
        {projects.map((proj, i) => (
          <div
            key={proj.slug}
            data-card
            className="absolute top-[46%] left-1/2 will-change-transform [--card:86vw] md:[--card:66vw] lg:[--card:54vw]"
            style={{ width: "min(var(--card), calc((min(70svh, 100svh - 250px) - 150px - 70px) * 1.6))" }}
            onClick={() => {
              if (drag.current?.moved) return;
              if (i === active) onOpen(proj);
              else goTo(i);
            }}
            aria-label={`${i + 1} of ${N}: ${proj.title}${i === active ? ", open case study" : ""}`}
            role="button"
            data-cursor={i === active ? "Open" : "View"}
          >
            <div className="relative">
              <Card p={proj} priority={i === 0} />
              <div data-shade aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[14px] bg-black" style={{ opacity: i === 0 ? 0 : 0.5 }} />
            </div>
            {/* the project's name, right under its window */}
            <p className="mt-4 text-center font-display text-[clamp(1.2rem,1.8vw,1.6rem)] leading-none font-semibold" style={{ color: proj.brand.ink }}>
              {proj.title}
              <span className="ml-2 font-mono text-[0.7rem] font-normal tracking-[0.1em] uppercase opacity-60">{proj.discipline}</span>
            </p>
          </div>
        ))}
      </div>

      {/* active project details */}
      <div className="container-x absolute inset-x-0 bottom-0 z-[200] pb-8">
        <AnimatePresence mode="wait">
          <motion.div key={p.slug} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease }}>
            <Info p={p} i={active} light={light} ink={sc.ink} />
          </motion.div>
        </AnimatePresence>
        <div className={cn("mt-6 h-px w-full", light ? "bg-navy-900/15" : "bg-white/15")}>
          <div data-fill className="h-px origin-left scale-x-0" style={{ background: p.brand.accent }} />
        </div>
        <ul className="mt-3 hidden justify-between font-mono text-[0.7rem] tracking-wide lg:flex">
          {projects.map((proj, i) => (
            <li key={proj.slug}>
              <button type="button" onClick={() => goTo(i)} aria-current={i === active ? "true" : undefined} className={cn("transition-opacity hover:opacity-100", i === active ? "opacity-100" : "opacity-45")} style={{ color: light ? "#111f36" : "#faf5ec" }}>
                {proj.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Phones: the same coverflow as a touch-swipe carousel                */
/* ------------------------------------------------------------------ */
function SwipeCarousel({ onOpen, dark }: { onOpen: (p: Project) => void; dark: boolean }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "center" });
  const [sel, setSel] = useState(0);
  const nodes = useRef<HTMLElement[]>([]);

  const tween = useCallback((api: EmblaCarouselType) => {
    const engine = api.internalEngine();
    const progress = api.scrollProgress();
    api.scrollSnapList().forEach((snap, si) => {
      let diff = snap - progress;
      engine.slideRegistry[si].forEach((slide) => {
        engine.slideLooper.loopPoints.forEach((lp) => {
          const t = lp.target();
          if (slide === lp.index && t !== 0) diff = Math.sign(t) === -1 ? snap - (1 + progress) : snap + (1 - progress);
        });
        const d = Math.max(-1.5, Math.min(1.5, diff * N));
        const a = Math.min(1, Math.abs(d));
        const el = nodes.current[slide];
        if (el) {
          el.style.transform = `perspective(1000px) rotateY(${(-d * 30).toFixed(1)}deg) scale(${(1 - a * 0.14).toFixed(3)})`;
          el.style.opacity = String(1 - a * 0.45);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!embla) return;
    nodes.current = embla.slideNodes().map((n) => n.querySelector<HTMLElement>("[data-tw]")!);
    const onSel = () => setSel(embla.selectedScrollSnap());
    tween(embla);
    onSel();
    embla.on("scroll", tween).on("reInit", tween).on("select", onSel);
    return () => {
      embla.off("scroll", tween).off("reInit", tween).off("select", onSel);
    };
  }, [embla, tween]);

  const p = projects[sel];
  const sc = sceneOf(p, dark);
  const light = sc.light;
  return (
    <div className="relative overflow-hidden py-20 transition-colors duration-700" style={{ background: sc.bg }}>
      <div className="container-x">
        <p className={cn("font-mono text-[0.8rem] tracking-[0.1em] uppercase", light ? "text-navy-900/60" : "text-white/60")}>
          <span className={light ? "text-gold-deep" : "text-gold-light"}>01</span> Selected work · swipe
        </p>
      </div>
      <div ref={emblaRef} className="mt-8 overflow-hidden" role="region" aria-roledescription="carousel" aria-label="Projects">
        <div className="flex touch-pan-y">
          {projects.map((proj, i) => (
            <div key={proj.slug} className="min-w-0 shrink-0 basis-[82%] px-2" aria-label={`${i + 1} of ${N}: ${proj.title}`}>
              <div data-tw className="will-change-transform" onClick={() => i === sel && onOpen(proj)}>
                <Card p={proj} priority={i === 0} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container-x mt-8">
        <AnimatePresence mode="wait">
          <motion.div key={p.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Info p={p} i={sel} light={light} ink={sc.ink} />
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => embla?.scrollPrev()} aria-label="Previous project" className={cn("grid h-12 w-12 place-items-center rounded-full border", light ? "border-navy-900/20 text-navy-900" : "border-white/25 text-white")}>
            <ArrowLeft size={19} />
          </button>
          <button type="button" onClick={() => embla?.scrollNext()} aria-label="Next project" className="grid h-12 w-12 place-items-center rounded-full text-navy-900" style={{ background: p.brand.accent }}>
            <ArrowRight size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const wide = useMediaQuery("(min-width: 768px)", true);
  const reduce = usePrefersReducedMotion();
  const router = useRouter();
  const open = useCallback((p: Project) => router.push(`/work/${p.slug}`), [router]);
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, [wide, reduce]);

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative z-0"
    >
      <h2 id="projects-title" className="sr-only">
        Selected work
      </h2>
      {!reduce ? <ScrollCarousel onOpen={open} dark={dark} /> : <SwipeCarousel onOpen={open} dark={dark} />}

    </section>
  );
}
