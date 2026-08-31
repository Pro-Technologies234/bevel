import { Wrapper } from "@/components/shared/wrapper";
import { DOCS_SYSTEMS, DOCS_CATEGORIES } from "@/content/docs/manifest";

/**
 * A quiet strip of true, checkable facts — not customer logos we don't have.
 * Counts are derived from the manifest so they can't drift out of sync with
 * what's actually shipped.
 */
export default function Proof() {
  const stats = [
    { value: String(DOCS_SYSTEMS.length), label: "systems shipped" },
    { value: String(DOCS_CATEGORIES.length), label: "categories covered" },
    { value: "0", label: "runtime dependencies on Bevel" },
    { value: "MIT", label: "licensed, forever" },
  ];

  return (
    <div className="border-y border-border/60 bg-muted/10">
      <Wrapper>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60 py-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 px-2 text-center">
              <span className="text-2xl md:text-3xl font-semibold font-sans tracking-tight">
                {stat.value}
              </span>
              <span className="text-[11px] md:text-xs text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Wrapper>
    </div>
  );
}
