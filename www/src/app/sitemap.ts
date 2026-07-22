// ─────────────────────────────────────────────────────────────────────────────
// app/sitemap.ts  (Next.js dynamic sitemap)
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from "next";
import { DOCS_SYSTEMS, getSystemHref } from "@/content/docs/manifest";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://bevelui.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // ── Marketing pages ──────────────────────────────────────────────────────
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/labs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },

    // ── Docs ─────────────────────────────────────────────────────────────────
    {
      url: `${SITE_URL}/docs/introduction`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/docs/installation`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/docs/components`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // ── Component Systems (Single Source of Truth from manifest.ts) ───────────
    ...DOCS_SYSTEMS.map((system) => ({
      url: `${SITE_URL}${getSystemHref(system.route)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),

    // ── Labs previews (public, indexable) ─────────────────────────────────────
    {
      url: `${SITE_URL}/preview/vault`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/preview/onboard`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/preview/launchpad`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/preview/intake`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/preview/briefcase`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/preview/compass`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // ── Auth ──────────────────────────────────────────────────────────────────
    {
      url: `${SITE_URL}/login`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/signup`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },

    // ── Dashboard and admin are intentionally NOT in the sitemap ─────────────
    // (robots.txt also disallows them — see below)
  ];
}
