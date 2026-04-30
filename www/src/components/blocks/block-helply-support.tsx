"use client";

/**
 * BLOCK: Helply — Customer Support Portal
 * A complete support ticket system combining all 4 Bevel systems.
 * Bevel: Form Engine (submit ticket) + File Upload (attachments) + Command Palette + Tour
 * shadcn: Card, Badge, Button, Tabs, Dialog, Avatar, Separator, Progress, ScrollArea
 * motion/react: ticket list entrance, status pill transitions, panel slide-in
 */

import { useState } from "react";
import { motion } from "motion/react";
import { z } from "zod";

// ─── Bevel Systems ────────────────────────────────────────────────────────────
import {
  FormEngineRoot,
  FormEngineProgress,
  FormEngineStepMeta,
  FormEngineStepCanvas,
  FormEngineNavigation,
  createZodPlugin,
  type FormEngineConfig,
} from "@/components/bevelui/form-engine";

import {
  FileUploadRoot,
  FileUploadDropzone,
  FileUploadList,
} from "@/components/bevelui/file-upload";

import {
  CommandPaletteRoot,
  CommandPaletteTrigger,
} from "@/components/bevelui/command-palette";
import type { CommandPaletteSection } from "@/components/bevelui/command-palette";

import { TourRoot, TourAnchor, TourTrigger } from "@/components/bevelui/tour";
import type { TourStepDef } from "@/components/bevelui/tour";

// ─── shadcn/ui ────────────────────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// ─── Icons ────────────────────────────────────────────────────────────────────
import {
  IconSearch,
  IconPlus,
  IconInbox,
  IconClock,
  IconCircleCheck,
  IconAlertCircle,
  IconMessage,
  IconPaperclip,
  IconSend,
  IconPlayerPlay,
  IconLifebuoy,
  IconBook,
  IconHighlight,
  IconMessageCircle,
  IconBell,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TicketStatus = "open" | "pending" | "resolved" | "closed";
type TicketPriority = "low" | "medium" | "high" | "urgent";

type Ticket = {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  created: string;
  lastReply: string;
  messages: number;
  agent?: string;
};

type Message = {
  id: string;
  author: string;
  content: string;
  time: string;
  isAgent: boolean;
  attachments?: string[];
};

// ─── Seed data ────────────────────────────────────────────────────────────────
const TICKETS: Ticket[] = [
  {
    id: "TKT-1042",
    subject: "Can't export data to CSV — getting a 500 error",
    status: "open",
    priority: "high",
    category: "bug",
    created: "2h ago",
    lastReply: "1h ago",
    messages: 4,
    agent: "Alex R.",
  },
  {
    id: "TKT-1041",
    subject: "Billing charge appears twice this month",
    status: "pending",
    priority: "urgent",
    category: "billing",
    created: "3h ago",
    lastReply: "30m ago",
    messages: 6,
    agent: "Sam K.",
  },
  {
    id: "TKT-1040",
    subject: "How do I invite more than 5 team members?",
    status: "resolved",
    priority: "low",
    category: "question",
    created: "Yesterday",
    lastReply: "Yesterday",
    messages: 3,
  },
  {
    id: "TKT-1039",
    subject: "Dark mode toggle not working on mobile",
    status: "open",
    priority: "medium",
    category: "bug",
    created: "2d ago",
    lastReply: "1d ago",
    messages: 2,
    agent: "Alex R.",
  },
  {
    id: "TKT-1038",
    subject: "Request: bulk delete for uploaded files",
    status: "closed",
    priority: "low",
    category: "feature",
    created: "3d ago",
    lastReply: "2d ago",
    messages: 5,
  },
];

const TICKET_MESSAGES: Record<string, Message[]> = {
  "TKT-1042": [
    {
      id: "m1",
      author: "Jamie D.",
      content:
        "Hi — when I click Export CSV on the reports page I get a 500 Internal Server Error. It was working last week.",
      time: "2h ago",
      isAgent: false,
    },
    {
      id: "m2",
      author: "Alex R.",
      content:
        "Hi Jamie! Thanks for reporting this. Can you share the exact URL you're on when it happens?",
      time: "1h 45m ago",
      isAgent: true,
    },
    {
      id: "m3",
      author: "Jamie D.",
      content:
        "Sure — it's /reports/revenue. Happens every time with any date range.",
      time: "1h 30m ago",
      isAgent: false,
    },
    {
      id: "m4",
      author: "Alex R.",
      content:
        "Got it. I can reproduce it. We've filed a bug and will patch it within 24 hours. I'll update this ticket as soon as it's deployed.",
      time: "1h ago",
      isAgent: true,
    },
  ],
};

const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; color: string; dot: string }
> = {
  open: {
    label: "Open",
    color: "bg-blue-500/10 text-blue-400",
    dot: "bg-blue-400",
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-500",
    dot: "bg-yellow-400",
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-500/10 text-green-500",
    dot: "bg-green-400",
  },
  closed: {
    label: "Closed",
    color: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

const PRIORITY_COLORS: Record<TicketPriority, string> = {
  urgent: "bg-red-500/10 text-red-400",
  high: "bg-orange-500/10 text-orange-400",
  medium: "bg-blue-500/10 text-blue-400",
  low: "bg-muted text-muted-foreground",
};

// ─── Tour Steps ───────────────────────────────────────────────────────────────
const TOUR_STEPS: TourStepDef[] = [
  {
    id: "ticket-list",
    step: 1,
    title: "All your support tickets",
    description:
      "Every request in one place. Click any ticket to read the conversation thread and reply.",
    side: "right",
  },
  {
    id: "new-ticket-btn",
    step: 2,
    title: "Submit a new ticket",
    description:
      "The multi-step form walks you through category, description, attachments, and a satisfaction rating — all validated before submitting.",
    side: "bottom",
  },
  {
    id: "stats-row",
    step: 3,
    title: "Live support health",
    description:
      "Track open tickets, avg response time, and CSAT score across your team in real time.",
    side: "bottom",
  },
];

// ─── Command Palette Data ─────────────────────────────────────────────────────
const PALETTE_SECTIONS: CommandPaletteSection[] = [
  {
    id: "tickets",
    title: "Recent Tickets",
    items: TICKETS.slice(0, 3).map((t) => ({
      id: t.id,
      title: t.subject,
      subtitle: `${t.id} · ${t.status} · ${t.lastReply}`,
      meta: t.priority,
    })),
  },
  {
    id: "nav",
    title: "Navigate",
    items: [
      { id: "n1", title: "My open tickets", icon: <IconInbox size={16} /> },
      { id: "n2", title: "All tickets", icon: <IconLifebuoy size={16} /> },
      { id: "n3", title: "Knowledge base", icon: <IconBook size={16} /> },
    ],
  },
];

// ─── Options for form fields ──────────────────────────────────────────────────
const categoryOptions = [
  {
    group: "Billing",
    options: [
      { value: "billing", label: "Billing & Payments" },
      { value: "refund", label: "Refund Request" },
    ],
  },
  {
    group: "Technical",
    options: [
      { value: "bug", label: "Bug Report" },
      { value: "setup", label: "Setup & Configuration" },
    ],
  },
  {
    group: "Account",
    options: [
      { value: "account", label: "Account Management" },
      { value: "security", label: "Security Issue" },
    ],
  },
  {
    group: "Other",
    options: [
      { value: "question", label: "General Question" },
      { value: "feature", label: "Feature Request" },
    ],
  },
];

const tagOptions = [
  "billing",
  "bug",
  "account",
  "mobile",
  "performance",
  "data",
].map((v) => ({ value: v, label: v }));

// ─── Simulated upload function ────────────────────────────────────────────────
async function simulateUpload(
  file: File,
  onProgress: (pct: number) => void,
): Promise<{ url: string }> {
  return new Promise((resolve) => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 20 + 8;
      if (p >= 100) {
        clearInterval(iv);
        onProgress(100);
        resolve({ url: URL.createObjectURL(file) });
      } else {
        onProgress(Math.min(p, 99));
      }
    }, 100);
  });
}

// ─── Ticket Row Component ─────────────────────────────────────────────────────
function TicketRow({
  ticket,
  index,
  onSelect,
  selected,
}: {
  ticket: Ticket;
  index: number;
  onSelect: () => void;
  selected: boolean;
}) {
  const { label, color, dot } = STATUS_CONFIG[ticket.status];
  return (
    <motion.button
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
        selected
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-muted/40"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-1 size-1.5 rounded-full shrink-0 ${dot}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium  line-clamp-1 leading-snug">
            {ticket.subject}
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[10px] text-muted-foreground font-mono">
              {ticket.id}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${color}`}
            >
              {label}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                PRIORITY_COLORS[ticket.priority]
              }`}
            >
              {ticket.priority}
            </span>
            {ticket.agent && (
              <span className="text-[10px] text-muted-foreground ml-auto">
                {ticket.agent}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Ticket Thread Component ──────────────────────────────────────────────────
function TicketThread({ ticket }: { ticket: Ticket }) {
  const [reply, setReply] = useState("");
  const messages = TICKET_MESSAGES[ticket.id] ?? [];
  const { label, color } = STATUS_CONFIG[ticket.status];

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-sm font-semibold leading-snug flex-1">
            {ticket.subject}
          </h2>
          <Badge className={`${color} shrink-0 text-xs`}>{label}</Badge>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span className="font-mono">{ticket.id}</span>
          <span>·</span>
          <span>Opened {ticket.created}</span>
          {ticket.agent && (
            <>
              <span>·</span>
              <span>Assigned to {ticket.agent}</span>
            </>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-5">
        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.isAgent ? "" : "flex-row-reverse"}`}
            >
              <Avatar className="size-8 shrink-0">
                <AvatarFallback
                  className={`text-[10px] ${
                    msg.isAgent ? "bg-primary/10 text-primary" : "bg-muted"
                  }`}
                >
                  {msg.author
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[75%] space-y-1 ${
                  msg.isAgent ? "" : "items-end flex flex-col"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{msg.author}</span>
                  {msg.isAgent && (
                    <Badge variant="secondary" className="text-[9px] py-0">
                      Support
                    </Badge>
                  )}
                  <span className="text-[10px] text-muted-foreground">
                    {msg.time}
                  </span>
                </div>
                <div
                  className={`rounded-xl px-3 py-2.5 text-sm ${
                    msg.isAgent ? "bg-muted" : "bg-primary/10 text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply…"
            rows={2}
            className="resize-none text-sm"
          />
          <div className="flex flex-col gap-1.5">
            <Button size="icon" className="size-9" disabled={!reply.trim()}>
              <IconSend size={14} />
            </Button>
            <Button size="icon" variant="outline" className="size-9">
              <IconPaperclip size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── New Ticket Dialog (Form Engine) ──────────────────────────────────────────
// Per‑step Zod schemas
const stepSchemas = {
  0: z.object({
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    category: z.string().min(1, "Select a category"),
    description: z.string().min(20, "Please describe the issue in more detail"),
    tags: z.array(z.string()).optional(),
  }),
  1: z.object({}), // attachments step — no validation
  2: z.object({
    satisfaction: z.number().optional(),
  }),
};

const TICKET_FORM_CONFIG: FormEngineConfig = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "describe",
      title: "Describe your issue",
      description: "The more detail you give, the faster we can help.",
      fields: [
        {
          key: "subject",
          variant: "text",
          label: "Subject",
          placeholder: "Short summary of the issue",
          required: true,
        },
        {
          key: "category",
          variant: "select",
          label: "Category",
          required: true,
          props: {
            options: categoryOptions,
            placeholder: "What is this about?",
          },
        },
        {
          key: "description",
          variant: "textarea",
          label: "Description",
          required: true,
          placeholder: "What happened? What did you expect?",
        },
        {
          key: "tags",
          variant: "chip-select",
          label: "Tags",
          props: {
            options: tagOptions,
            multiple: true,
          },
        },
      ],
    },
    {
      id: "attachments",
      title: "Add attachments",
      description: "Screenshots or logs help us diagnose faster.",
      fields: [
        {
          key: "attachements",
          variant: "custom",
          render(props) {
            return (
              <FileUploadRoot
                config={{
                  accept: {
                    "image/*": [],
                    "application/pdf": [],
                    "text/plain": [".log", ".txt"],
                  },
                  maxSize: 10 * 1024 * 1024,
                  multiple: true,
                  title: "Drop files here",
                  description: "Screenshots, logs, PDFs up to 10MB",
                }}
                onComplete={props.onChange}
                onUpload={simulateUpload}
              >
                <FileUploadDropzone />
                <div className="mt-3">
                  <FileUploadList />
                </div>
              </FileUploadRoot>
            );
          },
        },
      ], // Custom rendering via stepOverrides
    },
    {
      id: "review",
      title: "Rate recent support",
      description: "How was your last interaction with our team?",
      layout(fields) {
        return (
          <div className="space-y-5">
            <Card className="p-4 bg-muted/30">
              <h4 className="text-sm font-medium mb-1">Your ticket subject</h4>
              <p className="text-xs text-muted-foreground">
                No category · New ticket
              </p>
            </Card>
            <FormEngineStepCanvas />
          </div>
        );
      },
      fields: [
        {
          key: "satisfaction",
          variant: "rating",
          label: "How was your last support experience?",
          props: {
            max: 5,
          },
        },
      ],
    },
  ],
};

function NewTicketDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (t: Ticket) => void;
}) {
  const [done, setDone] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  const handleSubmit = async (values: Record<string, unknown>) => {
    setFormValues(values);
    onSubmit({
      id: `TKT-${Math.floor(Math.random() * 100 + 1043)}`,
      subject: values.subject as string,
      status: "open",
      priority: "medium",
      category: values.category as string,
      created: "Just now",
      lastReply: "Just now",
      messages: 0,
    });
    setDone(true);
  };

  if (done) {
    return (
      <Dialog
        open={open}
        onOpenChange={(v) => {
          onOpenChange(v);
          if (!v) setDone(false);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8 space-y-3">
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <IconCircleCheck size={28} className="text-primary" />
            </div>
            <h3 className="font-semibold">Ticket submitted!</h3>
            <p className="text-sm text-muted-foreground">
              We typically respond within 2 hours. You'll get an email
              notification.
            </p>
            <Button
              onClick={() => {
                onOpenChange(false);
                setDone(false);
              }}
            >
              Back to inbox
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New support ticket</DialogTitle>
        </DialogHeader>

        <FormEngineRoot
          config={TICKET_FORM_CONFIG}
          plugins={[createZodPlugin(stepSchemas)]}
          onSubmit={handleSubmit}
        >
          <div className="mb-5">
            <FormEngineProgress />
          </div>
          <FormEngineStepMeta />
          <div className="mt-4">
            <FormEngineStepCanvas />
          </div>
          <div className="mt-6">
            <FormEngineNavigation
              submitLabel="Submit ticket"
              nextLabel="Continue →"
              backLabel="← Back"
            />
          </div>
        </FormEngineRoot>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main App Component ───────────────────────────────────────────────────────
function HelplyApp() {
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS);
  const [selected, setSelected] = useState<Ticket | null>(TICKETS[0]);
  const [newOpen, setNewOpen] = useState(false);
  const [filter, setFilter] = useState<TicketStatus | "all">("all");

  const filtered =
    filter === "all" ? tickets : tickets.filter((t) => t.status === filter);
  const openCount = tickets.filter((t) => t.status === "open").length;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Left sidebar */}
      <aside className="w-52 border-r border-border flex flex-col p-3 shrink-0">
        <div className="flex items-center gap-2 px-2 py-3 mb-2">
          <div className="size-6 rounded-md bg-primary flex items-center justify-center">
            <IconLifebuoy size={12} className="text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Helply</span>
        </div>
        {[
          {
            id: "all",
            label: "All Tickets",
            icon: IconInbox,
            count: tickets.length,
          },
          {
            id: "open",
            label: "Open",
            icon: IconAlertCircle,
            count: openCount,
          },
          { id: "pending", label: "Pending", icon: IconClock },
          { id: "resolved", label: "Resolved", icon: IconCircleCheck },
        ].map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setFilter(id as TicketStatus | "all")}
            className={`flex items-center justify-between px-2.5 py-2 rounded-md text-sm transition-colors ${
              filter === id
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Icon size={14} />
              {label}
            </span>
            {count !== undefined && (
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </button>
        ))}
        <Separator className="my-3" />
        <button className="flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <IconBook size={14} />
          Knowledge Base
        </button>
        <button className="flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <IconHighlight size={14} />
          Quick Replies
        </button>
        <div className="mt-auto pt-3">
          <div className="flex items-center gap-2 px-2 py-1">
            <Avatar className="size-6">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                JD
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              jamie@acme.com
            </span>
          </div>
        </div>
      </aside>

      {/* Ticket list */}
      <div className="w-72 border-r border-border flex flex-col shrink-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-medium">
            {filtered.length} ticket{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1">
            <CommandPaletteTrigger asChild>
              <Button size="icon" variant="ghost" className="size-7">
                <IconSearch size={13} />
              </Button>
            </CommandPaletteTrigger>
            <TourTrigger asChild>
              <Button size="icon" variant="ghost" className="size-7">
                <IconPlayerPlay size={13} />
              </Button>
            </TourTrigger>
          </div>
        </div>
        <TourAnchor step={1} className="m-2">
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filtered.map((t, i) => (
                <TicketRow
                  key={t.id}
                  ticket={t}
                  index={i}
                  onSelect={() => setSelected(t)}
                  selected={selected?.id === t.id}
                />
              ))}
            </div>
          </ScrollArea>
        </TourAnchor>
        <div className="p-3 border-t border-border">
          <TourAnchor step={2} className="w-full">
            <Button
              className="w-full gap-2 text-sm cursor-pointer"
              onClick={() => setNewOpen(true)}
            >
              <IconPlus size={14} />
              New Ticket
            </Button>
          </TourAnchor>
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Stats topbar */}
        <TourAnchor step={3}>
          <div className="border-b border-border px-5 py-2.5 flex items-center gap-6">
            {[
              { label: "Open", value: openCount, color: "text-blue-400" },
              {
                label: "Avg Response",
                value: "1.4h",
                color: "text-foreground",
              },
              { label: "CSAT", value: "94%", color: "text-green-500" },
              {
                label: "Resolved today",
                value: "12",
                color: "text-foreground",
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${color}`}>
                  {value}
                </span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <Button size="icon" variant="ghost" className="size-7 relative">
                <IconBell size={14} />
                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />
              </Button>
            </div>
          </div>
        </TourAnchor>

        {selected ? (
          <TicketThread ticket={selected} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <IconMessageCircle
              size={40}
              className="text-muted-foreground/30 mb-3"
            />
            <p className="text-sm text-muted-foreground">
              Select a ticket to view the conversation
            </p>
          </div>
        )}
      </div>

      <NewTicketDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        onSubmit={(t) => {
          setTickets((prev) => [t, ...prev]);
          setSelected(t);
          setNewOpen(false);
        }}
      />
    </div>
  );
}

export default function HelplyBlock() {
  return (
    <TourRoot steps={TOUR_STEPS}>
      <CommandPaletteRoot sections={PALETTE_SECTIONS}>
        <HelplyApp />
      </CommandPaletteRoot>
    </TourRoot>
  );
}
