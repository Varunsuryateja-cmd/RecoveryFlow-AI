import os
import logging
from dotenv import load_dotenv

# Load .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "RecoveryFlow AI API"
    PROJECT_DESCRIPTION: str = "Smart Stadium Exit Planner for FIFA World Cup 2026"
    VERSION: str = "1.0.0"
    
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))
    ENV: str = os.getenv("ENV", "development")
    
    # CORS Configuration
    # In development: automatically allow all localhost Vite dev ports (5173-5180)
    # so Vite's automatic port-bumping never causes a CORS failure.
    # In production: use the explicit CORS_ORIGINS list from .env.
    _env = os.getenv("ENV", "development")
    _cors_raw = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    _explicit = [o.strip() for o in _cors_raw.split(",") if o.strip()]
    if _env == "development":
        _dev_origins = [
            origin
            for port in range(5173, 5181)
            for origin in (f"http://localhost:{port}", f"http://127.0.0.1:{port}")
        ]
        # Merge: explicit list first, then dev origins (deduplicated)
        CORS_ORIGINS: list[str] = list(dict.fromkeys(_explicit + _dev_origins))
    else:
        CORS_ORIGINS: list[str] = _explicit
    
    # Engine Provider
    RECOMMENDATION_PROVIDER: str = os.getenv("RECOMMENDATION_PROVIDER", "rule")
    
    # Gemini API Key
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_ENRICH_EXPLANATIONS: bool = os.getenv("GEMINI_ENRICH_EXPLANATIONS", "false").lower() == "true"


settings = Settings()

# Setup Logging Config
logging.basicConfig(
    level=logging.INFO if settings.ENV == "development" else logging.WARNING,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("recoveryflow-ai")
