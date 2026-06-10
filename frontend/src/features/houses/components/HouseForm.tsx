import React from "react";
import { HouseStatus, type House, type HouseInput } from "../types";

interface HouseFormProps {
  editingHouse: House | null;
  formData: HouseInput;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const HouseForm: React.FC<HouseFormProps> = ({
  editingHouse,
  formData,
  loading,
  onInputChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow border">
      <h3 className="text-lg font-medium mb-4">
        {editingHouse ? "Edit Rumah" : "Tambah Rumah Baru"}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kode Rumah
          </label>
          <input
            type="text"
            name="code"
            required
            value={formData.code}
            onChange={onInputChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Alamat Lengkap
          </label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={onInputChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={onInputChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
          >
            <option value={HouseStatus.DIHUNI}>Dihuni</option>
            <option value={HouseStatus.TIDAK_DIHUNI}>Tidak Dihuni</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Simpan
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Batal
        </button>
      </div>
    </form>
  );
};
