import { publicClient } from "@/api/client";
import type { PublicHouse, PublicReportSummary, PublicMonthBreakdown } from "./types";

export const getPublicHouse = async (uuid: string): Promise<PublicHouse> => {
  const response = await publicClient
    .get(`houses/${uuid}`)
    .json<{ data: PublicHouse }>();
  return response.data;
};

export const getPublicReport = async (): Promise<PublicReportSummary> => {
  const response = await publicClient
    .get('reports')
    .json<{ data: PublicReportSummary }>();
  return response.data;
};

export const getPublicMonthBreakdown = async (month: string): Promise<PublicMonthBreakdown> => {
  const response = await publicClient
    .get(`reports/breakdown?month=${month}`)
    .json<{ data: PublicMonthBreakdown }>();
  return response.data;
};
