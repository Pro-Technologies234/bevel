"use client";

import pageData from "@/content/docs/product-tour.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import {
  TourRoot,
  TourAnchor,
  TourTrigger,
  useTour,
  type TourStepDef,
} from "@/components/bevelui/tour";
import { cn } from "@/lib/utils";
import {
  IconBell,
  IconChartBar,
  IconLayoutDashboard,
  IconSettings,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS: TourStepDef[] = [
  {
    step: 1,
    title: "Welcome to your dashboard",
    description:
      "This is your command centre. Everything you need is here. Let us walk you through the key areas.",
    side: "bottom",
  },
  {
    step: 2,
    title: "Navigation sidebar",
    media: {
      type: "image",
      src: "/images/car.webp",
    },
    description:
      "Switch between Home, Analytics, Users, and Settings. Your current section is always highlighted.",
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
    title: "Notification bell",
    description:
      "Unread alerts show here — new signups, failed payments, and more.",
    media: {
      type: "video",
      src: "/videos/tour-1.webm",
    },
    side: "bottom",
  },
];

// ─── Mini dashboard demo ──────────────────────────────────────────────────────

function MiniDashboard() {
  const metrics = [
    { label: "Revenue", value: "$48,295", delta: "+12.5%", up: true },
    { label: "Users", value: "3,842", delta: "+8.1%", up: true },
    { label: "Churn", value: "2.4%", delta: "-0.3%", up: false },
    { label: "MRR", value: "$12,400", delta: "+5.2%", up: true },
  ];

  return (
    <div className="flex h-[460px] w-full rounded-xl border border-border overflow-hidden bg-background shadow-sm text-sm">
      {/* Sidebar */}
      <TourAnchor step={2} asChild className=" rounded-lg">
        <aside className="w-44 shrink-0 border-r border-border bg-muted/20 flex flex-col py-4 px-3 gap-1">
          <TourAnchor step={1} asChild>
            <div className="px-2 pb-4 mb-1 border-b border-border/60">
              <span className="font-semibold text-sm tracking-tight">
                Acme Inc.
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Pro plan
              </p>
            </div>
          </TourAnchor>
          {[
            { icon: IconLayoutDashboard, label: "Dashboard", active: true },
            { icon: IconChartBar, label: "Analytics", active: false },
            { icon: IconUsers, label: "Users", active: false },
            { icon: IconSettings, label: "Settings", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs font-medium transition-colors text-left w-full",
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              <item.icon size={14} strokeWidth={1.8} />
              {item.label}
            </button>
          ))}
        </aside>
      </TourAnchor>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
          <div>
            <h2 className="font-semibold text-sm">Dashboard</h2>
            <p className="text-[11px] text-muted-foreground">
              Good morning, Alex
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TourAnchor step={4}>
              <button className="relative w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted/60 transition-colors">
                <IconBell size={14} strokeWidth={1.8} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
              </button>
            </TourAnchor>
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-semibold text-primary">
              A
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5 flex flex-col gap-4">
          <TourAnchor step={3}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col gap-1 p-3 rounded-xl border border-border/60 bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer"
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
          <div className="flex-1 rounded-xl border border-border/60 bg-muted/10 p-4 flex flex-col gap-2">
            <span className="text-xs font-medium">Revenue over time</span>
            <div className="flex-1 flex items-end gap-1 min-h-[80px]">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-primary/20 hover:bg-primary/40 transition-colors"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Demo wrapper ─────────────────────────────────────────────────────────────

function ProductTourDemo() {
  return (
    <TourRoot steps={STEPS} defaultOpen={false}>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-end">
          <TourTrigger label="Start tour" className=" animate-bounce" />
        </div>
        <MiniDashboard />
      </div>
    </TourRoot>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductTourPage() {
  return (
    <DocPageRenderer
      page={pageData as any}
      demoRegistry={{ ProductTourDemo }}
    />
  );
}
