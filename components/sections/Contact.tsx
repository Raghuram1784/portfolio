"use client";

import { ArrowUpRight, Download, Mail } from "lucide-react";
import { useRef } from "react";
import { site } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

const LINE_1 = "Let's build something";
const LINE_2 = "great together.";

/**
 * Contact finale — navy. The headline is lit word by word by scroll,
 * and a thin gold rule draws across as the invitation settles.
 */
export function Contact({ resumeAvailable }: { resumeAvailable: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(q("[data-w]"), { opacity: 0.12, y: 30 }, { opacity: 1, y: 0, stagger: 0.12, ease: "none", scrollTrigger: { trigger: q("[data-head]")[0], start: "top 85%", end: "bottom 45%", scrub: 0.6 } });
        gsap.fromTo(q("[data-rule]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: q("[data-head]")[0], start: "top 60%", end: "bottom 30%", scrub: 0.6 } });
      });
    },
    { scope: root },
  );

  const words = (s: string, gold = false) =>
    s.split(" ").map((w, i) => (
      <span key={`${w}${i}`} data-w className={`inline-block ${gold ? "serif-it font-normal text-gold-light" : ""}`}>
        {w}&nbsp;
      </span>
    ));

  return (
    <section id="contact" ref={root} aria-labelledby="contact-title" className="navy relative overflow-hidden">
      <div className="container-x py-28 lg:py-40">
        <p className="label !text-ivory/60">
          <b className="!text-gold-light">06</b> Contact
        </p>
        <h2 id="contact-title" data-head className="mt-8 max-w-[18ch] text-[clamp(3.2rem,9vw,9rem)] leading-[0.92] font-semibold tracking-[-0.055em]">
          {words(LINE_1)}
          {words(LINE_2, true)}
        </h2>
        <div data-rule className="mt-14 h-px origin-left bg-gold" />
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <p className="max-w-md text-[1.2rem] leading-relaxed text-ivory/80 lg:col-span-5">
            Open to meaningful opportunities, collaborations, and innovative projects.
          </p>
          <div className="flex flex-wrap gap-3 lg:col-span-7 lg:justify-end">
            {site.email && (
              <MagneticButton variant="gold" href={`mailto:${site.email}`}>
                <Mail size={18} /> {site.email}
              </MagneticButton>
            )}
            <MagneticButton variant={site.email ? "ghost-light" : "gold"} href={site.socials.linkedin} external>
              <LinkedinIcon size={17} /> Connect on LinkedIn <ArrowUpRight size={16} />
            </MagneticButton>
            <MagneticButton variant="ghost-light" href={site.socials.github} external>
              <GithubIcon size={18} /> GitHub
            </MagneticButton>
            {resumeAvailable && (
              <MagneticButton variant="ghost-light" href={site.resumePath} download>
                <Download size={18} /> Résumé
              </MagneticButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
