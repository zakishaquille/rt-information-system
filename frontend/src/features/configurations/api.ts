import { apiClient } from '@/api/client';
import type {
  DueTypeRate,
  DueTypeRateInput,
  TransactionCategory,
  TransactionCategoryInput,
  UpdateTransactionCategoryInput,
} from './types';

export const configurationsApi = {
  // Due Type Rates
  listRates: async (): Promise<DueTypeRate[]> => {
    const res = await apiClient.get('due-type-rates').json<{ data: DueTypeRate[] }>();
    return res.data;
  },

  createRate: async (data: DueTypeRateInput): Promise<DueTypeRate> => {
    const res = await apiClient.post('due-type-rates', { json: data }).json<{ data: DueTypeRate }>();
    return res.data;
  },

  deleteRate: async (id: number): Promise<void> => {
    await apiClient.delete(`due-type-rates/${id}`);
  },

  // Transaction Categories
  listCategories: async (): Promise<TransactionCategory[]> => {
    const res = await apiClient.get('transaction-categories').json<{ data: TransactionCategory[] }>();
    return res.data;
  },

  createCategory: async (data: TransactionCategoryInput): Promise<TransactionCategory> => {
    const res = await apiClient.post('transaction-categories', { json: data }).json<{ data: TransactionCategory }>();
    return res.data;
  },

  updateCategory: async (id: number, data: UpdateTransactionCategoryInput): Promise<TransactionCategory> => {
    const res = await apiClient.put(`transaction-categories/${id}`, { json: data }).json<{ data: TransactionCategory }>();
    return res.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`transaction-categories/${id}`);
  },
};
