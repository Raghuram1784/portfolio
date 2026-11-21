"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, Check, ExternalLink, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Project, Shot } from "@/content/projects";
import { MacWindow } from "@/components/ui/MacWindow";
import { AppIcon } from "@/components/ui/TechIcon";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { TerminalButton } from "@/components/ui/TerminalButton";
import { Provenance } from "@/components/projects/ProjectStage";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A full case-study page for one project: brand-coloured hero with the cover
 * tilting into place, overview, an animated "how it works" flow, features,
 * every real screenshot in a macOS window, the stack as app icons, and a
 * hand-off to the next project.
 */
export function CaseStudy({ project: p, index, total, next }: { project: Project; index: number; total: number; next: Project }) {
  const [zoom, setZoom] = useState<Shot | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [p.slug]); // always open a case study at its top
  return (
    <>
      <CaseNav />
      <main id="main">
        <Hero p={p} index={index} total={total} />
        <Overview p={p} />
        {p.pipeline && <Flow p={p} />}
        {p.features && <Features p={p} />}
        <Screens p={p} onZoom={setZoom} />
        <Stack p={p} />
        <NextProject p={next} />
      </main>
      <Lightbox shot={zoom} onClose={() => setZoom(null)} />
    </>
  );
}

/* ------------------------------------------------------------------ */

function CaseNav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-3 sm:pt-4">
      <nav aria-label="Case study" className="pointer-events-auto flex w-full max-w-[1240px] items-center justify-between gap-3 rounded-full border border-white/15 bg-black/30 py-2 pr-2 pl-2 text-white backdrop-blur-xl sm:pl-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Raghuram, home">
          <Logo size={36} />
          <span className="hidden font-display text-[1rem] font-semibold tracking-[0.18em] uppercase sm:block">Raghuram</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/#projects" className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-[0.9rem] font-medium transition-colors hover:border-white/60">
            <ArrowLeft size={16} /> All work
          </Link>
          <TerminalButton className="border-white/20 hover:border-white/60" />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

function Label({ n, children, className }: { n: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("label", className)}>
      <b>{n}</b> {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */

function Hero({ p, index, total }: { p: Project; index: number; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const rot = useSpring(useTransform(scrollYProgress, [0, 0.45], [22, 0]), { stiffness: 120, damping: 24 });
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.45], [0.86, 1]), { stiffness: 120, damping: 24 });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const { bg, bg2, accent, ink } = p.brand;

  return (
    <section ref={ref} aria-labelledby="case-title" className="relative overflow-hidden pt-36 pb-16 sm:pt-44" style={{ background: `radial-gradient(70% 60% at 70% 20%, ${bg2}, transparent 70%), ${bg}`, color: ink }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
      <div className="container-x relative">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="font-mono text-[0.8rem] tracking-[0.12em] uppercase" style={{ color: accent }}>
          Case study {pad(index + 1)} / {pad(total)} · {p.discipline}
          {p.year ? ` · ${p.year}` : ""}
        </motion.p>
        <h1 id="case-title" className="mt-5 overflow-hidden pb-[0.08em] font-display text-[clamp(3.2rem,11vw,10rem)] leading-[0.9] font-semibold tracking-[-0.04em]">
          <span className="sr-only">{p.title}</span>
          <span aria-hidden="true" className="inline-block">
            {p.title.split("").map((ch, i) => (
              <motion.span key={i} className="inline-block whitespace-pre" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.035 }}>
                {ch}
              </motion.span>
            ))}
          </span>
        </h1>
        <div className="mt-6 grid gap-8 md:grid-cols-12 md:items-end">
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.5 }} className="serif-it text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.15] md:col-span-7" style={{ color: accent }}>
            {p.tagline}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.65 }} className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            {p.github && (
              <a href={p.github} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full px-5 font-semibold transition-transform hover:-translate-y-0.5" style={{ background: accent, color: bg }}>
                <GithubIcon size={18} /> Source code
              </a>
            )}
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-5 font-semibold transition-colors hover:border-white/70">
                <ExternalLink size={17} /> Live demo
              </a>
            )}
          </motion.div>
        </div>

        {/* the cover tilts up into place as you scroll */}
        <div className="mt-14 [perspective:1600px] sm:mt-20">
          <motion.div style={{ rotateX: rot, scale, y }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="origin-top will-change-transform">
            <MacWindow title={p.title}>
              {p.cover && <Image src={p.cover} alt={`${p.title}: designed cover with real screenshots`} width={1600} height={1000} priority className="block h-auto w-full" />}
            </MacWindow>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Overview({ p }: { p: Project }) {
  const facts = [
    { k: "Discipline", v: p.discipline },
    p.year && { k: "Year", v: p.year },
    { k: "Stack", v: `${p.tech.length} tools` },
    { k: "Screens", v: `${p.shots.length} real screenshots` },
  ].filter(Boolean) as { k: string; v: string }[];
  return (
    <section aria-labelledby="ov-title" className="bg-bg py-24 md:py-32">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Label n="01">Overview</Label>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-1">
            {facts.map((f) => (
              <div key={f.k} className="border-t border-line pt-3">
                <dt className="font-mono text-[0.72rem] tracking-[0.12em] text-muted uppercase">{f.k}</dt>
                <dd className="mt-1 text-[1.05rem] font-medium text-ink">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.9, ease }} className="md:col-span-8">
          <h2 id="ov-title" className="sr-only">
            Overview
          </h2>
          <p className="text-[clamp(1.35rem,2.2vw,2rem)] leading-[1.35] font-medium text-ink">{p.description}</p>
          {(p.context || p.status) && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {p.context && (
                <p className="rounded-2xl border border-line bg-surface p-5 text-[0.98rem] leading-relaxed text-text">
                  <span className="mb-2 block font-mono text-[0.7rem] tracking-[0.12em] text-accent uppercase">Context</span>
                  {p.context}
                </p>
              )}
              {p.status && (
                <p className="rounded-2xl border border-line bg-surface p-5 text-[0.98rem] leading-relaxed text-text">
                  <span className="mb-2 block font-mono text-[0.7rem] tracking-[0.12em] text-accent uppercase">Status</span>
                  {p.status}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/** The pipeline as a flow whose connecting line draws itself while you scroll. */
function Flow({ p }: { p: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const draw = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const steps = p.pipeline!;
  return (
    <section aria-labelledby="flow-title" className="navy relative overflow-hidden py-24 text-ivory md:py-32">
      <div className="container-x">
        <Label n="02" className="!text-ivory/60">
          How it works
        </Label>
        <h2 id="flow-title" className="mt-4 max-w-3xl text-[clamp(2.2rem,4.6vw,4rem)] leading-[1] font-semibold">
          From input to <span className="serif-it font-normal text-gold-light">outcome.</span>
        </h2>

        <div ref={ref} className="relative mt-16">
          {/* desktop: horizontal line · phones: vertical line */}
          <div aria-hidden="true" className="absolute top-7 right-[10%] left-[10%] hidden h-px bg-ivory/15 lg:block">
            <motion.div style={{ scaleX: draw }} className="h-px origin-left bg-gradient-to-r from-gold-light via-gold to-gold-light" />
          </div>
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-7 w-px bg-ivory/15 lg:hidden">
            <motion.div style={{ scaleY: draw }} className="h-full w-px origin-top bg-gradient-to-b from-gold-light via-gold to-gold-light" />
          </div>

          <ol className="relative grid gap-10 lg:gap-6 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ ["--n" as string]: steps.length }}>
            {steps.map((s, i) => (
              <FlowStep key={s.label} i={i} n={steps.length} label={s.label} detail={s.detail} progress={draw} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function FlowStep({ i, n, label, detail, progress }: { i: number; n: number; label: string; detail: string; progress: ReturnType<typeof useSpring> }) {
  const at = n > 1 ? i / (n - 1) : 0;
  // each node lights up gold as the drawing line reaches it
  const bg = useTransform(progress, (v: number) => (v >= at - 0.02 ? "#c7a261" : "#0c1628"));
  const color = useTransform(progress, (v: number) => (v >= at - 0.02 ? "#111f36" : "rgba(250,245,236,0.7)"));
  return (
    <motion.li initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.7, ease, delay: i * 0.08 }} className="relative grid grid-cols-[56px_1fr] items-start gap-5 lg:grid-cols-1 lg:justify-items-center lg:text-center">
      <motion.span style={{ background: bg, color }} className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl border border-gold/50 font-mono text-[0.95rem] font-medium ">
        {pad(i + 1)}
      </motion.span>
      <div>
        <p className="text-[1.35rem] leading-tight font-semibold">{label}</p>
        <p className="mt-1.5 text-[0.98rem] leading-relaxed text-ivory/65">{detail}</p>
      </div>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */

function Features({ p }: { p: Project }) {
  return (
    <section aria-labelledby="feat-title" className="bg-bg py-24 md:py-32">
      <div className="container-x">
        <Label n={p.pipeline ? "03" : "02"}>What it does</Label>
        <h2 id="feat-title" className="mt-4 text-[clamp(2.2rem,4.6vw,4rem)] leading-[1] font-semibold">
          Key <span className="serif-it font-normal text-accent">features.</span>
        </h2>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {p.features!.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.7, ease, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-6"
            >
              <span className="font-mono text-[0.72rem] tracking-[0.12em] text-muted">{pad(i + 1)}</span>
              <span className="absolute top-5 right-5 grid h-8 w-8 place-items-center rounded-full bg-navy-900 text-gold-light dark:bg-gold dark:text-navy-900">
                <Check size={15} strokeWidth={2.6} />
              </span>
              <p className="mt-6 pr-6 text-[1.15rem] leading-snug font-medium text-ink">{f}</p>
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Screens({ p, onZoom }: { p: Project; onZoom: (s: Shot) => void }) {
  const n = (p.pipeline ? 1 : 0) + (p.features ? 1 : 0) + 2;
  return (
    <section aria-labelledby="screens-title" className="relative overflow-hidden py-24 md:py-32" style={{ background: p.brand.bg, color: p.brand.ink }}>
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase" style={{ color: p.brand.accent }}>
              {pad(n)} Inside the product
            </p>
            <h2 id="screens-title" className="mt-4 text-[clamp(2.2rem,4.6vw,4rem)] leading-[1] font-semibold">
              The <span className="serif-it font-normal" style={{ color: p.brand.accent }}>screens.</span>
            </h2>
          </div>
          <Provenance />
        </div>

        <div className="mt-16 space-y-20 md:space-y-28">
          {p.shots.map((s, i) => (
            <ScreenRow key={s.src} s={s} i={i} p={p} onZoom={onZoom} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ScreenRow({ s, i, p, onZoom }: { s: Shot; i: number; p: Project; onZoom: (s: Shot) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1]);
  const flip = i % 2 === 1;
  const tall = s.h / s.w > 0.85; // portrait-ish shots sit narrower
  return (
    <div ref={ref} className={cn("grid items-center gap-8 lg:grid-cols-12", flip && "lg:[direction:rtl]")}>
      <motion.button
        type="button"
        onClick={() => onZoom(s)}
        style={{ scale, opacity }}
        data-cursor="Zoom"
        aria-label={`Enlarge screenshot: ${s.alt}`}
        className={cn("block text-left [direction:ltr]", tall ? "mx-auto w-full max-w-[560px] lg:col-span-6" : "lg:col-span-8")}
      >
        <MacWindow title={`${p.title.toLowerCase().replace(/\s+/g, "-")} · ${pad(i + 1)}`}>
          <Image src={s.src} alt={s.alt} width={s.w} height={s.h} loading="eager" sizes="(max-width: 1024px) 92vw, 62vw" className="block h-auto w-full" />
        </MacWindow>
      </motion.button>
      <div className={cn("[direction:ltr]", tall ? "lg:col-span-6" : "lg:col-span-4")}>
        <p className="font-display text-[clamp(3rem,6vw,5rem)] leading-none font-semibold opacity-20">{pad(i + 1)}</p>
        <p className="mt-3 text-[clamp(1.25rem,1.8vw,1.6rem)] leading-snug font-medium">{s.alt}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Stack({ p }: { p: Project }) {
  return (
    <section aria-labelledby="stack-title" className="bg-bg py-24 md:py-32">
      <div className="container-x">
        <p className="label">
          <b>Stack</b> {p.tech.length} tools
        </p>
        <h2 id="stack-title" className="mt-4 text-[clamp(2.2rem,4.6vw,4rem)] leading-[1] font-semibold">
          Built <span className="serif-it font-normal text-accent">with.</span>
        </h2>
        <ul className="mt-14 grid grid-cols-3 gap-x-4 gap-y-9 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {p.tech.map((t, i) => (
            <motion.li
              key={t}
              initial={{ opacity: 0, scale: 0.6, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ type: "spring", stiffness: 340, damping: 22, delay: i * 0.03 }}
              whileHover={{ y: -6, scale: 1.06 }}
              className="flex flex-col items-center gap-2.5 text-center"
            >
              <AppIcon name={t} size={64} />
              <span className="max-w-[7.5rem] text-[0.86rem] leading-tight font-medium text-ink">{t}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function NextProject({ p }: { p: Project }) {
  return (
    <Link href={`/work/${p.slug}`} data-cursor="Next" className="group relative block overflow-hidden" style={{ background: p.brand.bg, color: p.brand.ink }}>
      <div aria-hidden="true" className="absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100" style={{ background: `radial-gradient(60% 80% at 80% 50%, ${p.brand.bg2}, transparent 70%)` }} />
      <div className="container-x relative grid items-center gap-10 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-6">
          <p className="font-mono text-[0.8rem] tracking-[0.12em] uppercase" style={{ color: p.brand.accent }}>
            Next case study
          </p>
          <p className="mt-4 font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] font-semibold tracking-[-0.04em]">{p.title}</p>
          <p className="serif-it mt-3 text-[clamp(1.2rem,1.8vw,1.6rem)]" style={{ color: p.brand.accent }}>
            {p.tagline}
          </p>
          <span className="mt-8 inline-flex h-12 items-center gap-2 rounded-full px-5 font-semibold transition-transform group-hover:translate-x-1" style={{ background: p.brand.accent, color: p.brand.bg }}>
            Read it <ArrowRight size={17} />
          </span>
        </div>
        <div className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 group-hover:rotate-[-1.5deg] md:col-span-6">
          <MacWindow title={p.title}>{p.cover && <Image src={p.cover} alt="" width={1600} height={1000} className="block h-auto w-full" />}</MacWindow>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */

function Lightbox({ shot, onClose }: { shot: Shot | null; onClose: () => void }) {
  useEffect(() => {
    if (!shot) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [shot, onClose]);
  return (
    <AnimatePresence>
      {shot && (
        <motion.div role="dialog" aria-modal="true" aria-label={shot.alt} className="fixed inset-0 z-[95] flex flex-col items-center justify-center gap-4 bg-[#050a14]/92 p-4 backdrop-blur-md sm:p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <button type="button" onClick={onClose} aria-label="Close" autoFocus className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition-transform hover:rotate-90">
            <X size={18} />
          </button>
          <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 260, damping: 28 }} className="relative h-full max-h-[82svh] w-full max-w-[1500px]">
            <Image src={shot.src} alt={shot.alt} fill sizes="100vw" className="object-contain" />
          </motion.div>
          <p className="flex items-center gap-3 text-center text-sm text-white/75">
            <Provenance /> {shot.alt}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
