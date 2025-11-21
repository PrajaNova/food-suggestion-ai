from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings, Settings
from app.models import FoodSuggestionRequest, FoodSuggestionResponse
from app.ai_service import AIService
import google.generativeai as genai
from typing import Optional

app = FastAPI(
    title="Food Suggestion AI API",
    description="AI-powered food suggestion service using OpenAI and Google Gemini",
    version="0.1.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "message": "Food Suggestion AI API is running",
        "version": "0.1.0"
    }


@app.get("/health")
async def health_check(settings: Settings = Depends(get_settings)):
    """Detailed health check with configuration status."""
    return {
        "status": "healthy",
        "ai_provider": settings.ai_provider,
        "openai_configured": bool(settings.openai_api_key),
        "gemini_configured": bool(settings.gemini_api_key),
    }


@app.get("/models/gemini")
async def list_gemini_models(settings: Settings = Depends(get_settings)):
    """List all available Gemini models that support content generation."""
    try:
        if not settings.gemini_api_key:
            raise HTTPException(
                status_code=500,
                detail="Gemini API key not configured"
            )
        
        genai.configure(api_key=settings.gemini_api_key)
        
        models = []
        for model in genai.list_models():
            if 'generateContent' in model.supported_generation_methods:
                models.append({
                    "name": model.name,
                    "display_name": model.display_name,
                    "description": model.description,
                    "supported_methods": model.supported_generation_methods
                })
        
        return {
            "count": len(models),
            "models": models
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching models: {str(e)}"
        )


@app.post("/suggest", response_model=FoodSuggestionResponse)
async def suggest_food(
    request: FoodSuggestionRequest,
    settings: Settings = Depends(get_settings),
    x_ai_provider: Optional[str] = Header(None, alias="X-AI-Provider"),
    x_openai_api_key: Optional[str] = Header(None, alias="X-OpenAI-API-Key"),
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key"),
):
    """
    Generate food suggestions based on user input.
    
    - **user_input**: What the user wants to eat or ingredients they have
    - **preferences**: Optional dietary preferences (vegetarian, vegan, etc.)
    - **cuisine_type**: Optional preferred cuisine type
    
    API keys can be provided via headers (X-OpenAI-API-Key or X-Gemini-API-Key)
    or will fall back to environment variables.
    """
    try:
        # Determine provider - use header if provided, otherwise use settings
        provider = x_ai_provider or settings.ai_provider
        
        # Get API keys - use headers if provided, otherwise use settings
        openai_key = x_openai_api_key or settings.openai_api_key
        gemini_key = x_gemini_api_key or settings.gemini_api_key
        
        # Validate API keys
        if provider == "openai" and not openai_key:
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not configured. Please provide it via settings or headers."
            )
        
        if provider == "gemini" and not gemini_key:
            raise HTTPException(
                status_code=500,
                detail="Gemini API key not configured. Please provide it via settings or headers."
            )
        
        # Create a custom settings object with the provided keys
        custom_settings = Settings(
            openai_api_key=openai_key,
            gemini_api_key=gemini_key,
            ai_provider=provider,
            openai_model=settings.openai_model,
            gemini_model=settings.gemini_model,
            app_name=settings.app_name,
            debug=settings.debug
        )
        
        # Get AI service instance with custom settings
        ai_service = AIService(custom_settings)
        
        # Generate suggestions
        suggestions = await ai_service.get_suggestions(request)
        
        return FoodSuggestionResponse(
            suggestions=suggestions,
            provider=custom_settings.ai_provider
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating suggestions: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
