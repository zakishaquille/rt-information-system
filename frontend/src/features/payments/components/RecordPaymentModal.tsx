import { useState } from "react";
import { recordAnnualPayment, recordPayment, deletePayment } from "../api";
import type { PaymentDetail } from "../types";
import { toast } from "@/stores/useToastStore";
import { handleApiError } from "@/utils/apiErrorHelper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  houseId: number;
  residentId: number;
  houseCode: string;
  monthStr: string;
  year: number;
  details: PaymentDetail[];
}

export function RecordPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  houseId,
  residentId,
  houseCode,
  monthStr,
  year,
  details,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState<number | "all" | null>(null);

  if (!isOpen) return null;

  const period = `${year}-${monthStr}`;
  const unpaidDetails = details.filter((d) => !d.is_paid);

  const handlePay = async (rateId: number) => {
    try {
      setIsSubmitting(rateId);
      await recordPayment({
        house_id: houseId,
        resident_id: residentId,
        due_type_rate_id: rateId,
        period_month: period,
        payment_date: new Date().toISOString().split("T")[0],
      });

      toast.success("Pembayaran berhasil dicatat.");
      onSuccess();
    } catch (error) {
      toast.error(await handleApiError(error, "Gagal mencatat pembayaran."));
    } finally {
      setIsSubmitting(null);
    }
  };

  const handlePayAll = async () => {
    try {
      setIsSubmitting("all");
      const promises = unpaidDetails.map((detail) =>
        recordPayment({
          house_id: houseId,
          resident_id: residentId,
          due_type_rate_id: detail.due_type_rate_id,
          period_month: period,
          payment_date: new Date().toISOString().split("T")[0],
        }),
      );
      await Promise.all(promises);

      toast.success("Semua pembayaran berhasil dicatat.");
      onSuccess();
    } catch (error) {
      toast.error(
        await handleApiError(
          error,
          "Gagal mencatat pembayaran. Sebagian mungkin tidak tersimpan.",
        ),
      );
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleRevert = async (paymentId: number | null) => {
    if (!paymentId) return;

    if (
      !window.confirm(
        "Apakah Anda yakin ingin membatalkan pembayaran ini? Data iuran akan kembali menjadi belum dibayar.",
      )
    ) {
      return;
    }

    try {
      setIsSubmitting(paymentId); // re-use this state to disable the button
      await deletePayment(paymentId);
      toast.success("Pembayaran berhasil dibatalkan.");
      onSuccess();
    } catch (error) {
      toast.error(await handleApiError(error, "Gagal membatalkan pembayaran."));
    } finally {
      setIsSubmitting(null);
    }
  };

  const handlePayAnnual = async (rateId: number) => {
    if (
      !window.confirm(
        "Bayar 1 Tahun penuh untuk iuran ini? Transaksi ini akan mencatat pembayaran untuk bulan 1-12 tahun ini.",
      )
    ) {
      return;
    }

    try {
      setIsSubmitting(`annual-${rateId}` as unknown as number);

      await recordAnnualPayment({
        house_id: houseId,
        resident_id: residentId,
        due_type_rate_id: rateId,
        year: year,
        payment_date: new Date().toISOString().split("T")[0],
        notes: "Pembayaran 1 Tahun",
      });

      toast.success("Pembayaran 1 Tahun berhasil dicatat.");
      onSuccess();
    } catch (error) {
      toast.error(
        await handleApiError(error, "Gagal mencatat pembayaran 1 Tahun."),
      );
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Record Payment</h2>
            <p className="text-sm text-slate-500">
              Blok {houseCode} &bull; Periode {period}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {details.length === 0 ? (
            <p className="text-center text-sm text-slate-500">
              Tidak ada iuran aktif untuk periode ini.
            </p>
          ) : (
            details.map((detail) => (
              <div
                key={detail.due_type_rate_id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <div>
                  <h4 className="font-medium text-slate-800 capitalize">
                    {detail.name}
                  </h4>
                  <p className="text-sm font-semibold text-slate-600">
                    Rp {Number(detail.amount).toLocaleString("id-ID")}
                  </p>
                  {detail.is_paid && detail.payer_name && (
                    <p className="text-xs text-slate-500 mt-1">
                      Dibayar oleh:{" "}
                      <span className="font-medium text-slate-700">
                        {detail.payer_name}
                      </span>
                    </p>
                  )}
                </div>
                <div>
                  {detail.is_paid ? (
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="mt-1 text-xs text-slate-400">
                          {detail.payment_date}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                          Lunas
                        </span>
                      </div>
                      <button
                        onClick={() => handleRevert(detail.payment_id)}
                        disabled={isSubmitting === detail.payment_id}
                        className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => handlePay(detail.due_type_rate_id)}
                        disabled={isSubmitting !== null}
                        className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                      >
                        {isSubmitting === detail.due_type_rate_id
                          ? "Proses..."
                          : "Bayar"}
                      </button>
                      <button
                        onClick={() => handlePayAnnual(detail.due_type_rate_id)}
                        disabled={isSubmitting !== null}
                        className="w-full rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-200 disabled:opacity-50 transition-colors"
                      >
                        {isSubmitting ===
                        (`annual-${detail.due_type_rate_id}` as unknown as number)
                          ? "Proses..."
                          : "Bayar 1 Tahun"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 flex justify-between items-center">
          {unpaidDetails.length > 1 ? (
            <button
              onClick={handlePayAll}
              disabled={isSubmitting !== null}
              className="rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 transition-colors"
            >
              {isSubmitting === "all" ? "Memproses..." : "Bayar Semua"}
            </button>
          ) : (
            <div></div>
          )}

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
