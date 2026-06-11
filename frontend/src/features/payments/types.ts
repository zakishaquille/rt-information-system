export interface PaymentDetail {
  payment_id: number | null;
  due_type_rate_id: number;
  name: string;
  amount: number;
  is_paid: boolean;
  payment_date: string | null;
  payer_name: string | null;
}

export const PaymentStatus = {
  PAID: "PAID",
  PARTIAL: "PARTIAL",
  UNPAID: "UNPAID",
  NA: "NA",
} as const;

export type PaymentStatusInterface =
  (typeof PaymentStatus)[keyof typeof PaymentStatus];

export interface PaymentMonth {
  status: PaymentStatusInterface;
  details: PaymentDetail[];
}

export interface PaymentMatrixRow {
  house_id: number;
  house_uuid: string;
  resident_id: number;
  house_code: string;
  resident_name: string;
  months: Record<string, PaymentMonth>;
}

export interface GetPaymentMatrixResponse {
  data: PaymentMatrixRow[];
}

export interface RecordPaymentPayload {
  house_id: number;
  resident_id: number;
  due_type_rate_id: number;
  period_month: string;
  payment_date: string;
  notes?: string;
}

export interface RecordAnnualPaymentPayload {
  house_id: number;
  resident_id: number;
  due_type_rate_id: number;
  year: number;
  payment_date: string;
  notes?: string;
}

export interface Payment {
  id: number;
  house_id: number;
  resident_id: number;
  due_type_rate_id: number;
  amount: number;
  period_month: string;
  payment_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  resident?: {
    id: number;
    full_name: string;
  };
  due_type_rate?: {
    id: number;
    name: string;
  };
}

export interface RecordPaymentResponse {
  data: Payment;
}
