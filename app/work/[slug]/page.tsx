import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { CaseStudy } from "@/components/case/CaseStudy";
import { Cursor } from "@/components/layout/Cursor";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { BackToTop } from "@/components/layout/BackToTop";
import { Footer } from "@/components/layout/Footer";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  const title = `${p.title}: ${p.tagline}`;
  return {
    title,
    description: p.description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      type: "article",
      url: `${site.url}/work/${p.slug}`,
      title: `${p.title} · ${site.name}`,
      description: p.tagline,
      images: p.cover ? [{ url: p.cover, width: 1600, height: 1000, alt: `${p.title} cover` }] : undefined,
    },
    twitter: { card: "summary_large_image", title: `${p.title} · ${site.name}`, description: p.tagline, images: p.cover ? [p.cover] : undefined },
  };
}

export default async function WorkPage({ params }: Params) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const project = projects[i];
  const next = projects[(i + 1) % projects.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.tagline,
    description: project.description,
    image: project.cover ? `${site.url}${project.cover}` : undefined,
    author: { "@type": "Person", name: site.fullName, url: site.url },
    url: `${site.url}/work/${project.slug}`,
    ...(project.github ? { codeRepository: project.github } : {}),
  };

  return (
    <>
      <ScrollProgress />
      <Cursor />
      <CaseStudy project={project} index={i} total={projects.length} next={next} />
      <Footer />
      <BackToTop />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
