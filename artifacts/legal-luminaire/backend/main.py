"""
Legal Luminaire — FastAPI Backend
Multi-agent legal research + RAG + zero-hallucination drafting
"""
from __future__ import annotations

import logging
import time
from collections import defaultdict
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from api.routes import router

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


# ── Rate limiter (simple in-memory) ───────────────────────────────────────────
_request_counts: dict[str, list[float]] = defaultdict(list)


def _check_rate_limit(client_ip: str) -> bool:
    now = time.time()
    window = 60.0
    limit = settings.max_requests_per_minute
    timestamps = _request_counts[client_ip]
    # Remove old timestamps
    _request_counts[client_ip] = [t for t in timestamps if now - t < window]
    if len(_request_counts[client_ip]) >= limit:
        return False
    _request_counts[client_ip].append(now)
    return True


# ── Startup ────────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure directories exist
    settings.chroma_path.mkdir(parents=True, exist_ok=True)
    settings.case_docs_path.mkdir(parents=True, exist_ok=True)
    logger.info(f"ChromaDB path: {settings.chroma_path.resolve()}")
    logger.info(f"Case docs path: {settings.case_docs_path.resolve()}")
    logger.info(f"OpenAI configured: {bool(settings.openai_api_key)}")
    logger.info(f"Tavily configured: {bool(settings.tavily_api_key)}")
    yield
    logger.info("Shutting down Legal Luminaire backend.")


# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Legal Luminaire API",
    description="Zero-hallucination multi-agent legal research and drafting",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Only rate-limit the heavy research endpoint
    if "/research" in request.url.path:
        client_ip = request.client.host if request.client else "unknown"
        if not _check_rate_limit(client_ip):
            return JSONResponse(
                status_code=429,
                content={"detail": f"Rate limit: max {settings.max_requests_per_minute} research requests/minute"},
            )
    return await call_next(request)


app.include_router(router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "service": "Legal Luminaire API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/api/v1/health",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True,
        log_level="info",
    )
