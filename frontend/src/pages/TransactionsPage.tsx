import React, { useState, useEffect } from "react";

import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { TransactionsList } from "@/features/transactions/components/TransactionsList";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";
import { useConfigurations } from "@/features/configurations/hooks/useConfigurations";
import type { Transaction, TransactionPayload } from "@/features/transactions";

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

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  const calculateSaldo = () => {
    return transactions.reduce((acc, curr) => {
      const amount = Number(curr.amount);
      if (curr.type === "income") return acc + amount;
      if (curr.type === "expense") return acc - amount;
      return acc;
    }, 0);
  };

  const saldo = calculateSaldo();
  const formattedSaldo = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(saldo);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Kas & Transaksi
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola pemasukan (selain iuran) dan pengeluaran operasional.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`text-right px-4 py-2 rounded shadow-sm border ${saldo < 0 ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}
          >
            <span className="text-xs uppercase font-bold tracking-wider opacity-70 block">
              Saldo Kas
            </span>
            <span className="text-lg font-bold">{formattedSaldo}</span>
          </div>
          <button
            onClick={() => handleOpenModal()}
            disabled={categoriesLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            + Tambah Transaksi
          </button>
        </div>
      </div>

      <TransactionsList
        transactions={transactions}
        isLoading={isLoading}
        onEdit={handleOpenModal}
        onDelete={deleteTransaction}
      />

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
