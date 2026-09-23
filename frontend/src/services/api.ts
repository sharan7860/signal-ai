const defaultApiUrl = import.meta.env.DEV
  ? "/api"
  : "https://signal-ai-xci0.onrender.com/api";
const API_URL = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/$/, "");

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
      signal: init?.signal ?? AbortSignal.timeout(60_000),
    });
  } catch {
    throw new Error("Could not reach the service. Please check your connection and try again.");
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      typeof body?.detail === "string"
        ? body.detail
        : "The service is unavailable. Please try again.",
    );
  }
  if (!body) throw new Error("The service returned an invalid response.");
  return body as T;
}
