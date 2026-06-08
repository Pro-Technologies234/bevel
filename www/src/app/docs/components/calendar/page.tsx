import { CalendarContent } from "@/components/docs/calendar";
import { docsCalendarMetadata } from "@/lib/metadata";

export const metadata = docsCalendarMetadata;

export default function CalendarPage() {
  return <CalendarContent />;
}
