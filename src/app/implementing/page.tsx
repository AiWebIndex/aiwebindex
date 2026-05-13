import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Implementer's guide",
  description: `A practical walkthrough for building an ${site.name}-conformant crawler. Covers User-Agent setup, AIDocument shape, verification, robots.txt handling, and the conformance checklist.`,
};

/*
  /implementing: practical guide for someone writing a new
  AIWebIndex-conformant crawler. The /spec page is normative; this
  page is operational. Reads like a "build it on the weekend"
  walkthrough rather than a spec.

  Code samples in three languages (curl / Python / JS) so a reader
  can copy the snippet that matches their stack. Each shows the
  same thing (a User-Agent-tagged GET against a target URL),
  because the protocol-side surface is small.
*/

const UA = `${site.name}/${site.protocolVersion} (+https://example.com/bot; my-impl)`;

export default function ImplementingPage() {
  return (
    <article style={{ padding: "48px 0 72px" }}>
      <div className="container-doc">
        <span className="eyebrow">Practical guide</span>
        <h1 className="h-display" style={{ marginTop: 12 }}>
          Implement {site.name} in a weekend.
        </h1>
        <p
          style={{
            marginTop: 20,
            fontFamily: "var(--font-serif)",
            fontSize: "1.15rem",
            lineHeight: 1.6,
            color: "var(--color-fg-2)",
            maxWidth: "60ch",
          }}
        >
          This page is operational, not normative. For binding requirements
          read the <Link href="/spec">specification</Link>; this guide
          covers how to actually build something conformant.
        </p>

        <hr className="rule-soft" style={{ marginTop: 32 }} />

        <div className="prose-doc" style={{ marginTop: 32 }}>
          <h2 id="overview">Overview</h2>
          <p>
            A minimum-viable {site.name} implementation needs five things:
          </p>
          <ol>
            <li>
              An HTTP client that sends the {site.name} User-Agent.
            </li>
            <li>
              A robots.txt parser that respects rules for{" "}
              <code>{site.name}</code>.
            </li>
            <li>
              An HTML extractor that produces an AIDocument shape.
            </li>
            <li>
              A verification flow (DNS TXT or .well-known) for site
              ownership.
            </li>
            <li>
              An origin rate-limit (default 2 seconds between hits to the
              same domain).
            </li>
          </ol>
          <p>
            Everything else (storage, queuing, dashboards, billing) is your
            product surface. The protocol does not require any of it.
          </p>

          {/* ---- Step 1: tagged HTTP client ---- */}
          <h2 id="step-1">1. Send the User-Agent</h2>
          <p>
            Every protocol-driven fetch carries a stable User-Agent so site
            operators can allowlist (or block) you predictably. Use{" "}
            <code>{site.name}/{site.protocolVersion}</code> as the prefix
            and append your implementation&rsquo;s identifier.
          </p>

          <h3 id="step-1-curl">curl</h3>
          <pre>
            <code>{`curl -H 'User-Agent: ${UA}' \\
     'https://example.com/article'`}</code>
          </pre>

          <h3 id="step-1-python">Python (httpx)</h3>
          <pre>
            <code>{`import httpx

UA = "${UA}"

with httpx.Client(headers={"User-Agent": UA}, timeout=15.0) as client:
    r = client.get("https://example.com/article", follow_redirects=True)
    r.raise_for_status()
    html = r.text
    final_url = str(r.url)`}</code>
          </pre>

          <h3 id="step-1-node">Node (fetch)</h3>
          <pre>
            <code>{`const UA = "${UA}";

const res = await fetch("https://example.com/article", {
  redirect: "follow",
  headers: { "User-Agent": UA },
});
if (!res.ok) throw new Error(\`upstream \${res.status}\`);
const html = await res.text();
const finalUrl = res.url;`}</code>
          </pre>

          {/* ---- Step 2: robots.txt ---- */}
          <h2 id="step-2">2. Honor robots.txt</h2>
          <p>
            Before fetching, check{" "}
            <code>https://&lt;domain&gt;/robots.txt</code> for rules
            addressed to your User-Agent token (
            <code>User-agent: {site.name}</code>) or the wildcard
            (<code>User-agent: *</code>). Most languages have a parser
            available; the one in the Python standard library
            (<code>urllib.robotparser</code>) is sufficient.
          </p>
          <p>
            A site that wants to block you publishes:
          </p>
          <pre>
            <code>{`User-agent: ${site.name}
Disallow: /`}</code>
          </pre>
          <p>A site that wants to explicitly allow you publishes:</p>
          <pre>
            <code>{`User-agent: ${site.name}
Allow: /

User-agent: *
Disallow:`}</code>
          </pre>

          {/* ---- Step 3: AIDocument extraction ---- */}
          <h2 id="step-3">3. Extract an AIDocument (2.0 grouped envelope)</h2>
          <p>
            Take the fetched HTML and produce the JSON envelope described
            in <Link href="/spec#section-4">spec section 4</Link>. 2.0
            groups fields under semantic blocks rather than the flat
            layout used by 1.0. The required top-level groups are:{" "}
            <code>schema</code>, <code>source</code>, <code>cache</code>,{" "}
            <code>identity</code>, <code>content</code>,{" "}
            <code>structure</code>, and <code>signals</code>.{" "}
            <code>economics</code> is optional. If you&rsquo;re porting
            from a 1.0 implementation, see{" "}
            <Link href="/spec#section-4-4">spec section 4.4</Link> for the
            field-by-field rename map.
          </p>
          <p>
            Per-group, in the order you&rsquo;ll typically build them:
          </p>
          <ul>
            <li>
              <strong>schema</strong>:{" "}
              <code>{`{ name: "AIDocument", version: "${site.protocolVersion}" }`}</code>{" "}
              is the minimum. The optional <code>ref</code> is a content-
              addressed identifier you compute once over the non-volatile
              fields; agents can use it to detect unchanged pages across
              re-crawls without diffing the body.
            </li>
            <li>
              <strong>source.url</strong>: the URL <em>after</em> redirects
              (<code>r.url</code> in httpx; <code>res.url</code> in fetch).
            </li>
            <li>
              <strong>source.freshness_policy</strong>: the policy the
              CALLER requested (<code>cache_first</code> or{" "}
              <code>force_refresh</code>). If your implementation has no
              caching layer, default to{" "}
              <code>&quot;force_refresh&quot;</code>.
            </li>
            <li>
              <strong>source.fetched_at</strong>: an RFC 3339 timestamp
              (e.g., <code>2026-05-13T12:34:56Z</code>).
            </li>
            <li>
              <strong>source.render_mode</strong>: <code>&quot;static&quot;</code>{" "}
              when you served HTML straight off the wire;{" "}
              <code>&quot;rendered&quot;</code> if you ran a headless
              browser.
            </li>
            <li>
              <strong>cache</strong>: at minimum{" "}
              <code>{`{ status: "miss", origin_contacted: true, body_fetched: true }`}</code>{" "}
              when serving from a fresh fetch. Implementations without a
              cache always emit{" "}
              <code>&quot;miss&quot;</code> or{" "}
              <code>&quot;refreshed&quot;</code>.
            </li>
            <li>
              <strong>identity.title</strong>: prefer <code>og:title</code>,
              then the first <code>h1</code>, then{" "}
              <code>&lt;title&gt;</code>.
            </li>
            <li>
              <strong>identity.language</strong>: prefer{" "}
              <code>html[lang]</code>; otherwise detect.
            </li>
            <li>
              <strong>content.markdown</strong>: strip boilerplate (nav,
              footer, ads) and convert the main content. Tools like{" "}
              <code>trafilatura</code> (Python) or{" "}
              <code>@mozilla/readability</code> (Node) handle this well.
            </li>
            <li>
              <strong>structure.headings</strong>: walk the DOM, collect{" "}
              <code>h1</code>-<code>h6</code> in document order with their
              levels.
            </li>
            <li>
              <strong>structure.links</strong>: collect{" "}
              <code>&lt;a href&gt;</code> elements; mark{" "}
              <code>internal: true</code> when the link host equals the
              page host.
            </li>
            <li>
              <strong>signals.has_json_ld</strong>: true if you found any{" "}
              <code>&lt;script type=&quot;application/ld+json&quot;&gt;</code>{" "}
              blocks on the page.
            </li>
            <li>
              <strong>signals.heading_hierarchy_ok</strong>: true if there
              is at least one heading, the first is h1 or h2, and no
              adjacent levels jump by more than 1.
            </li>
          </ul>
          <p>
            See <Link href="/spec#section-4-3">spec section 4.3</Link> for
            a complete example response.
          </p>

          {/* ---- Step 4: verification ---- */}
          <h2 id="step-4">4. Verify domain ownership</h2>
          <p>
            When a site owner registers their domain with your
            implementation, generate a verification token (at least 128
            bits of entropy) and ask them to publish either:
          </p>
          <h3 id="step-4-dns">DNS TXT (recommended)</h3>
          <pre>
            <code>{`_aiwebindex-verify.<their-domain>  TXT  "aiwi-verify=<token>"`}</code>
          </pre>
          <p>Then resolve from a public resolver:</p>
          <pre>
            <code>{`# python (dnspython)
import dns.resolver

answers = dns.resolver.resolve(
    f"_aiwebindex-verify.{domain}", "TXT"
)
for rdata in answers:
    if f'aiwi-verify={token}' in str(rdata):
        verified = True`}</code>
          </pre>
          <h3 id="step-4-well-known">.well-known file</h3>
          <pre>
            <code>{`# their server returns:
GET https://<their-domain>/.well-known/aiwebindex-verify.txt

# response body:
aiwi-verify=<token>`}</code>
          </pre>
          <p>
            Use HTTPS only. Reject plain-HTTP fetches even if they redirect
            to HTTPS later. Per{" "}
            <Link href="/spec#section-5-2">spec 5.2</Link>, cross-domain
            redirects do not count.
          </p>

          {/* ---- Step 5: rate limit ---- */}
          <h2 id="step-5">5. Rate-limit by origin</h2>
          <p>
            Track the last fetch time per canonical hostname; refuse to
            fetch the same hostname within{" "}
            <strong>2 seconds</strong> of the last attempt. A simple
            in-memory map keyed by hostname is enough for most
            implementations:
          </p>
          <pre>
            <code>{`const lastFetch = new Map<string, number>();

async function fetchWithCooldown(url: URL) {
  const host = url.hostname;
  const last = lastFetch.get(host) ?? 0;
  const wait = 2000 - (Date.now() - last);
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastFetch.set(host, Date.now());
  return fetch(url, { headers: { "User-Agent": UA } });
}`}</code>
          </pre>
          <p>
            Honor <code>Crawl-delay</code> in robots.txt where the value
            exceeds your default. Honor HTTP{" "}
            <code>429 Too Many Requests</code> and{" "}
            <code>503 Service Unavailable</code> as described in{" "}
            <Link href="/spec#section-6-3">spec 6.3</Link>.
          </p>

          {/* ---- Conformance checklist ---- */}
          <h2 id="checklist">Conformance checklist</h2>
          <p>
            Before shipping, walk through this list. If you can answer
            &ldquo;yes&rdquo; to each item, your implementation conforms to{" "}
            {site.name} {site.protocolVersion}.
          </p>
          <ul>
            <li>
              Every protocol-driven fetch sends a User-Agent starting with{" "}
              <code>{site.name}/{site.protocolVersion}</code>.
            </li>
            <li>
              robots.txt rules for{" "}
              <code>User-agent: {site.name}</code> are honored.
            </li>
            <li>
              Wildcard <code>User-agent: *</code> rules apply when no
              agent-specific block is present.
            </li>
            <li>
              The HTTP <code>Crawl-delay</code> directive is respected when
              greater than the default per-origin cooldown.
            </li>
            <li>
              HTTP <code>429</code> and <code>503</code> responses pause
              fetches per spec section 6.3.
            </li>
            <li>
              AIDocument responses include all seven required top-level
              groups (<code>schema</code>, <code>source</code>,{" "}
              <code>cache</code>, <code>identity</code>,{" "}
              <code>content</code>, <code>structure</code>,{" "}
              <code>signals</code>) per spec section 4.1, and{" "}
              <code>schema.version</code> matches the version your
              implementation conforms to (currently{" "}
              <code>{site.protocolVersion}</code>).
            </li>
            <li>
              At least one of DNS TXT or .well-known verification is
              implemented end-to-end.
            </li>
            <li>
              Verification fetches use HTTPS only and reject cross-domain
              redirects.
            </li>
            <li>
              No User-Agent spoofing or bypass of authenticated content.
            </li>
            <li>
              No end-user identifiers leak into the AIDocument or the
              outbound request.
            </li>
          </ul>

          <h2 id="reference-impl">Reference implementation</h2>
          <p>
            The{" "}
            <a
              href={site.referenceImpl.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.referenceImpl.name}
            </a>{" "}
            stack at {site.referenceImpl.url.replace(/^https?:\/\//, "")} is
            the reference: a Go API, a Postgres-backed crawl queue, a
            chromedp-based renderer for SPA pages, and a Next.js dashboard
            for site owners. Source for the protocol-relevant bits is on
            GitHub. Use it to compare behavior. But the spec is what you
            implement against, not Lyrenth specifically.
          </p>

          <h2 id="get-listed">Get listed once shipped</h2>
          <p>
            When your implementation is live, email{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>{" "}
            with a link and a one-paragraph summary. Conforming
            implementations are listed on{" "}
            <Link href="/implementations">/implementations</Link> at no
            charge.
          </p>
        </div>

        <hr className="rule-soft" style={{ marginTop: 40 }} />

        <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/spec" className="btn btn-primary">
            Read the full spec &rarr;
          </Link>
          <Link href="/implementations" className="btn btn-ghost">
            See live implementations
          </Link>
        </div>
      </div>
    </article>
  );
}
