# 🌍 Ecosphere Backend

FastAPI backend for the Ecosphere Global Economic Intelligence Platform.

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
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Health Check

```
GET http://localhost:8000/api/health
```

Response:
```json
{
  "service": "Ecosphere Backend",
  "status": "healthy"
}
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI application entry point
│   ├── api/             # Route handlers
│   ├── services/        # Business logic
│   ├── models/          # Database models
│   ├── schemas/         # Pydantic request/response schemas
│   ├── config/          # Settings and client initialization
│   └── utils/           # Shared utilities
├── requirements.txt
├── .env.example
└── README.md
```

## Step 1 Limitations

Only the health endpoint is implemented. Economic data APIs will be added in future steps.
