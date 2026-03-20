export type RegistryCategory = "controls" | "engines" | "modules";
export type ShadcnDependencies =
  | "badge"
  | "button"
  | "textarea"
  | "input"
  | "skeleton"
  | "tooltip";
export type RegistryTarget = `${RegistryCategory}${string}.tsx`;
export type RegistryDependencies = {
  bevel: string[];
  shadcn: ShadcnDependencies[];
  npm: string[];
};

export type RegistryEntry = {
  name: string;
  category: RegistryCategory;
  dependencies: RegistryDependencies;
  files: RegistryFile[];
};
export type RegistryFile = {
  source: string;
  target: RegistryTarget;
};

export const registry: RegistryEntry[] = [
  {
    name: "tag-input",
    category: "controls",
    dependencies: {
      bevel: [],
      shadcn: ["badge", "skeleton", "tooltip"],
      npm: ["class-variance-authority"],
    },
    files: [
      {
        source: "src/registry/controls/tag-input.tsx",
        target: "controls/tag-input.tsx",
      },
    ],
  },
  {
    name: "rating-field",
    category: "controls",
    dependencies: {
      bevel: [],
      shadcn: ["tooltip"],
      npm: ["class-variance-authority", "framer-motion", "@tabler/icons-react"],
    },
    files: [
      {
        source: "src/registry/controls/rating-field.tsx",
        target: "controls/rating-field.tsx",
      },
    ],
  },
  {
    name: "feedback-module",
    category: "modules",
    dependencies: {
      bevel: ["rating-field"],
      shadcn: ["button", "textarea"],
      npm: ["framer-motion", "@tabler/icons-react"],
    },
    files: [
      {
        source: "src/registry/modules/feedback-module.tsx",
        target: "modules/feedback-module.tsx",
      },
    ],
  },
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
