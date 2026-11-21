"use client";

import { navItems, site } from "@/content/site";
import { scrollToSection } from "@/lib/gsap";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Logo } from "@/components/ui/Logo";
import { OPEN_TERMINAL } from "@/components/layout/Terminal";

export function Footer() {
  return (
    <footer className="navy relative overflow-hidden border-t border-ivory/10">
      <div className="container-x py-12">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] md:items-start">
          <div className="flex min-w-0 items-start gap-4">
            <Logo size={48} />
            <div className="min-w-0">
              <p className="text-[1.1rem] leading-snug font-semibold">{site.fullName}</p>
              <p className="mt-1 font-mono text-[0.76rem] leading-relaxed tracking-wide text-ivory/55">Software · AI/ML · Full-Stack · Mobile</p>
              <p className="font-mono text-[0.76rem] tracking-wide text-ivory/55">{site.location}</p>
            </div>
          </div>
          <nav aria-label="Footer" className="min-w-0">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[0.95rem] text-ivory/70">
              {navItems.slice(1).map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(n.id);
                    }}
                    className="whitespace-nowrap transition-colors hover:text-gold-light"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a href={site.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 transition-colors hover:border-gold">
              <GithubIcon size={18} />
            </a>
            <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 transition-colors hover:border-gold">
              <LinkedinIcon size={17} />
            </a>
          </div>
        </div>
      </div>
      <p aria-hidden="true" className="pointer-events-none -mb-[0.18em] text-center text-[20vw] leading-none font-semibold tracking-[-0.06em] text-ivory/[0.06] select-none">
        {site.name}
      </p>
      <p className="container-x border-t border-ivory/10 py-5 text-center font-mono text-[0.74rem] tracking-wide text-ivory/50">
        © {new Date().getFullYear()} {site.shortName} · Designed &amp; engineered in Hyderabad ·{" "}
        <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_TERMINAL))} className="text-gold-light underline decoration-gold/40 underline-offset-4 hover:decoration-gold">
          press <kbd className="rounded border border-ivory/25 px-1.5 py-0.5 text-ivory/80">`</kbd> for the terminal
        </button>
      </p>
    </footer>
  );
}
