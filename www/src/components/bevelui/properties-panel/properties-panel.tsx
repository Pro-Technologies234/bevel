import * as React from "react";
import { cn } from "@/lib/utils";
import { PropertiesSection } from "./properties-panel-section";
import type { PropertySectionDef } from "./properties-panel-types";

export interface PropertiesPanelProps {
  /** Config-driven sections. Each section renders its rows automatically. */
  sections?: PropertySectionDef[];
  /** Headless children — use PropertiesSection + PropertiesRow directly. */
  children?: React.ReactNode;
  className?: string;
}

export function PropertiesPanel({
  sections,
  children,
  className,
}: PropertiesPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card/80 overflow-hidden",
        className,
      )}
    >
      {/* Config-driven */}
      {sections?.map((section) => (
        <PropertiesSection
          key={section.id}
          title={section.title}
          rows={section.rows}
          defaultOpen={section.defaultOpen ?? true}
          icon={section.icon}
        />
      ))}

      {/* Headless */}
      {children}
    </div>
  );
}

PropertiesPanel.displayName = "PropertiesPanel";
