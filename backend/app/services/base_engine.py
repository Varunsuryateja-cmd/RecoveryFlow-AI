from abc import ABC, abstractmethod
from app.models import ExitPlanRequest, ExitRecommendationModel, ScenarioIdEnum

class BaseRecommendationEngine(ABC):
    """
    Abstract Base Class for the Exit Recommendation Engine.
    Enables swapping the routing engine implementation (e.g. rule-based to Gemini AI)
    without modifying the API routing endpoints.
    """
    
    @abstractmethod
    def generate_recommendation(
        self, 
        scenario_id: ScenarioIdEnum, 
        request: ExitPlanRequest
    ) -> ExitRecommendationModel:
        """
        Generate primary and alternative exit plans based on active simulation parameters.
        
        Args:
            scenario_id: Active simulation scenario (scenario1, scenario2, scenario3)
            request: Exit plan parameters (destination, priority, accessibility)
            
        Returns:
            ExitRecommendationModel containing primary and alternative plans.
        """
        pass
