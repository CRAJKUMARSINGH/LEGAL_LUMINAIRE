"""Central configuration — reads from .env"""
from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    openai_api_key: str = ""
    tavily_api_key: str = ""
    serper_api_key: str = ""

    chroma_persist_dir: str = "./chroma_db"
    case_docs_dir: str = "./uploaded_cases"
    
    # Redis configuration
    redis_url: str = "redis://localhost:6379/0"
    cache_ttl_default: int = 3600  # 1 hour
    cache_ttl_embeddings: int = 86400  # 24 hours
    cache_ttl_search: int = 1800  # 30 minutes

    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    llm_model: str = "gpt-4o"
    llm_temperature_research: float = 0.0
    llm_temperature_draft: float = 0.2
    embedding_model: str = "text-embedding-3-small"

    max_requests_per_minute: int = 10
    max_tokens_per_request: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    @property
    def chroma_path(self) -> Path:
        return Path(self.chroma_persist_dir)

    @property
    def case_docs_path(self) -> Path:
        return Path(self.case_docs_dir)


settings = Settings()
