"use client";

import { useState } from "react";
import { FormEngine } from "@/registry/engines/form-engine";
import type { FormConfig } from "@/registry/engines/form-engine/types";
import {
  IconForms,
  IconCheck,
  IconBrandReact,
  IconBrandVue,
  IconBrandAngular,
  IconBrandNextjs,
  IconBrandSvelte,
  IconRocket,
  IconBuildingStore,
  IconCode,
  IconPalette,
  IconChartBar,
  IconBriefcase,
  IconBuildingBank,
  IconUsers,
  IconShield,
  IconDeviceLaptop,
  IconBolt,
} from "@tabler/icons-react";
import { SectionHeading, ExampleCard } from "@/components/showcase/ui";
import { FormEngineRoot } from "@/registry/engines/form-engine/components/form-engin-root";
import { StepProgress } from "@/registry/engines/form-engine/components/step-progress";
import { StepMeta } from "@/registry/engines/form-engine/components/step-meta";
import { StepCanvas } from "@/registry/engines/form-engine/components/step-canvas";
import { StepActions } from "@/registry/engines/form-engine/components/step-actions";

// =============================================================================
// CONFIG 1 — Developer Onboarding (all-in-one <FormEngine />)
// 3 steps: identity → stack → preferences
// Showcases: text, email, card-select, chip-select, tag-input, rating, checkbox
// =============================================================================

type OnboardingForm = {
  name: string;
  email: string;
  role: string;
  framework: string;
  skills: string[];
  experience: number;
  newsletter: boolean;
};

const onboardingConfig: FormConfig<OnboardingForm> = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "identity",
      title: "Let's get you set up",
      description:
        "Tell us a bit about yourself so we can personalise your workspace.",
      fields: [
        {
          key: "name",
          variant: "text",
          label: "Full name",
          placeholder: "Ada Lovelace",
          required: true,
        },
        {
          key: "email",
          variant: "email",
          label: "Work email",
          placeholder: "ada@company.io",
          required: true,
        },
        {
          key: "role",
          variant: "chip-select",
          label: "Your role",
          props: {
            options: [
              { value: "founder", label: "Founder" },
              { value: "engineer", label: "Engineer" },
              { value: "designer", label: "Designer" },
              { value: "pm", label: "Product Manager" },
              { value: "devrel", label: "DevRel" },
            ],
          },
        },
      ],
    },
    {
      id: "stack",
      title: "What are you building with?",
      description:
        "Choose the technologies that best describe your current stack.",
      fields: [
        {
          key: "framework",
          variant: "card-select",
          label: "Primary framework",
          props: {
            layout: "grid",
            columns: 3,
            size: "sm",
            options: [
              { value: "react", label: "React", icon: IconBrandReact },
              { value: "nextjs", label: "Next.js", icon: IconBrandNextjs },
              { value: "vue", label: "Vue", icon: IconBrandVue },
              { value: "angular", label: "Angular", icon: IconBrandAngular },
              { value: "svelte", label: "Svelte", icon: IconBrandSvelte },
              { value: "other", label: "Other", icon: IconCode },
            ],
          },
        },
        {
          key: "skills",
          variant: "tag-input",
          label: "Skills & technologies",
          placeholder: "TypeScript, Docker, GraphQL…",
          props: {
            variant: "secondary",
            size: "md",
          },
        },
      ],
    },
    {
      id: "preferences",
      title: "Almost done!",
      description:
        "Rate your experience level and choose how you'd like to hear from us.",
      fields: [
        {
          key: "experience",
          variant: "rating",
          label: "Years of experience (1 = beginner, 5 = expert)",
          props: {
            max: 5,
            accentColor: "#6366f1",
            size: 28,
          },
        },
        {
          key: "newsletter",
          variant: "checkbox",
          label: "Send me product updates and release notes",
        },
      ],
    },
  ],
  onSubmit: async (values) => {
    // In a real app: await api.post('/onboarding', values)
    console.log("Onboarding submitted:", values);
  },
};

// =============================================================================
// CONFIG 2 — Job Application (composable <FormEngineRoot />)
// 3 steps: personal → experience → availability
// Showcases: text, email, phone, select, textarea, date, chip-select, checkbox
// =============================================================================

type ApplicationForm = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  yearsExp: string;
  bio: string;
  availability: string;
  remote: boolean;
  terms: boolean;
};

const applicationConfig: FormConfig<ApplicationForm> = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "personal",
      title: "Personal details",
      description: "We use this information to get in touch with you.",
      fields: [
        {
          key: "fullName",
          variant: "text",
          label: "Full name",
          placeholder: "Ngozi Adeyemi",
          required: true,
        },
        {
          key: "email",
          variant: "email",
          label: "Email address",
          placeholder: "ngozi@example.com",
          required: true,
        },
        {
          key: "phone",
          variant: "phone",
          label: "Phone number",
          placeholder: "+234 800 000 0000",
        },
        {
          key: "location",
          variant: "select",
          label: "Location",
          placeholder: "Select your country",
          props: {
            options: [
              { value: "ng", label: "Nigeria" },
              { value: "gh", label: "Ghana" },
              { value: "ke", label: "Kenya" },
              { value: "za", label: "South Africa" },
              { value: "eg", label: "Egypt" },
              { value: "other", label: "Other" },
            ],
          },
        },
      ],
    },
    {
      id: "experience",
      title: "Your experience",
      description:
        "Help us understand your background and what you're looking for.",
      fields: [
        {
          key: "department",
          variant: "chip-select",
          label: "Applying for",
          props: {
            options: [
              { value: "eng", label: "Engineering", icon: IconCode },
              { value: "design", label: "Design", icon: IconPalette },
              { value: "product", label: "Product", icon: IconChartBar },
              { value: "sales", label: "Sales", icon: IconBriefcase },
              { value: "ops", label: "Operations", icon: IconBolt },
            ],
          },
        },
        {
          key: "yearsExp",
          variant: "select",
          label: "Years of experience",
          placeholder: "Select range",
          props: {
            options: [
              { value: "0-1", label: "Less than 1 year" },
              { value: "1-3", label: "1–3 years" },
              { value: "3-5", label: "3–5 years" },
              { value: "5-10", label: "5–10 years" },
              { value: "10+", label: "10+ years" },
            ],
          },
        },
        {
          key: "bio",
          variant: "textarea",
          label: "Cover note",
          placeholder:
            "Tell us why you'd be a great fit and what you're most proud of…",
        },
      ],
    },
    {
      id: "availability",
      title: "Availability & consent",
      description:
        "Last step — when can you start, and a couple of quick preferences.",
      fields: [
        {
          key: "availability",
          variant: "date",
          label: "Earliest start date",
        },
        {
          key: "remote",
          variant: "checkbox",
          label: "I'm open to fully remote work",
        },
        {
          key: "terms",
          variant: "checkbox",
          label: "I confirm the information above is accurate",
          required: true,
        },
      ],
    },
  ],
  onSubmit: async (values) => {
    console.log("Application submitted:", values);
  },
};

// =============================================================================
// CONFIG 3 — Project Setup (composable, custom StepActions layout)
// 2 steps: type → features
// Showcases FormEngineRoot with split layout and custom labels
// =============================================================================

type ProjectForm = {
  projectType: string;
  projectName: string;
  features: string[];
};

const projectConfig: FormConfig<ProjectForm> = {
  mode: "multi-step",
  steps: [
    {
      id: "type",
      title: "What are you building?",
      description: "Pick the project type that best matches your use case.",
      fields: [
        {
          key: "projectType",
          variant: "card-select",
          label: "Project type",
          props: {
            layout: "grid",
            columns: 3,
            size: "sm",
            options: [
              {
                value: "saas",
                label: "SaaS",
                icon: IconRocket,
                description: "Multi-tenant app",
              },
              {
                value: "ecommerce",
                label: "E-Commerce",
                icon: IconBuildingStore,
                description: "Storefront & checkout",
              },
              {
                value: "dashboard",
                label: "Dashboard",
                icon: IconChartBar,
                description: "Analytics & ops tools",
              },
              {
                value: "api",
                label: "API",
                icon: IconCode,
                description: "Backend service",
              },
              {
                value: "enterprise",
                label: "Enterprise",
                icon: IconBuildingBank,
                description: "SSO & large-scale",
                badge: "Custom",
              },
              {
                value: "internal",
                label: "Internal",
                icon: IconDeviceLaptop,
                description: "Internal tooling",
              },
            ],
          },
        },
        {
          key: "projectName",
          variant: "text",
          label: "Project name",
          placeholder: "my-awesome-project",
          required: true,
        },
      ],
    },
    {
      id: "features",
      title: "Pick your features",
      description: "Select the modules to scaffold into your project.",
      fields: [
        {
          key: "features",
          variant: "tag-input",
          label: "Feature modules",
          placeholder: "auth, billing, analytics…",
          props: {
            variant: "secondary",
            size: "md",
            max: 8,
          },
        },
      ],
    },
  ],
  onSubmit: async (values) => {
    console.log("Project created:", values);
  },
};

// =============================================================================
// SUBMITTED STATE
// =============================================================================

function SubmittedBanner({
  label,
  onReset,
}: {
  label: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
      <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center">
        <IconCheck size={20} className="text-emerald-400" />
      </div>
      <p className="text-sm font-medium text-zinc-200">{label}</p>
      <button
        onClick={onReset}
        className="text-xs text-zinc-500 underline underline-offset-2 hover:text-zinc-300 transition-colors cursor-pointer"
      >
        Reset form
      </button>
    </div>
  );
}

// =============================================================================
// WRAPPERS — each example is isolated so submit state is independent
// =============================================================================

function OnboardingExample() {
  const [submitted, setSubmitted] = useState(false);

  const config = {
    ...onboardingConfig,
    onSubmit: async (values: OnboardingForm) => {
      await onboardingConfig.onSubmit(values);
      setSubmitted(true);
    },
  };

  if (submitted) {
    return (
      <SubmittedBanner
        label="Workspace ready! You'd now be redirected to the app."
        onReset={() => setSubmitted(false)}
      />
    );
  }

  return <FormEngine config={config} />;
}

function ApplicationExample() {
  const [submitted, setSubmitted] = useState(false);

  const config = {
    ...applicationConfig,
    onSubmit: async (values: ApplicationForm) => {
      await applicationConfig.onSubmit(values);
      setSubmitted(true);
    },
  };

  if (submitted) {
    return (
      <SubmittedBanner
        label="Application received! We'll be in touch within 5 business days."
        onReset={() => setSubmitted(false)}
      />
    );
  }

  return (
    // FormEngineRoot — composable: lets you control layout, progress style, and action props
    <FormEngineRoot config={config}>
      <StepProgress variants="dots" />
      <StepMeta />
      <StepCanvas />
      <StepActions
        layout="split"
        nextLabel="Next step"
        submitLabel="Submit Application"
        backLabel="Back"
      />
    </FormEngineRoot>
  );
}

function ProjectExample() {
  const [submitted, setSubmitted] = useState(false);

  const config = {
    ...projectConfig,
    onSubmit: async (values: ProjectForm) => {
      await projectConfig.onSubmit(values);
      setSubmitted(true);
    },
  };

  if (submitted) {
    return (
      <SubmittedBanner
        label="Project scaffolded! Opening in your editor…"
        onReset={() => setSubmitted(false)}
      />
    );
  }

  return (
    <FormEngineRoot config={config}>
      <StepProgress variants="dots" />
      <StepMeta />
      <StepCanvas />
      <StepActions
        layout="compact"
        submitLabel="Create Project"
        nextLabel="Continue"
        styles={{
          nextBtn: "bg-indigo-600 hover:bg-indigo-500",
        }}
      />
    </FormEngineRoot>
  );
}

// =============================================================================
// SECTION
// =============================================================================

export function FormEngineExamples() {
  return (
    <section id="form-engine">
      <SectionHeading
        icon={IconForms}
        label="Engine · FormEngine"
        title="Form Engine"
        description={
          "Config-driven multi-step form engine. Define a FormConfig<T> — steps, fields, validation, and onSubmit — and the engine handles navigation, field rendering, dependency resolution, and submission. " +
          "Use <FormEngine /> for the all-in-one default or <FormEngineRoot /> for full layout control."
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ExampleCard
          title="Developer Onboarding"
          description="3-step wizard using <FormEngine />. Covers chip-select, card-select, tag-input, rating, and checkbox — all rendered automatically from config."
          badge="<FormEngine />"
        >
          <OnboardingExample />
        </ExampleCard>

        <ExampleCard
          title="Job Application"
          description="Composable <FormEngineRoot /> with split StepActions layout. Uses text, email, phone, select, textarea, date, and checkbox fields."
          badge="<FormEngineRoot />"
        >
          <ApplicationExample />
        </ExampleCard>

        <ExampleCard
          title="Project Setup Wizard"
          description="<FormEngineRoot /> with compact StepActions and custom next button styling. card-select on step 1, tag-input on step 2."
          badge="compact layout"
        >
          <ProjectExample />
        </ExampleCard>
      </div>

      {/* ── API reference strip ─────────────────────────────────────── */}
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
            Supported field variants
          </span>
        </div>
        <div className="px-5 py-4 flex flex-wrap gap-2">
          {[
            "text",
            "email",
            "number",
            "password",
            "textarea",
            "checkbox",
            "date",
            "phone",
            "select",
            "card-select",
            "chip-select",
            "tag-input",
            "rating",
            "file",
          ].map((v) => (
            <span
              key={v}
              className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700"
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
