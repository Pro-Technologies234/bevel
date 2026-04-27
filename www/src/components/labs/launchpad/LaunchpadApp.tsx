"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  CommandPaletteRoot,
  CommandPaletteTrigger,
  type CommandPaletteSection,
} from "@/components/bevelui/command-palette";
import { TourRoot, TourAnchor } from "@/components/bevelui/tour";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconBoltFilled,
  IconCode,
  IconGitBranch,
  IconServer,
  IconBell,
  IconTrendingUp,
  IconTrendingDown,
  IconCircleCheck,
  IconAlertTriangle,
  IconRefresh,
  IconExternalLink,
  IconTerminal2,
  IconWorld,
  IconChartBar,
  IconUsers,
  IconApi,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// ─── Mock data ────────────────────────────────────────────────────────────────

const PROJECTS = [
  { id: "bevel", name: "bevel-ui", status: "deployed", env: "production", lastDeploy: "2m ago", visits: "12.4k", branch: "main" },
  { id: "docs", name: "bevel-docs", status: "building", env: "preview", lastDeploy: "Just now", visits: "3.1k", branch: "feat/labs" },
  { id: "api", name: "bevel-api", status: "deployed", env: "production", lastDeploy: "1h ago", visits: "8.7k", branch: "main" },
];

const DEPLOYMENTS = [
  { id: "1", project: "bevel-ui", status: "success", branch: "main", commit: "Update hero section", time: "2m ago", duration: "43s" },
  { id: "2", project: "bevel-docs", status: "building", branch: "feat/labs", commit: "Add Labs page", time: "Just now", duration: "..." },
  { id: "3", project: "bevel-api", status: "success", branch: "main", commit: "Fix webhook handler", time: "1h ago", duration: "28s" },
  { id: "4", project: "bevel-ui", status: "failed", branch: "fix/mobile", commit: "Mobile nav fix", time: "3h ago", duration: "12s" },
];

const METRICS = [
  { label: "Total visits", value: "24.2k", delta: "+14%", up: true, icon: IconWorld },
  { label: "API calls", value: "189k", delta: "+8%", up: true, icon: IconApi },
  { label: "Active users", value: "1,847", delta: "+22%", up: true, icon: IconUsers },
  { label: "Error rate", value: "0.12%", delta: "-40%", up: false, icon: IconAlertTriangle },
];

const TOUR_STEPS = [
  { step: 1, title: "Your Launchpad", description: "All your projects, deployments, and metrics in one place.", side: "bottom" as const },
  { step: 2, title: "Projects", description: "Every deployed project with live status. Click any to view deployment history.", side: "right" as const },
  { step: 3, title: "Deployments", description: "Your most recent deploys across all projects. Rebuild or roll back from here.", side: "left" as const },
  { step: 4, title: "Quick actions", description: "Press ⌘K to search projects, trigger deploys, or jump to any page instantly.", side: "bottom" as const },
];

const CMD_SECTIONS: CommandPaletteSection[] = [
  {
    id: "projects",
    title: "Projects",
    items: PROJECTS.map((p) => ({
      id: p.id,
      title: p.name,
      subtitle: `${p.env} · ${p.lastDeploy}`,
      category: "project",
      initials: p.name.slice(0, 2).toUpperCase(),
      initialsColor: "#c2f13c",
    })),
  },
  {
    id: "actions",
    title: "Actions",
    items: [
      { id: "deploy", title: "Trigger deploy", subtitle: "Push to production", category: "action", initials: "▶", initialsColor: "#22c55e" },
      { id: "logs", title: "View logs", subtitle: "Open runtime logs", category: "action", initials: "≡", initialsColor: "#6366f1" },
      { id: "env", title: "Environment variables", subtitle: "Manage .env settings", category: "action", initials: "⚙", initialsColor: "#f59e0b" },
      { id: "team", title: "Invite team member", subtitle: "Add a collaborator", category: "action", initials: "+", initialsColor: "#8b5cf6" },
    ],
  },
];

function StatusDot({ status }: { status: string }) {
  return (
    <span className={cn(
      "inline-block w-1.5 h-1.5 rounded-full",
      status === "deployed" ? "bg-emerald-400" :
      status === "building" ? "bg-amber-400 animate-pulse" :
      "bg-red-400"
    )} />
  );
}

export default function LaunchpadApp() {
  const [activeProject, setActiveProject] = useState("bevel");

  return (
    <TourRoot steps={TOUR_STEPS} defaultOpen>
      <CommandPaletteRoot sections={CMD_SECTIONS} defaultOpen={false}>
        <div className="flex h-full rounded-2xl overflow-hidden border border-border bg-background">

          {/* Sidebar */}
          <aside className="w-52 shrink-0 border-r border-border bg-muted/10 flex flex-col">
            <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                <IconBoltFilled size={12} color="#0a0a0a" />
              </div>
              <span className="font-bold text-sm">Launchpad</span>
            </div>

            <nav className="flex-1 p-2 flex flex-col gap-0.5">
              {[
                { icon: IconChartBar, label: "Overview", active: true },
                { icon: IconServer, label: "Projects", active: false },
                { icon: IconCode, label: "Deployments", active: false },
                { icon: IconUsers, label: "Team", active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left w-full",
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <item.icon size={13} strokeWidth={1.8} />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header */}
            <TourAnchor step={1} asChild>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div>
                  <h1 className="text-sm font-semibold">Overview</h1>
                  <p className="text-[11px] text-muted-foreground">Last 30 days</p>
                </div>
                <TourAnchor step={4}>
                  <CommandPaletteTrigger
                    label="Search or jump to..."
                    className="h-8 text-xs w-52"
                  />
                </TourAnchor>
              </div>
            </TourAnchor>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
              {/* Metrics */}
              <div className="grid grid-cols-4 gap-3">
                {METRICS.map((m) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl border border-border/60 bg-muted/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] text-muted-foreground">{m.label}</p>
                      <m.icon size={12} strokeWidth={1.8} className="text-muted-foreground/50" />
                    </div>
                    <p className="text-lg font-bold tracking-tight">{m.value}</p>
                    <p className={cn(
                      "text-[10px] flex items-center gap-0.5 mt-0.5",
                      m.up ? "text-emerald-500" : "text-red-500"
                    )}>
                      {m.up ? <IconTrendingUp size={10} /> : <IconTrendingDown size={10} />}
                      {m.delta} vs last period
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* Projects */}
                <TourAnchor step={2}>
                  <div className="flex flex-col gap-3">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projects</h2>
                    <div className="flex flex-col gap-2">
                      {PROJECTS.map((project) => (
                        <motion.div
                          key={project.id}
                          whileHover={{ x: 2 }}
                          onClick={() => setActiveProject(project.id)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                            activeProject === project.id
                              ? "border-primary/30 bg-primary/5"
                              : "border-border hover:border-border/80 bg-muted/10",
                          )}
                        >
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-mono font-bold">
                            {project.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <StatusDot status={project.status} />
                              <p className="text-xs font-medium truncate">{project.name}</p>
                            </div>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <IconGitBranch size={9} />
                              {project.branch} · {project.lastDeploy}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-semibold">{project.visits}</p>
                            <p className="text-[10px] text-muted-foreground">visits</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TourAnchor>

                {/* Deployments */}
                <TourAnchor step={3}>
                  <div className="flex flex-col gap-3">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent deploys</h2>
                    <div className="flex flex-col gap-2">
                      {DEPLOYMENTS.map((dep) => (
                        <div
                          key={dep.id}
                          className="flex items-center gap-2.5 p-3 rounded-xl border border-border/60 bg-muted/10"
                        >
                          {dep.status === "success" ? (
                            <IconCircleCheck size={14} strokeWidth={2} className="text-emerald-500 shrink-0" />
                          ) : dep.status === "building" ? (
                            <IconRefresh size={14} strokeWidth={2} className="text-amber-400 animate-spin shrink-0" />
                          ) : (
                            <IconAlertTriangle size={14} strokeWidth={2} className="text-red-500 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{dep.commit}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {dep.project} · {dep.branch} · {dep.time}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground shrink-0">{dep.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TourAnchor>
              </div>
            </div>
          </div>
        </div>
      </CommandPaletteRoot>
    </TourRoot>
  );
}
