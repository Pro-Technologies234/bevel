"use client";

import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import { FormEngine, createZodPlugin } from "@/components/bevelui/form-engine";
import { TourRoot, TourAnchor, TourTrigger } from "@/components/bevelui/tour";
import {
  CommandPaletteRoot,
  CommandPaletteTrigger,
  type CommandPaletteSection,
} from "@/components/bevelui/command-palette";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconBoltFilled,
  IconUser,
  IconBell,
  IconPalette,
  IconShield,
  IconApi,
  IconCheck,
  IconSettings,
  IconSearch,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { FormEngineConfig } from "@/components/bevelui/form-engine";

// ─── Settings sections ────────────────────────────────────────────────────────

const SETTINGS_NAV = [
  { id: "profile", label: "Profile", icon: IconUser },
  { id: "notifications", label: "Notifications", icon: IconBell },
  { id: "appearance", label: "Appearance", icon: IconPalette },
  { id: "security", label: "Security", icon: IconShield },
  { id: "api", label: "API keys", icon: IconApi },
];

// ─── Command palette sections ─────────────────────────────────────────────────

const CMD_SECTIONS: CommandPaletteSection[] = [
  {
    id: "settings",
    title: "Settings",
    items: SETTINGS_NAV.map((s) => ({
      id: s.id,
      title: s.label,
      subtitle: `Jump to ${s.label} settings`,
      category: "setting",
      initials: s.label.slice(0, 2),
      initialsColor: "#c2f13c",
    })),
  },
  {
    id: "actions",
    title: "Quick actions",
    items: [
      {
        id: "reset",
        title: "Reset to defaults",
        subtitle: "Restore all settings",
        category: "action",
        initials: "↺",
        initialsColor: "#f59e0b",
      },
      {
        id: "export",
        title: "Export settings",
        subtitle: "Download as JSON",
        category: "action",
        initials: "↓",
        initialsColor: "#6366f1",
      },
      {
        id: "tour",
        title: "Restart tour",
        subtitle: "Walk through settings again",
        category: "action",
        initials: "◎",
        initialsColor: "#22c55e",
      },
    ],
  },
];

// ─── Tour steps ───────────────────────────────────────────────────────────────

const TOUR_STEPS = [
  {
    step: 1,
    title: "Settings overview",
    description:
      "All your preferences in one place. Use the sidebar to navigate between sections.",
    side: "bottom" as const,
  },
  {
    step: 2,
    title: "Navigation",
    description:
      "Switch between Profile, Notifications, Appearance, Security, and API settings.",
    side: "right" as const,
  },
  {
    step: 3,
    title: "Quick search",
    description:
      "Press ⌘K at any time to jump to any setting instantly without clicking through menus.",
    side: "bottom" as const,
  },
  {
    step: 4,
    title: "Save changes",
    description:
      "Your changes are previewed in real-time. Hit Save to apply them.",
    side: "left" as const,
  },
];

// ─── Profile form ─────────────────────────────────────────────────────────────

const profileSchema = {
  0: z.object({
    displayName: z.string().min(2, "At least 2 characters"),
    email: z.string().email(),
    bio: z.string().max(160, "Max 160 characters").optional(),
    website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    timezone: z.string().min(1),
  }),
};

const profileConfig: FormEngineConfig = {
  mode: "single",
  steps: [
    {
      id: "profile",
      title: "Profile settings",
      description: "How you appear to other members.",
      fields: [
        {
          key: "displayName",
          variant: "text",
          label: "Display name",
          placeholder: "Alex Johnson",
          required: true,
        },
        {
          key: "email",
          variant: "email",
          label: "Email",
          placeholder: "alex@example.com",
          required: true,
        },
        {
          key: "bio",
          variant: "textarea",
          label: "Bio",
          placeholder: "A short bio (max 160 characters)",
        },
        {
          key: "website",
          variant: "text",
          label: "Website",
          placeholder: "https://alexjohnson.dev",
        },
        {
          key: "timezone",
          variant: "select",
          label: "Timezone",
          required: true,
          props: {
            options: [
              { value: "UTC-8", label: "Pacific Time (UTC-8)" },
              { value: "UTC-5", label: "Eastern Time (UTC-5)" },
              { value: "UTC+0", label: "London (UTC+0)" },
              { value: "UTC+1", label: "Paris (UTC+1)" },
              { value: "UTC+3", label: "Lagos (UTC+3)" },
              { value: "UTC+5:30", label: "Mumbai (UTC+5:30)" },
              { value: "UTC+8", label: "Singapore (UTC+8)" },
            ],
          },
        },
      ],
    },
  ],
  // onSubmit: async () => { await new Promise((r) => setTimeout(r, 600)); },
};

// ─── Notifications form ───────────────────────────────────────────────────────

const notifConfig: FormEngineConfig = {
  mode: "single",
  steps: [
    {
      id: "notifications",
      title: "Notification preferences",
      description: "Control what you hear about and when.",
      fields: [
        {
          key: "emailFrequency",
          variant: "chip-select",
          label: "Email digest frequency",
          props: {
            options: [
              { value: "realtime", label: "Real-time" },
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "never", label: "Never" },
            ],
          },
        },
        {
          key: "notifyOn",
          variant: "chip-select",
          label: "Notify me about",
          props: {
            options: [
              { value: "deploys", label: "Deploys" },
              { value: "comments", label: "Comments" },
              { value: "mentions", label: "Mentions" },
              { value: "billing", label: "Billing" },
              { value: "updates", label: "Product updates" },
            ],
          },
        },
      ],
    },
  ],
  // onSubmit: async () => { await new Promise((r) => setTimeout(r, 600)); },
};

// ─── Appearance form ──────────────────────────────────────────────────────────

const appearanceConfig: FormEngineConfig = {
  mode: "single",
  steps: [
    {
      id: "appearance",
      title: "Appearance",
      description: "Make it look the way you like.",
      fields: [
        {
          key: "theme",
          variant: "card-select",
          label: "Theme",
          props: {
            columns: 3,
            options: [
              { value: "dark", label: "Dark", description: "Default" },
              { value: "light", label: "Light", description: "Bright mode" },
              { value: "system", label: "System", description: "Match OS" },
            ],
          },
        },
        {
          key: "density",
          variant: "chip-select",
          label: "UI density",
          props: {
            options: [
              { value: "compact", label: "Compact" },
              { value: "default", label: "Default" },
              { value: "comfortable", label: "Comfortable" },
            ],
          },
        },
        {
          key: "accentColor",
          variant: "chip-select",
          label: "Accent colour",
          props: {
            options: [
              { value: "lime", label: "Lime (default)" },
              { value: "indigo", label: "Indigo" },
              { value: "rose", label: "Rose" },
              { value: "amber", label: "Amber" },
            ],
          },
        },
      ],
    },
  ],
  // onSubmit: async () => { await new Promise((r) => setTimeout(r, 600)); },
};

// ─── Security form ────────────────────────────────────────────────────────────

const securityConfig: FormEngineConfig = {
  mode: "single",
  steps: [
    {
      id: "security",
      title: "Security",
      description: "Keep your account safe.",
      fields: [
        {
          key: "currentPassword",
          variant: "password",
          label: "Current password",
          placeholder: "••••••••",
        },
        {
          key: "newPassword",
          variant: "password",
          label: "New password",
          placeholder: "8+ characters",
        },
        {
          key: "confirmPassword",
          variant: "password",
          label: "Confirm new password",
          placeholder: "••••••••",
        },
        {
          key: "twoFactor",
          variant: "chip-select",
          label: "Two-factor authentication",
          props: {
            options: [
              { value: "disabled", label: "Disabled" },
              { value: "app", label: "Authenticator app" },
              { value: "sms", label: "SMS" },
            ],
          },
        },
      ],
    },
  ],
  // onSubmit: async () => { await new Promise((r) => setTimeout(r, 600)); },
};

// ─── Section config map ───────────────────────────────────────────────────────

const SECTION_CONFIGS: Record<string, FormEngineConfig> = {
  profile: profileConfig,
  notifications: notifConfig,
  appearance: appearanceConfig,
  security: securityConfig,
};

// ─── API Keys panel ───────────────────────────────────────────────────────────

function ApiKeysPanel() {
  const [keys] = useState([
    {
      id: "1",
      name: "Production",
      key: "bvl_live_sk_••••••••••••••••rT8x",
      created: "Apr 2025",
      lastUsed: "2m ago",
    },
    {
      id: "2",
      name: "Development",
      key: "bvl_test_sk_••••••••••••••••4kQz",
      created: "Mar 2025",
      lastUsed: "1d ago",
    },
  ]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-base font-bold tracking-tight">API keys</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Use these keys to authenticate CLI installs and API requests.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {keys.map((k) => (
          <div
            key={k.id}
            className="p-4 rounded-xl border border-border bg-muted/10"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{k.name}</span>
                <Badge variant="secondary" className="text-[10px]">
                  Active
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                Last used {k.lastUsed}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-background border border-border rounded-md px-3 py-1.5 text-xs font-mono text-muted-foreground">
                {k.key}
              </code>
              <Button variant="outline" size="sm" className="text-xs h-8">
                Copy
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Created {k.created}
            </p>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="w-fit gap-1.5">
        <IconApi size={13} />
        Generate new key
      </Button>
    </div>
  );
}

// ─── Saved toast ──────────────────────────────────────────────────────────────

function SavedToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-background text-sm font-medium shadow-lg z-50"
        >
          <IconCheck size={14} strokeWidth={2.5} />
          Settings saved
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Compass app ─────────────────────────────────────────────────────────

export default function CompassApp() {
  const [activeSection, setActiveSection] = useState("profile");
  const [savedToast, setSavedToast] = useState(false);

  function showSaved() {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2200);
  }

  const currentConfig = SECTION_CONFIGS[activeSection];
  const configWithSave = currentConfig
    ? {
        ...currentConfig,
        // onSubmit: async (...args: any[]) => {
        //   await currentConfig.onSubmit?.(...args);
        //   showSaved();
        // },
      }
    : null;

  return (
    <TourRoot steps={TOUR_STEPS} defaultOpen>
      <CommandPaletteRoot
        sections={CMD_SECTIONS}
        defaultOpen={false}
        onSelect={(item) => {
          if (SETTINGS_NAV.find((s) => s.id === item.id)) {
            setActiveSection(item.id);
          }
        }}
      >
        <div className="flex h-full rounded-2xl overflow-hidden border border-border bg-background">
          {/* Sidebar */}
          <TourAnchor step={2} asChild>
            <aside className="w-52 shrink-0 border-r border-border bg-muted/10 flex flex-col">
              <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <IconSettings size={12} color="#0a0a0a" />
                </div>
                <span className="font-bold text-sm">Settings</span>
              </div>

              <nav className="flex-1 p-2 flex flex-col gap-0.5">
                {SETTINGS_NAV.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left w-full",
                      activeSection === item.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <item.icon size={13} strokeWidth={1.8} />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="p-3 border-t border-border">
                <TourTrigger label="Take a tour" className="w-full text-xs" />
              </div>
            </aside>
          </TourAnchor>

          {/* Main */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header */}
            <TourAnchor step={1} asChild>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div>
                  <h1 className="text-sm font-semibold capitalize">
                    {activeSection}
                  </h1>
                  <p className="text-[11px] text-muted-foreground">
                    {SETTINGS_NAV.find((s) => s.id === activeSection)?.label}{" "}
                    settings
                  </p>
                </div>
                <TourAnchor step={3}>
                  <CommandPaletteTrigger
                    label="Jump to setting..."
                    className="h-8 text-xs w-44"
                  />
                </TourAnchor>
              </div>
            </TourAnchor>

            {/* Content */}
            <TourAnchor step={4} asChild>
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    {activeSection === "api" ? (
                      <ApiKeysPanel />
                    ) : configWithSave ? (
                      <FormEngine
                        config={configWithSave}
                        actionsProps={{
                          submitLabel: "Save changes",
                          layout: "stack",
                        }}
                        onSubmit={async () => {}}
                      />
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>
            </TourAnchor>
          </div>
        </div>

        <SavedToast visible={savedToast} />
      </CommandPaletteRoot>
    </TourRoot>
  );
}
