import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy notice for aiwebindex.org. The protocol's documentation site collects no personal data; the commercial reference implementation has its own privacy policy at ${site.referenceImpl.url}/privacy.`,
};

const LAST_UPDATED = "May 10, 2026";

/*
  Minimal privacy notice for aiwebindex.org.

  This is a documentation / standards-body site. It has:
    - no user accounts
    - no API endpoints that take payloads
    - no contact form, only mailto:
    - no analytics
    - no first-party cookies

  So the "privacy policy" is correspondingly short. Anything that
  would require a longer policy (account creation, payment, customer
  data) lives on lyrenth.com (the reference commercial implementation),
  which has its own privacy policy. We point at it here so a reader
  who arrived from a Lyrenth context lands at the right document.
*/
export default function PrivacyPage() {
  return (
    <article style={{ padding: "48px 0 72px" }}>
      <div className="container-doc">
        <span className="eyebrow">Privacy notice</span>
        <h1 className="h-display" style={{ marginTop: 12 }}>
          Privacy notice.
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
          <h2 id="scope">Scope of this notice</h2>
          <p>
            <code>aiwebindex.org</code> is the documentation site for the
            open {site.name} protocol, operated by{" "}
            <strong>{site.steward.legalName}</strong> as protocol steward.
            The site is static documentation: there are no accounts,
            no API endpoints, no contact form, and no first-party
            analytics. This notice covers only the documentation site.
          </p>
          <p>
            The reference commercial implementation of the protocol,{" "}
            <a
              href={site.referenceImpl.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.referenceImpl.name}
            </a>
            , does collect operational data (account email, API request
            logs, cached crawl content) and has its own separate privacy
            policy at{" "}
            <a
              href={`${site.referenceImpl.url}/privacy`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.referenceImpl.url.replace(/^https?:\/\//, "")}/privacy
            </a>
            . If you signed up there, that policy applies to you.
          </p>

          <h2 id="what-we-collect">What this site collects</h2>
          <p>Nothing identifying. Specifically:</p>
          <ul>
            <li>No user accounts; no email collection on this site.</li>
            <li>No analytics scripts, no tracking pixels, no fingerprinting.</li>
            <li>No first-party cookies. No third-party cookies set by this site.</li>
            <li>
              No contact form. The only way to reach us is the{" "}
              <code>mailto:</code> link, which opens your own email client.
            </li>
          </ul>

          <h2 id="hosting">Hosting</h2>
          <p>
            The site is hosted on{" "}
            <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer">
              Vercel
            </a>
            . Vercel may collect standard server-access logs (IP address,
            User-Agent, request path, timestamp) for the operation of
            their infrastructure; their handling is governed by their own
            privacy policy. We do not export or process those logs
            ourselves.
          </p>

          <h2 id="email">Email contact</h2>
          <p>
            If you email{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>,
            your email address and message reach us via standard email
            routing. We retain those messages for as long as needed to
            answer them and may retain follow-up correspondence in the
            same email account. We do not add the address to any
            mailing list.
          </p>

          <h2 id="changes">Changes</h2>
          <p>
            If this site ever starts collecting personal data (e.g., we
            add a contact form, account system, or analytics), this
            notice gets a meaningful update with the corresponding
            disclosure and a fresh &ldquo;last updated&rdquo; date. The
            current state, as of {LAST_UPDATED}, is no collection.
          </p>

          <h2 id="contact">Contact</h2>
          <p>
            Privacy questions related specifically to this site:{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
            For questions about data handling at the {site.referenceImpl.name}{" "}
            commercial implementation, see its own privacy policy linked
            above.
          </p>
        </div>

        <hr className="rule-soft" style={{ marginTop: 40 }} />

        <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-ghost">
            Home
          </Link>
          <Link href="/terms" className="btn btn-ghost">
            Terms &rarr;
          </Link>
          <Link href="/about" className="btn btn-ghost">
            About
          </Link>
        </div>
      </div>
    </article>
  );
}
