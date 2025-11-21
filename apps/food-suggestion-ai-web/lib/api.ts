import type { FoodSuggestionResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getSuggestions(
  userInput: string,
  preferences?: string,
  cuisineType?: string,
): Promise<FoodSuggestionResponse> {
  // Get API keys from localStorage
  const provider = localStorage.getItem("ai_provider") || "";
  const apiKey = localStorage.getItem(`${provider}_api_key`) || "";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add API key headers if available
  if (provider && apiKey) {
    headers["X-AI-Provider"] = provider;
    if (provider === "openai") {
      headers["X-OpenAI-API-Key"] = apiKey;
    } else if (provider === "gemini") {
      headers["X-Gemini-API-Key"] = apiKey;
    }
  }

  const response = await fetch(`${API_BASE_URL}/suggest`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      user_input: userInput,
      preferences,
      cuisine_type: cuisineType,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch suggestions");
  }

  return response.json();
}
