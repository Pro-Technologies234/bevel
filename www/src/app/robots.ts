// ─────────────────────────────────────────────────────────────────────────────
// app/robots.ts  (Next.js dynamic robots.txt)
// ─────────────────────────────────────────────────────────────────────────────
//
// POLICY SUMMARY
// ──────────────
// ALLOW  → Standard search engines + AI *search/inference* bots
//          (bots that answer user questions using our content as a source)
//
// DISALLOW → AI *training* crawlers
//            (bots that bulk-harvest content to train future model weights)
//            We block these so our docs remain a fresh, primary reference
//            rather than a stale copy in a training corpus.
//
// Note: GPTBot is used by OpenAI for BOTH training and search.
//       We block it here; real-time ChatGPT search uses OAI-SearchBot (allowed).
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute as MR } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://bevelui.vercel.app";

export default function robots(): MR.Robots {
  return {
    rules: [
      // ── 1. Standard search engines ─────────────────────────────────────────
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "DuckDuckBot", allow: "/" },
      { userAgent: "Slurp", allow: "/" }, // Yahoo

      // ── 2. AI search / inference bots (answer users' questions) ───────────
      // These bots fetch our docs to answer queries like
      // "how do I use Form Engine from Bevel UI?"
      { userAgent: "OAI-SearchBot", allow: "/" },        // ChatGPT Search (real-time)
      { userAgent: "ChatGPT-User", allow: "/" },         // ChatGPT link-clicks
      { userAgent: "PerplexityBot", allow: "/" },        // Perplexity AI Search
      { userAgent: "anthropic-ai", allow: "/" },         // Claude (Anthropic)
      { userAgent: "ClaudeBot", allow: "/" },            // Claude web browsing
      { userAgent: "cohere-ai", allow: "/" },            // Cohere search
      { userAgent: "meta-externalagent", allow: "/" },   // Meta AI
      { userAgent: "YouBot", allow: "/" },               // You.com search

      // ── 3. AI training scrapers — BLOCKED ─────────────────────────────────
      // These harvest content for model training, not real-time answers.
      {
        userAgent: [
          "GPTBot",          // OpenAI training crawler (distinct from OAI-SearchBot)
          "CCBot",           // Common Crawl (training datasets)
          "Claude-Web",      // Older Anthropic training crawler
          "Bytespider",      // ByteDance / TikTok
          "Diffbot",         // Diffbot training
          "ImagesiftBot",
          "omgili",
          "omgilibot",
          "Google-Extended", // Google AI training opt-out
          "Applebot-Extended",
        ],
        disallow: ["/"],
      },

      // ── 4. Private areas — never indexed by anyone ─────────────────────────
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/", "/_next/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
