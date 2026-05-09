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
of a single URL. Conformant implementations MUST return objects with
the following top-level fields when describing a fetched page:

  {
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
  }

Field names and JSON shapes are stable. Additive changes (new
optional fields) are permitted within a major version; removals or
renames require a new major version.

### 4.2 Field definitions

- url (string, required). The URL the document represents, after any
  HTTP redirects. MUST be a fully-qualified absolute URL.
- canonical_url (string, optional). The value of the
  <link rel="canonical"> tag if present in the source page; otherwise
  omitted.
- title (string, required). The page title, taken from og:title, the
  first h1, or the <title> tag, in that preference order.
- description (string, optional). Page description from
  meta[name=description] or og:description.
- markdown (string, required). Cleaned, structured markdown of the
  main page content. Boilerplate (navigation, footers, ads) SHOULD be
  removed. Implementations MAY use any extraction algorithm.
- headings (array, required). Headings in document order. Each entry
  has { level: number, text: string, id?: string }. Levels are 1-6
  corresponding to h1-h6.
- links (array, required). Outbound <a href> elements. Each entry has
  { url, text?, internal: boolean, rel? }. The internal field is true
  if the link target's host equals the source page's host.
- images (array, optional). <img> elements with { url, alt? }.
- meta (object, required). Derived metadata: at minimum language
  (BCP 47), word_count (integer), reading_time (minutes, integer).
  Implementations MAY include additional fields (author, site_name,
  keywords, og_image, published, modified).
- structured_data (object, optional). JSON-LD blocks extracted from
  the source page, normalized to a single object whose keys are
  schema.org type names.
- crawl (object, required). Information about how and when the
  document was fetched: fetched_at (RFC 3339 timestamp), status_code
  (HTTP integer), render_mode ("static" or "rendered"),
  fetch_duration_ms (integer), content_length (integer bytes),
  user_agent (string).

### 4.3 Example

  {
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
      "user_agent": "${site.name}/${site.protocolVersion} (+https://example.com/bot; example-impl)"
    }
  }

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

- ${site.protocolVersion} (${site.publishedDate}). Initial publication.

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
