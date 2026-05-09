import { site } from "@/lib/site";

/*
  /api/agent-manifest: a single machine-readable JSON document that
  describes the AIWebIndex protocol from the steward's point of view.
  Aggregator sites, future protocol registries, AI agents probing
  for "what is this site about?" can read this once and get a
  complete pointer-set into the canonical resources.

  Distinct from lyrenth.com/api/agent-manifest, which describes the
  COMMERCIAL implementation (endpoints, pricing, document shape).
  This manifest describes the PROTOCOL itself: the spec, the pledge,
  the steward, the directory, the implementer guide.

  JSON shape is intentionally flat and tagged with `kind` so a
  consumer that doesn't know AIWebIndex can still figure out what
  to do with each field. Stable contract; additive changes only.
*/

const ONE_DAY = 60 * 60 * 24;

export async function GET() {
  const base = site.url.toString().replace(/\/$/, "");

  const manifest = {
    kind: "protocol-manifest",
    schema_version: 1,
    protocol: {
      name: site.name,
      version: site.protocolVersion,
      status: site.protocolStatus.toLowerCase(),
      published: site.publishedDate,
      summary: site.tagline,
      description: site.description,
    },
    steward: {
      legal_name: site.steward.legalName,
      type: site.steward.type,
      jurisdiction: "Delaware, United States",
      address: site.steward.address,
      contact_email: site.contactEmail,
    },
    pledge: {
      patents:
        `${site.steward.legalName} holds no patents on the ${site.name} protocol's core mechanics ` +
        `(the User-Agent identifier, the AIDocument format, the verification mechanism) ` +
        `and pledges not to seek such patents.`,
      implementation_freedom:
        "Implementations are free to build, fork, and extend. No license, registration, royalty, or attribution required.",
      no_ip_claims:
        `${site.steward.legalName} will not assert intellectual-property claims against implementations ` +
        `that conform to the protocol or that derive new protocols from it.`,
    },
    crawler_identity: {
      user_agent_token: site.name,
      example_user_agent: `${site.name}/${site.protocolVersion} (+https://example.com/bot; <implementation-name>)`,
      verification_user_agent: `${site.name}/${site.protocolVersion} verification (+https://example.com/bot)`,
    },
    canonical_resources: [
      { kind: "specification", url: `${base}/spec`, summary: "RFC-style protocol specification (sections 1-9 + version history)." },
      { kind: "implementer_guide", url: `${base}/implementing`, summary: "Practical 5-step walkthrough with curl, Python, Node samples + conformance checklist." },
      { kind: "implementations_directory", url: `${base}/implementations`, summary: "Public list of products and projects that implement the protocol." },
      { kind: "rationale", url: `${base}/about`, summary: "Why the protocol is open; protocol-vs-product framing; governance." },
      { kind: "llms_index", url: `${base}/llms.txt`, summary: "Short llms.txt index for LLM consumption." },
      { kind: "llms_full", url: `${base}/llms-full.txt`, summary: "Long-form mirror of spec + guide + about as plain markdown." },
      { kind: "site_map", url: `${base}/sitemap.xml`, summary: "Machine-readable list of all routable pages." },
      { kind: "robots_txt", url: `${base}/robots.txt`, summary: "Crawler permissions for this site (allow all)." },
      { kind: "privacy", url: `${base}/privacy`, summary: "Privacy notice for the documentation site (no collection)." },
      { kind: "terms", url: `${base}/terms`, summary: "Terms of use for the site + protocol pledge restated." },
    ],
    reference_implementation: {
      name: site.referenceImpl.name,
      url: site.referenceImpl.url,
      summary: site.referenceImpl.summary,
      operator: site.steward.legalName,
      relationship:
        `${site.referenceImpl.name} is the reference commercial implementation. ` +
        `Independent third-party implementations are welcome and freely able to register.`,
    },
    aidocument_format: {
      summary: "JSON envelope every conformant implementation returns when describing a fetched page.",
      required_fields: [
        "url",
        "title",
        "markdown",
        "headings",
        "links",
        "meta",
        "crawl",
      ],
      optional_fields: [
        "canonical_url",
        "description",
        "images",
        "structured_data",
      ],
      reference_url: `${base}/spec#section-4`,
    },
    verification_mechanism: {
      summary: "Site owners prove domain ownership via DNS TXT or .well-known file; either method MUST be supported by a conformant implementation.",
      methods: [
        {
          kind: "dns_txt",
          record_name: "_aiwebindex-verify.<domain>",
          record_value_format: "aiwi-verify=<token>",
          reference_url: `${base}/spec#section-5-1`,
        },
        {
          kind: "well_known_file",
          path: "/.well-known/aiwebindex-verify.txt",
          body_format: "aiwi-verify=<token>",
          reference_url: `${base}/spec#section-5-2`,
        },
      ],
    },
    repository: site.repo,
    contact: site.contactEmail,
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=${ONE_DAY}, s-maxage=${ONE_DAY}`,
    },
  });
}
