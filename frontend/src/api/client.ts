import ky from "ky";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

// Client for general API calls
export const apiClient = ky.create({
  prefix: `${BACKEND_URL}/api`,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  credentials: "include",
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const method = request.method.toUpperCase();
        if (method !== "GET" && method !== "HEAD") {
          const token = getCookie("XSRF-TOKEN");
          if (token) {
            request.headers.set("X-XSRF-TOKEN", decodeURIComponent(token));
          }
        }
      },
    ],
  },
});

// Client for Sanctum endpoints (not under /api)
export const sanctumClient = ky.create({
  prefix: BACKEND_URL,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  credentials: "include",
});

// Client for public endpoints
export const publicClient = ky.create({
  prefix: `${BACKEND_URL}/api-public`,
  headers: {
    Accept: "application/json",
  },
  // Public APIs do not require credentials
});
