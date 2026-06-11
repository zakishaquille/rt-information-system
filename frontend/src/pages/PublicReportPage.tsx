import React, { useEffect, useState } from "react";
import { FinancialChart } from "@/features/dashboard/components/FinancialChart";
import {
  getPublicReport,
  getPublicMonthBreakdown,
} from "@/features/public/api";
import type {
  PublicReportSummary,
  PublicMonthBreakdown,
} from "@/features/public/types";

export const PublicReportPage: React.FC = () => {
  const [summary, setSummary] = useState<PublicReportSummary | null>(null);
  const [breakdown, setBreakdown] = useState<PublicMonthBreakdown | null>(null);

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBreakdown, setIsLoadingBreakdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const data = await getPublicReport();
        setSummary(data);
      } catch (err) {
        setError("Gagal memuat laporan keuangan.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchBreakdown = async () => {
      try {
        setIsLoadingBreakdown(true);
        const data = await getPublicMonthBreakdown(selectedMonth);
        setBreakdown(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingBreakdown(false);
      }
    };
    fetchBreakdown();
  }, [selectedMonth]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse">Memuat laporan...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-lg bg-white p-6 pb-12 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Laporan Keuangan RT
          </h1>
          <p className="text-gray-500 mb-6">
            Laporan transparansi pemasukan dan pengeluaran kas RT.
          </p>

          <div className="mb-8 rounded-lg bg-blue-50 p-6 border border-blue-100">
            <h2 className="text-sm font-medium text-blue-800 uppercase tracking-wide">
              Total Saldo Saat Ini
            </h2>
            <p className="mt-2 text-4xl font-bold text-blue-900">
              Rp {summary.total_balance.toLocaleString("id-ID")}
            </p>
          </div>

          <div className="mt-8">
            <FinancialChart data={summary.chart_data} />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900">Rincian Bulanan</h2>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {isLoadingBreakdown ? (
            <div className="py-12 text-center animate-pulse text-gray-500">
              Memuat rincian...
            </div>
          ) : breakdown ? (
            <div className="grid gap-8 md:grid-cols-2">
              {/* Pemasukan */}
              <div>
                <h3 className="font-semibold text-lg text-green-700 mb-4 flex items-center justify-between">
                  <span>Pemasukan</span>
                  <span>
                    Rp {breakdown.income.total.toLocaleString("id-ID")}
                  </span>
                </h3>

                <div className="space-y-6">
                  {breakdown.income.dues.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">
                        Iuran Warga
                      </h4>
                      <ul className="space-y-2">
                        {breakdown.income.dues.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between text-gray-700 text-sm"
                          >
                            <span>{item.name}</span>
                            <span className="font-medium">
                              Rp {item.total.toLocaleString("id-ID")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {breakdown.income.other.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">
                        Pemasukan Lain
                      </h4>
                      <ul className="space-y-2">
                        {breakdown.income.other.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between text-gray-700 text-sm"
                          >
                            <span>{item.name}</span>
                            <span className="font-medium">
                              Rp {item.total.toLocaleString("id-ID")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {breakdown.income.dues.length === 0 &&
                    breakdown.income.other.length === 0 && (
                      <p className="text-sm text-gray-500 italic">
                        Tidak ada pemasukan di bulan ini.
                      </p>
                    )}
                </div>
              </div>

              {/* Pengeluaran */}
              <div>
                <h3 className="font-semibold text-lg text-red-700 mb-4 flex items-center justify-between">
                  <span>Pengeluaran</span>
                  <span>
                    Rp {breakdown.expense.total.toLocaleString("id-ID")}
                  </span>
                </h3>

                <div className="space-y-6">
                  {breakdown.expense.categories.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">
                        Berdasarkan Kategori
                      </h4>
                      <ul className="space-y-2">
                        {breakdown.expense.categories.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between text-gray-700 text-sm"
                          >
                            <span>{item.name}</span>
                            <span className="font-medium">
                              Rp {item.total.toLocaleString("id-ID")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Tidak ada pengeluaran di bulan ini.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
