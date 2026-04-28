"""
Optimized RAG Document Store — Legal Luminaire v3
─────────────────────────────────────────────────
Upgrades over v2:
  • SBERT / GTE-Large local embeddings (no OpenAI calls for embeddings)
  • BM25 sparse retrieval fused with dense semantic retrieval (Reciprocal Rank Fusion)
  • Dynamic context window: simple query → 600-char chunks, complex → 1800-char chunks
  • Incremental indexing (MD5 change-detection, skip unchanged files)
  • Async parallel document loading
"""
from __future__ import annotations

import asyncio
import hashlib
import logging
import math
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import time

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    UnstructuredWordDocumentLoader,
    UnstructuredImageLoader,
)
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma

# ── SBERT/GTE-Large local embeddings ──────────────────────────────────────────
try:
    from langchain_huggingface import HuggingFaceEmbeddings
    _EMBEDDINGS_BACKEND = "huggingface"
except ImportError:
    from langchain_openai import OpenAIEmbeddings  # type: ignore
    _EMBEDDINGS_BACKEND = "openai"

# BM25 for sparse retrieval
try:
    from rank_bm25 import BM25Okapi
    _BM25_AVAILABLE = True
except ImportError:
    _BM25_AVAILABLE = False

from config import settings
from cache import cache, cached_async

logger = logging.getLogger(__name__)

# ── Splitter presets (dynamic chunk sizing) ────────────────────────────────────
_SPLITTER_SIMPLE = RecursiveCharacterTextSplitter(
    chunk_size=600,
    chunk_overlap=60,
    separators=["\n\n", "\n", "।", ". ", "; ", ", ", " "],
)
_SPLITTER_STANDARD = RecursiveCharacterTextSplitter(
    chunk_size=1200,
    chunk_overlap=200,
    separators=["\n\n", "\n", "।", ". ", "; ", ", ", " "],
)
_SPLITTER_COMPLEX = RecursiveCharacterTextSplitter(
    chunk_size=1800,
    chunk_overlap=300,
    separators=["\n\n", "\n", "।", ". ", "; ", ", ", " "],
)

SPLITTER_MAP = {
    "simple":   _SPLITTER_SIMPLE,
    "standard": _SPLITTER_STANDARD,
    "complex":  _SPLITTER_COMPLEX,
}

# Thread pool for parallel document loading
executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="doc_processor")

# In-memory BM25 index per case (rebuilt on ingest)
_bm25_index: Dict[str, Tuple[BM25Okapi, List[Document]]] = {}


# ── Embedding factory ──────────────────────────────────────────────────────────
def get_embeddings():
    """
    Returns SBERT/GTE-Large embeddings if available, falls back to OpenAI.
    Model: 'thenlper/gte-large' — strong multilingual legal domain performance,
    no API cost, runs locally on CPU (cuda optional).
    """
    if _EMBEDDINGS_BACKEND == "huggingface":
        model_name = getattr(settings, "embedding_model_local", "thenlper/gte-large")
        return HuggingFaceEmbeddings(
            model_name=model_name,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )
    # Fallback: OpenAI
    from langchain_openai import OpenAIEmbeddings
    return OpenAIEmbeddings(
        model=settings.embedding_model,
        openai_api_key=settings.openai_api_key,
    )


# ── File utilities ─────────────────────────────────────────────────────────────
def _file_hash(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()


def _load_file_sync(path: Path) -> List[Document]:
    suffix = path.suffix.lower()
    try:
        if suffix == ".pdf":
            return PyPDFLoader(str(path)).load()
        elif suffix in (".md", ".txt", ".lex"):
            return TextLoader(str(path), encoding="utf-8").load()
        elif suffix in (".doc", ".docx"):
            return UnstructuredWordDocumentLoader(str(path)).load()
        elif suffix in (".jpg", ".jpeg", ".png", ".tiff"):
            return UnstructuredImageLoader(str(path)).load()
        else:
            logger.warning(f"Unsupported file type: {suffix} — skipping {path.name}")
            return []
    except Exception as e:
        logger.error(f"Failed to load {path.name}: {e}")
        return []


async def _load_file_async(path: Path) -> List[Document]:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, _load_file_sync, path)


# ── ChromaDB store ─────────────────────────────────────────────────────────────
def get_or_create_vectorstore(case_id: str) -> Chroma:
    """Get or create a per-case ChromaDB collection with SBERT embeddings."""
    persist_dir = settings.chroma_path / case_id
    persist_dir.mkdir(parents=True, exist_ok=True)
    return Chroma(
        collection_name=f"case_{case_id}",
        embedding_function=get_embeddings(),
        persist_directory=str(persist_dir),
    )


# ── BM25 helpers ───────────────────────────────────────────────────────────────
def _tokenize(text: str) -> List[str]:
    """Simple whitespace + punctuation tokenizer."""
    import re
    return re.findall(r"\w+", text.lower())


def _build_bm25_index(case_id: str, docs: List[Document]) -> None:
    """Build (or rebuild) in-memory BM25 index for a case."""
    if not _BM25_AVAILABLE or not docs:
        return
    tokenized = [_tokenize(d.page_content) for d in docs]
    _bm25_index[case_id] = (BM25Okapi(tokenized), docs)
    logger.info(f"BM25 index built for {case_id}: {len(docs)} docs")


def _bm25_search(case_id: str, query: str, k: int = 8) -> List[Document]:
    """BM25 keyword retrieval over case documents."""
    if not _BM25_AVAILABLE or case_id not in _bm25_index:
        return []
    bm25, docs = _bm25_index[case_id]
    tokens = _tokenize(query)
    scores = bm25.get_scores(tokens)
    top_k = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:k]
    return [docs[i] for i in top_k]


def _reciprocal_rank_fusion(
    ranked_lists: List[List[Document]], k: int = 60
) -> List[Document]:
    """
    Reciprocal Rank Fusion (RRF) — merges multiple ranked lists.
    RRF score = Σ 1/(k + rank_i).  Higher is better.
    """
    scores: Dict[str, float] = {}
    doc_map: Dict[str, Document] = {}

    for ranked in ranked_lists:
        for rank, doc in enumerate(ranked, start=1):
            key = hashlib.md5(doc.page_content.encode()).hexdigest()
            scores[key] = scores.get(key, 0.0) + 1.0 / (k + rank)
            doc_map[key] = doc

    sorted_keys = sorted(scores, key=lambda x: scores[x], reverse=True)
    return [doc_map[key] for key in sorted_keys]


# ── Ingest ─────────────────────────────────────────────────────────────────────
async def ingest_files_parallel(
    case_id: str,
    file_paths: List[Path],
    complexity: str = "standard",
) -> Dict[str, Any]:
    """
    Ingest files in parallel with incremental indexing.
    complexity: 'simple' | 'standard' | 'complex' → controls chunk size.
    Only processes new/modified files based on MD5 hash comparison.
    """
    start_time = time.time()
    splitter = SPLITTER_MAP.get(complexity, _SPLITTER_STANDARD)
    vectorstore = get_or_create_vectorstore(case_id)

    summary: Dict[str, Any] = {
        "indexed": [],
        "skipped": [],
        "errors": [],
        "total_files": len(file_paths),
        "processing_time": 0,
        "chunk_strategy": complexity,
    }

    files_to_process: List[Tuple[Path, str]] = []
    for path in file_paths:
        if not path.exists():
            summary["errors"].append(f"{path.name}: file not found")
            continue
        current_hash = _file_hash(path)
        cached_hash = cache.get("file_hash", case_id, path.name)
        if cached_hash == current_hash:
            summary["skipped"].append(path.name)
        else:
            files_to_process.append((path, current_hash))

    if not files_to_process:
        summary["processing_time"] = time.time() - start_time
        return summary

    logger.info(
        f"Processing {len(files_to_process)} files for case {case_id} "
        f"(chunk_strategy={complexity})"
    )

    # Load in parallel
    load_tasks = [_load_file_async(path) for path, _ in files_to_process]
    docs_results = await asyncio.gather(*load_tasks, return_exceptions=True)

    all_chunks: List[Document] = []
    all_docs_for_bm25: List[Document] = []

    for (path, file_hash), docs in zip(files_to_process, docs_results):
        if isinstance(docs, Exception):
            summary["errors"].append(f"{path.name}: {docs}")
            continue
        if not docs:
            summary["skipped"].append(path.name)
            continue

        for doc in docs:
            doc.metadata.update({
                "case_id": case_id,
                "source_file": path.name,
                "file_hash": file_hash,
                "file_size": path.stat().st_size,
                "modified_time": path.stat().st_mtime,
                "ingestion_time": time.time(),
                "chunk_strategy": complexity,
            })

        chunks = splitter.split_documents(docs)
        all_chunks.extend(chunks)
        all_docs_for_bm25.extend(chunks)

        cache.set("file_hash", file_hash, ttl=86400, case_id=case_id, file_name=path.name)
        summary["indexed"].append({
            "file": path.name,
            "chunks": len(chunks),
            "size_mb": round(path.stat().st_size / (1024 * 1024), 2),
        })
        logger.info(f"Indexed {path.name} → {len(chunks)} chunks ({complexity})")

    if all_chunks:
        logger.info(f"Adding {len(all_chunks)} chunks to vector store (SBERT)")
        vectorstore.add_documents(all_chunks)
        try:
            vectorstore.persist()
        except Exception as e:
            logger.warning(f"Persist failed (non-fatal): {e}")

    # Rebuild BM25 index
    if all_docs_for_bm25:
        _build_bm25_index(case_id, all_docs_for_bm25)

    summary["processing_time"] = time.time() - start_time
    summary["total_chunks"] = len(all_chunks)
    return summary


# ── Retrieval ──────────────────────────────────────────────────────────────────
@cached_async("retriever", ttl=settings.cache_ttl_search)
async def get_retriever(case_id: str, k: int = 8, search_type: str = "similarity"):
    """Return cached dense retriever for the given case."""
    vs = get_or_create_vectorstore(case_id)
    return vs.as_retriever(search_kwargs={"k": k})


async def hybrid_search(
    case_id: str,
    query: str,
    k: int = 8,
    metadata_filters: Optional[Dict[str, Any]] = None,
) -> List[Document]:
    """
    Hybrid retrieval: Dense (SBERT ChromaDB) + Sparse (BM25) combined via RRF.
    Falls back gracefully if BM25 index is not yet built.
    """
    cache_key = f"hybrid:{case_id}:{hashlib.md5(query.encode()).hexdigest()}"
    cached = cache.get("search", cache_key)
    if cached:
        return cached

    vs = get_or_create_vectorstore(case_id)
    search_kwargs: Dict[str, Any] = {"k": k}
    if metadata_filters:
        search_kwargs["filter"] = metadata_filters

    # Dense semantic search
    dense_docs = vs.similarity_search(query, **search_kwargs)

    # MMR diversity pass
    try:
        mmr_docs = vs.max_marginal_relevance_search(query, k=k, fetch_k=k * 3)
    except Exception:
        mmr_docs = dense_docs

    # Sparse BM25 search
    bm25_docs = _bm25_search(case_id, query, k=k)

    # Fuse with RRF
    fused = _reciprocal_rank_fusion([dense_docs, mmr_docs, bm25_docs])[:k]

    cache.set("search", fused, ttl=settings.cache_ttl_search, key=cache_key)
    return fused


# ── Stats & helpers ────────────────────────────────────────────────────────────
def case_has_documents(case_id: str) -> bool:
    try:
        vs = get_or_create_vectorstore(case_id)
        return vs._collection.count() > 0
    except Exception:
        return False


async def get_case_doc_count(case_id: str) -> int:
    try:
        vs = get_or_create_vectorstore(case_id)
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, vs._collection.count)
    except Exception:
        return 0


async def get_case_stats(case_id: str) -> Dict[str, Any]:
    try:
        vs = get_or_create_vectorstore(case_id)
        count = await asyncio.get_event_loop().run_in_executor(executor, vs._collection.count)
        cache_stats = cache.get_stats()
        bm25_count = len(_bm25_index.get(case_id, (None, []))[1]) if case_id in _bm25_index else 0
        return {
            "case_id": case_id,
            "document_count": count,
            "bm25_indexed_chunks": bm25_count,
            "embedding_backend": _EMBEDDINGS_BACKEND,
            "cache_stats": cache_stats,
            "last_updated": time.time(),
        }
    except Exception as e:
        logger.error(f"Failed to get stats for case {case_id}: {e}")
        return {"case_id": case_id, "document_count": 0, "error": str(e)}


def cleanup_executor():
    executor.shutdown(wait=True)
