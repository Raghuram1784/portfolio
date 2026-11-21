/**
 * Global site configuration.
 * Everything a visitor sees about you lives in /content — edit freely.
 */
export const site = {
  name: "Raghuram",
  fullName: "Yandamuri Mohana Venkata Raghuram",
  shortName: "Y.M.V. Raghuram",
  monogram: "R",
  url: "https://raghuram.vercel.app", // ← replace with your deployed URL (used for SEO / OG tags)
  title: "Raghuram (Y.M.V. Raghuram) | Software Developer · AI/ML Engineer · Full-Stack & Mobile",
  description:
    "I build intelligent, scalable, and user-focused digital experiences across web, mobile, and artificial intelligence.",
  roles: ["Software Developer", "AI/ML Engineer", "Full-Stack & Mobile App Developer"],
  location: "Hyderabad, India",

  /**
   * Contact email. Left empty on purpose — add yours to enable the
   * "Email me" buttons (they stay hidden while this is empty).
   */
  email: "",

  /**
   * Resume: drop your PDF at /public/resume.pdf. Resume buttons appear
   * automatically once the file exists (checked at build time).
   */
  resumePath: "/resume.pdf",

  /**
   * Portrait: drop your real photo at /public/images/portrait.jpg
   * (portrait orientation, ~900×1100). Until then an elegant monogram
   * placeholder is shown — no stock faces.
   */
  portraitPath: "/images/portrait.jpg",

  socials: {
    github: "https://github.com/Raghuram1784",
    linkedin: "https://www.linkedin.com/in/ymvraghuram/",
  },
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof navItems)[number]["id"];
