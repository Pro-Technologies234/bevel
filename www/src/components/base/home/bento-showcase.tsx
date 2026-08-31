import Link from "next/link";
import { IconArrowUpRight, IconBolt, IconSparkles } from "@tabler/icons-react";
import { Wrapper } from "@/components/shared/wrapper";
import { cn } from "@/lib/utils";
import {
  CommandPaletteIllustration,
  KanbanIllustration,
  FormEngineIllustration,
  PresenceIllustration,
  FloatingBubble,
} from "./illustrations";

/**
 * These cards use fixed brand gradients, not theme tokens — the text tone
 * has to be pinned per-card so it stays legible against that gradient in
 * both light and dark site themes, not just follow the ambient theme.
 */
function CardShell({
  href,
  gradient,
  tone = "light",
  className,
  children,
}: {
  href: string;
  gradient: string;
  tone?: "light" | "dark";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/10 p-6 md:p-7",
        "transition-transform duration-300 hover:-translate-y-0.5",
        className,
      )}
      style={{ background: gradient }}
    >
      {children}
      <IconArrowUpRight
        size={16}
        className={cn(
          "absolute top-5 right-5 transition-colors",
          tone === "light"
            ? "text-white/30 group-hover:text-white/70"
            : "text-black/30 group-hover:text-black/70",
        )}
      />
    </Link>
  );
}

function CardHeading({
  eyebrow,
  title,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex flex-col gap-1.5 max-w-[75%]">
      <span
        className={cn(
          "text-[10px] font-mono uppercase tracking-widest",
          tone === "light" ? "text-white/50" : "text-black/50",
        )}
      >
        {eyebrow}
      </span>
      <h3
        className={cn(
          "text-lg md:text-xl font-sans font-semibold tracking-tight",
          tone === "light" ? "text-white" : "text-black",
        )}
      >
        {title}
      </h3>
    </div>
  );
}

export default function BentoShowcase() {
  return (
    <section className="py-24">
      <Wrapper>
        <div className="mb-10 max-w-lg">
          <h2 className="text-3xl md:text-4xl font-sans font-semibold tracking-tight leading-tight">
            The systems, in the flesh.
          </h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed">
            A few of the nineteen — styled to match your app, not ours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 auto-rows-[220px]">
          <CardShell
            href="/docs/components/command-palette"
            gradient="linear-gradient(135deg, #4338ca 0%, #312e81 100%)"
            className="md:col-span-2 md:row-span-2"
          >
            <CardHeading eyebrow="Command Palette" title="⌘K, wired up." />
            <CommandPaletteIllustration className="mt-6 max-w-sm" />
            <FloatingBubble className="top-8 right-16 -rotate-6">
              <IconBolt size={16} strokeWidth={2} />
            </FloatingBubble>
          </CardShell>

          <CardShell
            href="/docs/components/kanban"
            gradient="linear-gradient(135deg, #ea580c 0%, #9a3412 100%)"
            className="md:col-span-2"
          >
            <CardHeading eyebrow="Kanban" title="Drag it anywhere." />
            <KanbanIllustration className="mt-6" />
          </CardShell>

          <CardShell
            href="/docs/components/form-engine"
            gradient="linear-gradient(135deg, #d9f99d 0%, #a3e635 100%)"
            tone="dark"
          >
            <CardHeading eyebrow="Form Engine" title="Multi-step, zero pain." tone="dark" />
            <FormEngineIllustration className="mt-6" />
          </CardShell>

          <CardShell
            href="/docs/components/notification-center"
            gradient="linear-gradient(135deg, #c026d3 0%, #6d28d9 100%)"
          >
            <CardHeading eyebrow="Notifications" title="Live, together." />
            <PresenceIllustration className="mt-6" />
            <FloatingBubble className="top-6 right-14">
              <IconSparkles size={15} strokeWidth={2} />
            </FloatingBubble>
          </CardShell>
        </div>
      </Wrapper>
    </section>
  );
}
