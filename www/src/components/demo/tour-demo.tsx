import {
  TourRoot,
  TourAnchor,
  TourTrigger,
  type TourStepDef,
} from "@/components/bevelui/tour";
import { cn } from "@/lib/utils";
import {
  IconBell,
  IconChartBar,
  IconLayoutDashboard,
  IconSettings,
  IconUsers,
  IconTrendingUp,
  IconArrowUpRight,
} from "@tabler/icons-react";
import { GlowEffect } from "@/components/ui/glow-effect";
import { Button } from "@/components/ui/button";

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS: TourStepDef[] = [
  {
    step: 1,
    title: "Welcome to the dashboard",
    description:
      "This is your command centre. Let us walk you through the key areas so you can hit the ground running.",
    side: "bottom",
  },
  {
    step: 2,
    title: "Navigation",
    description:
      "Jump between sections from here. Your active page is always highlighted.",
    side: "right",
  },
  {
    step: 3,
    title: "Key metrics",
    description:
      "Your most important numbers at a glance. Click any card to drill into the full report.",
    side: "bottom",
  },
  {
    step: 4,
    title: "Notifications",
    description:
      "New signups, failed payments, and team activity all surface here.",
    side: "bottom",
  },
  {
    step: 5,
    title: "Quick actions",
    description:
      "Export data, invite teammates, or open settings without leaving the page.",
    side: "top",
  },
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: IconLayoutDashboard, label: "Dashboard", active: true },
  { icon: IconChartBar, label: "Analytics" },
  { icon: IconUsers, label: "Users" },
  { icon: IconSettings, label: "Settings" },
];

const METRICS = [
  { label: "Revenue", value: "$48,295", delta: "+12.5%", up: true },
  { label: "Active users", value: "3,842", delta: "+8.1%", up: true },
  { label: "Churn rate", value: "2.4%", delta: "-0.3%", up: false },
  { label: "MRR", value: "$12,400", delta: "+5.2%", up: true },
];

const ACTIONS = ["Export CSV", "Invite team", "Settings"];

// ─── Demo UI ──────────────────────────────────────────────────────────────────

function DemoUI() {
  return (
    <div className="w-full rounded-xl border border-border bg-background overflow-hidden">
      {/* Top bar */}
      <TourAnchor step={1} asChild>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-semibold text-sm tracking-tight">
            Acme Inc.
          </span>
          <div className="flex items-center gap-2">
            <TourAnchor step={4}>
              <button className="relative p-1.5 rounded-md hover:bg-muted transition-colors">
                <IconBell size={15} strokeWidth={1.8} />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
              </button>
            </TourAnchor>
            <div className="w-6 h-6 rounded-full bg-primary/20 text-[10px] font-semibold text-primary flex items-center justify-center">
              A
            </div>
          </div>
        </div>
      </TourAnchor>

      <div className="flex">
        {/* Sidebar — hidden on mobile, tour step still fires on mobile via top bar */}
        <TourAnchor step={2} asChild>
          <aside className="w-36 shrink-0 bg-muted/30 border-r border-border py-3 px-2 flex-col gap-0.5 hidden sm:flex">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.label}
                size={"sm"}
                variant={item.active ? "secondary" : "ghost"}
                className={cn(
                  " justify-start",
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <item.icon />
                {item.label}
              </Button>
            ))}
          </aside>
        </TourAnchor>

        {/* Main content */}
        <div className="flex-1 p-4 flex flex-col gap-4 min-w-0">
          {/* Metrics grid */}
          <TourAnchor step={3} asChild>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {METRICS.map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border border-border/60"
                >
                  <span className="text-[11px] text-muted-foreground">
                    {m.label}
                  </span>
                  <span className="text-base font-semibold tracking-tight">
                    {m.value}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-medium flex items-center gap-0.5",
                      m.up ? "text-emerald-500" : "text-red-500",
                    )}
                  >
                    <IconTrendingUp
                      size={10}
                      strokeWidth={2.5}
                      className={!m.up ? "rotate-180" : ""}
                    />
                    {m.delta}
                  </span>
                </div>
              ))}
            </div>
          </TourAnchor>

          {/* Chart placeholder */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4 flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Revenue over time
            </span>
            <div className="flex items-end gap-1 h-50">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-primary/20"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <TourAnchor step={5} asChild>
            <div className="flex flex-wrap gap-2">
              {ACTIONS.map((label) => (
                <Button key={label} size={"sm"} variant={"outline"}>
                  {label}
                  <IconArrowUpRight />
                </Button>
              ))}
            </div>
          </TourAnchor>
        </div>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function TourDemo() {
  return (
    <TourRoot steps={STEPS} defaultOpen={false}>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Interactive demo</h3>
            <p className="text-xs text-muted-foreground">
              Click the button to start the tour
            </p>
          </div>
          <div className="relative">
            <GlowEffect
              colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
              mode="static"
              blur="medium"
              className="z-10 bottom-0 inset-x-0 top-8 h-1"
            />
            <TourTrigger
              label="Take a tour"
              className="shadow-sm bg-white! h-8 px-4 rounded-full text-black!"
            />
          </div>
        </div>

        <DemoUI />
      </div>
    </TourRoot>
  );
}
