# aiwebindex.org

The home of the **AIWebIndex** open protocol. Stewarded by Aleksma AI Inc.

This repository hosts:

- `/`: landing page with the protocol mission and three CTAs
- `/spec`: the formal AIWebIndex 1.0 specification (RFC-style)
- `/implementations`: directory of products and projects implementing the protocol
- `/implementing`: practical guide for someone building a conformant crawler
- `/about`: why open, the patent pledge, governance

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind v4 (no separate config; tokens in `src/app/globals.css` via `@theme`)
- Inter (sans) + Source Serif 4 (serif headings); chosen for academic / standards-body feel, deliberately distinct from Lyrenth's brand
- Pure static site; no API, no database

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Editing the spec

`/spec` is the load-bearing surface. Changes to it are protocol-level changes:

- **Backwards-compatible additions** (new optional AIDocument fields, additional verification methods, etc.) bump the minor version (`1.0` → `1.1`)
- **Breaking changes** require a new major version (`1.x` → `2.0`) with a documented migration path
- Update `site.protocolVersion` and `site.publishedDate` in `src/lib/site.ts` when shipping a revision
- Add an entry to the "Version history" section at the bottom of `src/app/spec/page.tsx`

## Adding an implementation

`src/app/implementations/page.tsx` has an `IMPLEMENTATIONS` array. Push a new entry:

```ts
{
  name: "Example",
  url: "https://example.com",
  audience: "...",
  summary: "...",
  hostingRegion: "EU / US / Global / etc.",
  commercial: true | false,
  reference: false,
}
```

The `reference` flag is reserved for Lyrenth (the canonical reference implementation operated by Aleksma AI Inc.).

## Deploy

This site is deployed to Vercel. The production domain is `aiwebindex.org`.

## Stewardship

`Aleksma AI Inc.` (Delaware corporation; 1111B S Governors Ave # 97667, Dover, DE 19904, USA) holds no patents on the protocol's core mechanics and pledges not to seek such patents.

Contact: hello@aiwebindex.org
