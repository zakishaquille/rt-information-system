import { apiClient } from "@/api/client";
import type { GetPaymentMatrixResponse } from "./types";

export const getPaymentMatrix = async (
  year: number,
): Promise<GetPaymentMatrixResponse> => {
  const response = await apiClient.get(`payments/matrix?year=${year}`);
  return response.json();
};

export const recordPayment = async (data: {
  house_id: number;
  resident_id: number;
  due_type_rate_id: number;
  period_month: string;
  payment_date: string;
}) => {
  const response = await apiClient.post("payments", { json: data });
  return response.json();
};

export const recordAnnualPayment = async (data: {
  house_id: number;
  resident_id: number;
  due_type_rate_id: number;
  year: number;
  payment_date: string;
  notes: string;
}) => {
  const response = await apiClient.post("payments/annual", { json: data });
  return response.json();
};

export const deletePayment = async (paymentId: number) => {
  await apiClient.delete(`payments/${paymentId}`);
};
