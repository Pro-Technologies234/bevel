import { ProductTourContent } from "@/components/bevelui/docs/product-tour-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("product-tour");

export default function ProductTourPage() {
  return <ProductTourContent />;
}

