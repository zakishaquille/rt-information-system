import React from "react";
import { ResidentStatus, type Resident, type ResidentFormData } from "../types";

interface ResidentFormProps {
  editingResident: Resident | null;
  formData: ResidentFormData;
  errors?: Record<string, string[]>;
  onFormDataChange: (data: ResidentFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const ResidentForm: React.FC<ResidentFormProps> = ({
  editingResident,
  formData,
  errors,
  onFormDataChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full flex items-center justify-center z-[100]">
      <div className="rtis-card p-8 w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4 text-[#111827]">
          {editingResident ? "Edit Resident" : "Add New Resident"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) =>
                onFormDataChange({ ...formData, full_name: e.target.value })
              }
              className={`rtis-input w-full ${errors?.full_name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors?.full_name && (
              <p className="mt-1 text-sm text-red-500">{errors.full_name[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className={`rtis-input w-full ${errors?.status ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            >
              <option value={ResidentStatus.TETAP}>Tetap</option>
              <option value={ResidentStatus.KONTRAK}>Kontrak</option>
            </select>
            {errors?.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={formData.phone_number}
              onChange={(e) =>
                onFormDataChange({ ...formData, phone_number: e.target.value })
              }
              className={`rtis-input w-full ${errors?.phone_number ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors?.phone_number && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone_number[0]}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_married"
              checked={formData.is_married}
              onChange={(e) =>
                onFormDataChange({ ...formData, is_married: e.target.checked })
              }
              className="h-4 w-4 text-[#0f79f3] focus:ring-[#0f79f3] border-gray-300 rounded"
            />
            <label
              htmlFor="is_married"
              className="ml-2 block text-sm text-gray-900"
            >
              Married
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              KTP Photo{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            {editingResident?.ktp_photo_url && (
              <div className="mt-2 mb-2 flex flex-col items-start">
                <span className="block text-xs text-gray-500 mb-1">
                  Current Photo:
                </span>
                <div className="flex gap-4 items-end">
                  <img
                    src={editingResident.ktp_photo_url}
                    alt="Current KTP"
                    crossOrigin="use-credentials"
                    className="h-24 w-auto object-cover rounded border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      editingResident.ktp_photo_url &&
                      window.open(editingResident.ktp_photo_url, "_blank")
                    }
                    className="rtis-btn-outline text-xs py-1 px-2"
                  >
                    Open Image
                  </button>
                </div>
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
              className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#eff3f9] file:text-[#0f79f3] hover:file:bg-[#e4ebf5] ${errors?.ktp_photo ? "border-red-500" : ""}`}
            />
            {errors?.ktp_photo && (
              <p className="mt-1 text-sm text-red-500">{errors.ktp_photo[0]}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="rtis-btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="rtis-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
