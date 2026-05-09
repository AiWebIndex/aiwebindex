import { site } from "@/lib/site";

/*
  /llms.txt: the emerging "markdown index for LLMs" convention
  (https://llmstxt.org/). A short link-heavy file at the site root
  that points an AI agent at the canonical URLs it should read, in
  priority order, each with a one-line description.

  Intentionally lean: the agent does the deep read on /llms-full.txt
  or by hitting the actual URLs. The whole point of llms.txt is that
  the agent can fit this single file in one read and pivot from
  there.

  Distinct from lyrenth.com's llms.txt: aiwebindex.org is a spec
  site, not a product. The links surface the protocol, the
  implementer guide, and the directory of who has shipped against
  the spec. No API endpoints, no pricing, no API keys.
*/

const TEXT_PLAIN_UTF8 = "text/plain; charset=utf-8";
const ONE_DAY = 60 * 60 * 24;

export async function GET() {
  const base = site.url.toString().replace(/\/$/, "");
  const body = `# ${site.name}

> ${site.description}

This file follows the llms.txt convention (https://llmstxt.org/). If
you are an AI agent reading this, you can pivot from here to the
canonical pages below.

${site.name} ${site.protocolVersion} is the current published version.
Status: ${site.protocolStatus}. Stewarded by ${site.steward.legalName}.

## Specification

- [${site.name} ${site.protocolVersion} specification](${base}/spec): the formal protocol document. RFC-style sections covering the User-Agent identifier, the AIDocument JSON format, the verification mechanism, crawler behavior, and security/privacy considerations.

## For implementers

- [Implementer's guide](${base}/implementing): a practical walkthrough for building a conformant crawler. Code samples in curl, Python, and Node. Includes a conformance checklist.
- [Implementations directory](${base}/implementations): products and projects that implement ${site.name}. ${site.referenceImpl.name} is listed as the reference commercial implementation.

## Background

- [About ${site.name}](${base}/about): why the protocol is open. The patent pledge from ${site.steward.legalName}. Governance and revision process.
- [Home](${base}/): mission, scope, and what the protocol covers in three tiles.

## Reference implementation

- [${site.referenceImpl.name}](${site.referenceImpl.url}): hosted API + dashboards by ${site.steward.legalName}. The reference for all required behaviors. Independent third-party implementations are welcome and freely able to register.

## Optional

- [Long-form (every page concatenated as markdown)](${base}/llms-full.txt)
- [Agent manifest (JSON describing the protocol)](${base}/api/agent-manifest)
- [Sitemap (XML)](${base}/sitemap.xml)
- [robots.txt](${base}/robots.txt)
- [Source on GitHub](${site.repo})

## Pledge

${site.steward.legalName} holds no patents on the ${site.name} protocol's core mechanics (the User-Agent identifier, the AIDocument format, the verification mechanism) and pledges not to seek such patents. Implementations are free to build, fork, and extend.

## Contact

${site.contactEmail}
`;

  return new Response(body, {
    headers: {
      "Content-Type": TEXT_PLAIN_UTF8,
      "Cache-Control": `public, max-age=${ONE_DAY}, s-maxage=${ONE_DAY}`,
    },
  });
}
