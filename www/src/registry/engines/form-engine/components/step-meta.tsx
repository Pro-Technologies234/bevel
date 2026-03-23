import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

export interface StepMetaProps {
  title?: string;
  description?: string;
  visual?: ReactNode;
  addons?: ReactNode;
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function StepMeta({
  title,
  description,
  visual,
  addons,
  className,
}: StepMetaProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center  tracking-tighter gap-4",
        className,
      )}
    >
      {/* 1. Visual/Logo Slot (The Heart/Icon in your image) */}
      {visual && (
        <div className="mb-2 animate-in fade-in zoom-in duration-500">
          {visual}
        </div>
      )}

      {/* 2. Text Content */}
      <div className="space-y-2">
        <h3 className="text-2xl md:text-4xl font-bold leading-tight">
          {title}
        </h3>
        {description && (
          <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* 3. Addons Slot (Step dots or extra info) */}
      {addons && (
        <div className="mt-4 w-full flex justify-center">{addons}</div>
      )}
    </div>
  );
}

StepMeta.displayName = "StepMeta";
