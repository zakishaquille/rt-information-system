import { formatRp } from "@/utils/formatRp";

interface PublicBillingBannerProps {
  totalArrears: string;
}

export const PublicBillingBanner = ({
  totalArrears,
}: PublicBillingBannerProps) => {
  if (parseFloat(totalArrears) > 0) {
    return (
      <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-red-800 font-bold text-lg">
              Total Tunggakan (s/d Bulan Ini)
            </h3>
            <p className="text-red-600 text-sm">
              Mohon segera lunasi tagihan Anda
            </p>
          </div>
          <div className="text-red-700 font-black text-2xl">
            {formatRp(totalArrears)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-emerald-800 font-bold text-lg">
            Status Pembayaran
          </h3>
          <p className="text-emerald-600 text-sm">
            Terima kasih, tidak ada tunggakan s/d bulan ini.
          </p>
        </div>
        <div className="text-emerald-700 font-black text-xl">Lunas</div>
      </div>
    </div>
  );
};
