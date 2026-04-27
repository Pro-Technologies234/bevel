import { docsProductTourMetadata } from "@/lib/metadata";
import { ProductTourContent } from "@/components/bevelui/docs/product-tour-content";

export const metadata = docsProductTourMetadata;

export default function ProductTourPage() {
  return <ProductTourContent />;
}
