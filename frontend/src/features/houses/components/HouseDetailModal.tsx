import React, { useEffect, useState } from "react";
import type { House, HouseResident } from "../types";
import { useResidents } from "@/features/residents";
import { useHouses } from "@/features/houses";
import { formatRp } from "@/utils/formatRp";

interface HouseDetailModalProps {
  houseId: number;
  houseCode: string; // for display before loading
  onClose: () => void;
  onAssign: (
    houseId: number,
    residentId: number,
    isPic: boolean,
  ) => Promise<void>;
  onUnassign: (houseId: number, residentId: number) => Promise<void>;
}

type Tab = "residents" | "payments";

export const HouseDetailModal: React.FC<HouseDetailModalProps> = ({
  houseId,
  houseCode,
  onClose,
  onAssign,
  onUnassign,
}) => {
  const {
    residents: allResidents,
    loading: residentsLoading,
    fetchResidents,
  } = useResidents();
  const { fetchHouseDetails } = useHouses();

  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("residents");

  const [selectedResidentId, setSelectedResidentId] = useState<number | "">("");
  const [isPic, setIsPic] = useState(false);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchHouseDetails(houseId);
      setHouse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchResidents, houseId]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResidentId) return;
    try {
      await onAssign(houseId, Number(selectedResidentId), isPic);
      setSelectedResidentId("");
      setIsPic(false);
      await loadDetails(); // refresh details
    } catch (err) {
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
        await onUnassign(houseId, resident.id);
        await loadDetails(); // refresh details
      } catch (err) {
        console.error(err);
      }
    }
  };

  const activeResidents =
    house?.residents?.filter((r) => !r.pivot.moved_out_at) || [];
  const historyResidents =
    house?.residents?.filter((r) => r.pivot.moved_out_at) || [];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">House Details - {houseCode}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-6 flex justify-center items-center flex-1">
            <p className="text-gray-500">Loading details...</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b px-6 pt-4 space-x-4">
              <button
                className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "residents"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("residents")}
              >
                Residents
              </button>
              <button
                className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "payments"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("payments")}
              >
                Payment History
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === "residents" && (
                <div className="space-y-8">
                  {/* Active Residents */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Current Residents
                    </h3>
                    {activeResidents.length > 0 ? (
                      <ul className="divide-y divide-gray-200 border rounded-md">
                        {activeResidents.map((resident) => (
                          <li
                            key={`${resident.id}-${resident.pivot.moved_in_at}`}
                            className="p-3 flex justify-between items-center hover:bg-gray-50"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {resident.full_name}
                                </span>
                                {!!resident.pivot.is_pic && (
                                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    PIC
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Moved in:{" "}
                                {new Date(
                                  resident.pivot.moved_in_at,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleUnassign(resident)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 border border-transparent rounded hover:border-red-200 hover:bg-red-50"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic text-sm">
                        No residents currently assigned.
                      </p>
                    )}
                  </div>

                  {/* Assign Form */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Assign New Resident
                    </h3>
                    <form
                      onSubmit={handleAssign}
                      className="flex gap-4 items-end flex-wrap"
                    >
                      <div className="flex-1 min-w-50">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Select Resident
                        </label>
                        <select
                          value={selectedResidentId}
                          onChange={(e) =>
                            setSelectedResidentId(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value),
                            )
                          }
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                          disabled={residentsLoading}
                        >
                          <option value="">Choose...</option>
                          {allResidents
                            .filter(
                              (r) =>
                                !activeResidents.some((ar) => ar.id === r.id),
                            ) // Hide active
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
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                        />
                        <label
                          htmlFor="is_pic"
                          className="ml-2 block text-sm text-gray-900 cursor-pointer"
                        >
                          Set as PIC
                        </label>
                      </div>
                      <button
                        type="submit"
                        disabled={!selectedResidentId || residentsLoading}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded shadow hover:bg-blue-700 disabled:opacity-50"
                      >
                        Assign
                      </button>
                    </form>
                  </div>

                  {/* Historical Residents */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Resident History
                    </h3>
                    {historyResidents.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                Role
                              </th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                Moved In
                              </th>
                              <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                Moved Out
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {historyResidents.map((resident) => (
                              <tr
                                key={`${resident.id}-${resident.pivot.moved_in_at}`}
                              >
                                <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900">
                                  {resident.full_name}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  {resident.pivot.is_pic ? (
                                    <span className="text-blue-600 font-semibold text-xs">
                                      PIC
                                    </span>
                                  ) : (
                                    <span className="text-gray-500 text-xs">
                                      Resident
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-gray-500">
                                  {new Date(
                                    resident.pivot.moved_in_at,
                                  ).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-gray-500">
                                  {resident.pivot.moved_out_at
                                    ? new Date(
                                        resident.pivot.moved_out_at,
                                      ).toLocaleDateString()
                                    : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic text-sm">
                        No historical residents recorded.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "payments" && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Payment History</h3>
                  {house?.payments && house.payments.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                              Period
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                              Payer
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                              Notes
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {house.payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                                {new Date(
                                  payment.payment_date,
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-medium">
                                {payment.period_month}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                                {payment.due_type_rate?.name || "-"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                                {payment.resident?.full_name || "-"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-900">
                                {formatRp(payment.amount)}
                              </td>
                              <td
                                className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs truncate max-w-37.5"
                                title={payment.notes || ""}
                              >
                                {payment.notes || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      No payments recorded for this house yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
