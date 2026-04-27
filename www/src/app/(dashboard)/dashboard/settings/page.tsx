import { dashboardSettingsMetadata } from "@/lib/metadata";
import { SettingsContent } from "@/components/dashboard/settings";
export const metadata = dashboardSettingsMetadata;
export default function SettingsPage() {
  return <SettingsContent />;
}
