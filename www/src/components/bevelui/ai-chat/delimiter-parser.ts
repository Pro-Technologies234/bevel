/**
 * Incremental parser for Bevel's chat delimiter syntax:
 *
 *   ::thinking::
 *   ...reasoning...
 *   ::/thinking::
 *
 *   ::tool_call{name="search_docs", label="Searching docs"}::
 *   ::tool_result{status="done"}::
 *   ...result payload...
 *   ::/tool_call::
 *
 * Designed to be fed one token/chunk at a time, in order, and to correctly
 * resolve markers even when a chunk boundary falls in the middle of one
 * (e.g. one token ends with "::thi" and the next begins with "nking::").
 *
 * This does NOT hold the message's block array itself — it emits a small
 * set of parse events that the engine (use-ai-chat-engine.ts) turns into
 * immutable block mutations. Keeping the parser pure/stateless-per-instance
 * makes it independently testable and reusable outside the engine.
 */

export type ParseEvent =
  | { kind: "text"; text: string }
  | { kind: "thinking-start" }
  | { kind: "thinking-text"; text: string }
  | { kind: "thinking-end" }
  | { kind: "tool-call-start"; name: string; label?: string }
  | { kind: "tool-result-status"; status: "pending" | "running" | "done" | "error" }
  | { kind: "tool-call-text"; text: string }
  | { kind: "tool-call-end" };

type Mode = "text" | "thinking" | "tool-call";

const OPEN_THINKING = "::thinking::";
const CLOSE_THINKING = "::/thinking::";
const CLOSE_TOOL_CALL = "::/tool_call::";
// tool_call open and tool_result use a {...} attribute payload, matched via regex once
// enough of the buffer has arrived to contain a full "::tag{...}::" sequence.
const TOOL_CALL_OPEN_RE = /^::tool_call\{([^}]*)\}::/;
const TOOL_RESULT_RE = /^::tool_result\{([^}]*)\}::/;

const MAX_MARKER_LEN = Math.max(
  OPEN_THINKING.length,
  CLOSE_THINKING.length,
  CLOSE_TOOL_CALL.length,
  64, // generous upper bound for `::tool_call{...}::` with attrs
);

function parseAttrs(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /(\w+)="([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) out[m[1]] = m[2];
  return out;
}

export class DelimiterParser {
  private buffer = "";
  private mode: Mode = "text";

  /**
   * Feed a new chunk of raw text. Returns any events that could be
   * confidently resolved from the buffer so far. Unresolved trailing
   * content (a possible partial marker) is held back until more input
   * arrives or `flush()` is called.
   */
  push(chunk: string): ParseEvent[] {
    this.buffer += chunk;
    return this.drain(false);
  }

  /** Call at stream end — resolves any trailing buffer as plain text,
   *  even if it looks like an incomplete/malformed marker. */
  flush(): ParseEvent[] {
    const events = this.drain(true);
    if (this.buffer) {
      events.push(
        this.mode === "text"
          ? { kind: "text", text: this.buffer }
          : this.mode === "thinking"
            ? { kind: "thinking-text", text: this.buffer }
            : { kind: "tool-call-text", text: this.buffer },
      );
      this.buffer = "";
    }
    return events;
  }

  private drain(final: boolean): ParseEvent[] {
    const events: ParseEvent[] = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (this.mode === "text") {
        const idx = this.buffer.indexOf("::");
        if (idx === -1) {
          // No marker start in sight — emit everything except a small
          // tail that could be the start of "::" itself.
          const safeLen = Math.max(0, this.buffer.length - 1);
          if (safeLen > 0) {
            events.push({ kind: "text", text: this.buffer.slice(0, safeLen) });
            this.buffer = this.buffer.slice(safeLen);
          }
          break;
        }

        if (idx > 0) {
          events.push({ kind: "text", text: this.buffer.slice(0, idx) });
          this.buffer = this.buffer.slice(idx);
        }

        // Buffer now starts at "::" — do we have enough to know which marker?
        if (this.buffer.startsWith(OPEN_THINKING)) {
          this.buffer = this.buffer.slice(OPEN_THINKING.length);
          this.mode = "thinking";
          events.push({ kind: "thinking-start" });
          continue;
        }

        const toolMatch = TOOL_CALL_OPEN_RE.exec(this.buffer);
        if (toolMatch) {
          const attrs = parseAttrs(toolMatch[1]);
          this.buffer = this.buffer.slice(toolMatch[0].length);
          this.mode = "tool-call";
          events.push({
            kind: "tool-call-start",
            name: attrs.name ?? "tool",
            label: attrs.label,
          });
          continue;
        }

        // Not enough buffered yet to tell — wait for more input, unless
        // we've hit stream end or the buffer is clearly not a real marker
        // (too long without resolving to a known tag).
        if (!final && this.buffer.length < MAX_MARKER_LEN) break;

        // Give up on it being a marker; emit one char as text and retry.
        events.push({ kind: "text", text: this.buffer[0] });
        this.buffer = this.buffer.slice(1);
        continue;
      }

      if (this.mode === "thinking") {
        const idx = this.buffer.indexOf(CLOSE_THINKING);
        if (idx === -1) {
          const safeLen = Math.max(0, this.buffer.length - (CLOSE_THINKING.length - 1));
          if (safeLen > 0) {
            events.push({ kind: "thinking-text", text: this.buffer.slice(0, safeLen) });
            this.buffer = this.buffer.slice(safeLen);
          }
          break;
        }
        if (idx > 0) events.push({ kind: "thinking-text", text: this.buffer.slice(0, idx) });
        this.buffer = this.buffer.slice(idx + CLOSE_THINKING.length);
        this.mode = "text";
        events.push({ kind: "thinking-end" });
        continue;
      }

      // mode === "tool-call"
      {
        const resultMatch = TOOL_RESULT_RE.exec(this.buffer);
        if (resultMatch) {
          const attrs = parseAttrs(resultMatch[1]);
          this.buffer = this.buffer.slice(resultMatch[0].length);
          events.push({
            kind: "tool-result-status",
            status: (attrs.status as any) ?? "done",
          });
          continue;
        }

        const idx = this.buffer.indexOf(CLOSE_TOOL_CALL);
        if (idx === -1) {
          const safeLen = Math.max(0, this.buffer.length - (CLOSE_TOOL_CALL.length - 1));
          if (safeLen > 0) {
            events.push({ kind: "tool-call-text", text: this.buffer.slice(0, safeLen) });
            this.buffer = this.buffer.slice(safeLen);
          }
          break;
        }
        if (idx > 0) events.push({ kind: "tool-call-text", text: this.buffer.slice(0, idx) });
        this.buffer = this.buffer.slice(idx + CLOSE_TOOL_CALL.length);
        this.mode = "text";
        events.push({ kind: "tool-call-end" });
        continue;
      }
    }

    return events;
  }
}
