// // lib/stripe.ts
// import Stripe from "stripe";
// import { prisma } from "./prisma";

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error("STRIPE_SECRET_KEY is not set");
// }

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2026-03-25.dahlia",
//   typescript: true,
// });

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// /**
//  * Get or create a Stripe Customer for a user.
//  * Saves the customerId back to the database.
//  */
// export async function getOrCreateStripeCustomer({
//   userId,
//   email,
//   name,
// }: {
//   userId: string;
//   email: string;
//   name?: string | null;
// }): Promise<string> {
//   const user = await prisma.user.findUnique({ where: { id: userId } });
//   if (!user) throw new Error("User not found");

//   if (user.stripeCustomerId) return user.stripeCustomerId;

//   const customer = await stripe.customers.create({
//     email,
//     name: name ?? undefined,
//     metadata: { userId },
//   });

//   await prisma.user.update({
//     where: { id: userId },
//     data: { stripeCustomerId: customer.id },
//   });

//   return customer.id;
// }

// /**
//  * Create a Stripe Checkout Session for a purchase.
//  */
// export async function createCheckoutSession({
//   userId,
//   email,
//   name,
//   stripePriceId,
//   priceType,
//   successUrl,
//   cancelUrl,
//   metadata,
// }: {
//   userId: string;
//   email: string;
//   name?: string | null;
//   stripePriceId: string;
//   priceType: "ONE_TIME" | "RECURRING";
//   successUrl: string;
//   cancelUrl: string;
//   metadata?: Record<string, string>;
// }) {
//   const customerId = await getOrCreateStripeCustomer({ userId, email, name });

//   const session = await stripe.checkout.sessions.create({
//     customer: customerId,
//     payment_method_types: ["card"],
//     mode: priceType === "ONE_TIME" ? "payment" : "subscription",
//     line_items: [{ price: stripePriceId, quantity: 1 }],
//     success_url: successUrl,
//     cancel_url: cancelUrl,
//     allow_promotion_codes: true,
//     billing_address_collection: "auto",
//     metadata: {
//       userId,
//       ...metadata,
//     },
//   });

//   return session;
// }

// /**
//  * Create a Stripe Customer Portal session for managing subscription / invoices.
//  */
// export async function createCustomerPortalSession({
//   stripeCustomerId,
//   returnUrl,
// }: {
//   stripeCustomerId: string;
//   returnUrl: string;
// }) {
//   return stripe.billingPortal.sessions.create({
//     customer: stripeCustomerId,
//     return_url: returnUrl,
//   });
// }

export function formatPrice(amountInCents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100);
}
