import { redirect } from "next/navigation";
import { docsRootMetadata } from "@/content/docs/manifest";

export const metadata = docsRootMetadata;

// The docs root has no content of its own — it sends visitors straight into
// the actual starting point. Change the target if you'd rather /docs itself
// render something (e.g. reuse <DocsLandingPage /> here instead).
export default function DocsRootPage() {
  redirect("/docs/introduction");
}
