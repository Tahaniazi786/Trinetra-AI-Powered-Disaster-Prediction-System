import sys
import os
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
    Resolves both query parameter forwarded paths (__path) and header-based paths.
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
            
            # 1. Check if Vercel rewrite passed __path query parameter
            if "__path" in params:
                resolved_path = params.pop("__path")[0]
                # Reconstruct clean query string without __path
                clean_query = urlencode([(k, v) for k, vs in params.items() for v in vs])
                scope["query_string"] = clean_query.encode("latin1")
            else:
                # 2. Fallback to rewrite headers or scope path
                orig = (
                    self._get_header(scope, "x-matched-path")
                    or self._get_header(scope, "x-forwarded-uri")
                    or scope.get("path", "")
                )
                resolved_path = orig.split("?")[0]

            # Strip leading /api if present
            if resolved_path.startswith("/api/"):
                resolved_path = resolved_path[4:]
            elif resolved_path == "/api":
                resolved_path = "/"

            # Normalize root and script-like paths
            if resolved_path in ("/index.py", "index.py", "", "/api/index.py"):
                resolved_path = "/"

            if not resolved_path.startswith("/"):
                resolved_path = "/" + resolved_path

            scope["path"] = resolved_path

        await self.app(scope, receive, send)

# Export ASGI application for Vercel Serverless Function
app = VercelPathNormalizationMiddleware(fastapi_app)
