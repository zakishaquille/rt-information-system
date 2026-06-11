import React from "react";
import type { Transaction } from "@/features/transactions";
import { TransactionCategoryTypeEnum } from "@/features/configurations";

interface Props {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export const TransactionsList: React.FC<Props> = ({
  transactions,
  onEdit,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Memuat data transaksi...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
        Belum ada data transaksi.
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Tanggal
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Tipe
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Kategori
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Nama
            </th>
            <th className="px-6 py-3 text-right font-medium text-gray-500">
              Nominal
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500">
              Catatan
            </th>
            <th className="px-6 py-3 text-right font-medium text-gray-500">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {transactions.map((trx) => (
            <tr key={trx.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date(trx.date))}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                    trx.type === TransactionCategoryTypeEnum.INCOME
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {trx.type === TransactionCategoryTypeEnum.INCOME
                    ? "Pemasukan"
                    : "Pengeluaran"}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {trx.category?.name || "-"}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">
                {trx.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right font-medium">
                {formatCurrency(trx.amount)}
              </td>
              <td className="px-6 py-4 text-gray-500">{trx.note || "-"}</td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <button
                  className="mr-4 text-blue-600 hover:text-blue-900 transition-colors"
                  onClick={() => onEdit(trx)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-900 transition-colors"
                  onClick={() => onDelete(trx.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
