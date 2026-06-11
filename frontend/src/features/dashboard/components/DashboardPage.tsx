import React, { useEffect, useState } from "react";
import { dashboardApi } from "../api";
import type { DashboardStats } from "../types";
import { StatCard } from "./StatCard";
import { FinancialChart } from "./FinancialChart";
import {
  BanknotesIcon,
  HomeModernIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard statistics.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div
        className="space-y-6"
        aria-busy="true"
        aria-label="Loading dashboard"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
        <div className="h-[400px] w-full animate-pulse rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600">
        <p>{error || "An unexpected error occurred."}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded bg-red-100 px-4 py-2 font-medium hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Saldo Kas"
          value={`Rp ${stats.total_balance.toLocaleString("id-ID")}`}
          icon={<BanknotesIcon className="h-6 w-6 text-blue-500" />}
          description="Saldo berjalan saat ini"
        />
        <StatCard
          title="Pemasukan Bulan Ini"
          value={`Rp ${stats.current_month.income.toLocaleString("id-ID")}`}
          icon={<ArrowTrendingUpIcon className="h-6 w-6 text-green-500" />}
          description="Total iuran & kas masuk"
        />
        <StatCard
          title="Pengeluaran Bulan Ini"
          value={`Rp ${stats.current_month.expense.toLocaleString("id-ID")}`}
          icon={<ArrowTrendingDownIcon className="h-6 w-6 text-red-500" />}
          description="Total kas keluar"
        />
        <StatCard
          title="Tingkat Hunian"
          value={`${stats.house_occupancy.occupied} / ${stats.house_occupancy.total}`}
          icon={<HomeModernIcon className="h-6 w-6 text-purple-500" />}
          description={`${stats.house_occupancy.empty} rumah kosong`}
        />
      </div>

      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Arus Kas 12 Bulan Terakhir
          </h3>
          <p className="text-sm text-gray-500">
            Perbandingan pemasukan dan pengeluaran setiap bulannya
          </p>
        </div>
        <FinancialChart data={stats.chart_data} />
      </div>
    </div>
  );
};
