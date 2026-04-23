"use client";

/**
 * Block: SaaS Dashboard with Product Tour
 * Systems used: Product Tour
 * Scenario: A new user lands on their analytics dashboard.
 * The tour walks them through the 4 key areas of the app.
 *
 * Drop into: app/blocks/dashboard-tour/page.tsx
 */

import { TourRoot, TourAnchor, TourTrigger } from "@/components/bevelui/tour";
import { TourStepDef } from "@/components/bevelui/tour";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconLayoutDashboard,
  IconChartBar,
  IconUsers,
  IconSettings,
  IconBell,
  IconSearch,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowUpRight,
  IconPlayerPlay,
} from "@tabler/icons-react";

const TOUR_STEPS: TourStepDef[] = [
  {
    step: 1,
    title: "Your navigation hub",
    description:
      "Everything you need is right here. Switch between your dashboard, reports, team, and settings in one click.",
    side: "right",
  },
  {
    step: 2,
    title: "Live metrics at a glance",
    description:
      "These cards update in real time. Click any card to drill into the full report for that metric.",
    side: "bottom",
  },
  {
    step: 3,
    title: "Revenue over time",
    description:
      "Hover any point on the chart to see a breakdown. Use the range selector to zoom in on any period.",
    side: "top",
    media: {
      type: "image",
      src: "https://placehold.co/480x200/1a1a2e/c2f13c?text=Chart+Demo",
      alt: "Chart interaction demo",
    },
  },
  {
    step: 4,
    title: "Create your first report",
    description:
      "Ready to go deeper? Generate a custom report and share it with your team in seconds.",
    side: "left",
  },
];

function StatCard({
  label,
  value,
  change,
  up,
}: {
  label: string;
  value: string;
  change: string;
  up: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold tracking-tight">{value}</span>
      <span
        className={`flex items-center gap-1 text-xs font-medium ${up ? "text-green-500" : "text-red-500"}`}
      >
        {up ? <IconTrendingUp size={13} /> : <IconTrendingDown size={13} />}
        {change} vs last month
      </span>
    </div>
  );
}

function MiniBar({ h }: { h: number }) {
  return (
    <div className="flex flex-col justify-end h-full">
      <div
        className="w-full rounded-sm bg-primary/80"
        style={{ height: `${h}%` }}
      />
    </div>
  );
}

const bars = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88];

export default function DashboardTourBlock() {
  return (
    <TourRoot steps={TOUR_STEPS} onComplete={() => console.log("Tour done")}>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        {/* Sidebar */}
        <TourAnchor step={1}>
          <aside className="w-60 border-r border-border flex flex-col p-4 gap-1 shrink-0">
            <div className="flex items-center gap-2 px-2 mb-6 mt-1">
              <div className="size-7 rounded-md bg-primary" />
              <span className="font-semibold text-sm tracking-tight">
                Acme Analytics
              </span>
            </div>
            {[
              { icon: IconLayoutDashboard, label: "Dashboard", active: true },
              { icon: IconChartBar, label: "Reports" },
              { icon: IconUsers, label: "Team" },
              { icon: IconSettings, label: "Settings" },
            ].map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </aside>
        </TourAnchor>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <header className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg px-3 py-1.5">
              <IconSearch size={14} />
              <span>Search anything...</span>
            </div>
            <div className="flex items-center gap-3">
              <TourTrigger>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 cursor-pointer"
                >
                  <IconPlayerPlay size={13} />
                  Take the tour
                </Button>
              </TourTrigger>
              <button className="relative">
                <IconBell size={18} className="text-muted-foreground" />
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary" />
              </button>
              <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                JD
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">
                  Good morning, Jamie 👋
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Here's what's happening with your store today.
                </p>
              </div>
              <TourAnchor step={2}>
                <Button className="gap-2 cursor-pointer">
                  <IconArrowUpRight size={15} />
                  New Report
                </Button>
              </TourAnchor>
            </div>

            {/* Stats */}
            <TourAnchor step={3} asChild>
              <div className="grid grid-cols-4 gap-4">
                <StatCard
                  label="Total Revenue"
                  value="$48,295"
                  change="+12.5%"
                  up
                />
                <StatCard
                  label="Active Users"
                  value="3,842"
                  change="+8.1%"
                  up
                />
                <StatCard label="Churn Rate" value="2.4%" change="-0.3%" up />
                <StatCard
                  label="Avg. Session"
                  value="4m 12s"
                  change="-5.2%"
                  up={false}
                />
              </div>
            </TourAnchor>

            {/* Chart */}
            <TourAnchor step={4} asChild>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-sm font-medium">Revenue Over Time</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Monthly breakdown — last 12 months
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {["1M", "3M", "6M", "1Y"].map((r, i) => (
                      <button
                        key={r}
                        className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                          i === 3
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-end gap-2 h-32">
                  {bars.map((h, i) => (
                    <div key={i} className="flex-1 h-full">
                      <MiniBar h={h} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].map((m) => (
                    <span
                      key={m}
                      className="text-[10px] text-muted-foreground flex-1 text-center"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </TourAnchor>

            {/* Recent activity */}
            <div className="rounded-xl border border-border bg-card">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-medium">Recent Transactions</h2>
                <Badge variant="secondary" className="text-xs">
                  24 today
                </Badge>
              </div>
              {[
                {
                  name: "Stripe payment",
                  amount: "+$1,200",
                  time: "2 min ago",
                  status: "success",
                },
                {
                  name: "Refund issued",
                  amount: "-$89",
                  time: "14 min ago",
                  status: "refund",
                },
                {
                  name: "Subscription renewal",
                  amount: "+$299",
                  time: "1h ago",
                  status: "success",
                },
                {
                  name: "New enterprise deal",
                  amount: "+$4,800",
                  time: "3h ago",
                  status: "success",
                },
              ].map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 last:border-0 text-sm"
                >
                  <span className="text-foreground/80">{tx.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {tx.time}
                    </span>
                    <span
                      className={`font-medium tabular-nums ${
                        tx.amount.startsWith("+")
                          ? "text-green-500"
                          : "text-red-400"
                      }`}
                    >
                      {tx.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </TourRoot>
  );
}
