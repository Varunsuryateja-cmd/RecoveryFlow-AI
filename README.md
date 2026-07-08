# RecoveryFlow AI

An AI-powered smart stadium exit planner for the FIFA World Cup 2026. This system helps football fans make optimal post-match exit decisions using dynamic recommendations based on real-time stadium congestion, weather conditions, and transport queues.

## Project Structure

```text
RecoveryFlow-AI/
├── run.ps1                  # Single launcher command script (Windows)
├── backend/                 # FastAPI modular application
│   ├── app/
│   │   ├── config.py        # Central configuration & logging
│   │   ├── main.py          # FastAPI application entry & CORS middleware
│   │   ├── models.py        # Pydantic schemas for REST APIs
│   │   ├── routes/          # API route definitions
│   │   │   ├── alerts.py
│   │   │   ├── recommendations.py
│   │   │   ├── scenarios.py
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
