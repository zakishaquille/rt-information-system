import React from "react";
import { ResidentStatus, type Resident, type ResidentFormData } from "../types";

interface ResidentFormProps {
  editingResident: Resident | null;
  formData: ResidentFormData;
  onFormDataChange: (data: ResidentFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const ResidentForm: React.FC<ResidentFormProps> = ({
  editingResident,
  formData,
  onFormDataChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editingResident ? "Edit Resident" : "Add New Resident"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) =>
                onFormDataChange({ ...formData, full_name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  status: e.target.value as ResidentStatus,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            >
              <option value={ResidentStatus.TETAP}>Tetap</option>
              <option value={ResidentStatus.KONTRAK}>Kontrak</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={formData.phone_number}
              onChange={(e) =>
                onFormDataChange({ ...formData, phone_number: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_married"
              checked={formData.is_married}
              onChange={(e) =>
                onFormDataChange({ ...formData, is_married: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="is_married"
              className="ml-2 block text-sm text-gray-900"
            >
              Married
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              KTP Photo{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            {editingResident?.ktp_photo_url && (
              <div className="mt-2 mb-2">
                <span className="block text-xs text-gray-500 mb-1">
                  Current Photo:
                </span>
                <img
                  src={editingResident.ktp_photo_url}
                  alt="Current KTP"
                  crossOrigin="use-credentials"
                  className="h-24 w-auto object-cover rounded border border-gray-200"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  ktp_photo: e.target.files?.[0],
                })
              }
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
