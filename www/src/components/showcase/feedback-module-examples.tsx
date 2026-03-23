"use client"

import { useState } from "react"
import { FeedbackModule, type Feedback } from "@/registry/modules/feedback-module"
import {
  IconMessage,
  IconMoodAngry,        IconMoodAngryFilled,
  IconMoodSad,          IconMoodSadFilled,
  IconMoodNeutral,      IconMoodNeutralFilled,
  IconMoodSmile,        IconMoodSmileFilled,
  IconMoodHappy,        IconMoodHappyFilled,
  IconCircle,           IconCircleFilled,
  IconCircleCheck,      IconCircleCheckFilled,
  IconAlertCircle,      IconAlertCircleFilled,
  IconThumbUp,          IconThumbUpFilled,
  IconThumbDown,        IconThumbDownFilled,
} from "@tabler/icons-react"
import { SectionHeading, ExampleCard, SubmittedState } from "@/components/showcase/ui"

// Levels defined outside component — stable references, correct Tabler Icon types
const restaurantLevels = [
  { label: "Terrible",  color: "#ef4444", icon: IconMoodAngryFilled,   emptyIcon: IconMoodAngry   },
  { label: "Poor",      color: "#f97316", icon: IconMoodSadFilled,     emptyIcon: IconMoodSad     },
  { label: "Okay",      color: "#eab308", icon: IconMoodNeutralFilled, emptyIcon: IconMoodNeutral },
  { label: "Good",      color: "#22c55e", icon: IconMoodSmileFilled,   emptyIcon: IconMoodSmile   },
  { label: "Excellent", color: "#3b82f6", icon: IconMoodHappyFilled,   emptyIcon: IconMoodHappy   },
]

const productLevels = [
  { label: "Unusable",    color: "#ef4444", icon: IconAlertCircleFilled, emptyIcon: IconAlertCircle    },
  { label: "Needs work",  color: "#f97316", icon: IconCircleFilled,      emptyIcon: IconCircle         },
  { label: "Acceptable",  color: "#eab308", icon: IconCircleFilled,      emptyIcon: IconCircle         },
  { label: "Solid",       color: "#6366f1", icon: IconCircleCheckFilled, emptyIcon: IconCircleCheck    },
  { label: "Exceptional", color: "#10b981", icon: IconCircleCheckFilled, emptyIcon: IconCircleCheck    },
]

const supportLevels = [
  { label: "Not resolved",       color: "#ef4444", icon: IconThumbDownFilled, emptyIcon: IconThumbDown },
  { label: "Partially resolved", color: "#eab308", icon: IconCircleFilled,    emptyIcon: IconCircle    },
  { label: "Resolved",           color: "#22c55e", icon: IconThumbUpFilled,   emptyIcon: IconThumbUp   },
]

const EMPTY: Feedback = { rating: 0, comment: "" }

export function FeedbackModuleExamples() {
  const [serviceValue,  setServiceValue]  = useState<Feedback>(EMPTY)
  const [productValue,  setProductValue]  = useState<Feedback>(EMPTY)
  const [supportValue,  setSupportValue]  = useState<Feedback>(EMPTY)

  const [serviceSubmitted, setServiceSubmitted] = useState(false)
  const [productSubmitted, setProductSubmitted] = useState(false)
  const [supportLoading,   setSupportLoading]   = useState(false)
  const [supportSubmitted, setSupportSubmitted] = useState(false)

  const handleSupportSubmit = () => {
    setSupportLoading(true)
    setTimeout(() => {
      setSupportLoading(false)
      setSupportSubmitted(true)
    }, 1800)
  }

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
              onReset={() => { setServiceSubmitted(false); setServiceValue(EMPTY) }}
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
              onReset={() => { setProductSubmitted(false); setProductValue(EMPTY) }}
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
              onReset={() => { setSupportSubmitted(false); setSupportValue(EMPTY) }}
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
