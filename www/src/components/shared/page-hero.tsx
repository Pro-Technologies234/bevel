import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/shared/eyebrow";

/** Shared centered header for lightweight marketing pages (About, Compare, Changelog, ...). */
export function PageHero({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center text-center gap-5 pt-28 pb-16 px-6 overflow-hidden",
        className,
      )}
    >
      {/* Same gradient-glow field the home hero uses, so every page reads as one system. */}
      <div aria-hidden className="absolute inset-0 -z-10 select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(194,241,60,0.1),transparent_55%)]" />
        <div className="absolute top-16 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute top-16 -right-16 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-[100px]" />
      </div>

      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="text-4xl md:text-6xl font-sans font-medium tracking-tight max-w-2xl text-balance">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground max-w-lg leading-relaxed text-sm md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
