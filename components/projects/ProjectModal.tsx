"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, ExternalLink, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/cn";
import { ProjectArt, Provenance } from "./ProjectStage";

/** Full project overlay with a keyboard-navigable screenshot gallery. */
export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const n = project?.shots.length ?? 0;

  useEffect(() => setI(0), [project]);
  const go = useCallback((d: number) => n && setI((v) => (v + d + n) % n), [n]);

  useEffect(() => {
    if (!project) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [project, onClose, go]);

  const shot = project?.shots[i];

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="fixed inset-0 z-[90] flex items-stretch justify-center sm:p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label="Close project details" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-lapis-950/75 backdrop-blur-md" />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ y: 50, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 30 }}
            className="relative grid w-full max-w-[1400px] overflow-y-auto bg-bg shadow-[var(--shadow-lift)] sm:rounded-[2rem] lg:grid-cols-[1.55fr_1fr] lg:overflow-hidden"
          >
            {/* gallery */}
            <div className="relative flex min-h-[48svh] flex-col bg-lapis-900 p-4 sm:p-6 lg:min-h-0">
              {shot ? (
                <>
                  <div className="relative flex-1 overflow-hidden rounded-2xl">
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.div
                        key={shot.src}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                      >
                        <Image src={shot.src} alt={shot.alt} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-contain" />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <p className="mt-3 flex items-center justify-center gap-3 text-center text-sm text-parchment/75">
                    <Provenance />
                    {shot.alt}
                  </p>
                  {n > 1 && (
                    <div className="mt-3 flex items-center gap-3">
                      <button type="button" onClick={() => go(-1)} aria-label="Previous screenshot" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-parchment/25 text-parchment transition-colors hover:border-gilt-300 hover:text-gilt-300">
                        <ArrowLeft size={17} />
                      </button>
                      <div className="flex flex-1 gap-2 overflow-x-auto py-1" role="tablist" aria-label="Screenshots">
                        {project.shots.map((s, k) => (
                          <button
                            key={s.src}
                            type="button"
                            role="tab"
                            aria-selected={k === i}
                            aria-label={`Screenshot ${k + 1}`}
                            onClick={() => setI(k)}
                            className={cn(
                              "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                              k === i ? "border-gilt-300 opacity-100" : "border-transparent opacity-50 hover:opacity-90",
                            )}
                          >
                            <Image src={s.src} alt="" fill sizes="80px" className="object-cover object-top" />
                          </button>
                        ))}
                      </div>
                      <button type="button" onClick={() => go(1)} aria-label="Next screenshot" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-parchment/25 text-parchment transition-colors hover:border-gilt-300 hover:text-gilt-300">
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <ProjectArt project={project} className="min-h-[40svh] flex-1" />
              )}
            </div>

            {/* details */}
            <div className="relative p-6 sm:p-10 lg:overflow-y-auto">
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-5 right-5 grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-transform hover:rotate-90 hover:border-gilt-500"
              >
                <X size={18} />
              </button>
              <p className="label">
                <b>{project.discipline}</b> {project.year}
              </p>
              <h3 id="project-modal-title" className="mt-4 pr-12 text-[clamp(2.2rem,4vw,3.4rem)] leading-none font-semibold">
                {project.title}
              </h3>
              <p className="serif-em mt-3 text-xl text-accent">{project.tagline}</p>
              <p className="mt-6 leading-relaxed text-text">{project.description}</p>
              {project.context && <p className="mt-4 border-l-2 border-gilt-500 pl-4 text-sm text-muted">{project.context}</p>}
              {project.status && <p className="mt-3 border-l-2 border-lapis-400 pl-4 text-sm text-muted">{project.status}</p>}
              {project.pipeline && (
                <ol className="mt-7 grid gap-2 sm:grid-cols-2">
                  {project.pipeline.map((p, k) => (
                    <li key={p.label} className="rounded-xl border border-line p-3">
                      <span className="font-display text-xs font-semibold text-accent">0{k + 1}</span>
                      <p className="font-display font-semibold text-ink">{p.label}</p>
                      <p className="text-sm text-muted">{p.detail}</p>
                    </li>
                  ))}
                </ol>
              )}

              {project.features && (
                <ul className="mt-7 space-y-2.5">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-text">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lapis-700 text-gilt-200 dark:bg-gilt-300 dark:text-lapis-900">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-8 font-display text-[0.7rem] font-semibold tracking-[0.24em] text-muted uppercase">Built with</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>

              {(project.github || project.demo) && (
                <div className="mt-9 flex flex-wrap gap-3">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="shine inline-flex items-center gap-2 rounded-full bg-lapis-700 px-5 py-3 font-semibold text-ivory transition-colors hover:bg-lapis-800 dark:bg-gilt-300 dark:text-lapis-900 dark:hover:bg-gilt-200">
                      <GithubIcon size={18} /> Source on GitHub
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-gilt-500 px-5 py-3 font-semibold text-ink transition-colors hover:bg-gilt-200/40">
                      <ExternalLink size={17} /> Live demo
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
