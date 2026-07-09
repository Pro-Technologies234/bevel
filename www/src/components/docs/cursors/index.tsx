// ─── cursors-content.tsx ──────────────────────────────────────────────────────
// @/components/bevelui/docs/cursors-content.tsx

import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import cursorsDoc from "@/content/docs/cursors.json";
import { CursorsDemo, CursorsTransportDemo } from "@/components/demo/cursors";

const demoRegistry = {
  CursorsDemo,
  CursorsTransportDemo,
};

export function CursorsContent() {
  return <DocPageRenderer page={cursorsDoc as any} demoRegistry={demoRegistry} />;
}


// ─── page.tsx ─────────────────────────────────────────────────────────────────
// @/app/docs/components/cursors/page.tsx
//
// import { docsCursorsMetadata } from "@/lib/metadata";
// import { CursorsContent } from "@/components/bevelui/docs/cursors-content";
//
// export const metadata = docsCursorsMetadata;
//
// export default function CursorsPage() {
//   return <CursorsContent />;
// }


// ─── metadata — add to @/lib/metadata.ts ─────────────────────────────────────

// export const docsCursorsMetadata = {
//   title: "Collaborative Cursors — Bevel UI",
//   description:
//     "Real-time presence overlay with conflict-free position sync, idle detection, and a label overlap resolver. Transport-agnostic — works with WebSockets, Supabase, Partykit, or any channel.",
//   openGraph: {
//     title: "Collaborative Cursors — Bevel UI",
//     description:
//       "Direct DOM position updates at 20 Hz, per-frame label overlap resolution, and idle auto-remove. Wire to any transport in two lines.",
//     url: "https://bevelui.com/docs/components/cursors",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Collaborative Cursors — Bevel UI",
//     description:
//       "Direct DOM position updates at 20 Hz, per-frame label overlap resolution, and idle auto-remove. Wire to any transport in two lines.",
//   },
// };
