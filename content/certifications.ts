export interface Credential {
  title: string;
  issuer: string;
  date?: string; // e.g. "2025"
  url?: string; // public verification link — shown only when set
  note?: string;
}

export interface Achievement {
  title: string;
  kind: "hackathon" | "community";
  description: string;
  /** Add named wins, e.g. { name: "Smart India Hackathon", result: "Winner", year: "2025" } */
  items?: { name: string; result?: string; year?: string; url?: string }[];
}

/**
 * Credentials — add exact names, dates and verification URLs as you like.
 * Nothing here is auto-generated: no fake IDs, counts or links.
 */
export const credentials: Credential[] = [
  { title: "MongoDB Certified Developer Associate", issuer: "MongoDB" },
  { title: "AWS Academy Credentials", issuer: "Amazon Web Services · AWS Academy" },
  { title: "Microsoft Credentials", issuer: "Microsoft" },
  { title: "Oracle Cloud Infrastructure Certifications", issuer: "Oracle" },
];

export const achievements: Achievement[] = [
  {
    title: "Hackathons & Build Events",
    kind: "hackathon",
    description: "Products designed and shipped under hackathon and tech-fest timelines.",
    items: [
      { name: "Accurate Background AI Hackathon", result: "SAMORI · Team NeuroX", year: "2026" },
      { name: "August Fest", result: "Scan2Hire (Kaizen Job Portal)", year: "2025" },
    ],
  },
  {
    title: "Technical Event Organizing",
    kind: "community",
    description: "Contributed to organizing technical events for the student developer community.",
    items: [],
  },
];
