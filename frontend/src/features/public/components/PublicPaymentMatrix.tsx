import { formatRp } from "@/utils/formatRp";
import { PaymentStatus } from "@/features/payments";
import type { PublicMonthStatus } from "../types";

interface PublicPaymentMatrixProps {
  paymentMatrix: Record<string, PublicMonthStatus>;
}

export const PublicPaymentMatrix = ({
  paymentMatrix,
}: PublicPaymentMatrixProps) => {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
        Rincian Tagihan & Riwayat ({new Date().getFullYear()})
      </h2>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Periode
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
              >
                Detail Tagihan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total Tagihan
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(paymentMatrix)
              .filter(([monthStr, data]) => {
                if (data.details.length === 0) return false;
                const monthInt = parseInt(monthStr, 10);
                const currentMonth = new Date().getMonth() + 1;
                if (monthInt <= currentMonth) return true;
                return (
                  data.status === PaymentStatus.PAID ||
                  data.status === PaymentStatus.PARTIAL
                );
              })
              .sort(
                ([monthA], [monthB]) =>
                  parseInt(monthB, 10) - parseInt(monthA, 10)
              )
              .map(([monthStr, data]) => {
                const monthInt = parseInt(monthStr, 10);
                const currentYear = new Date().getFullYear();
                const monthName = new Date(
                  currentYear,
                  monthInt - 1,
                  1
                ).toLocaleString("id-ID", {
                  month: "long",
                  year: "numeric",
                });

                const totalAmount = data.details.reduce(
                  (sum, d) => sum + parseFloat(d.amount),
                  0
                );

                return (
                  <tr
                    key={monthStr}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 align-top">
                      {monthName}
                      {/* Mobile view for details */}
                      <div className="sm:hidden mt-2 font-normal text-gray-500 space-y-1">
                        {data.details.map((d, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-xs border-t border-gray-100 pt-1 mt-1"
                          >
                            <span>{d.name}</span>
                            <span
                              className={
                                d.is_paid
                                  ? "text-emerald-600 font-medium"
                                  : "text-red-600 font-medium"
                              }
                            >
                              {d.is_paid ? "✓ Lunas" : "✗ Belum"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 align-top hidden sm:table-cell">
                      <ul className="space-y-1">
                        {data.details.map((d, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center gap-4"
                          >
                            <span>{d.name}</span>
                            <span
                              className={
                                d.is_paid
                                  ? "text-emerald-600 font-medium text-xs bg-emerald-50 px-2 py-0.5 rounded"
                                  : "text-red-600 font-medium text-xs bg-red-50 px-2 py-0.5 rounded"
                              }
                            >
                              {formatRp(d.amount)}{" "}
                              {d.is_paid ? "(Lunas)" : "(Belum)"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold text-right align-top">
                      {formatRp(totalAmount.toString())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center align-top">
                      {data.status === PaymentStatus.PAID && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          LUNAS
                        </span>
                      )}
                      {data.status === PaymentStatus.UNPAID && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                          BELUM BAYAR
                        </span>
                      )}
                      {data.status === PaymentStatus.PARTIAL && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          SEBAGIAN
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            {Object.values(paymentMatrix).every(
              (data) => data.details.length === 0
            ) && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  Belum ada tagihan aktif untuk tahun ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
