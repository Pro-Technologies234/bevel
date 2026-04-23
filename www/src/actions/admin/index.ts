"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { PurchaseStatus, UserRole } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";

// ─── Auth guard ───────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== UserRole.ADMIN) redirect("/dashboard");

  return user;
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export async function getAdminStats() {
  await requireAdmin();

  const [
    totalUsers,
    totalRevenue,
    activeSubs,
    recentPurchases,
    newUsersThisMonth,
    waitlistCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.purchase.aggregate({
      where: { status: PurchaseStatus.ACTIVE },
      _sum: { amountPaid: true },
    }),
    prisma.purchase.count({ where: { status: PurchaseStatus.ACTIVE } }),
    prisma.purchase.findMany({
      where: { status: { not: PurchaseStatus.PENDING } },
      include: { user: true, product: true, price: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: new Date(new Date().setDate(1)) }, // start of month
      },
    }),
    prisma.waitlist.count(),
  ]);

  return {
    totalUsers,
    totalRevenueCents: totalRevenue._sum.amountPaid ?? 0,
    activeSubs,
    recentPurchases,
    newUsersThisMonth,
    waitlistCount,
  };
}

// ─── Revenue chart data (last 12 months) ─────────────────────────────────────

export async function getRevenueChartData() {
  await requireAdmin();

  const purchases = await prisma.purchase.findMany({
    where: {
      status: PurchaseStatus.ACTIVE,
      createdAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 11)),
      },
    },
    select: { amountPaid: true, createdAt: true },
  });

  const months: Record<string, number> = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    months[key] = 0;
  }

  purchases.forEach((p) => {
    const key = p.createdAt.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    if (months[key] !== undefined) {
      months[key] += (p.amountPaid ?? 0) / 100;
    }
  });

  return Object.entries(months).map(([month, revenue]) => ({ month, revenue }));
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getAdminUsers({
  page = 1,
  limit = 20,
  search,
  role,
}: {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
} = {}) {
  await requireAdmin();

  const where = {
    ...(search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" as const } },
            { name: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(role ? { role } : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        _count: { select: { purchases: true } },
        purchases: {
          where: { status: PurchaseStatus.ACTIVE },
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, pages: Math.ceil(total / limit) };
}

export async function updateUserRole(userId: string, role: UserRole) {
  await requireAdmin();

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  await requireAdmin();

  // Cancel Stripe subscription if exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.stripeCustomerId) {
    const subs = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
    });
    for (const sub of subs.data) {
      await stripe.subscriptions.cancel(sub.id);
    }
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getAdminProducts() {
  await requireAdmin();

  return prisma.product.findMany({
    include: {
      prices: true,
      _count: { select: { purchases: true, licenses: true } },
    },
    orderBy: { order: "asc" },
  });
}

export async function toggleProductPublished(productId: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  await prisma.product.update({
    where: { id: productId },
    data: { published: !product.published },
  });

  revalidatePath("/admin/products");
}

export async function updateProduct(
  productId: string,
  data: { name?: string; description?: string; order?: number },
) {
  await requireAdmin();

  await prisma.product.update({ where: { id: productId }, data });
  revalidatePath("/admin/products");
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getAdminOrders({
  page = 1,
  limit = 20,
  status,
}: {
  page?: number;
  limit?: number;
  status?: PurchaseStatus;
} = {}) {
  await requireAdmin();

  const where = status ? { status } : {};

  const [orders, total] = await Promise.all([
    prisma.purchase.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: true,
        price: true,
        license: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.purchase.count({ where }),
  ]);

  return { orders, total, pages: Math.ceil(total / limit) };
}

export async function refundOrder(purchaseId: string) {
  await requireAdmin();

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  });
  if (!purchase) throw new Error("Purchase not found");
  if (!purchase.stripePaymentIntentId)
    throw new Error("No payment intent — may be a subscription");

  await stripe.refunds.create({
    payment_intent: purchase.stripePaymentIntentId,
  });

  await prisma.purchase.update({
    where: { id: purchaseId },
    data: { status: PurchaseStatus.REFUNDED },
  });

  // Deactivate license
  await prisma.license.updateMany({
    where: { purchaseId },
    data: { active: false },
  });

  revalidatePath("/admin/orders");
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────

export async function getWaitlist() {
  await requireAdmin();

  return prisma.waitlist.findMany({ orderBy: { createdAt: "desc" } });
}

export async function addToWaitlist(email: string, source = "landing-page") {
  // No auth required — public action
  const existing = await prisma.waitlist.findUnique({ where: { email } });
  if (existing) return { success: true, alreadyExists: true };

  await prisma.waitlist.create({ data: { email, source } });
  return { success: true, alreadyExists: false };
}
