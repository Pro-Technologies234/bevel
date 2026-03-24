"use client"

import { IconLayersLinked, IconChevronRight } from "@tabler/icons-react"
import { TagInputExamples }        from "@/components/showcase/tag-input-examples"
import { RatingFieldExamples }     from "@/components/showcase/rating-field-examples"
import { FeedbackModuleExamples }  from "@/components/showcase/feedback-module-examples"
import { ChipSelectExamples }      from "@/components/showcase/chip-select-examples"
import { SelectFieldExamples }     from "@/components/showcase/select-field-examples"
import { CardSelectExamples }      from "@/components/showcase/card-select-examples"
import { FormEngineExamples }      from "@/components/showcase/form-engine-examples"
import { SectionDivider }          from "@/components/showcase/ui"

const NAV = [
  { href: "#tag-input",       label: "TagInput",       group: "Controls" },
  { href: "#rating-field",    label: "RatingField",    group: "Controls" },
  { href: "#chip-select",     label: "ChipSelect",     group: "Controls" },
  { href: "#select-field",    label: "SelectField",    group: "Controls" },
  { href: "#card-select",     label: "CardSelect",     group: "Controls" },
  { href: "#feedback-module", label: "FeedbackModule", group: "Modules"  },
  { href: "#form-engine",     label: "FormEngine",     group: "Engines"  },
] as const

const STATS = [
  { value: "7",    label: "Components" },
  { value: "38",   label: "Examples"   },
  { value: "100%", label: "Interactive"},
  { value: "0",    label: "Config"     },
]

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* ── Header ─────────────────────────────────────────────────────── */}
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
          <nav className="hidden lg:flex items-center gap-5 text-xs text-zinc-500">
            {NAV.map(({ href, label, group }) => (
              <a key={href} href={href} className="hover:text-zinc-300 transition-colors flex items-center gap-1.5">
                {group === "Engines" && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />}
                {group === "Modules" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />}
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 border border-zinc-800 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            7 components · 38 live examples
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100 mb-4 leading-[1.1]">
          Component Showcase
        </h1>
        <p className="text-base text-zinc-400 max-w-xl leading-relaxed mb-6">
          Real-world examples of every Bevel UI component — controls, modules, and engines.
          Click, type, and interact. Everything is live and driven by React state.
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-600 font-mono">
          {NAV.map(({ label, href }) => (
            <a key={href} href={href} className="flex items-center gap-1.5 hover:text-zinc-400 transition-colors">
              <IconChevronRight size={12} className="text-zinc-700" />
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 pb-24">

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-4 mb-16 p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-zinc-100 font-mono">{value}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Controls group */}
        <div className="mb-8 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-zinc-500" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-600">Controls</span>
          <div className="flex-1 border-t border-zinc-800/60" />
        </div>

        <TagInputExamples />
        <SectionDivider />
        <RatingFieldExamples />
        <SectionDivider />
        <ChipSelectExamples />
        <SectionDivider />
        <SelectFieldExamples />
        <SectionDivider />
        <CardSelectExamples />

        {/* Modules group */}
        <div className="my-16 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-600">Modules</span>
          <div className="flex-1 border-t border-zinc-800/60" />
        </div>

        <FeedbackModuleExamples />

        {/* Engines group */}
        <div className="my-16 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-600">Engines</span>
          <div className="flex-1 border-t border-zinc-800/60" />
        </div>

        <FormEngineExamples />

      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/60 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-zinc-600 font-mono">
          <span>Bevel UI · Component Library</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />Controls</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Modules</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />Engines</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
