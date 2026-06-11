import { useState, useEffect } from "react";
import { PaymentMatrixTable } from "@/features/payments/components/PaymentMatrixTable";

export function PaymentsPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Pembayaran Iuran
          </h1>
          <p className="text-sm text-slate-500">
            Kelola dan catat pembayaran iuran bulanan warga.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Cari rumah atau warga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setYear((y) => y - 1)}
              className="rounded-lg bg-white p-2 text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-lg font-bold text-slate-700 w-16 text-center">
              {year}
            </span>
            <button
              onClick={() => setYear((y) => y + 1)}
              className="rounded-lg bg-white p-2 text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <PaymentMatrixTable year={year} searchQuery={searchQuery} />
    </div>
  );
}
