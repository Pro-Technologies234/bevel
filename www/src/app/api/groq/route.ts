export async function POST(req: Request) {
  const {
    message,
    model = "llama-3.1-8b-instant",
  }: { message: string; model?: string } = await req.json();

  if (!message?.trim()) {
    return new Response("Message is required", { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("❌ GROQ_API_KEY not set");
    return new Response("Server configuration error", { status: 500 });
  }

  console.log(`🔄 Streaming Groq model: ${model}`);

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: message }],
          stream: true,
        }),
        signal: req.signal,
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`❌ Groq API error (${response.status}):`, errorBody);
      return new Response(
        JSON.stringify({ error: `Groq error: ${errorBody}` }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("🛑 Groq request aborted");
      return new Response(null, { status: 499 });
    }
    console.error("❌ Groq fetch error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
