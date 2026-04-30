"""
Legal Luminaire â€” FastAPI Backend
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
from api.routes_omni import router as omni_router
from api.routes_cases import router as cases_router
from api.routes_drafting import router as drafting_router
from api.routes_search import router as search_router
from api.routes_oral import router as oral_router
from api.routes_lab import router as lab_router
from api.routes_collision import router as collision_router
from api.routes_auto_research import router as auto_research_router
from api.routes_verify import router as verify_router
from api.routes_legal_stream import router as legal_stream_router
from api.routes_similarity import router as similarity_router
from api.routes_analytics import router as analytics_router
from api.routes_graph import router as graph_router

# â”€â”€ Logging â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


# â”€â”€ Rate limiter (simple in-memory) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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


# â”€â”€ Startup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure directories exist
    settings.chroma_path.mkdir(parents=True, exist_ok=True)
    settings.case_docs_path.mkdir(parents=True, exist_ok=True)
    logger.info(f"ChromaDB path: {settings.chroma_path.resolve()}")
    logger.info(f"Case docs path: {settings.case_docs_path.resolve()}")
    logger.info(f"OpenAI configured: {bool(settings.openai_api_key)}")
    logger.info(f"Tavily configured: {bool(settings.tavily_api_key)}")

    # Auto-preload Case 01 documents if OpenAI is configured
    if settings.openai_api_key:
        try:
            from preload_case01 import preload_hemraj_case
            result = preload_hemraj_case()
            if result.get("success"):
                logger.info(
                    f"Case01 preloaded: {result['files_indexed']} files, "
                    f"{result['total_chunks']} chunks"
                )
            else:
                logger.warning(f"Case01 preload skipped: {result.get('error')}")
        except Exception as e:
            logger.warning(f"Case01 preload failed (non-fatal): {e}")
    else:
        logger.info("OpenAI not configured â€” skipping Case01 preload")

    yield
    logger.info("Shutting down Legal Luminaire backend.")


# â”€â”€ App â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
app.include_router(omni_router, prefix="/api/v1")
app.include_router(cases_router, prefix="/api/v1")
app.include_router(drafting_router, prefix="/api/v1")
app.include_router(search_router, prefix="/api/v1")
app.include_router(oral_router, prefix="/api/v1")
app.include_router(lab_router, prefix="/api/v1")
app.include_router(collision_router, prefix="/api/v1")
app.include_router(auto_research_router, prefix="/api/v1")
app.include_router(verify_router, prefix="/api/v1")
app.include_router(legal_stream_router, prefix="/api/legal")
app.include_router(similarity_router)
app.include_router(analytics_router)
app.include_router(graph_router)


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
