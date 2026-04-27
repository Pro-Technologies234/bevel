// ─────────────────────────────────────────────────────────────────────────────
// app/robots.ts  (Next.js dynamic robots.txt)
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute as MR } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://bevelui.com";

export default function robots(): MR.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/dashboard/", "/admin", "/admin/", "/api/"],
      },
      {
        // Block AI training crawlers
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
          "Bytespider",
          "Diffbot",
          "ImagesiftBot",
          "omgili",
          "omgilibot",
        ],
        disallow: ["/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
