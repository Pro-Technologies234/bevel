"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useFormEngineContext } from "./form-engine-context";

export interface FormEngineStepMetaProps {
  title?: string;
  description?: string;
  visual?: ReactNode;
  addons?: ReactNode;
  className?: string;
}

export function FormEngineStepMeta({
  title,
  description,
  visual,
  addons,
  className,
}: FormEngineStepMetaProps) {
  const { config, currentStep } = useFormEngineContext();
  const stepConfig = config.steps[currentStep];

  const resolvedTitle = title ?? stepConfig?.title;
  const resolvedDescription = description ?? stepConfig?.description;

  if (!resolvedTitle && !resolvedDescription && !visual && !addons) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        className,
      )}
    >
      {visual && (
        <div className="mb-2 animate-in fade-in zoom-in duration-500">
          {visual}
        </div>
      )}

      <div className="space-y-2">
        {resolvedTitle && (
          <h3 className="text-2xl md:text-4xl font-semibold leading-tight">
            {resolvedTitle}
          </h3>
        )}
        {resolvedDescription && (
          <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
            {resolvedDescription}
          </p>
        )}
      </div>

      {addons && (
        <div className="mt-4 w-full flex justify-center">{addons}</div>
      )}
    </div>
  );
}

FormEngineStepMeta.displayName = "FormEngineStepMeta";
