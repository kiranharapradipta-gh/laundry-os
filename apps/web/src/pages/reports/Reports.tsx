import { useCallback, useEffect, useState } from "react";

import { Card, EmptyState } from "../../components/ui";
import {
  getReportSummary,
  type ReportSummary,
} from "../../services/api/reports";

function getCurrentMonthRange() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const lastDay = new Date(
    year,
    now.getMonth() + 1,
    0,
  ).getDate();

  return {
    from: `${year}-${month}-01`,
    to: `${year}-${month}-${String(lastDay).padStart(2, "0")}`,
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitialReportRange() {
    return getCurrentMonthRange();
  }

  const INITIAL_REPORT_RANGE =
    getInitialReportRange();

export function Reports() {
  // const initialRange = getCurrentMonthRange();

  // const [from, setFrom] = useState(initialRange.from);
  // const [to, setTo] = useState(initialRange.to);

  const [from, setFrom] = useState(
    INITIAL_REPORT_RANGE.from,
  );

  const [to, setTo] = useState(
    INITIAL_REPORT_RANGE.to,
  );

  const [report, setReport] =
    useState<ReportSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadReport = useCallback(
    async (
      rangeFrom: string,
      rangeTo: string,
    ) => {
      try {
        setLoading(true);
        setError(null);

        if (rangeFrom > rangeTo) {
          throw new Error(
            "Tanggal mulai tidak boleh lebih besar dari tanggal akhir.",
          );
        }

        const data = await getReportSummary({
          from: rangeFrom,
          to: rangeTo,
        });

        setReport(data);
      } catch (err) {
        console.error(
          "Failed to load report:",
          err,
        );

        setReport(null);

        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil laporan.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // useEffect(() => {
  //   void loadReport(
  //     initialRange.from,
  //     initialRange.to,
  //   );
  // }, [loadReport, initialRange.from, initialRange.to]);

  useEffect(() => {
    void loadReport(
      INITIAL_REPORT_RANGE.from,
      INITIAL_REPORT_RANGE.to,
    );
  }, [loadReport]);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    void loadReport(from, to);
  }

  return (
    <section className="page reports-page">
      <div className="reports-header">
        <div className="reports-title">
          <span className="reports-eyebrow">
            Business Analytics
          </span>

          <h1>Reports</h1>

          <p>
            Pantau performa bisnis laundry berdasarkan
            periode yang kamu pilih.
          </p>
        </div>
      </div>

      <Card className="reports-filter-card">
        <form
          className="reports-filter"
          onSubmit={handleSubmit}
        >
          <div className="reports-filter-heading">
            <div className="reports-filter-icon">
              ◷
            </div>

            <div>
              <strong>Periode Laporan</strong>
              <span>
                Pilih rentang tanggal untuk melihat performa.
              </span>
            </div>
          </div>

          <div className="reports-filter-fields">
            <label>
              <span>Dari</span>

              <input
                type="date"
                value={from}
                onChange={(event) =>
                  setFrom(event.target.value)
                }
              />
            </label>

            <span className="reports-date-separator">
              →
            </span>

            <label>
              <span>Sampai</span>

              <input
                type="date"
                value={to}
                onChange={(event) =>
                  setTo(event.target.value)
                }
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="ui-button reports-apply-button"
            >
              {loading ? "Memuat..." : "Terapkan"}
            </button>
          </div>
        </form>
      </Card>

      {loading && !report && (
        <Card className="reports-loading">
          <EmptyState
            title="Memuat laporan"
            description="Mengambil data laporan dari database..."
          />
        </Card>
      )}

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      {report && !loading && (
        <>
          {/* KPI */}

          <div className="reports-kpis">
            <Card className="report-kpi">
              <div className="report-kpi-icon orders">
                #
              </div>

              <div>
                <span>Total Orders</span>

                <strong>
                  {formatNumber(
                    report.summary.totalOrders,
                  )}
                </strong>
              </div>
            </Card>

            <Card className="report-kpi">
              <div className="report-kpi-icon revenue">
                Rp
              </div>

              <div>
                <span>Total Revenue</span>

                <strong>
                  {formatCurrency(
                    report.summary.totalRevenue,
                  )}
                </strong>
              </div>
            </Card>

            <Card className="report-kpi">
              <div className="report-kpi-icon paid">
                ✓
              </div>

              <div>
                <span>Total Paid</span>

                <strong>
                  {formatCurrency(
                    report.summary.totalPaid,
                  )}
                </strong>
              </div>
            </Card>

            <Card className="report-kpi">
              <div className="report-kpi-icon outstanding">
                !
              </div>

              <div>
                <span>Outstanding</span>

                <strong>
                  {formatCurrency(
                    report.summary.totalOutstanding,
                  )}
                </strong>
              </div>
            </Card>
          </div>

          {/* Secondary KPI */}

          <Card className="average-order-card">
            <div>
              <span>Average Order Value</span>

              <strong>
                {formatCurrency(
                  report.summary.averageOrderValue,
                )}
              </strong>
            </div>

            <span className="average-order-label">
              Rata-rata nilai setiap order
            </span>
          </Card>

          {/* Charts */}

          <div className="reports-chart-grid">
            <Card className="report-chart-card revenue-chart-card">
              <div className="report-section-header">
                <div>
                  <h3>Revenue Overview</h3>

                  <p>
                    Pendapatan berdasarkan tanggal.
                  </p>
                </div>

                <span className="report-chart-badge">
                  Revenue
                </span>
              </div>

              <div className="revenue-chart">
                {report.revenueByDate.length === 0 ? (
                  <EmptyState
                    title="Belum ada data"
                    description="Tidak ada revenue pada periode ini."
                  />
                ) : (
                  <div className="revenue-bars">
                    {report.revenueByDate.map((item) => {
                      const maxRevenue = Math.max(
                        ...report.revenueByDate.map(
                          (entry) => Number(entry.revenue),
                        ),
                        1,
                      );

                      const height =
                        (Number(item.revenue) /
                          maxRevenue) *
                        100;

                      return (
                        <div
                          className="revenue-bar-item"
                          key={item.date}
                        >
                          <div className="revenue-bar-value">
                            {formatCurrency(item.revenue)}
                          </div>

                          <div className="revenue-bar-track">
                            <div
                              className="revenue-bar"
                              style={{
                                height: `${Math.max(
                                  height,
                                  4,
                                )}%`,
                              }}
                            />
                          </div>

                          <span>
                            {formatDate(item.date)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>

            <Card className="report-chart-card">
              <div className="report-section-header">
                <div>
                  <h3>Orders by Status</h3>

                  <p>
                    Distribusi status order.
                  </p>
                </div>
              </div>

              {report.ordersByStatus.length === 0 ? (
                <EmptyState
                  title="Belum ada order"
                  description="Tidak ada order pada periode ini."
                />
              ) : (
                <div className="status-chart">
                  {report.ordersByStatus.map((item) => {
                    const totalOrders =
                      report.summary.totalOrders || 1;

                    const percentage =
                      (item.count / totalOrders) * 100;

                    return (
                      <div
                        className="status-chart-item"
                        key={item.status}
                      >
                        <div className="status-chart-label">
                          <span>
                            {formatStatus(item.status)}
                          </span>

                          <strong>
                            {formatNumber(item.count)}
                          </strong>
                        </div>

                        <div className="status-chart-track">
                          <div
                            className={`status-chart-bar status-${item.status.toLowerCase()}`}
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <small>
                          {percentage.toFixed(0)}%
                        </small>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Top Services */}

          <Card className="top-services-card">
            <div className="report-section-header">
              <div>
                <h3>Top Services</h3>

                <p>
                  Service dengan kontribusi revenue terbesar.
                </p>
              </div>
            </div>

            {report.topServices.length === 0 ? (
              <EmptyState
                title="Belum ada data service"
                description="Belum ada service yang terjual pada periode ini."
              />
            ) : (
              <div className="top-services-list">
                {report.topServices.map((item, index) => {
                  const maxRevenue = Math.max(
                    ...report.topServices.map(
                      (service) =>
                        Number(service.revenue),
                    ),
                    1,
                  );

                  const percentage =
                    (Number(item.revenue) /
                      maxRevenue) *
                    100;

                  return (
                    <div
                      className="top-service-item"
                      key={item.serviceId}
                    >
                      <div className="top-service-rank">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="top-service-info">
                        <div className="top-service-heading">
                          <strong>{item.name}</strong>

                          <span>
                            {formatNumber(item.quantity)} item
                          </span>
                        </div>

                        <div className="top-service-track">
                          <div
                            className="top-service-bar"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>

                      <strong className="top-service-revenue">
                        {formatCurrency(item.revenue)}
                      </strong>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Revenue Detail */}

          <Card className="report-table-card">
            <div className="report-section-header">
              <div>
                <h3>Revenue Detail</h3>

                <p>
                  Rincian order dan pembayaran berdasarkan tanggal.
                </p>
              </div>
            </div>

            {report.revenueByDate.length === 0 ? (
              <EmptyState
                title="Belum ada data"
                description="Belum ada transaksi pada periode ini."
              />
            ) : (
              <div className="report-table-wrapper">
                <table className="ui-table reports-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Orders</th>
                      <th>Revenue</th>
                      <th>Paid</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.revenueByDate.map(
                      (item) => (
                        <tr key={item.date}>
                          <td>
                            {formatDate(item.date)}
                          </td>

                          <td>
                            {formatNumber(item.orders)}
                          </td>

                          <td className="report-money">
                            {formatCurrency(item.revenue)}
                          </td>

                          <td className="report-money">
                            {formatCurrency(item.paid)}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </section>
  );
}