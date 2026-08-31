import { InstallationContent } from "@/components/bevelui/docs/installation-content";
import { docsInstallationMetadata } from "@/content/docs/manifest";

export const metadata = docsInstallationMetadata;

export default function InstallationPage() {
  return <InstallationContent />;
}
