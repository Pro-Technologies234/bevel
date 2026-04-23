// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { InvoiceStatus, PurchaseStatus } from "@/generated/prisma/enums";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  // const sig = headers().get("stripe-signature");

  // if (!sig) {
  //   return NextResponse.json({ error: "No signature" }, { status: 400 });
  // }

  let event: Stripe.Event;

  try {
    // event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency — skip already processed events
  // const existing = await prisma.webhookEvent.findUnique({
  //   where: { stripeId: event.id },
  // });
  // if (existing?.processed) {
  //   return NextResponse.json({ received: true, skipped: true });
  // }

  // Record the event
  // const webhookRecord = await prisma.webhookEvent.upsert({
  //   where: { stripeId: event.id },
  //   update: {},
  //   create: {
  //     stripeId: event.id,
  //     type: event.type,
  //     payload: event.data as any,
  //   },
  // });

  // try {
  //   await handleEvent(event);

  //   await prisma.webhookEvent.update({
  //     where: { id: webhookRecord.id },
  //     data: { processed: true, processedAt: new Date() },
  //   });

  //   return NextResponse.json({ received: true });
  // } catch (err) {
  //   console.error(`Webhook handler failed for ${event.type}:`, err);
  //   await prisma.webhookEvent.update({
  //     where: { id: webhookRecord.id },
  //     data: { error: String(err) },
  //   });
  //   return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  // }
}

// ─── Event handlers ───────────────────────────────────────────────────────────

async function handleEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
      return handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session,
      );

    case "customer.subscription.created":
    case "customer.subscription.updated":
      return handleSubscriptionUpdated(
        event.data.object as Stripe.Subscription,
      );

    case "customer.subscription.deleted":
      return handleSubscriptionDeleted(
        event.data.object as Stripe.Subscription,
      );

    case "invoice.payment_succeeded":
      return handleInvoicePaid(event.data.object as Stripe.Invoice);

    case "invoice.payment_failed":
      return handleInvoiceFailed(event.data.object as Stripe.Invoice);

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

// ── checkout.session.completed ────────────────────────────────────────────────
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) throw new Error("No userId in checkout session metadata");

  const purchase = await prisma.purchase.findFirst({
    where: { stripeCheckoutSessionId: session.id },
  });
  if (!purchase) throw new Error(`No purchase found for session ${session.id}`);

  // For one-time payments — activate immediately
  if (session.mode === "payment") {
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        status: PurchaseStatus.ACTIVE,
        stripePaymentIntentId: session.payment_intent as string,
        amountPaid: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
      },
    });

    await createLicenseIfNeeded(
      purchase.id,
      purchase.userId,
      purchase.productId,
    );
  }

  // Subscriptions are activated via the subscription.created event
}

// ── customer.subscription.updated ────────────────────────────────────────────
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const purchase = await prisma.purchase.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });
  if (!purchase) return; // May not exist yet on first creation

  const status = stripeStatusToPurchaseStatus(subscription.status);

  await prisma.purchase.update({
    where: { id: purchase.id },
    data: {
      status,
      stripeSubscriptionId: subscription.id,
      // currentPeriodStart: new Date(subscription.current_period_start * 1000),
      // currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  if (status === PurchaseStatus.ACTIVE) {
    await createLicenseIfNeeded(
      purchase.id,
      purchase.userId,
      purchase.productId,
    );
  }
}

// ── customer.subscription.deleted ────────────────────────────────────────────
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const purchase = await prisma.purchase.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });
  if (!purchase) return;

  await prisma.purchase.update({
    where: { id: purchase.id },
    data: { status: PurchaseStatus.EXPIRED },
  });

  // Deactivate license
  await prisma.license.updateMany({
    where: { purchaseId: purchase.id },
    data: { active: false },
  });
}

// ── invoice.payment_succeeded ─────────────────────────────────────────────────
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // if (!invoice.subscription) return;

  const purchase = await prisma.purchase.findFirst({
    // where: { stripeSubscriptionId: invoice.subscription as string },
  });
  if (!purchase) return;

  // Upsert invoice record
  await prisma.invoice.upsert({
    where: { stripeInvoiceId: invoice.id },
    update: {
      status: InvoiceStatus.PAID,
      amountPaid: invoice.amount_paid,
      paidAt: invoice.status_transitions.paid_at
        ? new Date(invoice.status_transitions.paid_at * 1000)
        : new Date(),
      invoicePdfUrl: invoice.invoice_pdf ?? undefined,
      hostedInvoiceUrl: invoice.hosted_invoice_url ?? undefined,
    },
    create: {
      userId: purchase.userId,
      purchaseId: purchase.id,
      stripeInvoiceId: invoice.id,
      invoiceNumber: invoice.number ?? undefined,
      status: InvoiceStatus.PAID,
      amountDue: invoice.amount_due,
      amountPaid: invoice.amount_paid,
      currency: invoice.currency,
      invoicePdfUrl: invoice.invoice_pdf ?? undefined,
      hostedInvoiceUrl: invoice.hosted_invoice_url ?? undefined,
      periodStart: invoice.period_start
        ? new Date(invoice.period_start * 1000)
        : undefined,
      periodEnd: invoice.period_end
        ? new Date(invoice.period_end * 1000)
        : undefined,
      paidAt: new Date(),
    },
  });
}

// ── invoice.payment_failed ────────────────────────────────────────────────────
async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  // if (!invoice.subscription) return;
  // const purchase = await prisma.purchase.findFirst({
  //   where: { stripeSubscriptionId: invoice.subscription as string },
  // });
  // if (!purchase) return;
  // await prisma.invoice.upsert({
  //   where: { stripeInvoiceId: invoice.id },
  //   update: { status: InvoiceStatus.OPEN },
  //   create: {
  //     userId: purchase.userId,
  //     purchaseId: purchase.id,
  //     stripeInvoiceId: invoice.id,
  //     invoiceNumber: invoice.number ?? undefined,
  //     status: InvoiceStatus.OPEN,
  //     amountDue: invoice.amount_due,
  //     amountPaid: 0,
  //     currency: invoice.currency,
  //   },
  // });
  // TODO: Send payment failed email
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function stripeStatusToPurchaseStatus(status: string): PurchaseStatus {
  switch (status) {
    case "active":
    case "trialing":
      return PurchaseStatus.ACTIVE;
    case "canceled":
      return PurchaseStatus.CANCELLED;
    case "unpaid":
    case "past_due":
      return PurchaseStatus.PENDING;
    default:
      return PurchaseStatus.PENDING;
  }
}

async function createLicenseIfNeeded(
  purchaseId: string,
  userId: string,
  productId: string,
) {
  const existing = await prisma.license.findUnique({ where: { purchaseId } });
  if (existing) return;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  const isTeam = product?.tier === "TEAM";

  await prisma.license.create({
    data: {
      userId,
      productId,
      purchaseId,
      type: isTeam ? "TEAM" : "INDIVIDUAL",
      maxSeats: isTeam ? 10 : 1,
      active: true,
    },
  });
}
