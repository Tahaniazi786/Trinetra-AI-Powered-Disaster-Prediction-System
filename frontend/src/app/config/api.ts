// When running locally, default to http://127.0.0.1:8000.
// When deployed on Vercel, automatically use the same origin ("") so Vercel Serverless Functions (/api/index.py) handle all requests directly with zero config.
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const API_BASE_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : isLocal
    ? "http://127.0.0.1:8000"
    : "";
