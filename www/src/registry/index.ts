export type RegistryEntry = {
  name: string;
  category: RegistryCategory;
  dependencies: RegistryDependencies;
  files: RegistryFile[];
};

export type RegistryCategory = "controls" | "engines";
export type RegistryDependencies = {
  bevel: string[];
  shadcn: string[];
  npm: string[];
};
export type RegistryFile = {
  source: string;
  target: string;
};

export const registry: RegistryEntry[] = [
  {
    name: "chip-select",
    category: "controls",
    dependencies: {
      bevel: [],
      shadcn: ["skeleton", "tooltip"],
      npm: [],
    },
    files: [
      {
        source: "src/registry/controls/chip-select.tsx",
        target: "controls/chip-select.tsx",
      },
    ],
  },
];
