"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AIChatCodeBlock } from "./ai-chat-code-block";
import { cn } from "@/lib/utils";

export function AIChatMarkdown({
  content,
  isStreaming,
}: {
  content: string;
  isStreaming?: boolean;
}) {
  return (
    <div className={cn(
      "prose prose-sm dark:prose-invert max-w-none break-words",
      "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
      "prose-p:my-1.5 prose-p:leading-relaxed",
      "prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-1.5",
      "prose-h1:text-lg prose-h2:text-base prose-h3:text-sm",
      "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[11px] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none",
      "prose-pre:p-0 prose-pre:bg-transparent prose-pre:my-2",
      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
      "prose-blockquote:border-l-2 prose-blockquote:border-primary/40 prose-blockquote:pl-3 prose-blockquote:text-muted-foreground prose-blockquote:not-italic",
      "prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5",
      "prose-table:text-xs prose-th:bg-muted/50 prose-td:border-border prose-th:border-border",
      "prose-hr:border-border",
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks → AIChatCodeBlock, inline code → default
          code({ inline, className, children }: any) {
            const match = /language-(\w+)/.exec(className || "");
            if (!inline && match) {
              return (
                <AIChatCodeBlock
                  code={String(children).replace(/\n$/, "")}
                  language={match[1]}
                />
              );
            }
            return <code className={className}>{children}</code>;
          },
          // Open links in new tab
          a({ href, children }: any) {
            return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-0.5 h-[1em] bg-foreground/70 animate-pulse align-middle ml-0.5" />
      )}
    </div>
  );
}

AIChatMarkdown.displayName = "AIChatMarkdown";