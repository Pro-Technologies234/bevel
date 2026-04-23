"use client";

/**
 * Block: Project Management App with Command Palette
 * Systems used: Command Palette
 * Scenario: A project management tool where the command palette
 * lets users navigate, create tasks, search projects, and run actions — all from the keyboard.
 *
 * Drop into: app/blocks/command-palette-app/page.tsx
 */

import {
  CommandPaletteRoot,
  CommandPaletteTrigger,
} from "@/components/bevelui/command-palette";
import type { CommandPaletteSection } from "@/components/bevelui/command-palette";
import { Badge } from "@/components/ui/badge";
import {
  IconLayoutKanban,
  IconChecklist,
  IconUsers,
  IconSettings,
  IconPlus,
  IconSearch,
  IconBell,
  IconChevronRight,
  IconCircleCheck,
  IconCircleDashed,
  IconAlertCircle,
  IconFolder,
  IconHome,
} from "@tabler/icons-react";

const PALETTE_SECTIONS: CommandPaletteSection[] = [
  {
    id: "actions",
    title: "Quick Actions",
    items: [
      {
        id: "new-task",
        title: "Create new task",
        subtitle: "Add a task to the current project",
        icon: <IconPlus />,
        meta: "⌘N",
        onSelect: () => alert("Creating new task..."),
      },
      {
        id: "new-project",
        title: "Create new project",
        subtitle: "Start a fresh project board",
        icon: <IconFolder />,
        meta: "⌘⇧N",
        onSelect: () => alert("Creating new project..."),
      },
    ],
  },
  {
    id: "navigate",
    title: "Navigate",
    items: [
      {
        id: "nav-home",
        title: "Home",
        subtitle: "Go to your home dashboard",
        icon: <IconHome />,
        onSelect: () => console.log("Navigate: Home"),
      },
      {
        id: "nav-board",
        title: "Kanban Board",
        subtitle: "View all tasks by status",
        icon: <IconLayoutKanban />,
        onSelect: () => console.log("Navigate: Board"),
      },
      {
        id: "nav-tasks",
        title: "My Tasks",
        subtitle: "Tasks assigned to you",
        icon: <IconChecklist />,
        meta: "12 open",
        onSelect: () => console.log("Navigate: Tasks"),
      },
      {
        id: "nav-team",
        title: "Team",
        subtitle: "View team members and assignments",
        icon: <IconUsers />,
        onSelect: () => console.log("Navigate: Team"),
      },
      {
        id: "nav-settings",
        title: "Settings",
        subtitle: "Manage your workspace preferences",
        icon: <IconSettings />,
        onSelect: () => console.log("Navigate: Settings"),
      },
    ],
  },
  {
    id: "recent",
    title: "Recent Projects",
    items: [
      {
        id: "proj-1",
        title: "Website Redesign",
        subtitle: "Last updated 2 hours ago · 8 open tasks",
        icon: <IconFolder />,
        onSelect: () => console.log("Open: Website Redesign"),
      },
      {
        id: "proj-2",
        title: "Mobile App v2",
        subtitle: "Last updated yesterday · 23 open tasks",
        icon: <IconFolder />,
        onSelect: () => console.log("Open: Mobile App v2"),
      },
      {
        id: "proj-3",
        title: "API Integration",
        subtitle: "Last updated 3 days ago · 5 open tasks",
        icon: <IconFolder />,
        onSelect: () => console.log("Open: API Integration"),
      },
    ],
  },
];

const tasks = [
  {
    id: 1,
    title: "Design new landing page hero section",
    status: "in-progress",
    assignee: "JD",
    priority: "high",
    project: "Website Redesign",
  },
  {
    id: 2,
    title: "Fix auth token refresh bug",
    status: "todo",
    assignee: "MK",
    priority: "urgent",
    project: "API Integration",
  },
  {
    id: 3,
    title: "Write onboarding copy for mobile",
    status: "done",
    assignee: "SR",
    priority: "medium",
    project: "Mobile App v2",
  },
  {
    id: 4,
    title: "Set up error monitoring with Sentry",
    status: "todo",
    assignee: "JD",
    priority: "medium",
    project: "API Integration",
  },
  {
    id: 5,
    title: "Conduct user interviews — Q2 cohort",
    status: "in-progress",
    assignee: "LM",
    priority: "low",
    project: "Website Redesign",
  },
  {
    id: 6,
    title: "Update component library to v3",
    status: "done",
    assignee: "MK",
    priority: "high",
    project: "Mobile App v2",
  },
];

const statusConfig = {
  todo: {
    icon: IconCircleDashed,
    label: "To Do",
    color: "text-muted-foreground",
  },
  "in-progress": {
    icon: IconAlertCircle,
    label: "In Progress",
    color: "text-blue-400",
  },
  done: { icon: IconCircleCheck, label: "Done", color: "text-green-500" },
};

const priorityColors: Record<string, string> = {
  urgent: "bg-red-500/10 text-red-500",
  high: "bg-orange-500/10 text-orange-400",
  medium: "bg-blue-500/10 text-blue-400",
  low: "bg-muted text-muted-foreground",
};

export default function CommandPaletteAppBlock() {
  return (
    <CommandPaletteRoot sections={PALETTE_SECTIONS}>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 border-r border-border flex flex-col p-3 gap-0.5 shrink-0">
          <div className="flex items-center gap-2 px-2 py-3 mb-2">
            <div className="size-6 rounded bg-primary" />
            <span className="font-semibold text-sm">Linear Clone</span>
          </div>

          {[
            { icon: IconHome, label: "Home", active: false },
            { icon: IconLayoutKanban, label: "Board", active: true },
            { icon: IconChecklist, label: "My Tasks", badge: "12" },
            { icon: IconUsers, label: "Team" },
            { icon: IconSettings, label: "Settings" },
          ].map(({ icon: Icon, label, active, badge }) => (
            <button
              key={label}
              className={`flex items-center justify-between px-2.5 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={15} />
                {label}
              </span>
              {badge && (
                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full font-medium">
                  {badge}
                </span>
              )}
            </button>
          ))}

          <div className="mt-auto pt-4 border-t border-border">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="size-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold">
                JD
              </div>
              <span className="text-xs text-muted-foreground">Jamie D.</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <header className="h-12 border-b border-border flex items-center justify-between px-5 shrink-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Projects</span>
              <IconChevronRight size={12} />
              <span className="text-foreground font-medium">All Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <CommandPaletteTrigger asChild>
                <button className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-muted-foreground px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer">
                  <IconSearch size={12} />
                  <span>Search tasks...</span>
                  <kbd className="ml-2 text-[10px] bg-background border border-border px-1.5 py-0.5 rounded font-mono">
                    ⌘K
                  </kbd>
                </button>
              </CommandPaletteTrigger>
              <button className="relative p-1.5">
                <IconBell size={16} className="text-muted-foreground" />
              </button>
              <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-md font-medium">
                <IconPlus size={13} />
                New Task
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto">
            {/* Filter bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
              {["All", "To Do", "In Progress", "Done"].map((f, i) => (
                <button
                  key={f}
                  className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                    i === 0
                      ? "bg-foreground text-background font-medium"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f}
                </button>
              ))}
              <span className="ml-auto text-xs text-muted-foreground">
                {tasks.length} tasks
              </span>
            </div>

            {/* Task table */}
            <div className="divide-y divide-border/60">
              {tasks.map((task) => {
                const { icon: StatusIcon, color } =
                  statusConfig[task.status as keyof typeof statusConfig];
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <StatusIcon size={16} className={color} />
                    <span className="flex-1 text-sm text-foreground/90 group-hover:text-foreground transition-colors">
                      {task.title}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {task.project}
                    </span>
                    <Badge
                      className={`text-[10px] capitalize ${priorityColors[task.priority]}`}
                      variant="secondary"
                    >
                      {task.priority}
                    </Badge>
                    <div className="size-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold">
                      {task.assignee}
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </CommandPaletteRoot>
  );
}
