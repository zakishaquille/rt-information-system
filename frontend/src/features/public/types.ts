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

export interface ChartData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface PublicReportSummary {
  total_balance: number;
  chart_data: ChartData[];
}

export interface BreakdownItem {
  name: string;
  total: number;
}

export interface PublicMonthBreakdown {
  month: string;
  income: {
    dues: BreakdownItem[];
    other: BreakdownItem[];
    total: number;
  };
  expense: {
    categories: BreakdownItem[];
    total: number;
  };
}
