import {
  IconSearch,
  IconFile,
  IconUser,
  IconLayoutKanban,
  IconBell,
  IconCheck,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

/**
 * Small, static, purely decorative mockups of Bevel systems — not the real
 * wired-up components (those are heavy: portals, drag engines, audio
 * contexts). Shared between the Hero collage and the Bento showcase so the
 * same visual language repeats instead of two one-off illustrations.
 */

export function CommandPaletteIllustration({ className }: { className?: string }) {
  const rows = [
    { icon: IconFile, label: "Q3 roadmap.pdf" },
    { icon: IconUser, label: "Invite teammate" },
    { icon: IconLayoutKanban, label: "Sprint board" },
  ];
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden shadow-2xl",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-white/10">
        <IconSearch size={14} className="text-white/50 shrink-0" />
        <span className="text-xs text-white/50 font-mono">Search or jump to...</span>
      </div>
      <div className="flex flex-col py-1.5">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={cn(
              "flex items-center gap-2.5 px-3.5 py-2",
              i === 0 && "bg-white/10",
            )}
          >
            <row.icon size={13} className="text-white/60 shrink-0" />
            <span className="text-xs text-white/80">{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KanbanIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-end gap-3", className)}>
      {[
        { rot: "-rotate-6", tag: "bg-blue-400" },
        { rot: "rotate-2", tag: "bg-amber-400" },
        { rot: "-rotate-2", tag: "bg-emerald-400" },
      ].map((card, i) => (
        <div
          key={i}
          className={cn(
            "w-28 rounded-lg border border-white/15 bg-black/25 backdrop-blur-sm p-3 shadow-xl",
            card.rot,
          )}
          style={{ marginBottom: i * 10 }}
        >
          <span className={cn("inline-block h-1.5 w-6 rounded-full mb-2", card.tag)} />
          <div className="h-1.5 w-full rounded-full bg-white/20 mb-1.5" />
          <div className="h-1.5 w-2/3 rounded-full bg-white/20" />
        </div>
      ))}
    </div>
  );
}

export function FormEngineIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-black/70 text-white">
        <IconCheck size={12} strokeWidth={3} />
      </div>
      <div className="h-px w-5 bg-black/30" />
      <div className="flex items-center justify-center h-6 w-6 rounded-full border-2 border-black/70 text-[10px] font-semibold text-black/70">
        2
      </div>
      <div className="h-px w-5 bg-black/20" />
      <div className="flex items-center justify-center h-6 w-6 rounded-full border-2 border-black/25 text-[10px] font-semibold text-black/30">
        3
      </div>
    </div>
  );
}

export function PresenceIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex -space-x-2">
        {["bg-fuchsia-400", "bg-violet-400", "bg-rose-400"].map((c, i) => (
          <span
            key={i}
            className={cn("h-7 w-7 rounded-full border-2 border-black/20 shadow-md", c)}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-black/20 border border-white/10 px-3 py-2 w-fit backdrop-blur-sm">
        <IconBell size={12} className="text-white/70" />
        <span className="text-[11px] text-white/80">New comment from Ada</span>
      </div>
    </div>
  );
}

/** Small floating "app badge" bubble — like the streaming-service dots on the Grey reference. */
export function FloatingBubble({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute flex items-center justify-center h-9 w-9 rounded-full bg-white text-black shadow-xl border border-black/10",
        className,
      )}
    >
      {children}
    </div>
  );
}
