"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wrapper } from "@/components/shared/wrapper";

gsap.registerPlugin(ScrollTrigger);

const TABS = [
  { label: "Product Tour", lang: "tsx" },
  { label: "Form Engine", lang: "tsx" },
  { label: "File Upload", lang: "tsx" },
];

const CODE = [
  // Product Tour
  `import { TourRoot, TourAnchor, TourTrigger } from "@/components/bevelui/tour";

const steps = [
  {
    step: 1,
    title: "Upload your files",
    description: "Drag and drop, or click to browse. Supports any format.",
    side: "bottom",
  },
  {
    step: 2,
    title: "Preview before submitting",
    description: "Review everything before it goes live.",
    side: "left",
    media: {
      type: "video",
      src: "/demos/preview.mp4",
    },
  },
];

export default function App() {
  return (
    <TourRoot steps={steps} defaultOpen>
      <TourAnchor step={1}>
        <UploadButton />
      </TourAnchor>

      <TourAnchor step={2} asChild>
        <PreviewPanel />
      </TourAnchor>

      <TourTrigger label="Take a tour" />
    </TourRoot>
  );
}`,

  // Form Engine
  `import { FormEngine, createZodPlugin } from "@/components/bevelui/form-engine";
import { z } from "zod";

const schemas = {
  0: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
  1: z.object({
    plan: z.enum(["free", "pro", "enterprise"]),
    workspace: z.string().min(2),
  }),
};

const config = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "account",
      title: "Create your account",
      fields: [
        { key: "email", variant: "email", label: "Email", required: true },
        { key: "password", variant: "password", label: "Password", required: true },
      ],
    },
    {
      id: "workspace",
      title: "Set up your workspace",
      fields: [
        { key: "plan", variant: "card-select", label: "Plan" },
        { key: "workspace", variant: "text", label: "Workspace name" },
      ],
    },
  ],
  onSubmit: async (values) => {
    await createAccount(values);
  },
};

export default function Signup() {
  return (
    <FormEngine
      config={config}
      plugins={[createZodPlugin(schemas)]}
    />
  );
}`,

  // File Upload
  `import { FileUploadRoot } from "@/components/bevelui/file-upload";

export default function UploadPage() {
  return (
    <FileUploadRoot
      config={{
        accept: { "image/*": [".jpg", ".png", ".webp"] },
        maxSize: 5 * 1024 * 1024,
        maxFiles: 10,
        title: "Drop your images here",
        description: "JPG, PNG or WebP up to 5MB",
      }}
      onUpload={async (file, onProgress) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const { url } = await res.json();
        return { url };
      }}
      onComplete={(files) => {
        console.log("Uploaded:", files.map((f) => f.url));
      }}
    />
  );
}`,
];

const HIGHLIGHTS: Record<string, string> = {
  import: "#c792ea",
  from: "#c792ea",
  export: "#c792ea",
  default: "#c792ea",
  const: "#c792ea",
  async: "#c792ea",
  await: "#c792ea",
  return: "#c792ea",
  function: "#c792ea",
};

function colorize(line: string): React.ReactNode {
  if (line.trim().startsWith("//"))
    return <span style={{ color: "#4a6370" }}>{line}</span>;
  const parts = line.split(
    /(".*?"|'.*?'|`.*?`|\b(?:import|export|default|from|const|async|await|return|function)\b)/g,
  );
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (
          (part.startsWith('"') && part.endsWith('"')) ||
          (part.startsWith("'") && part.endsWith("'")) ||
          (part.startsWith("`") && part.endsWith("`"))
        )
          return (
            <span key={i} style={{ color: "#c2f13c" }}>
              {part}
            </span>
          );
        if (HIGHLIGHTS[part])
          return (
            <span key={i} style={{ color: HIGHLIGHTS[part] }}>
              {part}
            </span>
          );
        return (
          <span key={i} style={{ color: "rgba(255,255,255,0.78)" }}>
            {part}
          </span>
        );
      })}
    </>
  );
}

function CodeBlock({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: 13,
        lineHeight: 1.85,
        padding: "20px 0",
        maxHeight: 400,
        overflow: "auto",
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className="flex px-5 hover:bg-white/[0.018] transition-colors"
        >
          <span
            style={{
              color: "rgba(255,255,255,0.1)",
              marginRight: 20,
              minWidth: 22,
              textAlign: "right",
              userSelect: "none",
              flexShrink: 0,
            }}
          >
            {i + 1}
          </span>
          <span className="whitespace-pre">{colorize(line)}</span>
        </div>
      ))}
    </div>
  );
}

export default function CodeDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const copy = () => {
    navigator.clipboard.writeText(CODE[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <Wrapper>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className=" flex flex-col items-center text-center gap-2"
        >
          <h2 className="text-4xl md:text-5xl font-sans font-medium leading-tight ">
            Composable. Unsurprising.
          </h2>
          <p className=" max-w-2xl ">
            Each system follows a root-provider pattern — familiar if you've
            used Radix or shadcn. Accessible from the first import, extensible
            without forking.
          </p>

          <div className="grid grid-cols-3 gap-3 py-8">
            {[
              { n: "4", label: "Systems" },
              { n: "5+", label: "Controls" },
              { n: "0", label: "Runtime deps" },
            ].map((s) => (
              <div key={s.label} className=" flex-col flex items-center">
                <span className="text-5xl font-bold tracking-tight font-sans gradient-primary">
                  {s.n}
                </span>
                <span className="text-xs mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#0d0d0d",
          }}
        >
          <div
            className="flex items-center justify-between px-4 h-11"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "#161616",
            }}
          >
            <div className="flex gap-1">
              {TABS.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className="px-3 py-1.5 rounded-md text-[12px] transition-all duration-150"
                  style={{
                    background:
                      activeTab === i ? "rgba(194,241,60,0.1)" : "transparent",
                    color:
                      activeTab === i ? "#c2f13c" : "rgba(255,255,255,0.3)",
                    fontFamily: "monospace",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={copy}
              className="text-[11px] px-2.5 py-1.5 rounded-md transition-all duration-150"
              style={{
                color: copied ? "#c2f13c" : "rgba(255,255,255,0.25)",
                background: "transparent",
                border: "none",
                fontFamily: "monospace",
                cursor: "pointer",
              }}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CodeBlock code={CODE[activeTab]} />
          </motion.div>
        </motion.div>
      </Wrapper>
    </section>
  );
}
