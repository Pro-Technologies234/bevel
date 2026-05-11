"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
// import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { PropertyControl } from "./properties-panel-types";

interface PropertiesControlProps {
  control: PropertyControl;
}

export function PropertiesControl({ control }: PropertiesControlProps) {
  switch (control.type) {
    case "text":
      return (
        <Input
          value={control.value}
          placeholder={control.placeholder}
          onChange={(e) => control.onChange(e.target.value)}
          className="h-7 text-[11px] px-2 bg-muted/50"
        />
      );

    case "number":
      return (
        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            value={control.value}
            min={control.min}
            max={control.max}
            step={control.step ?? 1}
            onChange={(e) => control.onChange(Number(e.target.value))}
            className="h-7 text-[11px] font-mono px-2 bg-muted/50"
          />
          {control.unit && (
            <span className="text-[10px] text-muted-foreground/50 shrink-0 select-none">
              {control.unit}
            </span>
          )}
        </div>
      );

    case "color":
      return (
        <div className="flex items-center gap-2">
          <label className="relative cursor-pointer shrink-0">
            <div
              className="w-5 h-5 rounded border border-border"
              style={{ backgroundColor: control.value }}
            />
            <input
              type="color"
              value={control.value}
              onChange={(e) => control.onChange(e.target.value)}
              className="sr-only"
            />
          </label>
          <span className="text-[11px] font-mono text-muted-foreground">
            {control.value.toUpperCase()}
          </span>
        </div>
      );

    case "select":
      return (
        <Select value={control.value} onValueChange={control.onChange}>
          <SelectTrigger className="h-7 text-[11px] px-2 bg-muted/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {control.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-[11px]">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "toggle":
      return (
        <Switch
          checked={control.value}
          onCheckedChange={control.onChange}
          className="scale-[0.8] origin-right"
        />
      );

    case "slider":
      return (
        <div className="flex items-center gap-2">
          {/* <Slider
            value={[control.value]}
            min={control.min}
            max={control.max}
            step={control.step ?? 1}
            onValueChange={([v]) => control.onChange(v)}
            className="flex-1"
          /> */}
          <span className="text-[10px] font-mono text-muted-foreground/50 w-6 text-right shrink-0 tabular-nums">
            {control.value}
          </span>
        </div>
      );

    case "custom":
      return <>{control.render()}</>;

    default:
      return null;
  }
}

PropertiesControl.displayName = "PropertiesControl";