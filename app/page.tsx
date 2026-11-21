import fs from "node:fs";
import path from "node:path";
import { site } from "@/content/site";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/layout/Cursor";
import { Preloader } from "@/components/layout/Preloader";
import { BackToTop } from "@/components/layout/BackToTop";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";

/** Only show resume/portrait UI when the files actually exist (no broken links). */
function publicFileExists(p: string) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", p.replace(/^\//, "")));
  } catch {
    return false;
  }
}

export default function Home() {
  const resumeAvailable = publicFileExists(site.resumePath);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.fullName,
    jobTitle: site.roles.join(", "),
    url: site.url,
    sameAs: [site.socials.github, site.socials.linkedin],
    address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "KL University" },
  };

  return (
    <>
      <Preloader />
      <ScrollProgress />
      <Cursor />
      <Navbar resumeAvailable={resumeAvailable} />
      <main id="main">
        <Hero resumeAvailable={resumeAvailable} />
        <Projects />
        <About />
        <Experience />
        <Skills />
        <Certifications />
        <Contact resumeAvailable={resumeAvailable} />
      </main>
      <Footer />
      <BackToTop />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
