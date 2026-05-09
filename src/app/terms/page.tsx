import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms of use for aiwebindex.org and the open ${site.name} protocol. The protocol is unpatented and freely implementable; the commercial reference implementation has its own service terms at ${site.referenceImpl.url}/terms.`,
};

const LAST_UPDATED = "May 10, 2026";

/*
  Minimal terms-of-use page for aiwebindex.org.

  Two distinct things are scoped here:

    1. The DOCUMENTATION SITE itself (aiwebindex.org). Static
       documentation; no service to govern; standard "as-is"
       disclaimer + IP/trademark notes for the AIWebIndex name.

    2. The PROTOCOL (the AIWebIndex specification). Restates the
       open-protocol pledge from /about so a reader landing on the
       terms page directly still sees the binding language. Anyone
       implementing the protocol is doing so under that pledge --
       no separate license needed beyond the pledge.

  The Lyrenth commercial implementation has its own service terms;
  we point at them so a reader who actually used the API ends up
  reading the right document.
*/
export default function TermsPage() {
  return (
    <article style={{ padding: "48px 0 72px" }}>
      <div className="container-doc">
        <span className="eyebrow">Terms</span>
        <h1 className="h-display" style={{ marginTop: 12 }}>
          Terms of use.
        </h1>
        <p
          className="mono"
          style={{
            marginTop: 12,
            fontSize: "0.7rem",
            color: "var(--color-mute-2)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose-doc" style={{ marginTop: 32 }}>
          <h2 id="scope">Scope</h2>
          <p>
            This page covers two related but distinct things:
          </p>
          <ol>
            <li>
              <strong>Use of this documentation site</strong>{" "}
              (<code>aiwebindex.org</code>).
            </li>
            <li>
              <strong>Use of the {site.name} protocol</strong>{" "}
              (the specification published here).
            </li>
          </ol>
          <p>
            The reference commercial implementation of the protocol,{" "}
            <a
              href={site.referenceImpl.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.referenceImpl.name}
            </a>
            , has its own service terms at{" "}
            <a
              href={`${site.referenceImpl.url}/terms`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.referenceImpl.url.replace(/^https?:\/\//, "")}/terms
            </a>
            . Those govern any use of that hosted API or dashboard; this
            page does not.
          </p>

          <h2 id="docs-site">Use of this site</h2>
          <p>
            <code>aiwebindex.org</code> is operated by{" "}
            <strong>{site.steward.legalName}</strong>{" "}
            ({site.steward.type}) at {site.steward.address}. The
            documentation, examples, and reference text are provided
            under fair-use principles for the purpose of advancing the
            open {site.name} protocol. You are free to read, link to,
            quote, embed, archive, and translate the content.
          </p>
          <p>
            The site is provided <strong>as-is</strong> with no
            warranty. We make reasonable effort to keep documentation
            accurate, but we do not guarantee continuous availability,
            absence of errors, or fitness for any particular use.
          </p>

          <h2 id="protocol-pledge">Use of the protocol</h2>
          <p>
            The {site.name} protocol itself is{" "}
            <strong>open and freely implementable</strong>. The
            specification (
            <Link href="/spec">/spec</Link>) is published under the
            following pledge from {site.steward.legalName}:
          </p>
          <blockquote>
            {site.steward.legalName} holds no patents on the {site.name}{" "}
            protocol&rsquo;s core mechanics (the User-Agent identifier,
            the AIDocument format, the verification mechanism) and pledges
            not to seek such patents. Implementations are free to build,
            fork, and extend. {site.steward.legalName} will not assert
            intellectual-property claims against implementations that
            conform to the protocol or that derive new protocols from it.
          </blockquote>
          <p>
            No additional license, registration, royalty, or attribution
            is required to implement the protocol. Conforming
            implementations are welcome to call themselves &ldquo;
            {site.name}-compliant&rdquo; or describe the protocol they
            implement using the {site.name} name in marketing copy. See{" "}
            <Link href="/about">/about</Link> for the longer rationale and{" "}
            <Link href="/implementing">/implementing</Link> for the
            practical how-to.
          </p>

          <h2 id="trademark">Trademark</h2>
          <p>
            The name &ldquo;{site.name}&rdquo;, the wordmark, and the
            associated visual identity remain with{" "}
            {site.steward.legalName}. You may use the name to describe a
            conformant implementation (e.g., &ldquo;{site.name}-compliant
            crawler,&rdquo; &ldquo;implements {site.name}&rdquo;) without
            permission. You may not use the name in a way that implies an
            endorsement, partnership, or sponsorship by{" "}
            {site.steward.legalName} when none exists. Reasonable, accurate
            descriptive use is fine.
          </p>

          <h2 id="implementations-listing">Listing in /implementations</h2>
          <p>
            Implementations are listed on{" "}
            <Link href="/implementations">/implementations</Link> at no
            charge upon request via email to{" "}
            <a href={`mailto:${site.contactEmail}`}>
              {site.contactEmail}
            </a>
            . We reserve the right to decline or remove listings that we
            cannot verify as conformant, or that misrepresent themselves
            as the canonical implementation. Editorial decisions about
            listing are{" "}
            {site.steward.legalName}&rsquo;s, not the protocol&rsquo;s.
          </p>

          <h2 id="changes">Changes</h2>
          <p>
            We may update this page when we update the documentation or
            the protocol. Material changes carry a fresh
            &ldquo;last updated&rdquo; date and continue to apply
            prospectively (changes do not retroactively affect what was
            published before).
          </p>

          <h2 id="governing-law">Governing law</h2>
          <p>
            Disputes about this site or the listed protocol pledges are
            governed by the laws of the State of Delaware, United States
            (the jurisdiction where {site.steward.legalName} is
            incorporated).
          </p>

          <h2 id="contact">Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a href={`mailto:${site.contactEmail}`}>
              {site.contactEmail}
            </a>
            .
          </p>
        </div>

        <hr className="rule-soft" style={{ marginTop: 40 }} />

        <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-ghost">
            Home
          </Link>
          <Link href="/privacy" className="btn btn-ghost">
            Privacy &rarr;
          </Link>
          <Link href="/about" className="btn btn-ghost">
            About
          </Link>
        </div>
      </div>
    </article>
  );
}
