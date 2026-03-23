"use client"

import { IconLayersLinked, IconChevronRight } from "@tabler/icons-react"
import { TagInputExamples }      from "@/components/showcase/tag-input-examples"
import { RatingFieldExamples }   from "@/components/showcase/rating-field-examples"
import { FeedbackModuleExamples} from "@/components/showcase/feedback-module-examples"
import { ChipSelectExamples }    from "@/components/showcase/chip-select-examples"
import { SectionDivider }        from "@/components/showcase/ui"

const NAV = [
  { href: "#tag-input",       label: "TagInput"       },
  { href: "#rating-field",    label: "RatingField"    },
  { href: "#feedback-module", label: "FeedbackModule" },
  { href: "#chip-select",     label: "ChipSelect"     },
] as const

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-zinc-300 to-zinc-600 flex items-center justify-center">
              <IconLayersLinked size={14} className="text-zinc-950" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-zinc-200">Bevel UI</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
              showcase
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-xs text-zinc-500">
            {NAV.map(({ href, label }) => (
              <a key={href} href={href} className="hover:text-zinc-300 transition-colors">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 border border-zinc-800 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            4 components · 22 live examples
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100 mb-4 leading-[1.1]">
          Component Showcase
        </h1>
        <p className="text-base text-zinc-400 max-w-xl leading-relaxed mb-6">
          Real-world examples of every Bevel UI component. Click, type, and interact — everything
          here is live and driven by React state.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 font-mono">
          {NAV.map(({ label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <IconChevronRight size={12} className="text-zinc-700" />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 pb-24">

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-4 mb-16 p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
          {[
            { value: "4",    label: "Components"    },
            { value: "22",   label: "Live Examples" },
            { value: "100%", label: "Interactive"   },
            { value: "0",    label: "Dependencies"  },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-zinc-100 font-mono">{value}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <TagInputExamples />
        <SectionDivider />
        <RatingFieldExamples />
        <SectionDivider />
        <FeedbackModuleExamples />
        <SectionDivider />
        <ChipSelectExamples />

      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/60 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-zinc-600 font-mono">
          <span>Bevel UI · Component Library</span>
          <span>All examples are interactive</span>
        </div>
      </footer>

    </div>
  )
}
