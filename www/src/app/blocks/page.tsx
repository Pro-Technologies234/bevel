// app/blocks/page.tsx
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blocks – Real component usage scenarios | Bevel",
  description:
    "Copy-paste-ready UI scenes demonstrating Bevel components in genuine real-world contexts.",
};

const blocks = [
  {
    slug: "dashboard-tour",
    name: "Dashboard Tour",
    description:
      "Product tour walkthrough for an analytics SaaS. Guides new users through 4 key UI areas with step-by-step highlighting.",
    systems: ["Product Tour", "Tooltip", "Button"],
    scenario: "Analytics SaaS – first-time user onboarding",
    route: "/blocks/dashboard-tour",
  },
  {
    slug: "command-palette-app",
    name: "Command Palette",
    description:
      "⌘K command menu for project management. Create tasks, navigate projects, and execute actions from anywhere.",
    systems: ["Command Palette", "Dialog", "Keyboard Shortcuts"],
    scenario: "Project management tool – power user productivity",
    route: "/blocks/command-palette-app",
  },
  {
    slug: "media-upload",
    name: "Media Upload",
    description:
      "Drag-and-drop file upload with modal preview, grid/list toggle, and asset library management.",
    systems: ["File Upload", "Modal", "Toggle Group", "Grid/List View"],
    scenario: "Creative asset library – batch upload & organization",
    route: "/blocks/media-upload",
  },
  {
    slug: "onboarding",
    name: "Onboarding Flow",
    description:
      "Multi-step SaaS post-signup flow. Collects role, goals, and team setup using card select, chips, and tag input.",
    systems: ["Form Engine", "CardSelect", "ChipSelect", "TagInput", "Stepper"],
    scenario: "SaaS post-signup – user profile & preferences",
    route: "/blocks/onboarding",
  },
  {
    slug: "settings",
    name: "Settings Page",
    description:
      "Complete profile settings with every form control in one real page: text, select, toggle, slider, radio, and more.",
    systems: [
      "Form Engine",
      "Input",
      "Select",
      "Toggle",
      "Slider",
      "Radio Group",
    ],
    scenario: "User account settings – all controls in context",
    route: "/blocks/settings",
  },
  {
    slug: "job-application",
    name: "Job Application",
    description:
      "Hiring platform form with personal info, experience rating, skills chips, and CV upload. Real validation flow.",
    systems: [
      "Form Engine",
      "File Upload",
      "ChipSelect",
      "RatingField",
      "SelectField",
    ],
    scenario: "Hiring platform – candidate submission",
    route: "/blocks/job-application",
  },
];

export default function BlocksPage() {
  return (
    <div className="min-h-screen  bg-black">
      {/* Hero section */}
      <div className="border-b border-zinc-200 dark:border-zinc-800  from-zinc-900 via-transparent to-transparent bg-linear-to-t">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-semibold  text-zinc-900 dark:text-white sm:text-5xl font-sans">
              Building Blocks for the Web
            </h1>
            <p className="mt-4 text-lg text-white max-w-xl">
              Clean, modern building blocks. Copy and paste into your apps.
              Works with all React frameworks. Open Source. Free forever.
            </p>
            <div className="mt-6 flex items-center justify-center gap-x-4 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                6 production-ready scenes
              </span>
              <span>•</span>
              <span>Fully typed TSX</span>
              <span>•</span>
              <span>Real component imports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blocks grid */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => (
            <Link
              key={block.slug}
              href={block.route}
              className="group relative flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {block.name}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {block.description}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 text-zinc-400 dark:text-zinc-600 group-hover:text-emerald-500">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Systems used */}
              <div className="mt-4 flex flex-wrap gap-2">
                {block.systems.map((system) => (
                  <span
                    key={system}
                    className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {system}
                  </span>
                ))}
              </div>

              {/* Scenario note */}
              <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <span className="font-medium">Scenario:</span> {block.scenario}
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center text-sm text-zinc-500 dark:text-zinc-500 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <p>
            Every block is a fully functional Next.js page using real Bevel
            components. Paths follow{" "}
            <code className="rounded bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 font-mono">
              app/blocks/[name]/page.tsx
            </code>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
