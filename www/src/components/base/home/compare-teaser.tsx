import Link from "next/link";
import { Wrapper } from "@/components/shared/wrapper";
import { IconArrowUpRight, IconCheck, IconMinus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const ROWS: { label: string; primitives: boolean | "partial"; kits: boolean | "partial"; bevel: boolean }[] = [
  { label: "Business logic included", primitives: false, kits: "partial", bevel: true },
  { label: "Code lands in your repo", primitives: true, kits: false, bevel: true },
  { label: "No design-system lock-in", primitives: true, kits: false, bevel: true },
  { label: "No runtime package to update", primitives: "partial", kits: false, bevel: true },
];

function Mark({ value }: { value: boolean | "partial" }) {
  if (value === true)
    return <IconCheck size={15} strokeWidth={2.5} className="text-primary" />;
  if (value === "partial")
    return <IconMinus size={15} strokeWidth={2.5} className="text-muted-foreground/50" />;
  return <span className="text-muted-foreground/30 text-xs">—</span>;
}

export default function CompareTeaser() {
  return (
    <section className="py-24 border-t border-border/60">
      <Wrapper>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-sans font-semibold tracking-tight leading-tight">
              Systems, not primitives.
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed">
              Primitive libraries give you a button. Bevel gives you the whole
              flow, wired up, with the edge cases already handled.
            </p>
          </div>
          <Link
            href="/compare"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline shrink-0"
          >
            See the full comparison <IconArrowUpRight size={13} />
          </Link>
        </div>

        <div className="rounded-2xl border border-border/60 overflow-hidden">
          <div className="grid grid-cols-4 bg-muted/30 border-b border-border/60 text-[11px] font-mono uppercase tracking-wide">
            <div className="p-4 text-muted-foreground/60">Capability</div>
            <div className="p-4 text-center text-muted-foreground/60">Primitives-only</div>
            <div className="p-4 text-center text-muted-foreground/60">Component kits</div>
            <div className="p-4 text-center text-primary">Bevel UI</div>
          </div>
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              className={cn(
                "grid grid-cols-4 items-center text-xs md:text-sm",
                i !== ROWS.length - 1 && "border-b border-border/60",
              )}
            >
              <div className="p-4 text-foreground/90">{row.label}</div>
              <div className="p-4 flex justify-center">
                <Mark value={row.primitives} />
              </div>
              <div className="p-4 flex justify-center">
                <Mark value={row.kits} />
              </div>
              <div className="p-4 flex justify-center bg-primary/5">
                <Mark value={row.bevel} />
              </div>
            </div>
          ))}
        </div>
      </Wrapper>
    </section>
  );
}
