import type { PaymentStatusInterface } from "../payments";

export interface PublicPaymentDetail {
  due_type_rate_id: number;
  name: string;
  amount: string;
  is_paid: boolean;
  payment_date: string | null;
  payer_name: string | null;
}

export interface PublicMonthStatus {
  status: PaymentStatusInterface;
  details: PublicPaymentDetail[];
}

export interface PublicHouse {
  uuid: string;
  code: string;
  address: string;
  status: string;
  pic_name: string | null;
  total_arrears: string;
  payment_matrix: Record<string, PublicMonthStatus>;
}
