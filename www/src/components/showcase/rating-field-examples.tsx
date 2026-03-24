"use client"

import { useState } from "react"
import { RatingField } from "@/registry/controls/rating-field"
import {
  IconStar,
  IconMoodAngry,        IconMoodAngryFilled,
  IconMoodSad,          IconMoodSadFilled,
  IconMoodNeutral,      IconMoodNeutralFilled,
  IconMoodSmile,        IconMoodSmileFilled,
  IconMoodHappy,        IconMoodHappyFilled,
  IconCircle,           IconCircleFilled,
  IconFlame,            IconFlameFilled,
  IconThumbUp,          IconThumbUpFilled,
  IconThumbDown,        IconThumbDownFilled,
} from "@tabler/icons-react"
import { SectionHeading, ExampleCard, Hint } from "@/components/showcase/ui"

// Levels arrays defined outside the component — stable references, no recreations on render
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

// single mode — 2 options, thumb down or up
const npsLevels = [
  { color: "#ef4444", icon: IconThumbDownFilled, emptyIcon: IconThumbDown },
  { color: "#22c55e", icon: IconThumbUpFilled,   emptyIcon: IconThumbUp   },
]

const difficultyLabels = ["", "Beginner", "Easy", "Intermediate", "Advanced", "Expert"]
const moodLabels       = ["Frustrated", "Unhappy", "Neutral", "Happy", "Thrilled"]

export function RatingFieldExamples() {
  const [productRating,    setProductRating]    = useState(4)
  const [difficultyRating, setDifficultyRating] = useState(3)
  const [moodRating,       setMoodRating]       = useState(0)
  const [npsRating,        setNpsRating]        = useState(0)

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
          <Hint>Difficulty: {difficultyLabels[difficultyRating] ?? "Unset"}</Hint>
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
            {npsRating === 0 ? "Would you recommend us?" : npsRating === 1 ? "Not recommended" : "Recommended"}
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
