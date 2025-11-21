# Food Suggestion AI Backend

AI-powered food suggestion service built with FastAPI, supporting both OpenAI GPT and Google Gemini models.

## 🚀 Features

- **AI-Powered Suggestions**: Get personalized food recommendations using GPT-4 or Gemini
- **Flexible Provider**: Switch between OpenAI and Google Gemini
- **Smart Prompting**: Include dietary preferences and cuisine types
- **RESTful API**: Clean, documented API endpoints
- **CORS Enabled**: Ready for frontend integration

## 📋 Prerequisites

- Python 3.12.7 (managed via vFox)
- API Key from OpenAI or Google AI Studio

## 🛠️ Setup Instructions

### 1. Install Python via vFox

```bash
# Install Python 3.12.7 (from project root)
vfox install python@3.12.7
```

### 2. Create Virtual Environment

```bash
cd apps/food-suggestion-ai-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your API keys
# Get OpenAI key: https://platform.openai.com/api-keys
# Get Gemini key: https://aistudio.google.com/app/apikey
```

**Example `.env` configuration:**

```env
# For OpenAI (recommended for better results)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
AI_PROVIDER=openai

# OR for Google Gemini (free tier available)
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxx
AI_PROVIDER=gemini
```

### 5. Run the Server

```bash
# From the backend directory
python -m app.main

# Or using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at: **http://localhost:8000**

## 📡 API Endpoints

### Health Check
```bash
GET /
GET /health
```

### Get Food Suggestions
```bash
POST /suggest
```

**Request Body:**
```json
{
  "user_input": "I have chicken, tomatoes, and pasta",
  "preferences": "vegetarian",
  "cuisine_type": "Italian"
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "name": "Chicken Parmigiana",
      "description": "Breaded chicken topped with tomato sauce and melted cheese",
      "ingredients": ["chicken", "tomatoes", "cheese", "breadcrumbs"],
      "reasoning": "Classic Italian dish using your available ingredients"
    },
    // ... 2 more suggestions
  ],
  "provider": "openai"
}
```

## 🧪 Testing the API

### Using cURL

```bash
curl -X POST http://localhost:8000/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "user_input": "I want something spicy with rice",
    "cuisine_type": "Indian"
  }'
```

### Using Python

```python
import requests

response = requests.post(
    "http://localhost:8000/suggest",
    json={
        "user_input": "I have chicken and vegetables",
        "preferences": "healthy",
        "cuisine_type": "Asian"
    }
)

print(response.json())
```

### Interactive API Docs

Visit **http://localhost:8000/docs** for Swagger UI with interactive API testing.

## 🔧 Configuration Options

| Variable | Options | Description |
|----------|---------|-------------|
| `AI_PROVIDER` | `openai` or `gemini` | Choose AI provider |
| `OPENAI_MODEL` | `gpt-4o-mini`, `gpt-4` | OpenAI model to use |
| `GEMINI_MODEL` | `gemini-1.5-flash`, `gemini-1.5-pro` | Gemini model to use |
| `DEBUG` | `True` or `False` | Enable debug mode |

## 📁 Project Structure

```
food-suggestion-ai-backend/
├── app/
│   ├── __init__.py          # Package initialization
│   ├── main.py              # FastAPI application & routes
│   ├── config.py            # Configuration management
│   ├── models.py            # Pydantic models
│   └── ai_service.py        # AI provider integration
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
├── requirements.txt         # Python dependencies
├── pyproject.toml          # Project metadata
└── README.md               # This file
```

## 🔮 Phase 2 Preview

Coming next:
- PostgreSQL database integration
- Recipe book data storage
- Smart ranking algorithm
- Top 3 combination suggestions from your own data

## 📝 Notes

- **OpenAI**: Better reasoning, costs ~$0.15/1M input tokens for gpt-4o-mini
- **Gemini**: Free tier available, fast responses with gemini-1.5-flash
- Both providers return 3 suggestions per request
- CORS is enabled for all origins (update in production)

## 🐛 Troubleshooting

**Import errors?**
```bash
# Make sure you're in the backend directory and venv is activated
source venv/bin/activate
pip install -r requirements.txt
```

**API key errors?**
```bash
# Check your .env file exists and has valid keys
cat .env
```

**Port already in use?**
```bash
# Change the port
uvicorn app.main:app --reload --port 8001
```

## 📄 License

MIT
