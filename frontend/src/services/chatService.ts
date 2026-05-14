
import axios from "axios";

export type ChatMessageType = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function sendChatMessage(messages: ChatMessageType[]): Promise<string> {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, {
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    });
    
    return response.data.reply;
  } catch (error: any) {
    console.error("Chat Service Error:", error);
    throw new Error(error.response?.data?.detail || "Connection to Jarvis lost. Please try again.");
  }
}
