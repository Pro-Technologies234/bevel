"use client";

import { useState } from "react";
import {
  SelectField,
  type SelectOption,
  type SelectOptionGroup,
} from "@/registry/controls/select-field";
import {
  IconSelector,
  IconFlag,
  IconBriefcase,
  IconCode,
  IconPalette,
  IconChartBar,
  IconShield,
  IconBuildingStore,
  IconGlobe,
  IconClock,
  IconLanguage,
  IconBuilding,
  IconUsers,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { SectionHeading, ExampleCard, Hint } from "@/components/showcase/ui";

// ─── Flat option sets ─────────────────────────────────────────────────────────

const countryOptions: SelectOption[] = [
  { value: "ng", label: "Nigeria", icon: IconFlag },
  { value: "us", label: "United States", icon: IconFlag },
  { value: "gb", label: "United Kingdom", icon: IconFlag },
  { value: "de", label: "Germany", icon: IconFlag },
  { value: "fr", label: "France", icon: IconFlag },
  { value: "ca", label: "Canada", icon: IconFlag },
  { value: "au", label: "Australia", icon: IconFlag },
  { value: "jp", label: "Japan", icon: IconFlag },
];

const currencyOptions: SelectOption[] = [
  { value: "usd", label: "USD — US Dollar" },
  { value: "eur", label: "EUR — Euro" },
  { value: "gbp", label: "GBP — British Pound" },
  { value: "ngn", label: "NGN — Nigerian Naira" },
  { value: "jpy", label: "JPY — Japanese Yen" },
  { value: "cad", label: "CAD — Canadian Dollar" },
];

const timezoneOptions: SelectOption[] = [
  { value: "utc-12", label: "UTC−12 · Baker Island" },
  { value: "utc-8", label: "UTC−8 · Pacific Time" },
  { value: "utc-5", label: "UTC−5 · Eastern Time" },
  { value: "utc+0", label: "UTC+0 · London" },
  { value: "utc+1", label: "UTC+1 · West Africa" },
  { value: "utc+2", label: "UTC+2 · Central Africa" },
  { value: "utc+3", label: "UTC+3 · East Africa / Riyadh" },
  { value: "utc+5.5", label: "UTC+5:30 · India" },
  { value: "utc+8", label: "UTC+8 · Singapore / China" },
  { value: "utc+9", label: "UTC+9 · Tokyo" },
];

// ─── Grouped option sets ──────────────────────────────────────────────────────

const departmentOptions: SelectOptionGroup[] = [
  {
    group: "Product",
    icon: IconBuilding,
    options: [
      { value: "design", label: "Design", icon: IconPalette },
      { value: "eng", label: "Engineering", icon: IconCode },
      { value: "product", label: "Product", icon: IconChartBar },
    ],
  },
  {
    group: "Go-To-Market",
    icon: IconBuildingStore,
    options: [
      { value: "marketing", label: "Marketing", icon: IconChartBar },
      { value: "sales", label: "Sales", icon: IconCurrencyDollar },
      { value: "cs", label: "Customer Success", icon: IconUsers },
    ],
  },
  {
    group: "Operations",
    icon: IconBriefcase,
    options: [
      { value: "security", label: "Security", icon: IconShield },
      { value: "hr", label: "People Ops", icon: IconUsers },
      { value: "finance", label: "Finance", icon: IconCurrencyDollar },
    ],
  },
];

const languageOptions: SelectOptionGroup[] = [
  {
    group: "Most Popular",
    options: [
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
      { value: "fr", label: "French" },
      { value: "zh", label: "Chinese (Mandarin)" },
      { value: "ar", label: "Arabic" },
    ],
  },
  {
    group: "African Languages",
    options: [
      { value: "yo", label: "Yoruba" },
      { value: "ha", label: "Hausa" },
      { value: "ig", label: "Igbo" },
      { value: "sw", label: "Swahili" },
      { value: "am", label: "Amharic" },
    ],
  },
  {
    group: "European Languages",
    options: [
      { value: "de", label: "German" },
      { value: "pt", label: "Portuguese" },
      { value: "it", label: "Italian" },
      { value: "nl", label: "Dutch" },
      { value: "pl", label: "Polish" },
    ],
  },
];

export function SelectFieldExamples() {
  const [country, setCountry] = useState("ng");
  const [currency, setCurrency] = useState("usd");
  const [timezone, setTimezone] = useState("utc+1");
  const [dept, setDept] = useState("eng");
  const [language, setLanguage] = useState("en");

  return (
    <section id="select-field">
      <SectionHeading
        icon={IconSelector}
        label="Component · SelectField"
        title="Select Field"
        description="Dropdown selector supporting flat and grouped option lists, optional icons per option, loading skeleton state, and full controlled/uncontrolled modes."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <ExampleCard
          title="Country Selector"
          description="Flat option list with a flag icon per entry. Used in address and billing forms."
          badge="flat · icons"
        >
          <SelectField
            options={countryOptions}
            value={country}
            onChange={setCountry}
            placeholder="Select country…"
          />
          <Hint>
            Selected:{" "}
            {countryOptions.find((o) => o.value === country)?.label ?? "None"}
          </Hint>
        </ExampleCard>

        <ExampleCard
          title="Department Picker"
          description="Grouped options with a section header icon per group. Used in HR onboarding and user profile flows."
          badge="grouped · icons"
        >
          <SelectField
            options={departmentOptions}
            value={dept}
            onChange={setDept}
            placeholder="Select department…"
          />
          <Hint>
            Department:{" "}
            {departmentOptions
              .flatMap((g) => g.options)
              .find((o) => o.value === dept)?.label ?? "None"}
          </Hint>
        </ExampleCard>

        <ExampleCard
          title="Language Preference"
          description="Three option groups covering global, African, and European languages. Used in account settings."
          badge="3 groups"
        >
          <SelectField
            options={languageOptions}
            value={language}
            onChange={setLanguage}
            placeholder="Select language…"
          />
          <Hint>
            Language:{" "}
            {languageOptions
              .flatMap((g) => g.options)
              .find((o) => o.value === language)?.label ?? "None"}
          </Hint>
        </ExampleCard>

        <ExampleCard
          title="Currency"
          description="Flat currency list for a payments settings page. Label includes the currency code and full name."
          badge="flat"
        >
          <SelectField
            options={currencyOptions}
            value={currency}
            onChange={setCurrency}
            placeholder="Select currency…"
          />
          <Hint>
            Active:{" "}
            {currencyOptions.find((o) => o.value === currency)?.label ?? "None"}
          </Hint>
        </ExampleCard>

        <ExampleCard
          title="Timezone"
          description="Long flat list for timezone selection. The placeholder guides the user before selection."
          badge="long list"
        >
          <SelectField
            options={timezoneOptions}
            value={timezone}
            onChange={setTimezone}
            placeholder="Select timezone…"
          />
          <Hint>
            Timezone:{" "}
            {timezoneOptions.find((o) => o.value === timezone)?.label ?? "None"}
          </Hint>
        </ExampleCard>

        <ExampleCard
          title="Loading State"
          description="isLoading replaces the trigger with a full-width skeleton — used while options are fetched async."
          badge="isLoading"
        >
          <SelectField
            options={[]}
            isLoading
            placeholder="Loading…"
            onChange={() => {}}
          />
          <Hint>Fetching options from API…</Hint>
        </ExampleCard>
      </div>
    </section>
  );
}
