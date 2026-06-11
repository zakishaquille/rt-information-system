export interface DashboardStats {
  total_balance: number;
  current_month: {
    income: number;
    expense: number;
  };
  house_occupancy: {
    occupied: number;
    empty: number;
    total: number;
  };
  chart_data: Array<{
    month: string;
    income: number;
    expense: number;
    balance: number;
  }>;
}
