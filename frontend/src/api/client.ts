import ky from "ky";
import { useLoadingStore } from "@/stores/useLoadingStore";
import { useToastStore } from "@/stores/useToastStore";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

const handleBeforeRequest = ({ request }: { request: Request }) => {
  useLoadingStore.getState().startRequest();
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    const token = getCookie("XSRF-TOKEN");
    if (token) {
      request.headers.set("X-XSRF-TOKEN", decodeURIComponent(token));
    }
  }
};

const handleAfterResponse = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  useLoadingStore.getState().finishRequest();
  
  // Do not show toast for 401 Unauthorized on /api/user endpoint
  if (!response.ok && response.status === 401 && request.url.includes("/api/user")) {
    return response;
  }

  if (!response.ok) {
    if (response.status !== 422) {
      // Don't toast 422, let forms handle it
      try {
        const data = await response.clone().json();
        const message =
          data.message || `An error occurred (${response.status})`;
        useToastStore.getState().addToast(message, "error");
      } catch {
        useToastStore
          .getState()
          .addToast(`An error occurred (${response.status})`, "error");
      }
    }
  }
  return response;
};

const handleBeforeError = ({ error }: { error: unknown }) => {
  useLoadingStore.getState().finishRequest();
  return error as Error;
};

// Client for general API calls
export const apiClient = ky.create({
  prefix: `${BACKEND_URL}/api`,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  credentials: "include",
  hooks: {
    beforeRequest: [handleBeforeRequest],
    afterResponse: [handleAfterResponse],
    beforeError: [handleBeforeError],
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
  hooks: {
    beforeRequest: [handleBeforeRequest],
    afterResponse: [handleAfterResponse],
    beforeError: [handleBeforeError],
  },
});

// Client for public endpoints
export const publicClient = ky.create({
  prefix: `${BACKEND_URL}/api-public`,
  headers: {
    Accept: "application/json",
  },
  // Public APIs do not require credentials
  hooks: {
    beforeRequest: [handleBeforeRequest],
    afterResponse: [handleAfterResponse],
    beforeError: [handleBeforeError],
  },
});
