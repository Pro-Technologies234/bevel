import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { IconArrowRight } from "@tabler/icons-react";

// ─── Coming Soon Section ───────────────────────────────────────────────────

const systems = [
  {
    name: "Application Tour",
    description:
      "Pointer, tooltip, next/skip logic. Drop in and guide your users.",
    status: "Building",
    eta: "Soon",
  },
  {
    name: "Form Engine",
    description:
      "State machine, validation, back/forward, progress — all solved.",
    status: "Building",
    eta: "Soon",
  },
  {
    name: "Onboarding Checklist",
    description: "Completion tracking, step logic, persistent progress.",
    status: "Building",
    eta: "Soon",
  },
  {
    name: "Command Palette",
    description: "Keyboard navigation, fuzzy search, dynamic actions.",
    status: "Planned",
    eta: "Q3",
  },
  {
    name: "Notification Center",
    description: "Real-time, read/unread, grouping, persistence.",
    status: "Planned",
    eta: "Q3",
  },
  {
    name: "File Upload",
    description: "Drag-drop, progress, preview, error recovery.",
    status: "Planned",
    eta: "Q3",
  },
];

export function ComingSoon() {
  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-32 flex flex-col items-center gap-12">
      {/* Heading */}
      <div className="flex flex-col items-center gap-2 text-center">
        <Badge
          variant="secondary"
          className="bg-muted/80 border border-border/70 p-3 px-4 gap-2  select-none uppercase"
        >
          <span className="h-1.5 w-1.5 rounded-full dark:bg-green-400 bg-green-600 animate-pulse" />
          Systems in progress
        </Badge>
        <h2 className="text-4xl font-semibold tracking-tight max-w-2xl font-sans mt-5">
          Every hard UI system. Coming soon.
        </h2>
        <p className="text-muted-foreground max-w-lg">
          Each system ships fully engineered — state, logic, edge cases solved.
          No half-finished primitives. No assembly required.
        </p>
      </div>

      {/* Systems grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {systems.map((system) => (
          <div
            key={system.name}
            className="group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/30 p-5 hover:border-border hover:bg-muted/50 transition-all duration-200"
          >
            {/* Status badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {system.eta}
              </span>
              <Badge
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  system.status === "Building"
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground border border-border/60"
                }`}
              >
                {system.status == "Building" && <Spinner />}
                {system.status}
              </Badge>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5">
              <h3 className="font-medium text-base font-sans">{system.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {system.description}
              </p>
            </div>

            {/* Hover arrow */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <IconArrowRight size={14} className="text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">
          Get notified when the first systems drop.
        </p>
        <InputGroup className="h-10 pr-0.5">
          <InputGroupInput
            type="email"
            placeholder="your@email.com"
            className="w-72 "
          />
          <InputGroupButton variant={"inverted"} className="h-8 px-4">
            Notify me
          </InputGroupButton>
        </InputGroup>
      </div>
    </section>
  );
}
