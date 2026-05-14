import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Implementations",
  description: `A list of products and projects implementing ${site.name} ${site.protocolVersion}. ${site.referenceImpl.name} is the reference commercial implementation.`,
};

/*
  /implementations: a directory of who has shipped against the
  protocol. Today there is exactly one entry (Lyrenth, the reference
  commercial implementation). The structure is laid out so adding
  more is just an array push, no redesign required when the second
  and third implementations land.

  Lyrenth is intentionally listed first AND clearly labeled
  "reference implementation" so a reader doesn't conclude
  "AIWebIndex is just Lyrenth-rebranded." The protocol exists
  independently; Lyrenth is one product that implements it.
*/

type ConformanceGap = {
  // Short label for the spec requirement that's not yet met,
  // e.g. "robots.txt Disallow (section 6.1, MUST)".
  requirement: string;
  // One-sentence plan + ETA. Honest, not aspirational.
  status: string;
};

type Implementation = {
  name: string;
  url: string;
  audience: string; // who it's for
  summary: string;
  hostingRegion: string;
  commercial: boolean;
  reference?: boolean;
  // Conformance disclosure: any spec requirement this implementation
  // does not yet meet, with a roadmap statement. An empty / absent
  // array means the implementation claims full conformance to the
  // current spec version. Listing items here is preferred over
  // silently misclaiming conformance; the directory is more useful
  // when readers can trust the conformance pill.
  conformanceGaps?: ConformanceGap[];
  // Optional public URL where the implementation maintains its own
  // conformance / crawler-policy page, for readers who want details
  // beyond the summary above.
  conformanceStatusUrl?: string;
};

const IMPLEMENTATIONS: Implementation[] = [
  {
    name: site.referenceImpl.name,
    url: site.referenceImpl.url,
    audience: "AI agent builders, site owners, anyone needing extracted web pages",
    summary:
      "Hosted API + dashboards with verified-domain ownership, per-page caching, and a free tier. Operated by Aleksma AI Inc. as the protocol's steward; serves as the reference for all required behaviors.",
    hostingRegion: "EU (Frankfurt + Falkenstein)",
    commercial: true,
    reference: true,
    // No conformance gaps disclosed. The Lyrenth crawler enforces
    // robots.txt Disallow (section 6.1, MUST) and honors Crawl-delay
    // (section 6.2, MAY) as of the 026 migration / RFC 9309 commit.
    // Operational details live on the linked status page below.
    conformanceStatusUrl: "https://lyrenth.com/crawler-policy",
  },
];

export default function ImplementationsPage() {
  return (
    <article style={{ padding: "48px 0 72px" }}>
      <div className="container-doc">
        <span className="eyebrow">Directory</span>
        <h1 className="h-display" style={{ marginTop: 12 }}>
          Implementations
        </h1>
        <p
          style={{
            marginTop: 20,
            fontFamily: "var(--font-serif)",
            fontSize: "1.15rem",
            lineHeight: 1.6,
            color: "var(--color-fg-2)",
            maxWidth: "60ch",
          }}
        >
          Products and projects that implement {site.name}{" "}
          {site.protocolVersion}. Listed implementations target the
          MUST-level requirements in the{" "}
          <Link href="/spec">specification</Link>; any conformance
          gaps an implementation has not yet closed are disclosed
          per-row below, so the directory stays useful even while
          the ecosystem matures.
        </p>

        <hr className="rule-soft" style={{ marginTop: 32 }} />

        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 18 }}>
          {IMPLEMENTATIONS.map((impl) => (
            <ImplementationRow key={impl.name} impl={impl} />
          ))}
        </div>

        {/* "Get listed" callout. Keeps the directory feel from being
            a Lyrenth marketing page; explicitly invites others. */}
        <div
          className="card"
          style={{
            marginTop: 40,
            background: "var(--color-accent-soft)",
            borderColor: "rgba(30, 64, 175, 0.18)",
          }}
        >
          <h3 className="h-sub" style={{ marginBottom: 8 }}>
            Implementing {site.name}? Get listed.
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "0.92rem",
              lineHeight: 1.6,
              color: "var(--color-fg-2)",
            }}
          >
            If you ship a product or open-source project that implements{" "}
            {site.name}, email{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>{" "}
            with your conformance details. Listed implementations link out
            to your own site. No editorial gatekeeping; we verify that
            the MUST-level requirements are met OR that any gaps are
            disclosed honestly with a roadmap.
          </p>
        </div>

        <hr className="rule-soft" style={{ marginTop: 40 }} />

        <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/implementing" className="btn btn-primary">
            Implementer&rsquo;s guide &rarr;
          </Link>
          <Link href="/spec" className="btn btn-ghost">
            Read the spec
          </Link>
        </div>
      </div>
    </article>
  );
}

function ImplementationRow({ impl }: { impl: Implementation }) {
  return (
    <div className="card" style={{ padding: "1.4rem 1.6rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 8,
        }}
      >
        <h2
          className="h-section"
          style={{
            margin: 0,
            fontSize: "1.3rem",
            fontFamily: "var(--font-serif)",
          }}
        >
          <a
            href={impl.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-fg)", textDecoration: "none" }}
          >
            {impl.name}
            <span
              aria-hidden
              style={{
                color: "var(--color-mute-2)",
                fontWeight: 400,
                marginLeft: 8,
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                fontStyle: "normal",
              }}
            >
              {impl.url.replace(/^https?:\/\//, "").replace(/\/$/, "")} &rarr;
            </span>
          </a>
        </h2>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {impl.reference ? (
            <span className="pill pill-blue">Reference</span>
          ) : null}
          <span className="pill">{impl.commercial ? "Commercial" : "Open source"}</span>
          <span className="pill">{impl.hostingRegion}</span>
        </div>
      </div>
      <p
        style={{
          fontSize: "0.78rem",
          color: "var(--color-mute-2)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontFamily: "var(--font-mono)",
          margin: "8px 0 12px",
        }}
      >
        For: {impl.audience}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "0.95rem",
          lineHeight: 1.6,
          color: "var(--color-fg-2)",
        }}
      >
        {impl.summary}
      </p>

      {impl.conformanceGaps && impl.conformanceGaps.length > 0 ? (
        <div
          style={{
            marginTop: 16,
            padding: "12px 14px",
            borderRadius: 8,
            border: "1px solid rgba(180, 100, 0, 0.18)",
            background: "rgba(255, 200, 100, 0.06)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontFamily: "var(--font-mono)",
              color: "var(--color-mute-2)",
            }}
          >
            Disclosed conformance gaps
          </p>
          <ul
            style={{
              margin: "8px 0 0",
              paddingLeft: "1.2em",
              fontSize: "0.9rem",
              lineHeight: 1.55,
              color: "var(--color-fg-2)",
            }}
          >
            {impl.conformanceGaps.map((g) => (
              <li key={g.requirement} style={{ marginBottom: 6 }}>
                <strong style={{ color: "var(--color-fg)" }}>{g.requirement}.</strong>{" "}
                {g.status}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {impl.conformanceStatusUrl ? (
        <p style={{ margin: "12px 0 0", fontSize: "0.85rem", color: "var(--color-fg-2)" }}>
          {impl.conformanceGaps && impl.conformanceGaps.length > 0
            ? "Implementation’s own status page: "
            : "Conformance status page: "}
          <a
            href={impl.conformanceStatusUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {impl.conformanceStatusUrl.replace(/^https?:\/\//, "")}
          </a>
        </p>
      ) : null}
    </div>
  );
}
