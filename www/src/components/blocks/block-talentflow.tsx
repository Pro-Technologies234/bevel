"use client";

/**
 * BLOCK: TalentFlow — Hiring Platform
 * A complete job board + multi-step application flow.
 * Bevel: Form Engine (application) + File Upload (CV/portfolio) + Command Palette (search jobs)
 * shadcn: Card, Badge, Button, Avatar, Dialog, Progress, ScrollArea, Separator, Tabs
 * motion/react: job card entrance, application step transitions, success animation
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// ─── Icons ────────────────────────────────────────────────────────────────────
import {
  IconSearch,
  IconMapPin,
  IconBriefcase,
  IconClock,
  IconBookmark,
  IconBookmarkFilled,
  IconChevronRight,
  IconSparkles,
  IconCircleCheck,
  IconUsers,
  IconCurrencyDollar,
  IconArrowRight,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: "full-time" | "contract" | "remote";
  tags: string[];
  posted: string;
  applicants: number;
  featured?: boolean;
  logo?: string;
  description: string;
};

// ─── Seed data ────────────────────────────────────────────────────────────────
const JOBS: Job[] = [
  {
    id: "j1",
    title: "Senior Frontend Engineer",
    company: "Linear",
    location: "San Francisco / Remote",
    salary: "$160k–$200k",
    type: "remote",
    tags: ["React", "TypeScript", "Design Systems"],
    posted: "Today",
    applicants: 43,
    featured: true,
    description:
      "Join Linear's small, focused engineering team. You'll work on our core product and help define the future of project management tools.",
  },
  {
    id: "j2",
    title: "Product Designer",
    company: "Vercel",
    location: "Remote",
    salary: "$140k–$180k",
    type: "remote",
    tags: ["Figma", "UI/UX", "Design Tokens"],
    posted: "Today",
    applicants: 89,
    description:
      "Shape the design of the fastest frontend platform in the world. You'll work alongside engineers and PMs to ship polished, fast product.",
  },
  {
    id: "j3",
    title: "Full-Stack Engineer",
    company: "Supabase",
    location: "Remote",
    salary: "$120k–$160k",
    type: "remote",
    tags: ["Next.js", "PostgreSQL", "TypeScript"],
    posted: "Yesterday",
    applicants: 112,
    description:
      "Build and scale open source infrastructure used by hundreds of thousands of developers. Own entire features end-to-end.",
  },
  {
    id: "j4",
    title: "DevRel Engineer",
    company: "Resend",
    location: "New York / Remote",
    salary: "$110k–$150k",
    type: "full-time",
    tags: ["Content", "APIs", "Developer Experience"],
    posted: "2d ago",
    applicants: 37,
    description:
      "Help developers succeed with Resend. Create demos, write guides, speak at conferences, and shape how the world learns to send email.",
  },
  {
    id: "j5",
    title: "Staff Backend Engineer",
    company: "PlanetScale",
    location: "Remote",
    salary: "$180k–$240k",
    type: "remote",
    tags: ["Go", "MySQL", "Distributed Systems"],
    posted: "3d ago",
    applicants: 28,
    featured: true,
    description:
      "Scale database infrastructure serving billions of queries per day. Work on hard distributed systems problems with a world-class team.",
  },
];

// ─── Command Palette Data ─────────────────────────────────────────────────────
const PALETTE_SECTIONS: CommandPaletteSection[] = [
  {
    id: "jobs",
    title: "Featured Jobs",
    items: JOBS.filter((j) => j.featured).map((j) => ({
      id: j.id,
      title: j.title,
      subtitle: `${j.company} · ${j.location} · ${j.salary}`,
      meta: j.type,
    })),
  },
  {
    id: "search",
    title: "Search by skill",
    items: ["React", "TypeScript", "Design", "Backend", "DevRel"].map((s) => ({
      id: s,
      title: `Search "${s}"`,
      icon: <IconSearch size={16} />,
    })),
  },
];

// ─── Location options for select field ────────────────────────────────────────
const locationOptions = [
  {
    group: "United States",
    options: [
      { value: "sf", label: "San Francisco, CA" },
      { value: "nyc", label: "New York, NY" },
      { value: "remote-us", label: "Remote (US only)" },
    ],
  },
  {
    group: "Global Remote",
    options: [{ value: "remote", label: "Fully Remote (Worldwide)" }],
  },
  {
    group: "Africa",
    options: [
      { value: "lagos", label: "Lagos, Nigeria" },
      { value: "nairobi", label: "Nairobi, Kenya" },
    ],
  },
];

// ─── Simulated upload function (matches FileUpload onUpload signature) ────────
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

// ─── Job Card Component ───────────────────────────────────────────────────────
function JobCard({
  job,
  index,
  onApply,
  onSelect,
  selected,
}: {
  job: Job;
  index: number;
  onApply: (j: Job) => void;
  onSelect: (j: Job) => void;
  selected: boolean;
}) {
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Card
        onClick={() => onSelect(job)}
        className={`cursor-pointer transition-all p-4 hover:shadow-md hover:shadow-primary/5 ${
          selected ? "border-primary/30 bg-primary/5" : "hover:border-border"
        } ${job.featured ? "ring-1 ring-primary/20" : ""}`}
      >
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0 text-sm font-bold">
            {job.company[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight truncate">
                  {job.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {job.company}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSaved(!saved);
                }}
                className="shrink-0 p-1 rounded-md hover:bg-muted transition-colors"
              >
                {saved ? (
                  <IconBookmarkFilled size={14} className="text-primary" />
                ) : (
                  <IconBookmark size={14} className="text-muted-foreground" />
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <IconMapPin size={10} />
                {job.location}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <IconCurrencyDollar size={10} />
                {job.salary}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <IconUsers size={10} />
                {job.applicants} applicants
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {job.featured && (
                <Badge className="text-[9px] py-0 bg-primary/10 text-primary border-primary/20">
                  Featured
                </Badge>
              )}
              <Badge variant="secondary" className="text-[9px] py-0 capitalize">
                {job.type}
              </Badge>
              {job.tags.slice(0, 2).map((t) => (
                <Badge key={t} variant="outline" className="text-[9px] py-0">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Application Dialog with Form Engine ──────────────────────────────────────
// Per‑step Zod schemas for the zod plugin
const stepSchemas = {
  0: z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Valid email required"),
    location: z.string().min(1, "Location is required"),
    experience: z.string().min(1, "Experience level is required"),
    skills: z.array(z.string()).optional(),
  }),
  1: z.object({
    coverLetter: z.string().min(50, "Write at least 50 characters"),
    availability: z.array(z.string()).optional(),
  }),
  // Step 2 is file upload – no validation needed
};

const APPLICATION_CONFIG: FormEngineConfig = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "personal",
      title: "Personal info",
      description: "Basic details for your application.",
      fields: [
        {
          key: "fullName",
          variant: "text",
          label: "Full name",
          placeholder: "Jamie Donovan",
          required: true,
        },
        {
          key: "email",
          variant: "email",
          label: "Email",
          placeholder: "jamie@example.com",
          required: true,
        },
        {
          key: "location",
          variant: "select",
          label: "Location",
          required: true,
          props: {
            options: locationOptions,
            placeholder: "Where are you based?",
          },
        },
        {
          key: "experience",
          variant: "card-select",
          label: "Experience level",
          required: true,
          props: {
            options: [
              { value: "entry", label: "Junior", description: "0–2 years" },
              { value: "mid", label: "Mid-level", description: "2–5 years" },
              { value: "senior", label: "Senior", description: "5–8 years" },
              { value: "staff", label: "Staff+", description: "8+ years" },
            ],
            layout: "grid",
            columns: 4,
          },
        },
        {
          key: "skills",
          variant: "tag-input",
          label: "Key skills",
          props: {
            placeholder: "React, TypeScript, Node.js…",
          },
        },
      ],
    },
    {
      id: "motivation",
      title: "Your motivation",
      description: "Tell us why you're the right fit.",
      fields: [
        {
          key: "coverLetter",
          variant: "textarea",
          label: "Cover letter",
          required: true,
          placeholder:
            "Why do you want to work here? What makes you the right fit?",
        },
        {
          key: "availability",
          variant: "chip-select",
          label: "Availability",
          props: {
            options: [
              "Immediately",
              "2 weeks",
              "1 month",
              "3 months",
              "Open to discuss",
            ].map((v) => ({ value: v, label: v })),
            multiple: true,
          },
        },
      ],
    },
    {
      id: "documents",
      title: "Upload documents",
      description: "CV, portfolio, or work samples.",
      fields: [], // No fields – we'll render custom content in layout
    },
  ],
};

function ApplicationDialog({
  job,
  open,
  onOpenChange,
}: {
  job: Job | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values: Record<string, unknown>) => {
    // In a real app, you'd send the form data + uploaded files to your API
    console.log("Application submitted:", values);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Dialog
        open={open}
        onOpenChange={(v) => {
          onOpenChange(v);
          if (!v) setSubmitted(false);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <div className="text-center py-8 space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto"
            >
              <IconSparkles size={28} className="text-primary" />
            </motion.div>
            <h3 className="font-semibold text-lg">Application sent!</h3>
            <p className="text-sm text-muted-foreground">
              The team at <strong>{job?.company}</strong> will review your
              application. You'll hear back within 5 business days.
            </p>
            <Button
              onClick={() => {
                onOpenChange(false);
                setSubmitted(false);
              }}
            >
              Browse more jobs
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply — {job?.title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {job?.company} · {job?.location}
          </p>
        </DialogHeader>

        <FormEngineRoot
          config={APPLICATION_CONFIG}
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

          {/* Custom step 2 rendering: file upload */}
          <FormEngineStepCanvas
          // stepOverrides={{
          //   documents: () => (
          //     <FileUploadRoot
          //       config={{
          //         accept: { "application/pdf": [".pdf"], "image/*": [] },
          //         maxSize: 10 * 1024 * 1024,
          //         multiple: true,
          //         title: "Drop your CV here",
          //         description: "PDF up to 10MB",
          //       }}
          //       onUpload={simulateUpload}
          //     >
          //       <FileUploadDropzone />
          //       <div className="mt-3">
          //         <FileUploadList />
          //       </div>
          //     </FileUploadRoot>
          //   ),
          // }}
          />

          <div className="mt-6">
            <FormEngineNavigation
            // submitLabel="Submit application →"
            // nextLabel="Continue →"
            // backLabel="← Back"
            />
          </div>
        </FormEngineRoot>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TalentFlowBlock() {
  const [selected, setSelected] = useState<Job>(JOBS[0]);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [search, setSearch] = useState("");

  const filtered = JOBS.filter(
    (j) =>
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <CommandPaletteRoot sections={PALETTE_SECTIONS}>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        {/* Left: Job list */}
        <div className="w-80 border-r border-border flex flex-col shrink-0">
          <div className="p-4 border-b border-border space-y-3">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-primary flex items-center justify-center">
                <IconBriefcase size={12} className="text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm">TalentFlow</span>
              <Badge variant="secondary" className="ml-auto text-[9px]">
                {JOBS.length} jobs
              </Badge>
            </div>
            <CommandPaletteTrigger asChild>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 cursor-pointer hover:bg-muted/80 transition-colors">
                <IconSearch size={13} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Search jobs… ⌘K
                </span>
              </div>
            </CommandPaletteTrigger>
            <div className="flex gap-1.5">
              {["All", "Remote", "Featured"].map((f, i) => (
                <button
                  key={f}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    i === 0
                      ? "bg-foreground text-background font-medium"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {filtered.map((job, i) => (
                <JobCard
                  key={job.id}
                  job={job}
                  index={i}
                  onApply={setApplyJob}
                  onSelect={setSelected}
                  selected={selected.id === job.id}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right: Job detail */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex-1 overflow-y-auto"
            >
              <div className="p-8 max-w-2xl">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="size-14 rounded-2xl bg-muted flex items-center justify-center text-xl font-bold shrink-0">
                    {selected.company[0]}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-semibold">{selected.title}</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {selected.company}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <IconMapPin size={12} />
                        {selected.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconCurrencyDollar size={12} />
                        {selected.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconUsers size={12} />
                        {selected.applicants} applicants
                      </span>
                      <span className="flex items-center gap-1">
                        <IconClock size={12} />
                        Posted {selected.posted}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="bg-primary/10 text-primary border-primary/20 capitalize">
                    {selected.type}
                  </Badge>
                  {selected.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>

                <Separator className="mb-6" />

                {/* Description */}
                <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
                  <p>{selected.description}</p>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">
                      What you'll do
                    </h3>
                    <ul className="space-y-1.5 list-none">
                      {[
                        "Ship features that millions of developers use daily",
                        "Collaborate closely with design to build pixel-perfect UIs",
                        "Own entire product areas end-to-end",
                        "Write code that you're proud of",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <IconCircleCheck
                            size={14}
                            className="text-primary mt-0.5 shrink-0"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">
                      What we're looking for
                    </h3>
                    <ul className="space-y-1.5 list-none">
                      {[
                        "Strong React and TypeScript skills",
                        "Eye for design and attention to UX detail",
                        "Experience shipping production systems at scale",
                        "Strong written and async communication",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <IconCircleCheck
                            size={14}
                            className="text-primary mt-0.5 shrink-0"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex gap-3">
                  <Button
                    className="gap-2 cursor-pointer flex-1"
                    onClick={() => setApplyJob(selected)}
                  >
                    Apply now <IconArrowRight size={14} />
                  </Button>
                  <Button variant="outline" className="gap-2 cursor-pointer">
                    <IconBookmark size={14} />
                    Save
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ApplicationDialog
        job={applyJob}
        open={!!applyJob}
        onOpenChange={(v) => !v && setApplyJob(null)}
      />
    </CommandPaletteRoot>
  );
}
