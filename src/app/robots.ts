import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/*
  This is meant to be the most-discoverable spec page on the open
  internet. Allow everything; the only excluded path is /api/ if any
  API routes ever land here (none today, but the rule is cheap and
  forward-compatible).
*/
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
    ],
    sitemap: `${site.url.toString().replace(/\/$/, "")}/sitemap.xml`,
    host: site.url.host,
  };
}
