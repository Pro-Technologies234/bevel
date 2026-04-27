// app/preview/[name]/page.tsx
// Full-viewport preview route for each Lab app.
// Opened in a new tab from the Labs page via the "Fullscreen" button.
// This route has no navbar, no sidebar — just the component.

import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamic imports — server-side friendly
const REGISTRY: Record<string, React.ComponentType> = {
  vault: dynamic(() => import("@/components/labs/vault/VaultApp"), { ssr: false }) as any,
  onboard: dynamic(() => import("@/components/labs/onboard/OnboardApp"), { ssr: false }) as any,
  launchpad: dynamic(() => import("@/components/labs/launchpad/LaunchpadApp"), { ssr: false }) as any,
  intake: dynamic(() => import("@/components/labs/intake/IntakeApp"), { ssr: false }) as any,
  ici: dynamic(() => import("@/components/labs/briefcase/BriefcaseApp"), { ssr: false }) as any,
  compass: dynamic(() => import("@/components/labs/compass/CompassApp"), { ssr: false }) as any,
};

export function generateStaticParams() {
  return Object.keys(REGISTRY).map((name) => ({ name }));
}

export default function PreviewPage({ params }: { params: { name: string } }) {
  const Demo = REGISTRY[params.name];
  if (!Demo) notFound();

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {/* Thin header so users know what they're looking at */}
      <div
        className="flex items-center justify-between px-5 py-2.5 border-b border-border/60"
        style={{ background: "rgba(8,8,8,.9)", backdropFilter: "blur(12px)" }}
      >
        <span className="text-xs font-mono text-muted-foreground capitalize">
          Bevel Labs — {params.name}
        </span>
        <a
          href="/labs"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Labs
        </a>
      </div>

      {/* Full viewport demo */}
      <div className="flex-1 p-4 md:p-8">
        <div className="h-full max-w-6xl mx-auto">
          <Demo />
        </div>
      </div>
    </div>
  );
}

// ─── Preview layout (no navbar/sidebar inherited) ─────────────────────────────
// app/preview/layout.tsx
// export default function PreviewLayout({ children }: { children: React.ReactNode }) {
//   return children;
// }
