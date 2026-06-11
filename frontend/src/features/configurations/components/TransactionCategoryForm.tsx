import React, { useState } from "react";
import {
  TransactionCategoryTypeEnum,
  type TransactionCategory,
  type TransactionCategoryInput,
  type TransactionCategoryType,
} from "../types";

interface TransactionCategoryFormProps {
  initialData?: TransactionCategory;
  errors?: Record<string, string[]>;
  loading: boolean;
  onSubmit: (data: TransactionCategoryInput) => Promise<void>;
  onCancel: () => void;
}

export const TransactionCategoryForm: React.FC<
  TransactionCategoryFormProps
> = ({ initialData, errors, loading, onSubmit, onCancel }) => {
  const isEditing = !!initialData;
  const [form, setForm] = useState<TransactionCategoryInput>({
    type: initialData?.type || TransactionCategoryTypeEnum.EXPENSE,
    name: initialData?.name || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 rtis-card p-4"
      aria-label={isEditing ? "Form edit kategori" : "Form tambah kategori"}
    >
      <h4 className="mb-3 text-lg font-bold text-[#111827]">
        {isEditing ? "Edit Kategori" : "Kategori Baru"}
      </h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="cat-type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipe
          </label>
          <select
            id="cat-type"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as TransactionCategoryType,
              })
            }
            disabled={isEditing}
            className={`rtis-input w-full ${errors?.type ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          >
            <option value={TransactionCategoryTypeEnum.EXPENSE}>
              Pengeluaran
            </option>
            <option value={TransactionCategoryTypeEnum.INCOME}>
              Pemasukan
            </option>
          </select>
          {errors?.type && (
            <p className="mt-1 text-sm text-red-500">{errors.type[0]}</p>
          )}
          {isEditing && (
            <p className="mt-1 text-xs text-gray-500">
              Tipe tidak dapat diubah setelah dibuat.
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="cat-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nama Kategori
          </label>
          <input
            id="cat-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="cth: Perbaikan Jalan"
            className={`rtis-input w-full ${errors?.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          />
          {errors?.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name[0]}</p>
          )}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rtis-btn disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : isEditing ? "Update" : "Simpan"}
        </button>
        <button type="button" onClick={onCancel} className="rtis-btn-outline">
          Batal
        </button>
      </div>
    </form>
  );
};
