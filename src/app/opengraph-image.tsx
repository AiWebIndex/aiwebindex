import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/*
  Dynamic OpenGraph image for aiwebindex.org. Rendered at request
  time by Next's `next/og` (Satori) so the brand text + tagline read
  sharply at the target size and so a redesign is one file edit
  away.

  Visual identity: deliberately academic / RFC-editor. Slate-blue on
  off-white. Source-Serif-style headline, mono wordmark + version
  pill. Distinct from lyrenth.com's OG image (paper-and-ink + signal
  green) so a card preview tells the viewer "this is a docs site,
  not a SaaS marketing surface."

  Satori does not load remote fonts in the build; we use the default
  inter / system fonts, which Satori bundles and renders pixel-sharp.
  No web font fetching, so build is deterministic offline.
*/

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = `${site.name}: ${site.tagline}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          color: "#0f172a",
          display: "flex",
          flexDirection: "column",
          padding: "72px",
          position: "relative",
        }}
      >
        {/* subtle grid texture: a column-edge rule on the left echoes the docs aesthetic */}
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 0,
            bottom: 0,
            width: 1,
            background: "#e2e8f0",
          }}
        />

        {/* wordmark: monospace, .org in blue accent (matches the live nav) */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            fontFamily: "monospace",
            fontSize: 28,
            fontWeight: 500,
            color: "#0f172a",
            letterSpacing: "-0.01em",
          }}
        >
          <span>aiwebindex</span>
          <span style={{ color: "#1e40af" }}>.org</span>
        </div>

        {/* status pill */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            border: "1px solid rgba(30,64,175,0.18)",
            borderRadius: 9999,
            background: "#eff6ff",
            color: "#1e40af",
            fontFamily: "monospace",
            fontSize: 18,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            alignSelf: "flex-start",
          }}
        >
          <span>{site.name}</span>
          <span style={{ color: "#2563eb" }}>{site.protocolVersion}</span>
          <span style={{ opacity: 0.7 }}>{site.protocolStatus}</span>
        </div>

        {/* headline: serif, the load-bearing element */}
        <div
          style={{
            marginTop: 36,
            fontSize: 72,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#0f172a",
            fontWeight: 600,
            // serif fallback ladder; Satori will pick the first available
            fontFamily: "Source Serif 4, Source Serif Pro, Iowan Old Style, serif",
            maxWidth: 980,
          }}
        >
          An open protocol for AI-readable web indexing.
        </div>

        {/* spacer pushes footer to the bottom */}
        <div style={{ flex: 1 }} />

        {/* footer line: steward + contact */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            color: "#475569",
            fontSize: 22,
          }}
        >
          <span>
            Stewarded by <span style={{ color: "#0f172a", fontWeight: 600 }}>{site.steward.legalName}</span>
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 20 }}>
            {site.contactEmail}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
