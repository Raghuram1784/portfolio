# Raghuram — Interactive Developer Portfolio

A creative-editorial developer portfolio: a light, beige-led page where real product interfaces are the main attraction. Royal blue and navy are reserved for dramatic sections; champagne gold is a small accent.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Motion for React · GSAP + ScrollTrigger · Embla Carousel · Lucide · next-themes. Fonts: General Sans (self-hosted from Fontshare, ITF Free Font License), Instrument Serif and IBM Plex Mono (Google Fonts).

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

Requires Node.js 18.18+ (tested on Node 22).

## Make it yours: edit `/content`

All copy lives in typed data files, separate from the UI:

| File | What it controls |
| --- | --- |
| `content/site.ts` | Name, roles, description, **email**, social links, site URL, resume and portrait paths, nav items |
| `content/about.ts` | Bio paragraphs, current roles, education, interests |
| `content/projects.ts` | Showcase projects: copy, tech, real screenshots (`shots`), pipeline (shown when there are no screenshots), GitHub and demo links |
| `content/experience.ts` | Timeline entries. Add verified bullets to `details: []` and they show in the expandable panel |
| `content/skills.ts` | Skill categories and marquee rows |
| `content/certifications.ts` | Credentials (with optional `date` / `url`) and achievements (with optional named `items`) |

### Things to add before you share it

1. **Email:** set `email` in `content/site.ts`. Email buttons stay hidden until you do.
2. **Resume:** put your PDF at `public/resume.pdf`. All "Resume" buttons (nav, hero, mobile menu, contact) appear automatically. The check runs at build time, so no broken links ship.
3. **Portrait:** intentionally not shown yet — it will be integrated once a photograph is chosen.
4. **Site URL:** set `url` in `content/site.ts` to your deployed domain. Canonical and OG tags use it.
5. **Project images:** see "Project exhibition & image sources" below.
6. **Certifications:** add exact credential names, dates and verification URLs. A "Verify" link appears only when `url` is set.
7. **Hackathons:** add each named win to `achievements[0].items`, for example `{ name: "…", result: "Winner", year: "2025" }`.

ViPOS and other research-internship projects are kept out of Projects on purpose. The internships still appear in Experience.

## Architecture

```
app/
  layout.tsx            fonts (Playfair Display + Manrope), metadata, theme provider
  page.tsx              composes sections; checks for resume and portrait files on the server
  globals.css           design tokens (palette + semantic light/dark vars), utilities, keyframes
  opengraph-image.tsx   generated 1200×630 social card
  icon.svg              favicon
components/
  layout/               Navbar, ThemeToggle, ScrollProgress, Footer, Providers
  hero/                 Hero (product wall, scroll handoff into Mercora)
  projects/             ProjectModal (gallery), ProjectStage (labelled AweTails artwork)
  sections/             About, Projects, Experience, Skills, Certifications, Contact
  layout/               Navbar, ThemeToggle, Cursor, ScrollProgress, Footer, Providers
  ui/                   Screen (real-screenshot frame), Logo, MagneticButton, Reveal / SplitHeading, SectionHeading, BrandIcons
content/                all editable data
lib/                    gsap registration + scrollToSection, hooks (media queries, GPU tier), cn
```

### Themes

Semantic tokens (`--bg`, `--surface`, `--ink`, `--accent`, …) switch under `.dark`. Light mode is ivory and beige with navy type, and navy drama sections (Experience, Contact). Dark mode is deep navy with royal-blue drama sections, so the page still alternates. Featured rooms keep each product's own brand colours in both themes. The theme follows the system by default, is saved in `localStorage` (`rr-theme`), and switches with a circular View Transition reveal where the browser supports it.

### Scroll sequences (768 px and wider; phones get a swipe carousel, reduced motion gets static layouts)

1. **Hero → work.** The name sits on a calm full-screen WebGL background: slow, soft colour fields, a spotlight that follows the cursor, and a fine dot grid whose dots grow, glow and drift away from the cursor (light and dark palettes). A clean stack of three project windows sits beside it. Scrolling lifts the name away and fans the back windows out; on ≥768px the front window (Mercora) glides to the exact frame of the carousel's first card while a circular reveal opens behind it. On phones the hero isn't pinned — the name lifts and the windows spread as you scroll past.
2. **Project carousel** — on every screen size, a pinned 3D coverflow of the six featured projects (SkillCraft, Local Services Connector and AweTails are kept in `content/projects.ts` with `hidden: true`). Vertical scroll turns the carousel (it snaps to each project); drag, the arrow buttons, the arrow keys, or clicking a side card also move it. The centre card shows the real screenshot large, neighbours angle back in depth, and the background takes on each product's own brand colours. Clicking the centre card opens the full screenshot gallery. On phones it becomes a touch-swipe coverflow. The hero's final frame is the carousel's first card, so the handoff is seamless.
3. **Experience timeline** — on a deep midnight gradient, a gold line fills as you scroll; each milestone tile lights up and its card slides in from its side (alternating on desktop, one side on phones).
4. **Contact finale** — the headline is lit word by word and a gold rule draws across.

### Themes

Semantic tokens (`--bg`, `--surface`, `--ink`, `--accent`, …) switch under `.dark`. Light mode is ivory and beige with navy type, and navy drama sections (Experience, Contact). Dark mode is deep navy with royal-blue drama sections, so the page still alternates. Featured rooms keep each product's own brand colours in both themes. The theme follows the system by default, is saved in `localStorage` (`rr-theme`), and switches with a circular View Transition reveal where the browser supports it.

### Typography

Clash Display for headings, General Sans for body and interface (both self-hosted from Fontshare), Instrument Serif italic for editorial emphasis, IBM Plex Mono for small technical labels.

### Extras

- **Intro preloader** — the name and a 0→100 counter on navy, then the curtain lifts (once per session; skipped with reduced motion). Hero entrances wait for it.
- **Back-to-top button** — its gold ring shows reading progress.

### Building while `npm run dev` is running

Run production builds into a separate folder so the dev server keeps working: `$env:NEXT_DIST_DIR='.next-prod'; npm run build`.

### Accessibility and motion

Semantic landmarks, a skip link, labelled controls, keyboard support (carousel arrow keys, modal focus trap, Esc to close) and visible focus rings. `MotionConfig reducedMotion="user"` plus a CSS reduced-motion guard turn off non-essential animation.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com, choose **Add New → Project**, import the repo, and keep the defaults (framework: Next.js).
3. Click **Deploy**. No environment variables are needed.

Or from the CLI: `npx vercel` and then `npx vercel --prod`.


## Project exhibition & image sources

Every exhibit carries a provenance badge: **Real screenshots** or **Illustrative artwork**. Authentic images are never retouched or mocked up.

| Project | Images | Source |
| --- | --- | --- |
| Mercora AI | 6 real | `docs/screenshots/` in the repo |
| VanaDrishti | 4 real | Captured by running its own React dashboard locally against its local demo database (camera locations are simulated, as the app itself states) |
| MedAssist AI | 4 real | Captured by running its React frontend locally; the analysis API was offline, so result screens are not shown |
| FlowTwin AI | 4 real | `docs/images/` in the repo |
| Scan2Hire | 7 real | `Application-Snapshots/` |
| SkillCraft AI | 6 real | `Application-Screenshots/` |
| SAMORI | 6 real | `docs/screenshots/showcase/` |
| Local Services Connector | 4 real | `Application-Screenshots/` |
| AweTails | Illustrative | The Streamlit app runs but its idle UI is sparse and a headless capture came out blank, so the exhibit uses original artwork of its documented listen → transcribe → retrieve → respond loop, labelled as such |

**Project covers:** `public/projects/<slug>/cover.webp` are designed landing-page covers (1600×1000) — brand background, product name, tagline, three verified capabilities and stack, with the project's REAL screenshots composed in macOS windows. They were laid out in HTML/CSS with the site's fonts and rendered with headless Edge. The carousel shows each cover inside a macOS window frame. `samori/phone-home.webp` is an unedited crop of one phone screen from SAMORI's real showcase image. Regenerate with any image tool if a screenshot changes.

To add or replace screenshots: drop WebP/PNG files in `public/projects/<slug>/` and list them in that project's `shots` array in `content/projects.ts`. Featured rooms use the first three or four shots in the order listed.

## Scroll recordings

`recordings/` (git-ignored) holds animated WebP captures (every captured frame kept) of the hero → Mercora handoff, VanaDrishti + MedAssist, and Experience + Contact, recorded from headless Edge on a real GPU with genuine mouse-wheel input over the DevTools protocol. Open them in any browser.

### Skill logos

Skills show brand logos from [Simple Icons](https://simpleicons.org) (CC0) via the `simple-icons` package; concepts without a brand (RAG, LLMs, SQL, AWS, …) use matching Lucide line icons. See `components/ui/TechIcon.tsx`.
