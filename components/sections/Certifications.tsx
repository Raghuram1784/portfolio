"use client";

import { ArrowUpRight } from "lucide-react";
import { achievements, credentials } from "@/content/certifications";
import { Reveal } from "@/components/ui/Reveal";

/** Certifications & achievements — a ledger on beige with a navy events panel. */
export function Certifications() {
  const hack = achievements.find((a) => a.kind === "hackathon");
  const community = achievements.find((a) => a.kind === "community");
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="relative bg-bg-soft py-28 lg:py-36">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="label">
              <b>05</b> Credentials
            </p>
            <h2 id="certifications-title" className="mt-5 text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] font-semibold tracking-[-0.045em]">
              Proof of <span className="serif-it font-normal text-accent">practice.</span>
            </h2>
            <p className="mt-6 max-w-sm text-[1.08rem] leading-relaxed text-muted">Industry certifications, build events and community work.</p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ul className="border-t border-line">
            {credentials.map((c, i) => {
              const body = (
                <div className="grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-7">
                  <span className="font-mono text-[0.8rem] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-[clamp(1.35rem,2.2vw,1.9rem)] leading-tight font-semibold tracking-[-0.025em] text-ink transition-transform duration-500 group-hover:translate-x-2">{c.title}</p>
                    <p className="mt-1 font-mono text-[0.78rem] tracking-wide text-muted">
                      {c.issuer}
                      {c.date ? ` · ${c.date}` : ""}
                    </p>
                  </div>
                  {c.url ? <ArrowUpRight size={20} className="text-accent" /> : <span />}
                </div>
              );
              return (
                <Reveal as="li" key={c.title} delay={i * 0.05} className="group border-b border-line">
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" aria-label={`Verify ${c.title}`}>
                      {body}
                    </a>
                  ) : (
                    body
                  )}
                </Reveal>
              );
            })}
          </ul>

          <div className="mt-14 grid gap-6 md:grid-cols-5">
            {hack && (
              <Reveal className="navy rounded-[16px] p-8 md:col-span-3">
                <p className="font-mono text-[0.76rem] tracking-[0.08em] text-gold-light uppercase">Events</p>
                <h3 className="mt-3 text-[1.9rem] leading-tight font-semibold tracking-[-0.03em]">{hack.title}</h3>
                <p className="mt-2 text-ivory/70">{hack.description}</p>
                <ul className="mt-6 space-y-4">
                  {hack.items?.map((it) => (
                    <li key={it.name} className="border-t border-ivory/15 pt-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-[1.15rem] font-semibold">{it.name}</p>
                        {it.year && <span className="font-mono text-[0.8rem] text-gold-light">{it.year}</span>}
                      </div>
                      {it.result && <p className="serif-it text-[1.15rem] text-ivory/80">{it.result}</p>}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            {community && (
              <Reveal delay={0.08} className="rounded-[16px] border border-line p-8 md:col-span-2">
                <p className="font-mono text-[0.76rem] tracking-[0.08em] text-accent uppercase">Community</p>
                <h3 className="mt-3 text-[1.6rem] leading-tight font-semibold tracking-[-0.03em]">{community.title}</h3>
                <p className="mt-2 text-text">{community.description}</p>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
