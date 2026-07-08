"""
RecoveryFlow AI - FastAPI Application Entry Point

Configures CORS, registers routers, mounts OpenAPI docs,
and provides a health-check endpoint.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routes import scenarios, stadium, recommendations, alerts

logger = logging.getLogger("recoveryflow-ai.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle hooks."""
    logger.info(
        "RecoveryFlow AI backend starting — env=%s provider=%s",
        settings.ENV,
        settings.RECOMMENDATION_PROVIDER,
    )
    logger.info("CORS allowed origins: %s", settings.CORS_ORIGINS)
    yield
    logger.info("RecoveryFlow AI backend shutting down.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# ── CORS Middleware ──────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Global Exception Handler ─────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."},
    )


# ── Register Routers ─────────────────────────────────────────────────────────
API_PREFIX = "/api"

app.include_router(scenarios.router,        prefix=API_PREFIX)
app.include_router(stadium.router,          prefix=API_PREFIX)
app.include_router(recommendations.router,  prefix=API_PREFIX)
app.include_router(alerts.router,           prefix=API_PREFIX)


# ── Health Check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"], summary="Health check")
def health_check():
    """Returns server status and active recommendation engine provider."""
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "env": settings.ENV,
        "engine": settings.RECOMMENDATION_PROVIDER,
    }


@app.get("/", tags=["Health"], include_in_schema=False)
def root():
    return {
        "message": "RecoveryFlow AI API is running.",
        "docs": "/docs",
        "health": "/health",
    }
