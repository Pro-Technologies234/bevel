// app/(admin)/admin/page.tsx
import { getAdminStats, getRevenueChartData } from "@/actions/admin";
import { formatPrice } from "@/lib/stripe";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconUsers,
  IconCreditCard,
  IconPackage,
  IconMail,
  IconArrowUpRight,
} from "@tabler/icons-react";
import Link from "next/link";

export default async function AdminPage() {
  const [stats, chartData] = await Promise.all([
    getAdminStats(),
    getRevenueChartData(),
  ]);

  const statCards = [
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenueCents),
      icon: IconCreditCard,
      sub: "All time",
    },
    {
      title: "Active Subscribers",
      value: stats.activeSubs.toLocaleString(),
      icon: IconPackage,
      sub: "Paying customers",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: IconUsers,
      sub: `+${stats.newUsersThisMonth} this month`,
    },
    {
      title: "Waitlist",
      value: stats.waitlistCount.toLocaleString(),
      icon: IconMail,
      sub: "Pending notifications",
    },
  ];

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bevel UI admin dashboard
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {card.title}
              </CardTitle>
              <card.icon
                size={15}
                strokeWidth={1.8}
                className="text-muted-foreground/50"
              />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Revenue chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Revenue — last 12 months
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-40">
              {chartData.map((d) => (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-sm bg-primary/80 hover:bg-primary transition-colors"
                    style={{
                      height: `${(d.revenue / maxRevenue) * 100}%`,
                      minHeight: 2,
                    }}
                    title={`${d.month}: $${d.revenue.toFixed(2)}`}
                  />
                  <span className="text-[9px] text-muted-foreground rotate-45 origin-left">
                    {d.month}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Recent orders
            </CardTitle>
            <Link
              href="/admin/orders"
              className="text-xs text-primary flex items-center gap-1 hover:underline"
            >
              View all <IconArrowUpRight size={12} />
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {stats.recentPurchases.slice(0, 6).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">
                    {p.user.name ?? p.user.email}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {p.product.name}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-semibold">
                    {formatPrice(p.amountPaid ?? 0)}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                    style={{
                      background:
                        p.status === "ACTIVE"
                          ? "rgba(34,197,94,.15)"
                          : "rgba(255,255,255,.08)",
                      color: p.status === "ACTIVE" ? "#16a34a" : undefined,
                    }}
                  >
                    {p.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
