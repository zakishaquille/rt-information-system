import { useEffect, useState } from "react";
import { getPublicHouse } from "../api";
import type { PublicHouse } from "../types";
import { PublicHouseInfo } from "./PublicHouseInfo";
import { PublicBillingBanner } from "./PublicBillingBanner";
import { PublicPaymentMatrix } from "./PublicPaymentMatrix";

export const PublicBillingView = ({ uuid }: { uuid: string }) => {
  const [house, setHouse] = useState<PublicHouse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setIsError(false);

    getPublicHouse(uuid)
      .then((data) => {
        if (mounted) {
          setHouse(data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch public house data:", error);
        if (mounted) {
          setIsError(true);
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [uuid]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !house) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">
          Rumah tidak ditemukan
        </h2>
        <p className="text-gray-600 mt-2">
          Periksa kembali URL yang Anda gunakan.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-indigo-800 px-6 py-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Informasi Tagihan</h1>
          <p className="text-indigo-100 opacity-90">
            Transparansi iuran warga RTIS
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <PublicHouseInfo house={house} />
          <PublicBillingBanner totalArrears={house.total_arrears} />
          <PublicPaymentMatrix paymentMatrix={house.payment_matrix} />
        </div>
      </div>
    </div>
  );
};
