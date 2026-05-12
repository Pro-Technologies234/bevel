import * as React from "react";

export type PropertyControl =
  | {
      type: "text";
      value: string;
      placeholder?: string;
      onChange: (v: string) => void;
    }
  | {
      type: "number";
      value: number;
      min?: number;
      max?: number;
      step?: number;
      unit?: string;
      onChange: (v: number) => void;
    }
  | {
      type: "color";
      value: string;
      onChange: (v: string) => void;
    }
  | {
      type: "select";
      value: string;
      options: { value: string; label: string }[];
      onChange: (v: string) => void;
    }
  | {
      type: "toggle";
      value: boolean;
      onChange: (v: boolean) => void;
    }
  | {
      type: "slider";
      value: number;
      min: number;
      max: number;
      step?: number;
      onChange: (v: number) => void;
    }
  | {
      type: "custom";
      render: () => React.ReactNode;
    };

export interface PropertyRowDef {
  id: string;
  label: string;
  control: PropertyControl;
  hidden?: boolean;
}

export interface PropertySectionDef {
  id: string;
  title: string;
  rows: PropertyRowDef[];
  defaultOpen?: boolean;
  icon?: React.ElementType;
}
