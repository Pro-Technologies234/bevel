// ─────────────────────────────────────────────────────────────────────────────
// app/robots.ts  (Next.js dynamic robots.txt)
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute as MR } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://bevelui.vercel.app";

export default function robots(): MR.Robots {
  return {
    rules: [
      // 1. STANDARD CRAWLERS & REAL-TIME AI SEARCH (ALLOWED)
      {
        userAgent: [
          "*", // Default for standard Google, Bing, etc.
          "ChatGPT-User", // Real-time links shared by users in ChatGPT
          "OAI-SearchBot", // OpenAI's live Search engine
          "PerplexityBot", // Perplexity's real-time search answers
        ],
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/_next/"],
      },
      // AI crawlers — explicitly allowed
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "DuckDuckBot", allow: "/" },
      { userAgent: "CCBot", allow: "/" }, // Common Crawl
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "meta-externalagent", allow: "/" }, // Meta AI
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
      {
        userAgent: ["Google-Extended", "Applebot-Extended"],
        disallow: ["/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
