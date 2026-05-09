import Link from "next/link";
import { site } from "@/lib/site";

/*
  Footer. Surfaces the stewardship + open-protocol pledge on every
  page so the framing isn't hidden in a single about-page. Three
  blocks left-to-right:

    1. Stewardship line (legal entity + address + pledge)
    2. Reference implementation pointer (lyrenth.com)
    3. Contact + repo + copyright

  The pledge is intentionally repeated verbatim from /about so a
  reader never has to dig: "Aleksma AI Inc. holds no patents on the
  protocol's core mechanics and pledges not to seek such patents."
  This is load-bearing for the open-protocol claim.
*/
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container-doc">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr",
            gap: 32,
          }}
          className="site-footer-grid"
        >
          <div>
            <p style={{ color: "var(--color-fg-2)", fontWeight: 500 }}>
              Stewardship &amp; pledge
            </p>
            <p>
              {site.name} is stewarded by{" "}
              <strong style={{ color: "var(--color-fg-2)", fontWeight: 500 }}>
                {site.steward.legalName}
              </strong>{" "}
              ({site.steward.type}), {site.steward.address}.
            </p>
            <p>
              {site.steward.legalName} holds no patents on the protocol&rsquo;s
              core mechanics and pledges not to seek such patents.
              Implementations are free to build, fork, and extend.
            </p>
          </div>
          <div>
            <p style={{ color: "var(--color-fg-2)", fontWeight: 500 }}>
              Reference implementation
            </p>
            <p>
              <a href={site.referenceImpl.url} target="_blank" rel="noopener noreferrer">
                {site.referenceImpl.name} &rarr;
              </a>
              <br />
              {site.referenceImpl.summary}
            </p>
          </div>
          <div>
            <p style={{ color: "var(--color-fg-2)", fontWeight: 500 }}>Contact</p>
            <p>
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
              <br />
              <a href={site.repo} target="_blank" rel="noopener noreferrer">
                Source on GitHub &rarr;
              </a>
            </p>
            <p style={{ marginTop: 12, fontSize: "0.78rem" }}>
              &copy; {year} {site.steward.legalName}.{" "}
              <Link href="/about">About</Link> &middot;{" "}
              <Link href="/privacy">Privacy</Link> &middot;{" "}
              <Link href="/terms">Terms</Link>
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 760px) {
          .site-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
