import React from "react";
import { HouseStatus, type HouseInput } from "../types";

interface HouseFormProps {
  formData: HouseInput;
  errors?: Record<string, string[]>;
  loading: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const HouseForm: React.FC<HouseFormProps> = ({
  formData,
  errors,
  loading,
  onInputChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kode Rumah
          </label>
          <input
            type="text"
            name="code"
            required
            value={formData.code}
            onChange={onInputChange}
            className={`rtis-input w-full ${errors?.code ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          />
          {errors?.code && (
            <p className="mt-1 text-sm text-red-500">{errors.code[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={onInputChange}
            className={`rtis-input w-full ${errors?.status ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          >
            <option value={HouseStatus.DIHUNI}>Dihuni</option>
            <option value={HouseStatus.TIDAK_DIHUNI}>Tidak Dihuni</option>
          </select>
          {errors?.status && (
            <p className="mt-1 text-sm text-red-500">{errors.status[0]}</p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alamat Lengkap
        </label>
        <input
          type="text"
          name="address"
          required
          value={formData.address}
          onChange={onInputChange}
          className={`rtis-input w-full ${errors?.address ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
        />
        {errors?.address && (
          <p className="mt-1 text-sm text-red-500">{errors.address[0]}</p>
        )}
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="rtis-btn-outline">
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rtis-btn disabled:opacity-50"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};
