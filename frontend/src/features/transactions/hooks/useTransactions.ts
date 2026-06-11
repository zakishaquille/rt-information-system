import { useState, useCallback, useEffect } from "react";
import type { Transaction, TransactionPayload } from "../types";
import * as api from "../api";
import { useToastStore } from "@/stores/useToastStore";
import { useConfirmStore } from "@/stores/useConfirmStore";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addToast = useToastStore((state) => state.addToast);
  const confirm = useConfirmStore((state) => state.confirm);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (e) {
      console.error(e);
      addToast("Gagal memuat transaksi", "error");
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (payload: TransactionPayload) => {
    setIsSubmitting(true);
    try {
      await api.createTransaction(payload);
      addToast("Transaksi berhasil ditambahkan", "success");
      await fetchTransactions();
    } catch (e) {
      console.error(e);
      addToast("Gagal menambah transaksi", "error");
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTransaction = async (id: number, payload: TransactionPayload) => {
    setIsSubmitting(true);
    try {
      await api.updateTransaction(id, payload);
      addToast("Transaksi berhasil diperbarui", "success");
      await fetchTransactions();
    } catch (e) {
      console.error(e);
      addToast("Gagal memperbarui transaksi", "error");
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTransaction = async (id: number) => {
    const isConfirmed = await confirm({
      title: "Hapus Transaksi",
      message: "Yakin ingin menghapus transaksi ini?",
      confirmText: "Hapus",
      type: "danger",
    });
    if (!isConfirmed) return;

    setIsSubmitting(true);
    try {
      await api.deleteTransaction(id);
      addToast("Transaksi berhasil dihapus", "success");
      await fetchTransactions();
    } catch (e) {
      console.error(e);
      addToast("Gagal menghapus transaksi", "error");
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    transactions,
    isLoading,
    isSubmitting,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,
  };
};
