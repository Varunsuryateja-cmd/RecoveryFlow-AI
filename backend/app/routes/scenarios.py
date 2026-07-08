"""
Scenarios Router
Endpoints for listing, retrieving, and switching simulation scenarios.
"""
import logging
from fastapi import APIRouter, HTTPException
from app.models import ScenarioModel, ScenarioUpdateRequest, ScenarioIdEnum

logger = logging.getLogger("recoveryflow-ai.scenarios")
router = APIRouter(prefix="/scenarios", tags=["Scenarios"])

# In-memory active scenario state (default: scenario1 - Match Finished)
_active_scenario: ScenarioIdEnum = ScenarioIdEnum.SCENARIO1

SCENARIOS: list[ScenarioModel] = [
    ScenarioModel(
        id=ScenarioIdEnum.SCENARIO1,
        name="Match Finished",
        description="Post-match standard exit. High congestion at main exits.",
        icon="SoccerBall"
    ),
    ScenarioModel(
        id=ScenarioIdEnum.SCENARIO2,
        name="Heavy Rain",
        description="Sudden downpour. Public metro crowded, taxi demand surging.",
        icon="CloudRain"
    ),
    ScenarioModel(
        id=ScenarioIdEnum.SCENARIO3,
        name="Parking Congestion",
        description="Traffic gridlock in North Lots. High congestion at Gate C.",
        icon="Car"
    ),
]


@router.get(
    "",
    response_model=list[ScenarioModel],
    summary="List all simulation scenarios",
    description="Returns all available simulation scenarios for the stadium exit planner."
)
def get_scenarios() -> list[ScenarioModel]:
    logger.info("GET /scenarios — returning %d scenarios", len(SCENARIOS))
    return SCENARIOS


@router.get(
    "/active",
    summary="Get active scenario ID",
    description="Returns the ID of the currently active simulation scenario."
)
def get_active_scenario() -> dict:
    logger.info("GET /scenarios/active — active: %s", _active_scenario)
    return {"scenario_id": _active_scenario}


@router.post(
    "/active",
    summary="Set active scenario",
    description="Switch the active simulation scenario. Affects stadium snapshot and recommendation computations."
)
def set_active_scenario(payload: ScenarioUpdateRequest) -> dict:
    global _active_scenario
    _active_scenario = payload.scenario_id
    logger.info("POST /scenarios/active — switched to: %s", _active_scenario)
    return {"scenario_id": _active_scenario, "message": f"Scenario switched to {_active_scenario}"}
