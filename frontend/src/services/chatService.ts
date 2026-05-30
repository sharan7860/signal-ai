
export type ChatMessageType = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://signal-ai-xci0.onrender.com";

export async function sendChatMessage(messages: ChatMessageType[]): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages.map(m => ({ role: m.role, content: m.content }))
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error: any) {
    console.error("Chat Service Error:", error);
    throw new Error(error.message || "Connection to Jarvis lost. Please try again.");
  }
}
