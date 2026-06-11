import React from 'react';
import type { TransactionCategory } from '../types';

interface TransactionCategoryListProps {
  title: string;
  categories: TransactionCategory[];
  color: 'red' | 'green';
  onEdit: (cat: TransactionCategory) => void;
  onDelete: (id: number) => void;
}

export const TransactionCategoryList: React.FC<TransactionCategoryListProps> = ({
  title,
  categories,
  color,
  onEdit,
  onDelete,
}) => {
  const isRed = color === 'red';
  const headerTextColor = isRed ? 'text-red-700' : 'text-green-700';
  const dotColor = isRed ? 'bg-red-500' : 'bg-green-500';

  return (
    <div>
      <h4 className={`mb-2 flex items-center gap-1.5 text-sm font-semibold ${headerTextColor}`}>
        <span className={`inline-block h-2 w-2 rounded-full ${dotColor}`} />
        {title}
      </h4>
      <ul className="space-y-1" role="list" aria-label={`Daftar kategori ${title.toLowerCase()}`}>
        {categories.length === 0 && (
          <li className="text-sm italic text-gray-400">Belum ada kategori</li>
        )}
        {categories.map((cat) => (
          <li key={cat.id} className="flex items-center justify-between rounded-[10px] border border-gray-200 bg-white px-3 py-2">
            <span className="text-sm text-gray-800">{cat.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(cat)}
                className="text-xs text-indigo-600 hover:text-indigo-900"
                aria-label={`Edit kategori ${cat.name}`}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(cat.id)}
                className="text-xs text-red-500 hover:text-red-800"
                aria-label={`Hapus kategori ${cat.name}`}
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
