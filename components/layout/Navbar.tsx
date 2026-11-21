"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems, site, type SectionId } from "@/content/site";
import { scrollToSection } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "@/components/ui/Logo";

export function Navbar({ resumeAvailable }: { resumeAvailable: boolean }) {
  const [active, setActive] = useState<SectionId>("home");
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setCompact(v > 40));

  // Active-section tracking
  useEffect(() => {
    const els = navItems.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id as SectionId);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-3 sm:pt-4">
        <motion.nav
          aria-label="Primary"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className={cn(
            "pointer-events-auto flex w-full items-center justify-between gap-3 rounded-full border border-line backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            compact
              ? "max-w-[1080px] bg-surface/85 py-1.5 pl-4 pr-1.5 shadow-[var(--shadow-soft)]"
              : "max-w-[1240px] bg-surface/50 py-2.5 pl-5 pr-2.5",
          )}
        >
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go("home");
            }}
            className="flex items-center gap-2 text-ink"
            aria-label={`${site.name}, back to top`}
          >
            <Logo size={38} />
            <span className="hidden font-display text-[1.05rem] font-semibold tracking-[0.18em] uppercase sm:block">
              {site.name}
            </span>
          </a>

          <ul className="hidden items-center gap-0.5 xl:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id);
                  }}
                  aria-current={active === item.id ? "true" : undefined}
                  className={cn(
                    "nav-link relative block rounded-full px-3.5 py-2 font-display text-[0.86rem] font-medium tracking-wide transition-colors duration-300",
                    active === item.id ? "text-ivory dark:text-lapis-800" : "text-text hover:text-ink",
                  )}
                >
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-lapis-700 dark:bg-gilt-300"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {resumeAvailable && (
              <a
                href={site.resumePath}
                download
                className="hidden items-center gap-2 rounded-full bg-lapis-700 px-4 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-lapis-800 sm:inline-flex dark:bg-gilt-300 dark:text-lapis-800 dark:hover:bg-gilt-200"
              >
                <Download size={16} /> Resume
              </a>
            )}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid h-10 w-10 place-items-center rounded-full bg-lapis-700 text-ivory xl:hidden dark:bg-gilt-300 dark:text-lapis-800"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "x" : "m"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {open ? <X size={18} /> : <Menu size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 36px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lapis fixed inset-0 z-[55] flex flex-col justify-between px-6 pt-28 pb-10 xl:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.id);
                    }}
                    className={cn(
                      "flex items-baseline gap-4 py-2 font-serif text-[clamp(2rem,8vw,3rem)] leading-tight",
                      active === item.id ? "text-gilt-300" : "text-ivory",
                    )}
                  >
                    <span className="font-sans text-xs font-bold tracking-widest text-gilt-300/80">0{i + 1}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            {resumeAvailable && (
              <motion.a
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                href={site.resumePath}
                download
                className="inline-flex w-fit items-center gap-2 rounded-full bg-gilt-200 px-6 py-3.5 font-semibold text-lapis-800"
              >
                <Download size={18} /> Download Resume
              </motion.a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
