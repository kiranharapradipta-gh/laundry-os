import { apiClient } from "./client";

export interface ReportPeriod {
  from: string;
  to: string;
}

export interface ReportSummaryData {
  totalOrders: number;
  totalRevenue: number;
  totalPaid: number;
  totalOutstanding: number;
  averageOrderValue: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
}

export interface RevenueByDate {
  date: string;
  revenue: number;
  paid: number;
  orders: number;
}

export interface TopService {
  serviceId: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface ReportSummary {
  period: ReportPeriod;
  summary: ReportSummaryData;
  ordersByStatus: OrdersByStatus[];
  revenueByDate: RevenueByDate[];
  topServices: TopService[];
}

interface GetReportSummaryResponse {
  success: boolean;
  data: ReportSummary;
  message?: string;
}

export interface GetReportSummaryParams {
  from: string;
  to: string;
}

export async function getReportSummary(
  params: GetReportSummaryParams,
): Promise<ReportSummary> {
  const query = new URLSearchParams({
    from: params.from,
    to: params.to,
  });

  const response =
    await apiClient<GetReportSummaryResponse>(
      `/reports/summary?${query.toString()}`,
    );

  return response.data;
}