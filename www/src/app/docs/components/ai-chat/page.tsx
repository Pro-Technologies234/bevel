import { docsProductTourMetadata } from "@/lib/metadata";

import { AIChatContent } from "@/components/docs/ai-chat";

export const metadata = docsProductTourMetadata;

export default function AIChatPage() {
  return <AIChatContent />;
}
