import { prisma } from "../config/database.js";

export interface ReportDateRange {
  from: Date;
  to: Date;
}

export interface ReportSummary {
  period: {
    from: string;
    to: string;
  };

  summary: {
    totalOrders: number;
    totalRevenue: number;
    totalPaid: number;
    totalOutstanding: number;
    averageOrderValue: number;
  };

  ordersByStatus: {
    status: string;
    count: number;
  }[];

  revenueByDate: {
    date: string;
    revenue: number;
    paid: number;
    orders: number;
  }[];

  topServices: {
    serviceId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

export async function getReportSummary(
  businessId: string,
  range: ReportDateRange,
): Promise<ReportSummary> {
  const orders = await prisma.order.findMany({
    where: {
      businessId,
      createdAt: {
        gte: range.from,
        lt: range.to,
      },
    },
    select: {
      status: true,
      total: true,
      paidAmount: true,
      createdAt: true,

      items: {
        select: {
          serviceId: true,
          quantity: true,
          subtotal: true,

          service: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  let totalRevenue = 0;
  let totalPaid = 0;

  const statusMap = new Map<string, number>();

  const dailyMap = new Map<
    string,
    {
      revenue: number;
      paid: number;
      orders: number;
    }
  >();

  const serviceMap = new Map<
    string,
    {
      name: string;
      quantity: number;
      revenue: number;
    }
  >();

  for (const order of orders) {
    const revenue = Number(order.total);
    const paid = Number(order.paidAmount);

    totalRevenue += revenue;
    totalPaid += paid;

    // -----------------------------
    // STATUS
    // -----------------------------

    statusMap.set(
      order.status,
      (statusMap.get(order.status) ?? 0) + 1,
    );

    // -----------------------------
    // REVENUE BY DATE
    // -----------------------------

    const date = order.createdAt
      .toISOString()
      .slice(0, 10);

    const daily = dailyMap.get(date) ?? {
      revenue: 0,
      paid: 0,
      orders: 0,
    };

    daily.revenue += revenue;
    daily.paid += paid;
    daily.orders += 1;

    dailyMap.set(date, daily);

    // -----------------------------
    // TOP SERVICES
    // -----------------------------

    for (const item of order.items) {
      if (!item.serviceId || !item.service) {
        continue;
      }

      const existing = serviceMap.get(item.serviceId);

      if (existing) {
        existing.quantity += Number(item.quantity);
        existing.revenue += Number(item.subtotal);
      } else {
        serviceMap.set(item.serviceId, {
          name: item.service.name,
          quantity: Number(item.quantity),
          revenue: Number(item.subtotal),
        });
      }
    }
  }

  const totalOrders = orders.length;

  const totalOutstanding = Math.max(
    totalRevenue - totalPaid,
    0,
  );

  const averageOrderValue =
    totalOrders > 0
      ? totalRevenue / totalOrders
      : 0;

  const ordersByStatus = Array.from(
    statusMap.entries(),
  )
    .map(([status, count]) => ({
      status,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const revenueByDate = Array.from(
    dailyMap.entries(),
  )
    .map(([date, value]) => ({
      date,
      revenue: value.revenue,
      paid: value.paid,
      orders: value.orders,
    }))
    .sort((a, b) =>
      a.date.localeCompare(b.date),
    );

  const topServices = Array.from(
    serviceMap.entries(),
  )
    .map(([serviceId, value]) => ({
      serviceId,
      name: value.name,
      quantity: value.quantity,
      revenue: value.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return {
    period: {
      from: range.from.toISOString(),
      to: range.to.toISOString(),
    },

    summary: {
      totalOrders,
      totalRevenue,
      totalPaid,
      totalOutstanding,
      averageOrderValue,
    },

    ordersByStatus,

    revenueByDate,

    topServices,
  };
}