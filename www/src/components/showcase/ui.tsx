import { type ElementType } from "react"
import { cn } from "@/lib/utils"

// ─── Section Heading ──────────────────────────────────────────────────────────

export function SectionHeading({
  icon: Icon,
  label,
  title,
  description,
}: {
  icon: ElementType
  label: string
  title: string
  description: string
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-zinc-800 text-zinc-400">
          <Icon size={13} />
        </span>
        <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-500">
          {label}
        </span>
      </div>
      <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight mb-2">{title}</h2>
      <p className="text-sm text-zinc-400 max-w-lg leading-relaxed">{description}</p>
    </div>
  )
}

// ─── Example Card ─────────────────────────────────────────────────────────────

export function ExampleCard({
  title,
  description,
  badge,
  className,
  children,
}: {
  title: string
  description: string
  badge?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "group relative rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden",
        "transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/90",
        className,
      )}
    >
      {badge && (
        <span className="absolute top-4 right-4 text-[10px] font-mono px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-500 bg-zinc-800/80">
          {badge}
        </span>
      )}
      <div className="px-5 pt-5 pb-4 border-b border-zinc-800/70">
        <h3 className="text-sm font-semibold text-zinc-200 mb-0.5">{title}</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  )
}

// ─── Hint ─────────────────────────────────────────────────────────────────────

export function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-[11px] text-green-600 dark:text-green-400 font-mono">{children}</p>
}

// ─── Section Divider ──────────────────────────────────────────────────────────

export function SectionDivider() {
  return <div className="border-t border-zinc-800/60 my-16" />
}

// ─── Submitted State (for FeedbackModule) ────────────────────────────────────

export function SubmittedState({
  emoji,
  heading,
  sub,
  onReset,
}: {
  emoji: string
  heading: string
  sub: string
  onReset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
      <span className="text-2xl">{emoji}</span>
      <p className="text-sm font-medium text-zinc-200">{heading}</p>
      <p className="text-xs text-zinc-500">{sub}</p>
      <button
        onClick={onReset}
        className="mt-3 text-xs text-zinc-500 underline underline-offset-2 hover:text-zinc-300 transition-colors cursor-pointer"
      >
        Submit another
      </button>
    </div>
  )
}
