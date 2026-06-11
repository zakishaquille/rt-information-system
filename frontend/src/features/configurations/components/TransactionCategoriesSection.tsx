import React, { useState } from "react";
import {
  TransactionCategoryTypeEnum,
  type TransactionCategory,
  type TransactionCategoryInput,
  type UpdateTransactionCategoryInput,
} from "../types";
import { TransactionCategoryForm } from "./TransactionCategoryForm";
import { TransactionCategoryList } from "./TransactionCategoryList";

interface TransactionCategoriesSectionProps {
  categories: TransactionCategory[];
  loading: boolean;
  createCategory: (data: TransactionCategoryInput) => Promise<void>;
  updateCategory: (
    id: number,
    data: UpdateTransactionCategoryInput,
  ) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

export const TransactionCategoriesSection: React.FC<
  TransactionCategoriesSectionProps
> = ({
  categories,
  loading,
  createCategory,
  updateCategory,
  deleteCategory,
}) => {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<TransactionCategory | null>(null);

  const expenseCategories = categories.filter(
    (c) => c.type === TransactionCategoryTypeEnum.EXPENSE,
  );
  const incomeCategories = categories.filter(
    (c) => c.type === TransactionCategoryTypeEnum.INCOME,
  );

  const handleCreateSubmit = async (data: TransactionCategoryInput) => {
    try {
      await createCategory(data);
      setShowCategoryForm(false);
    } catch {
      // error is already set in hook
    }
  };

  const handleUpdateSubmit = async (data: TransactionCategoryInput) => {
    if (!editingCategory) return;
    try {
      await updateCategory(editingCategory.id, { name: data.name });
      setEditingCategory(null);
    } catch {
      // error is already set in hook
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;
    await deleteCategory(id);
  };

  const handleCancelForm = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-start">
          <h3 className="text-base font-semibold text-gray-900">
            Kategori Transaksi
          </h3>
          <p className="text-sm text-gray-500">
            Kelola kategori untuk pengeluaran dan pemasukan non-iuran.
          </p>
        </div>
        {!showCategoryForm && !editingCategory && (
          <button
            id="btn-add-category"
            onClick={() => setShowCategoryForm(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Tambah Kategori
          </button>
        )}
      </div>

      {showCategoryForm && (
        <TransactionCategoryForm
          loading={loading}
          onSubmit={handleCreateSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {editingCategory && (
        <TransactionCategoryForm
          key={editingCategory.id}
          initialData={editingCategory}
          loading={loading}
          onSubmit={handleUpdateSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {loading && categories.length === 0 && (
        <p className="text-sm text-gray-500">Memuat kategori...</p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TransactionCategoryList
          title="Pengeluaran"
          color="red"
          categories={expenseCategories}
          onEdit={setEditingCategory}
          onDelete={handleDeleteCategory}
        />
        <TransactionCategoryList
          title="Pemasukan"
          color="green"
          categories={incomeCategories}
          onEdit={setEditingCategory}
          onDelete={handleDeleteCategory}
        />
      </div>
    </section>
  );
};
