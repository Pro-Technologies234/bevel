"use client";

/**
 * Block: Profile & Preferences Settings
 * Systems used: Form Engine (single-step) + Controls (TagInput, RatingField, SelectField, ChipSelect)
 * Scenario: A user settings page where developers can see all 5 controls
 * working together inside a single-step Form Engine configuration.
 *
 * Drop into: app/blocks/settings/page.tsx
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormEngineRoot,
  FormEngineStepCanvas,
  FormEngineNavigation,
} from "@/components/bevelui/form-engine";
import { Separator } from "@/components/ui/separator";

import { useState } from "react";
import {
  IconCheck,
  IconUser,
  IconBell,
  IconShield,
  IconPalette,
} from "@tabler/icons-react";

// ─── Schema ───────────────────────────────────────────────────────────────────

const settingsSchema = z.object({
  displayName: z.string().min(2, "Display name is required"),
  bio: z.string().max(160, "Bio can't exceed 160 characters"),
  timezone: z.string().min(1, "Please select a timezone"),
  skills: z.array(z.string()),
  notifications: z.array(z.string()),
  experienceRating: z.number().min(1, "Please rate your experience"),
});

type SettingsForm = z.infer<typeof settingsSchema>;

const timezoneOptions = [
  {
    group: "Americas",
    options: [
      { value: "America/New_York", label: "Eastern Time (ET) — UTC−5" },
      { value: "America/Chicago", label: "Central Time (CT) — UTC−6" },
      { value: "America/Los_Angeles", label: "Pacific Time (PT) — UTC−8" },
      { value: "America/Sao_Paulo", label: "Brasília (BRT) — UTC−3" },
    ],
  },
  {
    group: "Europe & Africa",
    options: [
      { value: "Europe/London", label: "London (GMT) — UTC+0" },
      { value: "Europe/Paris", label: "Paris (CET) — UTC+1" },
      { value: "Africa/Lagos", label: "Lagos (WAT) — UTC+1" },
      { value: "Africa/Nairobi", label: "Nairobi (EAT) — UTC+3" },
    ],
  },
  {
    group: "Asia & Pacific",
    options: [
      { value: "Asia/Dubai", label: "Dubai (GST) — UTC+4" },
      { value: "Asia/Kolkata", label: "Mumbai (IST) — UTC+5:30" },
      { value: "Asia/Singapore", label: "Singapore (SGT) — UTC+8" },
      { value: "Australia/Sydney", label: "Sydney (AEDT) — UTC+11" },
    ],
  },
];

const notificationOptions = [
  { value: "product-updates", label: "Product updates" },
  { value: "team-activity", label: "Team activity" },
  { value: "mentions", label: "Mentions & replies" },
  { value: "weekly-digest", label: "Weekly digest" },
  { value: "security-alerts", label: "Security alerts" },
];

const sidebarItems = [
  { icon: IconUser, label: "Profile", active: true },
  { icon: IconBell, label: "Notifications" },
  { icon: IconShield, label: "Security" },
  { icon: IconPalette, label: "Appearance" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SettingsBlock() {
  const [saved, setSaved] = useState(false);

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: "Jamie Donovan",
      bio: "Product designer turned developer. Building things that feel right.",
      timezone: "Europe/London",
      skills: ["React", "TypeScript", "Figma", "Design Systems"],
      notifications: ["mentions", "security-alerts", "weekly-digest"],
      experienceRating: 4,
    },
  });

  // const steps: FormEngineStepDef[] = [
  //   {
  //     id: "profile",
  //     title: "Profile",
  //     description: "",

  //   },
  // ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top nav */}
      <header className="h-14 border-b border-border flex items-center px-6 gap-4">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-primary" />
          <span className="font-semibold text-sm">Acme</span>
        </div>
        <Separator orientation="vertical" className="h-5" />
        <span className="text-sm text-muted-foreground">Settings</span>
        {saved && (
          <div className="ml-auto flex items-center gap-1.5 text-xs text-green-500">
            <IconCheck size={13} />
            Changes saved
          </div>
        )}
      </header>

      <div className="max-w-4xl mx-auto flex gap-8 px-6 py-10">
        {/* Sidebar */}
        <nav className="w-48 shrink-0 space-y-0.5">
          {sidebarItems.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        {/* Form */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-lg font-semibold">Profile Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your personal info, preferences, and notification settings.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <FormEngineRoot
              config={{ steps: [] }}
              onSubmit={async () => {
                const valid = await form.trigger();
                if (valid) {
                  setSaved(true);
                  setTimeout(() => setSaved(false), 3000);
                }
              }}
            >
              <FormEngineStepCanvas />
              <div className="mt-8 pt-6 border-t border-border flex justify-end">
                <FormEngineNavigation
                  submitLabel="Save changes"
                  // showPrev={false}
                />
              </div>
            </FormEngineRoot>
          </div>
        </div>
      </div>
    </div>
  );
}
