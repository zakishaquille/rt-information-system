import React, { useState, useEffect } from "react";

import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { TransactionsList } from "@/features/transactions/components/TransactionsList";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";
import { useConfigurations } from "@/features/configurations/hooks/useConfigurations";
import type { Transaction, TransactionPayload } from "@/features/transactions";
import { getTransactionSummary, type TransactionSummary } from "@/features/transactions/api";
import { formatRp } from "@/utils/formatRp";

export const TransactionsPage: React.FC = () => {
  const {
    transactions,
    isLoading,
    isSubmitting,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const {
    categories,
    fetchAll: fetchCategories,
    loading: categoriesLoading,
  } = useConfigurations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    return new Date().toISOString().substring(0, 7);
  });
  const [summaryData, setSummaryData] = useState<TransactionSummary | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getTransactionSummary(selectedMonth || undefined);
        setSummaryData(data);
      } catch (e) {
        console.error("Failed to fetch summary", e);
      }
    };
    fetchSummary();
  }, [selectedMonth, transactions]);

  // Extract unique months from transactions (format: YYYY-MM)
  const availableMonths = Array.from(
    new Set(transactions.map((t) => t.date.substring(0, 7)))
  ).sort((a, b) => b.localeCompare(a));

  const filteredTransactions = selectedMonth
    ? transactions.filter((t) => t.date.startsWith(selectedMonth))
    : transactions;

  const handleOpenModal = (transaction?: Transaction) => {
    setEditingTransaction(transaction || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSubmit = async (payload: TransactionPayload) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, payload);
    } else {
      await addTransaction(payload);
    }
  };





  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Kas & Transaksi
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Ringkasan keuangan agregat (Iuran & Non-Iuran) dan Kelola Transaksi Operasional.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleOpenModal()}
            disabled={categoriesLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            + Tambah Transaksi
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b pb-4">
          <h3 className="font-semibold text-gray-700">Ringkasan Keuangan Total</h3>
          <div className="flex items-center gap-3">
            <label htmlFor="month-filter" className="text-sm font-medium text-gray-700">
              Periode:
            </label>
            <select
              id="month-filter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-white"
            >
              <option value="">Semua Waktu</option>
              {availableMonths.map((m) => {
                const [year, month] = m.split("-");
                const dateName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                });
                return (
                  <option key={m} value={m}>
                    {dateName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        {summaryData ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg border border-emerald-100 flex flex-col justify-between">
              <span className="text-xs opacity-75 font-semibold uppercase tracking-wider mb-1">Pemasukan Iuran</span>
              <span className="text-lg font-bold">{formatRp(summaryData.pemasukan_iuran)}</span>
            </div>
            <div className="bg-green-50 text-green-800 px-4 py-3 rounded-lg border border-green-100 flex flex-col justify-between">
              <span className="text-xs opacity-75 font-semibold uppercase tracking-wider mb-1">Pemasukan Lain</span>
              <span className="text-lg font-bold">{formatRp(summaryData.pemasukan_lain)}</span>
            </div>
            <div className="bg-rose-50 text-rose-800 px-4 py-3 rounded-lg border border-rose-100 flex flex-col justify-between">
              <span className="text-xs opacity-75 font-semibold uppercase tracking-wider mb-1">Pengeluaran</span>
              <span className="text-lg font-bold">{formatRp(summaryData.pengeluaran)}</span>
            </div>
            <div
              className={`px-4 py-3 rounded-lg border flex flex-col justify-between ${
                summaryData.saldo_sisa < 0 ? "bg-red-100 text-red-800 border-red-200" : "bg-blue-50 text-blue-800 border-blue-200"
              }`}
            >
              <span className="text-xs opacity-75 font-semibold uppercase tracking-wider mb-1">Saldo Total Sisa</span>
              <span className="text-xl font-bold">{formatRp(summaryData.saldo_sisa)}</span>
            </div>
          </div>
        ) : (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 h-20 bg-slate-100 rounded"></div>
            <div className="flex-1 h-20 bg-slate-100 rounded"></div>
            <div className="flex-1 h-20 bg-slate-100 rounded"></div>
            <div className="flex-1 h-20 bg-slate-100 rounded"></div>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Daftar Transaksi Non-Iuran & Pengeluaran</h3>
        <TransactionsList
          transactions={filteredTransactions}
          isLoading={isLoading}
          onEdit={handleOpenModal}
          onDelete={deleteTransaction}
        />
      </div>

      {isModalOpen && (
        <TransactionForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={editingTransaction}
          categories={categories}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};
