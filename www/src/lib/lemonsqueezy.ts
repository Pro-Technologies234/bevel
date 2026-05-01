import {
  lemonSqueezySetup,
  createCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";

lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });

export async function createLSCheckout({
  variantId,
  email,
  userId,
  redirectUrl,
}: {
  variantId: number;
  email: string;
  userId: string;
  redirectUrl: string;
}) {
  const { data, error } = await createCheckout(
    process.env.LEMONSQUEEZY_STORE_ID!,
    variantId,
    {
      checkoutOptions: { embed: false },
      checkoutData: {
        email,
        custom: { user_id: userId },
      },
      productOptions: {
        redirectUrl,
        receiptLinkUrl: redirectUrl,
      },
    },
  );

  if (error) throw new Error(error.message);
  return data!.data.attributes.url;
}
