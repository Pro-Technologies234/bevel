"use client";

import * as React from "react";
import {
  AIChatRoot,
  type AIStreamCallbacks,
} from "@/components/bevelui/ai-chat";

// ─── SIMPLE version (no thinking extraction yet) ─────────────────

async function streamGroqDebug(userMessage: string, cb: AIStreamCallbacks) {
  const { appendToken, setStatus, setError, signal } = cb;

  // ── Token queue + typewriter playback ──────────────────────────
  const charQueue: string[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;

  // Start the typewriter loop: shift one char every ~15ms
  function startTypewriter() {
    const interval = 0.75; // ms per character
    timer = setInterval(() => {
      if (charQueue.length > 0) {
        appendToken(charQueue.shift()!); // ✅ append one character
      }
    }, interval);
  }

  function stopTypewriter() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    // Append any remaining characters immediately
    if (charQueue.length > 0) {
      appendToken(charQueue.join(""));
      charQueue.length = 0;
    }
  }

  // Clean up on abort
  signal.addEventListener(
    "abort",
    () => {
      stopTypewriter();
    },
    { once: true },
  );

  try {
    console.log("🚀 streamGroqDebug: fetching /api/groq");

    const response = await fetch("/api/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
      signal,
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("❌ /api/groq not ok", response.status, err);
      setError(`Groq API error (${response.status}): ${err}`);
      return;
    }

    if (!response.body) {
      setError("No response body");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let pending = "";

    // Start the typewriter ticking
    startTypewriter();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log("✅ Stream done");
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      pending += chunk;

      // Split SSE lines
      const lines = pending.split("\n");
      pending = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;

        const json = trimmed.slice(5).trimStart();
        if (json === "[DONE]") continue;

        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            // Push each character to the typewriter queue
            for (const char of content) {
              charQueue.push(char);
            }
          }
        } catch (e) {
          console.warn("⚠️ Parse error:", json.substring(0, 80));
        }
      }
    }

    // Wait until the queue is empty, then finish
    const checkEmpty = () => {
      if (charQueue.length === 0) {
        stopTypewriter();
        setStatus("done");
      } else {
        requestAnimationFrame(checkEmpty);
      }
    };
    checkEmpty();
  } catch (err: any) {
    stopTypewriter();
    if (err.name === "AbortError") {
      console.log("🛑 Aborted");
      return;
    }
    console.error("❌ streamGroqDebug error:", err);
    setError(err.message);
  }
}
// ─── Demo component ───────────────────────────────────────────────

export function AIChatDemo() {
  return (
    <div className="w-full h-full">
      <AIChatRoot
        config={{
          assistantName: "Groq Debug",
          welcomeTitle: "Good afternoon ☀️ \n How can I help you today? ",

          starters: [
            "How does streaming work in this system?",
            "Write a custom hook to detect scroll direction",
            "What AI models does this support?",
            "What content block types are available?",
          ],
          models: [
            { value: "llama-3.1-8b-instant", label: "Llama 3.1" },
            { value: "claude-sonnet", label: "Claude Sonnet" },
            { value: "gpt-4o", label: "GPT-4o" },
            { value: "gemini-flash", label: "Gemini Flash" },
          ],
          placeholder: "Type something...",
        }}
        onSend={async (text, callbacks) => {
          await streamGroqDebug(text, callbacks);
        }}
      />
    </div>
  );
}
