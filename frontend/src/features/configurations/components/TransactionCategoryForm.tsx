import React, { useState } from 'react';
import { CategoryType, type TransactionCategory, type TransactionCategoryInput } from '../types';

interface TransactionCategoryFormProps {
  initialData?: TransactionCategory;
  loading: boolean;
  onSubmit: (data: TransactionCategoryInput) => Promise<void>;
  onCancel: () => void;
}

export const TransactionCategoryForm: React.FC<TransactionCategoryFormProps> = ({
  initialData,
  loading,
  onSubmit,
  onCancel,
}) => {
  const isEditing = !!initialData;
  const [form, setForm] = useState<TransactionCategoryInput>({
    type: initialData?.type || CategoryType.EXPENSE,
    name: initialData?.name || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await onSubmit(form);
  };

  const bgClass = isEditing ? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50';
  const btnClass = isEditing 
    ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500' 
    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';

  return (
    <form
      onSubmit={handleSubmit}
      className={`mb-4 rounded-lg border p-4 ${bgClass}`}
      aria-label={isEditing ? 'Form edit kategori' : 'Form tambah kategori'}
    >
      <h4 className="mb-3 font-medium text-gray-800">
        {isEditing ? 'Edit Kategori' : 'Kategori Baru'}
      </h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="cat-type" className="block text-xs font-medium text-gray-600">Tipe</label>
          <select
            id="cat-type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as typeof CategoryType[keyof typeof CategoryType] })}
            disabled={isEditing}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value={CategoryType.EXPENSE}>Pengeluaran</option>
            <option value={CategoryType.INCOME}>Pemasukan</option>
          </select>
          {isEditing && <p className="mt-0.5 text-xs text-gray-500">Tipe tidak dapat diubah setelah dibuat.</p>}
        </div>
        <div>
          <label htmlFor="cat-name" className="block text-xs font-medium text-gray-600">Nama Kategori</label>
          <input
            id="cat-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="cth: Perbaikan Jalan"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1"
          />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className={`rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${btnClass}`}
        >
          {loading ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
};
