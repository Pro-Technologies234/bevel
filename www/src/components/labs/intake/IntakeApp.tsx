"use client";

import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import {
  FormEngine,
  FormEngineRoot,
  FormEngineProgress,
  FormEngineStepMeta,
  FormEngineStepCanvas,
  FormEngineNavigation,
  createZodPlugin,
} from "@/components/bevelui/form-engine";
import { Button } from "@/components/ui/button";
import {
  IconBoltFilled,
  IconCheck,
  IconBriefcase,
  IconUser,
  IconFile,
  IconMail,
} from "@tabler/icons-react";
import type { FormEngineConfig } from "@/components/bevelui/form-engine";
import { Badge } from "@/components/ui/badge";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const schemas = {
  0: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(7, "Enter a valid phone number"),
    location: z.string().min(2),
  }),
  1: z.object({
    role: z.enum(["frontend", "fullstack", "backend", "design", "product"]),
    experience: z.enum(["0-1", "2-4", "5-8", "9+"]),
    availability: z.enum(["immediate", "2weeks", "1month", "negotiable"]),
  }),
  2: z.object({
    portfolio: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    github: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    linkedin: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    coverLetter: z.string().min(50, "At least 50 characters"),
  }),
};

const config: FormEngineConfig = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "personal",
      title: "Personal information",
      description: "Your basic contact details.",
      fields: [
        {
          key: "fullName",
          variant: "text",
          label: "Full name",
          placeholder: "Alex Johnson",
          required: true,
        },
        {
          key: "email",
          variant: "email",
          label: "Email address",
          placeholder: "alex@example.com",
          required: true,
        },
        {
          key: "phone",
          variant: "text",
          label: "Phone number",
          placeholder: "+1 (555) 000-0000",
          required: true,
        },
        {
          key: "location",
          variant: "text",
          label: "Location",
          placeholder: "San Francisco, CA",
          required: true,
        },
      ],
    },
    {
      id: "experience",
      title: "Your experience",
      description: "Tell us about your background.",
      fields: [
        {
          key: "role",
          variant: "card-select",
          label: "Primary role",
          required: true,
          props: {
            columns: 3,
            options: [
              {
                value: "frontend",
                label: "Frontend",
                description: "React, Vue, CSS",
              },
              {
                value: "fullstack",
                label: "Full-stack",
                description: "Frontend + backend",
              },
              {
                value: "backend",
                label: "Backend",
                description: "APIs, databases",
              },
              { value: "design", label: "Design", description: "UI/UX design" },
              {
                value: "product",
                label: "Product",
                description: "PM / strategy",
              },
            ],
          },
        },
        {
          key: "experience",
          variant: "chip-select",
          label: "Years of experience",
          required: true,
          props: {
            options: [
              { value: "0-1", label: "0–1 years" },
              { value: "2-4", label: "2–4 years" },
              { value: "5-8", label: "5–8 years" },
              { value: "9+", label: "9+ years" },
            ],
          },
        },
        {
          key: "availability",
          variant: "chip-select",
          label: "Availability",
          required: true,
          props: {
            options: [
              { value: "immediate", label: "Immediate" },
              { value: "2weeks", label: "2 weeks" },
              { value: "1month", label: "1 month" },
              { value: "negotiable", label: "Negotiable" },
            ],
          },
        },
      ],
    },
    {
      id: "portfolio",
      title: "Portfolio & cover letter",
      description: "Share your work and tell us why you're a good fit.",
      fields: [
        {
          key: "portfolio",
          variant: "text",
          label: "Portfolio URL",
          placeholder: "https://yourportfolio.com",
        },
        {
          key: "github",
          variant: "text",
          label: "GitHub",
          placeholder: "https://github.com/username",
        },
        {
          key: "linkedin",
          variant: "text",
          label: "LinkedIn",
          placeholder: "https://linkedin.com/in/username",
        },
        {
          key: "coverLetter",
          variant: "textarea",
          label: "Cover letter",
          placeholder: "Tell us about yourself and why you'd be a great fit...",
          required: true,
        },
      ],
    },
  ],
  // onSubmit: async () => {
  //   await new Promise((r) => setTimeout(r, 1000));
  // },
};

// ─── Submitted state ──────────────────────────────────────────────────────────

function SubmittedState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-5 py-16 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <IconCheck size={28} strokeWidth={2} className="text-primary" />
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-2">
          Application submitted
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          We've received your application and will be in touch within 3–5
          business days.
        </p>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <IconMail size={13} />
          Confirmation sent to your email
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onReset}>
        Submit another application
      </Button>
    </motion.div>
  );
}

// ─── Main Intake app ──────────────────────────────────────────────────────────

export default function IntakeApp() {
  const [submitted, setSubmitted] = useState(false);

  const submittingConfig: FormEngineConfig = {
    ...config,
  };

  return (
    <div className="h-full flex overflow-hidden rounded-2xl border border-border bg-background">
      {/* Left panel — branding */}
      <div
        className="hidden md:flex w-72 shrink-0 flex-col justify-between p-8"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <IconBoltFilled size={14} color="#0a0a0a" />
            </div>
            <span className="text-sm font-bold text-white">Bevel UI</span>
          </div>

          <div className="mb-8">
            <Badge
              className="mb-4 text-[10px] px-2 py-1"
              style={{
                background: "rgba(194,241,60,.12)",
                color: "#c2f13c",
                border: "1px solid rgba(194,241,60,.2)",
              }}
            >
              <IconBriefcase size={10} className="mr-1" /> Now hiring
            </Badge>
            <h2 className="text-2xl font-black text-white leading-tight mb-3">
              Join the team building the future of React UI.
            </h2>
            <p className="text-sm text-white/40 leading-relaxed font-light">
              We're a small team shipping high-quality systems for developers.
              Remote-first, async-friendly, high-ownership.
            </p>
          </div>

          {/* Values */}
          {[
            {
              icon: IconUser,
              text: "High ownership — you'll drive whole features",
            },
            {
              icon: IconFile,
              text: "Open source — your work is seen by thousands",
            },
            {
              icon: IconBoltFilled,
              text: "Fast-paced — we ship early and often",
            },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3 mb-4">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <item.icon size={12} style={{ color: "#c2f13c" }} />
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-white/20">© 2025 Bevel UI</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <AnimatePresence mode="wait">
            {submitted ? (
              <SubmittedState key="done" onReset={() => setSubmitted(false)} />
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FormEngine
                  config={submittingConfig}
                  plugins={[createZodPlugin(schemas)]}
                  navigationProps={{
                    // submitLabel: "Submit application",
                    // nextLabel: "Continue →",
                    layout: "split",
                  }}
                  onSubmit={async () => {
                    await new Promise((r) => setTimeout(r, 1000));
                    setSubmitted(true);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
