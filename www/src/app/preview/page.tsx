"use client";
import { ChipSelect } from "@/registry/controls/chip-select";
import { FormEngine } from "@/registry/engines/form-engine";
import { FormConfig } from "@/registry/engines/form-engine/types";
import {
  SelectField,
  SelectOptionGroup,
} from "@/registry/controls/select-field";
import {
  IconBlender,
  IconCanary,
  IconCode,
  IconDatabase,
  IconTool,
  IconUTurnRight,
} from "@tabler/icons-react";
import z from "zod";

const testForm = z.object({
  firstName: z.string().min(1, "Enter your First name"),
  lastName: z.string(),
  email: z.string(),
  role: z.string(),
  skills: z.array(z.string()),
  rating: z.number(),
  bio: z.string(),
  agreeToTerms: z.boolean(),
});
type TestForm = z.infer<typeof testForm>;

const config: FormConfig<TestForm> = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "personal",
      title: "Personal Info",
      description: "Tell us a bit about yourself",
      fields: [
        {
          key: "firstName",
          variant: "text",
          label: "First Name",
          placeholder: "John",
          required: true,
        },
        {
          key: "lastName",
          variant: "text",
          label: "Last Name",
          placeholder: "Doe",
          required: true,
        },
        {
          key: "email",
          variant: "email",
          label: "Email",
          placeholder: "john@example.com",
          required: true,
        },
      ],
    },
    {
      id: "role",
      title: "Your Role",
      description: "What do you do?",
      fields: [
        {
          key: "role",
          variant: "card-select",
          label: "I am a...",
          required: true,
          props: {
            options: [
              {
                value: "developer",
                label: "Developer",
                description: "I build things",
                colorConfig: {
                  active: {
                    card: "bg-blue-500/10 border-blue-500/20 border",
                    text: "text-foreground",
                  },
                  disabled: { card: "opacity-70", text: "text-foreground" },
                  destructive: {
                    card: "bg-destructive",
                    text: "text-foreground",
                  },
                },
              },
              {
                value: "designer",
                label: "Designer",
                description: "I make things beautiful",
                colorConfig: {
                  active: {
                    card: "bg-purple-500/10 border-purple-500/20 border",
                    text: "text-foreground",
                  },
                  disabled: { card: "opacity-70", text: "text-foreground" },
                  destructive: {
                    card: "bg-destructive",
                    text: "text-foreground",
                  },
                },
              },
              {
                value: "manager",
                label: "Manager",
                description: "I lead teams",
                colorConfig: {
                  active: {
                    card: "bg-green-500/10 border-green-500/20 border",
                    text: "text-foreground",
                  },
                  disabled: { card: "opacity-70", text: "text-foreground" },
                  destructive: {
                    card: "bg-destructive",
                    text: "text-foreground",
                  },
                },
              },
            ],
          },
        },
        {
          key: "skills",
          variant: "tag-input",
          label: "Your Skills",
          placeholder: "Type a skill and press Enter",
        },
      ],
    },
    {
      id: "feedback",
      title: "Almost Done",
      description: "Just a few more things",
      fields: [
        {
          key: "rating",
          variant: "rating",
          label: "How would you rate your experience so far?",
        },
        {
          key: "bio",
          variant: "textarea",
          label: "Short Bio",
          placeholder: "Tell us about yourself...",
        },
        {
          key: "agreeToTerms",
          variant: "checkbox",
          label: "I agree to the terms and conditions",
          required: true,
        },
      ],
    },
  ],
  onSubmit: async (values) => {
    console.log("Form submitted:", values);
    alert(JSON.stringify(values, null, 2));
  },
};

export default function Preview() {
  return (
    <section className=" h-screen mx-auto max-w-xl font-sans flex flex-col justify-center">
      <div className="max-w-lg mx-auto py-16 px-4 w-full">
        <FormEngine schema={testForm} config={config} />
      </div>
    </section>
  );
}
