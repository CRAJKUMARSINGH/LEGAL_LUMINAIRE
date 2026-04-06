"""
Redis Caching Layer for Legal Luminaire
Caches ChromaDB queries, embeddings, and frequently accessed case law scores.
"""
from __future__ import annotations

import json
import logging
import pickle
from typing import Any, Optional, Union
from functools import wraps
import hashlib

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    redis = None

from config import settings

logger = logging.getLogger(__name__)

class CacheManager:
    """Centralized cache manager with Redis fallback to in-memory."""
    
    def __init__(self):
        self._redis_client: Optional[redis.Redis] = None
        self._memory_cache: dict[str, Any] = {}
        self._use_redis = False
        
        if REDIS_AVAILABLE and hasattr(settings, 'redis_url'):
            try:
                self._redis_client = redis.from_url(
                    settings.redis_url,
                    decode_responses=False,
                    socket_connect_timeout=5,
                    socket_timeout=5,
                    retry_on_timeout=True
                )
                # Test connection
                self._redis_client.ping()
                self._use_redis = True
                logger.info("Redis cache initialized successfully")
            except Exception as e:
                logger.warning(f"Redis connection failed, using memory cache: {e}")
        else:
            logger.info("Redis not available, using in-memory cache")
    
    def _serialize(self, data: Any) -> bytes:
        """Serialize data for caching."""
        return pickle.dumps(data)
    
    def _deserialize(self, data: bytes) -> Any:
        """Deserialize cached data."""
        return pickle.loads(data)
    
    def _make_key(self, prefix: str, *args, **kwargs) -> str:
        """Generate a consistent cache key, or use explicit 'cache_key' if provided."""
        if "cache_key" in kwargs:
            return f"{prefix}:{kwargs['cache_key']}"
        key_data = f"{prefix}:{args}:{sorted(kwargs.items())}"
        return hashlib.md5(key_data.encode()).hexdigest()
    
    def get(self, prefix: str, *args, **kwargs) -> Optional[Any]:
        """Get cached value."""
        key = self._make_key(prefix, *args, **kwargs)
        
        if self._use_redis and self._redis_client:
            try:
                data = self._redis_client.get(key)
                if data:
                    return self._deserialize(data)
            except Exception as e:
                logger.warning(f"Redis get failed for key {key}: {e}")
        
        return self._memory_cache.get(key)
    
    def set(self, prefix: str, value: Any, ttl: int = 3600, *args, **kwargs) -> None:
        """Set cached value with TTL."""
        key = self._make_key(prefix, *args, **kwargs)
        serialized = self._serialize(value)
        
        if self._use_redis and self._redis_client:
            try:
                self._redis_client.setex(key, ttl, serialized)
            except Exception as e:
                logger.warning(f"Redis set failed for key {key}: {e}")
                # Fallback to memory cache
                self._memory_cache[key] = value
        
        # Always set in memory cache as fallback
        self._memory_cache[key] = value
    
    def delete(self, prefix: str, *args, **kwargs) -> None:
        """Delete cached value."""
        key = self._make_key(prefix, *args, **kwargs)
        
        if self._use_redis and self._redis_client:
            try:
                self._redis_client.delete(key)
            except Exception as e:
                logger.warning(f"Redis delete failed for key {key}: {e}")
        
        self._memory_cache.pop(key, None)
    
    def clear(self) -> None:
        """Clear all cached values."""
        if self._use_redis and self._redis_client:
            try:
                self._redis_client.flushdb()
            except Exception as e:
                logger.warning(f"Redis flush failed: {e}")
        
        self._memory_cache.clear()
    
    def get_stats(self) -> dict[str, Any]:
        """Get cache statistics."""
        stats = {
            "type": "redis" if self._use_redis else "memory",
            "memory_keys": len(self._memory_cache)
        }
        
        if self._use_redis and self._redis_client:
            try:
                info = self._redis_client.info()
                stats.update({
                    "redis_connected": True,
                    "redis_memory": info.get("used_memory_human", "unknown"),
                    "redis_keys": info.get("db0", {}).get("keys", 0)
                })
            except Exception as e:
                stats["redis_connected"] = False
                stats["redis_error"] = str(e)
        
        return stats

# Global cache instance
cache = CacheManager()

def cached(prefix: str, ttl: int = 3600):
    """Decorator for caching function results."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Try to get from cache
            cached_result = cache.get(prefix, *args, **kwargs)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            cache.set(prefix, result, ttl, *args, **kwargs)
            return result
        
        return wrapper
    return decorator

def cached_async(prefix: str, ttl: int = 3600):
    """Decorator for caching async function results."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cached_result = cache.get(prefix, *args, **kwargs)
            if cached_result is not None:
                return cached_result
            result = await func(*args, **kwargs)
            cache.set(prefix, result, ttl, *args, **kwargs)
            return result
        return wrapper
    return decorator
