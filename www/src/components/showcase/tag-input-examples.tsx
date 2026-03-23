"use client"

import { useState } from "react"
import { TagInput } from "@/registry/controls/tag-input"
import { IconCode } from "@tabler/icons-react"
import { SectionHeading, ExampleCard, Hint } from "@/components/showcase/ui"

export function TagInputExamples() {
  const [techStack, setTechStack]     = useState<string[]>(["React", "TypeScript", "Tailwind"])
  const [ingredients, setIngredients] = useState<string[]>(["garlic", "olive oil", "tomatoes"])
  const [keywords, setKeywords]       = useState<string[]>(["nextjs", "performance"])
  const [disabledTags]                = useState<string[]>(["accessibility", "react", "tailwind", "animation"])

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
            defaultValue={disabledTags}
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
