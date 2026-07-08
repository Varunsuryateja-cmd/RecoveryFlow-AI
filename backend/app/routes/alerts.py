"""
Alerts Router
Endpoints for broadcasting and dismissing emergency stadium alerts.
"""
import logging
from datetime import datetime, timezone
from fastapi import APIRouter
from app.models import EmergencyAlertModel

logger = logging.getLogger("recoveryflow-ai.alerts")
router = APIRouter(prefix="/alerts", tags=["Alerts"])

# In-memory alert state
_alert_state: EmergencyAlertModel = EmergencyAlertModel(
    active=False,
    message="",
    type="info",
    timestamp=datetime.now(timezone.utc).isoformat()
)


@router.get(
    "/emergency",
    response_model=EmergencyAlertModel,
    summary="Get current emergency alert",
    description="Returns the currently active emergency broadcast, or an inactive alert if none is set."
)
def get_emergency_alert() -> EmergencyAlertModel:
    logger.info("GET /alerts/emergency — active: %s", _alert_state.active)
    return _alert_state


@router.post(
    "/emergency",
    response_model=EmergencyAlertModel,
    summary="Set or dismiss emergency alert",
    description=(
        "Broadcast an emergency message to all connected clients, or set active=false to dismiss. "
        "Alert types: 'danger' (red), 'warning' (amber), 'info' (cyan)."
    )
)
def set_emergency_alert(payload: EmergencyAlertModel) -> EmergencyAlertModel:
    global _alert_state
    _alert_state = EmergencyAlertModel(
        active=payload.active,
        message=payload.message,
        type=payload.type,
        timestamp=datetime.now(timezone.utc).isoformat()
    )
    status = "activated" if payload.active else "dismissed"
    logger.info("POST /alerts/emergency — alert %s: %s", status, payload.message[:80] if payload.message else "")
    return _alert_state
