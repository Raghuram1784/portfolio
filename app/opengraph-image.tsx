import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} · Software Developer · AI/ML Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 0% 0%, #24508f 0%, #1b3a6b 45%, #0d1a31 100%)",
          color: "#fbf6ec",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, color: "#ebd3a0" }}>
          <div style={{ width: 60, height: 2, background: "#c9a053" }} />
          Portfolio
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, fontStyle: "italic", color: "#f3e3bd" }}>Hello, I&apos;m</div>
          <div style={{ fontSize: 150, fontWeight: 700, lineHeight: 1, letterSpacing: -4 }}>{site.name}</div>
          <div style={{ width: 360, height: 6, borderRadius: 6, background: "#c9a053", marginTop: 18, marginLeft: 220 }} />
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#f2e6d0", gap: 22 }}>
          {site.roles.map((r, i) => (
            <span key={r} style={{ display: "flex", alignItems: "center", gap: 22 }}>
              {i > 0 && <span style={{ color: "#c9a053" }}>•</span>}
              {r}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
