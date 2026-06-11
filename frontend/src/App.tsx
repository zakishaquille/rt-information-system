import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  Outlet,
} from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Login } from "@/features/auth/Login";
import { apiClient } from "@/api/client";
import { ToastContainer } from "@/components/ui/ToastContainer";

import { HousesPage } from "@/features/houses";
import { ResidentsPage } from "@/features/residents";
import { ConfigurationsPage } from "@/features/configurations";
import { PaymentsPage } from "@/features/payments";
import { TransactionsPage } from "@/features/transactions";
import { DashboardPage } from "@/features/dashboard";
import { PublicBillingPage } from "@/pages/PublicBillingPage";
import { PublicReportPage } from "@/pages/PublicReportPage";

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
            to="/"
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === "/"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/payments"
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname.startsWith("/payments")
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Tagihan
          </Link>
          <Link
            to="/transactions"
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname.startsWith("/transactions")
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Kas
          </Link>
          <Link
            to="/houses"
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname.startsWith("/houses")
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Houses
          </Link>
          <Link
            to="/residents"
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname.startsWith("/residents")
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Residents
          </Link>
          <Link
            to="/configurations"
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname.startsWith("/configurations")
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Pengaturan
          </Link>
          <a
            href="/laporan"
            target="_blank"
            rel="noopener noreferrer"
            className="pb-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center gap-1"
          >
            Laporan Publik
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

const PageWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <title>{title}</title>
      {children}
    </>
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
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <PageWrapper title="Login - RTIS">
                  <Login />
                </PageWrapper>
              )
            }
          />
          <Route
            path="/tagihan/:uuid"
            element={
              <PageWrapper title="Info Tagihan - RTIS">
                <PublicBillingPage />
              </PageWrapper>
            }
          />
          <Route
            path="/laporan"
            element={
              <PageWrapper title="Laporan Keuangan - RTIS">
                <PublicReportPage />
              </PageWrapper>
            }
          />
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          >
            <Route
              index
              element={
                <PageWrapper title="Dashboard - RTIS">
                  <DashboardPage />
                </PageWrapper>
              }
            />
            <Route
              path="houses"
              element={
                <PageWrapper title="Daftar Rumah - RTIS">
                  <HousesPage />
                </PageWrapper>
              }
            />
            <Route
              path="residents"
              element={
                <PageWrapper title="Daftar Warga - RTIS">
                  <ResidentsPage />
                </PageWrapper>
              }
            />
            <Route
              path="payments"
              element={
                <PageWrapper title="Iuran - RTIS">
                  <PaymentsPage />
                </PageWrapper>
              }
            />
            <Route
              path="transactions"
              element={
                <PageWrapper title="Kas & Transaksi - RTIS">
                  <TransactionsPage />
                </PageWrapper>
              }
            />
            <Route
              path="configurations"
              element={
                <PageWrapper title="Pengaturan - RTIS">
                  <ConfigurationsPage />
                </PageWrapper>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
