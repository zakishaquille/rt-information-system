export const RateStatus = {
  ACTIVE: "active",
  EXPIRED: "expired",
} as const;

export type RateStatusType = (typeof RateStatus)[keyof typeof RateStatus];

export const CategoryType = {
  EXPENSE: "expense",
  INCOME: "income",
} as const;

export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];

export interface DueTypeRate {
  id: number;
  name: string;
  amount: string; // decimal comes as string from Laravel
  effective_from: string;
  effective_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface DueTypeRateInput {
  name: string;
  amount: number;
}

export interface TransactionCategory {
  id: number;
  type: CategoryType;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionCategoryInput {
  type: CategoryType;
  name: string;
}

export interface UpdateTransactionCategoryInput {
  name: string;
}
