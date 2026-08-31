import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * The small pulsing-dot pill used to open a page or section
 * ("Engineering-first UI Systems", "Free components available", ...).
 * Previously reimplemented independently on Home, Pricing, and Labs —
 * this is the single shared version all three (and new pages) use.
 */
export function Eyebrow({
  children,
  className,
  ref,
}: {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
}) {
  return (
    <Badge
      ref={ref}
      variant="secondary"
      className={cn(
        "bg-muted/60 p-3 gap-2 text-[10px] uppercase select-none text-foreground/80",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full dark:bg-green-400 bg-green-600 relative">
        <span className="rounded-full dark:bg-green-400 bg-green-600 absolute inset-0 animate-ping" />
      </span>
      {children}
    </Badge>
  );
}
