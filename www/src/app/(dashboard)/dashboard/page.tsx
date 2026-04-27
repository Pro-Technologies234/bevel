import Link from "next/link";
import { headers } from "next/headers";
import {
  IconArrowRight,
  IconLock,
  IconPackage,
  IconReceipt,
  IconSparkles,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";
import { auth } from "@/lib/auth";
import { getUserAccessList } from "@/lib/access";
import { getUserPurchases } from "@/actions/subscription";
import { formatPrice } from "@/lib/stripe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DashboardHero,
  DashboardMetricCard,
  DashboardPage,
  DashboardPanel,
  DashboardSection,
} from "@/components/dashboard/dashboard-shell";
import { dashboardMetadata } from "@/lib/metadata";
export const metadata = dashboardMetadata;
export default async function DashboardPageRoute() {
  const session = await auth.api.getSession({ headers: await headers() });
  const [accessList, purchases] = await Promise.all([
    getUserAccessList(session!.user.id),
    getUserPurchases(),
  ]);

  const accessible = accessList.filter((item) => item.hasAccess);
  const locked = accessList.filter((item) => !item.hasAccess);
  const totalInvested = purchases.reduce(
    (sum, purchase) => sum + (purchase.amountPaid ?? 0),
    0,
  );
  const latestPurchase = purchases[0];
  const firstName = session?.user.name?.split(" ")[0] ?? "there";
  const hasPro = purchases.length > 0;

  return (
    <DashboardPage>
      <DashboardHero
        eyebrow="Customer dashboard"
        title={`Welcome back, ${firstName}`}
        description="Track what your account can install today, what you have already paid for, and which Bevel systems are still waiting to be unlocked."
      >
        <Badge variant="outline" className="border-white/10 bg-background/70">
          {accessible.length} active systems
        </Badge>
        <Badge variant="outline" className="border-white/10 bg-background/70">
          {locked.length} upgrade opportunities
        </Badge>
        <Button asChild size="sm" className="rounded-xl">
          <Link href={hasPro ? "/dashboard/components" : "/pricing"}>
            {hasPro ? "Browse systems" : "Unlock Pro"}
            <IconArrowRight />
          </Link>
        </Button>
      </DashboardHero>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          label="Systems you can use"
          value={`${accessible.length}`}
          detail={`Out of ${accessList.length} total systems in your workspace.`}
          icon={<IconPackage size={18} />}
          tone="warning"
        />
        <DashboardMetricCard
          label="Plan status"
          value={hasPro ? "Pro" : "Free"}
          detail={
            hasPro
              ? "Your paid systems stay available inside this account."
              : "Free access is active. Upgrade when you need the full catalog."
          }
          icon={<IconSparkles size={18} />}
          tone={hasPro ? "success" : "default"}
        />
        <DashboardMetricCard
          label="Lifetime spend"
          value={formatPrice(totalInvested)}
          detail={
            totalInvested > 0
              ? "Every purchase is tied to your account and invoices."
              : "No payments yet. You can start with the free systems."
          }
          icon={<IconWallet size={18} />}
          tone="default"
        />
        <DashboardMetricCard
          label="Latest activity"
          value={latestPurchase ? latestPurchase.product.name : "No purchases"}
          detail={
            latestPurchase
              ? "Your most recent purchase is already reflected below."
              : "Once you check out, billing and invoices will appear here."
          }
          icon={<IconTrendingUp size={18} />}
          tone="default"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <DashboardSection
          title="Access snapshot"
          description="A quick view of everything available right now."
          action={
            <Button variant="ghost" asChild className="rounded-xl">
              <Link href="/dashboard/components">
                View all systems
                <IconArrowRight />
              </Link>
            </Button>
          }
        >
          <DashboardPanel className="space-y-3">
            {accessList.map(({ product, hasAccess }) => (
              <div
                key={product.id}
                className="flex items-center gap-4 rounded-lg border border-white/10 bg-background/40 p-4"
              >
                <div
                  className={`flex size-11 items-center justify-center rounded-lg ${
                    hasAccess
                      ? "bg-primary/15 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {hasAccess ? (
                    <IconPackage size={18} />
                  ) : (
                    <IconLock size={18} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {product.name}
                    </p>
                    <Badge variant="outline" className="border-white/10">
                      {product.tier}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {hasAccess
                      ? "Ready to install and use."
                      : "Locked until this plan is purchased."}
                  </p>
                </div>
                {hasAccess && product.docsPath ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-xl"
                  >
                    <Link href={`/${product.docsPath}`} target="_blank">
                      Docs
                    </Link>
                  </Button>
                ) : null}
              </div>
            ))}
          </DashboardPanel>
        </DashboardSection>

        <DashboardSection
          title="Billing pulse"
          description="Recent payment and next-step context."
        >
          <DashboardPanel className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-background/50 p-4">
              <p className="text-xs capitalize tracking-tight text-muted-foreground">
                Current standing
              </p>
              <p className="mt-2 text-2xl font-semibold">
                r {hasPro ? "Paid customer" : "Free workspace"}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {hasPro
                  ? "Your billing account is active and purchases are attached to this login."
                  : "You can explore the free systems now and upgrade only when a paid system is worth it."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-lg border border-white/10 bg-background/40 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <IconReceipt size={16} className="text-primary" />
                  Invoices
                </div>
                <p className="text-sm text-muted-foreground">
                  {purchases.length > 0
                    ? "Download receipts and review hosted invoices any time."
                    : "Invoices appear automatically after your first purchase."}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-background/40 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <IconSparkles size={16} className="text-primary" />
                  Recommended next step
                </div>
                <p className="text-sm text-muted-foreground">
                  {hasPro
                    ? "Keep your licenses handy and share team access from billing."
                    : `${locked.length} more systems unlock when you move beyond the free tier.`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/dashboard/billing">Open billing</Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-xl">
                <Link href="/dashboard/invoices">See invoices</Link>
              </Button>
            </div>
          </DashboardPanel>
        </DashboardSection>
      </section>
    </DashboardPage>
  );
}
