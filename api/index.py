import sys
import os
import re
from urllib.parse import parse_qs, urlencode

# Set VERCEL environment flag if not present
os.environ["VERCEL"] = "1"

# Add backend and root directories to path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CURRENT_DIR)
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from main import app as fastapi_app

class VercelPathNormalizationMiddleware:
    """
    Normalizes ASGI request paths on Vercel Serverless Functions.
    Handles catch-all parameters (slug), forwarded query paths (__path),
    and Vercel routing headers.
    """
    def __init__(self, app):
        self.app = app

    def _get_header(self, scope, name: str) -> str:
        target = name.lower().encode("latin1")
        for k, v in scope.get("headers", []):
            if k.lower() == target:
                return v.decode("latin1")
        return ""

    async def __call__(self, scope, receive, send):
        if scope.get("type") == "http":
            raw_query = scope.get("query_string", b"").decode("latin1")
            params = parse_qs(raw_query, keep_blank_values=True)
            
            resolved_path = None

            # 1. Handle Vercel catch-all slug parameter: /api/[...slug].py
            if "slug" in params:
                slug_parts = params.pop("slug")
                resolved_path = "/" + "/".join(slug_parts)
                clean_query = urlencode([(k, v) for k, vs in params.items() for v in vs])
                scope["query_string"] = clean_query.encode("latin1")
            
            # 2. Handle __path query parameter if present
            elif "__path" in params:
                resolved_path = params.pop("__path")[0]
                clean_query = urlencode([(k, v) for k, vs in params.items() for v in vs])
                scope["query_string"] = clean_query.encode("latin1")

            # 3. Fallback to rewrite headers or scope path
            if not resolved_path:
                orig = (
                    self._get_header(scope, "x-matched-path")
                    or self._get_header(scope, "x-forwarded-uri")
                    or scope.get("path", "")
                )
                resolved_path = orig.split("?")[0]

            # Strip leading /api prefix
            if resolved_path.startswith("/api/"):
                resolved_path = resolved_path[4:]
            elif resolved_path == "/api":
                resolved_path = "/"

            # Normalize script-like and empty paths
            if resolved_path in ("/index.py", "index.py", "", "/api/index.py", "/[...slug].py", "[...slug].py"):
                resolved_path = "/"

            # Deduplicate multiple slashes
            resolved_path = re.sub(r"/+", "/", resolved_path)

            if not resolved_path.startswith("/"):
                resolved_path = "/" + resolved_path

            scope["path"] = resolved_path

        await self.app(scope, receive, send)

# Export ASGI application for Vercel Serverless Function
app = VercelPathNormalizationMiddleware(fastapi_app)
