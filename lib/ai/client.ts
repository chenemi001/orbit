const OPENAI_API_URL =
  "https://api.openai.com/v1";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  id: string;
  content: string;
  model: string;
}

function getApiKey() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured"
    );
  }

  return apiKey;
}

export async function generateAIResponse({
  messages,
  model = "gpt-4o-mini",
  temperature = 0.7,
  maxTokens = 1000,
}: AIRequest): Promise<AIResponse> {
  const response = await fetch(
    `${OPENAI_API_URL}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getApiKey()}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `AI request failed: ${error}`
    );
  }

  const data = await response.json();

  return {
    id: data.id,
    content:
      data.choices?.[0]?.message?.content ?? "",
    model: data.model,
  };
}