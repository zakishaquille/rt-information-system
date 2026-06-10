import React, { useEffect } from "react";
import { useConfigurations } from "./hooks/useConfigurations";
import { DueTypeRatesSection } from "./components/DueTypeRatesSection";
import { TransactionCategoriesSection } from "./components/TransactionCategoriesSection";

export const ConfigurationsList: React.FC = () => {
  const {
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
  } = useConfigurations();

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Pengaturan Konfigurasi
        </h2>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <DueTypeRatesSection
        rates={rates}
        loading={loading}
        createRate={createRate}
        deleteRate={deleteRate}
      />

      <hr className="border-gray-200" />

      <TransactionCategoriesSection
        categories={categories}
        loading={loading}
        createCategory={createCategory}
        updateCategory={updateCategory}
        deleteCategory={deleteCategory}
      />
    </div>
  );
};
