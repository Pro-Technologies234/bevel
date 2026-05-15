// ─────────────────────────────────────────────────────────────────────────────
// BEVEL UI — Complete Metadata Configuration
// Next.js App Router style — use in layout.tsx or page.tsx files
//
// IMAGE FILES YOU NEED TO CREATE AND PUT IN /public:
//
//   /public/og/og-default.png        1200×630  — main OG image (dark bg, lime logo, headline)
//   /public/og/og-docs.png           1200×630  — docs OG (code window visual)
//   /public/og/og-pricing.png        1200×630  — pricing OG (three plan cards)
//   /public/og/og-labs.png           1200×630  — labs OG (grid of 6 app screenshots)
//   /public/og/og-tour.png           1200×630  — product tour system OG
//   /public/og/og-command.png        1200×630  — command palette system OG
//   /public/og/og-upload.png         1200×630  — file upload system OG
//   /public/og/og-form.png           1200×630  — form engine system OG
//   /public/og/og-vault.png          1200×630  — vault lab OG
//   /public/og/og-onboard.png        1200×630  — onboard lab OG
//   /public/og/og-launchpad.png      1200×630  — launchpad lab OG
//   /public/og/og-intake.png         1200×630  — intake lab OG
//   /public/og/og-briefcase.png      1200×630  — briefcase lab OG
//   /public/og/og-compass.png        1200×630  — compass lab OG
//   /public/og/og-dashboard.png      1200×630  — user dashboard OG
//   /public/favicon.ico              32×32
//   /public/favicon-16.png           16×16
//   /public/favicon-32.png           32×32
//   /public/apple-touch-icon.png     180×180
//   /public/icon-192.png             192×192   — PWA icon
//   /public/icon-512.png             512×512   — PWA icon
//   /public/logo.png                 400×400   — square logo for structured data
//   /public/manifest.webmanifest                — PWA manifest (included below)
//
// TOOLS TO GENERATE OG IMAGES:
//   Option A: @vercel/og — generate them dynamically via /app/og/route.tsx (code below)
//   Option B: Design in Figma, export as PNG, drop in /public/og/
//   Option C: Use og-image.vercel.app for quick generation
// ─────────────────────────────────────────────────────────────────────────────

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
        url: "/og/og-default.png",
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
        url: "/og/og-default.png",
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
  title: "Bevel UI — The UI Systems Your App Actually Needs",
  description:
    "Fully-engineered, copy-to-own UI systems for React. Product Tour, Command Palette, File Upload, Form Engine — drop into your codebase with one shadcn CLI command.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    title: "Bevel UI — The UI Systems Your App Actually Needs",
    description:
      "Fully-engineered, copy-to-own UI systems for React. Product Tour, Command Palette, File Upload, Form Engine — drop into your codebase with one shadcn CLI command.",
    images: [
      { url: "/og/og-default.png", width: 1200, height: 630, alt: "Bevel UI" },
    ],
  },
  twitter: {
    title: "Bevel UI — The UI Systems Your App Actually Needs",
    description:
      "Fully-engineered, copy-to-own UI systems for React. No lock-in. shadcn compatible.",
    images: ["/og/og-default.png"],
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
// DOCS — ROOT (app/docs/layout.tsx or app/docs/page.tsx)
// ─────────────────────────────────────────────────────────────────────────────

export const docsMetadata: Metadata = {
  title: "Documentation",
  description:
    "Full documentation for all Bevel UI systems. Installation, API reference, live demos, and code examples for Product Tour, Command Palette, File Upload, and Form Engine.",
  alternates: { canonical: `${SITE_URL}/docs` },
  openGraph: {
    url: `${SITE_URL}/docs`,
    title: "Documentation — Bevel UI",
    description:
      "Installation, API reference, live demos, and code examples for all Bevel UI systems.",
    images: [
      {
        url: og("docs"),
        width: 1200,
        height: 630,
        alt: "Bevel UI Documentation",
      },
    ],
  },
  twitter: {
    title: "Documentation — Bevel UI",
    description:
      "Full docs for all Bevel UI systems with live interactive demos.",
    images: [og("docs")],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCS — INTRODUCTION
// ─────────────────────────────────────────────────────────────────────────────

export const docsIntroductionMetadata: Metadata = {
  title: "Introduction",
  description:
    "Learn what Bevel UI is, how it's different from a component library, and the philosophy behind the copy-to-own model.",
  alternates: { canonical: `${SITE_URL}/docs/introduction` },
  openGraph: {
    url: `${SITE_URL}/docs/introduction`,
    title: "Introduction — Bevel UI Docs",
    description:
      "What Bevel UI is and why it exists. Not a component library — a system.",
    images: [
      {
        url: og("docs"),
        width: 1200,
        height: 630,
        alt: "Bevel UI Introduction",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCS — INSTALLATION
// ─────────────────────────────────────────────────────────────────────────────

export const docsInstallationMetadata: Metadata = {
  title: "Installation",
  description:
    "Install any Bevel UI system with a single shadcn CLI command. Files copy directly into your project — no npm package, no external dependency.",
  alternates: { canonical: `${SITE_URL}/docs/installation` },
  openGraph: {
    url: `${SITE_URL}/docs/installation`,
    title: "Installation — Bevel UI Docs",
    description:
      "One CLI command. Files land in components/bevelui/. You own them forever.",
    images: [
      {
        url: og("docs"),
        width: 1200,
        height: 630,
        alt: "Bevel UI Installation",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCS — PRODUCT TOUR
// ─────────────────────────────────────────────────────────────────────────────

export const docsProductTourMetadata: Metadata = {
  title: "Product Tour",
  description:
    "A guided tour system for React with SVG overlay masking, viewport-aware floating cards, media support per step, keyboard navigation, and skip/resume. Install with the shadcn CLI.",
  alternates: { canonical: `${SITE_URL}/docs/components/product-tour` },
  openGraph: {
    url: `${SITE_URL}/docs/components/product-tour`,
    title: "Product Tour — Bevel UI",
    description:
      "Overlay masking, smart-positioned floating cards, media, keyboard nav. One CLI install.",
    images: [
      {
        url: og("tour"),
        width: 1200,
        height: 630,
        alt: "Bevel UI Product Tour",
      },
    ],
  },
  twitter: {
    title: "Product Tour — Bevel UI",
    description:
      "A complete product tour system for React. SVG overlay, floating cards, keyboard nav.",
    images: [og("tour")],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCS — COMMAND PALETTE
// ─────────────────────────────────────────────────────────────────────────────

export const docsCommandPaletteMetadata: Metadata = {
  title: "Command Palette",
  description:
    "⌘K command palette for React with built-in fuzzy search, two-tier tab filtering, grouped results, avatar support, and zero external search dependencies.",
  alternates: { canonical: `${SITE_URL}/docs/components/command-palette` },
  openGraph: {
    url: `${SITE_URL}/docs/components/command-palette`,
    title: "Command Palette — Bevel UI",
    description:
      "⌘K with fuzzy search, tab filtering, grouped results, and avatars. Zero deps.",
    images: [
      {
        url: og("command"),
        width: 1200,
        height: 630,
        alt: "Bevel UI Command Palette",
      },
    ],
  },
  twitter: {
    title: "Command Palette — Bevel UI",
    description:
      "⌘K command menu for React. Fuzzy search, tab filters, zero dependencies.",
    images: [og("command")],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCS — FILE UPLOAD
// ─────────────────────────────────────────────────────────────────────────────

export const docsFileUploadMetadata: Metadata = {
  title: "File Upload",
  description:
    "Drag-and-drop file upload system for React with per-file progress tracking, cancel, retry, grid and list views, and modal mode. Bring your own upload function.",
  alternates: { canonical: `${SITE_URL}/docs/components/file-upload` },
  openGraph: {
    url: `${SITE_URL}/docs/components/file-upload`,
    title: "File Upload — Bevel UI",
    description:
      "Drag-and-drop, per-file progress, cancel, retry, grid/list views. Bring your own upload function.",
    images: [
      {
        url: og("upload"),
        width: 1200,
        height: 630,
        alt: "Bevel UI File Upload",
      },
    ],
  },
  twitter: {
    title: "File Upload — Bevel UI",
    description:
      "Complete file upload system for React. Drag-and-drop, progress, cancel, retry.",
    images: [og("upload")],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCS — FORM ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export const docsFormEngineMetadata: Metadata = {
  title: "Form Engine",
  description:
    "Multi-step form orchestration for React with plugin architecture, react-hook-form integration, zod per-step validation, conditional fields, and custom layouts.",
  alternates: { canonical: `${SITE_URL}/docs/components/form-engine` },
  openGraph: {
    url: `${SITE_URL}/docs/components/form-engine`,
    title: "Form Engine — Bevel UI",
    description:
      "Multi-step form orchestration. Plugin system, zod validation, conditional fields.",
    images: [
      {
        url: og("form"),
        width: 1200,
        height: 630,
        alt: "Bevel UI Form Engine",
      },
    ],
  },
  twitter: {
    title: "Form Engine — Bevel UI",
    description:
      "Complete multi-step form system for React. react-hook-form + zod, plugin architecture.",
    images: [og("form")],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCS — COMPONENTS INDEX
// ─────────────────────────────────────────────────────────────────────────────

export const docsComponentsMetadata: Metadata = {
  title: "Systems",
  description:
    "All available Bevel UI systems — Product Tour, Command Palette, File Upload, and Form Engine. More in development.",
  alternates: { canonical: `${SITE_URL}/docs/components` },
  openGraph: {
    url: `${SITE_URL}/docs/components`,
    title: "Systems — Bevel UI Docs",
    description: "All Bevel UI systems. Install any one with the shadcn CLI.",
    images: [
      {
        url: og("docs"),
        width: 1200,
        height: 630,
        alt: "Bevel UI Systems",
      },
    ],
  },
};

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
    images: [{ url: "/og/og-default.png", width: 1200, height: 630 }],
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
    images: [{ url: "/og/og-default.png", width: 1200, height: 630 }],
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

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE — paste the right export into each file
// ─────────────────────────────────────────────────────────────────────────────

/*

app/layout.tsx
──────────────
import { rootMetadata, viewport } from "@/lib/metadata";
export const metadata = rootMetadata;
export { viewport };


app/page.tsx
────────────
import { homeMetadata } from "@/lib/metadata";
export const metadata = homeMetadata;


app/pricing/page.tsx
────────────────────
import { pricingMetadata } from "@/lib/metadata";
export const metadata = pricingMetadata;


app/labs/page.tsx
─────────────────
import { labsMetadata } from "@/lib/metadata";
export const metadata = labsMetadata;


app/docs/layout.tsx  (or page.tsx)
───────────────────
import { docsMetadata } from "@/lib/metadata";
export const metadata = docsMetadata;


app/docs/introduction/page.tsx
──────────────────────────────
import { docsIntroductionMetadata } from "@/lib/metadata";
export const metadata = docsIntroductionMetadata;


app/docs/installation/page.tsx
──────────────────────────────
import { docsInstallationMetadata } from "@/lib/metadata";
export const metadata = docsInstallationMetadata;


app/docs/components/page.tsx
─────────────────────────────
import { docsComponentsMetadata } from "@/lib/metadata";
export const metadata = docsComponentsMetadata;


app/docs/components/product-tour/page.tsx
──────────────────────────────────────────
import { docsProductTourMetadata } from "@/lib/metadata";
export const metadata = docsProductTourMetadata;


app/docs/components/command-palette/page.tsx
─────────────────────────────────────────────
import { docsCommandPaletteMetadata } from "@/lib/metadata";
export const metadata = docsCommandPaletteMetadata;


app/docs/components/file-upload/page.tsx
─────────────────────────────────────────
import { docsFileUploadMetadata } from "@/lib/metadata";
export const metadata = docsFileUploadMetadata;


app/docs/components/form-engine/page.tsx
─────────────────────────────────────────
import { docsFormEngineMetadata } from "@/lib/metadata";
export const metadata = docsFormEngineMetadata;


app/preview/[name]/page.tsx
────────────────────────────
import { labPreviewMetadata } from "@/lib/metadata";
export function generateMetadata({ params }: { params: { name: string } }) {
  return labPreviewMetadata[params.name] ?? { title: "Preview — Bevel UI" };
}


app/(dashboard)/dashboard/layout.tsx
──────────────────────────────────────
import { dashboardMetadata } from "@/lib/metadata";
export const metadata = dashboardMetadata;


app/(dashboard)/dashboard/components/page.tsx
──────────────────────────────────────────────
import { dashboardComponentsMetadata } from "@/lib/metadata";
export const metadata = dashboardComponentsMetadata;


app/(dashboard)/dashboard/billing/page.tsx
───────────────────────────────────────────
import { dashboardBillingMetadata } from "@/lib/metadata";
export const metadata = dashboardBillingMetadata;


app/(dashboard)/dashboard/invoices/page.tsx
────────────────────────────────────────────
import { dashboardInvoicesMetadata } from "@/lib/metadata";
export const metadata = dashboardInvoicesMetadata;


app/(dashboard)/dashboard/settings/page.tsx
────────────────────────────────────────────
import { dashboardSettingsMetadata } from "@/lib/metadata";
export const metadata = dashboardSettingsMetadata;


app/(auth)/login/page.tsx
──────────────────────────
import { loginMetadata } from "@/lib/metadata";
export const metadata = loginMetadata;


app/(auth)/signup/page.tsx
───────────────────────────
import { signupMetadata } from "@/lib/metadata";
export const metadata = signupMetadata;


app/(admin)/admin/layout.tsx
──────────────────────────────
import { adminMetadata } from "@/lib/metadata";
export const metadata = adminMetadata;

*/
