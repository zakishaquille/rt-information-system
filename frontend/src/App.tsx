import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Login } from "@/features/auth/Login";
import { ToastContainer } from "@/components/ToastContainer";
import { TopLoadingBar } from "@/components/TopLoadingBar";

import { HousesPage } from "@/features/houses";
import { ResidentsPage } from "@/features/residents";
import { ConfigurationsPage } from "@/features/configurations";
import { PaymentsPage } from "@/features/payments";
import { TransactionsPage } from "@/features/transactions";
import { DashboardPage } from "@/features/dashboard";
import { PublicBillingPage } from "@/pages/PublicBillingPage";
import { PublicReportPage } from "@/pages/PublicReportPage";

import { DashboardLayout, PageWrapper } from "@/features/layout";

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
      <TopLoadingBar />
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
            element={
              isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
            }
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
