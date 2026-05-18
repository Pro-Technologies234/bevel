"use client";

/**
 * BLOCK: Forge — Linear-style project management
 * Bevel Systems: Command Palette + Form Engine (create issue) + Product Tour
 * shadcn: Card, Badge, Button, Input, Dialog, Avatar, Separator,
 *          DropdownMenu, Tooltip, Progress, Tabs, ScrollArea
 * motion/react: issue list stagger, panel slide, status transitions
 */

import { useState } from "react";
import { motion } from "motion/react";
import { z } from "zod";

// ─── Bevel Systems ────────────────────────────────────────────────────────────
import {
  CommandPaletteRoot,
  CommandPaletteTrigger,
} from "@/components/bevelui/command-palette";
import type { CommandPaletteSection } from "@/components/bevelui/command-palette";

import {
  FormEngineRoot,
  FormEngineStepCanvas,
  FormEngineNavigation,
  createZodPlugin,
  type FormEngineConfig,
} from "@/components/bevelui/form-engine";

import { TourRoot, TourAnchor, TourTrigger } from "@/components/bevelui/tour";
import type { TourStepDef } from "@/components/bevelui/tour";

// ─── shadcn/ui ────────────────────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

// ─── Icons ────────────────────────────────────────────────────────────────────
import {
  IconLayoutKanban,
  IconChecklist,
  IconUsers,
  IconSettings,
  IconPlus,
  IconSearch,
  IconCircleDashed,
  IconAlertCircle,
  IconCircleCheck,
  IconChevronRight,
  IconPlayerPlay,
  IconFlag,
  IconClock,
  IconTarget,
  IconArrowUp,
  IconHome,
  IconBolt,
  IconFlame,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Priority = "urgent" | "high" | "medium" | "low";
type Status = "backlog" | "todo" | "in-progress" | "done";

type Issue = {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  labels: string[];
  assignee: string;
  cycle?: string;
  points?: number;
};

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_ISSUES: Issue[] = [
  {
    id: "FRG-14",
    title: "Implement dark mode token system",
    status: "in-progress",
    priority: "high",
    labels: ["frontend", "design"],
    assignee: "JD",
    points: 5,
  },
  {
    id: "FRG-13",
    title: "Fix auth token refresh on mobile Safari",
    status: "todo",
    priority: "urgent",
    labels: ["bug", "auth"],
    assignee: "MK",
    points: 3,
  },
  {
    id: "FRG-12",
    title: "Add CSV export to reports page",
    status: "todo",
    priority: "medium",
    labels: ["feature", "data"],
    assignee: "SR",
    points: 2,
  },
  {
    id: "FRG-11",
    title: "Set up Sentry error tracking",
    status: "backlog",
    priority: "medium",
    labels: ["infra"],
    assignee: "JD",
    points: 1,
  },
  {
    id: "FRG-10",
    title: "Write E2E tests for onboarding flow",
    status: "backlog",
    priority: "low",
    labels: ["testing"],
    assignee: "LM",
    points: 8,
  },
  {
    id: "FRG-9",
    title: "Migrate database to Postgres 16",
    status: "done",
    priority: "high",
    labels: ["infra", "database"],
    assignee: "MK",
    points: 13,
  },
  {
    id: "FRG-8",
    title: "Redesign empty state illustrations",
    status: "done",
    priority: "low",
    labels: ["design"],
    assignee: "SR",
    points: 2,
  },
  {
    id: "FRG-7",
    title: "Rate limiting on public API endpoints",
    status: "in-progress",
    priority: "urgent",
    labels: ["security", "api"],
    assignee: "JD",
    points: 5,
  },
];

const STATUS_CONFIG: Record<
  Status,
  { icon: typeof IconCircleDashed; label: string; color: string; bg: string }
> = {
  backlog: {
    icon: IconCircleDashed,
    label: "Backlog",
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  todo: {
    icon: IconCircleDashed,
    label: "Todo",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  "in-progress": {
    icon: IconAlertCircle,
    label: "In Progress",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  done: {
    icon: IconCircleCheck,
    label: "Done",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
};

const PRIORITY_CONFIG: Record<
  Priority,
  { icon: typeof IconFlag; color: string }
> = {
  urgent: { icon: IconFlame, color: "text-red-500" },
  high: { icon: IconArrowUp, color: "text-orange-400" },
  medium: { icon: IconTarget, color: "text-blue-400" },
  low: { icon: IconClock, color: "text-muted-foreground" },
};

const LABEL_COLORS: Record<string, string> = {
  frontend: "bg-blue-500/10 text-blue-400",
  bug: "bg-red-500/10 text-red-400",
  feature: "bg-primary/10 text-primary",
  infra: "bg-purple-500/10 text-purple-400",
  design: "bg-pink-500/10 text-pink-400",
  testing: "bg-orange-500/10 text-orange-400",
  auth: "bg-yellow-500/10 text-yellow-500",
  security: "bg-red-500/10 text-red-400",
  api: "bg-cyan-500/10 text-cyan-400",
  data: "bg-indigo-500/10 text-indigo-400",
  database: "bg-purple-500/10 text-purple-400",
};

// ─── Product Tour Steps ───────────────────────────────────────────────────────
const TOUR_STEPS: TourStepDef[] = [
  {
    id: "nav",
    step: 1,
    title: "Navigate your workspace",
    description:
      "Switch between all issues, your assignments, and completed work. Everything organized in one sidebar.",
    side: "right",
  },
  {
    id: "create-btn",
    step: 2,
    title: "Create issues instantly",
    description:
      "Hit ⌘N or click New Issue to open the creation dialog. Title, priority, labels — all in one focused flow.",
    side: "bottom",
  },
  {
    id: "kanban-tabs",
    step: 3,
    title: "Board or list — your call",
    description:
      "Toggle between list view and kanban board. Your workflow, your preference.",
    side: "bottom",
  },
  {
    id: "cycle-bar",
    step: 4,
    title: "Active cycle progress",
    description:
      "See how much of the current sprint is done at a glance. Click to drill into the full cycle breakdown.",
    side: "top",
  },
];

// ─── Command Palette Data ─────────────────────────────────────────────────────
const PALETTE_SECTIONS: CommandPaletteSection[] = [
  {
    id: "issues",
    title: "Recent Issues",
    items: SEED_ISSUES.slice(0, 4).map((i) => ({
      id: i.id,
      title: i.title,
      subtitle: `${i.id} · ${i.priority} priority`,
      meta: i.status,
    })),
  },
  {
    id: "actions",
    title: "Actions",
    items: [
      {
        id: "new",
        title: "Create new issue",
        meta: "⌘N",
        icon: <IconPlus size={16} />,
      },
      {
        id: "board",
        title: "Switch to board view",
        icon: <IconLayoutKanban size={16} />,
      },
      {
        id: "assign",
        title: "View my assignments",
        icon: <IconChecklist size={16} />,
      },
    ],
  },
];

// ─── Issue Row Component ──────────────────────────────────────────────────────
function IssueRow({ issue, index }: { issue: Issue; index: number }) {
  const { icon: StatusIcon, color } = STATUS_CONFIG[issue.status];
  const { icon: PriorityIcon, color: pColor } = PRIORITY_CONFIG[issue.priority];
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 rounded-lg transition-colors cursor-pointer"
    >
      <PriorityIcon size={13} className={`shrink-0 ${pColor}`} />
      <StatusIcon size={15} className={`shrink-0 ${color}`} />
      <span className="text-xs text-muted-foreground font-mono shrink-0 hidden sm:block w-14">
        {issue.id}
      </span>
      <span className="flex-1 text-sm text-foreground/90 min-w-0 truncate">
        {issue.title}
      </span>
      <div className="hidden md:flex items-center gap-1.5">
        {issue.labels.slice(0, 2).map((l) => (
          <span
            key={l}
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              LABEL_COLORS[l] ?? "bg-muted text-muted-foreground"
            }`}
          >
            {l}
          </span>
        ))}
      </div>
      {issue.points && (
        <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5 hidden lg:block">
          {issue.points} pts
        </span>
      )}
      <Avatar className="size-6 shrink-0">
        <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
          {issue.assignee}
        </AvatarFallback>
      </Avatar>
    </motion.div>
  );
}

// ─── Kanban Column Component ──────────────────────────────────────────────────
function KanbanColumn({ status, issues }: { status: Status; issues: Issue[] }) {
  const { label, color, bg } = STATUS_CONFIG[status];
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={`text-xs font-medium ${color}`}>{label}</span>
        <Badge variant="secondary" className="text-[10px] px-1.5">
          {issues.length}
        </Badge>
      </div>
      <div className="space-y-2">
        {issues.map((issue, i) => {
          const { icon: PIcon, color: pc } = PRIORITY_CONFIG[issue.priority];
          return (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="p-3 cursor-pointer hover:border-primary/30 transition-all hover:shadow-md hover:shadow-primary/5 space-y-2">
                <p className="text-xs leading-snug">{issue.title}</p>
                <div className="flex items-center gap-2">
                  <PIcon size={11} className={pc} />
                  {issue.labels.slice(0, 1).map((l) => (
                    <span
                      key={l}
                      className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                        LABEL_COLORS[l] ?? "bg-muted text-muted-foreground"
                      }`}
                    >
                      {l}
                    </span>
                  ))}
                  <Avatar className="size-4 ml-auto shrink-0">
                    <AvatarFallback className="text-[8px] bg-muted">
                      {issue.assignee}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Create Issue Dialog (using Form Engine) ──────────────────────────────────
const issueSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  priority: z.string().min(1, "Select a priority"),
  labels: z.array(z.string()).optional(),
  description: z.string().optional(),
});

const CREATE_ISSUE_CONFIG: FormEngineConfig = {
  mode: "single",
  steps: [
    {
      id: "create",
      title: "Create new issue",
      fields: [
        {
          key: "title",
          variant: "text",
          label: "Title",
          placeholder: "What needs to be done?",
          required: true,
        },
        // {
        //   key: "priority",
        //   variant: "card-select",
        //   label: "Priority",
        //   required: true,
        //   props: {
        //     options: [
        //       {
        //         value: "urgent",
        //         label: "Urgent",
        //         description: "Must ship now",
        //       },
        //       { value: "high", label: "High", description: "Next sprint" },
        //       {
        //         value: "medium",
        //         label: "Medium",
        //         description: "When possible",
        //       },
        //       { value: "low", label: "Low", description: "Nice to have" },
        //     ],
        //     layout: "grid",
        //     columns: 4,
        //   },
        // },
        // {
        //   key: "labels",
        //   variant: "chip-select",
        //   label: "Labels",
        //   props: {
        //     options: Object.keys(LABEL_COLORS).map((l) => ({
        //       value: l,
        //       label: l,
        //     })),
        //     multiple: true,
        //   },
        // },
        {
          key: "description",
          variant: "textarea",
          label: "Description",
          placeholder: "Add more context…",
        },
      ],
    },
  ],
};

function CreateIssueDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (issue: Issue) => void;
}) {
  const handleSubmit = async (values: Record<string, unknown>) => {
    onCreate({
      id: `FRG-${Math.floor(Math.random() * 100 + 15)}`,
      title: values.title as string,
      status: "todo",
      priority: values.priority as Priority,
      labels: (values.labels as string[]) ?? [],
      assignee: "JD",
      points: 1,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Create issue</DialogTitle>
        </DialogHeader>
        <FormEngineRoot
          config={CREATE_ISSUE_CONFIG}
          plugins={[createZodPlugin({ 0: issueSchema })]}
          onSubmit={handleSubmit}
        >
          <FormEngineStepCanvas />
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <FormEngineNavigation
            // submitLabel="Create issue"
            />
          </div>
        </FormEngineRoot>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function ForgeApp() {
  const [issues, setIssues] = useState<Issue[]>(SEED_ISSUES);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("all");

  const doneCount = issues.filter((i) => i.status === "done").length;
  const progress = Math.round((doneCount / issues.length) * 100);

  const filtered = issues.filter((i) => {
    if (activeNav === "mine") return i.assignee === "JD";
    if (activeNav === "done") return i.status === "done";
    return true;
  });

  const NAV = [
    { id: "all", label: "All Issues", icon: IconHome },
    { id: "mine", label: "My Issues", icon: IconChecklist },
    { id: "done", label: "Completed", icon: IconCircleCheck },
    { id: "settings", label: "Settings", icon: IconSettings },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <TourAnchor step={1} className="m-2">
        <aside className="w-56 border-r border-border flex flex-col p-3 shrink-0">
          <div className="flex items-center gap-2 px-2 py-3 mb-2">
            <div className="size-6 rounded-md bg-primary flex items-center justify-center">
              <IconBolt size={12} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">Forge</span>
            <Badge variant="secondary" className="ml-auto text-[9px] px-1.5">
              v2
            </Badge>
          </div>

          <nav className="space-y-0.5 flex-1">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveNav(id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                  activeNav === id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>

          <Separator className="my-3" />

          {/* Cycle progress */}
          <TourAnchor step={4} asChild>
            <div className="px-2 space-y-1.5 pb-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">
                  Cycle 4 · Active
                </span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
              <p className="text-[10px] text-muted-foreground">
                {doneCount} of {issues.length} issues
              </p>
            </div>
          </TourAnchor>
        </aside>
      </TourAnchor>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-12 border-b border-border flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Forge</span>
            <IconChevronRight size={13} className="text-muted-foreground" />
            <span className="font-medium capitalize">
              {NAV.find((n) => n.id === activeNav)?.label ?? "All Issues"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CommandPaletteTrigger asChild>
              <button className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-md text-xs text-muted-foreground transition-colors cursor-pointer">
                <IconSearch size={12} />
                Search issues…
                <kbd className="ml-2 text-[10px] bg-background border border-border px-1 rounded font-mono">
                  ⌘K
                </kbd>
              </button>
            </CommandPaletteTrigger>
            <TourTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs cursor-pointer"
              >
                <IconPlayerPlay size={12} />
                Tour
              </Button>
            </TourTrigger>
            <TourAnchor step={2}>
              <Button
                size="sm"
                className="gap-1.5 text-xs cursor-pointer"
                onClick={() => setCreateOpen(true)}
              >
                <IconPlus size={13} />
                New Issue
              </Button>
            </TourAnchor>
          </div>
        </header>

        {/* Content */}
        <TourAnchor step={3} className="m-4">
          <Tabs
            defaultValue="list"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-5 border-b border-border">
              <TabsList className="h-9 bg-transparent p-0 gap-1">
                {["list", "board"].map((v) => (
                  <TabsTrigger
                    key={v}
                    value={v}
                    className="h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent capitalize text-xs px-3"
                  >
                    {v === "list" ? (
                      <>
                        <IconChecklist size={13} className="mr-1.5" />
                        List
                      </>
                    ) : (
                      <>
                        <IconLayoutKanban size={13} className="mr-1.5" />
                        Board
                      </>
                    )}
                  </TabsTrigger>
                ))}
                <span className="ml-auto text-xs text-muted-foreground self-center">
                  {filtered.length} issues
                </span>
              </TabsList>
            </div>

            <TabsContent value="list" className="flex-1 overflow-auto m-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-0.5">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center py-16 text-center">
                      <IconChecklist
                        size={32}
                        className="text-muted-foreground/30 mb-3"
                      />
                      <p className="text-sm text-muted-foreground">
                        No issues here
                      </p>
                    </div>
                  ) : (
                    filtered.map((issue, i) => (
                      <IssueRow key={issue.id} issue={issue} index={i} />
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="board" className="flex-1 overflow-auto m-0">
              <div className="flex gap-5 p-5 h-full overflow-x-auto">
                {(["backlog", "todo", "in-progress", "done"] as Status[]).map(
                  (s) => (
                    <KanbanColumn
                      key={s}
                      status={s}
                      issues={filtered.filter((i) => i.status === s)}
                    />
                  ),
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TourAnchor>
      </div>

      <CreateIssueDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={(issue) => setIssues((prev) => [issue, ...prev])}
      />
    </div>
  );
}

export default function ForgeBlock() {
  return (
    <TourRoot steps={TOUR_STEPS}>
      <CommandPaletteRoot sections={PALETTE_SECTIONS}>
        <ForgeApp />
      </CommandPaletteRoot>
    </TourRoot>
  );
}
