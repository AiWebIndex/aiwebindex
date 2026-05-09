import Link from "next/link";
import { site } from "@/lib/site";

/*
  Home page. Mission, three CTAs, steward footnote. Intentionally
  short, because a documentation site's home page should answer
  "what is this and where do I go next?" in under 10 seconds.
*/

export default function HomePage() {
  return (
    <>
      <section style={{ padding: "72px 0 48px" }}>
        <div className="container-doc">
          <span className="pill pill-blue" style={{ marginBottom: 24 }}>
            {site.name} {site.protocolVersion} - {site.protocolStatus}
          </span>

          <h1 className="h-display" style={{ marginTop: 24 }}>
            An open protocol for AI-readable web indexing.
          </h1>

          <p
            style={{
              marginTop: 24,
              fontFamily: "var(--font-serif)",
              fontSize: "1.2rem",
              lineHeight: 1.6,
              color: "var(--color-fg-2)",
              maxWidth: "60ch",
            }}
          >
            {site.name} defines how AI systems and crawlers identify themselves,
            request structured representations of web pages, and verify ownership.
            It is unpatented, freely implementable, and stewarded openly by{" "}
            {site.steward.legalName}.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 36,
              flexWrap: "wrap",
            }}
          >
            <Link href="/spec" className="btn btn-primary">
              Read the spec
            </Link>
            <Link href="/implementations" className="btn btn-ghost">
              See implementations
            </Link>
            <Link href="/implementing" className="btn btn-ghost">
              Implement it yourself
            </Link>
          </div>
        </div>
      </section>

      <hr className="rule-soft" />

      {/* What the protocol covers - three concise tiles. */}
      <section style={{ padding: "56px 0" }}>
        <div className="container-doc">
          <span className="eyebrow">Scope</span>
          <h2 className="h-section" style={{ marginTop: 12 }}>
            What the protocol covers
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 18,
              marginTop: 28,
            }}
            className="home-tiles"
          >
            <Tile
              title="User-Agent"
              body={
                <>
                  Crawlers identify as{" "}
                  <code>{site.name}/{site.protocolVersion}</code> with a stable
                  reference URL. Site operators can allowlist or block
                  predictably.
                </>
              }
            />
            <Tile
              title="AIDocument format"
              body="One JSON envelope every implementation returns: title, canonical URL, markdown content, headings, links, structured data, and a crawl-info block."
            />
            <Tile
              title="Verification"
              body="Site owners prove they control a domain via DNS TXT records or a .well-known file. Implementations honor the result."
            />
          </div>

          <style>{`
            @media (max-width: 720px) {
              .home-tiles { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>

      <hr className="rule-soft" />

      {/* Why it matters - short stake-in-the-ground paragraph. */}
      <section style={{ padding: "56px 0 72px" }}>
        <div className="container-doc">
          <span className="eyebrow">Why open</span>
          <h2 className="h-section" style={{ marginTop: 12 }}>
            Standards win.
          </h2>
          <div className="prose-doc" style={{ marginTop: 20, maxWidth: "62ch" }}>
            <p>
              Search runs on robots.txt and sitemap.xml because they are
              open. Email runs on SMTP, IMAP, and DKIM because they are
              open. The web works because HTML and HTTP are open. The
              question of how AI systems read the web should be answered
              the same way: with a protocol, not a product.
            </p>
            <p>
              {site.name} is{" "}
              <strong>that protocol</strong>. The reference implementation lives
              at <a href={site.referenceImpl.url} target="_blank" rel="noopener noreferrer">
                {site.referenceImpl.name.toLowerCase()}.com
              </a>; anyone is free to build their own. {site.steward.legalName}{" "}
              holds no patents on the protocol&rsquo;s core mechanics and
              pledges not to seek such patents.
            </p>
            <p>
              <Link href="/about">Read the longer version &rarr;</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Tile({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className="card">
      <h3
        className="h-sub"
        style={{ marginBottom: 8, fontSize: "1rem", fontWeight: 600 }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: "0.9rem",
          lineHeight: 1.55,
          color: "var(--color-muted)",
        }}
      >
        {body}
      </p>
    </div>
  );
}
