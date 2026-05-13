/*
  Single source of truth for site-wide constants.

  aiwebindex.org is operated by Aleksma AI Inc. as steward of the
  protocol. The site stays minimal so this config doesn't grow much:
  a few strings + the canonical URL. Everything else lives in the
  pages themselves.
*/

const FALLBACK_URL = "http://localhost:3000";

export const site = {
  name: "AIWebIndex",
  protocolVersion: "2.0",
  protocolStatus: "Draft",
  tagline: "An open protocol for AI-readable web indexing.",
  description:
    "AIWebIndex is an open protocol that defines how AI systems and crawlers identify themselves, request structured representations of web pages, and verify ownership. Stewarded by Aleksma AI Inc.; freely implementable.",
  url: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL),
  contactEmail: "hello@aiwebindex.org",
  // The reference commercial implementation. Linked from the footer
  // and from the implementations page.
  referenceImpl: {
    name: "Lyrenth",
    url: "https://www.lyrenth.com",
    summary: "Hosted API + dashboards by Aleksma AI Inc.",
  },
  // The legal entity that operates the site and stewards the protocol.
  steward: {
    legalName: "Aleksma AI Inc.",
    type: "Delaware corporation",
    address: "1111B S Governors Ave # 97667, Dover, DE 19904, USA",
  },
  // Repository where the spec source-of-truth + implementer references
  // will live once published. Today this is the same lyrenth/aiwebindex
  // repo that hosts this site; once the protocol matures it may move
  // to its own org.
  repo: "https://github.com/lyrenth/aiwebindex",
  publishedDate: "2026-05-13",
};
