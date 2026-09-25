# 🌍 Ecosphere — Global Economic Intelligence Platform

> **Step 1 Status:** Project infrastructure only. No product features implemented yet.

---

## What is Ecosphere?

Ecosphere is an economic intelligence platform that will allow users to select countries from an interactive 3D globe and explore deep economic data including GDP, trade flows, inflation, FDI, risk analysis, and AI-generated economic insights.

---

## Project Architecture

```
ecosphere/
├── frontend/          # Next.js · React · TypeScript · Tailwind CSS
├── backend/           # Python · FastAPI · Supabase
└── ai service/        # Python · LangGraph · Google Gemini
```

The three services are independently deployable and communicate via HTTP APIs.

---

## Service Responsibilities

### Frontend (`/frontend`)
- Interactive 3D globe for country selection (future)
- Economic data dashboards and charts (future)
- Country search and filtering (future)
- Real-time data visualization (future)
- **Step 1:** Minimal Next.js shell — status page only

### Backend (`/backend`)
- REST API gateway for all economic data
- Supabase database integration
- World Bank / IMF / UN Comtrade data ingestion (future)
- Caching, rate limiting, and data normalization (future)
- **Step 1:** Health endpoint only (`GET /api/health`)

### AI Service (`/ai service`)
- LangGraph-powered agentic economic analysis
- Google Gemini integration for natural language intelligence
- Specialized agents: economic, trade, news, risk, historical, city, analysis, verification (future)
- Orchestrator workflow for multi-agent coordination (future)
- **Step 1:** Health endpoint + LangGraph/Gemini initialization only

---

## Ports

| Service    | Port | URL                               |
|------------|------|-----------------------------------|
| Frontend   | 3000 | http://localhost:3000             |
| Backend    | 8000 | http://localhost:8000             |
| AI Service | 8001 | http://localhost:8001             |

---

## How to Run Each Service

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Fill in your values in .env

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# → http://localhost:8000
# → http://localhost:8000/api/health
```

### AI Service

```bash
cd "ai service"
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Fill in your values in .env

uvicorn main:app --host 0.0.0.0 --port 8001 --reload
# → http://localhost:8001
# → http://localhost:8001/api/health
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable                  | Description                         | Exposure  |
|---------------------------|-------------------------------------|-----------|
| `SUPABASE_URL`            | Supabase project URL                | Server only |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role secret key  | **SECRET — server only** |

### AI Service (`ai service/.env`)

| Variable                  | Description                         | Exposure  |
|---------------------------|-------------------------------------|-----------|
| `GEMINI_API_KEY`          | Google Gemini API key               | **SECRET — server only** |
| `SUPABASE_URL`            | Supabase project URL                | Server only |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role secret key  | **SECRET — server only** |

> ⚠️ **Never expose `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` to the frontend or browser.**

---

## Security Notes

- All API keys and secrets live exclusively in server-side `.env` files
- `.env` files are listed in `.gitignore` — they are **never committed**
- Frontend receives **no** service-role keys or AI API keys
- Use `.env.example` files as templates — copy and fill with real values locally

---

## Step 1 Limitations

Step 1 only establishes project infrastructure. The following are **not implemented yet**:

- ❌ 3D globe or country selection
- ❌ Country search
- ❌ Economic dashboard or charts
- ❌ World Bank / IMF / UN Comtrade integration
- ❌ Trade routes, heatmaps, city networks
- ❌ News feed
- ❌ Historical timeline
- ❌ Investment signals or risk engine
- ❌ Any AI agents (economic, trade, news, risk, analysis, verification, orchestrator)
- ❌ Real economic data of any kind

These features will be implemented in subsequent steps.
