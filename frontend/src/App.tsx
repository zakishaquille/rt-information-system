import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Login } from "@/features/auth/Login";
import { apiClient } from "@/api/client";

import { HousesList } from "@/features/houses";

const Dashboard: React.FC = () => {
  const { user, setUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await apiClient.post("logout");
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl rounded-lg bg-white p-6 shadow">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold">RTIS Dashboard</h1>
          <div className="flex items-center gap-4">
            <p>Welcome, {user?.name}</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <HousesList />
      </div>
    </div>
  );
};

function App() {
  const { isAuthenticated, isInitialized, fetchUser } = useAuthStore();

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading session...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
