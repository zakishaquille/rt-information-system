import React, { useState } from "react";
import { apiClient, sanctumClient } from "@/api/client";
import { useAuthStore } from "@/stores/authStore";

interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const Login: React.FC = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // CSRF initialization for Sanctum
      await sanctumClient.get("sanctum/csrf-cookie");

      const data = await apiClient
        .post("login", {
          json: { password },
        })
        .json<LoginResponse>();

      setUser(data.user);
    } catch (err: unknown) {
      let errorMessage = "Failed to login";
      if (err instanceof Error) {
        if (err.name === "HTTPError" && "response" in err) {
          const httpError = err as import("ky").HTTPError;
          const errorData = (await httpError.response
            .json()
            .catch(() => ({}))) as { message?: string };
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          RT Admin Login
        </h2>
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
