"use client";

import * as React from "react";
import { AIChatMessageList } from "./ai-chat-message-list";
import { AIChatInput } from "./ai-chat-input";
import { AIChatStarters } from "./ai-chat-starters";

export function AIChatDefaultLayout() {
  return (
    <>
      <AIChatMessageList />
      <AIChatStarters />
      <AIChatInput />
    </>
  );
}

AIChatDefaultLayout.displayName = "AIChatDefaultLayout";
