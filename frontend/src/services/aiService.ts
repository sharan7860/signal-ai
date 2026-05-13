import axios from "axios";

export type ChatMessageType = {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: string;
};

const OPENROUTER_URL = "https://api.openrouter.ai/v1/chat/completions";
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const SYSTEM_PROMPT = {
  role: "system" as const,
  content:
    "You are an AI stock market analyst and financial assistant.\n\nYour tasks:\n- analyze stocks\n- explain market trends\n- provide buy/sell/hold insights\n- explain technical indicators\n- help with portfolio diversification\n- explain financial news sentiment\n\nAlways answer professionally and concisely.",
};

export async function fetchAIResponse(messages: Array<{ role: "user" | "assistant" | "system"; content: string }>) {
  if (!OPENROUTER_API_KEY) {
    throw new Error("Missing VITE_OPENROUTER_API_KEY environment variable.");
  }

  const payload = {
    model: "deepseek/deepseek-chat",
    messages: [SYSTEM_PROMPT, ...messages],
    temperature: 0.25,
    top_p: 0.95,
    max_tokens: 800,
  };

  const response = await axios.post(OPENROUTER_URL, payload, {
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  const aiText = response.data?.choices?.[0]?.message?.content;
  if (!aiText || typeof aiText !== "string") {
    throw new Error("Unexpected response from OpenRouter.");
  }

  return aiText.trim();
}
