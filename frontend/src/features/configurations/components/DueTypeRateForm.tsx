import React, { useState } from "react";
import { CurrencyInput } from "@/components/CurrencyInput";
import type { DueTypeRate, DueTypeRateInput } from "../types";

interface DueTypeRateFormProps {
  rates: DueTypeRate[];
  errors?: Record<string, string[]>;
  loading: boolean;
  onSubmit: (data: DueTypeRateInput) => Promise<void>;
  onCancel: () => void;
}

export const DueTypeRateForm: React.FC<DueTypeRateFormProps> = ({
  rates,
  errors,
  loading,
  onSubmit,
  onCancel,
}) => {
  const [rateForm, setRateForm] = useState<{
    name: string;
    amount: number | "";
  }>({
    name: "",
    amount: "",
  });

  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: rateForm.name,
      amount: Number(rateForm.amount),
    });
  };

  return (
    <form
      onSubmit={handleRateSubmit}
      className="mt-4 rtis-card p-4"
      aria-label="Form set tarif iuran"
    >
      <h4 className="mb-3 text-lg font-bold text-[#111827]">Set Tarif Baru</h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="rate-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Jenis Iuran
          </label>
          {/* datalist provides autocomplete from existing due types */}
          <datalist id="due-type-names">
            {[...new Set(rates.map((r) => r.name))].map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
          <input
            id="rate-name"
            type="text"
            list="due-type-names"
            required
            value={rateForm.name}
            onChange={(e) => setRateForm({ ...rateForm, name: e.target.value })}
            placeholder="cth: satpam, kebersihan, sampah"
            className={`rtis-input w-full ${errors?.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          />
          {errors?.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name[0]}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            Nama baru = jenis iuran baru. Nama yg sudah ada = update tarif.
          </p>
        </div>
        <div>
          <label
            htmlFor="rate-amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nominal (Rp)
          </label>
          <CurrencyInput
            id="rate-amount"
            required
            value={rateForm.amount}
            onChange={(val) => setRateForm({ ...rateForm, amount: val })}
            placeholder="100000"
            className={`rtis-input w-full ${errors?.amount ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          />
          {errors?.amount && (
            <p className="mt-1 text-sm text-red-500">{errors.amount[0]}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            Tarif baru langsung berlaku saat disimpan.
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rtis-btn disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Tarif"}
        </button>
        <button type="button" onClick={onCancel} className="rtis-btn-outline">
          Batal
        </button>
      </div>
    </form>
  );
};
