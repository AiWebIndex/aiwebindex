import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} ${site.protocolVersion} Specification`,
  description: `The formal specification for ${site.name} ${site.protocolVersion}, an open protocol for AI-readable web indexing.`,
};

/*
  The AIWebIndex 2.0 specification. Written in RFC voice: precise,
  unambiguous, normative language ("MUST", "SHOULD", "MAY" per
  RFC 2119). Section structure mirrors what readers expect from
  Internet drafts so the document feels familiar to standards-aware
  audiences.

  Section anchors: every heading carries an id so deep links work
  ("/spec#section-4-2"). The .section-anchor span renders a hidden
  "§" that becomes visible on hover (standard documentation
  affordance).

  Versioning: 2.0 is the current major. It supersedes 1.0 by
  regrouping the flat AIDocument envelope into semantic blocks
  (schema / source / cache / identity / content / structure /
  signals / optional economics). Section 4.4 documents the migration
  field-by-field. The 1.0 spec text remains valid for 1.0
  implementations; the standards-body rule is that breaking
  changes require a major bump, which is what 2.0 represents.
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
            extraction of a single URL. Conformant 2.0 implementations{" "}
            <strong>MUST</strong> return objects with the following top-level
            groups when describing a fetched page:
          </p>
          <pre>
            <code>{`{
  "schema":    { /* SchemaInfo */    },  // required
  "source":    { /* SourceInfo */    },  // required
  "cache":     { /* CacheInfo */     },  // required
  "identity":  { /* IdentityInfo */  },  // required
  "content":   { /* ContentInfo */   },  // required
  "structure": { /* StructureInfo */ },  // required
  "signals":   { /* SignalsInfo */   },  // required
  "economics": { /* EconomicsInfo */ }   // optional
}`}</code>
          </pre>
          <p>
            Top-level groups are a stable contract. Removing a group or
            renaming a key requires a new major version. Adding a new
            optional group (or a new optional field inside an existing
            group) within 2.x is permitted.
          </p>
          <p>
            The grouped layout is the headline change between {site.name}{" "}
            1.0 and 2.0. The motivation is that AI consumers can route on
            the block they care about (identity vs. structure vs. cost)
            without parsing the entire envelope, and the boundaries between
            &ldquo;what we fetched&rdquo; (<code>source</code>) and{" "}
            &ldquo;what happened on this call&rdquo; (<code>cache</code>) are
            explicit instead of implied. See Section 4.4 for a field-by-field
            migration map from 1.0.
          </p>

          <h3 id="section-4-2">
            4.2 Field definitions <Anchor id="section-4-2" />
          </h3>

          <h4 id="section-4-2-schema">schema (required)</h4>
          <p>
            Identifies the shape and version of the response so consumers
            can route by version.
          </p>
          <ul>
            <li>
              <strong>name</strong> (string, required).{" "}
              <strong>MUST</strong> be the literal{" "}
              <code>&quot;AIDocument&quot;</code>.
            </li>
            <li>
              <strong>version</strong> (string, required). The spec major.minor
              version the response conforms to. Conformant 2.0 implementations
              emit <code>&quot;2.0&quot;</code>; conformant 2.x revisions
              emit the corresponding minor (e.g. <code>&quot;2.1&quot;</code>).
            </li>
            <li>
              <strong>ref</strong> (string, optional). An opaque,
              content-addressed identifier of the document fingerprint,
              prefixed with <code>aidoc:</code>. The reference implementation
              uses <code>aidoc:sha256:&lt;32 hex chars&gt;</code> (a
              128-bit prefix of a SHA-256 over the non-volatile fields:
              url, canonical_url, title, description, language,
              content_type, markdown, headings, links, images,
              structured_data). The identifier is stable across cache
              states and re-crawls of an unchanged page.
            </li>
          </ul>

          <h4 id="section-4-2-source">source (required)</h4>
          <p>
            Describes what was fetched and how. Independent of cache state:
            even on a cache hit, these fields describe the underlying
            snapshot (which may be older than the current call).
          </p>
          <ul>
            <li>
              <strong>url</strong> (string, required). The URL the document
              represents, after any HTTP redirects.{" "}
              <strong>MUST</strong> be a fully-qualified absolute URL.
            </li>
            <li>
              <strong>canonical_url</strong> (string, optional). The value
              of the <code>&lt;link rel=&quot;canonical&quot;&gt;</code> tag
              if present in the source page; otherwise omitted.
            </li>
            <li>
              <strong>fetched_at</strong> (string, optional). RFC 3339
              timestamp of the underlying snapshot. Omitted on documents
              that predate the field.
            </li>
            <li>
              <strong>render_mode</strong> (string, optional). How the page
              was rendered. One of <code>&quot;static&quot;</code> (direct
              HTTP fetch), <code>&quot;rendered&quot;</code> (JS execution
              was required), or{" "}
              <code>&quot;static_after_render_failure&quot;</code>{" "}
              (renderer attempted but fell back to the static HTML).
            </li>
            <li>
              <strong>status_code</strong> (integer, optional). HTTP status
              from the origin at fetch time.
            </li>
            <li>
              <strong>freshness_policy</strong> (string, required). The
              policy the CALLER requested for this call. One of{" "}
              <code>&quot;cache_first&quot;</code> or{" "}
              <code>&quot;force_refresh&quot;</code>. The outcome lives in{" "}
              <code>cache.status</code>.
            </li>
          </ul>

          <h4 id="section-4-2-cache">cache (required)</h4>
          <p>
            Describes what happened on the implementation side for{" "}
            <em>this</em> specific call. The <code>status</code> string is a
            coarse-grained label; the two booleans are the precise truth.
          </p>
          <ul>
            <li>
              <strong>status</strong> (string, required). One of{" "}
              <code>&quot;hit&quot;</code> (cached snapshot served, origin
              not contacted), <code>&quot;miss&quot;</code>{" "}
              (<code>cache_first</code> policy, no cache hit, body fetched
              from origin), <code>&quot;refreshed&quot;</code>{" "}
              (<code>force_refresh</code> policy, body fetched from
              origin), or <code>&quot;stale_revalidated&quot;</code>{" "}
              (origin returned <code>304 Not Modified</code>, no body).
            </li>
            <li>
              <strong>origin_contacted</strong> (boolean, required).
            </li>
            <li>
              <strong>body_fetched</strong> (boolean, required).
            </li>
          </ul>

          <h4 id="section-4-2-identity">identity (required)</h4>
          <p>Page-level identity metadata.</p>
          <ul>
            <li>
              <strong>title</strong> (string, optional). The page title,
              taken from <code>og:title</code>, the first <code>h1</code>,
              or the <code>&lt;title&gt;</code> tag, in that preference
              order.
            </li>
            <li>
              <strong>description</strong> (string, optional). Page
              description from <code>meta[name=description]</code> or{" "}
              <code>og:description</code>.
            </li>
            <li>
              <strong>language</strong> (string, optional). BCP 47 language
              tag (e.g. <code>en</code>, <code>en-US</code>,{" "}
              <code>fr</code>).
            </li>
            <li>
              <strong>content_type</strong> (string, optional).
              Implementation-classified page-content type (e.g.{" "}
              <code>article</code>, <code>product</code>,{" "}
              <code>listing</code>, <code>profile</code>).
            </li>
          </ul>

          <h4 id="section-4-2-content">content (required)</h4>
          <p>The cleaned page body.</p>
          <ul>
            <li>
              <strong>markdown</strong> (string, required). Cleaned,
              structured markdown of the main page content. Boilerplate
              (navigation, footers, ads) <strong>SHOULD</strong> be
              removed. Implementations <strong>MAY</strong> use any
              extraction algorithm.
            </li>
          </ul>

          <h4 id="section-4-2-structure">structure (required)</h4>
          <p>
            Extracted page structure. Every field is optional; a
            single-paragraph article may legitimately have no links and no
            images.
          </p>
          <ul>
            <li>
              <strong>headings</strong> (array, optional). Headings in
              document order. Each entry has{" "}
              <code>{"{ level: number, text: string, id?: string }"}</code>.
              Levels are 1-6 corresponding to <code>h1</code>-<code>h6</code>.
            </li>
            <li>
              <strong>links</strong> (array, optional). Outbound{" "}
              <code>&lt;a href&gt;</code> elements. Each entry has{" "}
              <code>{"{ url, text?, internal: boolean, rel? }"}</code>. The{" "}
              <code>internal</code> field is true if the link target&rsquo;s
              host equals the source page&rsquo;s host.
            </li>
            <li>
              <strong>images</strong> (array, optional).{" "}
              <code>&lt;img&gt;</code> elements with {`{ url, alt? }`}.
            </li>
            <li>
              <strong>structured_data</strong> (object, optional). Merged
              JSON-LD payload from{" "}
              <code>&lt;script type=&quot;application/ld+json&quot;&gt;</code>{" "}
              blocks. Keys depend on the page and are not enumerated by
              this spec.
            </li>
          </ul>

          <h4 id="section-4-2-signals">signals (required)</h4>
          <p>
            Per-call quality projection derived from the AIDocument
            structure. Cheap, deterministic, no implementation-side state
            lookup. The two booleans are the spec floor any conformant 2.0
            implementation can compute; integer counts are RECOMMENDED but
            optional.
          </p>
          <ul>
            <li>
              <strong>word_count</strong> (integer, optional). Word count of
              the cleaned markdown.
            </li>
            <li>
              <strong>reading_time</strong> (integer, optional). Estimated
              reading time in minutes.
            </li>
            <li>
              <strong>has_json_ld</strong> (boolean, required). True if the
              page declared any <code>application/ld+json</code> structured
              data.
            </li>
            <li>
              <strong>heading_hierarchy_ok</strong> (boolean, required).
              True if there is at least one heading, the first is h1 or h2,
              and no adjacent levels jump by more than 1.
            </li>
          </ul>

          <h4 id="section-4-2-economics">economics (optional)</h4>
          <p>
            Optional cost-savings projection for AI consumers: compares the
            tokens used by the cleaned markdown against the tokens an LLM
            would have consumed processing the raw HTML directly.
            Implementations <strong>MAY</strong> omit this group entirely;
            if present, all listed fields are required.
          </p>
          <ul>
            <li>
              <strong>output_tokens_approx</strong> (integer). Approximate
              token count of <code>content.markdown</code> under a generic
              LLM tokenizer.
            </li>
            <li>
              <strong>raw_html_tokens_approx</strong> (integer). Approximate
              token count of the raw HTML body.
            </li>
            <li>
              <strong>token_savings</strong> (integer).{" "}
              <code>raw_html_tokens_approx - output_tokens_approx</code>.
            </li>
            <li>
              <strong>token_savings_percent</strong> (number).{" "}
              <code>(token_savings / raw_html_tokens_approx) * 100</code>.
            </li>
            <li>
              <strong>estimated_cost_usd</strong> (object). Object with{" "}
              <code>our_output</code>, <code>raw_html</code>, and{" "}
              <code>savings</code> in USD, computed against the model
              described in <code>pricing_basis</code>.
            </li>
            <li>
              <strong>pricing_basis</strong> (object). Object with{" "}
              <code>input_price_per_1k_usd</code> (number),{" "}
              <code>model_class</code> (string, e.g.{" "}
              <code>&quot;mid-tier&quot;</code>), and optional{" "}
              <code>note</code> (string). Lets consumers recompute the math
              against their own model rates.
            </li>
          </ul>

          <h3 id="section-4-3">
            4.3 Example <Anchor id="section-4-3" />
          </h3>
          <pre>
            <code>{`{
  "schema": {
    "name": "AIDocument",
    "version": "2.0",
    "ref": "aidoc:sha256:8a93c5f24b1e7d0c3f9a8b2e6d4c1f0e"
  },
  "source": {
    "url": "https://example.com/article",
    "canonical_url": "https://example.com/article",
    "fetched_at": "2026-05-13T12:34:56Z",
    "render_mode": "static",
    "status_code": 200,
    "freshness_policy": "cache_first"
  },
  "cache": {
    "status": "miss",
    "origin_contacted": true,
    "body_fetched": true
  },
  "identity": {
    "title": "How HTTP works",
    "description": "A friendly introduction to HTTP request/response.",
    "language": "en",
    "content_type": "article"
  },
  "content": {
    "markdown": "# How HTTP works\\n\\nWhen a client..."
  },
  "structure": {
    "headings": [
      { "level": 1, "text": "How HTTP works" },
      { "level": 2, "text": "Requests" }
    ],
    "links": [
      { "url": "https://www.rfc-editor.org/rfc/rfc7230",
        "text": "RFC 7230",
        "internal": false }
    ]
  },
  "signals": {
    "word_count": 1240,
    "reading_time": 5,
    "has_json_ld": false,
    "heading_hierarchy_ok": true
  }
}`}</code>
          </pre>

          <h3 id="section-4-4">
            4.4 Migration from 1.0 to 2.0 <Anchor id="section-4-4" />
          </h3>
          <p>
            2.0 reshapes the AIDocument envelope: 1.0&rsquo;s flat field set
            is grouped under semantic blocks (<code>schema</code>,{" "}
            <code>source</code>, <code>cache</code>, <code>identity</code>,{" "}
            <code>content</code>, <code>structure</code>,{" "}
            <code>signals</code>, optional <code>economics</code>). The
            rename map for every 1.0 field follows.
          </p>
          <pre>
            <code>{`1.0 path                       2.0 path
---------------------------    ---------------------------
url                            source.url
canonical_url                  source.canonical_url
title                          identity.title
description                    identity.description
markdown                       content.markdown
headings                       structure.headings
links                          structure.links
images                         structure.images
structured_data                structure.structured_data
meta.language                  identity.language
meta.word_count                signals.word_count
meta.reading_time              signals.reading_time
crawl.fetched_at               source.fetched_at
crawl.status_code              source.status_code
crawl.render_mode              source.render_mode
crawl.fetch_duration_ms        (dropped; not portable)
crawl.content_length           (dropped; not portable)
crawl.user_agent               (dropped; redundant with the request UA)`}</code>
          </pre>
          <p>
            Fields new in 2.0:
          </p>
          <ul>
            <li>
              <code>schema</code> block. Self-describing version identifier{" "}
              + content-addressed <code>ref</code>. Lets consumers route by
              version without inferring the shape.
            </li>
            <li>
              <code>cache</code> block. Per-call cache state (hit / miss /
              refreshed / stale_revalidated), explicitly separated from the
              snapshot fields under <code>source</code>.
            </li>
            <li>
              <code>source.freshness_policy</code>. The caller&rsquo;s
              requested policy, distinct from the cache outcome.
            </li>
            <li>
              <code>identity.content_type</code>.
              Implementation-classified page type.
            </li>
            <li>
              <code>signals.has_json_ld</code> and{" "}
              <code>signals.heading_hierarchy_ok</code>. Boolean quality
              floors guaranteed on every response.
            </li>
            <li>
              <code>economics</code> block. Optional token + USD savings
              projection.
            </li>
          </ul>
          <p>
            <strong>Implementer guidance.</strong> 1.0 implementations
            remain valid 1.0 implementations. There is no requirement to
            migrate. New implementations <strong>SHOULD</strong> target
            2.0. Consumers reading AIDocument responses{" "}
            <strong>SHOULD</strong> discover the version via{" "}
            <code>schema.version</code> rather than path-presence detection,
            so future 2.x additions don&rsquo;t break parsers. Mixed
            consumers that need to read both 1.0 and 2.0 responses{" "}
            <strong>MAY</strong> distinguish them by the presence of a
            top-level <code>schema</code> object (2.0+) vs. top-level{" "}
            <code>url</code> (1.0).
          </p>

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
            <strong>2.0 ({site.publishedDate}).</strong> Breaking change to
            Section 4 (AIDocument format). The flat field set from 1.0 is
            regrouped under semantic blocks: <code>schema</code>,{" "}
            <code>source</code>, <code>cache</code>, <code>identity</code>,{" "}
            <code>content</code>, <code>structure</code>,{" "}
            <code>signals</code>, optional <code>economics</code>.
            <code>schema</code> introduces a self-describing version
            identifier and a content-addressed <code>ref</code>;{" "}
            <code>cache</code> separates per-call cache state from snapshot
            metadata; <code>signals</code> guarantees two boolean quality
            floors (<code>has_json_ld</code>,{" "}
            <code>heading_hierarchy_ok</code>) on every response;{" "}
            <code>economics</code> exposes an optional token + USD savings
            projection. Three 1.0 <code>crawl</code> fields are dropped
            (<code>fetch_duration_ms</code>, <code>content_length</code>,{" "}
            <code>user_agent</code>) on the grounds that they are not
            portable across implementations. Section 4.4 documents the
            1.0 &rarr; 2.0 migration field-by-field. Sections 1, 2, 3, 5,
            6, 7, 8, and 9 are unchanged from 1.0.
          </p>
          <p>
            <strong>1.0 (2026-05-10).</strong> Initial publication. Flat
            AIDocument envelope (<code>url</code>, <code>title</code>,{" "}
            <code>markdown</code>, <code>headings</code>, <code>links</code>,{" "}
            <code>meta</code>, <code>crawl</code>). Remains a valid
            implementation target for systems already deployed against it;
            new implementations should target 2.0.
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
