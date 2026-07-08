"""
Gemini Explanation Enricher
Rewrites the `explanation` field on a completed ExitRecommendationModel using
Gemini 2.0 Flash. Only the explanation text is changed — gate, travel time,
crowd level, and route steps are produced by the rule engine and are unchanged.

Graceful fallback: if the API key is missing, the quota is exceeded, or any
network/SDK error occurs, the original rule-engine explanation is returned as-is.
"""
import logging
from app.models import ExitRecommendationModel, ExitPlanModel, ScenarioIdEnum
from app.config import settings

logger = logging.getLogger("recoveryflow-ai.gemini")

# Scenario labels used in the prompt
_SCENARIO_LABELS = {
    ScenarioIdEnum.SCENARIO1: "post-match standard exit (high crowd at main gates)",
    ScenarioIdEnum.SCENARIO2: "heavy rain (fans avoiding unsheltered exits)",
    ScenarioIdEnum.SCENARIO3: "parking gridlock (North Lot congested)",
}


def _build_prompt(scenario_id: ScenarioIdEnum, plan: ExitPlanModel, is_primary: bool) -> str:
    label = _SCENARIO_LABELS.get(scenario_id, "match exit")
    role = "primary recommended" if is_primary else "alternative"
    return (
        f"You are RecoveryFlow AI, an intelligent FIFA World Cup 2026 stadium exit assistant. "
        f"A fan needs to leave MetLife Stadium. The current situation is: {label}. "
        f"The {role} route is via {plan.gateName} — crowd level {plan.crowdLevel}, "
        f"estimated {plan.travelTime} minutes, action: {plan.leaveStatus}. "
        f"Steps: {' → '.join(plan.routeSteps)}.\n\n"
        f"Current explanation: \"{plan.explanation}\"\n\n"
        f"Rewrite this explanation in 2-3 concise sentences. Be specific about why this gate "
        f"is chosen, what the fan should expect, and any important tips. "
        f"Keep it under 60 words. Respond with only the explanation text, no labels or quotes."
    )


def _enrich_plan(client, scenario_id: ScenarioIdEnum, plan: ExitPlanModel, is_primary: bool) -> ExitPlanModel:
    """Enrich a single plan's explanation. Returns original plan on any failure."""
    try:
        prompt = _build_prompt(scenario_id, plan, is_primary)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        enriched_text = response.text.strip()
        if enriched_text:
            return plan.model_copy(update={"explanation": enriched_text})
    except Exception as exc:
        logger.warning("Gemini enrichment failed for %s: %s — using original explanation", plan.gateName, exc)
    return plan


def enrich(
    result: ExitRecommendationModel,
    scenario_id: ScenarioIdEnum,
) -> ExitRecommendationModel:
    """
    Enrich all explanation fields in the recommendation using Gemini.
    Returns the original result unchanged if Gemini is unavailable.
    """
    if not settings.GEMINI_API_KEY:
        logger.debug("GEMINI_API_KEY not set — skipping enrichment")
        return result

    try:
        from google import genai  # type: ignore
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
    except ImportError:
        logger.warning("google-genai not installed — skipping enrichment")
        return result
    except Exception as exc:
        logger.warning("Failed to init Gemini client: %s", exc)
        return result

    enriched_primary = _enrich_plan(client, scenario_id, result.primary, is_primary=True)
    enriched_alts = [
        _enrich_plan(client, scenario_id, alt, is_primary=False)
        for alt in result.alternatives
    ]

    return result.model_copy(update={
        "primary": enriched_primary,
        "alternatives": enriched_alts,
        "geminiEnriched": True,
    })
