import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/site";
import "./globals.css";

/*
  Typography choice (intentional contrast with lyrenth.com):

    Inter         -- sans, used for body, nav, code labels
    Source Serif  -- serif, used for headings (h1.h-display, h2.h-section)

  Both via next/font/google so they're self-hosted at build time
  (no FOUT, no third-party CDN dependency, no GDPR concerns about
  Google Fonts hotlinks). Inter ships variable; Source Serif 4
  ditto.
*/
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: site.url,
  title: {
    default: `${site.name} - ${site.tagline}`,
    template: `%s - ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "AIWebIndex",
    "open protocol",
    "AI crawler",
    "structured web",
    "AIDocument",
    "robots.txt",
    "agent manifest",
    "schema.org",
    "machine-readable web",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url.toString(),
    title: `${site.name} - ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary",
    title: `${site.name} - ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body>
        <SiteNav />
        <main style={{ minHeight: "calc(100vh - 200px)" }}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
