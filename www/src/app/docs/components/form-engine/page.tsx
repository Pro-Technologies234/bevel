"use client";

import {
  applicationConfig,
  FormEngineExamples,
} from "@/components/showcase/form-engine-examples";
import { StepActions } from "@/registry/form-engine/components/step-actions";
import { StepCanvas } from "@/registry/form-engine/components/step-canvas";
import { StepMeta } from "@/registry/form-engine/components/step-meta";
import { StepProgress } from "@/registry/form-engine/components/step-progress";
import { FormEngineNavigation } from "@/registry/form-engine/form-engine-navigation";
import { FormEngineRoot } from "@/registry/form-engine/form-engine-root";
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

export default function FormEngineExample() {
  const config = {
    ...applicationConfig,
    onSubmit: async (values: ApplicationForm) => {
      await applicationConfig.onSubmit(values);
    },
  };

  return (
    // FormEngineRoot — composable: lets you control layout, progress style, and action props
    <FormEngineRoot
      config={config}
      className="max-w-xl bg-background p-8 mx-auto min-h-[80vh] justify-between"
    >
      <div className="flex-1 gap-4 overflow-y-auto">
        <StepProgress variants="dots" />
        <StepMeta />
        <StepCanvas />
      </div>
      <FormEngineNavigation
        nextLabel="Next step"
        submitLabel="Submit Application"
        backLabel="Back"
      />
    </FormEngineRoot>
  );
}
