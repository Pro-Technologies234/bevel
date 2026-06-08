import doc from "@/content/docs/calendar.json";
import { CalendarDemo } from "@/components/docs/calendar/calendar-demo";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { DocPage } from "@/content/docs/doc-schema";

const demoRegistry = {
  CalendarDemo,
};

export function CalendarContent() {
  return <DocPageRenderer page={doc as DocPage} demoRegistry={demoRegistry} />;
}
