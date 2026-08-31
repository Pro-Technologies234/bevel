import type { Metadata, Viewport } from "next";

// ─── Site constants ───────────────────────────────────────────────────────────

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://bevelui.vercel.app";
export const SITE_NAME = "Bevel UI";
export const SITE_DESCRIPTION =
  "Fully-engineered UI systems for React. Product Tour, Command Palette, File Upload, and Form Engine — copy the code, own it forever. No lock-in. shadcn compatible.";
export const SITE_TWITTER = "@bevelui";
export const SITE_AUTHOR = "Bevel UI";

// ─── Shared OG image helper ───────────────────────────────────────────────────
// // Pass the type instead of the filename
function og(type: string = "default") {
  return `${SITE_URL}/og?type=${type}`;
}

// ─── Shared viewport (use in root layout) ────────────────────────────────────

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080808" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT METADATA (app/layout.tsx)
// ─────────────────────────────────────────────────────────────────────────────

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Bevel UI — Fully-Engineered UI Systems for React",
    template: "%s — Bevel UI",
  },

  description: SITE_DESCRIPTION,
  verification: {
    google: "google628f1670d43fce42",
  },
  keywords: [
    "react ui components",
    "shadcn ui",
    "product tour react",
    "command palette react",
    "file upload react",
    "multi-step form react",
    "react form wizard",
    "copy to own components",
    "tailwind ui components",
    "react component library",
    "ui systems",
    "bevel ui",
    "nextjs components",
    "react hooks library",
  ],

  authors: [{ name: SITE_AUTHOR, url: SITE_URL }],
  creator: SITE_AUTHOR,
  publisher: SITE_AUTHOR,

  category: "technology",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Bevel UI — Fully-Engineered UI Systems for React",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og/og-default.webp",
        width: 1200,
        height: 630,
        alt: "Bevel UI — Fully-engineered UI systems for React",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: SITE_TWITTER,
    creator: SITE_TWITTER,
    title: "Bevel UI — Fully-Engineered UI Systems for React",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og/og-default.webp",
        alt: "Bevel UI — Fully-engineered UI systems for React",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [{ rel: "mask-icon", url: "/favicon.svg", color: "#c2f13c" }],
  },

  manifest: "/manifest.webmanifest",

  alternates: {
    canonical: SITE_URL,
  },

  // Structured data is added separately via JSON-LD (see below)
};

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE (app/page.tsx)
// ─────────────────────────────────────────────────────────────────────────────

export const homeMetadata: Metadata = {
  title: "The UI Systems Your App Actually Needs",
  description:
    "Fully-engineered, copy-to-own UI systems for React. Product Tour, Command Palette, File Upload, Form Engine — drop into your codebase with one shadcn CLI command.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    title: "Bevel UI — The UI Systems Your App Actually Needs",
    description:
      "Fully-engineered, copy-to-own UI systems for React. Product Tour, Command Palette, File Upload, Form Engine — drop into your codebase with one shadcn CLI command.",
    images: [
      { url: "/og/og-default.webp", width: 1200, height: 630, alt: "Bevel UI" },
    ],
  },
  twitter: {
    title: "Bevel UI — The UI Systems Your App Actually Needs",
    description:
      "Fully-engineered, copy-to-own UI systems for React. No lock-in. shadcn compatible.",
    images: ["/og/og-default.webp"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PRICING PAGE (app/pricing/page.tsx)
// ─────────────────────────────────────────────────────────────────────────────

export const pricingMetadata: Metadata = {
  title: "Pricing",
  description:
    "Free systems forever. Pro is a one-time $49 payment — no subscription. Includes all current and future Pro systems plus Bevel Labs source code.",
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    url: `${SITE_URL}/pricing`,
    title: "Pricing — Bevel UI",
    description:
      "Free forever or $49 one-time. No subscription required. Own the code forever.",
    images: [
      {
        url: og("pricing"),
        width: 1200,
        height: 630,
        alt: "Bevel UI Pricing",
      },
    ],
  },
  twitter: {
    title: "Pricing — Bevel UI",
    description: "Free systems forever. Pro is $49 one-time — no subscription.",
    images: [og("pricing")],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LABS PAGE (app/labs/page.tsx)
// ─────────────────────────────────────────────────────────────────────────────

export const labsMetadata: Metadata = {
  title: "Bevel Labs",
  description:
    "Six fully functional applications built entirely with Bevel systems. File manager, onboarding flow, developer dashboard, intake form, client handoff tool, settings hub — use them live, get the source with Pro.",
  alternates: { canonical: `${SITE_URL}/labs` },
  openGraph: {
    url: `${SITE_URL}/labs`,
    title: "Bevel Labs — See the systems in production",
    description:
      "Six fully functional apps built with Bevel systems. Use them live. Get the source with Pro.",
    images: [{ url: og("labs"), width: 1200, height: 630, alt: "Bevel Labs" }],
  },
  twitter: {
    title: "Bevel Labs — See the systems in production",
    description:
      "Six real working apps built with Bevel — file manager, onboarding flow, dev dashboard, and more.",
    images: [og("labs")],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// OTHER MARKETING PAGES
// ─────────────────────────────────────────────────────────────────────────────

function pageOg(type: string) {
  return `${SITE_URL}/og?type=page&name=${encodeURIComponent(type)}`;
}

export const aboutMetadata: Metadata = {
  title: "About",
  description:
    "Why Bevel UI exists, the copy-to-own philosophy behind it, and who's building it.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    url: `${SITE_URL}/about`,
    title: "About — Bevel UI",
    description:
      "Why Bevel UI exists, and the copy-to-own philosophy behind every system.",
    images: [
      {
        url: pageOg("About Bevel UI"),
        width: 1200,
        height: 630,
        alt: "About Bevel UI",
      },
    ],
  },
  twitter: {
    title: "About — Bevel UI",
    description: "Why Bevel UI exists, and the philosophy behind it.",
    images: [pageOg("About Bevel UI")],
  },
};

export const compareMetadata: Metadata = {
  title: "Compare",
  description:
    "How Bevel UI's copy-to-own systems compare to primitive-only libraries, full component kits, and building it yourself.",
  alternates: { canonical: `${SITE_URL}/compare` },
  openGraph: {
    url: `${SITE_URL}/compare`,
    title: "Compare — Bevel UI",
    description:
      "Systems vs. primitives vs. component kits vs. building it yourself.",
    images: [
      {
        url: pageOg("Compare Bevel UI"),
        width: 1200,
        height: 630,
        alt: "Compare Bevel UI",
      },
    ],
  },
  twitter: {
    title: "Compare — Bevel UI",
    description: "How Bevel UI compares to the alternatives.",
    images: [pageOg("Compare Bevel UI")],
  },
};

export const changelogMetadata: Metadata = {
  title: "Changelog",
  description:
    "What's new, updated, and shipping next across every Bevel UI system.",
  alternates: { canonical: `${SITE_URL}/changelog` },
  openGraph: {
    url: `${SITE_URL}/changelog`,
    title: "Changelog — Bevel UI",
    description: "What's new and updated across every Bevel UI system.",
    images: [
      {
        url: pageOg("Changelog"),
        width: 1200,
        height: 630,
        alt: "Bevel UI Changelog",
      },
    ],
  },
  twitter: {
    title: "Changelog — Bevel UI",
    description: "What's new and updated across every Bevel UI system.",
    images: [pageOg("Changelog")],
  },
};

export const enterpriseMetadata: Metadata = {
  title: "Enterprise",
  description:
    "Bevel UI for teams — shared licensing, priority support, and a consistent system across every product surface.",
  alternates: { canonical: `${SITE_URL}/enterprise` },
  openGraph: {
    url: `${SITE_URL}/enterprise`,
    title: "Enterprise — Bevel UI",
    description:
      "Bevel UI for teams — shared licensing, priority support, and one consistent system.",
    images: [
      {
        url: pageOg("Bevel UI for Teams"),
        width: 1200,
        height: 630,
        alt: "Bevel UI for Teams",
      },
    ],
  },
  twitter: {
    title: "Enterprise — Bevel UI",
    description: "Bevel UI for teams.",
    images: [pageOg("Bevel UI for Teams")],
  },
};

export const termsMetadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of Bevel UI's site, code, and paid plans.",
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
};

export const privacyMetadata: Metadata = {
  title: "Privacy Policy",
  description: "What data Bevel UI collects, why, and how it's handled.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCS — Re-exported from @/content/docs/manifest (Single Source of Truth)
// ─────────────────────────────────────────────────────────────────────────────

export {
  docsRootMetadata as docsMetadata,
  docsIntroductionMetadata,
  docsInstallationMetadata,
  docsComponentsMetadata,
  getSystemMetadata,
} from "@/content/docs/manifest";

// ─────────────────────────────────────────────────────────────────────────────
// LABS — INDIVIDUAL PREVIEWS (app/preview/[name]/page.tsx)
// ─────────────────────────────────────────────────────────────────────────────

export const labPreviewMetadata: Record<string, Metadata> = {
  vault: {
    title: "Vault — Bevel Labs",
    description:
      "A fully functional file manager built with Bevel File Upload and Command Palette systems. Upload, organise, search, and manage files with ⌘K.",
    openGraph: {
      title: "Vault — Bevel Labs",
      description:
        "Full Google Drive-style file manager. Built with Bevel File Upload + Command Palette.",
      images: [{ url: og("vault"), width: 1200, height: 630 }],
    },
    twitter: { images: [og("vault")] },
  },
  onboard: {
    title: "Onboard — Bevel Labs",
    description:
      "A SaaS onboarding flow — multi-step signup form that lands in a guided product tour of the resulting dashboard.",
    openGraph: {
      title: "Onboard — Bevel Labs",
      description:
        "Multi-step signup + product tour. Built with Bevel Form Engine + Product Tour.",
      images: [{ url: og("onboard"), width: 1200, height: 630 }],
    },
    twitter: { images: [og("onboard")] },
  },
  launchpad: {
    title: "Launchpad — Bevel Labs",
    description:
      "A developer deployment dashboard with live project metrics, deployment history, and ⌘K navigation. Built with Bevel Command Palette and Product Tour.",
    openGraph: {
      title: "Launchpad — Bevel Labs",
      description:
        "Deployment dashboard with ⌘K. Built with Bevel Command Palette + Product Tour.",
      images: [{ url: og("launchpad"), width: 1200, height: 630 }],
    },
    twitter: { images: [og("launchpad")] },
  },
  intake: {
    title: "Intake — Bevel Labs",
    description:
      "A branded multi-step job application form with role selection, conditional fields, and confirmation state. Built with Bevel Form Engine.",
    openGraph: {
      title: "Intake — Bevel Labs",
      description:
        "Multi-step job application form. Built with Bevel Form Engine.",
      images: [{ url: og("intake"), width: 1200, height: 630 }],
    },
    twitter: { images: [og("intake")] },
  },
  briefcase: {
    title: "Briefcase — Bevel Labs",
    description:
      "A client project handoff tool — fill the brief, upload deliverables, generate a receipt. Built with Bevel Form Engine and File Upload.",
    openGraph: {
      title: "Briefcase — Bevel Labs",
      description:
        "Client handoff tool. Built with Bevel Form Engine + File Upload.",
      images: [{ url: og("briefcase"), width: 1200, height: 630 }],
    },
    twitter: { images: [og("briefcase")] },
  },
  compass: {
    title: "Compass — Bevel Labs",
    description:
      "A settings hub with five sections — Profile, Notifications, Appearance, Security, API keys — navigable via sidebar or ⌘K with a guided tour.",
    openGraph: {
      title: "Compass — Bevel Labs",
      description:
        "Settings hub with ⌘K navigation and guided tour. Built with three Bevel systems.",
      images: [{ url: og("compass"), width: 1200, height: 630 }],
    },
    twitter: { images: [og("compass")] },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD (app/(dashboard)/dashboard/...)
// ─────────────────────────────────────────────────────────────────────────────

export const dashboardMetadata: Metadata = {
  title: "Dashboard",
  description:
    "Your Bevel UI dashboard — manage your systems, license key, billing, and team.",
  robots: { index: false, follow: false }, // never index authenticated pages
  openGraph: {
    title: "Dashboard — Bevel UI",
    description: "Your Bevel UI dashboard.",
    images: [{ url: og("dashboard"), width: 1200, height: 630 }],
  },
};

export const dashboardComponentsMetadata: Metadata = {
  title: "My Systems — Dashboard",
  description:
    "All Bevel UI systems you have access to, with install commands and license key.",
  robots: { index: false, follow: false },
};

export const dashboardBillingMetadata: Metadata = {
  title: "Billing — Dashboard",
  description:
    "Manage your Bevel UI subscription, team seats, and payment method.",
  robots: { index: false, follow: false },
};

export const dashboardInvoicesMetadata: Metadata = {
  title: "Invoices — Dashboard",
  description: "Your complete billing history and downloadable invoices.",
  robots: { index: false, follow: false },
};

export const dashboardSettingsMetadata: Metadata = {
  title: "Settings — Dashboard",
  description: "Manage your Bevel UI account settings, password, and profile.",
  robots: { index: false, follow: false },
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTH PAGES
// ─────────────────────────────────────────────────────────────────────────────

export const loginMetadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your Bevel UI account to access your systems, license key, and dashboard.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Sign in — Bevel UI",
    description: "Sign in to your Bevel UI account.",
    images: [{ url: "/og/og-default.webp", width: 1200, height: 630 }],
  },
};

export const signupMetadata: Metadata = {
  title: "Create account",
  description:
    "Create a free Bevel UI account to install systems via the CLI, track your access, and upgrade to Pro.",
  openGraph: {
    title: "Create account — Bevel UI",
    description:
      "Free account. Access all free systems instantly via the shadcn CLI.",
    images: [{ url: "/og/og-default.webp", width: 1200, height: 630 }],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN (never indexed)
// ─────────────────────────────────────────────────────────────────────────────

export const adminMetadata: Metadata = {
  title: "Admin — Bevel UI",
  robots: { index: false, follow: false, nocache: true },
};

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD STRUCTURED DATA
// Drop these as <script> tags in the relevant page components
// ─────────────────────────────────────────────────────────────────────────────

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bevel UI",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  sameAs: ["https://twitter.com/bevelui", "https://github.com/bevelui"],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bevel UI",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/docs?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bevel UI",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free",
      description:
        "Product Tour, Command Palette, File Upload, Form Engine — MIT licensed",
    },
    {
      "@type": "Offer",
      price: "49",
      priceCurrency: "USD",
      name: "Pro",
      description: "All Pro systems + Bevel Labs source code",
    },
  ],
};
