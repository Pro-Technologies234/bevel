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
  IconWand,
} from "@tabler/icons-react";

interface LayerState {
  // Layout
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;

  // Typography
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  fontColor: string;
  letterSpacing: number;
  textAlign: string;

  // Fill
  fillColor: string;
  fillOpacity: number;

  // Border
  radius: number;
  borderWidth: number;
  borderColor: string;

  // Effects
  shadowBlur: number;
  shadowY: number;
  shadowColor: string;
  blur: number;
}

const INITIAL: LayerState = {
  x: 48,
  y: 120,
  width: 320,
  height: 240,
  rotation: 0,
  opacity: 100,
  visible: true,

  fontFamily: "inter",
  fontWeight: "500",
  fontSize: 14,
  fontColor: "#f8fafc",
  letterSpacing: 0,
  textAlign: "center",

  fillColor: "#c2f13c",
  fillOpacity: 100,

  radius: 8,
  borderWidth: 1,
  borderColor: "#334155",

  shadowBlur: 0,
  shadowY: 0,
  shadowColor: "rgba(0, 0, 0, 0.25)",
  blur: 0,
};

const FONT_OPTIONS = [
  { value: "inter", label: "Inter" },
  { value: "dm-sans", label: "DM Sans" },
  { value: "mono", label: "JetBrains Mono" },
  { value: "cal-sans", label: "Cal Sans" },
];

const WEIGHT_OPTIONS = [
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
];

const ALIGN_OPTIONS = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

function LayerPreview({ state }: { state: LayerState }) {
  // We calculate a fill color with opacity for the background
  // Assuming fillColor is a hex, a real app might use a color parser here.
  return (
    <div
      className="w-full h-36 rounded-md border border-border bg-background flex items-center justify-center overflow-hidden relative mb-1"
      aria-hidden
    >
      <div
        className="absolute transition-all duration-75 flex p-2"
        style={{
          width: Math.min(state.width / 4, 340),
          height: Math.min(state.height / 4, 340),
          backgroundColor: state.fillColor,
          opacity: state.visible
            ? (state.opacity / 100) * (state.fillOpacity / 100)
            : 0,
          borderRadius: state.radius,
          border:
            state.borderWidth > 0
              ? `${state.borderWidth}px solid ${state.borderColor}`
              : "none",
          transform: `rotate(${state.rotation}deg)`,
          boxShadow: `0px ${state.shadowY}px ${state.shadowBlur}px ${state.shadowColor}`,
          filter: `blur(${state.blur}px)`,

          // Typography
          color: state.fontColor,
          fontFamily: state.fontFamily,
          fontWeight: state.fontWeight,
          fontSize: Math.max(8, Math.min(state.fontSize * 0.7, 16)),
          letterSpacing: `${state.letterSpacing}px`,
          justifyContent:
            state.textAlign === "center"
              ? "center"
              : state.textAlign === "right"
                ? "flex-end"
                : "flex-start",
          alignItems: "center",
          textAlign: state.textAlign as any,
        }}
      >
        Aa
      </div>
    </div>
  );
}

export function PropertiesPanelDemo() {
  const [s, setS] = React.useState<LayerState>(INITIAL);
  const set =
    <K extends keyof LayerState>(k: K) =>
    (v: LayerState[K]) =>
      setS((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="flex gap-6 items-start w-full max-w-[720px]">
      {/* Preview Section */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <span className="text-lg tracking-tight font-semibold px-1">
          Live Preview
        </span>
        <LayerPreview state={s} />

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            ["X", s.x, "px"],
            ["Y", s.y, "px"],
            ["W", s.width, "px"],
            ["H", s.height, "px"],
            ["R", s.rotation, "°"],
            ["OP", s.opacity, "%"],
          ].map(([label, value, unit]) => (
            <div
              key={label as string}
              className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-background border border-border/40"
            >
              <span className="text-[10px] font-mono text-muted-foreground/60">
                {label}
              </span>
              <span className="text-[11px] font-mono text-foreground tabular-nums">
                {value}
                {unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Properties Panel */}
      <PropertiesPanel className="w-64 shrink-0 bg-background max-h-[600px] overflow-y-auto custom-scrollbar">
        {/* Layout Section */}
        <PropertiesSection title="Layout" icon={IconLayout2} defaultOpen>
          <div className="grid grid-cols-2 gap-2">
            <PropertiesRow
              label="X"
              control={{
                type: "number",
                value: s.x,
                unit: "px",
                onChange: set("x"),
              }}
            />
            <PropertiesRow
              label="Y"
              control={{
                type: "number",
                value: s.y,
                unit: "px",
                onChange: set("y"),
              }}
            />
            <PropertiesRow
              label="W"
              control={{
                type: "number",
                value: s.width,
                unit: "px",
                min: 0,
                onChange: set("width"),
              }}
            />
            <PropertiesRow
              label="H"
              control={{
                type: "number",
                value: s.height,
                unit: "px",
                min: 0,
                onChange: set("height"),
              }}
            />
          </div>
          <PropertiesRow
            label="Rotation"
            control={{
              type: "slider",
              value: s.rotation,
              min: 0,
              max: 360,
              onChange: set("rotation"),
            }}
          />
          <PropertiesRow
            label="Opacity"
            control={{
              type: "slider",
              value: s.opacity,
              min: 0,
              max: 100,
              onChange: set("opacity"),
            }}
          />
          <PropertiesRow
            label="Visible"
            control={{
              type: "toggle",
              value: s.visible,
              onChange: set("visible"),
            }}
          />
        </PropertiesSection>

        {/* Typography Section */}
        <PropertiesSection
          title="Typography"
          icon={IconTypography}
          defaultOpen={false}
        >
          <PropertiesRow
            label="Font"
            control={{
              type: "select",
              value: s.fontFamily,
              options: FONT_OPTIONS,
              onChange: set("fontFamily"),
            }}
          />
          <PropertiesRow
            label="Weight"
            control={{
              type: "select",
              value: s.fontWeight,
              options: WEIGHT_OPTIONS,
              onChange: set("fontWeight"),
            }}
          />

          <PropertiesRow
            label="Size"
            control={{
              type: "number",
              value: s.fontSize,
              unit: "px",
              min: 8,
              max: 96,
              onChange: set("fontSize"),
            }}
          />
          <PropertiesRow
            label="Space"
            control={{
              type: "number",
              value: s.letterSpacing,
              unit: "px",
              step: 0.5,
              onChange: set("letterSpacing"),
            }}
          />

          <PropertiesRow
            label="Align"
            control={{
              type: "select",
              value: s.textAlign,
              options: ALIGN_OPTIONS,
              onChange: set("textAlign"),
            }}
          />
          <PropertiesRow
            label="Color"
            control={{
              type: "color",
              value: s.fontColor,
              onChange: set("fontColor"),
            }}
          />
        </PropertiesSection>

        {/* Fill Section */}
        <PropertiesSection title="Fill" icon={IconPalette} defaultOpen={false}>
          <PropertiesRow
            label="Color"
            control={{
              type: "color",
              value: s.fillColor,
              onChange: set("fillColor"),
            }}
          />
          <PropertiesRow
            label="Opacity"
            control={{
              type: "slider",
              value: s.fillOpacity,
              min: 0,
              max: 100,
              onChange: set("fillOpacity"),
            }}
          />
        </PropertiesSection>

        {/* Border Section */}
        <PropertiesSection
          title="Border"
          icon={IconBorderRadius}
          defaultOpen={false}
        >
          <PropertiesRow
            label="Radius"
            control={{
              type: "slider",
              value: s.radius,
              min: 0,
              max: 100,
              onChange: set("radius"),
            }}
          />
          <PropertiesRow
            label="Width"
            control={{
              type: "number",
              value: s.borderWidth,
              unit: "px",
              min: 0,
              max: 24,
              onChange: set("borderWidth"),
            }}
          />
          <PropertiesRow
            label="Color"
            control={{
              type: "color",
              value: s.borderColor,
              onChange: set("borderColor"),
            }}
          />
        </PropertiesSection>

        {/* Effects Section (New) */}
        <PropertiesSection title="Effects" icon={IconWand} defaultOpen={true}>
          <PropertiesRow
            label="Drop Y"
            control={{
              type: "number",
              value: s.shadowY,
              unit: "px",
              min: -50,
              max: 50,
              onChange: set("shadowY"),
            }}
          />
          <PropertiesRow
            label="Shadow Blur"
            control={{
              type: "slider",
              value: s.shadowBlur,
              min: 0,
              max: 50,
              onChange: set("shadowBlur"),
            }}
          />
          <PropertiesRow
            label="Shadow Color"
            control={{
              type: "color",
              value: s.shadowColor,
              onChange: set("shadowColor"),
            }}
          />
          <hr className="border-border/50 my-2" />
          <PropertiesRow
            label="Layer Blur"
            control={{
              type: "slider",
              value: s.blur,
              min: 0,
              max: 20,
              onChange: set("blur"),
            }}
          />
        </PropertiesSection>
      </PropertiesPanel>
    </div>
  );
}
