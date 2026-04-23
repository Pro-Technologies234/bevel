"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  stripe,
  createCheckoutSession,
  createCustomerPortalSession,
} from "@/lib/stripe";
import { PurchaseStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

// ─── Get current session ──────────────────────────────────────────────────────

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");
  return session.user;
}

// ─── Start checkout ───────────────────────────────────────────────────────────

export async function startCheckout(priceId: string) {
  const user = await requireSession();

  // Find the price + product
  const price = await prisma.price.findUnique({
    where: { id: priceId, active: true },
    include: { product: true },
  });
  if (!price) throw new Error("Price not found");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Create pending purchase record
  const purchase = await prisma.purchase.create({
    data: {
      userId: user.id,
      productId: price.productId,
      priceId: price.id,
      status: PurchaseStatus.PENDING,
    },
  });

  const session = await createCheckoutSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    stripePriceId: price.stripePriceId,
    priceType: price.type,
    successUrl: `${appUrl}/dashboard/billing?success=true&purchase=${purchase.id}`,
    cancelUrl: `${appUrl}/pricing?cancelled=true`,
    metadata: {
      purchaseId: purchase.id,
      productSlug: price.product.slug,
    },
  });

  // Save checkout session id to purchase
  await prisma.purchase.update({
    where: { id: purchase.id },
    data: { stripeCheckoutSessionId: session.id },
  });

  redirect(session.url!);
}

// ─── Open customer portal ─────────────────────────────────────────────────────

export async function openCustomerPortal() {
  const user = await requireSession();

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser?.stripeCustomerId) {
    throw new Error("No billing account found. Make a purchase first.");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const portalSession = await createCustomerPortalSession({
    stripeCustomerId: dbUser.stripeCustomerId,
    returnUrl: `${appUrl}/dashboard/billing`,
  });

  redirect(portalSession.url);
}

// ─── Get user purchases ───────────────────────────────────────────────────────

export async function getUserPurchases() {
  const user = await requireSession();

  return prisma.purchase.findMany({
    where: { userId: user.id, status: { not: PurchaseStatus.PENDING } },
    include: { product: true, price: true },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Get user invoices ────────────────────────────────────────────────────────

export async function getUserInvoices() {
  const user = await requireSession();

  return prisma.invoice.findMany({
    where: { userId: user.id },
    include: { purchase: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Get user licenses ────────────────────────────────────────────────────────

export async function getUserLicenses() {
  const user = await requireSession();

  return prisma.license.findMany({
    where: { userId: user.id, active: true },
    include: {
      product: true,
      purchase: { include: { price: true } },
      teamMembers: {
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      },
    },
  });
}

// ─── Regenerate license key ───────────────────────────────────────────────────

export async function regenerateLicenseKey(licenseId: string) {
  const user = await requireSession();

  const license = await prisma.license.findFirst({
    where: { id: licenseId, userId: user.id, active: true },
  });
  if (!license) throw new Error("License not found");

  const { createId } = require("@paralleldrive/cuid2");
  const newKey = createId();

  await prisma.license.update({
    where: { id: licenseId },
    data: { key: newKey },
  });

  return newKey;
}

// ─── Invite team member ───────────────────────────────────────────────────────

export async function inviteTeamMember(licenseId: string, email: string) {
  const user = await requireSession();

  const license = await prisma.license.findFirst({
    where: {
      id: licenseId,
      userId: user.id, // must be owner
      active: true,
      type: "TEAM",
    },
    include: { _count: { select: { teamMembers: true } } },
  });

  if (!license) throw new Error("Team license not found");
  if (license._count.teamMembers >= license.maxSeats) {
    throw new Error(`Team license is full (${license.maxSeats} seats)`);
  }

  const invitee = await prisma.user.findUnique({ where: { email } });
  if (!invitee)
    throw new Error(
      "No Bevel account found for that email. They need to sign up first.",
    );

  const existing = await prisma.teamMember.findUnique({
    where: { licenseId_userId: { licenseId, userId: invitee.id } },
  });
  if (existing) throw new Error("That person already has access");

  await prisma.teamMember.create({
    data: { licenseId, userId: invitee.id, role: "MEMBER" },
  });

  await prisma.license.update({
    where: { id: licenseId },
    data: { usedSeats: { increment: 1 } },
  });

  return { success: true };
}

// ─── Remove team member ───────────────────────────────────────────────────────

export async function removeTeamMember(licenseId: string, memberId: string) {
  const user = await requireSession();

  const license = await prisma.license.findFirst({
    where: { id: licenseId, userId: user.id },
  });
  if (!license) throw new Error("License not found");

  await prisma.teamMember.delete({
    where: { licenseId_userId: { licenseId, userId: memberId } },
  });

  await prisma.license.update({
    where: { id: licenseId },
    data: { usedSeats: { decrement: 1 } },
  });

  return { success: true };
}
