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
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Reports</h2>
          <p>
            Monitor your laundry business performance.
          </p>
        </div>
      </div>

      <Card>
        <form
          className="form"
          onSubmit={handleSubmit}
        >
          <div className="form-row">
            <label>
              <span>From</span>

              <input
                type="date"
                value={from}
                onChange={(event) =>
                  setFrom(event.target.value)
                }
              />
            </label>

            <label>
              <span>To</span>

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
              className="ui-button"
            >
              {loading
                ? "Loading..."
                : "Apply"}
            </button>
          </div>
        </form>
      </Card>

      {loading && !report && (
        <Card>
          <EmptyState
            title="Loading report"
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
          <div className="stats">
            <div className="stat">
              <span>Total Orders</span>
              <strong>
                {formatNumber(
                  report.summary.totalOrders,
                )}
              </strong>
            </div>

            <div className="stat">
              <span>Total Revenue</span>
              <strong>
                {formatCurrency(
                  report.summary.totalRevenue,
                )}
              </strong>
            </div>

            <div className="stat">
              <span>Total Paid</span>
              <strong>
                {formatCurrency(
                  report.summary.totalPaid,
                )}
              </strong>
            </div>

            <div className="stat">
              <span>Outstanding</span>
              <strong>
                {formatCurrency(
                  report.summary.totalOutstanding,
                )}
              </strong>
            </div>

            <div className="stat">
              <span>Average Order</span>
              <strong>
                {formatCurrency(
                  report.summary.averageOrderValue,
                )}
              </strong>
            </div>
          </div>

          <section className="section">
            <div className="section-header">
              <div>
                <h3>Orders by Status</h3>
              </div>
            </div>

            <Card>
              {report.ordersByStatus.length === 0 ? (
                <EmptyState
                  title="No orders"
                  description="Tidak ada order pada periode ini."
                />
              ) : (
                <table className="ui-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Orders</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.ordersByStatus.map(
                      (item) => (
                        <tr key={item.status}>
                          <td>
                            {formatStatus(
                              item.status,
                            )}
                          </td>

                          <td>
                            {formatNumber(
                              item.count,
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              )}
            </Card>
          </section>

          <section className="section">
            <div className="section-header">
              <div>
                <h3>Revenue by Date</h3>
              </div>
            </div>

            <Card>
              {report.revenueByDate.length === 0 ? (
                <EmptyState
                  title="No revenue data"
                  description="Belum ada transaksi pada periode ini."
                />
              ) : (
                <table className="ui-table">
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
                            {formatNumber(
                              item.orders,
                            )}
                          </td>

                          <td>
                            {formatCurrency(
                              item.revenue,
                            )}
                          </td>

                          <td>
                            {formatCurrency(
                              item.paid,
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              )}
            </Card>
          </section>

          <section className="section">
            <div className="section-header">
              <div>
                <h3>Top Services</h3>
              </div>
            </div>

            <Card>
              {report.topServices.length === 0 ? (
                <EmptyState
                  title="No service data"
                  description="Belum ada service yang terjual pada periode ini."
                />
              ) : (
                <table className="ui-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Quantity</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.topServices.map(
                      (item) => (
                        <tr key={item.serviceId}>
                          <td>
                            {item.name}
                          </td>

                          <td>
                            {formatNumber(
                              item.quantity,
                            )}
                          </td>

                          <td>
                            {formatCurrency(
                              item.revenue,
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              )}
            </Card>
          </section>
        </>
      )}
    </section>
  );
}