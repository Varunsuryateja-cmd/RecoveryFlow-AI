from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional

class DestinationEnum(str, Enum):
    METRO = "metro"
    TAXI = "taxi"
    PARKING = "parking"
    BUS = "bus"

class PriorityEnum(str, Enum):
    FASTEST = "fastest"
    LEAST_CROWDED = "least-crowded"
    LEAST_WALKING = "least-walking"

class ScenarioIdEnum(str, Enum):
    SCENARIO1 = "scenario1"
    SCENARIO2 = "scenario2"
    SCENARIO3 = "scenario3"

class ScenarioModel(BaseModel):
    id: ScenarioIdEnum = Field(..., description="Unique scenario identifier")
    name: str = Field(..., description="Human readable scenario title")
    description: str = Field(..., description="Summary details of simulation conditions")
    icon: str = Field(..., description="Icon key used by frontend")

class ScenarioUpdateRequest(BaseModel):
    scenario_id: ScenarioIdEnum = Field(..., description="Target simulation scenario to activate")

class GateStatusModel(BaseModel):
    id: str = Field(..., description="Unique gate ID")
    name: str = Field(..., description="Gate description name")
    crowdLevel: str = Field(..., description="Congestion category: Low, Medium, High")
    waitTime: int = Field(..., description="Current checkpoint wait duration in minutes")
    statusText: str = Field(..., description="Descriptive status indicator text")

class QueueStatusModel(BaseModel):
    id: str = Field(..., description="Transit point ID")
    name: str = Field(..., description="Transit hub name")
    crowdLevel: str = Field(..., description="Congestion category: Low, Medium, High")
    waitTime: int = Field(..., description="Transit waiting duration in minutes")
    length: str = Field(..., description="Pedestrian queue size representation (e.g. 50m)")

class OperationsSnapshotModel(BaseModel):
    overallCrowd: int = Field(..., description="Total stadium congestion percentage")
    overallStatus: str = Field(..., description="Congestion category: Low, Medium, High")
    gates: List[GateStatusModel] = Field(..., description="Statuses for Gates A, B, and C")
    metroQueue: QueueStatusModel = Field(..., description="Metro loop queues")
    taxiQueue: QueueStatusModel = Field(..., description="Taxi dispatch queues")

class ExitPlanRequest(BaseModel):
    destination: DestinationEnum = Field(..., description="Transit target selection")
    priority: PriorityEnum = Field(..., description="User routing priority")
    accessibility: bool = Field(..., description="True if step-free access is required")

class ExitPlanModel(BaseModel):
    gateName: str = Field(..., description="Recommended gate exit name")
    leaveStatus: str = Field(..., description="Exit recommendation action (Leave Now, Wait 10 Mins, etc)")
    travelTime: int = Field(..., description="Est. transit travel time in minutes")
    explanation: str = Field(..., description="AI explanation of routing tradeoffs")
    routeSteps: List[str] = Field(..., description="Step by step walking paths")
    crowdLevel: str = Field(..., description="Route segment congestion category")

class ExitRecommendationModel(BaseModel):
    primary: ExitPlanModel = Field(..., description="Top recommended routing path")
    alternatives: List[ExitPlanModel] = Field(default=[], description="Alternative routes comparison")
    geminiEnriched: bool = Field(default=False, description="True when explanations were enhanced by Gemini")

class EmergencyAlertModel(BaseModel):
    active: bool = Field(..., description="Flag indicating if emergency alert is active")
    message: str = Field(..., description="Details and instructions for the emergency alert")
    type: str = Field(default="warning", description="Severity type: warning, danger, info")
    timestamp: str = Field(..., description="Timestamp of when the alert was issued")
