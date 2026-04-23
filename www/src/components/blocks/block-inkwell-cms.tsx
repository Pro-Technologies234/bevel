"use client";

/**
 * BLOCK: Inkwell — Content Management System
 * A full CMS with article editor, media library, and publish flow.
 * Bevel: File Upload (cover/media) + Command Palette (search/navigate) + Form Engine (publish settings)
 * shadcn: Card, Badge, Button, Tabs, Dialog, Avatar, Separator, ScrollArea, Switch, Progress
 * motion/react: article list entrance, editor focus states, publish success
 */

import { useState } from "react";
import { motion } from "motion/react";
import { z } from "zod";

// ─── Bevel Systems ────────────────────────────────────────────────────────────
import {
  FileUploadRoot,
  FileUploadDropzone,
  FileUploadList,
} from "@/components/bevelui/file-upload";

import {
  CommandPaletteRoot,
  CommandPaletteTrigger,
} from "@/components/bevelui/command-palette";
import type { CommandPaletteSection } from "@/components/bevelui/command-palette";

import {
  FormEngineRoot,
  FormEngineProgress,
  FormEngineStepMeta,
  FormEngineStepCanvas,
  FormEngineNavigation,
  createZodPlugin,
  type FormEngineConfig,
} from "@/components/bevelui/form-engine";

// ─── shadcn/ui ────────────────────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";

// ─── Icons ────────────────────────────────────────────────────────────────────
import {
  IconSearch,
  IconPlus,
  IconFileText,
  IconPhoto,
  IconSettings,
  IconEye,
  IconWorld,
  IconBolt,
  IconPencil,
  IconDots,
  IconSend,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ArticleStatus = "draft" | "review" | "scheduled" | "published";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: ArticleStatus;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  updated: string;
  words: number;
};

// ─── Seed Data ────────────────────────────────────────────────────────────────
const ARTICLES: Article[] = [
  {
    id: "a1",
    title: "Building a Design System from Scratch",
    slug: "building-design-system",
    excerpt:
      "A deep dive into the process, tools, and decisions behind creating a scalable component library.",
    status: "published",
    category: "Engineering",
    tags: ["design-systems", "react", "typescript"],
    author: "JD",
    readTime: "8 min",
    updated: "Today",
    words: 2400,
  },
  {
    id: "a2",
    title: "The Case for Copy-to-Own Components",
    slug: "copy-to-own-components",
    excerpt:
      "Why giving developers ownership of their UI code — rather than locking them into a package — is the right call.",
    status: "draft",
    category: "Product",
    tags: ["dx", "open-source"],
    author: "JD",
    readTime: "5 min",
    updated: "Yesterday",
    words: 1200,
  },
  {
    id: "a3",
    title: "React 19 in Production: What We Learned",
    slug: "react-19-production",
    excerpt:
      "Six months of running React 19 on a production app with 50k daily users. Here's what actually matters.",
    status: "review",
    category: "Engineering",
    tags: ["react", "performance"],
    author: "MK",
    readTime: "12 min",
    updated: "2d ago",
    words: 3600,
  },
  {
    id: "a4",
    title: "AI-Assisted Code Review at Scale",
    slug: "ai-code-review",
    excerpt:
      "How we integrated LLM-based reviews into our PR workflow without slowing down the team.",
    status: "scheduled",
    category: "DevOps",
    tags: ["ai", "automation", "git"],
    author: "SR",
    readTime: "6 min",
    updated: "3d ago",
    words: 1800,
  },
  {
    id: "a5",
    title: "Zod v4: Everything That Changed",
    slug: "zod-v4-changes",
    excerpt:
      "A practical migration guide covering the breaking changes, new features, and performance improvements.",
    status: "published",
    category: "Libraries",
    tags: ["zod", "typescript", "validation"],
    author: "JD",
    readTime: "7 min",
    updated: "Last week",
    words: 2100,
  },
];

const STATUS_CONFIG: Record<ArticleStatus, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground" },
  review: { label: "In Review", color: "bg-yellow-500/10 text-yellow-500" },
  scheduled: { label: "Scheduled", color: "bg-blue-500/10 text-blue-400" },
  published: { label: "Published", color: "bg-green-500/10 text-green-500" },
};

// ─── Command Palette Data ─────────────────────────────────────────────────────
const PALETTE_SECTIONS: CommandPaletteSection[] = [
  {
    id: "articles",
    title: "Recent Articles",
    items: ARTICLES.slice(0, 4).map((a) => ({
      id: a.id,
      title: a.title,
      subtitle: `${a.category} · ${a.status} · ${a.updated}`,
      meta: a.readTime,
    })),
  },
  {
    id: "nav",
    title: "Navigate",
    items: [
      {
        id: "n1",
        title: "New article",
        icon: <IconPlus size={16} />,
        meta: "⌘N",
      },
      { id: "n2", title: "Media library", icon: <IconPhoto size={16} /> },
      { id: "n3", title: "View published site", icon: <IconWorld size={16} /> },
    ],
  },
];

// ─── Options for form fields ──────────────────────────────────────────────────
const categoryOptions = [
  {
    group: "Technical",
    options: [
      { value: "engineering", label: "Engineering" },
      { value: "devops", label: "DevOps" },
      { value: "libraries", label: "Libraries" },
    ],
  },
  {
    group: "Business",
    options: [
      { value: "product", label: "Product" },
      { value: "company", label: "Company" },
    ],
  },
];

const channelOptions = [
  { value: "newsletter", label: "Newsletter" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "rss", label: "RSS Feed" },
];

// ─── Simulated upload function ────────────────────────────────────────────────
async function simulateUpload(
  file: File,
  onProgress: (pct: number) => void,
): Promise<{ url: string }> {
  return new Promise((resolve) => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 20 + 10;
      if (p >= 100) {
        clearInterval(iv);
        onProgress(100);
        resolve({ url: URL.createObjectURL(file) });
      } else {
        onProgress(Math.min(p, 99));
      }
    }, 100);
  });
}

// ─── Article Row Component ────────────────────────────────────────────────────
function ArticleRow({
  article,
  index,
  onEdit,
}: {
  article: Article;
  index: number;
  onEdit: (a: Article) => void;
}) {
  const { label, color } = STATUS_CONFIG[article.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted/40 cursor-pointer transition-colors"
      onClick={() => onEdit(article)}
    >
      <div className="size-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
        <IconFileText size={16} className="text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{article.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-muted-foreground">
            {article.category}
          </span>
          <span className="text-[10px] text-muted-foreground">·</span>
          <span className="text-[10px] text-muted-foreground">
            {article.words.toLocaleString()} words
          </span>
          <span className="text-[10px] text-muted-foreground">·</span>
          <span className="text-[10px] text-muted-foreground">
            {article.updated}
          </span>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-1.5">
        {article.tags.slice(0, 2).map((t) => (
          <Badge key={t} variant="outline" className="text-[9px] py-0">
            {t}
          </Badge>
        ))}
      </div>
      <Badge className={`text-[10px] shrink-0 ${color}`}>{label}</Badge>
      <Avatar className="size-6 shrink-0">
        <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
          {article.author}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="size-7">
          <IconPencil size={12} />
        </Button>
        <Button variant="ghost" size="icon" className="size-7">
          <IconDots size={12} />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Editor Panel Component ───────────────────────────────────────────────────
function EditorPanel({
  article,
  onPublish,
}: {
  article: Article;
  onPublish: () => void;
}) {
  const [title, setTitle] = useState(article.title);
  const [body, setBody] = useState(
    `# ${article.title}\n\n${article.excerpt}\n\n## Introduction\n\nStart writing your article here…`,
  );
  const words = body.split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Badge
            className={`text-[10px] ${STATUS_CONFIG[article.status].color}`}
          >
            {STATUS_CONFIG[article.status].label}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {words} words · ~{Math.ceil(words / 200)} min read
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs cursor-pointer"
          >
            <IconEye size={12} />
            Preview
          </Button>
          <Button
            size="sm"
            className="gap-1.5 text-xs cursor-pointer"
            onClick={onPublish}
          >
            <IconSend size={12} />
            Publish settings
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="max-w-2xl mx-auto p-8 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold bg-transparent outline-none placeholder:text-muted-foreground/40 resize-none"
            placeholder="Article title…"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground border-b border-border pb-4">
            <Avatar className="size-5">
              <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                {article.author}
              </AvatarFallback>
            </Avatar>
            <span>
              {article.author === "JD" ? "Jamie Donovan" : article.author}
            </span>
            <span>·</span>
            <span>{article.category}</span>
            <span>·</span>
            <span>Updated {article.updated}</span>
          </div>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[400px] resize-none border-0 p-0 text-sm leading-7 focus-visible:ring-0 bg-transparent shadow-none"
            placeholder="Start writing…"
          />
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── Publish Dialog (Form Engine) ─────────────────────────────────────────────
// Per‑step Zod schemas
const stepSchemas = {
  0: z.object({
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    category: z.string().min(1, "Select a category"),
    tags: z.array(z.string()).optional(),
  }),
  1: z.object({}), // Cover step – no validation
  2: z.object({
    channels: z.array(z.string()).optional(),
    seoTitle: z.string().min(3, "SEO title must be at least 3 characters"),
    seoDesc: z.string().optional(),
  }),
};

const PUBLISH_CONFIG: FormEngineConfig = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "meta",
      title: "Article metadata",
      description: "Slug, category, and tags.",
      fields: [
        {
          key: "slug",
          variant: "text",
          label: "URL slug",
          required: true,
          placeholder: "my-article-slug",
          // Custom prefix rendering can be done with layout override if needed
        },
        {
          key: "category",
          variant: "select",
          label: "Category",
          required: true,
          props: {
            options: categoryOptions,
            placeholder: "Select category",
          },
        },
        {
          key: "tags",
          variant: "tag-input",
          label: "Tags",
          props: {
            placeholder: "Add a tag…",
          },
        },
      ],
    },
    {
      id: "cover",
      title: "Cover image",
      description: "Shown in article listings and social previews.",
      fields: [], // Custom rendering via stepOverrides
    },
    {
      id: "distribute",
      title: "Distribution",
      description: "Where do you want to publish this?",
      fields: [
        {
          key: "channels",
          variant: "chip-select",
          label: "Share to channels",
          props: {
            options: channelOptions,
            multiple: true,
          },
        },
        {
          key: "seoTitle",
          variant: "text",
          label: "SEO title",
          required: true,
        },
        {
          key: "seoDesc",
          variant: "textarea",
          label: "SEO description",
          placeholder: "Shown in search results…",
        },
      ],
    },
  ],
};

function PublishDialog({
  article,
  open,
  onOpenChange,
}: {
  article: Article | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [published, setPublished] = useState(false);

  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log("Publishing with settings:", values);
    setPublished(true);
  };

  if (published) {
    return (
      <Dialog
        open={open}
        onOpenChange={(v) => {
          onOpenChange(v);
          if (!v) setPublished(false);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <div className="text-center py-8 space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto"
            >
              <IconWorld size={28} className="text-primary" />
            </motion.div>
            <h3 className="font-semibold text-lg">Article published!</h3>
            <p className="text-sm text-muted-foreground">
              Your article is now live. Subscribers will be notified.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" className="gap-1.5">
                <IconEye size={13} />
                View post
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  setPublished(false);
                }}
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publish settings</DialogTitle>
        </DialogHeader>

        <FormEngineRoot
          config={PUBLISH_CONFIG}
          plugins={[createZodPlugin(stepSchemas)]}
          defaultValues={{
            0: {
              slug: article?.slug ?? "",
              category: article?.category?.toLowerCase() ?? "",
              tags: article?.tags ?? [],
            },
            2: {
              seoTitle: article?.title ?? "",
            },
          }}
          onSubmit={handleSubmit}
        >
          <div className="mb-5">
            <FormEngineProgress />
          </div>
          <FormEngineStepMeta />
          <div className="mt-4">
            <FormEngineStepCanvas
            // stepOverrides={{
            //   meta: () => {
            //     // Custom slug input with prefix for step 0
            //     const { form } = useFormEngineContext();
            //     return (
            //       <div className="space-y-4">
            //         <div className="space-y-1.5">
            //           <Label>URL slug *</Label>
            //           <div className="flex items-center gap-2">
            //             <span className="text-xs text-muted-foreground bg-muted px-2.5 py-2 rounded-l-md border border-border border-r-0">
            //               yourblog.com/
            //             </span>
            //             <Input
            //               className="rounded-l-none"
            //               {...form.register("slug")}
            //             />
            //           </div>
            //         </div>
            //         <FormEngineStepCanvas /> {/* renders the rest of the fields */}
            //       </div>
            //     );
            //   },
            //   cover: () => (
            //     <FileUploadRoot
            //       config={{
            //         accept: { "image/*": [] },
            //         maxSize: 5 * 1024 * 1024,
            //         maxFiles: 1,
            //         title: "Upload cover image",
            //         description: "JPG, PNG, or WebP · Recommended 1200×630px",
            //       }}
            //       onUpload={simulateUpload}
            //     >
            //       <FileUploadDropzone />
            //       <div className="mt-3">
            //         <FileUploadList />
            //       </div>
            //     </FileUploadRoot>
            //   ),
            //   distribute: () => {
            //     // Add the newsletter switch after fields
            //     const { form } = useFormEngineContext();
            //     return (
            //       <div className="space-y-5">
            //         <FormEngineStepCanvas />
            //         <div className="flex items-center justify-between rounded-lg border border-border p-3">
            //           <div>
            //             <p className="text-sm font-medium">Notify subscribers</p>
            //             <p className="text-xs text-muted-foreground">
            //               Send a newsletter to your email list
            //             </p>
            //           </div>
            //           <Switch defaultChecked />
            //         </div>
            //       </div>
            //     );
            //   },
            // }}
            />
          </div>
          <div className="mt-6">
            <FormEngineNavigation
              submitLabel="Publish now →"
              nextLabel="Continue →"
              backLabel="← Back"
            />
          </div>
        </FormEngineRoot>
      </DialogContent>
    </Dialog>
  );
}

// Need to import useFormEngineContext and Label
import { useFormEngineContext } from "@/components/bevelui/form-engine";
import { Label } from "@/components/ui/label";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InkwellBlock() {
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [selected, setSelected] = useState<Article | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("all");

  const published = articles.filter((a) => a.status === "published").length;
  const drafts = articles.filter((a) => a.status === "draft").length;

  const filtered = articles.filter((a) => {
    if (activeNav === "published") return a.status === "published";
    if (activeNav === "drafts") return a.status === "draft";
    if (activeNav === "review") return a.status === "review";
    return true;
  });

  return (
    <CommandPaletteRoot sections={PALETTE_SECTIONS}>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 border-r border-border flex flex-col p-3 shrink-0">
          <div className="flex items-center gap-2 px-2 py-3 mb-2">
            <div className="size-6 rounded-md bg-primary flex items-center justify-center">
              <IconBolt size={12} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">Inkwell</span>
          </div>

          {[
            { id: "all", label: "All articles", count: articles.length },
            { id: "published", label: "Published", count: published },
            { id: "drafts", label: "Drafts", count: drafts },
            { id: "review", label: "In review", count: 1 },
          ].map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => {
                setActiveNav(id);
                setSelected(null);
              }}
              className={`flex items-center justify-between px-2.5 py-2 rounded-md text-sm transition-colors ${
                activeNav === id && !selected
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{label}</span>
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            </button>
          ))}

          <Separator className="my-3" />
          <button className="flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <IconPhoto size={14} />
            Media library
          </button>
          <button className="flex items-center gap-2 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <IconSettings size={14} />
            Settings
          </button>
        </aside>

        {/* Main content */}
        {selected ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-5 py-2.5 border-b border-border flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => setSelected(null)}
              >
                ← All articles
              </Button>
            </div>
            <EditorPanel
              article={selected}
              onPublish={() => setPublishOpen(true)}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="h-12 border-b border-border flex items-center justify-between px-5 shrink-0">
              <span className="text-sm font-medium capitalize">
                {activeNav === "all" ? "All articles" : activeNav} ·{" "}
                {filtered.length}
              </span>
              <div className="flex items-center gap-2">
                <CommandPaletteTrigger asChild>
                  <button className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-md text-xs text-muted-foreground transition-colors cursor-pointer">
                    <IconSearch size={12} />
                    Search…{" "}
                    <kbd className="ml-1 text-[10px] bg-background border border-border px-1 rounded font-mono">
                      ⌘K
                    </kbd>
                  </button>
                </CommandPaletteTrigger>
                <Button
                  size="sm"
                  className="gap-1.5 text-xs cursor-pointer"
                  onClick={() =>
                    setArticles((prev) => [
                      {
                        id: `a${prev.length + 1}`,
                        title: "Untitled draft",
                        slug: "untitled",
                        excerpt: "",
                        status: "draft",
                        category: "Engineering",
                        tags: [],
                        author: "JD",
                        readTime: "1 min",
                        updated: "Just now",
                        words: 0,
                      },
                      ...prev,
                    ])
                  }
                >
                  <IconPlus size={13} />
                  New article
                </Button>
              </div>
            </header>

            {/* Stats */}
            <div className="flex items-center gap-8 px-5 py-3 border-b border-border">
              {[
                {
                  label: "Published",
                  value: published,
                  color: "text-green-500",
                },
                {
                  label: "Drafts",
                  value: drafts,
                  color: "text-muted-foreground",
                },
                {
                  label: "Total words",
                  value: `${(articles.reduce((a, c) => a + c.words, 0) / 1000).toFixed(1)}k`,
                  color: "text-foreground",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${color}`}>
                    {value}
                  </span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-0.5">
                {filtered.map((a, i) => (
                  <ArticleRow
                    key={a.id}
                    article={a}
                    index={i}
                    onEdit={setSelected}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      <PublishDialog
        article={selected}
        open={publishOpen}
        onOpenChange={setPublishOpen}
      />
    </CommandPaletteRoot>
  );
}
