import React from "react";
import { RateStatus } from "../types";
import type { DueTypeRate, RateStatusType } from "../types";
import { formatRp } from "@/utils/formatRp";

interface DueTypeRateHistoryProps {
  rates: DueTypeRate[];
  getRateStatus: (r: {
    effective_from: string;
    effective_to: string | null;
  }) => RateStatusType;
  onDeleteRate: (id: number) => void;
}

export const DueTypeRateHistory: React.FC<DueTypeRateHistoryProps> = ({
  rates,
  getRateStatus,
  onDeleteRate,
}) => {
  if (rates.length === 0) return null;

  return (
    <details className="mt-4">
      <summary className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700">
        Lihat histori tarif ({rates.length} record)
      </summary>
      <div className="mt-2 overflow-x-auto rounded-[10px] border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Jenis",
                "Nominal",
                "Berlaku Mulai",
                "Berlaku Sampai",
                "Status",
                "Aksi",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {rates.map((r) => {
              const status = getRateStatus(r);
              return (
                <tr key={r.id}>
                  <td className="px-4 py-2 text-sm capitalize text-gray-900">
                    {r.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {formatRp(r.amount)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {r.effective_from.slice(0, 10)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {r.effective_to ? r.effective_to.slice(0, 10) : "—"}
                  </td>
                  <td className="px-4 py-2">
                    {status === RateStatus.ACTIVE && (
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        Aktif
                      </span>
                    )}
                    {status === RateStatus.EXPIRED && (
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                        Expired
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right text-sm">
                    {status === RateStatus.ACTIVE && (
                      <button
                        type="button"
                        onClick={() => onDeleteRate(r.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
};
