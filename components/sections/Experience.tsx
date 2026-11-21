"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { experience, type Experience as Exp } from "@/content/experience";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const initials = (org: string) => (/^(IIT|NIT)\b/.test(org) ? org.split(" ")[0] : org.split(" ").filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join(""));
const yearOf = (period: string) => period.match(/\d{4}/)?.[0] ?? "Now";

/**
 * Experience — a clean vertical timeline on navy. A gold line fills as you
 * scroll (every screen size); each milestone lights up and its card slides in
 * from its side. Desktop alternates left/right; phones stack on one side.
 */
export function Experience() {
  const root = useRef<HTMLElement>(null);
  const [lit, setLit] = useState<number[]>([]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        setLit(experience.map((_, i) => i));
        return;
      }
      gsap.fromTo(q("[data-fill]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: q("[data-list]")[0], start: "top 65%", end: "bottom 60%", scrub: 0.5 } });
      (q("[data-row]") as HTMLElement[]).forEach((row, i) => {
        const card = row.querySelector("[data-card]");
        const year = row.querySelector("[data-year]");
        const fromLeft = window.innerWidth >= 768 && i % 2 === 0;
        gsap.fromTo(card, { x: fromLeft ? -70 : 70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 80%", toggleActions: "play none none reverse" } });
        if (year) gsap.fromTo(year, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 80%", toggleActions: "play none none reverse" } });
        ScrollTrigger.create({
          trigger: row,
          start: "top 62%",
          onEnter: () => setLit((v) => (v.includes(i) ? v : [...v, i])),
          onLeaveBack: () => setLit((v) => v.filter((x) => x !== i)),
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="experience" ref={root} aria-labelledby="experience-title" className="midnight relative overflow-hidden py-24 md:py-36">
      <div className="container-x relative">
        <div className="text-center">
          <p className="label justify-center !text-ivory/60">
            <b className="!text-gold-light">03</b> Experience
          </p>
          <h2 id="experience-title" className="mt-4 text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.95] font-semibold">
            The <span className="serif-it font-normal text-gold-light">journey</span> so far.
          </h2>
        </div>

        <ol data-list className="relative mx-auto mt-16 max-w-5xl md:mt-24">
          {/* the line */}
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-[27px] w-px bg-ivory/12 md:left-1/2 md:-translate-x-1/2">
            <span data-fill className="absolute inset-0 origin-top bg-gradient-to-b from-gold-light via-gold to-gold/40" />
          </span>

          {experience.map((e, i) => {
            const right = i % 2 === 1;
            const on = lit.includes(i);
            return (
              <li key={e.org} data-row className="relative grid grid-cols-[56px_1fr] gap-x-5 pb-14 last:pb-0 md:grid-cols-[1fr_72px_1fr] md:gap-x-6 md:pb-20">
                {/* year (desktop, opposite side) */}
                <div data-year className={cn("hidden items-start pt-3 md:flex", right ? "md:order-1 md:justify-end" : "md:order-3 md:justify-start")}>
                  <span className={cn("font-serif text-[clamp(3rem,5vw,4.6rem)] leading-none italic transition-colors duration-500", on ? "text-gold-light" : "text-ivory/15")}>{yearOf(e.period)}</span>
                </div>
                {/* node */}
                <div className="relative flex justify-center md:order-2">
                  <span className={cn("relative z-10 grid h-14 w-14 place-items-center rounded-2xl border font-serif text-[1.25rem] italic transition-all duration-500", on ? "border-gold bg-gold text-navy-900 shadow-[0_0_0_8px_rgba(199,162,97,0.15)]" : "border-ivory/20 bg-[#0c1628] text-ivory/70")}>
                    {initials(e.org)}
                  </span>
                </div>
                {/* card */}
                <div data-card className={cn(right ? "md:order-3" : "md:order-1")}>
                  <Card e={e} index={i} on={on} alignRight={!right} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Card({ e, index, on, alignRight }: { e: Exp; index: number; on: boolean; alignRight: boolean }) {
  const [open, setOpen] = useState(false);
  const id = `xp-${index}`;
  return (
    <article className={cn("rounded-2xl border p-6 transition-colors duration-500 md:p-7", on ? "border-gold/45 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]" : "border-ivory/10 bg-white/[0.025]", alignRight && "md:text-right")}>
      <p className="font-mono text-[0.78rem] tracking-[0.08em] text-gold-light uppercase">{e.period}</p>
      <h3 className="mt-3 text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.08] font-semibold">{e.org}</h3>
      <p className="serif-it mt-1.5 text-[1.3rem] leading-snug text-ivory/85">{e.role}</p>
      <p className="mt-3 font-mono text-[0.76rem] tracking-wide text-ivory/55">
        {e.type}
        {e.location ? ` · ${e.location}` : ""}
        {e.current ? " · Current" : ""}
      </p>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id} className="mt-4 inline-flex items-center gap-1.5 text-[0.92rem] font-medium text-ivory underline decoration-gold/70 underline-offset-[6px]">
        Focus areas <ChevronDown size={15} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul id={id} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={cn("flex flex-wrap gap-2 overflow-hidden pt-3", alignRight && "md:justify-end")}>
            {e.focus.map((f) => (
              <li key={f} className="rounded-full border border-ivory/20 px-3 py-1 text-[0.84rem] text-ivory/85">
                {f}
              </li>
            ))}
            {e.details.map((d) => (
              <li key={d} className="w-full text-ivory/80">
                {d}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </article>
  );
}
