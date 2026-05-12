"use client";

import * as React from "react";
import { AIChatRoot, type AIStreamCallbacks } from "@/components/bevelui/ai-chat";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

async function stream(
  text: string,
  fn: (c: string) => void,
  signal: AbortSignal,
): Promise<boolean> {
  for (const char of text) {
    if (signal.aborted) return false;
    fn(char);
    await sleep(11 + Math.random() * 9);
  }
  return true;
}

// ─── Pre-written responses ────────────────────────────────────────────────────

const RESPONSES = [
  {
    match: /stream|token|append|callback/i,
    thinking:
      "The user wants to understand the streaming architecture. I should explain how appendToken works and show a real fetch-based streaming example with cancellation.",
    tool: { name: "read_source", label: "Reading ai-chat-root.tsx", result: "appendToken, appendThinkingToken, addBlock, updateBlock, setStatus, signal" },
    text: `The system uses a **callback pattern** — instead of returning a stream, \`onSend\` receives a set of callbacks that mutate the assistant message in real time.

\`\`\`ts
onSend={async (text, { appendToken, setStatus, signal }) => {
  const res = await fetch("/api/chat", {
    method: "POST",
    body:   JSON.stringify({ message: text }),
    signal,                    // wired to the Stop button
  });

  const reader  = res.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    appendToken(decoder.decode(value));
  }

  setStatus("done");
}}
\`\`\`

The \`signal\` is an \`AbortSignal\` connected to the Stop button. Pass it to \`fetch\` and the stream cancels cleanly — no dangling requests, no state updates after unmount.`,
  },
  {
    match: /hook|scroll|direction|detect/i,
    thinking:
      "Straightforward hook request. I'll implement useScrollDirection with useRef to track the previous Y position, and only fire when the delta exceeds the threshold.",
    tool: null,
    text: `\`\`\`ts
import * as React from "react";

type Direction = "up" | "down" | null;

export function useScrollDirection(threshold = 10): Direction {
  const [dir, setDir] = React.useState<Direction>(null);
  const prevY = React.useRef(0);

  React.useEffect(() => {
    function onScroll() {
      const y     = window.scrollY;
      const delta = y - prevY.current;
      if (Math.abs(delta) < threshold) return;
      setDir(delta > 0 ? "down" : "up");
      prevY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return dir;
}
\`\`\`

Usage — hide a navbar on scroll down:

\`\`\`tsx
function Navbar() {
  const direction = useScrollDirection(8);
  return (
    <nav className={cn(
      "fixed top-0 w-full transition-transform duration-300",
      direction === "down" && "-translate-y-full",
    )}>
      ...
    </nav>
  );
}
\`\`\``,
  },
  {
    match: /model|gpt|claude|gemini|openai|anthropic|provider/i,
    thinking:
      "Model compatibility question. Simple answer: the system is completely model-agnostic. The model selector is just UI state that gets passed to the consumer's onSend.",
    tool: null,
    text: `The system is **completely model-agnostic** — it never calls any AI API directly. You bring your own \`onSend\` function and call whatever backend you want.

Works with any provider out of the box:

| Provider | Models |
|---|---|
| Anthropic | Claude Sonnet, Haiku, Opus |
| OpenAI | GPT-4o, o1, o3-mini |
| Google | Gemini 2.0 Flash, Pro |
| Groq | Llama 3, Mixtral |
| Local | Ollama, LM Studio |

The model selector in the input stores the selected value in \`model\` state and passes it through to your \`onSend\` callback. What you do with it is your business.`,
  },
  {
    match: /think|reason|block|content/i,
    thinking:
      "User is asking about content blocks — the discriminated union that drives all message rendering. I should list all types and explain when to use each.",
    tool: { name: "read_source", label: "Reading types.ts", result: "AIContentBlock: text | thinking | tool-call | code | image | file" },
    text: `Every message has \`content: AIContentBlock[]\` — an ordered array of blocks, not a single string. This lets one response mix text, tool calls, code, and images naturally.

**Available block types:**

\`\`\`ts
// Plain text — rendered as full GFM markdown
{ type: "text"; text: string }

// Collapsible reasoning — like Claude's extended thinking
{ type: "thinking"; text: string; collapsed?: boolean }

// Tool use — shows pending → running → done states
{ type: "tool-call"; name: string; status: "pending"|"running"|"done"|"error" }

// Syntax-highlighted code with copy button
{ type: "code"; code: string; language: string; filename?: string }

// Inline image
{ type: "image"; url: string; alt?: string }

// File attachment chip
{ type: "file"; name: string; mimeType: string; size?: number }
\`\`\`

Add blocks at any point during streaming using \`addBlock()\`. Update them using \`updateBlock(index, patch)\`.`,
  },
  {
    match: /generate|image|/,
    thinking:
      "The user wants me to generate an image to show my capabilities",
    tool: { name: "web_search", label: "Searching for context", result: "Retrieved relevant context from docs" },
    text: `I would generate an image for you`,
    // type: "image",
    image: {url: "/images/tour-1.png"}
  },
  {
    match: /generate|file|/,
    thinking:
      "The user wants me to generate an file to show my capabilities",
    tool: { name: "Frontend Skills", label: "Searching for context", result: "Retrieved relevant context from docs" },
    text: `I would generate a component file`,
    // type: "image",
    file: {name: "SOrtable",url: "/images/tour-1.png",mimeType: ".tsx", }
  },
  {
    match: /.*/,
    thinking:
      "General question. I'll give a concise overview of the system's capabilities.",
    tool: { name: "web_search", label: "Searching for context", result: "Retrieved relevant context from docs" },
    text: `The AI Chat Interface system covers everything a production chat UI needs:

- **Streaming text** with blinking cursor during generation
- **Thinking blocks** — collapsible, streams character by character
- **Tool call display** — pending → running → done state machine
- **Markdown + GFM** — tables, task lists, strikethrough, links
- **Code blocks** — syntax highlighting via sugar-high with copy button
- **File attachments** — previewed as chips, passed to \`onSend\`
- **Message actions** — copy, thumbs up/down, regenerate on hover
- **Model selector** — built into the composer, model-agnostic
- **Stop button** — cancels via \`AbortController\`
- **Scroll anchoring** — follows bottom, stops when you scroll up

Two usage modes: **uncontrolled** (system manages messages, you provide \`onSend\`) or **controlled** (bring your own messages from \`useChat\` or any AI SDK).`,
  },
];

function getResponse(msg: string) {
  return RESPONSES.find(r => r.match.test(msg)) ?? RESPONSES[RESPONSES.length - 1];
}

// ─── Simulation engine ────────────────────────────────────────────────────────

async function simulate(message: string, cb: AIStreamCallbacks) {
  const { appendToken, appendThinkingToken, addBlock, updateBlock, setStatus, signal } = cb;
  const res = getResponse(message);

  // Phase 1 — thinking
  await sleep(350);
  if (signal.aborted) return;
  if (!await stream(res.thinking, appendThinkingToken, signal)) return;

  // Phase 2 — optional tool call
  if (res.tool) {
    await sleep(180);
    if (signal.aborted) return;
    // thinking is block 0, tool-call will be block 1
    addBlock({ type: "tool-call", id: "t1", name: res.tool.name, label: res.tool.label, status: "running" });
    await sleep(950);
    if (signal.aborted) return;
    updateBlock(1, { status: "done", result: res.tool.result });
    await sleep(180);
  }

  // Phase 3 — stream the text response
  if (signal.aborted) return;

  if (!await stream(res.text, appendToken, signal)) return;

    if (res.file) {
    await sleep(380);
    if (signal.aborted) return;
    // thinking is block 0, tool-call will be block 1
    addBlock({ type: "file", url: res.file.url, mimeType: res.file.mimeType, name:res.file.name });
    await sleep(950);
    if (signal.aborted) return;
    updateBlock(1, { status: "done", result: res.tool.result });
    await sleep(180);
  }
    if (res.image) {
    await sleep(380);
    if (signal.aborted) return;
    // thinking is block 0, tool-call will be block 1
    addBlock({ type: "image", url: res.image.url, alt: message, });
    await sleep(950);
    if (signal.aborted) return;
    updateBlock(1, { status: "done", result: res.tool.result });
    await sleep(180);
  }

  setStatus("done");
}

// ─── AIChatDemo ───────────────────────────────────────────────────────────────

export function AIChatDemo() {
  return (
    <div className="w-full max-w-2xl h-[600px] rounded-2xl border border-border overflow-hidden bg-background flex flex-col shadow-xl">
      <AIChatRoot
        config={{
          assistantName:  "Bevel AI",
          welcomeTitle:   "AI Chat Interface",
          welcomeMessage: "A complete streaming chat UI — thinking blocks, tool calls, code, and markdown. Click a prompt to see it in action.",
          starters: [
            "How does streaming work in this system?",
            "Write a custom hook to detect scroll direction",
            "What AI models does this support?",
            "What content block types are available?",
          ],
          models: [
            { value: "claude-sonnet", label: "Claude Sonnet" },
            { value: "gpt-4o",        label: "GPT-4o"        },
            { value: "gemini-flash",  label: "Gemini Flash"  },
          ],
          placeholder: "Ask something…",
        }}
        onSend={async (text, callbacks) => {
          await simulate(text, callbacks);
        }}
      />
    </div>
  );
}