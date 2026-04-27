import { CommandPaletteDemo } from "@/components/bevelui/docs/command-palette-content";
import { FileUploadShowcase } from "@/components/bevelui/docs/file-upload-content";
import { FormEngineShowcase } from "@/components/bevelui/docs/form-engine-content";
import { ProductTourDemo } from "@/components/bevelui/docs/product-tour-content";

export const DEMO_REGISTRY: Record<string, React.ComponentType> = {
  "product-tour": ProductTourDemo,
  "command-palette": CommandPaletteDemo,
  "file-upload": FileUploadShowcase,
  "form-engine": FormEngineShowcase,
};
