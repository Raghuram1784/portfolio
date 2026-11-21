"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { about } from "@/content/about";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { navItems, site } from "@/content/site";
import { skillGroups } from "@/content/skills";
import { scrollToSection } from "@/lib/gsap";

/** Anything can open the terminal by dispatching this event (e.g. the footer hint). */
export const OPEN_TERMINAL = "rr:terminal";

type Line = { id: number; node: ReactNode };

const G = ({ children }: { children: ReactNode }) => <span className="text-[#e6c990]">{children}</span>; // gold
const B = ({ children }: { children: ReactNode }) => <span className="text-[#8fb4ff]">{children}</span>; // blue
const D = ({ children }: { children: ReactNode }) => <span className="text-white/45">{children}</span>; // dim
const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#8fb4ff] underline decoration-white/25 underline-offset-4 hover:decoration-[#8fb4ff]">
    {children}
  </a>
);

const SECTIONS = navItems.map((n) => n.id) as string[];
const COMMANDS = ["help", "whoami", "about", "projects", "open", "experience", "skills", "contact", "github", "linkedin", "resume", "goto", "theme", "neofetch", "ls", "cat", "echo", "date", "history", "clear", "exit", "sudo"];

/**
 * A macOS-style terminal hidden in the portfolio. Press ` (backquote) or
 * Ctrl/⌘ + K anywhere to open it; Esc closes it. Every answer comes from the
 * same /content files the site uses, so it never says anything the site doesn't.
 */
export function Terminal({ resumeAvailable }: { resumeAvailable: boolean }) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const print = useCallback((...nodes: ReactNode[]) => {
    setLines((ls) => [...ls, ...nodes.map((node) => ({ id: idRef.current++, node }))]);
  }, []);

  // greet once, the first time it opens
  const greeted = useRef(false);
  useEffect(() => {
    if (!open || greeted.current) return;
    greeted.current = true;
    const now = new Date().toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    print(
      <D>Last login: {now} on ttys001</D>,
      <span>
        Hi, I&apos;m <G>{site.name}</G>. This terminal knows everything on this site.
      </span>,
      <span>
        Type <G>help</G> to see what you can ask, or try <G>neofetch</G>.
      </span>,
      " ",
    );
  }, [open, print]);

  // global shortcuts
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_TERMINAL, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_TERMINAL, onOpen);
    };
  }, []);

  // a hello for the curious who open DevTools
  useEffect(() => {
    console.log("%c Psst. Press ` (or Ctrl+K) anywhere on the page to open my terminal. ", "background:#111f36;color:#e6c990;padding:6px 10px;border-radius:6px;font-family:monospace");
  }, []);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const go = (id: string) => {
    setOpen(false);
    window.setTimeout(() => scrollToSection(id), 250);
  };

  const run = (raw: string) => {
    const cmdline = raw.trim();
    print(
      <span>
        <G>raghuram@portfolio</G> <B>~</B> % {cmdline}
      </span>,
    );
    if (!cmdline) return;
    setHist((h) => [...h, cmdline]);
    const [cmd, ...args] = cmdline.split(/\s+/);
    const arg = args.join(" ");

    switch (cmd.toLowerCase()) {
      case "help":
        print(
          <D>Ask me anything below. Tab completes, ↑ ↓ walk your history.</D>,
          ...(
            [
              ["whoami", "who I am, in one line"],
              ["about", "background and education"],
              ["projects", "everything I've built"],
              ["open <project>", "read a case study, e.g. open vanadrishti"],
              ["experience", "where I've worked"],
              ["skills", "my toolkit"],
              ["contact", "how to reach me"],
              ["github · linkedin", "open my profiles"],
              ...(resumeAvailable ? [["resume", "download my résumé"]] : []),
              ["goto <section>", SECTIONS.join(" · ")],
              ["theme <light|dark>", "switch the site theme"],
              ["neofetch", "system info, portfolio edition"],
              ["clear · exit", "tidy up or close"],
            ] as [string, string][]
          ).map(([c, d]) => (
            <span key={c} className="grid grid-cols-[minmax(0,13rem)_1fr] gap-3">
              <G>{c}</G>
              <D>{d}</D>
            </span>
          )),
        );
        break;

      case "whoami":
        print(
          <span>
            <G>{site.fullName}</G> <D>({site.shortName})</D>
          </span>,
          <span>{site.roles.join(" · ")}</span>,
          <D>{site.location}</D>,
        );
        break;

      case "about":
        print(
          ...about.intro.map((t) => <span key={t}>{t}</span>),
          " ",
          <span>
            <G>Education</G> {about.education.degree}, {about.education.school} <D>({about.education.graduation})</D>
          </span>,
          <span>
            <G>Specialization</G> {about.education.specialization}
          </span>,
          <span>
            <G>CGPA</G> {about.education.cgpa}
          </span>,
          <span>
            <G>Now</G> {about.current.map((c) => `${c.role}, ${c.org}`).join(" · ")}
          </span>,
        );
        break;

      case "projects":
      case "work":
        print(
          ...projects.map((p) => (
            <span key={p.slug} className="grid grid-cols-[minmax(0,9rem)_1fr] items-start gap-3">
              <button type="button" onClick={() => openProject(p.slug)} className="text-left text-[#e6c990] hover:underline">
                {p.slug}
              </button>
              <span>
                {p.title} <D>· {p.tagline}</D>
              </span>
            </span>
          )),
          <D>Type open &lt;name&gt; (or click one) to read its case study.</D>,
        );
        break;

      case "open":
      case "cd": {
        const q = arg.toLowerCase().replace(/^projects\//, "");
        const p = projects.find((x) => x.slug === q || x.slug.startsWith(q) || x.title.toLowerCase().startsWith(q));
        if (!q) print(<D>Usage: open &lt;project&gt;. Try: open {projects[0].slug}</D>);
        else if (p) openProject(p.slug);
        else print(<span>open: no project called &quot;{arg}&quot;. Type <G>projects</G> to list them.</span>);
        break;
      }

      case "experience":
        print(
          ...experience.map((e) => (
            <span key={e.org}>
              <G>{e.org}</G> <D>· {e.period}</D>
              <br />
              <span className="pl-4">{e.role}</span>
            </span>
          )),
        );
        break;

      case "skills":
        print(
          ...skillGroups.map((g) => (
            <span key={g.title} className="grid grid-cols-[minmax(0,8.5rem)_1fr] items-start gap-3">
              <G>{g.title}</G>
              <span>{g.items.join(", ")}</span>
            </span>
          )),
        );
        break;

      case "contact":
      case "socials":
        print(
          ...(site.email ? [<span key="e"><G>email</G> <Ext href={`mailto:${site.email}`}>{site.email}</Ext></span>] : []),
          <span>
            <G>github</G> <Ext href={site.socials.github}>{site.socials.github.replace("https://", "")}</Ext>
          </span>,
          <span>
            <G>linkedin</G> <Ext href={site.socials.linkedin}>{site.socials.linkedin.replace("https://www.", "")}</Ext>
          </span>,
          <D>Or type goto contact.</D>,
        );
        break;

      case "github":
      case "linkedin":
        window.open(site.socials[cmd.toLowerCase() as "github" | "linkedin"], "_blank", "noopener,noreferrer");
        print(<D>Opening {cmd} in a new tab…</D>);
        break;

      case "resume":
      case "cv":
        if (resumeAvailable) {
          const a = document.createElement("a");
          a.href = site.resumePath;
          a.download = "";
          a.click();
          print(<D>Downloading résumé…</D>);
        } else print(<D>The résumé isn&apos;t uploaded yet. Try contact for now.</D>);
        break;

      case "goto": {
        const id = arg.toLowerCase() === "work" ? "projects" : arg.toLowerCase();
        if (SECTIONS.includes(id)) go(id);
        else print(<D>Usage: goto &lt;{SECTIONS.join(" | ")}&gt;</D>);
        break;
      }

      case "theme": {
        const want = arg.toLowerCase();
        const next = want === "light" || want === "dark" ? want : resolvedTheme === "dark" ? "light" : "dark";
        setTheme(next);
        print(<D>Theme set to {next}.</D>);
        break;
      }

      case "neofetch":
        print(
          <span className="grid grid-cols-[auto_1fr] items-center gap-6">
            <pre className="leading-[1.05] text-[#e6c990]">{` ██████╗
 ██╔══██╗
 ██████╔╝
 ██╔══██╗
 ██║  ██║
 ╚═╝  ╚═╝`}</pre>
            <span className="grid gap-0.5">
              <span>
                <G>raghuram</G>@<G>portfolio</G>
              </span>
              <D>─────────────────</D>
              <span>
                <G>OS</G> Portfolio 2026 · {site.location}
              </span>
              <span>
                <G>Host</G> {about.education.school}, CSE (Honors)
              </span>
              <span>
                <G>Uptime</G> class of {about.education.graduation} · CGPA {about.education.cgpa}
              </span>
              <span>
                <G>Shell</G> zsh (pretend)
              </span>
              <span>
                <G>Stack</G> Next.js · React · GSAP · three.js
              </span>
              <span>
                <G>Projects</G> {projects.length} · <G>Theme</G> {resolvedTheme}
              </span>
              <span className="mt-1 flex gap-1">
                {["#111f36", "#203a64", "#365783", "#c7a261", "#e6c990", "#f1e5d2", "#faf5ec"].map((c) => (
                  <span key={c} className="h-3.5 w-6 rounded-sm" style={{ background: c }} />
                ))}
              </span>
            </span>
          </span>,
        );
        break;

      case "ls":
        print(
          <span className="flex flex-wrap gap-x-6">
            <B>projects/</B>
            <span>about.txt</span>
            <span>experience.log</span>
            <span>skills.json</span>
            <span>contact.vcf</span>
            {resumeAvailable && <span>resume.pdf</span>}
          </span>,
        );
        break;

      case "cat": {
        const map: Record<string, string> = { "about.txt": "about", "experience.log": "experience", "skills.json": "skills", "contact.vcf": "contact" };
        if (map[arg]) run(map[arg]);
        else print(<D>cat: {arg || "?"}: try ls first</D>);
        return;
      }

      case "echo":
        print(<span>{arg}</span>);
        break;
      case "date":
        print(<span>{new Date().toString()}</span>);
        break;
      case "history":
        print(...[...hist, cmdline].map((h, i) => <span key={i}><D>{String(i + 1).padStart(3, " ")}</D>  {h}</span>));
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
      case "quit":
        setOpen(false);
        break;
      case "sudo":
        if (/hire/.test(arg)) {
          print(<span><G>[sudo]</G> Permission granted. Great choice. Taking you to contact…</span>);
          window.setTimeout(() => go("contact"), 900);
        } else print(<D>Nice try. The only sudo here is: sudo hire-me</D>);
        break;
      case "rm":
        print(<D>Let&apos;s not. This portfolio took a while.</D>);
        break;
      case "vim":
      case "nano":
        print(<D>You&apos;re safe. No one gets stuck in vim here. Type exit to leave.</D>);
        break;
      default:
        print(
          <span>
            zsh: command not found: {cmd}. Type <G>help</G>.
          </span>,
        );
    }
  };

  const openProject = (slug: string) => {
    print(<D>Opening /work/{slug}…</D>);
    window.setTimeout(() => {
      setOpen(false);
      router.push(`/work/${slug}`);
    }, 350);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
      setHi(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!hist.length) return;
      const n = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1);
      setHi(n);
      setInput(hist[n]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hi < 0) return;
      const n = hi + 1;
      if (n >= hist.length) {
        setHi(-1);
        setInput("");
      } else {
        setHi(n);
        setInput(hist[n]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const [c, ...rest] = input.split(" ");
      if (!rest.length) {
        const m = COMMANDS.filter((x) => x.startsWith(c.toLowerCase()));
        if (m.length === 1) setInput(m[0] + " ");
        else if (m.length > 1) print(<D>{m.join("   ")}</D>);
      } else {
        const pool = c === "goto" ? SECTIONS : c === "open" || c === "cd" ? projects.map((p) => p.slug) : c === "theme" ? ["light", "dark"] : [];
        const q = rest.join(" ").toLowerCase();
        const m = pool.filter((x) => x.startsWith(q));
        if (m.length === 1) setInput(`${c} ${m[0]}`);
        else if (m.length > 1) print(<D>{m.join("   ")}</D>);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label="Close terminal" tabIndex={-1} onClick={() => setOpen(false)} className="absolute inset-0 bg-[#050a14]/55 backdrop-blur-[3px]" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Terminal"
            initial={{ y: 40, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.97, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative flex h-[min(560px,78svh)] w-full max-w-[860px] flex-col overflow-hidden rounded-[14px] bg-[#0b0f17]/95 font-mono text-[0.86rem] leading-relaxed text-[#e9e4da] shadow-[0_2px_6px_rgba(0,0,0,0.3),0_60px_120px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/12 backdrop-blur-xl"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="relative flex h-9 shrink-0 items-center gap-2 bg-[#1b1e25] px-3.5">
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="absolute left-1/2 max-w-[62%] -translate-x-1/2 truncate text-[0.74rem] text-white/50">raghuram@portfolio: ~ (zsh)</span>
            </div>
            <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 py-3 sm:px-5" aria-live="polite">
              {lines.map((l) => (
                <div key={l.id} className="min-h-[1.4em] break-words whitespace-pre-wrap">
                  {l.node}
                </div>
              ))}
              <label className="flex items-center gap-2">
                <span className="shrink-0">
                  <G>raghuram@portfolio</G> <B>~</B> %
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  aria-label="Terminal command"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="min-w-0 flex-1 bg-transparent text-[#e9e4da] caret-[#e6c990] outline-none"
                />
              </label>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
