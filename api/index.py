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

class StripApiPrefixMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope.get("type") == "http":
            path = scope.get("path", "")
            if path.startswith("/api/"):
                scope["path"] = path[4:]
            elif path == "/api":
                scope["path"] = "/"
        await self.app(scope, receive, send)

# Export ASGI application for Vercel Serverless Function
app = StripApiPrefixMiddleware(fastapi_app)
