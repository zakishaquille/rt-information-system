import { useState, useMemo } from "react";
import {
  type PaymentMatrixRow,
  PaymentStatus,
  type PaymentDetail,
} from "../types";
import { formatRp } from "@/utils/formatRp";

interface GenerateBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  matrix: PaymentMatrixRow[];
  year: number;
}

export function GenerateBillingModal({
  isOpen,
  onClose,
  matrix,
  year,
}: GenerateBillingModalProps) {
  const currentMonthStr = String(new Date().getMonth() + 1).padStart(2, "0");
  const [selectedMonthStr, setSelectedMonthStr] = useState(currentMonthStr);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const arrearsData = useMemo(() => {
    const results: {
      id: string;
      houseCode: string;
      residentName: string;
      amount: number;
      unpaidDetails: PaymentDetail[];
      url: string;
      text: string;
    }[] = [];

    const monthName = monthNames[parseInt(selectedMonthStr, 10) - 1];

    matrix.forEach((row) => {
      const cell = row.months[selectedMonthStr];
      if (
        cell &&
        (cell.status === PaymentStatus.UNPAID ||
          cell.status === PaymentStatus.PARTIAL)
      ) {
        const unpaidDetails = cell.details.filter((detail) => !detail.is_paid);
        const amount = unpaidDetails.reduce(
          (sum, detail) => sum + Number(detail.amount),
          0,
        );

        if (amount > 0) {
          const url = `${window.location.origin}/tagihan/${row.house_uuid}`;
          let text = `Blok ${row.house_code} - ${row.resident_name}\n`;
          text += `Periode: ${monthName} ${year}\n`;
          text += `Rincian Tunggakan:\n`;
          unpaidDetails.forEach((d) => {
            text += `- ${d.name}: ${formatRp(Number(d.amount))}\n`;
          });
          text += `Total: ${formatRp(amount)}\n`;
          text += `Link Tagihan: ${url}`;

          results.push({
            id: row.house_uuid,
            houseCode: row.house_code,
            residentName: row.resident_name,
            amount,
            unpaidDetails,
            url,
            text,
          });
        }
      }
    });

    return results;
  }, [matrix, selectedMonthStr, year]);

  const generatedText = useMemo(() => {
    const monthName = monthNames[parseInt(selectedMonthStr, 10) - 1];
    let text = `Tagihan Iuran RT - Bulan ${monthName} ${year}\n\n`;

    if (arrearsData.length === 0) {
      text += "Semua rumah sudah lunas untuk bulan ini.\n";
    } else {
      arrearsData.forEach((data) => {
        text += `${data.text}\n\n`;
      });
    }

    return text.trim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrearsData, selectedMonthStr, year]);

  const handleCopyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Gagal menyalin ke clipboard.");
    }
  };

  const handleCopyAll = () => handleCopyText(generatedText, "all");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">
            Generate Link Tagihan
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
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

        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Pilih Bulan
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {months.map((m, index) => {
                const monthNum = index + 1;
                const currentMonthNum = new Date().getMonth() + 1;
                const currentYearNum = new Date().getFullYear();
                const isFuture =
                  year > currentYearNum ||
                  (year === currentYearNum && monthNum > currentMonthNum);

                return (
                  <button
                    key={m}
                    disabled={isFuture}
                    onClick={() => setSelectedMonthStr(m)}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      selectedMonthStr === m
                        ? "bg-emerald-600 text-white shadow-sm"
                        : isFuture
                          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {monthNames[index].slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Hasil Generate ({arrearsData.length} tagihan)
              </label>
            </div>

            {arrearsData.length === 0 ? (
              <div className="rounded-lg border border-slate-200 p-8 text-center text-sm text-slate-500 bg-slate-50">
                Semua rumah sudah lunas untuk bulan ini.
              </div>
            ) : (
              <div className="space-y-3">
                {arrearsData.map((data) => (
                  <div
                    key={data.id}
                    className="rounded-lg border border-slate-200 p-4 bg-white shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          Blok {data.houseCode}{" "}
                          <span className="font-normal text-slate-500">
                            - {data.residentName}
                          </span>
                        </h3>
                        <p className="text-sm text-rose-600 font-medium mt-1">
                          Tunggakan: {formatRp(data.amount)}
                        </p>
                        <ul className="mt-1.5 space-y-0.5">
                          {data.unpaidDetails.map((detail) => (
                            <li
                              key={detail.due_type_rate_id}
                              className="text-xs text-slate-500"
                            >
                              - {detail.name}: {formatRp(Number(detail.amount))}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={data.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Buka
                        </a>
                        <button
                          onClick={() => handleCopyText(data.text, data.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white rounded border border-slate-300 hover:bg-slate-50 transition-colors"
                        >
                          {copiedId === data.id ? (
                            <>
                              <svg
                                className="w-3.5 h-3.5 text-emerald-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Tersalin
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                />
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 shrink-0 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Tutup
          </button>
          <button
            onClick={handleCopyAll}
            disabled={arrearsData.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg shadow-sm hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copiedId === "all" ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Tersalin Semua!
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                Copy Semua Tagihan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
