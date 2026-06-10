import React, { useEffect, useState } from "react";
import type { House, HouseResident } from "../types";
import { useResidents } from "../../residents/hooks/useResidents";

interface HouseResidentManagerProps {
  house: House;
  onClose: () => void;
  onAssign: (
    houseId: number,
    residentId: number,
    isPic: boolean,
  ) => Promise<void>;
  onUnassign: (houseId: number, residentId: number) => Promise<void>;
}

export const HouseResidentManager: React.FC<HouseResidentManagerProps> = ({
  house,
  onClose,
  onAssign,
  onUnassign,
}) => {
  const {
    residents,
    loading: residentsLoading,
    fetchResidents,
  } = useResidents();
  const [selectedResidentId, setSelectedResidentId] = useState<number | "">("");
  const [isPic, setIsPic] = useState(false);

  useEffect(() => {
    fetchResidents();
  }, [fetchResidents]);

  const activeResidents =
    house.residents?.filter((r) => !r.pivot.moved_out_at) || [];

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResidentId) return;
    try {
      await onAssign(house.id, Number(selectedResidentId), isPic);
      setSelectedResidentId("");
      setIsPic(false);
    } catch (err) {
      // The error is already handled by the hook which throws it, and useHouses already shows toast.
      // We don't need to show another toast here, just catch to prevent unhandled promise rejection.
      console.error(err);
    }
  };

  const handleUnassign = async (resident: HouseResident) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${resident.full_name} from this house?`,
      )
    ) {
      try {
        await onUnassign(house.id, resident.id);
      } catch (err) {
        // The error is already handled by the hook which throws it, and useHouses already shows toast.
        console.error(err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Manage Residents - {house.code}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Current Residents</h3>
          {activeResidents.length > 0 ? (
            <ul className="divide-y divide-gray-200 border rounded-md">
              {activeResidents.map((resident) => (
                <li
                  key={resident.id}
                  className="p-3 flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium">{resident.full_name}</span>
                    {!!resident.pivot.is_pic && (
                      <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        PIC
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleUnassign(resident)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">
              No residents assigned to this house.
            </p>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-3">Assign New Resident</h3>
          <form onSubmit={handleAssign} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Resident
              </label>
              <select
                value={selectedResidentId}
                onChange={(e) =>
                  setSelectedResidentId(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                disabled={residentsLoading}
              >
                <option value="">Select a resident...</option>
                {residents
                  .filter((r) => !activeResidents.some((ar) => ar.id === r.id)) // Hide already assigned
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.full_name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-center pb-2">
              <input
                type="checkbox"
                id="is_pic"
                checked={isPic}
                onChange={(e) => setIsPic(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_pic"
                className="ml-2 block text-sm text-gray-900"
              >
                Is PIC
              </label>
            </div>
            <button
              type="submit"
              disabled={!selectedResidentId || residentsLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Assign
            </button>
          </form>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
