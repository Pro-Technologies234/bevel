"use client";

import * as React from "react";
import {
  PropertiesPanel,
  PropertiesSection,
  PropertiesRow,
} from "@/components/bevelui/properties-panel";
import {
  IconLayout2,
  IconTypography,
  IconPalette,
  IconBorderRadius,
} from "@tabler/icons-react";

// ─── State ────────────────────────────────────────────────────────────────────

interface LayerState {
  // Layout
  x: number; y: number;
  width: number; height: number;
  opacity: number; visible: boolean;
  // Typography
  fontFamily: string; fontSize: number;
  fontColor: string; letterSpacing: number;
  // Fill
  fillColor: string; fillOpacity: number;
  // Border
  radius: number; borderWidth: number;
  borderColor: string;
}

const INITIAL: LayerState = {
  x: 48, y: 120,
  width: 320, height: 240,
  opacity: 100, visible: true,
  fontFamily: "inter", fontSize: 14,
  fontColor: "#f8fafc", letterSpacing: 0,
  fillColor: "#c2f13c", fillOpacity: 100,
  radius: 8, borderWidth: 1,
  borderColor: "#334155",
};

const FONT_OPTIONS = [
  { value: "inter",    label: "Inter"           },
  { value: "dm-sans",  label: "DM Sans"         },
  { value: "mono",     label: "JetBrains Mono"  },
  { value: "cal-sans", label: "Cal Sans"        },
];

// ─── Preview ──────────────────────────────────────────────────────────────────

function LayerPreview({ state }: { state: LayerState }) {
  return (
    <div
      className="w-full h-28 rounded-xl border border-border bg-muted/20 flex items-center justify-center overflow-hidden relative mb-1"
      aria-hidden
    >
      <div
        className="absolute transition-all duration-75 flex items-center justify-center text-[11px] font-mono"
        style={{
          width:        Math.min(state.width / 4, 120),
          height:       Math.min(state.height / 4, 80),
          backgroundColor: state.fillColor,
          opacity:         state.visible ? state.opacity / 100 : 0,
          borderRadius:    state.radius,
          border:       state.borderWidth > 0 ? `${state.borderWidth}px solid ${state.borderColor}` : "none",
          color:        state.fontColor,
          fontFamily:   state.fontFamily,
          fontSize:     Math.max(8, Math.min(state.fontSize * 0.7, 13)),
          letterSpacing: `${state.letterSpacing}px`,
        }}
      >
        Aa
      </div>
    </div>
  );
}

// ─── PropertiesPanelDemo ──────────────────────────────────────────────────────

export function PropertiesPanelDemo() {
  const [s, setS] = React.useState<LayerState>(INITIAL);
  const set = <K extends keyof LayerState>(k: K) => (v: LayerState[K]) =>
    setS((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="flex gap-6 items-start w-full max-w-[640px]">
      {/* Preview */}
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-1">
          Preview
        </span>
        <LayerPreview state={s} />
        <div className="grid grid-cols-2 gap-1">
          {[
            ["X",  s.x],
            ["Y",  s.y],
            ["W",  s.width],
            ["H",  s.height],
          ].map(([label, value]) => (
            <div key={label as string} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30 border border-border/40">
              <span className="text-[10px] font-mono text-muted-foreground/50 w-3">{label}</span>
              <span className="text-[11px] font-mono text-muted-foreground tabular-nums">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel */}
      <PropertiesPanel className="w-52 shrink-0">
        <PropertiesSection title="Layout" icon={IconLayout2} defaultOpen>
          <PropertiesRow label="X"       control={{ type: "number", value: s.x,       unit: "px", onChange: set("x")       }} />
          <PropertiesRow label="Y"       control={{ type: "number", value: s.y,       unit: "px", onChange: set("y")       }} />
          <PropertiesRow label="Width"   control={{ type: "number", value: s.width,   unit: "px", min: 0, onChange: set("width")   }} />
          <PropertiesRow label="Height"  control={{ type: "number", value: s.height,  unit: "px", min: 0, onChange: set("height")  }} />
          <PropertiesRow label="Opacity" control={{ type: "slider", value: s.opacity, min: 0, max: 100, onChange: set("opacity") }} />
          <PropertiesRow label="Visible" control={{ type: "toggle", value: s.visible, onChange: set("visible") }} />
        </PropertiesSection>

        <PropertiesSection title="Typography" icon={IconTypography} defaultOpen={false}>
          <PropertiesRow label="Font"    control={{ type: "select", value: s.fontFamily, options: FONT_OPTIONS, onChange: set("fontFamily") }} />
          <PropertiesRow label="Size"    control={{ type: "number", value: s.fontSize, unit: "px", min: 8, max: 96, onChange: set("fontSize") }} />
          <PropertiesRow label="Color"   control={{ type: "color",  value: s.fontColor, onChange: set("fontColor") }} />
          <PropertiesRow label="Spacing" control={{ type: "number", value: s.letterSpacing, unit: "px", step: 0.5, onChange: set("letterSpacing") }} />
        </PropertiesSection>

        <PropertiesSection title="Fill" icon={IconPalette} defaultOpen={false}>
          <PropertiesRow label="Color"   control={{ type: "color",  value: s.fillColor,    onChange: set("fillColor")    }} />
          <PropertiesRow label="Opacity" control={{ type: "slider", value: s.fillOpacity,  min: 0, max: 100, onChange: set("fillOpacity") }} />
        </PropertiesSection>

        <PropertiesSection title="Border" icon={IconBorderRadius} defaultOpen={false}>
          <PropertiesRow label="Radius" control={{ type: "slider", value: s.radius,      min: 0,  max: 48,  onChange: set("radius")      }} />
          <PropertiesRow label="Width"  control={{ type: "number", value: s.borderWidth, unit: "px", min: 0, onChange: set("borderWidth") }} />
          <PropertiesRow label="Color"  control={{ type: "color",  value: s.borderColor, onChange: set("borderColor") }} />
        </PropertiesSection>
      </PropertiesPanel>
    </div>
  );
}