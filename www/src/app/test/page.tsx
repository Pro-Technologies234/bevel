"use client";
import { AIChatDemo } from "@/components/docs/ai-chat/ai-chat-demo";
import { Wrapper } from "@/components/shared/wrapper";

export default function TestPage() {
  return (
    <Wrapper
      wrapper="max-w-3xl p-0!"
      className="h-screen items-center justify-center py-4"
    >
      <AIChatDemo />
    </Wrapper>
  );
}
