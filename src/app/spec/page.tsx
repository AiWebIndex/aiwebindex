import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} ${site.protocolVersion} Specification`,
  description: `The formal specification for ${site.name} ${site.protocolVersion}, an open protocol for AI-readable web indexing.`,
};

/*
  The AIWebIndex 1.0 specification. Written in RFC voice: precise,
  unambiguous, normative language ("MUST", "SHOULD", "MAY" per
  RFC 2119). Section structure mirrors what readers expect from
  Internet drafts so the document feels familiar to standards-aware
  audiences.

  Section anchors: every heading carries an id so deep links work
  ("/spec#section-4-2"). The .section-anchor span renders a hidden
  "§" that becomes visible on hover (standard documentation
  affordance).

  Updated: this is the published 1.0 draft; subsequent revisions
  bump the version + add a change-log entry.
*/

function Anchor({ id }: { id: string }) {
  return (
    <a href={`#${id}`} className="section-anchor" aria-label="Section anchor">
      §
    </a>
  );
}

export default function SpecPage() {
  return (
    <article style={{ padding: "48px 0 72px" }}>
      <div className="container-doc">
        <span className="eyebrow">Specification</span>
        <h1 className="h-display" style={{ marginTop: 12 }}>
          {site.name} {site.protocolVersion}
        </h1>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span className="pill pill-blue">{site.protocolStatus}</span>
          <span className="pill">Published {site.publishedDate}</span>
          <span className="pill">Editor: {site.steward.legalName}</span>
        </div>

        <hr className="rule-soft" style={{ marginTop: 32 }} />

        <div className="prose-doc" style={{ marginTop: 32 }}>
          {/* ---- Status & abstract ---- */}
          <h2 id="status">
            Status of this document <Anchor id="status" />
          </h2>
          <p>
            This document is a draft of the {site.name} {site.protocolVersion}{" "}
            specification, published by {site.steward.legalName} as steward of
            the protocol. It describes a stable interface intended for adoption
            by AI systems, web crawlers, and site operators.
          </p>
          <p>
            Implementations conforming to this specification are interoperable.{" "}
            {site.steward.legalName} holds no patents on the protocol&rsquo;s
            core mechanics and pledges not to seek such patents. Comments,
            questions, and proposed revisions may be sent to{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>

          <h2 id="abstract">
            Abstract <Anchor id="abstract" />
          </h2>
          <p>
            {site.name} defines a small, focused protocol for AI-readable web
            indexing. It specifies (a) a User-Agent identifier crawlers MUST
            send when fetching content as part of an {site.name} workflow, (b)
            a JSON envelope, AIDocument, that interoperable implementations
            return, and (c) a verification mechanism that allows a site
            operator to prove ownership of a domain to a registrar of
            {" "}
            {site.name} implementations.
          </p>

          {/* ---- 1 Introduction ---- */}
          <h2 id="section-1">
            1. Introduction <Anchor id="section-1" />
          </h2>

          <h3 id="section-1-1">
            1.1 Background <Anchor id="section-1-1" />
          </h3>
          <p>
            AI systems increasingly fetch web content on behalf of end users.
            They face two practical problems: (1) origin servers cannot tell
            them apart from generic browsers or search crawlers, which makes
            allowlisting, rate-limiting, and abuse handling unreliable; and
            (2) every implementation invents its own way of representing
            extracted content, fragmenting downstream tooling.
          </p>
          <p>
            {site.name} addresses both: a single User-Agent token any
            compliant crawler sends, and a single JSON shape any compliant
            implementation returns. The protocol is intentionally minimal.
            It does not standardize ranking, retrieval, or storage. Those
            decisions remain with each implementation.
          </p>

          <h3 id="section-1-2">
            1.2 Goals <Anchor id="section-1-2" />
          </h3>
          <ul>
            <li>
              Give site operators a single, stable identity to allowlist or
              block when an AI system reads their content.
            </li>
            <li>
              Give consumers (AI agents, downstream tools) a single document
              shape they can rely on regardless of which {site.name}{" "}
              implementation produced it.
            </li>
            <li>
              Give site owners a domain-verification mechanism that does not
              depend on any single implementation&rsquo;s account system.
            </li>
            <li>
              Stay implementable in a weekend. The protocol covers what is
              shared across implementations; everything else is out of scope.
            </li>
          </ul>

          <h3 id="section-1-3">
            1.3 Non-goals <Anchor id="section-1-3" />
          </h3>
          <ul>
            <li>
              Ranking. {site.name} is silent on which pages an AI system
              should prefer; that is a product decision.
            </li>
            <li>
              Storage. The protocol does not require persistent caching, an
              index, or any specific data lifetime.
            </li>
            <li>
              Authentication. {site.name} does not standardize end-user auth
              between an AI system and an origin; per-implementation API keys
              and OAuth flows are out of scope.
            </li>
            <li>
              Pricing. The protocol is free of fees by construction.
              Implementations may charge their own customers as they see fit.
            </li>
          </ul>

          {/* ---- 2 Conformance ---- */}
          <h2 id="section-2">
            2. Conformance <Anchor id="section-2" />
          </h2>
          <p>
            The key words <strong>MUST</strong>, <strong>MUST NOT</strong>,{" "}
            <strong>REQUIRED</strong>, <strong>SHALL</strong>,{" "}
            <strong>SHALL NOT</strong>, <strong>SHOULD</strong>,{" "}
            <strong>SHOULD NOT</strong>, <strong>RECOMMENDED</strong>,{" "}
            <strong>MAY</strong>, and <strong>OPTIONAL</strong> in this
            document are to be interpreted as described in RFC 2119, when, and
            only when, they appear in all capitals.
          </p>
          <p>
            An implementation conforms to {site.name} {site.protocolVersion}{" "}
            if it satisfies all the MUST-level requirements in sections 3, 4,
            and 5 of this document.
          </p>

          {/* ---- 3 User-Agent ---- */}
          <h2 id="section-3">
            3. User-Agent identifier <Anchor id="section-3" />
          </h2>
          <p>
            Conforming crawlers <strong>MUST</strong> send an HTTP{" "}
            <code>User-Agent</code> header that begins with the string{" "}
            <code>{site.name}/{site.protocolVersion}</code> when fetching
            content as part of a protocol-driven workflow.
          </p>
          <p>
            The full User-Agent value <strong>SHOULD</strong> include a
            URL where site operators can read about the implementation. A
            conformant value looks like:
          </p>
          <pre>
            <code>
              {`User-Agent: ${site.name}/${site.protocolVersion} (+https://example.com/bot; <implementation-name>)`}
            </code>
          </pre>
          <p>
            A separate verification fetch (Section 5) <strong>SHOULD</strong>{" "}
            use a User-Agent value with the suffix{" "}
            <code>verification</code> appended so site operators can
            distinguish on-demand crawls from ownership checks:
          </p>
          <pre>
            <code>{`User-Agent: ${site.name}/${site.protocolVersion} verification (+https://example.com/bot)`}</code>
          </pre>
          <p>
            Implementations <strong>MUST NOT</strong> impersonate other
            User-Agent strings (browsers, search crawlers, generic libraries)
            in lieu of the {site.name} identifier when performing
            protocol-driven fetches.
          </p>

          {/* ---- 4 AIDocument ---- */}
          <h2 id="section-4">
            4. AIDocument format <Anchor id="section-4" />
          </h2>

          <h3 id="section-4-1">
            4.1 Top-level structure <Anchor id="section-4-1" />
          </h3>
          <p>
            An AIDocument is a JSON object representing the structured
            extraction of a single URL. Conformant implementations{" "}
            <strong>MUST</strong> return objects with the following top-level
            fields when describing a fetched page:
          </p>
          <pre>
            <code>{`{
  "url":          "string",          // the FINAL URL after redirects
  "canonical_url":"string",          // optional; rel="canonical" if present
  "title":        "string",
  "description":  "string",          // optional
  "markdown":     "string",          // cleaned content
  "headings":     [/* Heading[] */], // h1-h6 in document order
  "links":        [/* Link[] */],    // outbound links
  "images":       [/* Image[] */],   // optional
  "meta":         {/* MetaData */},
  "structured_data": {/* JSON-LD if present */},
  "crawl":        {/* CrawlInfo */}
}`}</code>
          </pre>
          <p>
            Field names and JSON shapes are stable. Additive changes
            (new optional fields) are permitted within a major version;
            removals or renames require a new major version.
          </p>

          <h3 id="section-4-2">
            4.2 Field definitions <Anchor id="section-4-2" />
          </h3>
          <p>
            <strong>url</strong> (string, required). The URL the document
            represents, after any HTTP redirects. <strong>MUST</strong> be a
            fully-qualified absolute URL.
          </p>
          <p>
            <strong>canonical_url</strong> (string, optional). The value of
            the <code>&lt;link rel=&quot;canonical&quot;&gt;</code> tag if
            present in the source page; otherwise omitted.
          </p>
          <p>
            <strong>title</strong> (string, required). The page title, taken
            from <code>og:title</code>, the first <code>h1</code>, or the{" "}
            <code>&lt;title&gt;</code> tag, in that preference order.
          </p>
          <p>
            <strong>description</strong> (string, optional). Page description
            from <code>meta[name=description]</code> or{" "}
            <code>og:description</code>.
          </p>
          <p>
            <strong>markdown</strong> (string, required). Cleaned, structured
            markdown of the main page content. Boilerplate (navigation,
            footers, ads) <strong>SHOULD</strong> be removed. Implementations{" "}
            <strong>MAY</strong> use any extraction algorithm.
          </p>
          <p>
            <strong>headings</strong> (array, required). Headings in document
            order. Each entry has{" "}
            <code>{"{ level: number, text: string, id?: string }"}</code>.
            Levels are 1-6 corresponding to <code>h1</code>-<code>h6</code>.
          </p>
          <p>
            <strong>links</strong> (array, required). Outbound{" "}
            <code>&lt;a href&gt;</code> elements. Each entry has{" "}
            <code>{"{ url, text?, internal: boolean, rel? }"}</code>. The{" "}
            <code>internal</code> field is true if the link target&rsquo;s
            host equals the source page&rsquo;s host.
          </p>
          <p>
            <strong>images</strong> (array, optional). <code>&lt;img&gt;</code>{" "}
            elements with {`{ url, alt? }`}.
          </p>
          <p>
            <strong>meta</strong> (object, required). Derived metadata: at
            minimum <code>language</code> (BCP 47),{" "}
            <code>word_count</code> (integer), <code>reading_time</code>{" "}
            (minutes, integer). Implementations <strong>MAY</strong> include
            additional fields (<code>author</code>, <code>site_name</code>,{" "}
            <code>keywords</code>, <code>og_image</code>,{" "}
            <code>published</code>, <code>modified</code>).
          </p>
          <p>
            <strong>structured_data</strong> (object, optional). JSON-LD
            blocks extracted from the source page, normalized to a single
            object whose keys are schema.org type names.
          </p>
          <p>
            <strong>crawl</strong> (object, required). Information about how
            and when the document was fetched:{" "}
            <code>fetched_at</code> (RFC 3339 timestamp),{" "}
            <code>status_code</code> (HTTP integer),{" "}
            <code>render_mode</code> (<code>&quot;static&quot;</code> or{" "}
            <code>&quot;rendered&quot;</code>),{" "}
            <code>fetch_duration_ms</code> (integer),{" "}
            <code>content_length</code> (integer bytes),{" "}
            <code>user_agent</code> (string).
          </p>

          <h3 id="section-4-3">
            4.3 Example <Anchor id="section-4-3" />
          </h3>
          <pre>
            <code>{`{
  "url": "https://example.com/article",
  "canonical_url": "https://example.com/article",
  "title": "How HTTP works",
  "description": "A friendly introduction to HTTP request/response.",
  "markdown": "# How HTTP works\\n\\nWhen a client...",
  "headings": [
    { "level": 1, "text": "How HTTP works" },
    { "level": 2, "text": "Requests" }
  ],
  "links": [
    { "url": "https://www.rfc-editor.org/rfc/rfc7230",
      "text": "RFC 7230",
      "internal": false }
  ],
  "meta": {
    "language": "en",
    "word_count": 1240,
    "reading_time": 5
  },
  "crawl": {
    "fetched_at": "2026-05-10T12:34:56Z",
    "status_code": 200,
    "render_mode": "static",
    "fetch_duration_ms": 412,
    "content_length": 18402,
    "user_agent": "AIWebIndex/1.0 (+https://example.com/bot; example-impl)"
  }
}`}</code>
          </pre>

          {/* ---- 5 Verification ---- */}
          <h2 id="section-5">
            5. Verification mechanism <Anchor id="section-5" />
          </h2>
          <p>
            A site owner proves they control a domain by responding to a
            verification token. Conformant implementations{" "}
            <strong>MUST</strong> support at least one of the two methods
            below; implementations <strong>SHOULD</strong> support both.
          </p>

          <h3 id="section-5-1">
            5.1 DNS TXT record <Anchor id="section-5-1" />
          </h3>
          <p>
            The implementation generates a verification token and instructs
            the owner to publish a DNS TXT record under{" "}
            <code>_aiwebindex-verify.&lt;domain&gt;</code> with the value{" "}
            <code>aiwi-verify=&lt;token&gt;</code>:
          </p>
          <pre>
            <code>{`_aiwebindex-verify.example.com  TXT  "aiwi-verify=8a93c5f2..."`}</code>
          </pre>
          <p>
            The implementation <strong>MUST</strong> query at least one
            authoritative DNS resolver for this record. The implementation{" "}
            <strong>SHOULD</strong> query multiple resolvers (e.g., 1.1.1.1,
            8.8.8.8, 9.9.9.9) in parallel to tolerate misconfigured local
            resolvers.
          </p>

          <h3 id="section-5-2">
            5.2 .well-known file <Anchor id="section-5-2" />
          </h3>
          <p>
            The owner publishes a plain-text file at{" "}
            <code>https://&lt;domain&gt;/.well-known/aiwebindex-verify.txt</code>{" "}
            whose body contains <code>aiwi-verify=&lt;token&gt;</code>:
          </p>
          <pre>
            <code>{`# https://example.com/.well-known/aiwebindex-verify.txt
aiwi-verify=8a93c5f2...`}</code>
          </pre>
          <p>
            The implementation <strong>MUST</strong> fetch the file over
            HTTPS. Plain HTTP fetches <strong>MUST</strong> be rejected.
            The implementation <strong>SHOULD</strong> follow up to 3
            redirects within the same registrable domain; cross-domain
            redirects <strong>MUST NOT</strong> count as a successful
            verification.
          </p>

          {/* ---- 6 Crawler behavior ---- */}
          <h2 id="section-6">
            6. Crawler behavior <Anchor id="section-6" />
          </h2>

          <h3 id="section-6-1">
            6.1 robots.txt compliance <Anchor id="section-6-1" />
          </h3>
          <p>
            Conforming crawlers <strong>MUST</strong> honor{" "}
            <code>robots.txt</code> directives addressed to{" "}
            <code>{site.name}</code> as the User-Agent. Wildcard rules
            (<code>User-agent: *</code>) <strong>MUST</strong> apply when no
            agent-specific block is present.
          </p>

          <h3 id="section-6-2">
            6.2 Rate limiting <Anchor id="section-6-2" />
          </h3>
          <p>
            Implementations <strong>SHOULD</strong> enforce a per-origin
            cooldown between consecutive fetches of the same domain.{" "}
            <strong>2 seconds</strong> is RECOMMENDED as the minimum default;
            implementations <strong>MAY</strong> raise this for sites that
            request a longer Crawl-delay in <code>robots.txt</code>.
          </p>

          <h3 id="section-6-3">
            6.3 Backoff <Anchor id="section-6-3" />
          </h3>
          <p>
            Implementations <strong>MUST</strong> respect HTTP{" "}
            <code>429 Too Many Requests</code> responses by pausing fetches
            to that origin for at least the duration of the{" "}
            <code>Retry-After</code> header, or 60 seconds if absent.
            Implementations <strong>MUST</strong> respect{" "}
            <code>503 Service Unavailable</code> the same way.
          </p>

          {/* ---- 7 Security ---- */}
          <h2 id="section-7">
            7. Security considerations <Anchor id="section-7" />
          </h2>
          <p>
            <strong>Verification tokens.</strong> Implementations{" "}
            <strong>MUST</strong> generate verification tokens with at least
            128 bits of entropy and <strong>SHOULD</strong> rotate them on
            every issuance. A token previously issued for a domain{" "}
            <strong>MUST NOT</strong> be reused for a different domain
            without explicit user action.
          </p>
          <p>
            <strong>HTTPS only for fetch.</strong> Verification fetches
            (Section 5.2) <strong>MUST</strong> use HTTPS. Crawl fetches{" "}
            <strong>SHOULD</strong> prefer HTTPS where the origin advertises
            it.
          </p>
          <p>
            <strong>Origin spoofing.</strong> Implementations{" "}
            <strong>MUST NOT</strong> fabricate{" "}
            <code>User-Agent</code> strings to imitate browsers or search
            crawlers in order to bypass site-operator decisions.
          </p>
          <p>
            <strong>Authenticated content.</strong> Implementations{" "}
            <strong>MUST NOT</strong> attempt to bypass paywalls, login
            walls, or technical access controls. The protocol applies only
            to publicly accessible content.
          </p>

          {/* ---- 8 Privacy ---- */}
          <h2 id="section-8">
            8. Privacy considerations <Anchor id="section-8" />
          </h2>
          <p>
            <strong>End-user identity.</strong> The protocol carries no
            field for end-user identification. Implementations{" "}
            <strong>MUST NOT</strong> embed end-user identifiers (IP
            addresses, cookies, account IDs of the agent&rsquo;s caller) into
            either the request or the AIDocument response.
          </p>
          <p>
            <strong>PII in extracted content.</strong> Source pages may
            contain personally-identifying information published by their
            authors. The protocol does not require implementations to remove
            or transform such content; downstream consumers are responsible
            for compliance with applicable data-protection law.
          </p>
          <p>
            <strong>Verification record visibility.</strong> DNS TXT records
            and HTTP files used for verification (Section 5) are public.
            Site owners <strong>SHOULD</strong> use opaque tokens, not human
            identifiers, in those records.
          </p>

          {/* ---- 9 References ---- */}
          <h2 id="section-9">
            9. References <Anchor id="section-9" />
          </h2>
          <p>
            <strong>RFC 2119</strong>: Key words for use in RFCs to
            indicate requirement levels.{" "}
            <a
              href="https://www.rfc-editor.org/rfc/rfc2119"
              target="_blank"
              rel="noopener noreferrer"
            >
              rfc-editor.org/rfc/rfc2119
            </a>
          </p>
          <p>
            <strong>RFC 3339</strong>: Date and Time on the Internet:
            Timestamps.{" "}
            <a
              href="https://www.rfc-editor.org/rfc/rfc3339"
              target="_blank"
              rel="noopener noreferrer"
            >
              rfc-editor.org/rfc/rfc3339
            </a>
          </p>
          <p>
            <strong>RFC 9309</strong>: Robots Exclusion Protocol.{" "}
            <a
              href="https://www.rfc-editor.org/rfc/rfc9309"
              target="_blank"
              rel="noopener noreferrer"
            >
              rfc-editor.org/rfc/rfc9309
            </a>
          </p>
          <p>
            <strong>BCP 47</strong>: Tags for Identifying Languages.{" "}
            <a
              href="https://www.rfc-editor.org/info/bcp47"
              target="_blank"
              rel="noopener noreferrer"
            >
              rfc-editor.org/info/bcp47
            </a>
          </p>
          <p>
            <strong>schema.org</strong>: Structured-data vocabulary.{" "}
            <a
              href="https://schema.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              schema.org
            </a>
          </p>

          {/* ---- Version history ---- */}
          <h2 id="version-history">
            Version history <Anchor id="version-history" />
          </h2>
          <p>
            <strong>1.0 ({site.publishedDate}).</strong> Initial publication.
          </p>
        </div>

        <hr className="rule-soft" style={{ marginTop: 40 }} />

        <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/implementing" className="btn btn-primary">
            How to implement &rarr;
          </Link>
          <Link href="/implementations" className="btn btn-ghost">
            See who&rsquo;s implementing
          </Link>
        </div>
      </div>
    </article>
  );
}
