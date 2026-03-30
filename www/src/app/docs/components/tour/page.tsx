"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconArrowRight,
  IconBell,
  IconChartBar,
  IconHome,
  IconLayoutDashboard,
  IconSettings,
  IconTrendingUp,
  IconUsers,
} from "@tabler/icons-react";
import {
  TourRoot,
  TourAnchor,
  TourTrigger,
  type TourStepDef,
} from "@/registry/tour";

// ─── Step definitions ─────────────────────────────────────────────────────────

const DEMO_STEPS: TourStepDef[] = [
  {
    step: 1,
    title: "Welcome to your dashboard",
    description:
      "This is your command centre. Everything you need to manage your product is here. Let's walk you through the key areas.",
    side: "bottom",
    media: {
      type: "image",
      src: "/images/cars.jpg"
    }
  },
  {
    step: 2,
    title: "Navigation",
    description:
      "Use the sidebar to switch between sections — Home, Analytics, Users, and Settings. Your current section is always highlighted.",
    side: "right",
        media: {
      type: "video",
            poster: "/images/cars.jpg",
      src: "/videos/demo.mp4"
    }
  },
  {
    step: 3,
    title: "Key metrics",
    description:
      "These cards show your most important numbers at a glance. Click any card to drill into the full report for that metric.",
    side: "bottom",
  },
  {
    step: 4,
    title: "Revenue chart",
    description:
      "Your revenue trend over time. Hover any point to see exact figures. Use the date picker above to change the time range.",
    side: "top",
  },
  {
    step: 5,
    title: "Notifications",
    description:
      "This bell icon shows unread alerts. Click it to see what needs your attention — new signups, failed payments, and more.",
    side: "bottom",
  },
];

// ─── Demo dashboard ───────────────────────────────────────────────────────────

function DemoDashboard() {
  const metrics = [
    { label: "Revenue", value: "$48,295", delta: "+12.5%", up: true },
    { label: "Users", value: "3,842", delta: "+8.1%", up: true },
    { label: "Churn rate", value: "2.4%", delta: "-0.3%", up: false },
    { label: "MRR", value: "$12,400", delta: "+5.2%", up: true },
  ];

  const chartBars = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88];

  return (
    <div className="flex h-[520px] rounded-xl border border-border overflow-hidden bg-background text-sm shadow-sm">

      {/* Sidebar */}
      <TourAnchor step={2} asChild>
        <aside className="w-48 shrink-0 border-r border-border bg-muted/20 flex flex-col py-4 px-3 gap-1">
          <TourAnchor step={1} asChild>
            <div className="px-2 pb-4 mb-2 border-b border-border/60">
              <span className="font-semibold text-base tracking-tight">Acme Inc.</span>
              <p className="text-[11px] text-muted-foreground">Pro plan</p>
            </div>
          </TourAnchor>

          {[
            { icon: IconHome, label: "Home", active: false },
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
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <item.icon size={15} strokeWidth={1.8} />
              {item.label}
            </button>
          ))}
        </aside>
      </TourAnchor>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
          <div>
            <h1 className="font-semibold text-base">Dashboard</h1>
            <p className="text-[11px] text-muted-foreground">Good morning, Alex</p>
          </div>
          <div className="flex items-center gap-2">
            <TourAnchor step={5}>
              <button className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-muted/60 transition-colors">
                <IconBell size={15} strokeWidth={1.8} />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
              </button>
            </TourAnchor>
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-semibold text-primary">
              A
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5 flex flex-col gap-5">

          {/* Metric cards */}
          <TourAnchor step={3}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col gap-1 p-3 rounded-xl border border-border/60 bg-muted/10 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <span className="text-[11px] text-muted-foreground">{m.label}</span>
                  <span className="text-lg font-semibold tracking-tight">{m.value}</span>
                  <span
                    className={cn(
                      "text-[11px] font-medium flex items-center gap-0.5",
                      m.up ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    <IconTrendingUp size={11} strokeWidth={2.5} className={!m.up ? "rotate-180" : ""} />
                    {m.delta} vs last month
                  </span>
                </div>
              ))}
            </div>
          </TourAnchor>

          {/* Chart */}
          <TourAnchor step={4}>
            <div className="flex-1 rounded-xl border border-border/60 bg-muted/10 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Revenue over time</span>
                <div className="flex items-center gap-1">
                  {["7d", "30d", "90d"].map((r, i) => (
                    <button
                      key={r}
                      className={cn(
                        "text-[11px] px-2 py-0.5 rounded-md",
                        i === 1
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted/60"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex-1 flex items-end gap-1.5 min-h-[120px]">
                {chartBars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-primary/20 hover:bg-primary/40 transition-colors cursor-pointer relative group"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover border border-border text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                      ${(h * 500).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-[10px] text-muted-foreground">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
          </TourAnchor>
        </div>
      </div>
    </div>
  );
}

// ─── Code snippet ─────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative group rounded-xl border border-border bg-muted/30 overflow-hidden">
      <pre className="overflow-x-auto p-4 text-xs text-foreground/80 leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-3 right-3 text-[11px] px-2.5 py-1 rounded-md border border-border bg-background text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

// ─── Props table ─────────────────────────────────────────────────────────────

function PropsTable({
  rows,
}: {
  rows: { prop: string; type: string; default?: string; description: string }[];
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Prop</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Type</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Default</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
              <td className="px-4 py-2.5 font-mono text-primary">{row.prop}</td>
              <td className="px-4 py-2.5 font-mono text-muted-foreground">{row.type}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{row.default ?? "—"}</td>
              <td className="px-4 py-2.5 text-muted-foreground leading-relaxed">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TourDocsPage() {
  return (
    <div className="flex flex-1 min-w-0">
      <main className="flex-1 min-w-0 px-10 py-12 max-w-5xl flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <Badge
            variant="secondary"
            className="w-fit bg-primary/10 text-primary border-primary/20 text-xs px-2.5 py-1"
          >
            System
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Product Tour</h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            A fully-engineered guided tour system. Highlights any element on the page,
            positions a floating card that never escapes the viewport, supports media,
            and handles keyboard navigation out of the box.
          </p>
          <div className="mt-1 h-px bg-border/60" />
        </div>

        {/* Live demo */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium tracking-tight">Live demo</h2>
            <TourRoot steps={DEMO_STEPS} defaultOpen={false}>
              <TourTrigger label="Start tour" />
              {/* Anchors are inside DemoDashboard below — they read from the same context */}
            </TourRoot>
          </div>

          <p className="text-sm text-muted-foreground">
            Click "Start tour" to walk through the dashboard below. Use{" "}
            <kbd className="text-[11px] bg-muted border border-border rounded px-1.5 py-0.5">←</kbd>{" "}
            <kbd className="text-[11px] bg-muted border border-border rounded px-1.5 py-0.5">→</kbd>{" "}
            to navigate and{" "}
            <kbd className="text-[11px] bg-muted border border-border rounded px-1.5 py-0.5">Esc</kbd>{" "}
            to close.
          </p>

          {/* The actual demo — TourRoot wraps both the trigger and the dashboard */}
          <TourRoot steps={DEMO_STEPS} defaultOpen={false}>
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <TourTrigger label="Start tour" />
              </div>
              <DemoDashboard />
            </div>
          </TourRoot>
        </div>

        {/* Installation */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">Installation</h2>
          <p className="text-sm text-muted-foreground">
            The tour system has two peer dependencies. Install them if you haven't already.
          </p>
          <CodeBlock code={`npm install @floating-ui/react motion`} />
          <p className="text-sm text-muted-foreground">
            Then copy the tour files into your project under{" "}
            <code className="text-xs bg-muted border border-border rounded px-1.5 py-0.5">
              registry/tour/
            </code>
            .
          </p>
        </div>

        {/* Basic usage */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">Basic usage</h2>
          <p className="text-sm text-muted-foreground">
            Wrap your page with <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">TourRoot</code>,
            define your steps, then place <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">TourAnchor</code> around any element you want to highlight.
          </p>
          <CodeBlock
            code={`import { TourRoot, TourAnchor, TourTrigger } from "@/registry/tour";

const steps = [
  {
    step: 1,
    title: "Your profile",
    description: "Click here to update your avatar and display name.",
    side: "bottom",
  },
  {
    step: 2,
    title: "Settings",
    description: "Manage notifications, billing, and team members here.",
    side: "right",
    media: {
      type: "gif",
      src: "/demos/settings.gif",
      alt: "Settings panel demo",
    },
  },
];

export default function MyPage() {
  return (
    <TourRoot steps={steps} defaultOpen>
      <TourAnchor step={1}>
        <Avatar />
      </TourAnchor>

      <TourAnchor step={2} asChild>
        <button>Settings</button>
      </TourAnchor>

      {/* Anywhere in the tree */}
      <TourTrigger label="Take a tour" />
    </TourRoot>
  );
}`}
          />
        </div>

        {/* With media */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">With media</h2>
          <p className="text-sm text-muted-foreground">
            Each step can include a <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">media</code> object.
            Videos autoplay muted and loop. GIFs and images are shown with a max height of 160px.
          </p>
          <CodeBlock
            code={`const steps = [
  {
    step: 1,
    title: "Export your data",
    description: "Click the export button to download a CSV of all your records.",
    side: "bottom",
    media: {
      type: "video",          // "video" | "gif" | "image"
      src: "/demos/export.mp4",
      poster: "/demos/export-thumb.jpg",
    },
  },
];`}
          />
        </div>

        {/* Programmatic control */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">Programmatic control</h2>
          <p className="text-sm text-muted-foreground">
            Use the <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">useTour</code> hook
            anywhere inside <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">TourRoot</code> to control the tour from your own UI.
          </p>
          <CodeBlock
            code={`import { useTour } from "@/registry/tour";

function MyToolbar() {
  const { start, stop, next, prev, skip, goTo, currentStep, totalSteps, isOpen } = useTour();

  return (
    <div>
      <button onClick={start}>Start tour</button>
      <button onClick={() => goTo(3)}>Jump to step 3</button>
      <button onClick={skip}>Skip tour</button>
      <span>{currentStep} / {totalSteps}</span>
    </div>
  );
}`}
          />
        </div>

        {/* TourStepDef props */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">TourStepDef</h2>
          <PropsTable
            rows={[
              { prop: "step", type: "number", description: "1-based step index. Must be unique." },
              { prop: "title", type: "string", description: "Bold heading shown in the card." },
              { prop: "description", type: "string", description: "Body text explaining this step." },
              { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "Preferred placement. Flips automatically if it would escape the viewport." },
              { prop: "sideOffset", type: "number", default: "16", description: "Distance between the card and the anchor in px." },
              { prop: "media", type: "TourMedia", description: "Optional image, gif, or video shown above the title." },
              { prop: "highlightPadding", type: "number", default: "8", description: "Space between the anchor and the highlight ring in px." },
            ]}
          />
        </div>

        {/* TourAnchor props */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">TourAnchor</h2>
          <PropsTable
            rows={[
              { prop: "step", type: "number", description: "Which step this element is the anchor for." },
              { prop: "asChild", type: "boolean", default: "false", description: "Merge props onto the child element instead of adding a wrapper div. Uses Radix Slot." },
            ]}
          />
        </div>

        {/* TourRoot props */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">TourRoot</h2>
          <PropsTable
            rows={[
              { prop: "steps", type: "TourStepDef[]", description: "All step definitions for this tour." },
              { prop: "defaultOpen", type: "boolean", default: "false", description: "Start the tour automatically on mount." },
              { prop: "onComplete", type: "() => void", description: "Called when the user finishes the last step." },
              { prop: "onSkip", type: "() => void", description: "Called when the user closes the tour early." },
            ]}
          />
        </div>

        {/* Prev / Next */}
        <div className="mt-4 flex items-center justify-between pt-6 border-t border-border/60">
          <a href="#" className="flex flex-col gap-0.5 text-left group">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Previous</span>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              ← Quick start
            </span>
          </a>
          <a href="#" className="flex flex-col gap-0.5 text-right group">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Next</span>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Multi-step Form →
            </span>
          </a>
        </div>
      </main>

      {/* Right TOC */}
      <aside className="hidden xl:flex sticky top-0 h-screen w-32 shrink-0 flex-col gap-2 py-12 pl-2 pr-6">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
          On this page
        </span>
        {[
          "Live demo",
          "Installation",
          "Basic usage",
          "With media",
          "Programmatic control",
          "TourStepDef",
          "TourAnchor",
          "TourRoot",
        ].map((item) => (
          <a
            key={item}
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5"
          >
            {item}
          </a>
        ))}
      </aside>
    </div>
  );
}
