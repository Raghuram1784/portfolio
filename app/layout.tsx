import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/content/site";
import fs from "node:fs";
import path from "node:path";
import { Providers } from "@/components/layout/Providers";
import { Terminal } from "@/components/layout/Terminal";
import "./globals.css";

const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-400.woff2", weight: "400" },
    { path: "./fonts/GeneralSans-500.woff2", weight: "500" },
    { path: "./fonts/GeneralSans-600.woff2", weight: "600" },
    { path: "./fonts/GeneralSans-700.woff2", weight: "700" },
  ],
  variable: "--font-general",
  display: "swap",
});
const clash = localFont({
  src: [
    { path: "./fonts/ClashDisplay-500.woff2", weight: "500" },
    { path: "./fonts/ClashDisplay-600.woff2", weight: "600" },
    { path: "./fonts/ClashDisplay-700.woff2", weight: "700" },
  ],
  variable: "--font-clash",
  display: "swap",
});
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  keywords: ["Raghuram", "Yandamuri Mohana Venkata Raghuram", "Y.M.V. Raghuram", "Software Developer", "AI/ML Engineer", "Full-Stack Developer", "Flutter", "Next.js", "Portfolio"],
  authors: [{ name: site.fullName, url: site.socials.linkedin }],
  creator: site.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: `${site.name} · Portfolio`,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf5ec" },
    { media: "(prefers-color-scheme: dark)", color: "#111f36" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${generalSans.variable} ${clash.variable} ${instrument.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-lapis-700 focus:px-5 focus:py-3 focus:text-ivory"
        >
          Skip to content
        </a>
        <Providers>
          {children}
          <Terminal resumeAvailable={fs.existsSync(path.join(process.cwd(), "public", site.resumePath.replace(/^\//, "")))} />
        </Providers>
      </body>
    </html>
  );
}
