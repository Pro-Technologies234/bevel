// prisma/seed.ts

import { PriceType, ProductTier, ProductType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Seeding Bevel UI database...");

  // ── Free systems (currently available) ──────────────────────────────────────

  const freeProducts = [
    {
      slug: "product-tour",
      name: "Product Tour",
      description:
        "Guided tour system with overlay masking, floating card positioning, media support, and keyboard navigation.",
      tier: ProductTier.FREE,
      published: true,
      order: 1,
      registryPath: "r/tour.json",
      docsPath: "docs/components/product-tour",
    },
    {
      slug: "command-palette",
      name: "Command Palette",
      description:
        "⌘K command menu with fuzzy search, two-tier tab filtering, grouped results, and avatar support.",
      tier: ProductTier.FREE,
      published: true,
      order: 2,
      registryPath: "r/command-palette.json",
      docsPath: "docs/components/command-palette",
    },
    {
      slug: "file-upload",
      name: "File Upload",
      description:
        "Drag-and-drop upload with per-file progress, cancel, retry, grid/list views, and modal mode.",
      tier: ProductTier.FREE,
      published: true,
      order: 3,
      registryPath: "r/file-upload.json",
      docsPath: "docs/components/file-upload",
    },
    {
      slug: "form-engine",
      name: "Form Engine",
      description:
        "Multi-step or single-step form orchestration with plugin architecture, react-hook-form, and zod.",
      tier: ProductTier.FREE,
      published: true,
      order: 4,
      registryPath: "r/form-engine.json",
      docsPath: "docs/components/form-engine",
    },
  ];

  for (const product of freeProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: { ...product, type: ProductType.SYSTEM },
    });
    console.log(`✓ Free system: ${product.name}`);
  }

  // ── Pro systems (coming soon — pre-create so they exist) ────────────────────

  const proProducts = [
    {
      slug: "drag-to-reorder",
      name: "Drag to Reorder",
      description:
        "Accessible drag-and-drop list reordering with spring animations, keyboard support, and touch handling.",
      tier: ProductTier.PRO,
      published: false,
      order: 5,
      registryPath: "r/pro/drag-to-reorder.json",
      docsPath: "docs/components/drag-to-reorder",
    },
    {
      slug: "rich-text-editor",
      name: "Rich Text Editor",
      description:
        "Tiptap-based editor with slash commands, mentions, formatting toolbar, and react-hook-form integration.",
      tier: ProductTier.PRO,
      published: false,
      order: 6,
      registryPath: "r/pro/rich-text-editor.json",
      docsPath: "docs/components/rich-text-editor",
    },
    {
      slug: "spotlight-search",
      name: "Spotlight Search",
      description:
        "Page-level search that highlights matching text in the DOM, cycles through results, and dismisses cleanly.",
      tier: ProductTier.PRO,
      published: false,
      order: 7,
      registryPath: "r/pro/spotlight-search.json",
      docsPath: "docs/components/spotlight-search",
    },
    {
      slug: "context-menu",
      name: "Contextual Menu",
      description:
        "Right-click context menu with viewport-aware positioning, nested submenus, and keyboard navigation.",
      tier: ProductTier.PRO,
      published: false,
      order: 8,
      registryPath: "r/pro/context-menu.json",
      docsPath: "docs/components/context-menu",
    },
  ];

  for (const product of proProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: { ...product, type: ProductType.SYSTEM },
    });
    console.log(`✓ Pro system: ${product.name}`);
  }

  // ── Pro Bundle ───────────────────────────────────────────────────────────────

  const proBundleProduct = await prisma.product.upsert({
    where: { slug: "pro-bundle" },
    update: {
      name: "Bevel Pro",
      description:
        "All current and future Pro systems. Includes Drag to Reorder, Rich Text Editor, Spotlight Search, Contextual Menu, and every system we ship going forward.",
      tier: ProductTier.PRO,
      published: true,
      order: 99,
    },
    create: {
      slug: "pro-bundle",
      name: "Bevel Pro",
      description:
        "All current and future Pro systems. Includes Drag to Reorder, Rich Text Editor, Spotlight Search, Contextual Menu, and every system we ship going forward.",
      type: ProductType.BUNDLE,
      tier: ProductTier.PRO,
      published: true,
      order: 99,
    },
  });
  console.log(`✓ Bundle: Bevel Pro`);

  // ── Team Bundle ──────────────────────────────────────────────────────────────

  const teamBundleProduct = await prisma.product.upsert({
    where: { slug: "team-bundle" },
    update: {
      name: "Bevel Team",
      description:
        "Everything in Pro for your entire team. Up to 10 seats. One license key covers all members.",
      tier: ProductTier.TEAM,
      published: true,
      order: 100,
    },
    create: {
      slug: "team-bundle",
      name: "Bevel Team",
      description:
        "Everything in Pro for your entire team. Up to 10 seats. One license key covers all members.",
      type: ProductType.BUNDLE,
      tier: ProductTier.TEAM,
      published: true,
      order: 100,
    },
  });
  console.log(`✓ Bundle: Bevel Team`);

  // ── Prices ───────────────────────────────────────────────────────────────────
  // NOTE: Replace STRIPE_PRICE_* placeholders with real Stripe Price IDs after
  // creating them in the Stripe dashboard. The seed will fail if the IDs don't exist.
  // Run `stripe products create` and `stripe prices create` or use the dashboard.

  const prices = [
    // Bevel Pro — One-time lifetime
    {
      productId: proBundleProduct.id,
      stripePriceId:
        process.env.STRIPE_PRICE_PRO_LIFETIME ??
        "price_pro_lifetime_placeholder",
      stripeProductId: process.env.STRIPE_PRODUCT_PRO ?? "prod_pro_placeholder",
      type: PriceType.ONE_TIME,
      amount: 4900, // $49.00
      currency: "usd",
      label: "Lifetime",
      description: "One-time payment. All future Pro systems included.",
      active: true,
      isDefault: true,
    },
    // Bevel Pro — Monthly
    {
      productId: proBundleProduct.id,
      stripePriceId:
        process.env.STRIPE_PRICE_PRO_MONTHLY ?? "price_pro_monthly_placeholder",
      stripeProductId: process.env.STRIPE_PRODUCT_PRO ?? "prod_pro_placeholder",
      type: PriceType.RECURRING,
      interval: "MONTH" as const,
      amount: 900, // $9.00/month
      currency: "usd",
      label: "Monthly",
      description: "Billed monthly. Cancel anytime.",
      active: true,
      isDefault: false,
    },
    // Bevel Team — Yearly
    {
      productId: teamBundleProduct.id,
      stripePriceId:
        process.env.STRIPE_PRICE_TEAM_YEARLY ?? "price_team_yearly_placeholder",
      stripeProductId:
        process.env.STRIPE_PRODUCT_TEAM ?? "prod_team_placeholder",
      type: PriceType.RECURRING,
      interval: "YEAR" as const,
      amount: 29900, // $299.00/year
      currency: "usd",
      label: "Team — Yearly",
      description: "Up to 10 seats. Billed annually.",
      active: true,
      isDefault: true,
    },
  ];

  for (const price of prices) {
    await prisma.price.upsert({
      where: { stripePriceId: price.stripePriceId },
      update: price,
      create: price,
    });
    console.log(`✓ Price: ${price.label} ($${price.amount / 100})`);
  }

  // ── Admin user ───────────────────────────────────────────────────────────────

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@bevelui.com";
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (!existing) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Bevel Admin",
        role: "ADMIN",
        emailVerified: true,
      },
    });
    console.log(`✓ Admin user: ${adminEmail}`);
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "ADMIN" },
    });
    console.log(`✓ Admin user already exists: ${adminEmail}`);
  }

  console.log("\n✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
