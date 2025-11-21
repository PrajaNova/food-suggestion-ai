from openai import OpenAI
import google.generativeai as genai
from app.config import Settings
from app.models import FoodSuggestionRequest, FoodSuggestion
from typing import List
import json


class AIService:
    """Service for interacting with AI providers."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        
        # Initialize OpenAI client
        if settings.openai_api_key:
            self.openai_client = OpenAI(api_key=settings.openai_api_key)
        
        # Initialize Gemini
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
    
    def _build_prompt(self, request: FoodSuggestionRequest) -> str:
        """Build the prompt for AI models."""
        base_prompt = f"""You are a food suggestion expert. Based on the user's input, suggest 3 delicious food combinations or dishes.

User Input: {request.user_input}"""
        
        if request.preferences:
            base_prompt += f"\nDietary Preferences: {request.preferences}"
        
        if request.cuisine_type:
            base_prompt += f"\nCuisine Type: {request.cuisine_type}"
        
        base_prompt += """

Provide exactly 3 food suggestions in JSON format with the following structure:
{
  "suggestions": [
    {
      "name": "Dish Name",
      "description": "Brief description of the dish",
      "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
      "reasoning": "Why this matches the user's request"
    }
  ]
}

Return ONLY valid JSON, no additional text."""
        
        return base_prompt
    
    async def get_suggestions_openai(self, request: FoodSuggestionRequest) -> List[FoodSuggestion]:
        """Get food suggestions using OpenAI."""
        prompt = self._build_prompt(request)
        
        try:
            response = self.openai_client.chat.completions.create(
                model=self.settings.openai_model,
                messages=[
                    {"role": "system", "content": "You are a helpful food suggestion assistant. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            data = json.loads(content)
            
            suggestions = [FoodSuggestion(**item) for item in data.get("suggestions", [])]
            return suggestions
            
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")
    
    async def get_suggestions_gemini(self, request: FoodSuggestionRequest) -> List[FoodSuggestion]:
        """Get food suggestions using Google Gemini."""
        prompt = self._build_prompt(request)
        
        try:
            model = genai.GenerativeModel(self.settings.gemini_model)
            response = model.generate_content(prompt)
            
            # Extract JSON from response
            content = response.text.strip()
            
            # Remove markdown code blocks if present
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            
            content = content.strip()
            data = json.loads(content)
            
            suggestions = [FoodSuggestion(**item) for item in data.get("suggestions", [])]
            return suggestions
            
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")
    
    async def get_suggestions(self, request: FoodSuggestionRequest) -> List[FoodSuggestion]:
        """Get food suggestions using the configured AI provider."""
        if self.settings.ai_provider == "gemini":
            return await self.get_suggestions_gemini(request)
        else:
            return await self.get_suggestions_openai(request)
