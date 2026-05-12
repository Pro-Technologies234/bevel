// lib/groq-thinking.ts

export interface ThinkingStreamState {
  /** The *current* raw content, which may contain a partial <think> block. */
  buffer: string;
  /** Whether we are currently inside a <think> block. */
  insideThink: boolean;
}

/**
 * Process a raw token from a Groq stream.
 * Returns cleaned text tokens and reasoning tokens ready to be passed
 * to `appendToken` and `appendThinkingToken`.
 */
export function processToken(
  token: string,
  state: ThinkingStreamState,
): { textTokens: string[]; thinkingTokens: string[] } {
  const textTokens: string[] = [];
  const thinkingTokens: string[] = [];

  state.buffer += token;

  while (true) {
    if (state.insideThink) {
      const endIdx = state.buffer.indexOf("");
      if (endIdx === -1) {
        // Entire buffer is still thinking content
        thinkingTokens.push(state.buffer);
        state.buffer = "";
        break;
      } else {
        // Emit thinking content before  response
        thinkingTokens.push(state.buffer.slice(0, endIdx));
        state.buffer = state.buffer.slice(endIdx + "".length);
        state.insideThink = false;
        // Continue to check for a new  thinking
      }
    } else {
      const startIdx = state.buffer.indexOf("");
      if (startIdx === -1) {
        // No new <think> block; emit as text
        textTokens.push(state.buffer);
        state.buffer = "";
        break;
      } else {
        // Emit text before  thinking
        textTokens.push(state.buffer.slice(0, startIdx));
        state.buffer = state.buffer.slice(startIdx + " thinking".length);
        state.insideThink = true;
        // Continue to look for  response
      }
    }
  }

  return { textTokens, thinkingTokens };
}
