'use client'
import { ChipSelect } from "@/registry/controls/chip-select";
import { SelectField, SelectOptionGroup } from "@/registry/controls/select-field";
import { IconBlender, IconCanary, IconCode, IconDatabase, IconTool, IconUTurnRight } from "@tabler/icons-react";
const DUMMY_OPTIONS: SelectOptionGroup[] = [
  {
    group: "ENGINES",
    // Note: To use these group-level props, ensure SelectOptionGroup 
    // interface includes: icon?: React.ReactNode; className?: string;
    className: "font-sans bg-green-400/20 text-green-400",
    options: [
      { label: "Unity Engine", value: "unity" },
      { label: "Unreal Engine", value: "unreal" },
      { label: "Godot Engine", value: "godot" },
      { label: "Stride Engine", value: "stride" },
      { label: "Flax Engine", value: "flax" },
      { label: "Gamemaker Studios", value: "game-maker" },
    ],
  },
  {
    icon: IconUTurnRight,
    group: "TOOLS",
    className: "font-sans bg-pink-400/20 text-pink-400",
    options: [
      { label: "Blender", value: "blender", icon: IconBlender },
      { label: "Figma", value: "figma" },
      { label: "Framer", value: "framer" },
      { label: "Canva", value: "canva" },
    ],
  },
  {
    icon: IconCode,
    group: "LANGUAGES",
    className: "font-sans bg-blue-400/20 text-blue-400",
    options: [
      { label: "TypeScript", value: "ts" },
      { label: "Rust", value: "rust" },
      { label: "C#", value: "csharp" },
      { label: "C++", value: "cpp" },
    ],
  },
  {
    icon: IconDatabase,
    group: "DATABASES",
    className: "font-sans bg-yellow-400/20 text-yellow-400",
    options: [
      { label: "PostgreSQL", value: "postgres" },
      { label: "Redis", value: "redis" },
      { label: "MongoDB", value: "mongo", disabled: true },
    ],
  },
];



export default function Preview() {
  return (
    <section className=" h-screen mx-auto max-w-lg font-sans flex flex-col justify-center">
      <ChipSelect
        max={4}
        multiple
        size="sm"
        activeClassName="bg-orange-600! "
        options={[
          {
            label: "Unity Engine",
            value: "unity",
            description:
              "This is unity engine, a multipurpose game engine, This is unity engine, a multipurpose game engine, This is unity engine, a multipurpose game engine",
          },
          { label: "Unreal Engine", value: "unreal" },
          { label: "Godot Engine", value: "godot" },
          { label: "Stride Engine", value: "stride" },
          { label: "Flax Engine", value: "flax" },
          { label: "Gamemaker studios", value: "game-maker" },
        ]}
      />
      <SelectField
        options={DUMMY_OPTIONS}
      />
    </section>
  );
}
