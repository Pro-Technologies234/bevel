import { prisma } from "@/lib/prisma";
import { startCheckout } from "@/actions/subscription";
import { Badge } from "@/components/ui/badge";
import { PricingCard } from "@/components/pricing/pricing-card";
import { pricingMetadata, softwareApplicationJsonLd } from "@/lib/metadata";
export const metadata = pricingMetadata;

// ─── Feature lists — realistic based on what Bevel actually ships ─────────────

const FREE_FEATURES = [
  "Product Tour system",
  "Command Palette system",
  "File Upload system",
  "Form Engine system",
  "MIT licensed — own the code",
  "shadcn CLI install",
  "Full documentation & examples",
  "Community support (GitHub)",
];

const PRO_FEATURES = [
  "Everything in Free",
  "All current Pro systems",
  "Every future Pro system we ship",
  "Bevel Labs — 6 full app source files",
  "Private CLI registry access",
  "License key for authenticated install",
  "Private Discord access",
  "Email support (48h response)",
];

const TEAM_FEATURES = [
  "Everything in Pro",
  "Up to 5 developer seats",
  "Shared team license key",
  "Team member management dashboard",
  "Accounting-ready invoice on request",
  "Priority support (24h response)",
];

// ─── Format price ─────────────────────────────────────────────────────────────

function fmt(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function PricingPage() {
  const proBundlePrices = await prisma.price.findMany({
    where: {
      active: true,
      product: { slug: "pro-bundle" },
    },
    include: { product: true },
    orderBy: { amount: "asc" },
  });

  const teamPrice = await prisma.price.findFirst({
    where: {
      active: true,
      product: { slug: "team-bundle" },
    },
    include: { product: true },
  });

  const lifetimePrice = proBundlePrices.find((p) => p.type === "ONE_TIME");
  const monthlyPrice = proBundlePrices.find(
    (p) => p.type === "RECURRING" && p.interval === "MONTH",
  );

  const lifetimeAmount = lifetimePrice?.amount ?? 4900;
  const monthlyAmount = monthlyPrice?.amount ?? 900;
  const teamAmount = teamPrice?.amount ?? 19900;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd),
        }}
      />
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="text-center px-6 pt-20 pb-16">
          <Badge className="bg-muted/60 p-3 gap-2 text-[10px] uppercase select-none text-foreground/80 my-8">
            <span className="h-1.5 w-1.5 rounded-full dark:bg-green-400 bg-green-600 relative">
              <span className="rounded-full dark:bg-green-400 bg-green-600 absolute inset-0 animate-ping"></span>
            </span>
            Free components available — no signup required
          </Badge>

          <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-5 font-sans">
            Simple pricing.
          </h1>
          <p className="text-base md:text-lg max-w-md mx-auto leading-relaxed font-light">
            Pay once for Pro, or subscribe monthly. Free components are always
            free.
          </p>
        </div>

        {/* Plans - 3 cards: Pro Lifetime, Pro Monthly, Team Yearly */}
        <div className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pro Monthly Card */}
            <PricingCard
              title="Free"
              price={monthlyAmount}
              period="/"
              description="Always free · MIT licensed"
              features={FREE_FEATURES}
              buttonText="Start for free"
              accentColor="#c2f13c"
              // action={
              //   monthlyPrice
              //     ? startCheckout.bind(null, monthlyPrice.id)
              //     : undefined
              // }
            />
            {/* Pro Lifetime Card */}
            <PricingCard
              title="Pro Lifetime"
              price={lifetimeAmount}
              period="one-time"
              description="All future Pro systems included"
              features={PRO_FEATURES}
              buttonText="Buy lifetime access"
              accentColor="#c2f13c"
              featured={true}
              badge="Most popular"
              // action={
              //   lifetimePrice
              //     ? startCheckout.bind(null, lifetimePrice.id)
              //     : undefined
              // }
            />

            {/* Team Yearly Card */}
            {/* {teamPrice && ( */}
            <PricingCard
              title="Team"
              price={teamAmount}
              period="/year"
              description="Up to 10 developers"
              features={TEAM_FEATURES}
              buttonText="Buy team license"
              accentColor="#c2f13c"
              // action={startCheckout.bind(null, teamPrice.id)}
            />
            {/* )} */}
          </div>

          {/* FAQ */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-center text-3xl font-sans font-semibold mb-8">
              Common questions
            </h2>
            <div className="flex flex-col gap-6">
              {[
                {
                  q: "Are the free components really free?",
                  a: "Yes. All free components (Product Tour, Command Palette, File Upload, Form Engine) are MIT licensed and available in our docs with no account required. Just copy and paste.",
                },
                {
                  q: "What's the difference between Pro Lifetime and Pro Monthly?",
                  a: "Pro Lifetime is a one-time payment that gives you permanent access to all Pro components and future updates. Pro Monthly is a subscription — you pay $9/month and can cancel anytime.",
                },
                {
                  q: "Can I use Pro in a client project?",
                  a: "Yes. Individual Pro licenses cover one developer for any number of personal and client projects. Team licenses cover your whole team.",
                },
                {
                  q: "Do I get updates with the lifetime plan?",
                  a: "Absolutely. All future Pro components and updates are included forever.",
                },
                {
                  q: "How many seats are included in Team?",
                  a: "Team includes up to 10 developer seats. Contact us for larger organizations.",
                },
              ].map((item) => (
                <div key={item.q} className="p-6 bg-muted/40 rounded-xl">
                  <h3 className="text-sm font-semibold mb-2">{item.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
