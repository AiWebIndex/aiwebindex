import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/*
  Site map: list every routable page so search engines and AI
  crawlers index them all. Update lastModified whenever the spec
  body changes; today every page is at the same publish date.
*/
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.toString().replace(/\/$/, "");
  const lastModified = new Date(site.publishedDate);

  return [
    { url: `${base}/`, lastModified, changeFrequency: "monthly", priority: 1.0 },
    { url: `${base}/spec`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/implementations`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/implementing`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/llms.txt`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/llms-full.txt`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];
}
