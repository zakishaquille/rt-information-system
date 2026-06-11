import type {
  TransactionCategory,
  TransactionCategoryType,
} from "@/features/configurations";

export interface Transaction {
  id: number;
  transaction_category_id: number;
  type: TransactionCategoryType;
  date: string;
  amount: number;
  name: string;
  note: string | null;
  category?: TransactionCategory;
  created_at: string;
  updated_at: string;
}

export interface TransactionPayload {
  transaction_category_id: number;
  date: string;
  amount: number;
  name: string;
  note?: string;
}
