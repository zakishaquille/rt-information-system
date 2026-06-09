import React, { useState } from "react";
import { useHouses } from "./hooks/useHouses";
import { HouseStatus, type House, type HouseInput } from "./types";

export const HousesList: React.FC = () => {
  const { houses, loading, error, createHouse, updateHouse, deleteHouse } =
    useHouses();
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<HouseInput>({
    code: "",
    address: "",
    status: HouseStatus.TIDAK_DIHUNI,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      console.error(err);
    }
  };

  const startEdit = (house: House) => {
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
    setFormData({ code: "", address: "", status: HouseStatus.TIDAK_DIHUNI });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Daftar Rumah</h2>
        {!isAdding && !editingHouse && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tambah Rumah
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded">{error}</div>
      )}

      {(isAdding || editingHouse) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow border"
        >
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {loading && !isAdding && !editingHouse && <p>Loading data...</p>}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border">
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
                    onClick={() => startEdit(house)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Yakin ingin menghapus rumah ini?")) {
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
    </div>
  );
};
