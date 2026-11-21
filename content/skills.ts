export type SkillIcon = "code" | "layout" | "mobile" | "server" | "brain" | "database" | "cloud";

export interface SkillGroup {
  title: string;
  icon: SkillIcon;
  items: string[];
  highlight?: boolean;
}

export const skillGroups: SkillGroup[] = [
  { title: "AI / ML", icon: "brain", highlight: true, items: ["Machine Learning", "Deep Learning", "NLP", "LLMs", "RAG", "LangChain", "FAISS", "Transformers"] },
  { title: "Programming", icon: "code", items: ["Python", "Java", "C", "C++", "JavaScript", "TypeScript", "SQL"] },
  { title: "Frontend", icon: "layout", items: ["React", "Next.js", "Tailwind CSS"] },
  { title: "Mobile", icon: "mobile", items: ["Flutter", "Dart"] },
  { title: "Backend", icon: "server", items: ["Node.js", "Express.js", "NestJS", "Spring Boot", "FastAPI", "REST APIs"] },
  { title: "Databases", icon: "database", items: ["PostgreSQL", "MySQL", "MongoDB"] },
  { title: "Tools & Cloud", icon: "cloud", items: ["Git", "Docker", "Linux", "AWS"] },
];

export const marqueeRows: string[][] = [
  ["Python", "TypeScript", "React", "Next.js", "Flutter", "Node.js", "Spring Boot", "FastAPI", "PostgreSQL", "Docker", "AWS"],
  ["LLMs", "RAG", "LangChain", "FAISS", "Transformers", "NLP", "Deep Learning", "MongoDB", "NestJS", "Tailwind CSS", "Linux"],
];
