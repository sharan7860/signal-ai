import { apiRequest } from "./api";

export type ChatMessageType = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export async function fetchAIResponse(messages: ChatMessageType[]) {
  const response = await apiRequest<{ response: string }>("/chat", {
    method: "POST",
    body: JSON.stringify({
      messages: messages.slice(-20).map(({ role, content }) => ({ role, content })),
    }),
  });
  return response.response;
}
