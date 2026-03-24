"use client"

import { useState } from "react"
import { ChipSelect, type ChipOption } from "@/registry/controls/chip-select"
import {
  IconLayoutGrid,
  IconBolt,
  IconPalette,
  IconBriefcase,
  IconCode,
  IconChartBar,
  IconShield,
  IconBuildingStore,
  IconClock,
  IconCalendar,
  IconUrgent,
  IconFlag,
  IconArrowUp,
  IconArrowRight,
  IconArrowDown,
  IconCheck,
  IconLoader,
  IconX,
  IconBug,
  IconSparkles,
  IconRefresh,
} from "@tabler/icons-react"
import { SectionHeading, ExampleCard, Hint } from "@/components/showcase/ui"

// ─── Static option sets ───────────────────────────────────────────────────────

const categoryOptions: ChipOption[] = [
  { value: "design",      label: "Design",      icon: IconPalette,       badge: 24  },
  { value: "engineering", label: "Engineering", icon: IconCode,          badge: 118 },
  { value: "marketing",   label: "Marketing",   icon: IconChartBar,      badge: 36  },
  { value: "sales",       label: "Sales",       icon: IconBuildingStore, badge: 9   },
  { value: "security",    label: "Security",    icon: IconShield,        badge: 5   },
  { value: "operations",  label: "Operations",  icon: IconBriefcase,     badge: 17  },
]

const planOptions: ChipOption[] = [
  {
    value: "hobby",
    label: "Hobby",
    color: "#6366f1",
    description: "For personal projects. Up to 3 deployments.",
  },
  {
    value: "pro",
    label: "Pro",
    color: "#f59e0b",
    description: "For professionals. Unlimited deployments.",
  },
  {
    value: "team",
    label: "Team",
    color: "#10b981",
    description: "Collaborative workspace for up to 20 members.",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    color: "#8b5cf6",
    description: "Custom limits, SSO, and SLA support.",
    disabled: true,
  },
]

const priorityOptions: ChipOption[] = [
  { value: "urgent",   label: "Urgent",   icon: IconUrgent,    color: "#ef4444" },
  { value: "high",     label: "High",     icon: IconArrowUp,   color: "#f97316" },
  { value: "medium",   label: "Medium",   icon: IconArrowRight,color: "#eab308" },
  { value: "low",      label: "Low",      icon: IconArrowDown, color: "#22c55e" },
]

const statusOptions: ChipOption[] = [
  { value: "backlog",      label: "Backlog",      icon: IconClock   },
  { value: "in_progress",  label: "In Progress",  icon: IconLoader  },
  { value: "in_review",    label: "In Review",    icon: IconRefresh },
  { value: "done",         label: "Done",         icon: IconCheck   },
  { value: "cancelled",    label: "Cancelled",    icon: IconX       },
]

const availabilityOptions: ChipOption[] = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat", color: "#6366f1" },
  { value: "sun", label: "Sun", color: "#6366f1" },
]

const tagOptions: ChipOption[] = [
  { value: "bug",      label: "Bug",      icon: IconBug,      color: "#ef4444" },
  { value: "feature",  label: "Feature",  icon: IconSparkles, color: "#6366f1" },
  { value: "perf",     label: "Perf",     icon: IconBolt,     color: "#f59e0b" },
  { value: "dx",       label: "DX",       icon: IconCode,     color: "#10b981" },
  { value: "security", label: "Security", icon: IconShield,   color: "#8b5cf6" },
]

export function ChipSelectExamples() {
  // Single-select states
  const [category,    setCategory]    = useState<string>("engineering")
  const [plan,        setPlan]        = useState<string>("pro")
  const [priority,    setPriority]    = useState<string>("medium")
  const [status,      setStatus]      = useState<string>("in_progress")

  // Multi-select states
  const [availability, setAvailability] = useState<string[]>(["mon", "tue", "wed", "thu", "fri"])
  const [tags,         setTags]         = useState<string[]>(["bug", "feature"])

  return (
    <section id="chip-select">
      <SectionHeading
        icon={IconLayoutGrid}
        label="Component · ChipSelect"
        title="Chip Select"
        description="Single and multi-select pill chooser with custom colors, icons, badges, tooltips, disabled states, and a horizontal scroll mode for overflow."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* ── Single select ─────────────────────────────── */}

        <ExampleCard
          title="Content Category Filter"
          description="Single-select filter bar for a knowledge base. Badge shows article count per category."
          badge="single · badge"
        >
          <ChipSelect
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            size="sm"
          />
          <Hint>
            Active: {categoryOptions.find(o => o.value === category)?.label ?? "None"}
          </Hint>
        </ExampleCard>

        <ExampleCard
          title="Subscription Plan Picker"
          description="Plan selector with custom per-chip colors and tooltip descriptions. Enterprise is disabled."
          badge="color · tooltip · disabled"
        >
          <ChipSelect
            options={planOptions}
            value={plan}
            onChange={setPlan}
            size="md"
          />
          <Hint>
            Selected: {planOptions.find(o => o.value === plan)?.label ?? "None"}
          </Hint>
        </ExampleCard>

        <ExampleCard
          title="Task Priority Selector"
          description="Priority picker for an issue tracker. Each chip uses a custom color to communicate severity."
          badge="color · icons"
        >
          <ChipSelect
            options={priorityOptions}
            value={priority}
            onChange={setPriority}
            size="md"
          />
          <Hint>
            Priority: {priorityOptions.find(o => o.value === priority)?.label ?? "None"}
          </Hint>
        </ExampleCard>

        <ExampleCard
          title="Issue Status"
          description="Kanban status selector. canWrap=false enables horizontal scroll for overflow without wrapping."
          badge="canWrap={false}"
        >
          <ChipSelect
            options={statusOptions}
            value={status}
            onChange={setStatus}
            size="sm"
            canWrap={false}
          />
          <Hint>
            Status: {statusOptions.find(o => o.value === status)?.label ?? "None"}
          </Hint>
        </ExampleCard>

        {/* ── Multi select ──────────────────────────────── */}

        <ExampleCard
          title="Availability Days"
          description="Multi-select day picker for a scheduling tool. Weekend chips use a custom indigo color."
          badge="multiple · color"
        >
          <ChipSelect
            options={availabilityOptions}
            multiple
            value={availability}
            onChange={setAvailability}
            size="sm"
          />
          <Hint>
            {availability.length > 0
              ? `${availability.length} day${availability.length !== 1 ? "s" : ""} selected`
              : "No days selected"}
          </Hint>
        </ExampleCard>

        <ExampleCard
          title="Issue Label Tagger"
          description="Multi-select labels for a GitHub-style issue. max={3} prevents over-tagging. Loading state also shown."
          badge="multiple · max={3}"
        >
          <ChipSelect
            options={tagOptions}
            multiple
            value={tags}
            onChange={setTags}
            size="sm"
            max={3}
          />
          <Hint>
            {tags.length}/3 labels — {tags.length === 3 ? "limit reached" : "select up to 3"}
          </Hint>
        </ExampleCard>

      </div>
    </section>
  )
}
