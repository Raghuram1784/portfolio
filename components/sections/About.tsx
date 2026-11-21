"use client";

import { motion } from "motion/react";
import { about } from "@/content/about";
import { experience } from "@/content/experience";
import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * About — an editorial spread. A large statement on the left, the facts set
 * like a colophon on the right. No photograph for now (to be added later).
 */
export function About() {
  const now = experience.filter((e) => e.current);
  const words = `I'm ${site.fullName}, a final-year Computer Science (Honors) student at KL University who designs and engineers intelligent products across web, mobile and AI.`.split(" ");
  const nameWords = new Set(site.fullName.split(" "));

  return (
    <section id="about" aria-labelledby="about-title" className="relative bg-ivory py-28 text-navy-900 lg:py-40 dark:bg-navy-950 dark:text-beige">
      <div className="container-x">
        <div className="flex items-center justify-between border-b border-navy-900/15 pb-6 dark:border-beige/15">
          <p className="label !text-navy-900/60 dark:!text-beige/60">
            <b className="!text-gold-deep dark:!text-gold-light">02</b> About
          </p>
          <p className="label !text-navy-900/60 dark:!text-beige/60">{site.location}</p>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-12">
          <h2 id="about-title" className="text-[clamp(2.2rem,4.4vw,4.4rem)] leading-[1.05] font-medium tracking-[-0.035em] !text-navy-900 lg:col-span-8 dark:!text-beige">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.15 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "0px 0px -20% 0px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.025 }}
                className={nameWords.has(w.replace(/[—,]/g, "")) ? "serif-it font-normal text-gold-deep dark:text-gold-light" : ""}
              >
                {w}{" "}
              </motion.span>
            ))}
          </h2>

          <dl className="space-y-0 self-end lg:col-span-4">
            {[
              { k: "Education", v: about.education.school, d: `${about.education.degree} · ${about.education.specialization}` },
              { k: "CGPA", v: about.education.cgpa, d: `Graduating ${about.education.graduation}` },
              ...now.map((e) => ({ k: "Now", v: e.role, d: e.org })),
              { k: "Previously", v: "Research internships", d: "IIT Tirupati · NIT Warangal" },
            ].map((row, i) => (
              <Reveal key={i} delay={i * 0.06} className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-navy-900/15 py-5 dark:border-beige/15">
                <dt className="font-mono text-[0.76rem] tracking-[0.08em] text-navy-900/55 uppercase dark:text-beige/55">{row.k}</dt>
                <dd>
                  <p className="text-[1.15rem] font-semibold tracking-[-0.01em]">{row.v}</p>
                  <p className="mt-0.5 text-[0.95rem] text-navy-900/65 dark:text-beige/65">{row.d}</p>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <div className="mt-20 grid gap-10 border-t border-navy-900/15 pt-10 lg:grid-cols-12 dark:border-beige/15">
          {about.intro.map((p, i) => (
            <Reveal key={i} delay={i * 0.08} className="lg:col-span-4">
              <p className="text-[1.08rem] leading-relaxed text-navy-900/80 dark:text-beige/80">{p}</p>
            </Reveal>
          ))}
          <Reveal delay={0.16} className="lg:col-span-4">
            <p className="font-mono text-[0.76rem] tracking-[0.08em] text-navy-900/55 uppercase dark:text-beige/55">What I love building</p>
            <ul className="mt-3 space-y-1.5 text-[1.08rem]">
              {about.interests.map((it) => (
                <li key={it} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {it}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
