"use client";

import { Badge } from "@/components/ui/badge";
import { FileUploadModal, FileUploadRoot } from "@/registry/file-upload";
import type { FileUploadConfig } from "@/registry/file-upload";

// ─── Simulated upload for the demo ────────────────────────────────────────────

async function simulateUpload(
  file: File,
  onProgress: (pct: number) => void,
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 4;
      if (progress >= 100) {
        clearInterval(interval);
        onProgress(100);
        // Simulate occasional error for demo purposes
        if (file.name.startsWith("fail")) {
          reject(new Error("Upload failed — filename starts with 'fail'"));
        } else {
          resolve({ url: URL.createObjectURL(file) });
        }
      } else {
        onProgress(Math.min(Math.round(progress), 99));
      }
    }, 120);
  });
}

// ─── Code block ───────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
      <pre className="overflow-x-auto p-4 text-xs text-foreground/80 leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Props table ──────────────────────────────────────────────────────────────

function PropsTable({
  rows,
}: {
  rows: {
    prop: string;
    type: string;
    default?: string;
    description: string;
  }[];
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
              Prop
            </th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
              Type
            </th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
              Default
            </th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
            >
              <td className="px-4 py-2.5 font-mono text-primary">{row.prop}</td>
              <td className="px-4 py-2.5 font-mono text-muted-foreground">
                {row.type}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {row.default ?? "—"}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground leading-relaxed">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FileUploadDocsPage() {
  return (
    <div className="flex flex-1 min-w-0">
      <main className="flex-1 min-w-0 px-10 py-12 max-w-3xl flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <Badge
            variant="secondary"
            className="w-fit bg-primary/10 text-primary border-primary/20 text-xs px-2.5 py-1"
          >
            System
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">
            File Upload
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
            A complete file upload system with drag-and-drop, per-file progress
            tracking, error recovery, cancel support, and grid/list views. Bring
            your own upload function — the system handles everything else.
          </p>
          <div className="mt-1 h-px bg-border/60" />
        </div>

        {/* Live demo */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">Live demo</h2>
          <p className="text-sm text-muted-foreground">
            Drop any files below. Upload progress is simulated. Name a file
            starting with{" "}
            <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">
              fail
            </code>{" "}
            to trigger the error state.
          </p>

          <div className="p-6 rounded-xl border border-border bg-muted/10 max-w-lg">
            <FileUploadRoot
              onUpload={simulateUpload}
              config={{
                multiple: true,
                maxFiles: 10,
                maxSize: 10 * 1024 * 1024,
                title: "Drop your files here",
                description:
                  "Supports any file type up to 10MB. Max 10 files.",
              }}
              onComplete={(files) =>
                console.log("All done:", files.map((f) => f.url))
              }
              onError={(id, err) => console.error("Error on", id, err)}
            />
            <FileUploadModal
  open={false}
  // onOpenChange={setIsOpen}
  dialogTitle="Upload your video"
  config={{
    accept: { "video/*": [".mp4", ".mov"] },
    maxSize: 500 * 1024 * 1024,
    title: "Drop your video here",
    description: "For best results, upload at least 1080p MP4.",
  }}
  onUpload={simulateUpload}
  // onUpload={async (file, onProgress) => {
  //   const url = await uploadToS(file, onProgress);
  //   return { url };
  // }}
/>
          </div>
        </div>

        {/* Installation */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">Installation</h2>
          <p className="text-sm text-muted-foreground">
            One peer dependency for drag-and-drop handling.
          </p>
          <CodeBlock code={`npm install react-dropzone`} />
          <p className="text-sm text-muted-foreground">
            Then copy the files into{" "}
            <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">
              registry/file-upload/
            </code>
            .
          </p>
        </div>

        {/* Basic usage */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">Basic usage</h2>
          <p className="text-sm text-muted-foreground">
            The simplest usage is{" "}
            <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">
              FileUploadRoot
            </code>{" "}
            with your{" "}
            <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">
              onUpload
            </code>{" "}
            function. That's it.
          </p>
          <CodeBlock
            code={`import { FileUploadRoot } from "@/registry/file-upload";

<FileUploadRoot
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
  onComplete={(files) => console.log("Uploaded:", files)}
/>`}
          />
        </div>

        {/* With config */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">
            With config
          </h2>
          <p className="text-sm text-muted-foreground">
            Pass a{" "}
            <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">
              config
            </code>{" "}
            prop to restrict file types, size, and count. The dropzone
            automatically shows these constraints as hints.
          </p>
          <CodeBlock
            code={`<FileUploadRoot
  config={{
    accept: { "image/*": [".jpg", ".png", ".webp"] },
    maxSize: 5 * 1024 * 1024,   // 5MB in bytes
    maxFiles: 5,
    multiple: true,
    title: "Upload product images",
    description: "JPG, PNG, or WebP up to 5MB",
  }}
  onUpload={...}
/>`}
          />
        </div>

        {/* With progress */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">
            Real upload progress
          </h2>
          <p className="text-sm text-muted-foreground">
            Call{" "}
            <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">
              onProgress(pct)
            </code>{" "}
            with a number 0–100 during the upload. With XHR you get this for free:
          </p>
          <CodeBlock
            code={`onUpload={async (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      const { url } = JSON.parse(xhr.responseText);
      resolve({ url });
    });

    xhr.addEventListener("error", () => reject(new Error("Upload failed")));

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
}}`}
          />
        </div>

        {/* Programmatic control */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">
            Programmatic control
          </h2>
          <p className="text-sm text-muted-foreground">
            Use{" "}
            <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">
              useFileUpload
            </code>{" "}
            anywhere inside{" "}
            <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">
              FileUploadRoot
            </code>{" "}
            to build custom UI.
          </p>
          <CodeBlock
            code={`import { useFileUpload } from "@/registry/file-upload";

function MyUploadButton() {
  const {
    files,
    uploadAll,
    isUploading,
    addFiles,
    removeFile,
    cancelFile,
    retryFile,
  } = useFileUpload();

  return (
    <button onClick={uploadAll} disabled={isUploading}>
      Upload {files.filter(f => f.status === "idle").length} files
    </button>
  );
}`}
          />
        </div>

        {/* Custom layout */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">Custom layout</h2>
          <p className="text-sm text-muted-foreground">
            Pass children to{" "}
            <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">
              FileUploadRoot
            </code>{" "}
            to replace the default dropzone + list with your own components.
            All context actions are still available via{" "}
            <code className="text-xs bg-muted border border-border rounded px-1 py-0.5">
              useFileUpload
            </code>
            .
          </p>
          <CodeBlock
            code={`<FileUploadRoot onUpload={...}>
  <MyDropzone />       {/* reads addFiles, isDragging from context */}
  <MySidebar />        {/* reads files, removeFile from context */}
  <MyUploadButton />   {/* reads uploadAll, isUploading from context */}
</FileUploadRoot>`}
          />
        </div>

        {/* FileUploadRoot props */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">
            FileUploadRoot
          </h2>
          <PropsTable
            rows={[
              {
                prop: "onUpload",
                type: "(file, onProgress) => Promise<{ url, meta? }>",
                description:
                  "Your upload function. Call onProgress(0–100) during upload. Return { url } on success. Throw to trigger error state.",
              },
              {
                prop: "config",
                type: "FileUploadConfig",
                description:
                  "Restrict file types, size, and count. Also sets dropzone title and description.",
              },
              {
                prop: "onComplete",
                type: "(files: FileEntry[]) => void",
                description:
                  "Called when all files have finished uploading successfully.",
              },
              {
                prop: "onError",
                type: "(id, error) => void",
                description:
                  "Called when an individual file upload fails.",
              },
              {
                prop: "children",
                type: "ReactNode",
                description:
                  "Optional. Pass children to replace the default layout.",
              },
            ]}
          />
        </div>

        {/* FileUploadConfig */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">
            FileUploadConfig
          </h2>
          <PropsTable
            rows={[
              {
                prop: "accept",
                type: "Accept",
                description:
                  "react-dropzone Accept object. E.g. { 'image/*': ['.jpg', '.png'] }",
              },
              {
                prop: "maxSize",
                type: "number",
                description: "Max file size in bytes.",
              },
              {
                prop: "maxFiles",
                type: "number",
                description: "Max number of files allowed.",
              },
              {
                prop: "multiple",
                type: "boolean",
                default: "true",
                description: "Allow selecting multiple files.",
              },
              {
                prop: "title",
                type: "string",
                default: '"Drop your files here"',
                description: "Heading shown in the dropzone.",
              },
              {
                prop: "description",
                type: "string",
                description: "Supporting text shown below the title.",
              },
              {
                prop: "icon",
                type: "ReactNode",
                description: "Custom icon in the dropzone. Defaults to upload arrow.",
              },
            ]}
          />
        </div>

        {/* FileEntry */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-tight">FileEntry</h2>
          <PropsTable
            rows={[
              { prop: "id", type: "string", description: "Auto-generated unique ID." },
              { prop: "file", type: "File", description: "The native browser File object." },
              {
                prop: "status",
                type: '"idle" | "uploading" | "done" | "error"',
                description: "Current upload state of this file.",
              },
              {
                prop: "progress",
                type: "number",
                description: "Upload progress 0–100.",
              },
              {
                prop: "url",
                type: "string",
                description: "The uploaded file URL — set when status is done.",
              },
              {
                prop: "error",
                type: "string",
                description: "Error message — set when status is error.",
              },
              {
                prop: "meta",
                type: "Record<string, unknown>",
                description: "Any extra data returned by your onUpload function.",
              },
            ]}
          />
        </div>

        {/* Prev / Next */}
        <div className="mt-4 flex items-center justify-between pt-6 border-t border-border/60">
          <a href="#" className="flex flex-col gap-0.5 text-left group">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Previous
            </span>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              ← Onboarding Checklist
            </span>
          </a>
          <a href="#" className="flex flex-col gap-0.5 text-right group">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Next
            </span>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Command Palette →
            </span>
          </a>
        </div>
      </main>

      {/* Right TOC */}
      <aside className="hidden xl:flex sticky top-0 h-screen w-52 shrink-0 flex-col gap-2 py-12 pl-2 pr-6">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
          On this page
        </span>
        {[
          "Live demo",
          "Installation",
          "Basic usage",
          "With config",
          "Real upload progress",
          "Programmatic control",
          "Custom layout",
          "FileUploadRoot",
          "FileUploadConfig",
          "FileEntry",
        ].map((item) => (
          <a
            key={item}
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5 leading-relaxed"
          >
            {item}
          </a>
        ))}
      </aside>
    </div>
  );
}
