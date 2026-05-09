import Link from "next/link";
import { site } from "@/lib/site";

/*
  Site navigation. Plain text links across the top, no logo, no
  product chrome. Pattern matches w3.org / schema.org / rfc-editor.org
  (the visual identity of a documentation site, not a marketing
  site). The wordmark is just text ("aiwebindex.org"), styled
  monospace, with the .org suffix in blue.
*/

const NAV = [
  { label: "Spec", href: "/spec" },
  { label: "Implementations", href: "/implementations" },
  { label: "Implementing", href: "/implementing" },
  { label: "About", href: "/about" },
];

export function SiteNav() {
  return (
    <header className="site-nav">
      <div className="container-doc site-nav-inner">
        <Link href="/" aria-label={`${site.name} home`} className="wordmark">
          aiwebindex<span className="accent">.org</span>
        </Link>
        <nav aria-label="Primary">
          <ul style={{ display: "flex", gap: 22, margin: 0, padding: 0, listStyle: "none" }}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
