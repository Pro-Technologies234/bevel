import { cn } from "@/lib/utils";

export interface DocsPropsRow {
  prop: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface DocsPropsTableProps {
  rows: DocsPropsRow[];
  className?: string;
}

export function DocsPropsTable({ rows, className }: DocsPropsTableProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border overflow-hidden w-full",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground whitespace-nowrap">
                Prop
              </th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground whitespace-nowrap">
                Type
              </th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground whitespace-nowrap">
                Default
              </th>
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="bg-card/80">
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <code className="font-mono bg-background/40 px-2 py-1 rounded-sm border-muted/70 border">
                      {row.prop}
                    </code>
                    {row.required && (
                      <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-destructive/10 text-destructive">
                        required
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 ">
                  <code className="font-mono text-muted-foreground text-[11px] ">
                    {row.type}
                  </code>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {row.default ? (
                    <code className="font-mono text-[11px]">{row.default}</code>
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground leading-relaxed">
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DocsPropsTable.displayName = "DocsPropsTable";
