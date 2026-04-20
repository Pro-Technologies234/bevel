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
  IconBoltFilled,
  IconBrush,
  IconChartBar,
  IconDeviceFloppy,
  IconDownload,
  IconLayersLinked,
  IconLayoutDashboard,
  IconLayoutGrid,
  IconLock,
  IconPalette,
  IconPlayerPlay,
  IconSettings,
  IconShare,
  IconStack2,
  IconTrendingUp,
  IconUserCircle,
  IconUsers,
  IconVariable,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GlowEffect } from "@/components/ui/glow-effect";

// ─── Professional Step Definitions ───────────────────────────────────────────

const STEPS: TourStepDef[] = [
  {
    step: 1,
    title: "Welcome to Bevel Studio",
    description:
      "A professional design environment built for speed and collaboration. Let's explore the key workflows that power your creative process.",
    side: "bottom",
  },
  {
    step: 2,
    title: "Layer Management",
    media: {
      type: "image",
      src: "/images/tour-layers.png",
    },
    description:
      "Organize your work with nested layers, groups, and components. Right-click for advanced operations like masking and boolean combinations.",
    side: "right",
  },
  {
    step: 3,
    title: "Design System Variables",
    description:
      "Centralize your design tokens. Changes to colors, typography, or spacing propagate instantly across all linked instances.",
    side: "bottom",
  },
  {
    step: 4,
    title: "Component Library",
    description:
      "Access your team's shared components and patterns. Drag and drop to assemble interfaces quickly while maintaining consistency.",
    side: "left",
  },
  {
    step: 5,
    title: "Real-time Collaboration",
    media: {
      type: "video",
      src: "/videos/collaboration-preview.webm",
    },
    description:
      "See who's working on what with live cursors and presence indicators. Leave comments and resolve feedback without leaving the editor.",
    side: "bottom",
  },
];

// ─── Professional Editor Interface ────────────────────────────────────────────

function ProfessionalEditor() {
  const pathName = usePathname();
  const [activeTool, setActiveTool] = useState("design");
  const [selectedLayer, setSelectedLayer] = useState("Hero Section");

  const layers = [
    { name: "Hero Section", type: "frame", visible: true, locked: false },
    { name: "Navigation Bar", type: "component", visible: true, locked: true },
    { name: "Content Grid", type: "group", visible: true, locked: false },
    { name: "Footer", type: "frame", visible: false, locked: false },
  ];

  const designTokens = [
    { name: "Primary / 500", value: "#3B82F6", type: "color" },
    { name: "Gray / 900", value: "#111827", type: "color" },
    { name: "Spacing / lg", value: "24px", type: "spacing" },
    { name: "Text / 2xl", value: "24px/1.5", type: "typography" },
  ];

  return (
    <div
      className={cn(
        "flex h-full w-full rounded-xl border border-border overflow-hidden bg-background shadow-lg",
      )}
    >
      {/* Left Sidebar - Tools & Layers */}
      <TourAnchor step={2} asChild>
        <aside className="w-60 shrink-0 border-r border-border bg-muted/10 flex flex-col not-md:hidden">
          {/* Tool Switcher */}
          <div className="p-3 border-b border-border/60">
            <div className="flex gap-1 p-0.5 bg-muted/40 overflow-x-auto rounded-md">
              {[
                { id: "design", icon: IconBrush, label: "Design" },
                { id: "prototype", icon: IconPlayerPlay, label: "Prototype" },
                { id: "inspect", icon: IconVariable, label: "Inspect" },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={cn(
                    "flex-1 shrink-0 flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
                    activeTool === tool.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <tool.icon size={13} strokeWidth={1.8} />
                  <span className="hidden xl:inline">{tool.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Layers Panel */}
          <div className="flex-1 overflow-auto p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Layers
              </span>
              <button className="p-1 hover:bg-muted/60 rounded transition-colors">
                <IconStack2 size={12} strokeWidth={1.8} />
              </button>
            </div>
            <div className="space-y-0.5">
              {layers.map((layer) => (
                <button
                  key={layer.name}
                  onClick={() => setSelectedLayer(layer.name)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs transition-colors",
                    selectedLayer === layer.name
                      ? "bg-pink-400/10 text-pink-400"
                      : "hover:bg-muted/40",
                  )}
                >
                  <IconLayersLinked
                    size={12}
                    strokeWidth={1.8}
                    className={cn(
                      "shrink-0",
                      !layer.visible && "opacity-40",
                      layer.locked && "text-amber-500",
                    )}
                  />
                  <span className="flex-1 truncate">{layer.name}</span>
                  {layer.locked && <IconLock size={16} />}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </TourAnchor>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <TourAnchor step={1} asChild>
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <IconBoltFilled
                  size={16}
                  strokeWidth={1.8}
                  className="text-primary"
                />
                <span className="font-semibold text-sm tracking-tight">
                  Bevel Studio
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-pink-400/15 text-pink-400 rounded-full font-medium">
                  PRO
                </span>
              </div>
              <div className="h-4 w-px bg-border/60" />
              <span className="text-xs text-muted-foreground not-md:hidden">
                Project: Marketing Site
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button className="p-1.5 hover:bg-muted/60 rounded-md transition-colors">
                <IconDeviceFloppy size={14} strokeWidth={1.8} />
              </button>
              <button className="p-1.5 hover:bg-muted/60 rounded-md transition-colors">
                <IconShare size={14} strokeWidth={1.8} />
              </button>
              <div className="h-4 w-px bg-border/60 mx-1" />
              <TourAnchor step={5}>
                <button className="relative p-1.5 hover:bg-muted/60 rounded-md transition-colors">
                  <IconUsers size={14} strokeWidth={1.8} />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-background" />
                </button>
              </TourAnchor>
              <button className="relative p-1.5 hover:bg-muted/60 rounded-md transition-colors">
                <IconBell size={14} strokeWidth={1.8} />
              </button>
              <button className="ml-1 p-1 hover:bg-muted/60 rounded-full transition-colors">
                <IconUserCircle size={18} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </TourAnchor>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-muted/20 p-6 relative">
          {/* Grid Pattern Background */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Canvas Frame */}
          <div className="relative w-full max-w-2xl aspect-[16/9] bg-background rounded-lg shadow-2xl border border-border/40 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-pink-400/20 to-pink-400/5 flex items-center justify-center">
                <IconBrush
                  size={28}
                  strokeWidth={1.5}
                  className="text-pink-400"
                />
              </div>
              <h3 className="font-semibold text-base mb-1">{selectedLayer}</h3>
              <p className="text-xs text-muted-foreground">
                Click and drag to edit • Press Space to pan
              </p>
            </div>

            {/* Selection Handles */}
            <div className="absolute inset-0 border-2 border-pink-400/40 rounded-lg pointer-events-none">
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-pink-400 rounded-full" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-pink-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties & Components */}
      <aside className="w-64 shrink-0 border-l border-border bg-muted/10 flex flex-col not-md:hidden">
        {/* Design Tokens Section */}
        <div className="p-3 border-b border-border/60 w-full">
          <TourAnchor step={3} className="p-3 border-b border-border/60 w-full">
            <div className="flex items-center gap-1.5 mb-2 w-full">
              <IconPalette size={13} strokeWidth={1.8} />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Variables
              </span>
            </div>
            <div className="space-y-1">
              {designTokens.map((token) => (
                <div
                  key={token.name}
                  className="grid grid-cols-3 items-center justify-between p-1.5 rounded hover:bg-muted/40 transition-colors cursor-pointer group"
                >
                  <span className="text-xs truncate col-span-2">
                    {token.name}
                  </span>
                  <div className="flex items-center  gap-1.5">
                    {token.type === "color" && (
                      <div
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: token.value }}
                      />
                    )}
                    <span className="text-[10px] text-muted-foreground font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {token.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TourAnchor>
        </div>

        {/* Components Section */}
        <div className="flex-1 overflow-auto p-2">
          <TourAnchor step={4} className=" p-3 w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Components
              </span>
              <button className="p-1 hover:bg-muted/60 rounded transition-colors">
                <IconDownload size={12} strokeWidth={1.8} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Button / Primary",
                "Card / Default",
                "Input / Text",
                "Modal / Base",
                "Table / Simple",
                "Avatar / Stack",
              ].map((component) => (
                <button
                  key={component}
                  className="p-2 rounded-lg border border-border/60 bg-background/40 hover:bg-muted/40 hover:border-primary/30 transition-all text-left"
                >
                  <div className="w-full h-18 animate-pulse mb-1.5 rounded bg-gradient-to-br from-muted/60 to-muted/30" />
                  <span className="text-[10px] font-medium truncate block">
                    {component}
                  </span>
                </button>
              ))}
            </div>
          </TourAnchor>
        </div>
      </aside>
    </div>
  );
}

// ─── Demo Wrapper ─────────────────────────────────────────────────────────────

export function ProductTourDemo() {
  const pathName = usePathname();
  const isHome = pathName === "/";
  const isPreview = pathName.startsWith("/preview");
  return (
    <TourRoot steps={isHome ? STEPS : DASH_STEPS} defaultOpen={false}>
      <div className="flex flex-col gap-4 w-full h-full">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Interactive Product Tour
            </h3>
            <p className="text-xs text-muted-foreground/60">
              Experience the complete Studio workflow
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
              variant={"inverted"}
              className="shadow-sm hover:shadow-md transition-shadow animate-bounce"
            />
          </div>
        </div>
        {isHome || isPreview ? <ProfessionalEditor /> : <MiniDashboard />}
      </div>
    </TourRoot>
  );
}

const DASH_STEPS: TourStepDef[] = [
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
      src: "/images/tour-1.png",
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
  const pathName = usePathname();
  const metrics = [
    { label: "Revenue", value: "$48,295", delta: "+12.5%", up: true },
    { label: "Users", value: "3,842", delta: "+8.1%", up: true },
    { label: "Churn", value: "2.4%", delta: "-0.3%", up: false },
    { label: "MRR", value: "$12,400", delta: "+5.2%", up: true },
  ];

  return (
    <div
      className={cn(
        "flex h-full w-full rounded-xl border border-border overflow-hidden bg-background shadow-sm text-sm",
        pathName !== "/" && "h-[460px]",
      )}
    >
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

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function ProductTourPage() {
  return (
    <DocPageRenderer
      page={pageData as any}
      demoRegistry={{ ProductTourDemo }}
    />
  );
}
