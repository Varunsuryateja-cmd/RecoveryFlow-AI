"""
Recommendations Router
Endpoint for generating AI-powered exit route recommendations.
The engine is swappable — rule-based by default, Gemini-ready.
After the engine runs, explanations are optionally enriched by Gemini.
"""
import logging
from fastapi import APIRouter, HTTPException
from app.models import ExitPlanRequest, ExitRecommendationModel
from app.config import settings

logger = logging.getLogger("recoveryflow-ai.recommendations")
router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


def _get_engine():
    """
    Engine factory — returns the active recommendation engine instance.
    Switch RECOMMENDATION_PROVIDER env var to 'gemini' to fully replace the engine.
    """
    provider = settings.RECOMMENDATION_PROVIDER.lower()
    if provider == "gemini":
        try:
            from app.services.gemini_engine import GeminiRecommendationEngine
            logger.info("Using Gemini recommendation engine")
            return GeminiRecommendationEngine()
        except ImportError:
            logger.warning("GeminiEngine not found — falling back to RuleBasedEngine")
    from app.services.rule_engine import RuleBasedRecommendationEngine
    logger.info("Using rule-based recommendation engine")
    return RuleBasedRecommendationEngine()


@router.post(
    "/generate",
    response_model=ExitRecommendationModel,
    summary="Generate exit route recommendation",
    description=(
        "Compute the optimal exit gate, estimated travel time, routing steps, and alternative plans "
        "based on the active simulation scenario and user preferences. "
        "Route structure is rule-based; explanations are optionally enriched by Gemini when "
        "GEMINI_ENRICH_EXPLANATIONS=true and GEMINI_API_KEY is set."
    )
)
def generate_recommendation(request: ExitPlanRequest) -> ExitRecommendationModel:
    from app.routes import scenarios as _sc_module
    active_scenario = _sc_module._active_scenario
    logger.info(
        "POST /recommendations/generate — scenario=%s dest=%s priority=%s accessibility=%s",
        active_scenario, request.destination, request.priority, request.accessibility
    )
    try:
        # 1. Run rule-based engine to get structured route
        engine = _get_engine()
        result = engine.generate_recommendation(active_scenario, request)

        # 2. Optionally enrich explanations with Gemini (graceful fallback built in)
        if settings.GEMINI_ENRICH_EXPLANATIONS and settings.GEMINI_API_KEY:
            from app.services.gemini_enricher import enrich
            result = enrich(result, active_scenario)
            logger.info("Gemini enrichment applied: %s", result.geminiEnriched)

        logger.info(
            "Recommendation ready: gate=%s travelTime=%dm enriched=%s",
            result.primary.gateName, result.primary.travelTime, result.geminiEnriched
        )
        return result
    except Exception as exc:
        logger.exception("Recommendation engine failed: %s", exc)
        raise HTTPException(status_code=500, detail=f"Recommendation engine error: {str(exc)}")
