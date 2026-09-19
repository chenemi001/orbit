import {
  AIMessage,
} from "./client";

interface StreamOptions {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
}

export async function streamAIResponse({
  messages,
  model = "gpt-4o-mini",
  temperature = 0.7,
}: StreamOptions) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured"
    );
  }

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        stream: true,
      }),
    }
  );

  if (!response.ok || !response.body) {
    throw new Error(
      "Unable to create AI stream"
    );
  }

  return response.body;
}