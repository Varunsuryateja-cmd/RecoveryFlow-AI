# RecoveryFlow AI

An AI-powered smart stadium exit planner for the FIFA World Cup 2026. The system helps football fans make smarter post-match exit decisions using intelligent recommendations based on stadium congestion, weather conditions, and transport queues.

## Live Demo

- **Frontend:** https://recovery-flow-ai.vercel.app/
- **Backend API:** https://recoveryflow-ai.onrender.com
- **API Documentation (Swagger):** https://recoveryflow-ai.onrender.com/docs

---

# Project Structure

```
RecoveryFlow-AI/
├── run.ps1                  # Windows launcher script
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── config.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── routes/
│   │   │   ├── alerts.py
│   │   │   ├── recommendations.py
│   │   │   ├── scenarios.py
│   │   │   └── stadium.py
│   │   └── services/
│   │       ├── base_engine.py
│   │       └── rule_engine.py
│   ├── requirements.txt
│   └── .env
└── frontend/                # React + Vite + TypeScript
    ├── src/
    └── index.html
```

---

# Features

- Smart AI-powered exit route recommendations
- Multiple simulation scenarios
- Live stadium congestion snapshot
- Weather-aware routing
- Accessibility-aware recommendations
- Emergency broadcast system
- REST API with Swagger documentation
- Easily extendable AI recommendation engine

---

# Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- FastAPI
- Python
- Pydantic
- Uvicorn

### Deployment
- Frontend: Vercel
- Backend: Render

---

# Prerequisites

- Python 3.10+
- Node.js 18+
- PowerShell (Windows)

---

# Running Locally

From the project root:

```powershell
.\run.ps1
```

This installs dependencies (if needed) and starts both the frontend and backend.

### Local URLs

Frontend Dashboard

```
http://localhost:5173
```

Backend API

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

# Live Application

Frontend

https://recovery-flow-ai.vercel.app/

Backend

https://recoveryflow-ai.onrender.com

Swagger Docs

https://recoveryflow-ai.onrender.com/docs

---

# API Documentation

## 1. Simulation Scenarios

### Get all scenarios

```
GET /api/scenarios
```

### Get active scenario

```
GET /api/scenarios/active
```

### Change active scenario

```
POST /api/scenarios/active
```

Request

```json
{
  "scenario_id": "scenario1"
}
```

Supported values

- scenario1
- scenario2
- scenario3

---

## 2. Stadium Operations

### Get stadium snapshot

```
GET /api/stadium/snapshot
```

Returns current crowd levels and transport wait times.

---

## 3. AI Exit Recommendations

### Generate recommendation

```
POST /api/recommendations/generate
```

Example Request

```json
{
  "destination": "metro",
  "priority": "fastest",
  "accessibility": false
}
```

Supported destinations

- metro
- taxi
- bus
- parking

Supported priorities

- fastest
- least-crowded
- least-walking

Example Response

```json
{
  "recommended_gate": "Gate B",
  "estimated_time": "12 minutes",
  "reason": "Lowest congestion and shortest queue.",
  "alternatives": [
    "Gate C",
    "Gate A"
  ]
}
```

---

## 4. Emergency Alerts

### Get emergency status

```
GET /api/alerts/emergency
```

### Trigger or clear an alert

```
POST /api/alerts/emergency
```

Example Request

```json
{
  "active": true,
  "message": "Emergency: Fire alarm in Zone A. Please proceed to the nearest open exit immediately.",
  "type": "warning"
}
```

Types

- info
- warning
- danger

---

# AI Extensibility

The recommendation engine follows a modular architecture.

Base interface:

```
services/base_engine.py
```

Default implementation:

```
services/rule_engine.py
```

To integrate Google Gemini or another LLM:

1. Create a new engine (for example `gemini_engine.py`).
2. Add your API key to `.env`.

```
GEMINI_API_KEY=your_api_key
```

3. Set the provider.

```
RECOMMENDATION_PROVIDER=gemini
```

No API changes are required because all engines implement the same abstract interface.

---

# Future Improvements

- Real-time crowd analytics
- Live weather integration
- Google Maps routing
- Public transport APIs
- Push notifications
- Predictive congestion forecasting
- Multi-language support
- Mobile application

---

# License

This project is intended for educational, research, and hackathon purposes.│   │   │   ├── scenarios.py
│   │   │   └── stadium.py
│   │   └── services/        # Business logic services
│   │       ├── base_engine.py # Abstract base interface for routing engines
│   │       └── rule_engine.py # Default rule-based routing engine
│   ├── requirements.txt
│   └── .env
└── frontend/                # Vite + React + TS dashboard
    ├── src/
    └── index.html
```

---

## Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **PowerShell** (for Windows)

### Running the Application

To install all dependencies, build the assets, and start both the **FastAPI backend** and **React frontend** concurrently, run the following command in your PowerShell terminal at the project root:

```powershell
.\run.ps1
```

Once running:
- **Frontend Dashboard**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API Server**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **OpenAPI documentation (Swagger UI)**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## API Documentation

The backend exposes the following REST APIs:

### 1. Simulation Scenarios
- **`GET /api/scenarios`**: Retrieve list of all simulation scenarios (Standard, Heavy Rain, Parking Congestion).
- **`GET /api/scenarios/active`**: Get the ID of the currently active weather/crowd simulation scenario.
- **`POST /api/scenarios/active`**: Set the active simulation scenario ID.
  - Body: `{"scenario_id": "scenario1" | "scenario2" | "scenario3"}`

### 2. Stadium & Transport Operations
- **`GET /api/stadium/snapshot`**: Get the current overall crowd level and gate delay checklist (Gates A, B, C, Metro, Taxi).

### 3. Exit Routing Recommendations
- **`POST /api/recommendations/generate`**: Calculate the optimal exit gate, travel duration, AI explanations, and alternative routes.
  - Body:
    ```json
    {
      "destination": "metro" | "taxi" | "bus" | "parking",
      "priority": "fastest" | "least-crowded" | "least-walking",
      "accessibility": true | false
    }
    ```

### 4. Emergency Broadcasts
- **`GET /api/alerts/emergency`**: Retrieve any active emergency broadcast instructions.
- **`POST /api/alerts/emergency`**: Trigger or silence an emergency broadcast banner.
  - Body:
    ```json
    {
      "active": true,
      "message": "Emergency: Fire alarm in Zone A. Please proceed to the nearest open exit immediately.",
      "type": "warning" | "danger" | "info"
    }
    ```

---

## AI Extensibility

The routing recommendation engine is built using an abstract interface `BaseRecommendationEngine` in [base_engine.py](file:///c:/Users/varun/Documents/RecoveryFlow-AI/backend/app/services/base_engine.py).

To plug in Google Gemini or another LLM:
1. Implement the subclass in a new file (e.g. `gemini_engine.py`).
2. Add your `GEMINI_API_KEY` to the `.env` file.
3. Toggle the `RECOMMENDATION_PROVIDER=gemini` environment setting.
