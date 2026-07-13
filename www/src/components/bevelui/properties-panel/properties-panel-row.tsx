import { cn } from "@/lib/utils";
import { PropertiesControl } from "./properties-panel-control";
import type { PropertyControl } from "./types";

export interface PropertiesRowProps {
  label: string;
  control: PropertyControl;
  className?: string;
  hidden?: boolean;
}

export function PropertiesRow({
  label,
  control,
  className,
  hidden,
}: PropertiesRowProps) {
  if (hidden) return null;

  const isToggle = control.type === "toggle";

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 min-h-[32px]",
        isToggle && "justify-between",
        className,
      )}
    >
      <span
        className={cn(
          "text-[11px] text-muted-foreground/70 shrink-0 truncate select-none",

          isToggle ? "w-auto" : "basis-1/4 min-w-[24px] max-w-[80px]",
        )}
      >
        {label}
      </span>
      <div className={cn("flex-1 min-w-0", isToggle && "flex-none")}>
        <PropertiesControl control={control} />
      </div>
    </div>
  );
}

PropertiesRow.displayName = "PropertiesRow";
