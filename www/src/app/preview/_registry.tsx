import { CommandPaletteDemo } from "../docs/components/command-palette/page";
import { FileUploadShowcase } from "../docs/components/file-upload/page";
import { FormEngineShowcase } from "../docs/components/form-engine/page";
import { ProductTourDemo } from "../docs/components/product-tour/page";

export const DEMO_REGISTRY: Record<string, React.ComponentType> = {
  "product-tour": ProductTourDemo,
  "command-palette": CommandPaletteDemo,
  "file-upload": FileUploadShowcase,
  "form-engine": FormEngineShowcase,
};
