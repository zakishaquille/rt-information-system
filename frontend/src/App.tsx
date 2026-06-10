import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Login } from "@/features/auth/Login";
import { apiClient } from "@/api/client";
import { ToastContainer } from "@/components/ui/ToastContainer";

import { HousesPage, ResidentsPage, ConfigurationsPage, PaymentsPage } from "@/pages";

const Dashboard: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const location = useLocation();

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
        <div className="flex justify-between items-center mb-6 border-b pb-4">
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

        <div className="mb-6 flex space-x-4 border-b">
          <Link
            to="/houses"
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname.startsWith('/houses') ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Houses
          </Link>
          <Link
            to="/residents"
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname.startsWith('/residents') ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Residents
          </Link>
          <Link
            to="/payments"
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname.startsWith('/payments') ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Iuran
          </Link>
          <Link
            to="/configurations"
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname.startsWith('/configurations') ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pengaturan
          </Link>
        </div>

        <Outlet />
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
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          >
            <Route index element={<Navigate to="/houses" replace />} />
            <Route path="houses" element={<HousesPage />} />
            <Route path="residents" element={<ResidentsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="configurations" element={<ConfigurationsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
