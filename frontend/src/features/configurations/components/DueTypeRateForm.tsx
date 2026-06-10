import React, { useState } from 'react';
import type { DueTypeRate, DueTypeRateInput } from '../types';

interface DueTypeRateFormProps {
  rates: DueTypeRate[];
  loading: boolean;
  onSubmit: (data: DueTypeRateInput) => Promise<void>;
  onCancel: () => void;
}

const today = () => new Date().toISOString().split('T')[0];

export const DueTypeRateForm: React.FC<DueTypeRateFormProps> = ({
  rates,
  loading,
  onSubmit,
  onCancel,
}) => {
  const [rateForm, setRateForm] = useState<DueTypeRateInput>({
    name: '',
    amount: 0,
    effective_from: today(),
  });

  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(rateForm);
  };

  return (
    <form
      onSubmit={handleRateSubmit}
      className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4"
      aria-label="Form set tarif iuran"
    >
      <h4 className="mb-3 font-medium text-gray-800">Set Tarif Baru</h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="rate-name" className="block text-xs font-medium text-gray-600">Jenis Iuran</label>
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-0.5 text-xs text-gray-400">Nama baru = jenis iuran baru. Nama yg sudah ada = update tarif.</p>
        </div>
        <div>
          <label htmlFor="rate-amount" className="block text-xs font-medium text-gray-600">Nominal (Rp)</label>
          <input
            id="rate-amount"
            type="number"
            min={0}
            required
            value={rateForm.amount || ''}
            onChange={(e) => setRateForm({ ...rateForm, amount: Number(e.target.value) })}
            placeholder="100000"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="rate-effective-from" className="block text-xs font-medium text-gray-600">Berlaku Mulai</label>
          <input
            id="rate-effective-from"
            type="date"
            required
            min={today()} // tidak boleh tanggal lalu
            value={rateForm.effective_from}
            onChange={(e) => setRateForm({ ...rateForm, effective_from: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-0.5 text-xs text-gray-400">Tanggal hari ini = langsung aktif. Masa depan = terjadwal.</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Simpan Tarif'}
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
