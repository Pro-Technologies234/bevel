"use client";

import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import { FormEngine, createZodPlugin } from "@/components/bevelui/form-engine";
import { FileUploadRoot } from "@/components/bevelui/file-upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconBoltFilled,
  IconCheck,
  IconPackage,
  IconUpload,
  IconArrowRight,
  IconFile,
  IconDownload,
} from "@tabler/icons-react";
import type { FormEngineConfig } from "@/components/bevelui/form-engine";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schemas = {
  0: z.object({
    projectName: z.string().min(2, "Project name is required"),
    clientName: z.string().min(2, "Client name is required"),
    clientEmail: z.string().email(),
    deadline: z.string().min(1, "Set a delivery date"),
  }),
  1: z.object({
    description: z.string().min(30, "At least 30 characters — be specific"),
    deliverables: z.string().min(10, "List what you're delivering"),
    revisions: z.enum(["1", "2", "3", "unlimited"]),
  }),
};

const config: FormEngineConfig = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "project",
      title: "Project details",
      description: "Basic information about this handoff.",
      fields: [
        {
          key: "projectName",
          variant: "text",
          label: "Project name",
          placeholder: "Bevel UI Redesign",
          required: true,
        },
        {
          key: "clientName",
          variant: "text",
          label: "Client name",
          placeholder: "Acme Corp",
          required: true,
        },
        {
          key: "clientEmail",
          variant: "email",
          label: "Client email",
          placeholder: "client@acme.com",
          required: true,
        },
        {
          key: "deadline",
          variant: "date",
          label: "Delivery date",
          required: true,
        },
      ],
    },
    {
      id: "scope",
      title: "Scope & deliverables",
      description: "What exactly are you handing over?",
      fields: [
        {
          key: "description",
          variant: "textarea",
          label: "Project description",
          placeholder:
            "Describe what was built and any important context the client should know...",
          required: true,
        },
        {
          key: "deliverables",
          variant: "textarea",
          label: "What's included",
          placeholder:
            "e.g. Figma source files, exported assets, component library, deployment guide...",
          required: true,
        },
        {
          key: "revisions",
          variant: "chip-select",
          label: "Included revisions",
          required: true,
          props: {
            options: [
              { value: "1", label: "1 revision" },
              { value: "2", label: "2 revisions" },
              { value: "3", label: "3 revisions" },
              { value: "unlimited", label: "Unlimited" },
            ],
          },
        },
      ],
    },
  ],
  // onSubmit: async () => {
  //   await new Promise((r) => setTimeout(r, 600));
  // },
};

async function simulateUpload(file: File, onProgress: (pct: number) => void) {
  await new Promise<void>((resolve) => {
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 20 + 5;
      if (p >= 100) {
        onProgress(100);
        clearInterval(t);
        resolve();
      } else onProgress(Math.round(p));
    }, 100);
  });
  return { url: URL.createObjectURL(file) };
}

// ─── Steps ────────────────────────────────────────────────────────────────────

type Step = "brief" | "files" | "done";

const STEP_LABELS: Record<Step, string> = {
  brief: "Project brief",
  files: "Upload assets",
  done: "Handoff ready",
};

// ─── Handoff receipt ──────────────────────────────────────────────────────────

function HandoffReceipt({
  values,
  fileCount,
  onReset,
}: {
  values: Record<string, string>;
  fileCount: number;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 py-8 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <IconCheck size={28} strokeWidth={2} className="text-primary" />
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight mb-1">
          Handoff package ready
        </h2>
        <p className="text-sm text-muted-foreground">
          A delivery link has been sent to{" "}
          <span className="font-medium text-foreground">
            {values.clientEmail || "the client"}
          </span>
        </p>
      </div>

      {/* Receipt card */}
      <div className="w-full max-w-sm p-5 rounded-2xl border border-border bg-muted/10 text-left space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div>
            <p className="text-sm font-semibold">
              {values.projectName || "Project"}
            </p>
            <p className="text-xs text-muted-foreground">
              {values.clientName || "Client"}
            </p>
          </div>
          <Badge
            className="text-[10px]"
            style={{
              background: "rgba(34,197,94,.15)",
              color: "#16a34a",
              border: "none",
            }}
          >
            Delivered
          </Badge>
        </div>

        {[
          {
            label: "Files delivered",
            value: `${fileCount} asset${fileCount !== 1 ? "s" : ""}`,
          },
          {
            label: "Revisions included",
            value:
              values.revisions === "unlimited"
                ? "Unlimited"
                : `${values.revisions} revision${values.revisions !== "1" ? "s" : ""}`,
          },
          { label: "Delivery date", value: values.deadline || "—" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{row.label}</span>
            <span className="text-xs font-medium">{row.value}</span>
          </div>
        ))}

        <div className="pt-3 border-t border-border/60">
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-1.5 text-xs"
          >
            <IconDownload size={12} />
            Download receipt PDF
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="text-muted-foreground"
      >
        Start new handoff
      </Button>
    </motion.div>
  );
}

// ─── Main Briefcase app ───────────────────────────────────────────────────────

export default function BriefcaseApp() {
  const [step, setStep] = useState<Step>("brief");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [fileCount, setFileCount] = useState(0);

  const steps: Step[] = ["brief", "files", "done"];
  const stepIdx = steps.indexOf(step);

  const briefConfig: FormEngineConfig = {
    ...config,
  };

  function reset() {
    setStep("brief");
    setFormValues({});
    setFileCount(0);
  }

  return (
    <div className="h-full rounded-2xl border border-border bg-background overflow-hidden flex flex-col">
      {/* Progress header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
            <IconPackage size={12} color="#0a0a0a" />
          </div>
          <span className="text-sm font-bold">Briefcase</span>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1.5 ml-4">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <div
                className={`flex items-center gap-1.5 text-xs ${i <= stepIdx ? "text-foreground" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i < stepIdx ? "bg-primary text-primary-foreground" : i === stepIdx ? "border-2 border-primary text-primary" : "border border-border text-muted-foreground"}`}
                >
                  {i < stepIdx ? (
                    <IconCheck size={10} strokeWidth={3} />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="hidden sm:inline">{STEP_LABELS[s]}</span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-px ${i < stepIdx ? "bg-primary" : "bg-border"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {step === "brief" && (
            <motion.div
              key="brief"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FormEngine
                config={briefConfig}
                plugins={[createZodPlugin(schemas)]}
                actionsProps={{
                  submitLabel: "Continue to files →",
                  nextLabel: "Next →",
                }}
                onSubmit={async (values) => {
                  await new Promise((r) => setTimeout(r, 600));
                  setFormValues(values as Record<string, string>);
                  setStep("files");
                }}
              />
            </motion.div>
          )}

          {step === "files" && (
            <motion.div
              key="files"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-5"
            >
              <div>
                <h2 className="text-lg font-bold tracking-tight mb-1">
                  Upload deliverables
                </h2>
                <p className="text-sm text-muted-foreground">
                  Add the files for{" "}
                  <span className="font-medium text-foreground">
                    {formValues.clientName || "your client"}
                  </span>
                  . All files will be packaged into a secure delivery link.
                </p>
              </div>

              <FileUploadRoot
                config={{
                  multiple: true,
                  maxFiles: 50,
                  maxSize: 200 * 1024 * 1024,
                  title: "Drop deliverables here",
                  description:
                    "Designs, exports, source files — up to 200MB each",
                }}
                onUpload={simulateUpload}
                onComplete={(files) => setFileCount(files.length)}
              />

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep("brief")}
                >
                  ← Back
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setStep("done")}
                  disabled={fileCount === 0}
                >
                  <IconUpload size={13} />
                  Send handoff (
                  {fileCount > 0
                    ? `${fileCount} file${fileCount !== 1 ? "s" : ""}`
                    : "no files yet"}
                  )
                </Button>
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <HandoffReceipt
              key="done"
              values={formValues}
              fileCount={fileCount}
              onReset={reset}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
