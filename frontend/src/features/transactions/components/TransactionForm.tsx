import React, { useState, useEffect } from "react";
import { CurrencyInput } from "@/components/CurrencyInput";

import type { Transaction, TransactionPayload } from "../types";
import {
  TransactionCategoryTypeEnum,
  type TransactionCategory,
} from "@/features/configurations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: TransactionPayload) => Promise<void>;
  initialData?: Transaction | null;
  categories: TransactionCategory[];
  isSubmitting: boolean;
}

export const TransactionForm: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  isSubmitting,
}) => {
  const [transactionCategoryId, setTransactionCategoryId] = useState<
    number | ""
  >("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [amount, setAmount] = useState<number | "">("");
  const [name, setName] = useState<string>("");
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (initialData) {
      setTransactionCategoryId(initialData.transaction_category_id);
      setDate(initialData.date);
      setAmount(initialData.amount);
      setName(initialData.name);
      setNote(initialData.note || "");
    } else {
      setTransactionCategoryId("");
      setDate(new Date().toISOString().split("T")[0]);
      setAmount("");
      setName("");
      setNote("");
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionCategoryId || !amount || !name || !date) return;

    await onSubmit({
      transaction_category_id: Number(transactionCategoryId),
      date,
      amount: Number(amount),
      name,
      note: note || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {initialData ? "Edit Transaksi" : "Tambah Transaksi"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <select
                value={transactionCategoryId}
                onChange={(e) =>
                  setTransactionCategoryId(Number(e.target.value))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  Pilih Kategori
                </option>
                <optgroup label="Pemasukan">
                  {categories
                    .filter(
                      (cat) => cat.type === TransactionCategoryTypeEnum.INCOME,
                    )
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Pengeluaran">
                  {categories
                    .filter(
                      (cat) => cat.type === TransactionCategoryTypeEnum.EXPENSE,
                    )
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </optgroup>
              </select>
              {categories.length === 0 && (
                <p className="mt-1 text-xs text-red-500">
                  Tidak ada kategori. Silakan tambahkan di menu Pengaturan.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama / Judul
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Gaji Satpam Pak Budi"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nominal (Rp)
              </label>
              <CurrencyInput
                value={amount}
                onChange={(val) => setAmount(val)}
                placeholder="0"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Catatan (Opsional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={categories.length === 0 || isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
