"""
Stadium Router
Endpoints for real-time stadium crowd metrics and transport queue status.
"""
import logging
from fastapi import APIRouter
from app.models import OperationsSnapshotModel, GateStatusModel, QueueStatusModel, ScenarioIdEnum
from app.routes.scenarios import _active_scenario as _get_active

logger = logging.getLogger("recoveryflow-ai.stadium")
router = APIRouter(prefix="/stadium", tags=["Stadium"])


def _build_snapshot(scenario_id: ScenarioIdEnum) -> OperationsSnapshotModel:
    """Build the operations snapshot model for the given scenario."""
    if scenario_id == ScenarioIdEnum.SCENARIO1:
        return OperationsSnapshotModel(
            overallCrowd=78,
            overallStatus="High",
            gates=[
                GateStatusModel(id="gateA", name="Gate A (South)", crowdLevel="High",   waitTime=25, statusText="Congested"),
                GateStatusModel(id="gateB", name="Gate B (East)",  crowdLevel="Medium", waitTime=12, statusText="Moving"),
                GateStatusModel(id="gateC", name="Gate C (West)",  crowdLevel="Low",    waitTime=4,  statusText="Clear"),
            ],
            metroQueue=QueueStatusModel(id="metro", name="Metro Station Loop", crowdLevel="Medium", waitTime=5,  length="60m"),
            taxiQueue =QueueStatusModel(id="taxi",  name="Taxi Stand Queue",   crowdLevel="High",   waitTime=15, length="120m"),
        )
    elif scenario_id == ScenarioIdEnum.SCENARIO2:
        return OperationsSnapshotModel(
            overallCrowd=85,
            overallStatus="High",
            gates=[
                GateStatusModel(id="gateA", name="Gate A (South)", crowdLevel="Medium", waitTime=14, statusText="Moderate"),
                GateStatusModel(id="gateB", name="Gate B (East)",  crowdLevel="High",   waitTime=28, statusText="Sheltered/Congested"),
                GateStatusModel(id="gateC", name="Gate C (West)",  crowdLevel="Low",    waitTime=6,  statusText="Clear"),
            ],
            metroQueue=QueueStatusModel(id="metro", name="Metro Station Loop", crowdLevel="High",   waitTime=18, length="210m"),
            taxiQueue =QueueStatusModel(id="taxi",  name="Taxi Stand Queue",   crowdLevel="Medium", waitTime=6,  length="30m"),
        )
    else:  # SCENARIO3
        return OperationsSnapshotModel(
            overallCrowd=65,
            overallStatus="Medium",
            gates=[
                GateStatusModel(id="gateA", name="Gate A (South)", crowdLevel="Low",    waitTime=5,  statusText="Clear"),
                GateStatusModel(id="gateB", name="Gate B (East)",  crowdLevel="Medium", waitTime=10, statusText="Moving"),
                GateStatusModel(id="gateC", name="Gate C (West)",  crowdLevel="High",   waitTime=22, statusText="Parking Gridlock"),
            ],
            metroQueue=QueueStatusModel(id="metro", name="Metro Station Loop", crowdLevel="Low",  waitTime=3,  length="15m"),
            taxiQueue =QueueStatusModel(id="taxi",  name="Taxi Stand Queue",   crowdLevel="High", waitTime=25, length="180m"),
        )


@router.get(
    "/snapshot",
    response_model=OperationsSnapshotModel,
    summary="Get current stadium operations snapshot",
    description="Returns gate congestion levels, wait times, metro/taxi queue lengths for the active simulation scenario."
)
def get_snapshot() -> OperationsSnapshotModel:
    from app.routes import scenarios as _sc_module
    active = _sc_module._active_scenario
    logger.info("GET /stadium/snapshot — scenario: %s", active)
    return _build_snapshot(active)
