// app/(admin)/admin/analytics/page.tsx
import { getAdminStats, getRevenueChartData } from "@/actions/admin";
import { formatPrice } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconTrendingUp,
  IconUsers,
  IconPackage,
  IconCreditCard,
} from "@tabler/icons-react";

export default async function AnalyticsPage() {
  const [stats, chartData, topProducts] = await Promise.all([
    getAdminStats(),
    getRevenueChartData(),
    prisma.product.findMany({
      where: { published: true },
      include: {
        _count: { select: { purchases: true, licenses: true } },
        purchases: {
          where: { status: "ACTIVE" },
          select: { amountPaid: true },
        },
      },
      orderBy: { purchases: { _count: "desc" } },
      take: 6,
    }),
  ]);

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Business overview</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            title: "Total Revenue",
            value: formatPrice(stats.totalRevenueCents),
            icon: IconCreditCard,
            sub: "All time",
          },
          {
            title: "Active Plans",
            value: stats.activeSubs,
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
            title: "Monthly Trend",
            value: formatPrice(
              chartData[chartData.length - 1]?.revenue * 100 || 0,
            ),
            icon: IconTrendingUp,
            sub: "This month",
          },
        ].map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {kpi.title}
              </CardTitle>
              <kpi.icon size={14} className="text-muted-foreground/50" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Revenue chart */}
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Revenue (12 months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1.5 h-48">
              {chartData.map((d) => (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center gap-1 group"
                >
                  <div className="relative w-full">
                    <div
                      className="w-full rounded-t-sm bg-primary/70 group-hover:bg-primary transition-colors relative"
                      style={{
                        height: `${Math.max((d.revenue / maxRevenue) * 160, 2)}px`,
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border border-border text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        ${d.revenue.toFixed(0)}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] text-muted-foreground">
                    {d.month}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Top products
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {topProducts.map((product) => {
              const revenue = product.purchases.reduce(
                (sum, p) => sum + (p.amountPaid ?? 0),
                0,
              );
              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product._count.purchases} purchases ·{" "}
                      {product._count.licenses} licenses
                    </p>
                  </div>
                  <div className="text-sm font-bold shrink-0">
                    {formatPrice(revenue)}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Waitlist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Waitlist — {stats.waitlistCount} subscribers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {stats.waitlistCount} people waiting for notifications when new
            systems ship.
          </p>
          <div className="mt-3">
            <a
              href="/admin/waitlist"
              className="text-xs text-primary hover:underline"
            >
              View full waitlist →
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
