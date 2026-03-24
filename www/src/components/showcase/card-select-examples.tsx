"use client";

import { useState } from "react";
import {
  CardSelect,
  type CardSelectOption,
} from "@/registry/controls/card-select";
import {
  IconLayoutGrid,
  IconBolt,
  IconBuildingStore,
  IconCode,
  IconPalette,
  IconDeviceLaptop,
  IconBriefcase,
  IconRocket,
  IconBuildingBank,
  IconUsers,
  IconShield,
  IconChartBar,
  IconColorSwatch,
  IconSun,
  IconMoon,
  IconContrast,
  IconBrandReact,
  IconBrandVue,
  IconBrandAngular,
  IconBrandNextjs,
  IconBrandSvelte,
} from "@tabler/icons-react";
import { SectionHeading, ExampleCard, Hint } from "@/components/showcase/ui";

// ─── Option sets ──────────────────────────────────────────────────────────────

const projectTypeOptions: CardSelectOption[] = [
  {
    value: "saas",
    label: "SaaS App",
    description: "Multi-tenant web application with auth and billing.",
    icon: IconRocket,
    badge: "Popular",
  },
  {
    value: "ecommerce",
    label: "E-Commerce",
    description: "Storefront with product catalog and checkout flow.",
    icon: IconBuildingStore,
  },
  {
    value: "dashboard",
    label: "Dashboard",
    description: "Internal analytics or operations control panel.",
    icon: IconChartBar,
  },
  {
    value: "api",
    label: "API Service",
    description: "Backend-only REST or GraphQL API project.",
    icon: IconCode,
  },
  {
    value: "marketing",
    label: "Marketing Site",
    description: "Landing page or content-driven public website.",
    icon: IconBolt,
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Large-scale internal tooling with SSO.",
    icon: IconBuildingBank,
    badge: "Custom",
  },
];

const teamRoleOptions: CardSelectOption[] = [
  {
    value: "founder",
    label: "Founder",
    description: "Building the product from the ground up.",
    icon: IconRocket,
  },
  {
    value: "engineer",
    label: "Engineer",
    description: "Writing and shipping production code.",
    icon: IconCode,
  },
  {
    value: "designer",
    label: "Designer",
    description: "Shaping the product's look and feel.",
    icon: IconPalette,
  },
  {
    value: "pm",
    label: "Product Manager",
    description: "Defining roadmap and prioritising work.",
    icon: IconBriefcase,
  },
];

const frameworkOptions: CardSelectOption[] = [
  { value: "react", label: "React", icon: IconBrandReact },
  { value: "vue", label: "Vue", icon: IconBrandVue },
  { value: "angular", label: "Angular", icon: IconBrandAngular },
  { value: "nextjs", label: "Next.js", icon: IconBrandNextjs },
  { value: "svelte", label: "Svelte", icon: IconBrandSvelte },
];

const featureOptions: CardSelectOption[] = [
  {
    value: "auth",
    label: "Authentication",
    description: "Email/password, OAuth, MFA.",
    icon: IconShield,
  },
  {
    value: "billing",
    label: "Billing",
    description: "Stripe integration and subscription management.",
    icon: IconBuildingBank,
    badge: "Paid",
  },
  {
    value: "analytics",
    label: "Analytics",
    description: "Event tracking and custom dashboards.",
    icon: IconChartBar,
  },
  {
    value: "team",
    label: "Teams",
    description: "Invite members, roles, and permissions.",
    icon: IconUsers,
  },
  {
    value: "api",
    label: "Public API",
    description: "RESTful API with API key management.",
    icon: IconCode,
    badge: "Beta",
  },
  {
    value: "cms",
    label: "CMS",
    description: "Content modeling and rich text editing.",
    icon: IconDeviceLaptop,
  },
];

const themeOptions: CardSelectOption[] = [
  { value: "light", label: "Light", icon: IconSun },
  { value: "dark", label: "Dark", icon: IconMoon },
  { value: "system", label: "System", icon: IconContrast },
];

export function CardSelectExamples() {
  const [projectType, setProjectType] = useState("saas");
  const [role, setRole] = useState("engineer");
  const [framework, setFramework] = useState("nextjs");
  const [features, setFeatures] = useState<string[]>(["auth", "billing"]);
  const [theme, setTheme] = useState("dark");

  return (
    <section id="card-select">
      <SectionHeading
        icon={IconLayoutGrid}
        label="Component · CardSelect"
        title="Card Select"
        description="Visual card-based selector for single and multi-pick scenarios. Supports grid, list, and horizontal scroll layouts with icons, badges, and descriptions per option."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ── Grid, single ──────────────────────────────────────────── */}

        <ExampleCard
          title="Project Type Selector"
          description="Single-select grid used in a new project wizard. Each card has an icon, description, and optional badge."
          badge="grid · columns={3}"
        >
          <CardSelect
            options={projectTypeOptions}
            value={projectType}
            onChange={setProjectType}
            layout="grid"
            columns={3}
            size="sm"
          />
          <Hint>
            Selected:{" "}
            {projectTypeOptions.find((o) => o.value === projectType)?.label ??
              "None"}
          </Hint>
        </ExampleCard>

        {/* ── Grid, multi ───────────────────────────────────────────── */}

        <ExampleCard
          title="Feature Picker"
          description="Multi-select up to 4 features during project setup. Shows the active selection ring and max cap."
          badge="multiple · max={4}"
        >
          <CardSelect
            options={featureOptions}
            multiple
            value={features}
            onChange={setFeatures}
            max={4}
            layout="grid"
            columns={3}
            size="sm"
          />
          <Hint>
            {features.length}/4 features selected
            {features.length === 4 ? " — limit reached" : ""}
          </Hint>
        </ExampleCard>

        {/* ── List layout ───────────────────────────────────────────── */}

        <ExampleCard
          title="Team Role"
          description="List layout for a role picker in an onboarding flow. Each card stretches full-width with icon and description."
          badge="list"
        >
          <CardSelect
            options={teamRoleOptions}
            value={role}
            onChange={setRole}
            layout="list"
            size="md"
          />
          <Hint>
            Role:{" "}
            {teamRoleOptions.find((o) => o.value === role)?.label ?? "None"}
          </Hint>
        </ExampleCard>

        {/* ── Scroll layout ─────────────────────────────────────────── */}

        <ExampleCard
          title="Framework Selector"
          description="Horizontal scroll layout for a compact inline picker. Snaps per card and never wraps — ideal for tight UIs."
          badge="scroll"
        >
          <CardSelect
            options={frameworkOptions}
            value={framework}
            onChange={setFramework}
            layout="scroll"
            size="sm"
          />
          <Hint>
            Framework:{" "}
            {frameworkOptions.find((o) => o.value === framework)?.label ??
              "None"}
          </Hint>
        </ExampleCard>

        {/* ── columns={2}, lg size ──────────────────────────────────── */}

        <ExampleCard
          title="Appearance Theme"
          description="2-column grid with lg sizing for a settings page. Fewer options — larger hit targets."
          badge="columns={3} · size='lg'"
          className="md:col-span-2 xl:col-span-1"
        >
          <CardSelect
            options={themeOptions}
            value={theme}
            onChange={setTheme}
            layout="grid"
            columns={3}
            size="lg"
          />
          <Hint>
            Theme:{" "}
            {themeOptions.find((o) => o.value === theme)?.label ?? "None"}
          </Hint>
        </ExampleCard>
      </div>
    </section>
  );
}
