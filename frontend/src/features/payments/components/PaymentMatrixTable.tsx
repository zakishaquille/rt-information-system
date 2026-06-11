import { useState } from "react";
import { RecordPaymentModal } from "./RecordPaymentModal";
import { PaymentStatus, type PaymentDetail, type PaymentMatrixRow } from "../types";
import { formatRp } from "@/utils/formatRp";

export function PaymentMatrixTable({
  year,
  searchQuery = "",
  matrix,
  isLoading,
  refetch,
}: {
  year: number;
  searchQuery?: string;
  matrix: PaymentMatrixRow[];
  isLoading: boolean;
  refetch: () => void;
}) {
  const [selectedCellId, setSelectedCellId] = useState<{
    houseId: number;
    monthStr: string;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">Loading matrix...</div>
    );
  }

  const filteredMatrix = matrix.filter((row) => {
    const q = searchQuery.toLowerCase();
    return (
      row.house_code.toLowerCase().includes(q) ||
      row.resident_name.toLowerCase().includes(q)
    );
  });

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case PaymentStatus.PAID:
        return "bg-emerald-100 text-emerald-800 ring-emerald-500/20";
      case PaymentStatus.PARTIAL:
        return "bg-amber-100 text-amber-800 ring-amber-500/20";
      case PaymentStatus.UNPAID:
        return "bg-rose-100 text-rose-800 ring-rose-500/20";
      case PaymentStatus.NA:
        return "bg-slate-50 text-slate-400 ring-slate-500/10";
      default:
        return "bg-slate-100 text-slate-800 ring-slate-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case PaymentStatus.PAID:
        return "Lunas";
      case PaymentStatus.PARTIAL:
        return "Sebagian";
      case PaymentStatus.UNPAID:
        return "Belum";
      case PaymentStatus.NA:
        return "-";
      default:
        return status;
    }
  };

  const getMonthTotal = (monthStr: string) => {
    return filteredMatrix.reduce((total, row) => {
      const cell = row.months[monthStr];
      if (cell && cell.details) {
        return (
          total +
          cell.details.reduce((sum, detail) => {
            return detail.is_paid ? sum + Number(detail.amount) : sum;
          }, 0)
        );
      }
      return total;
    }, 0);
  };

  // Derive selected cell details from the latest data
  let selectedCellDetails: PaymentDetail[] = [];
  let selectedHouseCode = "";
  let selectedResidentId = 0;
  if (selectedCellId) {
    const row = matrix.find((r) => r.house_id === selectedCellId.houseId);
    if (row) {
      selectedHouseCode = row.house_code;
      selectedResidentId = row.resident_id;
      const cell = row.months[selectedCellId.monthStr];
      if (cell) {
        selectedCellDetails = cell.details;
      }
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-800">
            <tr>
              <td className="p-4 sticky left-0 bg-slate-50 shadow-[1px_0_0_0_#e2e8f0] text-left text-xs uppercase tracking-wider">
                Total Pemasukan Iuran:
              </td>
              {months.map((m) => (
                <td
                  key={m}
                  className="p-3 text-center text-xs whitespace-nowrap text-emerald-700"
                >
                  {formatRp(getMonthTotal(m))}
                </td>
              ))}
            </tr>
          </thead>
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-800">
            <tr>
              <th className="p-4 font-semibold whitespace-nowrap min-w-50 sticky left-0 bg-slate-50 z-10 shadow-[1px_0_0_0_#e2e8f0]">
                Rumah / Warga
              </th>
              {months.map((m) => (
                <th key={m} className="p-4 font-semibold text-center">
                  {m}/{year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMatrix.length === 0 ? (
              <tr>
                <td colSpan={13} className="p-8 text-center text-slate-500">
                  Tidak ada data hunian aktif.
                </td>
              </tr>
            ) : (
              filteredMatrix.map((row) => (
                <tr
                  key={row.house_id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-4 sticky left-0 bg-white shadow-[1px_0_0_0_#f1f5f9] group-hover:bg-slate-50/50">
                    <div className="font-medium text-slate-800">
                      Blok {row.house_code}
                    </div>
                    <div className="text-xs text-slate-500">
                      {row.resident_name}
                    </div>
                  </td>
                  {months.map((m) => {
                    const cell = row.months[m];
                    const isNA = cell.status === "NA";
                    return (
                      <td key={m} className="p-3 text-center">
                        <button
                          disabled={isNA}
                          onClick={() =>
                            setSelectedCellId({
                              houseId: row.house_id,
                              monthStr: m,
                            })
                          }
                          className={`inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition-colors ${getStatusColor(cell.status)} ${!isNA ? "hover:brightness-95 cursor-pointer" : "cursor-not-allowed"}`}
                        >
                          {getStatusLabel(cell.status)}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedCellId && (
        <RecordPaymentModal
          isOpen={true}
          onClose={() => setSelectedCellId(null)}
          onSuccess={() => {
            refetch();
            // Don't close modal on success, so the user can see it updated or pay another item
          }}
          houseId={selectedCellId.houseId}
          residentId={selectedResidentId}
          houseCode={selectedHouseCode}
          monthStr={selectedCellId.monthStr}
          year={year}
          details={selectedCellDetails}
        />
      )}
    </div>
  );
}
