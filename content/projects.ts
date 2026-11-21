export interface Shot {
  src: string;
  alt: string;
  w: number;
  h: number;
}

/** Visual environment each project is exhibited in (see components/projects/Environment.tsx). */
export type Env = "commerce" | "forest" | "clinical" | "graph" | "qr" | "learning" | "food" | "voice" | "services";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  context?: string;
  status?: string;
  tech: string[];
  features?: string[];
  pipeline?: { label: string; detail: string }[];
  /**
   * AUTHENTIC screenshots only — taken from the repository's own screenshot
   * folders or captured by running the project locally. Never mock-ups.
   */
  shots: Shot[];
  /** Designed landing-page cover (real screenshots composed in macOS windows). */
  cover?: string;
  /** Hidden from the site (kept here so it can be brought back with one line). */
  hidden?: boolean;
  /** true → the exhibit shows clearly-labelled illustrative artwork instead of screenshots */
  illustrative?: boolean;
  github?: string;
  demo?: string;
  year?: string;
  discipline: "AI / ML" | "Full-Stack" | "Mobile" | "Backend" | "Computer Vision" | "Data / Graph";
  env: Env;
  /** product's own brand colours, used only inside its exhibit */
  brand: { bg: string; bg2: string; accent: string; ink: string };
}

const s = (src: string, alt: string, w: number, h: number): Shot => ({ src, alt, w, h });

/**
 * Featured exhibition, in order. Research-internship projects (e.g. ViPOS) are intentionally excluded.
 * Sources: Mercora, Scan2Hire, SkillCraft, FlowTwin, SAMORI and Local Services screenshots come from
 * each repo's screenshot/docs folder. VanaDrishti and MedAssist were captured by running their own
 * frontends locally (VanaDrishti against its local demo database; MedAssist with its API offline).
 */
export const allProjects: Project[] = [
  {
    slug: "mercora-ai",
    cover: "/projects/mercora-ai/cover.webp",
    title: "Mercora AI",
    tagline: "Agentic commerce & merchant growth platform",
    description:
      "Customers discover products conversationally, receive deterministically ranked recommendations and pay through Razorpay Test Mode, while the AI is bounded: it can never set prices, override stock or mark a payment successful. Merchants get server-validated AI revenue attribution and an append-only audit trail.",
    context: "Razorpay AI Buildathon submission · Track 01: AI Growth & Agentic Commerce",
    tech: ["React", "Tailwind CSS", "Framer Motion", "Express", "Prisma", "Neon PostgreSQL", "Groq", "Razorpay", "Vercel"],
    features: [
      "Conversational discovery with deterministic ranking",
      "Explicit authorization before any cart or payment action",
      "Authoritative variant selection: the AI never guesses",
      "Razorpay Test Mode checkout with server-side verification",
      "Merchant dashboard with AI-assisted revenue attribution",
      "Append-only CommerceEvent audit trail",
    ],
    pipeline: [
      { label: "Discover", detail: "Conversational request · deterministic ranking" },
      { label: "Authorize", detail: "Explicit consent before any cart or payment action" },
      { label: "Pay", detail: "Razorpay Test Mode checkout" },
      { label: "Verify", detail: "Server-side payment verification" },
      { label: "Attribute", detail: "AI revenue attribution · append-only audit trail" },
    ],
    shots: [
      s("/projects/mercora-ai/storefront.webp", "Mercora AI storefront", 1600, 753),
      s("/projects/mercora-ai/ai-recommendation.webp", "Mercora AI ranking headphones for a natural-language request", 853, 877),
      s("/projects/mercora-ai/merchant-dashboard.webp", "Mercora merchant dashboard with AI attribution", 1600, 814),
      s("/projects/mercora-ai/variant-safety.webp", "Explicit variant selection before adding to cart", 840, 872),
      s("/projects/mercora-ai/payment-success.webp", "Razorpay Test Mode payment success", 1201, 713),
      s("/projects/mercora-ai/order-verified.webp", "Server-verified order confirmation", 751, 827),
    ],
    github: "https://github.com/Raghuram1784/Mercora-AI",
    demo: "https://mercora-ai.vercel.app",
    year: "2026",
    discipline: "Full-Stack",
    env: "commerce",
    brand: { bg: "#120a24", bg2: "#2a1352", accent: "#a855f7", ink: "#f5f3ff" },
  },
  {
    slug: "vanadrishti",
    cover: "/projects/vanadrishti/cover.webp",
    title: "VanaDrishti",
    tagline: "AI wildlife surveillance & ranger decision support",
    description:
      "Built for protected forests such as Tadoba-Andhari Tiger Reserve: camera-trap and patrol imagery is analysed for people, vehicles and animals, species are recognised, and zone-aware risk rules raise alerts for ranger review on a command dashboard.",
    status: "Prototype in active development. Camera locations are simulated for demonstration",
    tech: ["Python", "PyTorch", "MegaDetector V6", "BioCLIP", "OpenCV", "FastAPI", "WebSockets", "React", "TypeScript", "Tailwind CSS", "Recharts", "React Leaflet", "Android"],
    features: [
      "Person / vehicle / animal detection with MegaDetector V6",
      "Species recognition with ranked top-three labels",
      "Zone-aware risk scoring and ranger alert queue",
      "Six-camera command monitor, incl. Android mobile camera ingestion",
      "Forest camera map and risk distribution overview",
      "Detection metadata export to JSON and CSV",
    ],
    pipeline: [
      { label: "Capture", detail: "Camera-trap, patrol and Android camera imagery" },
      { label: "Detect", detail: "MegaDetector V6 · person / vehicle / animal" },
      { label: "Recognise", detail: "BioCLIP · ranked top-three species" },
      { label: "Score", detail: "Zone-aware risk rules" },
      { label: "Alert", detail: "Ranger review queue on the command dashboard" },
    ],
    shots: [
      s("/projects/vanadrishti/overview.webp", "VanaDrishti overview with forest camera map and risk distribution", 1600, 1000),
      s("/projects/vanadrishti/monitor.webp", "Six-camera command-center monitor", 1600, 1000),
      s("/projects/vanadrishti/alerts.webp", "Ranger review queue of high and critical alerts", 1600, 1000),
      s("/projects/vanadrishti/events.webp", "Event log with risk levels and metadata export", 1600, 1000),
    ],
    github: "https://github.com/Raghuram1784/vanadrishti",
    year: "2026",
    discipline: "Computer Vision",
    env: "forest",
    brand: { bg: "#08130d", bg2: "#173222", accent: "#d7b56d", ink: "#eef5e9" },
  },
  {
    slug: "medassist-ai",
    cover: "/projects/medassist-ai/cover.webp",
    title: "MedAssist AI",
    tagline: "AI-assisted clinical decision support",
    description:
      "A research and educational CDSS prototype that turns a patient's presentation into an evidence-grounded differential assessment, combining BioClinicalBERT embeddings, FAISS case retrieval, a NetworkX knowledge graph and Groq LLM synthesis in a React clinical workstation.",
    tech: ["Python", "BioClinicalBERT", "FAISS", "NetworkX", "Groq LLM", "FastAPI", "React", "TypeScript", "shadcn/ui"],
    pipeline: [
      { label: "Encode", detail: "BioClinicalBERT · 768-D clinical embeddings" },
      { label: "Retrieve", detail: "FAISS · similar DDXPlus cases" },
      { label: "Verify", detail: "NetworkX knowledge graph" },
      { label: "Synthesize", detail: "Groq LLM · structured differential" },
    ],
    shots: [
      s("/projects/medassist-ai/dashboard.webp", "MedAssist AI dashboard and pipeline overview", 1600, 1000),
      s("/projects/medassist-ai/assessment.webp", "Clinical case workspace for patient presentation", 1600, 1000),
      s("/projects/medassist-ai/methodology.webp", "Clinical methodology and system architecture", 1600, 1000),
      s("/projects/medassist-ai/evaluation.webp", "Offline model evaluation view", 1600, 1000),
    ],
    github: "https://github.com/Raghuram1784/MedAssist-AI",
    discipline: "AI / ML",
    env: "clinical",
    brand: { bg: "#0d1530", bg2: "#3b2a8f", accent: "#7c6cf6", ink: "#f4f5ff" },
  },
  {
    slug: "flowtwin-ai",
    cover: "/projects/flowtwin-ai/cover.webp",
    title: "FlowTwin AI",
    tagline: "Predictive workflow optimization with graph analytics",
    description:
      "Reconstructs digital user journeys as a directed weighted graph, detects structural bottlenecks and rework loops with PageRank and betweenness centrality, and predicts session-level abandonment risk with a Random Forest, all explorable on an interactive graph canvas.",
    tech: ["React 19", "Vite", "@xyflow/react", "Recharts", "Radix UI", "Tailwind CSS", "FastAPI", "NetworkX", "scikit-learn", "SQLAlchemy"],
    features: [
      "Digital-twin workflow graph from raw event streams",
      "Bottleneck & friction ranking",
      "Backtrack and rework-loop detection",
      "Session-level completion vs abandonment risk",
    ],
    pipeline: [
      { label: "Ingest", detail: "Raw user event streams" },
      { label: "Model", detail: "Directed weighted workflow graph · NetworkX" },
      { label: "Analyse", detail: "PageRank & betweenness · bottlenecks and rework loops" },
      { label: "Predict", detail: "Random Forest · abandonment risk per session" },
      { label: "Explore", detail: "Interactive graph canvas" },
    ],
    shots: [
      s("/projects/flowtwin-ai/overview.webp", "FlowTwin AI overview dashboard", 1532, 907),
      s("/projects/flowtwin-ai/workflow-graph.webp", "Digital twin workflow graph", 1600, 819),
      s("/projects/flowtwin-ai/bottlenecks.webp", "Bottleneck intelligence and friction ranking", 1600, 821),
      s("/projects/flowtwin-ai/session-journeys.webp", "Session journeys with risk levels", 1600, 781),
    ],
    github: "https://github.com/Raghuram1784/FlowTwin-AI",
    discipline: "Data / Graph",
    env: "graph",
    brand: { bg: "#0c1526", bg2: "#1d3566", accent: "#7db3ff", ink: "#eef4ff" },
  },
  {
    slug: "scan2hire",
    cover: "/projects/scan2hire/cover.webp",
    title: "Scan2Hire",
    tagline: "QR-powered career portal for students and companies",
    description:
      "Students complete a short assessment and publish a digital profile; companies post jobs and get a unique QR for each listing. Anyone can scan to view and express interest in one click, while an AI fitment engine scores candidate matches.",
    context: "Kaizen Job Portal, built for August Fest 2025",
    tech: ["Next.js", "React", "Tailwind CSS", "shadcn/ui", "QR codes", "Web Speech API", "Vercel"],
    features: [
      "Student assessment: values, preferences, personality",
      "AI fitment scoring for recruiters",
      "Unique QR code for every job post",
      "Voice input for hands-free form filling",
      "Admin dashboard for jobs and students",
    ],
    pipeline: [
      { label: "Assess", detail: "Values, preferences and personality" },
      { label: "Publish", detail: "Digital student profile" },
      { label: "Post", detail: "Every job gets a unique QR code" },
      { label: "Scan", detail: "View and express interest in one click" },
      { label: "Match", detail: "AI fitment scoring for recruiters" },
    ],
    shots: [
      s("/projects/scan2hire/home.webp", "Scan2Hire landing page", 1600, 716),
      s("/projects/scan2hire/career-matches.webp", "Career match results", 996, 858),
      s("/projects/scan2hire/job-qr.webp", "Posted job with generated QR code", 653, 821),
      s("/projects/scan2hire/assessment.webp", "Student assessment step", 1041, 812),
      s("/projects/scan2hire/work-preferences.webp", "Work preference sliders", 827, 809),
      s("/projects/scan2hire/voice-input.webp", "Company job posting with voice input", 1207, 860),
      s("/projects/scan2hire/admin-dashboard.webp", "Admin dashboard", 1210, 686),
    ],
    github: "https://github.com/Raghuram1784/Scan2Hire",
    demo: "https://v0-kaizen-job-portal.vercel.app/",
    year: "2025",
    discipline: "Full-Stack",
    env: "qr",
    brand: { bg: "#151826", bg2: "#2b2560", accent: "#8b5cf6", ink: "#f5f5ff" },
  },
  {
    slug: "skillcraft-ai",
    hidden: true, // recommended: keep the six strongest projects
    cover: "/projects/skillcraft-ai/cover.webp",
    title: "SkillCraft AI",
    tagline: "Learning platform with roadmaps, reminders and progress",
    description:
      "Structured, step-by-step roadmaps for skills like web, backend and data science, each with documentation, video tutorials and practice projects, plus skill reminders, learning streaks and progress tracking.",
    tech: ["Python", "Flask", "HTML", "CSS", "JavaScript", "AOS", "Particles.js"],
    features: [
      "Learning roadmaps for many skill tracks",
      "Learning-path visualization",
      "Curated docs, videos and practice projects",
      "Smart reminders and streaks",
      "Progress tracking dashboard",
    ],
    shots: [
      s("/projects/skillcraft-ai/home.webp", "SkillCraft AI home", 1600, 597),
      s("/projects/skillcraft-ai/skill-catalog.webp", "Skill track catalog", 1600, 821),
      s("/projects/skillcraft-ai/learning-path.webp", "Learning path visualization", 1600, 824),
      s("/projects/skillcraft-ai/practice-projects.webp", "Practice projects for a skill", 1324, 823),
      s("/projects/skillcraft-ai/progress.webp", "Progress and learning schedule", 1397, 859),
      s("/projects/skillcraft-ai/dashboard.webp", "Learning progress and deadlines", 1600, 675),
    ],
    github: "https://github.com/Raghuram1784/SkillCraft-AI",
    demo: "https://skillcraft-ai.vercel.app",
    discipline: "Full-Stack",
    env: "learning",
    brand: { bg: "#0d1117", bg2: "#13322e", accent: "#5eead4", ink: "#ecfeff" },
  },
  {
    slug: "samori",
    cover: "/projects/samori/cover.webp",
    title: "SAMORI",
    tagline: "AI-assisted, real-time food delivery for Hyderabad",
    description:
      "One Flutter app with four roles (customer, restaurant owner, delivery partner and admin), backed by a NestJS + PostgreSQL server that is the single source of truth for prices, order state and authorization.",
    context: "Built by Team NeuroX (KL University) for the Accurate Background AI Hackathon 2026",
    tech: ["Flutter", "Dart", "NestJS", "PostgreSQL", "Prisma", "Socket.IO", "Google Gemini", "Razorpay (test mode)"],
    features: [
      "AI Smart Food Finder priced on the total payable",
      "Group ordering with restaurant price negotiation",
      "Exact bill splitting",
      "Scheduled delivery windows",
      "Live rider GPS tracking",
      "PIN-verified handover",
    ],
    pipeline: [
      { label: "Find", detail: "AI Smart Food Finder · group orders" },
      { label: "Confirm", detail: "NestJS + PostgreSQL: the source of truth for price and state" },
      { label: "Prepare", detail: "Restaurant owner operations" },
      { label: "Track", detail: "Live rider GPS" },
      { label: "Handover", detail: "PIN-verified delivery" },
    ],
    shots: [
      s("/projects/samori/customer-discovery.webp", "SAMORI discovery, menu and nutrition screens", 1404, 880),
      s("/projects/samori/customer-ai-finder.webp", "AI Smart Food Finder", 1068, 880),
      s("/projects/samori/customer-group-ordering.webp", "Group ordering flow", 1404, 880),
      s("/projects/samori/customer-negotiation-split.webp", "Price negotiation and bill split", 1404, 880),
      s("/projects/samori/customer-tracking-delivery.webp", "Live tracking and OTP handover", 1068, 880),
      s("/projects/samori/owner-operations.webp", "Restaurant owner operations", 1068, 880),
    ],
    github: "https://github.com/Raghuram1784/smart_food_app",
    year: "2026",
    discipline: "Mobile",
    env: "food",
    brand: { bg: "#10231b", bg2: "#1c3b2d", accent: "#f08a24", ink: "#f6f1e7" },
  },
  {
    slug: "awetails",
    hidden: true, // recommended: keep the six strongest projects
    title: "AweTails",
    tagline: "Real-time speech-to-speech voice assistant",
    description:
      "Captures live voice, suppresses noise, transcribes with Whisper, retrieves knowledge with LangChain + FAISS, reasons with Llama 3.1 through the Groq API and speaks the answer back, a complete conversational AI loop in Streamlit.",
    tech: ["Python", "Whisper", "LangChain", "FAISS", "Llama 3.1 (Groq)", "Streamlit", "noisereduce", "pyttsx3"],
    pipeline: [
      { label: "Listen", detail: "Mic capture · noise suppression · VAD" },
      { label: "Transcribe", detail: "Whisper ASR" },
      { label: "Retrieve", detail: "LangChain + FAISS knowledge base" },
      { label: "Respond", detail: "Llama 3.1 via Groq · text-to-speech" },
    ],
    shots: [],
    illustrative: true,
    github: "https://github.com/Raghuram1784/AweTails_Ai-Voice-Tech",
    discipline: "AI / ML",
    env: "voice",
    brand: { bg: "#0b1020", bg2: "#1b2550", accent: "#e6c990", ink: "#f5f1e6" },
  },
  {
    slug: "local-services-connector",
    hidden: true, // recommended: keep the six strongest projects
    cover: "/projects/local-services-connector/cover.webp",
    title: "Local Services Connector",
    tagline: "Discover, compare and book trusted local services",
    description:
      "A full-stack platform for finding local service providers with smart filtering by location, skills, rating and price, plus a part-time gigs marketplace, authentication and push notifications.",
    tech: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Clerk / Firebase Auth", "Firebase Cloud Messaging"],
    features: ["Smart filtering & sorting", "Part-time gigs marketplace", "Secure authentication", "FCM push notifications", "Reviews & ratings"],
    shots: [
      s("/projects/local-services-connector/home.webp", "Local Services Connector home page", 1593, 877),
      s("/projects/local-services-connector/search-filters.webp", "Search and category filters", 1600, 793),
      s("/projects/local-services-connector/provider-listings.webp", "Service provider listings", 976, 862),
      s("/projects/local-services-connector/booking-form.webp", "Booking details form", 512, 619),
    ],
    github: "https://github.com/Raghuram1784/Local-Services-Connector",
    discipline: "Full-Stack",
    env: "services",
    brand: { bg: "#eef4ff", bg2: "#cfe0ff", accent: "#2563eb", ink: "#0b1d3a" },
  },
];

/** Projects shown on the site. */
export const projects = allProjects.filter((p) => !p.hidden);

/** Smaller builds listed under the exhibition (descriptions from their READMEs). */
export const archive = [
  { title: "BookHive", desc: "Spring Boot online bookstore with customer cart, invoices and an admin inventory dashboard.", tech: "Java · Spring Boot · MySQL", github: "https://github.com/Raghuram1784/BookHive" },
  { title: "NanoLink", desc: "Spring Boot URL shortener with MySQL persistence and live space-saved stats.", tech: "Java · Spring Boot · MySQL", github: "https://github.com/Raghuram1784/NanoLink" },
];
