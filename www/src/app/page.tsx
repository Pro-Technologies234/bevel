"use client"

import { useState } from "react"
import { TagInput } from "@/registry/controls/tag-input"
import { RatingField } from "@/registry/controls/rating-field"
import { FeedbackModule, type Feedback } from "@/registry/modules/feedback-module"
import {
  IconCode,
  IconLayersLinked,
  IconStar,
  IconMessage,
  IconChevronRight,
  IconMoodAngry,
  IconMoodAngryFilled,
  IconMoodSad,
  IconMoodSadFilled,
  IconMoodNeutral,
  IconMoodNeutralFilled,
  IconMoodSmile,
  IconMoodSmileFilled,
  IconMoodHappy,
  IconMoodHappyFilled,
  IconCircle,
  IconCircleFilled,
  IconFlame,
  IconFlameFilled,
  IconThumbUp,
  IconThumbUpFilled,
  IconThumbDown,
  IconThumbDownFilled,
  IconAlertCircle,
  IconAlertCircleFilled,
  IconCircleCheck,
  IconCircleCheckFilled,
  IconCircleDotFilled,
  IconCircleDot,
} from "@tabler/icons-react"

// ─── Section Heading ──────────────────────────────────────────────────────────

function SectionHeading({
  icon: Icon,
  label,
  title,
  description,
}: {
  icon: React.ElementType
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

function ExampleCard({
  title,
  description,
  badge,
  children,
}: {
  title: string
  description: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <div className="group relative rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/90">
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-[11px] text-zinc-600 font-mono">{children}</p>
}

function SectionDivider() {
  return <div className="border-t border-zinc-800/60 my-16" />
}

// ─── Tag Input Examples ───────────────────────────────────────────────────────

function TagInputExamples() {
  const [techStack, setTechStack] = useState<string[]>(["React", "TypeScript", "Tailwind"])
  const [ingredients, setIngredients] = useState<string[]>(["garlic", "olive oil", "tomatoes"])
  const [keywords, setKeywords] = useState<string[]>(["nextjs", "performance"])
  const [disabledTags] = useState<string[]>(["accessibility", "react", "tailwind", "animation"])

  return (
    <section id="tag-input">
      <SectionHeading
        icon={IconCode}
        label="Component · TagInput"
        title="Tag Input"
        description="Free-form tag entry with configurable delimiters, duplicate control, loading states, and multiple visual variants. Press Enter or comma to confirm a tag."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <ExampleCard
          title="Tech Stack Selector"
          description="Declare a project's technologies during setup. Capped at 6 tags, secondary variant."
          badge="max={6}"
        >
          <TagInput
            value={techStack}
            onChange={setTechStack}
            placeholder="Add technology…"
            max={6}
            variant="secondary"
            size="md"
          />
          <Hint>{techStack.length}/6 technologies selected</Hint>
        </ExampleCard>

        <ExampleCard
          title="Recipe Ingredients"
          description="Ingredient tagging for a recipe builder. Comma-only delimiter for fast entry. Duplicates allowed."
          badge="delimiter={[',']}"
        >
          <TagInput
            value={ingredients}
            onChange={setIngredients}
            placeholder="Add ingredient…"
            delimiter={[","]}
            allowDuplicates
            variant="outline"
            size="md"
          />
          <Hint>
            {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""} listed
          </Hint>
        </ExampleCard>

        <ExampleCard
          title="SEO Keyword Planner"
          description="Keyword targeting for a blog post. Ghost variant keeps visual noise low alongside content."
          badge="variant='ghost'"
        >
          <TagInput
            value={keywords}
            onChange={setKeywords}
            placeholder="Add keyword…"
            variant="ghost"
            size="md"
          />
          <Hint>
            {keywords.length} keyword{keywords.length !== 1 ? "s" : ""} targeted
          </Hint>
        </ExampleCard>

        <ExampleCard
          title="Published Topic Tags"
          description="Read-only tag display for published documentation. Disabled state prevents any editing."
          badge="disabled"
        >
          <TagInput
            value={disabledTags}
            onChange={() => {}}
            placeholder="Read-only…"
            variant="default"
            size="sm"
            disabled
          />
          <Hint>Published · read-only</Hint>
        </ExampleCard>

        <ExampleCard
          title="Async Tag Suggestions"
          description="Tags being fetched from a remote API — isLoading renders animated skeleton tags in place."
          badge="isLoading"
        >
          <TagInput
            value={[]}
            onChange={() => {}}
            placeholder="Loading suggestions…"
            variant="secondary"
            size="md"
            max={5}
            isLoading
          />
          <Hint>Fetching from API…</Hint>
        </ExampleCard>

        <ExampleCard
          title="Large Search Tags"
          description="Prominent tag entry for a search UI. lg sizing improves tap targets on mobile devices."
          badge="size='lg'"
        >
          <TagInput
            value={["design systems", "tokens"]}
            onChange={() => {}}
            placeholder="Search topics…"
            variant="default"
            size="lg"
          />
          <Hint>lg size · touch-optimised</Hint>
        </ExampleCard>
      </div>
    </section>
  )
}

// ─── Rating Field Examples ────────────────────────────────────────────────────

function RatingFieldExamples() {
  const [productRating, setProductRating] = useState(4)
  const [difficultyRating, setDifficultyRating] = useState(3)
  const [moodRating, setMoodRating] = useState(0)
  const [npsRating, setNpsRating] = useState(0)

  // levels[] only accepts { color?, icon?: Icon, emptyIcon?: Icon }
  // icon/emptyIcon must be Tabler Icon components — not strings or JSX
  const moodLevels = [
    { color: "#ef4444", icon: IconMoodAngryFilled,   emptyIcon: IconMoodAngry   },
    { color: "#f97316", icon: IconMoodSadFilled,     emptyIcon: IconMoodSad     },
    { color: "#eab308", icon: IconMoodNeutralFilled, emptyIcon: IconMoodNeutral },
    { color: "#22c55e", icon: IconMoodSmileFilled,   emptyIcon: IconMoodSmile   },
    { color: "#3b82f6", icon: IconMoodHappyFilled,   emptyIcon: IconMoodHappy   },
  ]

  const difficultyLevels = [
    { color: "#22c55e", icon: IconCircleFilled, emptyIcon: IconCircle },
    { color: "#84cc16", icon: IconCircleFilled, emptyIcon: IconCircle },
    { color: "#eab308", icon: IconCircleFilled, emptyIcon: IconCircle },
    { color: "#f97316", icon: IconCircleFilled, emptyIcon: IconCircle },
    { color: "#ef4444", icon: IconCircleFilled, emptyIcon: IconCircle },
  ]

  const spiceLevels = [
    { color: "#fde68a", icon: IconFlameFilled, emptyIcon: IconFlame },
    { color: "#fcd34d", icon: IconFlameFilled, emptyIcon: IconFlame },
    { color: "#fbbf24", icon: IconFlameFilled, emptyIcon: IconFlame },
    { color: "#f97316", icon: IconFlameFilled, emptyIcon: IconFlame },
    { color: "#ea580c", icon: IconFlameFilled, emptyIcon: IconFlame },
    { color: "#dc2626", icon: IconFlameFilled, emptyIcon: IconFlame },
    { color: "#b91c1c", icon: IconFlameFilled, emptyIcon: IconFlame },
  ]

  // single mode — max 2, thumb up or down
  const npsLevels = [
    { color: "#ef4444", icon: IconThumbDownFilled, emptyIcon: IconThumbDown },
    { color: "#22c55e", icon: IconThumbUpFilled,   emptyIcon: IconThumbUp   },
  ]

  const moodLabels = ["Frustrated", "Unhappy", "Neutral", "Happy", "Thrilled"]
  const difficultyLabels = ["", "Beginner", "Easy", "Intermediate", "Advanced", "Expert"]

  return (
    <section id="rating-field">
      <SectionHeading
        icon={IconStar}
        label="Component · RatingField"
        title="Rating Field"
        description="Flexible star-based rating with custom Tabler icons per level, per-level accent colors, single-select mode, hover callbacks, and optional deselect."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <ExampleCard
          title="Product Review Stars"
          description="Classic 5-star rating for an e-commerce product page. Amber accent, deselect supported."
          badge="accentColor"
        >
          <RatingField
            value={productRating}
            onChange={setProductRating}
            onHover={() => {}}
            max={5}
            accentColor="#f59e0b"
            allowDeselect
            size={28}
          />
          <Hint>
            {productRating > 0
              ? `${productRating} star${productRating !== 1 ? "s" : ""} — ${["", "Poor", "Fair", "Good", "Great", "Excellent"][productRating]}`
              : "No rating yet"}
          </Hint>
        </ExampleCard>

        <ExampleCard
          title="Course Difficulty Level"
          description="Colour-coded difficulty for a learning platform. Per-level filled/empty circles, green → red."
          badge="levels[]"
        >
          <RatingField
            value={difficultyRating}
            onChange={setDifficultyRating}
            onHover={() => {}}
            max={5}
            levels={difficultyLevels}
            size={24}
          />
          <Hint>Difficulty: {difficultyLabels[difficultyRating] || "Unset"}</Hint>
        </ExampleCard>

        <ExampleCard
          title="Daily Mood Tracker"
          description="Mood selector for a wellness app using Tabler mood icons. Each level has a distinct filled/empty pair."
          badge="mood icons"
        >
          <RatingField
            value={moodRating}
            onChange={setMoodRating}
            onHover={() => {}}
            max={5}
            levels={moodLevels}
            size={30}
          />
          <Hint>
            {moodRating > 0 ? `Mood: ${moodLabels[moodRating - 1]}` : "How are you feeling today?"}
          </Hint>
        </ExampleCard>

        <ExampleCard
          title="Quick NPS Thumbs"
          description="Two-option thumbs up/down NPS widget. single mode shows exactly one active icon at a time."
          badge="single"
        >
          <RatingField
            value={npsRating}
            onChange={setNpsRating}
            onHover={() => {}}
            max={2}
            single
            levels={npsLevels}
            size={28}
          />
          <Hint>
            {npsRating === 0
              ? "Would you recommend us?"
              : npsRating === 1
              ? "Not recommended"
              : "Recommended"}
          </Hint>
        </ExampleCard>

        <ExampleCard
          title="Accessibility Score"
          description="Read-only WCAG compliance score. disabled prevents any hover or click interaction."
          badge="disabled"
        >
          <RatingField
            defaultValue={4}
            onChange={() => {}}
            onHover={() => {}}
            max={5}
            accentColor="#10b981"
            disabled
            size={24}
          />
          <Hint>WCAG score: 4/5 · AA compliant</Hint>
        </ExampleCard>

        <ExampleCard
          title="Spice Level Selector"
          description="Food ordering intensity selector. Flame icons with a heat gradient across 7 levels."
          badge="max={7}"
        >
          <RatingField
            value={5}
            onChange={() => {}}
            onHover={() => {}}
            max={7}
            levels={spiceLevels}
            size={22}
          />
          <Hint>5/7 — Very hot</Hint>
        </ExampleCard>
      </div>
    </section>
  )
}

// ─── Feedback Module Examples ─────────────────────────────────────────────────

function SubmittedState({
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

function FeedbackModuleExamples() {
  const [serviceValue, setServiceValue] = useState<Feedback>({ rating: 0, comment: "" })
  const [productValue, setProductValue] = useState<Feedback>({ rating: 0, comment: "" })
  const [supportValue, setSupportValue] = useState<Feedback>({ rating: 0, comment: "" })
  const [serviceSubmitted, setServiceSubmitted] = useState(false)
  const [productSubmitted, setProductSubmitted] = useState(false)
  const [supportLoading, setSupportLoading] = useState(false)
  const [supportSubmitted, setSupportSubmitted] = useState(false)

  const handleSupportSubmit = () => {
    setSupportLoading(true)
    setTimeout(() => {
      setSupportLoading(false)
      setSupportSubmitted(true)
    }, 1800)
  }

  // levels: { label: string; color: string; icon?: Icon; emptyIcon?: Icon }
  // icon/emptyIcon are Tabler Icon components — the module renders them as <Icon />
  const restaurantLevels = [
    { label: "Terrible",  color: "#ef4444", icon: IconMoodAngryFilled,   emptyIcon: IconMoodAngry   },
    { label: "Poor",      color: "#f97316", icon: IconMoodSadFilled,     emptyIcon: IconMoodSad     },
    { label: "Okay",      color: "#eab308", icon: IconMoodNeutralFilled, emptyIcon: IconMoodNeutral },
    { label: "Good",      color: "#22c55e", icon: IconMoodSmileFilled,   emptyIcon: IconMoodSmile   },
    { label: "Excellent", color: "#3b82f6", icon: IconMoodHappyFilled,   emptyIcon: IconMoodHappy   },
  ]

  const productLevels = [
    { label: "Unusable",    color: "#ef4444", icon: IconAlertCircleFilled, emptyIcon: IconAlertCircle    },
    { label: "Needs work",  color: "#f97316", icon: IconCircleDotFilled,      emptyIcon: IconCircleDot         },
    { label: "Acceptable",  color: "#eab308", icon: IconCircleDotFilled,      emptyIcon: IconCircleDot         },
    { label: "Solid",       color: "#6366f1", icon: IconCircleCheckFilled, emptyIcon: IconCircleCheck    },
    { label: "Exceptional", color: "#10b981", icon: IconCircleCheckFilled, emptyIcon: IconCircleCheck    },
  ]

  const supportLevels = [
    { label: "Not resolved",       color: "#ef4444", icon: IconThumbDownFilled, emptyIcon: IconThumbDown },
    { label: "Partially resolved", color: "#eab308", icon: IconCircleDotFilled,    emptyIcon: IconCircleDot    },
    { label: "Resolved",           color: "#22c55e", icon: IconThumbUpFilled,   emptyIcon: IconThumbUp   },
  ]

  return (
    <section id="feedback-module">
      <SectionHeading
        icon={IconMessage}
        label="Module · FeedbackModule"
        title="Feedback Module"
        description="Self-contained feedback collector: a RatingField, animated level label, optional comment textarea, and submit button — all wired together. Fully composable via the levels API."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <ExampleCard
          title="Restaurant Review"
          description="Post-visit feedback on a hospitality platform. Five mood levels with animated label and comment field."
          badge="showComment"
        >
          {serviceSubmitted ? (
            <SubmittedState
              emoji="🙏"
              heading="Thank you for your review!"
              sub="Your feedback helps improve the experience."
              onReset={() => {
                setServiceSubmitted(false)
                setServiceValue({ rating: 0, comment: "" })
              }}
            />
          ) : (
            <FeedbackModule
              value={serviceValue}
              onChange={setServiceValue}
              onSubmit={() => setServiceSubmitted(true)}
              title="How was your visit?"
              subtitle="Your feedback helps us improve."
              placeholder="What did you love, or what could be better?"
              submitLabel="Submit Review"
              showComment
              levels={restaurantLevels}
            />
          )}
        </ExampleCard>

        <ExampleCard
          title="Product Feature Feedback"
          description="In-app feedback panel for a SaaS product. Star-style levels with descriptive labels per rating."
          badge="5 levels"
        >
          {productSubmitted ? (
            <SubmittedState
              emoji="✅"
              heading="Feedback recorded!"
              sub="We'll use this to prioritise improvements."
              onReset={() => {
                setProductSubmitted(false)
                setProductValue({ rating: 0, comment: "" })
              }}
            />
          ) : (
            <FeedbackModule
              value={productValue}
              onChange={setProductValue}
              onSubmit={() => setProductSubmitted(true)}
              title="Rate this feature"
              subtitle="How well does the dashboard meet your needs?"
              placeholder="Tell us what's working or what's missing…"
              submitLabel="Send Feedback"
              showComment
              levels={productLevels}
            />
          )}
        </ExampleCard>

        <ExampleCard
          title="Support Ticket CSAT"
          description="Post-resolution rating widget. 3-level scale with async submit — isLoading shows a sending state."
          badge="isLoading"
        >
          {supportSubmitted ? (
            <SubmittedState
              emoji="📬"
              heading="Rating submitted!"
              sub="Ticket #84291 has been closed."
              onReset={() => {
                setSupportSubmitted(false)
                setSupportValue({ rating: 0, comment: "" })
              }}
            />
          ) : (
            <FeedbackModule
              value={supportValue}
              onChange={setSupportValue}
              onSubmit={handleSupportSubmit}
              title="Was your issue resolved?"
              subtitle="Rate your support experience for ticket #84291."
              placeholder="Any additional comments for our support team?"
              submitLabel="Close Ticket"
              showComment
              isLoading={supportLoading}
              levels={supportLevels}
            />
          )}
        </ExampleCard>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">

      {/* Header */}
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
            {[
              { href: "#tag-input",       label: "TagInput"       },
              { href: "#rating-field",    label: "RatingField"    },
              { href: "#feedback-module", label: "FeedbackModule" },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="hover:text-zinc-300 transition-colors">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 border border-zinc-800 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            3 components · 15 live examples
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100 mb-4 leading-[1.1]">
          Component Showcase
        </h1>
        <p className="text-base text-zinc-400 max-w-xl leading-relaxed mb-6">
          Real-world examples of every Bevel UI component. Click, type, and interact — everything
          here is live and driven by React state.
        </p>
        <div className="flex items-center gap-4 text-xs text-zinc-600 font-mono">
          {["TagInput", "RatingField", "FeedbackModule"].map((c) => (
            <span key={c} className="flex items-center gap-1.5">
              <IconChevronRight size={12} className="text-zinc-700" />
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-16 p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
          {[
            { value: "3",    label: "Components"    },
            { value: "15",   label: "Live Examples" },
            { value: "100%", label: "Interactive"   },
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
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-zinc-600 font-mono">
          <span>Bevel UI · Component Library</span>
          <span>All examples are interactive</span>
        </div>
      </footer>

    </div>
  )
}