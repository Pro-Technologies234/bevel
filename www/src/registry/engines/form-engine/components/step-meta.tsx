import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useFormEngineContext } from "../context";

export function StepMeta({
  title,
  description,
  visual,
  addons,
  className,
}: StepMetaProps) {
  const ctx = useFormEngineContext();
  const currentStepConfig = ctx.config.steps[ctx.currentStep];

  const resolvedTitle = title ?? currentStepConfig?.title;
  const resolvedDescription = description ?? currentStepConfig?.description;

  if (!resolvedTitle && !resolvedDescription && !visual && !addons) return null;
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center  tracking-tighter gap-4",
        className,
      )}
    >
      {visual && (
        <div className="mb-2 animate-in fade-in zoom-in duration-500">
          {visual}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-2xl md:text-4xl font-bold leading-tight">
          {resolvedTitle}
        </h3>
        {resolvedDescription && (
          <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
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

export interface StepMetaProps {
  title?: string;
  description?: string;
  visual?: ReactNode;
  addons?: ReactNode;
  className?: string;
}

StepMeta.displayName = "StepMeta";
