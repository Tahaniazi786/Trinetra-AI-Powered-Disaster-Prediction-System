import sys
import os

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
    Vercel sets 'x-matched-path' or 'x-forwarded-uri' when rewriting URLs.
    This middleware ensures that both direct routes (e.g. /weather/live)
    and prefixed routes (e.g. /api/weather/live) map to the registered FastAPI endpoints.
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
            # Extract original path from Vercel rewrite headers or fallback to scope path
            orig = (
                self._get_header(scope, "x-matched-path")
                or self._get_header(scope, "x-forwarded-uri")
                or scope.get("path", "")
            )
            # Remove query string if present
            clean = orig.split("?")[0]

            # Strip /api/ prefix if present
            if clean.startswith("/api/"):
                clean = clean[4:]

            # Normalize root and script-like paths
            if clean in ("/index.py", "index.py", "/api", "api", "", "/api/index.py"):
                clean = "/"

            scope["path"] = clean

        await self.app(scope, receive, send)

# Export ASGI application for Vercel Serverless Function
app = VercelPathNormalizationMiddleware(fastapi_app)
