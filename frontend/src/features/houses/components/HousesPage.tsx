import React, { useEffect, useState } from "react";
import { HTTPError } from "ky";
import { useHouses } from "@/features/houses/hooks/useHouses";
import {
  HouseStatus,
  type House,
  type HouseInput,
} from "@/features/houses/types";
import { HouseForm } from "@/features/houses/components/HouseForm";
import { HouseDetailModal } from "@/features/houses/components/HouseDetailModal";
import { useConfirmStore } from "@/stores/useConfirmStore";

export const HousesPage: React.FC = () => {
  const {
    houses,
    loading,
    fetchHouses,
    createHouse,
    updateHouse,
    deleteHouse,
    assignResident,
    unassignResident,
  } = useHouses();
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [managingResidentsHouse, setManagingResidentsHouse] =
    useState<House | null>(null);
  const confirm = useConfirmStore((state) => state.confirm);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<HouseInput>({
    code: "",
    address: "",
    status: HouseStatus.TIDAK_DIHUNI,
  });

  useEffect(() => {
    fetchHouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    try {
      if (editingHouse) {
        await updateHouse(editingHouse.id, formData);
        setEditingHouse(null);
      } else {
        await createHouse(formData);
        setIsAdding(false);
      }
      setFormData({ code: "", address: "", status: HouseStatus.TIDAK_DIHUNI });
    } catch (err) {
      if (err instanceof HTTPError && err.response.status === 422) {
        try {
          const errorData = await err.response.json();
          setFormErrors(errorData.errors || {});
        } catch (parseErr) {
          console.error("Failed to parse 422 error", parseErr);
        }
      } else {
        console.error("Error submitting house:", err);
      }
    }
  };

  const startEdit = (house: House) => {
    setFormErrors({});
    setEditingHouse(house);
    setFormData({
      code: house.code,
      address: house.address,
      status: house.status,
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingHouse(null);
    setIsAdding(false);
    setFormErrors({});
    setFormData({ code: "", address: "", status: HouseStatus.TIDAK_DIHUNI });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Rumah</h2>
        {!isAdding && !editingHouse && (
          <button onClick={() => setIsAdding(true)} className="rtis-btn">
            Tambah Rumah
          </button>
        )}
      </div>

      {loading && !isAdding && !editingHouse && <p>Loading data...</p>}

      <div className="bg-white shadow overflow-x-auto sm:rounded-[10px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alamat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {houses.map((house) => (
              <tr key={house.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {house.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {house.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      house.status === "dihuni"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {house.status === "dihuni" ? "Dihuni" : "Kosong"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setManagingResidentsHouse(house)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => startEdit(house)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      const isConfirmed = await confirm({
                        title: "Hapus Rumah",
                        message: "Yakin ingin menghapus rumah ini?",
                        confirmText: "Hapus",
                        type: "danger",
                      });
                      if (isConfirmed) {
                        deleteHouse(house.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {houses.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Tidak ada data rumah
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(isAdding || editingHouse) && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full flex items-center justify-center z-[100] p-4">
          <div className="rtis-card p-8 max-w-lg w-full relative">
            <button
              onClick={cancelEdit}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-[#111827]">
              {editingHouse ? "Edit Rumah" : "Tambah Rumah"}
            </h3>
            <HouseForm
              formData={formData}
              errors={formErrors}
              loading={loading}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={cancelEdit}
            />
          </div>
        </div>
      )}

      {managingResidentsHouse && (
        <HouseDetailModal
          houseId={managingResidentsHouse.id}
          houseCode={managingResidentsHouse.code}
          onClose={() => setManagingResidentsHouse(null)}
          onAssign={assignResident}
          onUnassign={unassignResident}
        />
      )}
    </div>
  );
};
