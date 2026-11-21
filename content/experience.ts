export interface Experience {
  org: string;
  role: string;
  period: string;
  type: string;
  location?: string;
  current?: boolean;
  focus: string[];
  /** Add verified bullet points here — they appear in the expandable panel. */
  details: string[];
}

export const experience: Experience[] = [
  {
    org: "Juvion Labs Private Limited",
    role: "Software Development Intern",
    period: "September 2026 – Present",
    type: "Internship",
    location: "Hyderabad, India",
    current: true,
    focus: ["Software Development"],
    details: [],
  },
  {
    org: "Smart Interviews",
    role: "Data Structures & Algorithms Mentor",
    period: "Part-time · Current",
    type: "Part-time",
    current: true,
    focus: ["Data Structures", "Algorithms", "Mentoring"],
    details: [],
  },
  {
    org: "IIT Tirupati",
    role: "Research Intern, Full-Stack & AI/ML Development",
    period: "May 2026 – July 2026",
    type: "Research Internship",
    focus: ["Full-Stack Development", "AI/ML"],
    details: [],
  },
  {
    org: "NIT Warangal",
    role: "Machine Learning Research Intern",
    period: "June 2025 – July 2025",
    type: "Research Internship",
    focus: ["Machine Learning", "Research"],
    details: [],
  },
];
