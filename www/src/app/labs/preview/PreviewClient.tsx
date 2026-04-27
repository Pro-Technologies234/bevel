"use client";

import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

// Move the REGISTRY here. Since this is a "use client" file,
// ssr: false is now perfectly legal.
const REGISTRY: Record<string, React.ComponentType> = {
  vault: dynamic(() => import("@/components/labs/vault/VaultApp"), {
    ssr: false,
  }),
  onboard: dynamic(() => import("@/components/labs/onboard/OnboardApp"), {
    ssr: false,
  }),
  launchpad: dynamic(() => import("@/components/labs/launchpad/LaunchpadApp"), {
    ssr: false,
  }),
  intake: dynamic(() => import("@/components/labs/intake/IntakeApp"), {
    ssr: false,
  }),
  ici: dynamic(() => import("@/components/labs/briefcase/BriefcaseApp"), {
    ssr: false,
  }),
  compass: dynamic(() => import("@/components/labs/compass/CompassApp"), {
    ssr: false,
  }),
};

export default function PreviewClient({ name }: { name: string }) {
  const Demo = REGISTRY[name];

  if (!Demo) return notFound();

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <div
        className="flex items-center justify-between px-5 py-2.5 border-b border-border/60"
        style={{ background: "rgba(8,8,8,.9)", backdropFilter: "blur(12px)" }}
      >
        <span className="text-xs font-mono text-muted-foreground capitalize">
          Bevel Labs — {name}
        </span>
        <a
          href="/labs"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Labs
        </a>
      </div>

      <div className="flex-1 p-4 md:p-8">
        <div className="h-full max-w-6xl mx-auto">
          <Demo />
        </div>
      </div>
    </div>
  );
}
