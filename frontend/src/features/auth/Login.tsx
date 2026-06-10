import React, { useState } from "react";
import { apiClient, sanctumClient } from "@/api/client";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "@/stores/useToastStore";
import { handleApiError } from "@/utils/apiErrorHelper";

interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const Login: React.FC = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // CSRF initialization for Sanctum
      await sanctumClient.get("sanctum/csrf-cookie");

      const data = await apiClient
        .post("login", {
          json: { password },
        })
        .json<LoginResponse>();

      toast.success("Login berhasil");
      setUser(data.user);
    } catch (err: unknown) {
      toast.error(await handleApiError(err, "Failed to login"));
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
