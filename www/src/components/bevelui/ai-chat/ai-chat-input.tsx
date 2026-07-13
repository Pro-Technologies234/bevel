"use client";

import * as React from "react";
import { useAIChatCtx } from "./ai-chat-context";
import { IconArrowUp, IconPaperclip, IconSquare } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIChatAction } from "./ai-chat-action";
import { AIChatFileEntry } from "./ai-chat-file-entry";

export function AIChatInput({ className }: { className?: string }) {
  const { send, stop, isLoading, isStreaming, config, model, setModel } = useAIChatCtx();
  const [text, setText] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const taRef = React.useRef<HTMLTextAreaElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const isActive = isLoading || isStreaming;
  const canSend = (text.trim().length > 0 || files.length > 0) && !isActive;

  function resize() {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  function submit() {
    if (!canSend) return;
    send(text.trim(), files.length ? files : undefined);
    setText("");
    setFiles([]);
    if (taRef.current) taRef.current.style.height = "auto";
    taRef.current?.focus();
  }

  function remove(id: number) {
    setFiles((p) => p.filter((_, j) => j !== id));
  }

  return (
    <div className={cn("shrink-0 border border-border bg-card/40 backdrop-blur-sm p-1 mx-4 mb-4 rounded-3xl", className)}>
      {files.length > 0 && (
        <div className="px-2 overflow-x-auto flex gap-2 pb-1.5 pt-0.5">
          {files.map((f, i) => (
            <AIChatFileEntry id={i} file={f} key={i} onRemove={remove} />
          ))}
        </div>
      )}

      <div className="flex flex-col items-end gap-2 rounded-2xl border border-border bg-card p-4">
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => { setText(e.target.value); resize(); }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={config.placeholder ?? "Message…"}
          rows={2}
          className="w-full flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none leading-relaxed min-h-[24px] max-h-[200px]"
        />

        <div className="flex w-full justify-between items-center gap-1 shrink-0 pb-0.5">
          <div className="flex items-center gap-2">
            {config.models && config.models.length > 1 && (
              <AIChatModelSelector model={model} models={config.models} onChange={setModel} />
            )}
            <AIChatAction
              type="button"
              onClick={() => fileRef.current?.click()}
              title="Attach files"
              variant="ghost"
              size="icon"
            >
              <IconPaperclip size={15} strokeWidth={1.8} />
            </AIChatAction>
          </div>

          <AIChatAction
            type="button"
            onClick={isActive ? stop : submit}
            disabled={!isActive && !canSend}
            title={isActive ? "Stop" : "Send (Enter)"}
            variant={canSend || isActive ? "default" : "outline"}
            size="icon"
            className="cursor-pointer"
          >
            {isActive ? <IconSquare size={14} /> : <IconArrowUp size={16} />}
          </AIChatAction>
        </div>
      </div>

      <Input
        ref={fileRef}
        type="file"
        multiple
        className="sr-only"
        onChange={(e) => {
          const added = Array.from(e.target.files ?? []);
          setFiles((p) => [...p, ...added].slice(0, config.maxAttachments ?? 5));
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function AIChatModelSelector({
  model,
  models,
  onChange,
}: {
  model: string;
  models: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const current = models.find((m) => m.value === model);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AIChatAction variant="ghost" size="sm">{current?.label ?? model}</AIChatAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {models.map((m) => (
          <DropdownMenuItem onClick={() => onChange(m.value)} key={m.value}>
            {m.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

AIChatInput.displayName = "AIChatInput";
