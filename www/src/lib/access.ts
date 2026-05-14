// lib/access.ts
// Central access control — called from server actions, API routes, and middleware.

import { ProductTier } from "@/generated/prisma/enums";
import { prisma } from "./prisma";

/**
 * Check if a user has access to a product by slug.
 * Free products: always accessible.
 * Pro/Team products: requires an active purchase.
 */
export async function hasAccess(
  userId: string,
  productSlug: string,
): Promise<boolean> {
  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
  });
  if (!product) return false;

  // Free systems are always accessible
  if (product.tier === ProductTier.FREE) return true;

  // Check for an active purchase of this specific product
  const directPurchase = await prisma.purchase.findFirst({
    where: {
      userId,
      productId: product.id,
      status: "ACTIVE",
    },
  });
  if (directPurchase) return true;

  // Check for an active bundle that covers this tier
  const bundleTier =
    product.tier === ProductTier.PRO
      ? [ProductTier.PRO, ProductTier.TEAM]
      : [ProductTier.TEAM];

  const bundlePurchase = await prisma.purchase.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      product: {
        type: "BUNDLE",
        tier: { in: bundleTier },
      },
    },
  });
  if (bundlePurchase) return true;

  // Check team membership — if user is a member of a team with an active license for a bundle
  const teamLicense = await prisma.teamMember.findFirst({
    where: {
      userId,
      license: {
        active: true,
        product: {
          type: "BUNDLE",
          tier: { in: bundleTier },
        },
        purchase: {
          status: "ACTIVE",
        },
      },
    },
  });
  if (teamLicense) return true;

  return false;
}

/**
 * Get all products a user has access to, with their access source.
 */
export async function getUserAccessList(userId: string) {
  const [allProducts, purchases, teamMemberships] = await Promise.all([
    prisma.product.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    prisma.purchase.findMany({
      where: { userId, status: "ACTIVE" },
      include: { product: true, price: true },
    }),
    prisma.teamMember.findMany({
      where: { userId },
      include: {
        license: {
          include: {
            product: true,
            purchase: true,
          },
        },
      },
    }),
  ]);

  return allProducts.map((product) => {
    if (product.tier === ProductTier.FREE) {
      return { product, hasAccess: true, source: "free" as const };
    }

    const direct = purchases.find((p) => p.productId === product.id);
    if (direct) {
      return {
        product,
        hasAccess: true,
        source: "purchase" as const,
        purchase: direct,
      };
    }

    const bundle = purchases.find(
      (p) => p.product.type === "BUNDLE" && product.tier !== ProductTier.FREE,
    );
    if (bundle) {
      return {
        product,
        hasAccess: true,
        source: "bundle" as const,
        purchase: bundle,
      };
    }

    const team = teamMemberships.find(
      (m) =>
        m.license.product.type === "BUNDLE" &&
        m.license.purchase.status === "ACTIVE",
    );
    if (team) {
      return { product, hasAccess: true, source: "team" as const };
    }

    return { product, hasAccess: false, source: null };
  });
}

/**
 * Generate a license key token for registry auth.
 * Users include this as a header when using the CLI to install Pro systems.
 */
export async function getLicenseKeyForUser(
  userId: string,
): Promise<string | null> {
  const license = await prisma.license.findFirst({
    where: { userId, active: true },
    orderBy: { createdAt: "desc" },
  });
  return license?.key ?? null;
}

//Test
