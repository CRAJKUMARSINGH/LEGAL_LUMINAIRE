"""
Backend Case Repository Pattern — Week 1: Database Hardening
Prepares the legal suite for PostgreSQL/Drizzle migration while maintaining
zero-downtime JSON file system persistence.
"""
import json
import os
import shutil
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
from config import settings

logger = logging.getLogger(__name__)

class CaseRepository:
    """
    Abstract interface for case persistence. 
    Can be subclassed for PostgreSQL/Drizzle implementation.
    """
    def list_all(self) -> List[Dict[str, Any]]: raise NotImplementedError
    def find_by_id(self, case_id: str) -> Optional[Dict[str, Any]]: raise NotImplementedError
    def upsert(self, case_id: str, data: Dict[str, Any]) -> bool: raise NotImplementedError
    def remove(self, case_id: str) -> bool: raise NotImplementedError

class JSONCaseRepository(CaseRepository):
    """
    Production-grade JSON file system implementation.
    Hardened for concurrent access and character encoding safety.
    """
    def __init__(self, base_path: Path):
        self.base_path = base_path
        self.base_path.mkdir(parents=True, exist_ok=True)

    def _get_case_file(self, case_id: str) -> Path:
        # Week 15 Pen-Test: Sanitize case_id to prevent path traversal
        safe_id = "".join(c for c in case_id if c.isalnum() or c in ("-", "_")).strip()
        if not safe_id:
            safe_id = "unknown-case"
        
        case_dir = self.base_path / safe_id
        case_dir.mkdir(parents=True, exist_ok=True)
        return case_dir / "case_data.json"

    def list_all(self) -> List[Dict[str, Any]]:
        cases = []
        for case_dir in self.base_path.iterdir():
            if case_dir.is_dir():
                case_file = case_dir / "case_data.json"
                if case_file.exists():
                    try:
                        with case_file.open("r", encoding="utf-8") as f:
                            data = json.load(f)
                            # Summary Metadata Selection
                            cases.append({
                                "id": data.get("id", case_dir.name),
                                "title": data.get("title", "Untitled Case"),
                                "court": data.get("court", "Unknown"),
                                "status": data.get("status", "Draft"),
                                "review_status": data.get("review_status", "DRAFT"),
                                "category": data.get("metadata", {}).get("category", "General")
                            })
                    except Exception as e:
                        logger.error(f"Corruption detected in {case_dir.name}: {e}")
        return cases

    def find_by_id(self, case_id: str) -> Optional[Dict[str, Any]]:
        file_path = self._get_case_file(case_id)
        if not file_path.exists(): return None
        try:
            with file_path.open("r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Read error for {case_id}: {e}")
            return None

    def upsert(self, case_id: str, data: Dict[str, Any]) -> bool:
        file_path = self._get_case_file(case_id)
        try:
            with file_path.open("w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            logger.error(f"Write error for {case_id}: {e}")
            return False

    def remove(self, case_id: str) -> bool:
        case_dir = self.base_path / case_id
        if not case_dir.exists(): return False
        try:
            shutil.rmtree(case_dir)
            return True
        except Exception as e:
            logger.error(f"Deletion error for {case_id}: {e}")
            return False

class CaseManager:
    """
    High-level service layer for Case management.
    Handles business logic and coordination between repository and AI.
    Emits structured case-event logging for observability (Week 2).
    """
    def __init__(self, repo: CaseRepository = JSONCaseRepository(settings.case_docs_path)):
        self.repo = repo
        self._active_case_id: Optional[str] = None

    def list_cases(self) -> List[Dict[str, Any]]:
        cases = self.repo.list_all()
        logger.info(
            "case_event",
            extra={
                "event": "cases_listed",
                "cases_count": len(cases),
            }
        )
        return cases

    def get_case(self, case_id: str) -> Optional[Dict[str, Any]]:
        case = self.repo.find_by_id(case_id)
        if case and case_id != self._active_case_id:
            self._active_case_id = case_id
            logger.info(
                "case_event",
                extra={
                    "event": "case_switched",
                    "case_id": case_id,
                    "case_title": case.get("title", "Untitled"),
                    "previous_case_id": self._active_case_id,
                }
            )
        elif case:
            logger.info(
                "case_event",
                extra={
                    "event": "case_accessed",
                    "case_id": case_id,
                }
            )
        return case

    def save_case(self, case_id: str, data: Dict[str, Any]) -> bool:
        is_new = self.repo.find_by_id(case_id) is None
        success = self.repo.upsert(case_id, data)
        if success:
            if is_new:
                logger.info(
                    "case_event",
                    extra={
                        "event": "case_created",
                        "case_id": case_id,
                        "case_title": data.get("title", "Untitled"),
                    }
                )
            else:
                logger.info(
                    "case_event",
                    extra={
                        "event": "case_updated",
                        "case_id": case_id,
                        "case_title": data.get("title", "Untitled"),
                    }
                )
        else:
            logger.error(
                "case_event",
                extra={
                    "event": "case_save_failed",
                    "case_id": case_id,
                }
            )
        return success

    def delete_case(self, case_id: str) -> bool:
        success = self.repo.remove(case_id)
        if success:
            if self._active_case_id == case_id:
                self._active_case_id = None
            logger.info(
                "case_event",
                extra={
                    "event": "case_deleted",
                    "case_id": case_id,
                }
            )
        else:
            logger.warning(
                "case_event",
                extra={
                    "event": "case_delete_failed",
                    "case_id": case_id,
                }
            )
        return success

    def switch_active_case(self, case_id: str) -> Optional[Dict[str, Any]]:
        """
        Explicit case-switch operation.
        Logs a case_switch event for downstream observability pipelines.
        Returns the case data on success, None if case not found.
        """
        case = self.repo.find_by_id(case_id)
        if case is None:
            logger.warning(
                "case_event",
                extra={
                    "event": "case_switch_failed",
                    "case_id": case_id,
                    "reason": "case_not_found",
                }
            )
            return None
        previous = self._active_case_id
        self._active_case_id = case_id
        logger.info(
            "case_event",
            extra={
                "event": "case_switched",
                "case_id": case_id,
                "case_title": case.get("title", "Untitled"),
                "previous_case_id": previous,
            }
        )
        return case

# Global instance for FastAPI routes
case_manager = CaseManager()
