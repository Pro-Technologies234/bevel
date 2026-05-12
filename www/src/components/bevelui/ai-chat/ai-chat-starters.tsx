import { AIChatAction } from "./ai-chat-action";
import { useAIChat } from "./use-ai-chat";

export function AIChatStarters() {
  const { config, sendMessage } = useAIChat();
  return (
    !!config.starters?.length && (
      <div className="flex gap-2 w-full py-2 my-4  overflow-x-auto mx-auto  ">
        {config.starters.map((s, i) => (
          <AIChatAction
            key={i}
            type="button"
            variant={"secondary"}
            onClick={() => sendMessage(s)}
          >
            {s}
          </AIChatAction>
        ))}
      </div>
    )
  );
}
