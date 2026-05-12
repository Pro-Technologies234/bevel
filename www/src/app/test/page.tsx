'use client'
import { AIChatDemo } from "@/components/docs/ai-chat/ai-chat-demo";
import { Wrapper } from "@/components/shared/wrapper";

export default function TestPage() {
    return(
        <Wrapper wrapper="max-w-5xl" className="h-screen" >
            <AIChatDemo/>
        </Wrapper>
    )
}