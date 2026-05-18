"use client";

/**
 * Block: Job Application Form
 * Systems used: Form Engine (multi-step) + File Upload + Controls (ChipSelect, RatingField, SelectField)
 * Scenario: A hiring platform's application flow — role fit, experience,
 * CV upload, and final submission. Combines Form Engine + File Upload in one screen.
 *
 * Drop into: app/blocks/job-application/page.tsx
 */

import { useState } from "react";
import { z } from "zod";
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
import { Badge } from "@/components/ui/badge";
import {
  IconBriefcase,
  IconSparkles,
  IconMapPin,
  IconClock,
} from "@tabler/icons-react";
import { toast } from "sonner";

// ─── Options ──────────────────────────────────────────────────────────────────

const locationOptions = [
  {
    group: "Africa",
    options: [
      { value: "lagos", label: "Lagos, Nigeria" },
      { value: "nairobi", label: "Nairobi, Kenya" },
      { value: "accra", label: "Accra, Ghana" },
      { value: "cape-town", label: "Cape Town, South Africa" },
    ],
  },
  {
    group: "Europe",
    options: [
      { value: "london", label: "London, UK" },
      { value: "berlin", label: "Berlin, Germany" },
      { value: "amsterdam", label: "Amsterdam, Netherlands" },
    ],
  },
  {
    group: "Americas",
    options: [
      { value: "nyc", label: "New York, USA" },
      { value: "sf", label: "San Francisco, USA" },
      { value: "toronto", label: "Toronto, Canada" },
    ],
  },
  {
    group: "Remote",
    options: [{ value: "remote", label: "Fully Remote (Anywhere)" }],
  },
];

const workTypeOptions = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
];

// ─── Simulated upload (matches FileUpload onUpload signature) ─────────────────
async function simulateUpload(
  file: File,
  onProgress: (pct: number) => void,
): Promise<{ url: string }> {
  return new Promise((resolve) => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 25 + 5;
      if (p >= 100) {
        clearInterval(iv);
        onProgress(100);
        resolve({ url: URL.createObjectURL(file) });
      } else {
        onProgress(Math.min(p, 99));
      }
    }, 150);
  });
}

// ─── Per‑step Zod schemas for the zod plugin ──────────────────────────────────
const stepSchemas = {
  0: z.object({
    fullName: z.string().min(2, "Full name required"),
    email: z.email("Valid email required"),
    location: z.string().min(1, "Please select your location"),
  }),
  1: z.object({
    workTypes: z.array(z.string()).min(1, "Select at least one work type"),
    yearsExp: z.number().min(1, "Please rate your experience level"),
    coverLetter: z
      .string()
      .min(50, "Cover letter must be at least 50 characters"),
  }),
  2: z.object({
    documents: z.string().min(1, "Please upload your CV"),
  }),
  // Step 2 has no validation (file upload handled separately)
};

// ─── Form Engine configuration ────────────────────────────────────────────────
const APPLICATION_CONFIG: FormEngineConfig = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "personal",
      title: "Tell us about yourself",
      description: "Basic info to get started.",
      fields: [
        {
          key: "fullName",
          variant: "text",
          label: "Full name",
          placeholder: "Jamie Donovan",
          props: {
            className: "rounded-full h-10 px-2",
          },
          required: true,
        },
        {
          key: "email",
          variant: "email",
          label: "Email address",
          placeholder: "jamie@example.com",
          props: {
            className: "rounded-full h-10 px-2",
          },
          required: true,
        },
        // {
        //   key: "location",
        //   variant: "select",
        //   label: "Location",
        //   required: true,
        //   props: {
        //     options: locationOptions,
        //     placeholder: "Where are you based?",
        //     className: "rounded-full h-10! px-4!",
        //   },
        // },
      ],
    },
    {
      id: "experience",
      title: "Your experience",
      description: "Tell us about your background and what you're looking for.",
      fields: [
        // {
        //   key: "workTypes",
        //   variant: "chip-select",
        //   label: "Work arrangement",
        //   required: true,
        //   props: {
        //     options: workTypeOptions,
        //     multiple: true,
        //   },
        // },
        // {
        //   key: "yearsExp",
        //   variant: "rating",
        //   label: "Years of experience",
        //   required: true,
        //   props: {
        //     max: 5,
        //   },
        // },
        {
          key: "coverLetter",
          variant: "textarea",
          label: "Cover letter",
          required: true,
          placeholder: "Tell us why you're a great fit for this role...",
        },
      ],
    },
    {
      id: "documents",
      title: "Upload your CV",
      description: "PDF or Word document, max 10MB.",
      fields: [
        {
          key: "documents",
          variant: "custom",
          render: (props) => (
            <FileUploadRoot
              config={{
                accept: {
                  "application/pdf": [".pdf"],
                  "application/msword": [".doc"],
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    [".docx"],
                },
                auto: true,
                maxSize: 10 * 1024 * 1024,
                maxFiles: 1,
                title: "Drop your CV here",
                description: "PDF or Word · Max 10MB",
              }}
              onUpload={simulateUpload}
              onFilesChange={(files) => {
                const doneFile = files.find((f) => f.status === "done");
                if (doneFile?.url) {
                  props.onChange(doneFile.url);
                } else {
                  props.onChange(""); // clear value when no done file
                }
              }}
            >
              {!props.value && <FileUploadDropzone />}

              <FileUploadList />
            </FileUploadRoot>
          ),
        },
      ], // No fields — custom rendering via stepOverrides
    },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function JobApplicationBlock() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values: Record<string, unknown>) => {
    // In a real app, you'd send the form data + uploaded files to your API
    console.log("Application submitted:", values);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <IconSparkles size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Application submitted!</h1>
          <p className="text-sm text-muted-foreground">
            We'll review your application and get back to you within 5 business
            days.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
            }}
            className="text-xs text-muted-foreground underline underline-offset-4"
          >
            Reset demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <div className="size-7 rounded-md bg-primary" />
        <span className="font-semibold">HireFlow</span>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row mx-auto w-full gap-10 px-16 py-8">
        {/* Job detail sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 sticky top-8">
            <Badge variant="secondary" className="text-xs">
              Now hiring
            </Badge>
            <div>
              <h2 className="font-semibold text-base">
                Senior Frontend Engineer
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">Acme Corp</p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <IconMapPin size={14} />
                <span>Remote · Lagos preferred</span>
              </div>
              <div className="flex items-center gap-2">
                <IconBriefcase size={14} />
                <span>Full-time · $80k–$120k</span>
              </div>
              <div className="flex items-center gap-2">
                <IconClock size={14} />
                <span>Posted 3 days ago</span>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                We're looking for a senior engineer to lead our frontend
                architecture. You'll be working with React, TypeScript, and
                helping define our design system strategy.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["React", "TypeScript", "Next.js", "Design Systems"].map(
                (tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ),
              )}
            </div>
          </div>
        </aside>

        {/* Application form */}

        <FormEngineRoot
          config={APPLICATION_CONFIG}
          plugins={[createZodPlugin(stepSchemas)]}
          onSubmit={handleSubmit}
        >
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-lg font-semibold">Apply for this role</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Takes about 5 minutes. No account required.
              </p>
            </div>
            <FormEngineStepMeta />
            <FormEngineStepCanvas className="max-w-xl py-6" />
            <div className="bg-card p-6 md:px-16 border-t border-border absolute inset-x-0 bottom-0">
              <FormEngineNavigation
              // submitLabel="Submit application"
              // nextLabel="Continue"
              // backLabel="Back"
              // styles={{
              //   nextBtn: "p-5 rounded-full",
              //   backBtn: "p-5 rounded-full",
              // }}
              />
            </div>
          </div>
        </FormEngineRoot>
      </div>
    </div>
  );
}
