# 🤖 Ecosphere AI Service

LangGraph + Google Gemini AI service for the Ecosphere Global Economic Intelligence Platform.

## Quick Start

```bash
# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and fill in your credentials

# Run the server
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

## Health Check

```
GET http://localhost:8001/api/health
```

Response:
```json
{
  "service": "Ecosphere AI Service",
  "status": "healthy",
  "agent_runtime": "ready",
  "gemini_configured": true
}
```

- `agent_runtime: "ready"` — LangGraph initialized successfully
- `agent_runtime: "error"` — LangGraph initialization failed (see `agent_runtime_error`)
- `gemini_configured: true` — GEMINI_API_KEY is set

## API Documentation

- Swagger UI: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

## Project Structure

```
ai service/
├── agents/
│   ├── orchestrator/    # Orchestrator agent (future)
│   ├── economic/        # Economic data agent (future)
│   ├── trade/           # Trade analysis agent (future)
│   ├── news/            # News intelligence agent (future)
│   ├── historical/      # Historical data agent (future)
│   ├── city/            # Economic city agent (future)
│   ├── risk/            # Risk analysis agent (future)
│   ├── analysis/        # Economic analysis agent (future)
│   └── verification/    # Data verification agent (future)
├── graphs/              # LangGraph workflows
├── tools/               # Agent tools (future)
├── services/            # Business logic services (future)
├── schemas/             # Pydantic data schemas (future)
├── prompts/             # Gemini prompt templates (future)
├── config/              # Settings and client initialization
├── utils/               # Shared utilities (future)
├── main.py              # FastAPI application entry point
├── requirements.txt
├── .env.example
└── README.md
```

## Step 1 Limitations

- LangGraph runtime is verified but no real agents are implemented
- Gemini SDK is configured but no prompts or analysis are implemented
- All agent directories are stubs for future implementation
