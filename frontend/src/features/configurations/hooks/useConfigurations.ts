import { useState, useCallback } from 'react';
import type {
  DueTypeRate,
  DueTypeRateInput,
  TransactionCategory,
  TransactionCategoryInput,
  UpdateTransactionCategoryInput,
} from '../types';
import { configurationsApi } from '../api';

export const useConfigurations = () => {
  const [rates, setRates] = useState<DueTypeRate[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ratesData, categoriesData] = await Promise.all([
        configurationsApi.listRates(),
        configurationsApi.listCategories(),
      ]);
      setRates(ratesData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configurations');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRate = async (data: DueTypeRateInput) => {
    try {
      setLoading(true);
      setError(null);
      await configurationsApi.createRate(data);
      await fetchAll();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create rate';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRate = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await configurationsApi.deleteRate(id);
      await fetchAll();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete rate';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data: TransactionCategoryInput) => {
    try {
      setLoading(true);
      setError(null);
      await configurationsApi.createCategory(data);
      await fetchAll();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create category';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: number, data: UpdateTransactionCategoryInput) => {
    try {
      setLoading(true);
      setError(null);
      await configurationsApi.updateCategory(id, data);
      await fetchAll();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update category';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await configurationsApi.deleteCategory(id);
      await fetchAll();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete category';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    rates,
    categories,
    loading,
    error,
    fetchAll,
    createRate,
    deleteRate,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
