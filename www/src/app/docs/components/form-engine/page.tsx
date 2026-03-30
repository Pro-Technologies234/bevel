"use client";
import {
  FormEngineConfig,
  FormEngineProgress,
  FormEngineStepCanvas,
  FormEngineStepMeta,
} from "@/registry/form-engine";
import { FormEngineNavigation } from "@/registry/form-engine/form-engine-navigation";
import { FormEngineRoot } from "@/registry/form-engine/form-engine-root";
import {
  IconBolt,
  IconBriefcase,
  IconChartBar,
  IconCode,
  IconPalette,
} from "@tabler/icons-react";
import { useState } from "react";

// ─── Example page ─────────────────────────────────────────────────────────────

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
export const applicationConfig: FormEngineConfig = {
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
            size: "sm",
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
};

export default function FormEngineExample() {
  const config = {
    ...applicationConfig,
  };

  return (
    // FormEngineRoot — composable: lets you control layout, progress style, and action props
    <FormEngineRoot
      config={config}
      onSubmit={async (values) => {
        console.log("Application submitted:", values);
      }}
      className="max-w-xl bg-background p-8 mx-auto min-h-[80vh] justify-between"
    >
      <div className="flex-1 gap-4 overflow-y-auto overflow-x-hidden">
        <FormEngineProgress variant="dots" />
        <FormEngineStepMeta />
        <FormEngineStepCanvas className="p-2" />
      </div>
      <FormEngineNavigation
        nextLabel="Next step"
        submitLabel="Submit Application"
        backLabel="Back"
      />
    </FormEngineRoot>
  );
}
