// app/(admin)/admin/page.tsx
import { getAdminStats, getRevenueChartData } from "@/actions/admin";
import { formatPrice } from "@/lib/stripe";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconUsers,
  IconCreditCard,
  IconPackage,
  IconMail,
  IconArrowUpRight,
  IconTrendingUp,
  IconDownload,
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
      trend: "+12.5%",
      color: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-500/30",
    },
    {
      title: "Active Subscribers",
      value: stats.activeSubs.toLocaleString(),
      icon: IconPackage,
      sub: "Paying customers",
      trend: "+8%",
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: IconUsers,
      sub: `+${stats.newUsersThisMonth} this month`,
      trend: "+5.2%",
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
    },
    {
      title: "Waitlist",
      value: stats.waitlistCount.toLocaleString(),
      icon: IconMail,
      sub: "Pending notifications",
      trend: "+2.1%",
      color: "from-orange-500/20 to-rose-500/20",
      borderColor: "border-orange-500/30",
    },
  ];

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  return (
    <div className="p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back! Here's what's happening with Bevel UI.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <IconDownload size={14} />
          Export Report
        </Button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card
            key={card.title}
            className={`border-l-2 ${card.borderColor} bg-gradient-to-br ${card.color} backdrop-blur-sm border-border/50 hover:border-border/80 transition-all duration-300`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <card.icon size={16} className="text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight mb-2">
                {card.value}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{card.sub}</p>
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-primary/15 text-primary hover:bg-primary/25"
                >
                  {card.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="col-span-2 border-border/50 hover:border-border/80 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Revenue Trend
                </CardTitle>
                <CardDescription className="mt-1">
                  Last 12 months
                </CardDescription>
              </div>
              <IconTrendingUp size={16} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1.5 h-56 w-full">
              {chartData.map((d) => (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center gap-2 group"
                  title={`${d.month}: ${formatPrice(d.revenue)}`}
                >
                  <div className="relative w-full h-full flex items-end justify-center">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-primary/80 to-primary hover:from-primary hover:to-primary/90 transition-all duration-200 shadow-lg group-hover:shadow-xl group-hover:scale-y-105 origin-bottom"
                      style={{
                        height: `${(d.revenue / maxRevenue) * 100}%`,
                        minHeight: 4,
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground font-medium">
                    {d.month.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="text-muted-foreground">Total Revenue (12m)</p>
                  <p className="font-semibold text-lg mt-1">
                    {formatPrice(
                      chartData.reduce((sum, d) => sum + d.revenue, 0),
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Current Month</p>
                  <p className="font-semibold text-lg mt-1">
                    {formatPrice(chartData[chartData.length - 1]?.revenue ?? 0)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-border/50 hover:border-border/80 transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Recent Orders
                </CardTitle>
                <CardDescription className="text-[10px] mt-1">
                  Latest purchases
                </CardDescription>
              </div>
              <Link href="/admin/orders">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-primary hover:text-primary"
                >
                  View all
                  <IconArrowUpRight size={12} className="ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {stats.recentPurchases.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate">
                    {p.user.name ?? p.user.email}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {p.product.name}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-bold">
                    {formatPrice(p.amountPaid ?? 0)}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[9px] px-1.5 py-0"
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

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <IconUsers size={14} className="mr-2" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="outline" className="w-full justify-start">
                <IconPackage size={14} className="mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full justify-start">
                <IconCreditCard size={14} className="mr-2" />
                View Orders
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full justify-start">
                <IconTrendingUp size={14} className="mr-2" />
                Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
