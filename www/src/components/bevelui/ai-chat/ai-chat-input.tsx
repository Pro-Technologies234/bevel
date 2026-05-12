"use client";

import * as React from "react";
import { useAIChatCtx } from "./ai-chat-context";
import { IconArrowUp, IconPaperclip, IconX, IconSquare } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AIChatInput({ className }: { className?: string }) {
  const { sendMessage, stopGeneration, isLoading, isStreaming, config, model, setModel } = useAIChatCtx();
  const [text,  setText]  = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const taRef   = React.useRef<HTMLTextAreaElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const isActive = isLoading || isStreaming;
  const canSend  = (text.trim().length > 0 || files.length > 0) && !isLoading;

  function resize() {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  function submit() {
    if (!canSend) return;
    sendMessage(text.trim(), files.length ? files : undefined);
    setText(""); setFiles([]);
    if (taRef.current) taRef.current.style.height = "auto";
    taRef.current?.focus();
  }

  return (
    <div className={cn("shrink-0 border-t border-border bg-background/95 backdrop-blur-sm px-4 py-3", className)}>
      {/* File chips */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/60 border border-border text-[11px]">
              <span className="text-muted-foreground/70 truncate max-w-[120px]">{f.name}</span>
              <button type="button" onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="text-muted-foreground/40 hover:text-muted-foreground">
                <IconX size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Composer */}
      <div className="flex flex-col items-end gap-2 rounded-xl border border-border bg-card focus-within:border-primary/40 transition-colors px-3 py-2">
        <textarea
          ref={taRef}
          value={text}
          onChange={e => { setText(e.target.value); resize(); }}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder={config.placeholder ?? "Message…"}
          rows={1}
          className="w-full flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none leading-relaxed min-h-[24px] max-h-[200px] py-0.5"
        />

        <div className="flex items-center gap-1 shrink-0 pb-0.5">
          {/* Model selector */}
          {config.models && config.models.length > 1 && (
            <Select
              value={model}
              onValueChange={e => setModel(e)}
  
            >
              <SelectTrigger>
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>

              {config.models.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )}

          {/* Attach */}
          <Button
            type="button" onClick={() => fileRef.current?.click()}
            title="Attach files"
            className=" rounded-full"
            variant={'outline'}
          >
            <IconPaperclip size={15} strokeWidth={1.8} />
          </Button>

          {/* Send / Stop */}
          <Button
            type="button"
            onClick={isActive ? stopGeneration : submit}
            disabled={!isActive && !canSend}
            title={isActive ? "Stop" : "Send (Enter)"}
            className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
              isActive
                ? "bg-muted hover:bg-muted/70 text-foreground"
                : canSend
                ? "bg-primary hover:bg-primary/90 text-black"
                : "text-muted-foreground/20 cursor-not-allowed",
            )}
          >
            {isActive
              ? <IconSquare size={12} strokeWidth={2.5} />
              : <IconArrowUp size={14} strokeWidth={2.5} />}
          </Button>
        </div>
      </div>

      <input ref={fileRef} type="file" multiple className="sr-only" onChange={e => {
        const added = Array.from(e.target.files ?? []);
        setFiles(p => [...p, ...added].slice(0, config.maxAttachments ?? 5));
        e.target.value = "";
      }} />

      <p className="text-[10px] text-muted-foreground/25 text-center mt-2">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}

AIChatInput.displayName = "AIChatInput";