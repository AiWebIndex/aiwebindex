import { site } from "@/lib/site";

/*
  /llms-full.txt: the long-form companion to /llms.txt. Concatenates
  the full text of the spec, the implementer's guide, and the about
  page into one markdown document an LLM can ingest in one read.

  Source-of-truth for the spec content lives here as plain markdown
  rather than in the React component to avoid maintaining two copies.
  When the spec evolves the change happens in TWO places (the JSX
  page and this file). That is the cost of having both a designed
  spec page and an LLM-readable plaintext mirror; both surfaces
  matter and rendering JSX to plain markdown is more work than
  duplicating the text.
*/

const TEXT_PLAIN_UTF8 = "text/plain; charset=utf-8";
const ONE_DAY = 60 * 60 * 24;

export async function GET() {
  const base = site.url.toString().replace(/\/$/, "");
  const body = `# ${site.name} ${site.protocolVersion} (${site.protocolStatus})

Stewarded by ${site.steward.legalName}. Published ${site.publishedDate}.
Source: ${base}

> ${site.description}

This long-form file mirrors the canonical pages at ${base}/spec,
${base}/implementing, and ${base}/about as plain markdown so LLMs can
ingest the protocol in a single read without rendering HTML.

================================================================
PART 1: SPECIFICATION
Source: ${base}/spec
================================================================

# ${site.name} ${site.protocolVersion} Specification

## Status of this document

This document is a draft of the ${site.name} ${site.protocolVersion}
specification, published by ${site.steward.legalName} as steward of
the protocol. It describes a stable interface intended for adoption
by AI systems, web crawlers, and site operators.

Implementations conforming to this specification are interoperable.
${site.steward.legalName} holds no patents on the protocol's core
mechanics and pledges not to seek such patents. Comments, questions,
and proposed revisions may be sent to ${site.contactEmail}.

## Abstract

${site.name} defines a small, focused protocol for AI-readable web
indexing. It specifies (a) a User-Agent identifier crawlers MUST send
when fetching content as part of an ${site.name} workflow, (b) a JSON
envelope, AIDocument, that interoperable implementations return, and
(c) a verification mechanism that allows a site operator to prove
ownership of a domain to a registrar of ${site.name} implementations.

## 1. Introduction

### 1.1 Background

AI systems increasingly fetch web content on behalf of end users.
They face two practical problems: (1) origin servers cannot tell them
apart from generic browsers or search crawlers, which makes
allowlisting, rate-limiting, and abuse handling unreliable; and
(2) every implementation invents its own way of representing
extracted content, fragmenting downstream tooling.

${site.name} addresses both: a single User-Agent token any compliant
crawler sends, and a single JSON shape any compliant implementation
returns. The protocol is intentionally minimal. It does not
standardize ranking, retrieval, or storage. Those decisions remain
with each implementation.

### 1.2 Goals

- Give site operators a single, stable identity to allowlist or block
  when an AI system reads their content.
- Give consumers (AI agents, downstream tools) a single document
  shape they can rely on regardless of which ${site.name}
  implementation produced it.
- Give site owners a domain-verification mechanism that does not
  depend on any single implementation's account system.
- Stay implementable in a weekend. The protocol covers what is shared
  across implementations; everything else is out of scope.

### 1.3 Non-goals

- Ranking. ${site.name} is silent on which pages an AI system should
  prefer; that is a product decision.
- Storage. The protocol does not require persistent caching, an
  index, or any specific data lifetime.
- Authentication. ${site.name} does not standardize end-user auth
  between an AI system and an origin; per-implementation API keys and
  OAuth flows are out of scope.
- Pricing. The protocol is free of fees by construction.
  Implementations may charge their own customers as they see fit.

## 2. Conformance

The key words MUST, MUST NOT, REQUIRED, SHALL, SHALL NOT, SHOULD,
SHOULD NOT, RECOMMENDED, MAY, and OPTIONAL in this document are to be
interpreted as described in RFC 2119, when, and only when, they
appear in all capitals.

An implementation conforms to ${site.name} ${site.protocolVersion} if
it satisfies all the MUST-level requirements in sections 3, 4, and 5
of this document.

## 3. User-Agent identifier

Conforming crawlers MUST send an HTTP User-Agent header that begins
with the string "${site.name}/${site.protocolVersion}" when fetching
content as part of a protocol-driven workflow.

The full User-Agent value SHOULD include a URL where site operators
can read about the implementation. A conformant value looks like:

  User-Agent: ${site.name}/${site.protocolVersion} (+https://example.com/bot; <implementation-name>)

A separate verification fetch (Section 5) SHOULD use a User-Agent
value with the suffix "verification" appended so site operators can
distinguish on-demand crawls from ownership checks:

  User-Agent: ${site.name}/${site.protocolVersion} verification (+https://example.com/bot)

Implementations MUST NOT impersonate other User-Agent strings
(browsers, search crawlers, generic libraries) in lieu of the
${site.name} identifier when performing protocol-driven fetches.

## 4. AIDocument format

### 4.1 Top-level structure

An AIDocument is a JSON object representing the structured extraction
of a single URL. Conformant 2.0 implementations MUST return objects
with the following top-level groups:

  {
    "schema":    { /* SchemaInfo */    },  // required
    "source":    { /* SourceInfo */    },  // required
    "cache":     { /* CacheInfo */     },  // required
    "identity":  { /* IdentityInfo */  },  // required
    "content":   { /* ContentInfo */   },  // required
    "structure": { /* StructureInfo */ },  // required
    "signals":   { /* SignalsInfo */   },  // required
    "economics": { /* EconomicsInfo */ }   // optional
  }

Top-level groups are a stable contract. Removing a group or renaming
a key requires a new major version. Adding a new optional group (or a
new optional field inside an existing group) within 2.x is permitted.

The grouped layout is the headline change between ${site.name} 1.0 and
2.0: AI consumers can route on the block they care about (identity vs
structure vs cost) without parsing the entire envelope, and the
boundaries between "what we fetched" (source) and "what happened on
this call" (cache) are explicit instead of implied. See Section 4.4
for the 1.0 -> 2.0 migration map.

### 4.2 Field definitions

#### schema (required)

Identifies the shape and version of the response so consumers can
route by version.

- name (string, required). MUST be the literal "AIDocument".
- version (string, required). The spec major.minor version the
  response conforms to. Conformant 2.0 implementations emit "2.0";
  conformant 2.x revisions emit the corresponding minor (e.g. "2.1").
- ref (string, optional). An opaque, content-addressed identifier of
  the document fingerprint, prefixed with "aidoc:". The reference
  implementation uses "aidoc:sha256:<32 hex chars>" (a 128-bit prefix
  of a SHA-256 over the non-volatile fields: url, canonical_url, title,
  description, language, content_type, markdown, headings, links,
  images, structured_data). Stable across cache states and re-crawls
  of an unchanged page.

#### source (required)

Describes what was fetched and how. Independent of cache state: even
on a cache hit, these fields describe the underlying snapshot (which
may be older than the current call).

- url (string, required). The URL the document represents, after any
  HTTP redirects. MUST be a fully-qualified absolute URL.
- canonical_url (string, optional). The value of the
  <link rel="canonical"> tag if present in the source page; otherwise
  omitted.
- fetched_at (string, optional). RFC 3339 timestamp of the underlying
  snapshot. Omitted on documents that predate the field.
- render_mode (string, optional). How the page was rendered. One of
  "static" (direct HTTP fetch), "rendered" (JS execution was
  required), or "static_after_render_failure" (renderer attempted but
  fell back to the static HTML).
- status_code (integer, optional). HTTP status from the origin at
  fetch time.
- freshness_policy (string, required). The policy the CALLER
  requested for this call. One of "cache_first" or "force_refresh".
  The outcome lives in cache.status.

#### cache (required)

Describes what happened on the implementation side for THIS specific
call. The status string is a coarse-grained label; the two booleans
are the precise truth.

- status (string, required). One of "hit" (cached snapshot served,
  origin not contacted), "miss" (cache_first policy, no cache hit,
  body fetched from origin), "refreshed" (force_refresh policy, body
  fetched from origin), or "stale_revalidated" (origin returned
  304 Not Modified, no body).
- origin_contacted (boolean, required).
- body_fetched (boolean, required).

#### identity (required)

Page-level identity metadata.

- title (string, optional). The page title, taken from og:title, the
  first h1, or the <title> tag, in that preference order.
- description (string, optional). Page description from
  meta[name=description] or og:description.
- language (string, optional). BCP 47 language tag (e.g. en, en-US,
  fr).
- content_type (string, optional). Implementation-classified
  page-content type (e.g. article, product, listing, profile).

#### content (required)

The cleaned page body.

- markdown (string, required). Cleaned, structured markdown of the
  main page content. Boilerplate (navigation, footers, ads) SHOULD be
  removed. Implementations MAY use any extraction algorithm.

#### structure (required)

Extracted page structure. Every field is optional; a single-paragraph
article may legitimately have no links and no images.

- headings (array, optional). Headings in document order. Each entry
  has { level: number, text: string, id?: string }. Levels are 1-6
  corresponding to h1-h6.
- links (array, optional). Outbound <a href> elements. Each entry has
  { url, text?, internal: boolean, rel? }. The internal field is true
  if the link target's host equals the source page's host.
- images (array, optional). <img> elements with { url, alt? }.
- structured_data (object, optional). Merged JSON-LD payload from
  <script type="application/ld+json"> blocks. Keys depend on the page
  and are not enumerated by this spec.

#### signals (required)

Per-call quality projection derived from the AIDocument structure.
Cheap, deterministic, no implementation-side state lookup. The two
booleans are the spec floor any conformant 2.0 implementation can
compute; integer counts are RECOMMENDED but optional.

- word_count (integer, optional). Word count of the cleaned markdown.
- reading_time (integer, optional). Estimated reading time in minutes.
- has_json_ld (boolean, required). True if the page declared any
  application/ld+json structured data.
- heading_hierarchy_ok (boolean, required). True if there is at least
  one heading, the first is h1 or h2, and no adjacent levels jump by
  more than 1.

#### economics (optional)

Optional cost-savings projection for AI consumers: compares the tokens
used by the cleaned markdown against the tokens an LLM would have
consumed processing the raw HTML directly. Implementations MAY omit
this group entirely; if present, all listed fields are required.

- output_tokens_approx (integer). Approximate token count of
  content.markdown under a generic LLM tokenizer.
- raw_html_tokens_approx (integer). Approximate token count of the
  raw HTML body.
- token_savings (integer). raw_html_tokens_approx -
  output_tokens_approx.
- token_savings_percent (number). (token_savings /
  raw_html_tokens_approx) * 100.
- estimated_cost_usd (object). Object with our_output, raw_html, and
  savings in USD, computed against the model described in
  pricing_basis.
- pricing_basis (object). Object with input_price_per_1k_usd (number),
  model_class (string, e.g. "mid-tier"), and optional note (string).
  Lets consumers recompute the math against their own model rates.

### 4.3 Example

  {
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
  }

### 4.4 Migration from 1.0 to 2.0

2.0 reshapes the AIDocument envelope: 1.0's flat field set is grouped
under semantic blocks (schema, source, cache, identity, content,
structure, signals, optional economics). The rename map for every 1.0
field follows.

  1.0 path                       2.0 path
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
  crawl.user_agent               (dropped; redundant with the request UA)

Fields new in 2.0:

- schema block. Self-describing version identifier + content-
  addressed ref. Lets consumers route by version without inferring
  the shape.
- cache block. Per-call cache state (hit / miss / refreshed /
  stale_revalidated), explicitly separated from the snapshot fields
  under source.
- source.freshness_policy. The caller's requested policy, distinct
  from the cache outcome.
- identity.content_type. Implementation-classified page type.
- signals.has_json_ld and signals.heading_hierarchy_ok. Boolean
  quality floors guaranteed on every response.
- economics block. Optional token + USD savings projection.

Implementer guidance: 1.0 implementations remain valid 1.0
implementations. There is no requirement to migrate. New
implementations SHOULD target 2.0. Consumers reading AIDocument
responses SHOULD discover the version via schema.version rather than
path-presence detection, so future 2.x additions don't break parsers.
Mixed consumers that need to read both 1.0 and 2.0 responses MAY
distinguish them by the presence of a top-level "schema" object (2.0+)
vs. top-level "url" (1.0).

## 5. Verification mechanism

A site owner proves they control a domain by responding to a
verification token. Conformant implementations MUST support at least
one of the two methods below; implementations SHOULD support both.

### 5.1 DNS TXT record

The implementation generates a verification token and instructs the
owner to publish a DNS TXT record under
"_aiwebindex-verify.<domain>" with the value "aiwi-verify=<token>":

  _aiwebindex-verify.example.com  TXT  "aiwi-verify=8a93c5f2..."

The implementation MUST query at least one authoritative DNS resolver
for this record. The implementation SHOULD query multiple resolvers
(e.g., 1.1.1.1, 8.8.8.8, 9.9.9.9) in parallel to tolerate
misconfigured local resolvers.

### 5.2 .well-known file

The owner publishes a plain-text file at
"https://<domain>/.well-known/aiwebindex-verify.txt" whose body
contains "aiwi-verify=<token>":

  # https://example.com/.well-known/aiwebindex-verify.txt
  aiwi-verify=8a93c5f2...

The implementation MUST fetch the file over HTTPS. Plain HTTP fetches
MUST be rejected. The implementation SHOULD follow up to 3 redirects
within the same registrable domain; cross-domain redirects MUST NOT
count as a successful verification.

## 6. Crawler behavior

### 6.1 robots.txt compliance

Conforming crawlers MUST honor robots.txt directives addressed to
"${site.name}" as the User-Agent. Wildcard rules (User-agent: *) MUST
apply when no agent-specific block is present.

### 6.2 Rate limiting

Implementations SHOULD enforce a per-origin cooldown between
consecutive fetches of the same domain. 2 seconds is RECOMMENDED as
the minimum default; implementations MAY raise this for sites that
request a longer Crawl-delay in robots.txt.

### 6.3 Backoff

Implementations MUST respect HTTP 429 Too Many Requests responses by
pausing fetches to that origin for at least the duration of the
Retry-After header, or 60 seconds if absent. Implementations MUST
respect 503 Service Unavailable the same way.

## 7. Security considerations

Verification tokens. Implementations MUST generate verification
tokens with at least 128 bits of entropy and SHOULD rotate them on
every issuance. A token previously issued for a domain MUST NOT be
reused for a different domain without explicit user action.

HTTPS only for fetch. Verification fetches (Section 5.2) MUST use
HTTPS. Crawl fetches SHOULD prefer HTTPS where the origin advertises
it.

Origin spoofing. Implementations MUST NOT fabricate User-Agent
strings to imitate browsers or search crawlers in order to bypass
site-operator decisions.

Authenticated content. Implementations MUST NOT attempt to bypass
paywalls, login walls, or technical access controls. The protocol
applies only to publicly accessible content.

## 8. Privacy considerations

End-user identity. The protocol carries no field for end-user
identification. Implementations MUST NOT embed end-user identifiers
(IP addresses, cookies, account IDs of the agent's caller) into
either the request or the AIDocument response.

PII in extracted content. Source pages may contain
personally-identifying information published by their authors. The
protocol does not require implementations to remove or transform such
content; downstream consumers are responsible for compliance with
applicable data-protection law.

Verification record visibility. DNS TXT records and HTTP files used
for verification (Section 5) are public. Site owners SHOULD use
opaque tokens, not human identifiers, in those records.

## 9. References

- RFC 2119: Key words for use in RFCs to indicate requirement levels.
  https://www.rfc-editor.org/rfc/rfc2119
- RFC 3339: Date and Time on the Internet: Timestamps.
  https://www.rfc-editor.org/rfc/rfc3339
- RFC 9309: Robots Exclusion Protocol.
  https://www.rfc-editor.org/rfc/rfc9309
- BCP 47: Tags for Identifying Languages.
  https://www.rfc-editor.org/info/bcp47
- schema.org: Structured-data vocabulary.
  https://schema.org/

## Version history

- 2.0 (${site.publishedDate}). Breaking change to Section 4
  (AIDocument format). The flat field set from 1.0 is regrouped under
  semantic blocks: schema, source, cache, identity, content,
  structure, signals, optional economics. schema introduces a
  self-describing version identifier and a content-addressed ref;
  cache separates per-call cache state from snapshot metadata;
  signals guarantees two boolean quality floors (has_json_ld,
  heading_hierarchy_ok) on every response; economics exposes an
  optional token + USD savings projection. Three 1.0 crawl fields are
  dropped (fetch_duration_ms, content_length, user_agent) on the
  grounds that they are not portable across implementations. Section
  4.4 documents the 1.0 -> 2.0 migration field-by-field. Sections 1,
  2, 3, 5, 6, 7, 8, and 9 are unchanged from 1.0.
- 1.0 (2026-05-10). Initial publication. Flat AIDocument envelope
  (url, title, markdown, headings, links, meta, crawl). Remains a
  valid implementation target for systems already deployed against it;
  new implementations should target 2.0.

================================================================
PART 2: IMPLEMENTER'S GUIDE
Source: ${base}/implementing
================================================================

A minimum-viable ${site.name} implementation needs five things:

1. An HTTP client that sends the ${site.name} User-Agent.
2. A robots.txt parser that respects rules for ${site.name}.
3. An HTML extractor that produces an AIDocument shape.
4. A verification flow (DNS TXT or .well-known) for site ownership.
5. An origin rate-limit (default 2 seconds between hits to the same
   domain).

Everything else (storage, queuing, dashboards, billing) is your
product surface. The protocol does not require any of it.

## Conformance checklist

Before shipping, walk through this list. If you can answer "yes" to
each item, your implementation conforms to ${site.name}
${site.protocolVersion}.

- Every protocol-driven fetch sends a User-Agent starting with
  "${site.name}/${site.protocolVersion}".
- robots.txt rules for "User-agent: ${site.name}" are honored.
- Wildcard "User-agent: *" rules apply when no agent-specific block
  is present.
- The HTTP Crawl-delay directive is respected when greater than the
  default per-origin cooldown.
- HTTP 429 and 503 responses pause fetches per spec section 6.3.
- AIDocument responses include all required fields per spec
  section 4.1.
- At least one of DNS TXT or .well-known verification is implemented
  end-to-end.
- Verification fetches use HTTPS only and reject cross-domain
  redirects.
- No User-Agent spoofing or bypass of authenticated content.
- No end-user identifiers leak into the AIDocument or the outbound
  request.

================================================================
PART 3: WHY OPEN
Source: ${base}/about
================================================================

${site.name} is a protocol: a User-Agent identifier, a JSON document
format (AIDocument), and a verification mechanism. It is unpatented
and freely implementable. Anyone can build a crawler, an indexer, or
a verifier that conforms to it; the conformant ones interoperate.

${site.referenceImpl.name}, run by ${site.steward.legalName}, is a
product: a hosted API + dashboards that implement the protocol
commercially. ${site.referenceImpl.name} is the reference
implementation, useful as a working example, useful as a paid option
for teams who want hosted infrastructure rather than running their
own. It is one implementation. Not the only valid one.

## Pledge

${site.steward.legalName} (the steward) commits, formally:

> ${site.steward.legalName} holds no patents on the ${site.name}
> protocol's core mechanics (the User-Agent identifier, the AIDocument
> format, the verification mechanism) and pledges not to seek such
> patents. Implementations are free to build, fork, and extend.
> ${site.steward.legalName} will not assert intellectual-property
> claims against implementations that conform to the protocol or that
> derive new protocols from it.

This pledge is binding for ${site.protocolVersion} and any future
versions ${site.steward.legalName} publishes here. If a future
version of the protocol is forked under different stewardship, the
new steward's pledge governs that fork.

## Why this approach wins

Search runs on robots.txt and sitemap.xml because they are open.
Email runs on SMTP, IMAP, DKIM, and SPF because they are open.
Identity runs on OAuth and OpenID Connect because they are open.
Structured-data on the web runs on schema.org because it is open.
None of these are perfect specifications. All of them won, decisively,
against closed alternatives.

The pattern is consistent: when a layer of the web becomes shared
infrastructure, it has to be a protocol that anyone can reimplement.
${site.name} is making an early bet that the layer of "how AI systems
read web pages" will be the next instance of this pattern.

================================================================
CONTACT

${site.contactEmail}
${site.steward.legalName}
${site.steward.address}
================================================================
`;

  return new Response(body, {
    headers: {
      "Content-Type": TEXT_PLAIN_UTF8,
      "Cache-Control": `public, max-age=${ONE_DAY}, s-maxage=${ONE_DAY}`,
    },
  });
}
