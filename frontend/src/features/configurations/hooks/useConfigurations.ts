import { useState, useCallback } from 'react';
import type {
  DueTypeRate,
  DueTypeRateInput,
  TransactionCategory,
  TransactionCategoryInput,
  UpdateTransactionCategoryInput,
} from '../types';
import { configurationsApi } from '../api';
import { toast } from '@/stores/useToastStore';
import { handleApiError } from '@/utils/apiErrorHelper';

export const useConfigurations = () => {
  const [rates, setRates] = useState<DueTypeRate[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [ratesData, categoriesData] = await Promise.all([
        configurationsApi.listRates(),
        configurationsApi.listCategories(),
      ]);
      setRates(ratesData);
      setCategories(categoriesData);
    } catch (err) {
      toast.error(await handleApiError(err, 'Failed to load configurations'));
    } finally {
      setLoading(false);
    }
  }, []);

  const createRate = async (data: DueTypeRateInput) => {
    try {
      setLoading(true);
      await configurationsApi.createRate(data);
      toast.success('Rate created successfully');
      await fetchAll();
    } catch (err) {
      toast.error(await handleApiError(err, 'Failed to create rate'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRate = async (id: number) => {
    try {
      setLoading(true);
      await configurationsApi.deleteRate(id);
      toast.success('Rate deleted successfully');
      await fetchAll();
    } catch (err) {
      toast.error(await handleApiError(err, 'Failed to delete rate'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data: TransactionCategoryInput) => {
    try {
      setLoading(true);
      await configurationsApi.createCategory(data);
      toast.success('Category created successfully');
      await fetchAll();
    } catch (err) {
      toast.error(await handleApiError(err, 'Failed to create category'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: number, data: UpdateTransactionCategoryInput) => {
    try {
      setLoading(true);
      await configurationsApi.updateCategory(id, data);
      toast.success('Category updated successfully');
      await fetchAll();
    } catch (err) {
      toast.error(await handleApiError(err, 'Failed to update category'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      setLoading(true);
      await configurationsApi.deleteCategory(id);
      toast.success('Category deleted successfully');
      await fetchAll();
    } catch (err) {
      toast.error(await handleApiError(err, 'Failed to delete category'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    rates,
    categories,
    loading,
    fetchAll,
    createRate,
    deleteRate,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
