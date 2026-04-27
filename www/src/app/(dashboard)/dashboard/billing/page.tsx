import Link from "next/link";
import {
  IconCheck,
  IconCreditCard,
  IconExternalLink,
  IconReceipt,
  IconTrash,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { formatPrice } from "@/lib/stripe";
import {
  getUserLicenses,
  getUserPurchases,
  inviteTeamMember,
  openCustomerPortal,
  removeTeamMember,
} from "@/actions/subscription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  DashboardHero,
  DashboardMetricCard,
  DashboardPage,
  DashboardPanel,
  DashboardSection,
} from "@/components/dashboard/dashboard-shell";
import { dashboardInvoicesMetadata } from "@/lib/metadata";
export const metadata = dashboardInvoicesMetadata;
export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const [purchases, licenses] = await Promise.all([
    getUserPurchases(),
    getUserLicenses(),
  ]);

  const teamLicenses = licenses.filter((license) => license.type === "TEAM");
  const totalSeats = teamLicenses.reduce(
    (sum, license) => sum + license.maxSeats,
    0,
  );
  const usedSeats = teamLicenses.reduce(
    (sum, license) => sum + license.usedSeats,
    0,
  );

  return (
    <DashboardPage>
      <DashboardHero
        eyebrow="Payments and seats"
        title="Billing"
        description="Manage your active purchases, send teammates access when a team license is available, and jump into Stripe when you need payment-level changes."
      >
        <Badge variant="outline" className="border-white/10 bg-background/70">
          {purchases.length} active purchases
        </Badge>
        <Badge variant="outline" className="border-white/10 bg-background/70">
          {usedSeats}/{totalSeats || 0} team seats used
        </Badge>
      </DashboardHero>

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardMetricCard
          label="Active plans"
          value={`${purchases.length}`}
          detail={
            purchases.length > 0
              ? "Your paid products are available from this account."
              : "No paid plans yet. You can upgrade from pricing at any time."
          }
          icon={<IconCreditCard size={18} />}
          tone={purchases.length > 0 ? "success" : "default"}
        />
        <DashboardMetricCard
          label="Invoices available"
          value={`${purchases.length}`}
          detail="Every successful purchase will also appear in your invoices history."
          icon={<IconReceipt size={18} />}
          tone="default"
        />
        <DashboardMetricCard
          label="Team seats"
          value={
            teamLicenses.length > 0 ? `${usedSeats}/${totalSeats}` : "None"
          }
          detail={
            teamLicenses.length > 0
              ? "Invite and remove members from team licenses below."
              : "Seat controls appear automatically when you own a team license."
          }
          icon={<IconUsers size={18} />}
          tone="warning"
        />
      </section>

      {params.success ? (
        <DashboardPanel className="border-emerald-400/20 bg-[linear-gradient(135deg,rgba(52,211,153,0.14),rgba(255,255,255,0.03))]">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
              <IconCheck size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">Payment successful</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your purchase is active and the related access should already be
                available in your workspace.
              </p>
            </div>
          </div>
        </DashboardPanel>
      ) : null}

      <DashboardSection
        title="Plan overview"
        description="Review plan details and open Stripe for payment-method or invoice-hosted actions."
      >
        <DashboardPanel className="space-y-4">
          {purchases.length === 0 ? (
            <div className="rounded-xl flex flex-col items-center justify-center border border-dashed border-white/10 bg-background/30 p-8 h-80 text-center">
              <p className="text-lg font-semibold">
                You are currently on the free plan
              </p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Upgrade when you need the paid systems, invoice history, or team
                seat management.
              </p>
              <Button
                variant={"inverted"}
                asChild
                className="mt-4 rounded-full"
              >
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          ) : (
            purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="rounded-xl border border-white/10 bg-background/40 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="border-white/10">
                        {purchase.product.name}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      >
                        {purchase.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xl font-semibold">
                        {formatPrice(
                          purchase.price.amount,
                          purchase.price.currency,
                        )}
                        {purchase.price.interval
                          ? ` / ${purchase.price.interval.toLowerCase()}`
                          : ""}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {purchase.price.label}
                      </p>
                      {purchase.currentPeriodEnd ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Renews{" "}
                          {format(purchase.currentPeriodEnd, "MMM d, yyyy")}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-muted-foreground">
                          Lifetime access purchase
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {purchases.length > 0 ? (
            <form action={openCustomerPortal}>
              <Button variant="outline" className="rounded-xl">
                <IconExternalLink />
                Manage in Stripe
              </Button>
            </form>
          ) : null}
        </DashboardPanel>
      </DashboardSection>

      {teamLicenses.length > 0 ? (
        <DashboardSection
          title="Team access"
          description="Invite teammates into the seats included with your team licenses."
        >
          <div className="grid gap-4">
            {teamLicenses.map((license) => {
              const seatUsage = Math.round(
                (license.usedSeats / license.maxSeats) * 100,
              );

              return (
                <DashboardPanel key={license.id} className="space-y-5">
                  <div className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold">
                          {license.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {license.usedSeats} of {license.maxSeats} seats
                          currently assigned
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="w-fit border-white/10"
                      >
                        Team license
                      </Badge>
                    </div>
                    <Progress value={seatUsage} className="h-2 bg-white/10" />
                  </div>

                  <div className="grid gap-3">
                    {license.teamMembers.map((member) => (
                      <div
                        key={member.userId}
                        className="flex flex-col gap-3 rounded-[1.25rem] border border-white/10 bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/15 text-sm font-semibold text-primary">
                            {(
                              member.user.name?.[0] ?? member.user.email[0]
                            ).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {member.user.name ?? member.user.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-white/10">
                            {member.role}
                          </Badge>
                          {member.role !== "OWNER" ? (
                            <form
                              action={async () => {
                                "use server";
                                await removeTeamMember(
                                  license.id,
                                  member.userId,
                                );
                              }}
                            >
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="rounded-xl text-muted-foreground hover:text-destructive"
                              >
                                <IconTrash size={14} />
                              </Button>
                            </form>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>

                  {license.usedSeats < license.maxSeats ? (
                    <form
                      className="flex flex-col gap-3 rounded-[1.25rem] border border-dashed border-white/10 bg-background/25 p-4 md:flex-row"
                      action={async (formData: FormData) => {
                        "use server";
                        const email = formData.get("email") as string;
                        await inviteTeamMember(license.id, email);
                      }}
                    >
                      <Input
                        name="email"
                        type="email"
                        placeholder="teammate@company.com"
                        required
                        className="h-11 rounded-xl bg-background/60"
                      />
                      <Button className="h-11 rounded-xl px-4">
                        <IconUserPlus />
                        Invite teammate
                      </Button>
                    </form>
                  ) : (
                    <div className="rounded-[1.25rem] border border-white/10 bg-background/30 p-4 text-sm text-muted-foreground">
                      All seats are currently assigned. Remove a member to free
                      one up.
                    </div>
                  )}
                </DashboardPanel>
              );
            })}
          </div>
        </DashboardSection>
      ) : null}
    </DashboardPage>
  );
}
