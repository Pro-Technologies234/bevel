// app/api/webhooks/lemonsqueezy/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");

  // Verify the webhook is genuinely from Lemon Squeezy
  const hash = crypto
    .createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName = payload.meta.event_name;
  const userId = payload.meta.custom_data?.user_id;
  const variantId = payload.data.attributes.variant_id;

  // switch (eventName) {
  //   case "order_created":
  //     // One-time purchase completed
  //     await prisma.purchase.updateMany({
  //       where: { userId, lsVariantId: String(variantId) },
  //       data: { status: "ACTIVE" },
  //     });
  //     break;

  //   case "subscription_created":
  //   case "subscription_payment_success":
  //     // Subscription active or renewed
  //     await prisma.purchase.updateMany({
  //       where: { userId, lsVariantId: String(variantId) },
  //       data: {
  //         status: "ACTIVE",
  //         currentPeriodEnd: new Date(payload.data.attributes.renews_at),
  //       },
  //     });
  //     break;

  //   case "subscription_cancelled":
  //   case "subscription_expired":
  //     await prisma.purchase.updateMany({
  //       where: { userId, lsVariantId: String(variantId) },
  //       data: { status: "CANCELLED" },
  //     });
  //     break;
  // }

  return NextResponse.json({ received: true });
}
