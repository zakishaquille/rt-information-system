import { apiClient } from "@/api/client";
import type { Transaction, TransactionPayload } from "./types";

export interface TransactionSummary {
  pemasukan_iuran: number;
  pemasukan_lain: number;
  pengeluaran: number;
  saldo_sisa: number;
}

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await apiClient.get("transactions").json<{ data: Transaction[] }>();
  return response.data;
};

export const getTransactionSummary = async (month?: string): Promise<TransactionSummary> => {
  const url = month ? `transactions/summary?month=${month}` : "transactions/summary";
  const response = await apiClient.get(url).json<{ data: TransactionSummary }>();
  return response.data;
};

export const createTransaction = async (payload: TransactionPayload): Promise<Transaction> => {
  const response = await apiClient.post("transactions", { json: payload }).json<{ data: Transaction }>();
  return response.data;
};

export const updateTransaction = async (id: number, payload: TransactionPayload): Promise<Transaction> => {
  const response = await apiClient.put(`transactions/${id}`, { json: payload }).json<{ data: Transaction }>();
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await apiClient.delete(`transactions/${id}`);
};
