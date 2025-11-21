export interface FoodSuggestion {
  name: string;
  description: string;
  ingredients: string[];
  reasoning: string;
}

export interface FoodSuggestionResponse {
  suggestions: FoodSuggestion[];
  provider: string;
}

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  suggestions?: FoodSuggestion[];
  timestamp: Date;
}
