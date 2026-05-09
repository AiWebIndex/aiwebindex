import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${site.name} is open: the protocol-vs-product distinction, the patent pledge, and the stewardship model.`,
};

/*
  /about: the why-open argument and the patent pledge in one place.
  Reads as a short essay, not a docs page. Three sections:

    1. The protocol/product distinction (Lyrenth is a product;
       AIWebIndex is a protocol)
    2. The pledge (verbatim what's in the footer + legal docs;
       repeated here so the casual reader sees the binding language)
    3. Why this approach wins (RSS / OAuth / schema.org analogy;
       short, doesn't need to be exhaustive)
*/

export default function AboutPage() {
  return (
    <article style={{ padding: "48px 0 72px" }}>
      <div className="container-doc">
        <span className="eyebrow">About</span>
        <h1 className="h-display" style={{ marginTop: 12 }}>
          Why {site.name} is an open protocol.
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
          The web only works because its base layer &mdash; HTML, HTTP, the
          robots.txt convention, RSS, schema.org &mdash; is open. The way
          AI systems read the web should be answered the same way: with a
          shared protocol, not a captive product.
        </p>

        <hr className="rule-soft" style={{ marginTop: 32 }} />

        <div className="prose-doc" style={{ marginTop: 32 }}>
          <h2 id="protocol-vs-product">Protocol versus product</h2>
          <p>
            <strong>{site.name}</strong> is a protocol: a User-Agent
            identifier, a JSON document format (AIDocument), and a
            verification mechanism. It is unpatented and freely
            implementable. Anyone can build a crawler, an indexer, or a
            verifier that conforms to it; the conformant ones interoperate.
          </p>
          <p>
            <strong>{site.referenceImpl.name}</strong>, run by{" "}
            {site.steward.legalName}, is a product: a hosted API + dashboards
            that implement the protocol commercially. {site.referenceImpl.name}{" "}
            is the reference implementation &mdash; useful as a working
            example, useful as a paid option for teams who want hosted
            infrastructure rather than running their own. It is one
            implementation. Not the only valid one.
          </p>
          <p>
            This site exists to make that distinction visible. If{" "}
            {site.name} only existed inside {site.referenceImpl.name}, the
            &ldquo;open protocol&rdquo; claim would be marketing copy. The
            protocol has to live in a place where {site.referenceImpl.name}{" "}
            does not control the editor pen. That place is here.
          </p>

          <h2 id="pledge">The pledge</h2>
          <p>
            {site.steward.legalName} (the steward) commits, formally:
          </p>
          <blockquote>
            {site.steward.legalName} holds no patents on the {site.name}{" "}
            protocol&rsquo;s core mechanics &mdash; the User-Agent
            identifier, the AIDocument format, the verification mechanism
            &mdash; and pledges not to seek such patents. Implementations
            are free to build, fork, and extend. {site.steward.legalName}{" "}
            will not assert intellectual-property claims against
            implementations that conform to the protocol or that derive
            new protocols from it.
          </blockquote>
          <p>
            This pledge is binding for {site.protocolVersion} and any
            future versions {site.steward.legalName} publishes here. If a
            future version of the protocol is forked under different
            stewardship, the new steward&rsquo;s pledge governs that fork.
          </p>

          <h2 id="why-this-wins">Why open standards win</h2>
          <p>
            Search runs on robots.txt and sitemap.xml because they are open.
            Email runs on SMTP, IMAP, DKIM, and SPF because they are open.
            Identity runs on OAuth and OpenID Connect because they are open.
            Structured-data on the web runs on schema.org because it is
            open. None of these are perfect specifications. All of them
            won, decisively, against closed alternatives.
          </p>
          <p>
            The pattern is consistent: when a layer of the web becomes
            shared infrastructure, it has to be a protocol that anyone can
            reimplement. Closed alternatives at infrastructure layers
            consistently lose to open ones, even when the closed version
            has a head start in tooling, marketing, or distribution. The
            history is well-attested.
          </p>
          <p>
            {site.name} is making an early bet that the layer of
            &ldquo;how AI systems read web pages&rdquo; will be the next
            instance of this pattern. {site.referenceImpl.name} earns
            long-term durability by stewarding the layer well, not by
            owning it.
          </p>

          <h2 id="governance">Governance &amp; revisions</h2>
          <p>
            {site.protocolVersion} is the first published draft. Future
            revisions follow a small process:
          </p>
          <ul>
            <li>
              Proposed changes are discussed publicly via email to{" "}
              <a href={`mailto:${site.contactEmail}`}>
                {site.contactEmail}
              </a>{" "}
              and on the{" "}
              <a href={site.repo} target="_blank" rel="noopener noreferrer">
                GitHub repository
              </a>
              .
            </li>
            <li>
              Implementer feedback is treated as primary input. If the
              reference implementation and at least one independent
              implementation both signal that a change is needed, the
              proposal advances.
            </li>
            <li>
              Backwards-compatible additions land in minor versions
              (1.0 &rarr; 1.1). Breaking changes require a new major
              version (1.x &rarr; 2.0) with a documented migration path.
            </li>
            <li>
              {site.steward.legalName} retains editorial discretion only
              over the published version. Anyone is free to fork the spec
              and steward an alternative.
            </li>
          </ul>

          <h2 id="contact">Contact</h2>
          <p>
            For protocol questions, implementation questions, listing
            requests, and anything else: email{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
            For commercial inquiries about the {site.referenceImpl.name}{" "}
            implementation specifically, the {site.referenceImpl.name}{" "}
            site has its own contact channels.
          </p>
        </div>

        <hr className="rule-soft" style={{ marginTop: 40 }} />

        <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/spec" className="btn btn-primary">
            Read the spec &rarr;
          </Link>
          <Link href="/implementing" className="btn btn-ghost">
            Implement it
          </Link>
        </div>
      </div>
    </article>
  );
}
