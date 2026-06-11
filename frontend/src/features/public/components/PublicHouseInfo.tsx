import type { PublicHouse } from "../types";

interface PublicHouseInfoProps {
  house: PublicHouse;
}

export const PublicHouseInfo = ({ house }: PublicHouseInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Kode Rumah</p>
        <p className="text-xl font-semibold text-gray-900">{house.code}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Status Penghuni</p>
        <p className="text-xl font-semibold text-gray-900 capitalize">
          {house.status}
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Alamat</p>
        <p className="text-lg font-medium text-gray-900">{house.address}</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Penanggung Jawab</p>
        <p className="text-lg font-medium text-gray-900">
          {house.pic_name || "Belum ada PIC"}
        </p>
      </div>
    </div>
  );
};
