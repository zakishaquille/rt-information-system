import React, { useState } from "react";
import { HTTPError } from "ky";
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
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const expenseCategories = categories.filter(
    (c) => c.type === TransactionCategoryTypeEnum.EXPENSE,
  );
  const incomeCategories = categories.filter(
    (c) => c.type === TransactionCategoryTypeEnum.INCOME,
  );

  const handleCreateSubmit = async (data: TransactionCategoryInput) => {
    setFormErrors({});
    try {
      await createCategory(data);
      setShowCategoryForm(false);
    } catch (err) {
      if (err instanceof HTTPError && err.response.status === 422) {
        try {
          const errorData = await err.response.json();
          setFormErrors(errorData.errors || {});
        } catch (parseErr) {
          console.error("Failed to parse 422 error", parseErr);
        }
      }
    }
  };

  const handleUpdateSubmit = async (data: TransactionCategoryInput) => {
    if (!editingCategory) return;
    setFormErrors({});
    try {
      await updateCategory(editingCategory.id, { name: data.name });
      setEditingCategory(null);
    } catch (err) {
      if (err instanceof HTTPError && err.response.status === 422) {
        try {
          const errorData = await err.response.json();
          setFormErrors(errorData.errors || {});
        } catch (parseErr) {
          console.error("Failed to parse 422 error", parseErr);
        }
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;
    await deleteCategory(id);
  };

  const handleCancelForm = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    setFormErrors({});
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
            onClick={() => {
              setFormErrors({});
              setShowCategoryForm(true);
            }}
            className="rtis-btn"
          >
            Tambah Kategori
          </button>
        )}
      </div>

      {showCategoryForm && (
        <TransactionCategoryForm
          errors={formErrors}
          loading={loading}
          onSubmit={handleCreateSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {editingCategory && (
        <TransactionCategoryForm
          key={editingCategory.id}
          initialData={editingCategory}
          errors={formErrors}
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
          onEdit={(cat) => {
            setFormErrors({});
            setEditingCategory(cat);
          }}
          onDelete={handleDeleteCategory}
        />
        <TransactionCategoryList
          title="Pemasukan"
          color="green"
          categories={incomeCategories}
          onEdit={(cat) => {
            setFormErrors({});
            setEditingCategory(cat);
          }}
          onDelete={handleDeleteCategory}
        />
      </div>
    </section>
  );
};
