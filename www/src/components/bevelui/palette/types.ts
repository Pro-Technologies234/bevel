export interface PaletteColor {
  id: string;
  hex: string;
  name?: string;
}

export interface PaletteConfig {
  maxColors?: number;
  showNames?: boolean;
  /** Which export formats are available */
  formats?: ("hex" | "hsl" | "rgb" | "tailwind" | "css-vars")[];
}

export interface PaletteContextValue {
  colors: PaletteColor[];
  selectedId: string | null;
  editingId: string | null;
  config: PaletteConfig;

  select: (id: string | null) => void;
  startEdit: (id: string) => void;
  stopEdit: () => void;
  add: (hex?: string) => void;
  remove: (id: string) => void;
  update: (id: string, patch: Partial<Omit<PaletteColor, "id">>) => void;
  reorder: (colors: PaletteColor[]) => void;
  duplicate: (id: string) => void;
}

export type ExportFormat = "hex-array" | "css-vars" | "tailwind" | "hsl-array";
