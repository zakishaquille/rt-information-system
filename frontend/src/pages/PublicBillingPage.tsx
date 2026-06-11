import { useParams } from "react-router-dom";
import { PublicBillingView } from "../features/public/components/PublicBillingView";

export const PublicBillingPage = () => {
  const { uuid } = useParams<{ uuid: string }>();

  if (!uuid) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Akses Ditolak</h2>
        <p className="text-gray-600">URL tagihan tidak valid (UUID tidak ditemukan).</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <PublicBillingView uuid={uuid} />
    </div>
  );
};
