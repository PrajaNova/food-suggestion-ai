from pydantic import BaseModel, Field
from typing import List, Optional


class FoodSuggestionRequest(BaseModel):
    """Request model for food suggestions."""
    
    user_input: str = Field(
        ..., 
        description="User's food preference, ingredients, or constraints",
        min_length=1,
        max_length=500
    )
    preferences: Optional[str] = Field(
        None,
        description="Additional dietary preferences (vegetarian, vegan, etc.)"
    )
    cuisine_type: Optional[str] = Field(
        None,
        description="Preferred cuisine type (Italian, Indian, Mexican, etc.)"
    )


class FoodSuggestion(BaseModel):
    """Individual food suggestion model."""
    
    name: str = Field(..., description="Name of the dish")
    description: str = Field(..., description="Brief description of the dish")
    ingredients: List[str] = Field(..., description="Key ingredients")
    reasoning: str = Field(..., description="Why this suggestion matches the input")


class FoodSuggestionResponse(BaseModel):
    """Response model for food suggestions."""
    
    suggestions: List[FoodSuggestion] = Field(
        ..., 
        description="List of food suggestions"
    )
    provider: str = Field(..., description="AI provider used (openai or gemini)")
