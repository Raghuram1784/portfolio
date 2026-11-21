"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { BrainCircuit, Cloud, CodeXml, Database, LayoutTemplate, Server, Smartphone } from "lucide-react";
import { useRef, useState } from "react";
import { skillGroups, type SkillIcon } from "@/content/skills";
import { AppIcon } from "@/components/ui/TechIcon";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/hooks";

const icons: Record<SkillIcon, typeof CodeXml> = {
  code: CodeXml,
  layout: LayoutTemplate,
  mobile: Smartphone,
  server: Server,
  brain: BrainCircuit,
  database: Database,
  cloud: Cloud,
};
const ease = [0.22, 1, 0.36, 1] as const;

/** A dock icon that magnifies as the cursor approaches, like the macOS Dock. */
function DockItem({ mouseX, active, title, icon: Icon, onClick, small }: { mouseX: MotionValue<number>; active: boolean; title: string; icon: typeof CodeXml; onClick: () => void; small: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const dist = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : Infinity;
  });
  const size = useSpring(useTransform(dist, [-140, 0, 140], small ? [38, 38, 38] : [48, 76, 48]), { stiffness: 320, damping: 22, mass: 0.2 });
  return (
    <button ref={ref} type="button" onClick={onClick} aria-pressed={active} aria-label={`Show ${title}`} title={title} className="group relative flex flex-col items-center">
      <span className="pointer-events-none absolute -top-9 rounded-md bg-black/70 px-2 py-1 text-[0.72rem] whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">{title}</span>
      <motion.span
        style={{ width: size, height: size }}
        className={cn(
          "grid place-items-center rounded-[24%] shadow-[0_10px_20px_-8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]",
          active ? "bg-gradient-to-b from-gold-light to-gold text-navy-900" : "bg-gradient-to-b from-[#3a5b88] to-[#17294a] text-gold-light",
        )}
      >
        <Icon className="h-[46%] w-[46%]" strokeWidth={1.8} />
      </motion.span>
      <span className={cn("mt-1.5 h-1 w-1 rounded-full transition-opacity", active ? "bg-ivory opacity-90" : "opacity-0")} />
    </button>
  );
}

/**
 * Capabilities — presented as a macOS Launchpad: category tabs, real app-style
 * icons for every skill, and a magnifying Dock to switch categories.
 */
export function Skills() {
  const [cat, setCat] = useState(0);
  const mouseX = useMotionValue(Infinity);
  const g = skillGroups[cat];
  const small = !useMediaQuery("(min-width: 640px)", true);

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative bg-bg py-24 lg:py-36">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label">
              <b>04</b> Capabilities
            </p>
            <h2 id="skills-title" className="mt-4 text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.98] font-semibold">
              The <span className="serif-it font-normal text-accent">toolkit.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[1.05rem] leading-relaxed text-muted">Pick a folder or use the dock. Every icon is a tool I build with.</p>
        </div>

        {/* the Launchpad window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.9, ease }}
          className="mt-12 overflow-hidden rounded-[18px] shadow-[0_2px_6px_rgba(0,0,0,0.15),0_60px_120px_-40px_rgba(0,0,0,0.6)] ring-1 ring-black/10 dark:ring-white/10"
        >
          <div className="relative flex h-9 items-center gap-2 bg-[#1b1e25] px-4">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="absolute left-1/2 -translate-x-1/2 font-mono text-[0.74rem] text-white/55">Launchpad · Toolkit</span>
          </div>

          <div className="relative overflow-hidden px-4 pt-6 pb-4 sm:px-10 sm:pt-8">
            {/* wallpaper */}
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_70%_at_20%_10%,#365783,transparent_70%),radial-gradient(50%_60%_at_90%_90%,rgba(199,162,97,0.55),transparent_70%),linear-gradient(160deg,#203a64,#0b1424)]" />
            <div aria-hidden="true" className="absolute inset-0 backdrop-blur-[2px]" />

            {/* folder tabs */}
            <div role="tablist" aria-label="Skill categories" className="relative mx-auto flex w-fit max-w-full flex-wrap justify-center gap-1.5 rounded-3xl bg-white/10 p-1.5 backdrop-blur-md">
              {skillGroups.map((s, i) => (
                <button
                  key={s.title}
                  role="tab"
                  type="button"
                  aria-selected={i === cat}
                  onClick={() => setCat(i)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[0.85rem] font-medium whitespace-nowrap transition-colors sm:px-4",
                    i === cat ? "bg-white text-navy-900 shadow" : "text-white hover:bg-white/15",
                  )}
                >
                  {s.title}
                </button>
              ))}
            </div>

            {/* app grid */}
            <div className="relative mt-8 min-h-[260px] sm:mt-10 sm:min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.ul
                  key={g.title}
                  initial="hide"
                  animate="show"
                  exit="hide"
                  variants={{ show: { transition: { staggerChildren: 0.035 } }, hide: { transition: { staggerChildren: 0.015, staggerDirection: -1 } } }}
                  className="grid grid-cols-3 gap-x-3 gap-y-7 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
                >
                  {g.items.map((s) => (
                    <motion.li
                      key={s}
                      variants={{ hide: { opacity: 0, scale: 0.6, y: 16 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 380, damping: 24 } } }}
                      whileHover={{ y: -6, scale: 1.06 }}
                      className="flex flex-col items-center gap-2.5 text-center"
                    >
                      <span className="sm:hidden">
                        <AppIcon name={s} size={56} />
                      </span>
                      <span className="hidden sm:block lg:hidden">
                        <AppIcon name={s} size={68} />
                      </span>
                      <span className="hidden lg:block">
                        <AppIcon name={s} size={80} />
                      </span>
                      <span className="max-w-[7.5rem] text-[0.82rem] leading-tight font-medium text-white drop-shadow sm:text-[0.88rem]">{s}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>

            {/* the dock */}
            <div
              onMouseMove={(e) => mouseX.set(e.clientX)}
              onMouseLeave={() => mouseX.set(Infinity)}
              className="relative mx-auto mt-8 flex h-[60px] w-fit max-w-full items-end gap-1.5 overflow-x-auto sm:h-[88px] rounded-2xl border border-white/15 bg-white/10 px-3 pb-1.5 backdrop-blur-xl [scrollbar-width:none] sm:gap-3 sm:px-4"
            >
              {skillGroups.map((s, i) => (
                <DockItem key={s.title} mouseX={mouseX} active={i === cat} title={s.title} icon={icons[s.icon]} onClick={() => setCat(i)} small={small} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
