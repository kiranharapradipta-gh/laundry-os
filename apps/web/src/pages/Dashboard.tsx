import "../styles/dashboard.css"

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getOrders } from "../api/orders.api";
import type { Order } from "../types/order";

import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";

import {
  formatRupiah,
  formatDateTime,
} from "../utils/format";

import {
  ORDER_STATUS_CLASS,
  ORDER_STATUS_LABEL,
} from "../utils/order";

export default function Dashboard() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await getOrders();

        setOrders(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data order.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const stats = useMemo(() => {
    const active = orders.filter(
      (order) =>
        order.status !== "PICKED_UP" &&
        order.status !== "CANCELLED",
    );

    const ready = orders.filter(
      (order) => order.status === "READY",
    );

    const revenue = orders
      .filter(
        (order) =>
          order.status !== "CANCELLED",
      )
      .reduce(
        (total, order) =>
          total + Number(order.total || 0),
        0,
      );

    const unpaid = orders.filter(
      (order) =>
        order.paymentStatus !== "PAID",
    );

    return {
      total: orders.length,
      active: active.length,
      ready: ready.length,
      revenue,
      unpaid: unpaid.length,
    };
  }, [orders]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        )
        .slice(0, 6),
    [orders],
  );

  if (loading) {
    return (
      <div className="page-loading">
        <Spinner size="large" />
        <span>Memuat dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-error">
        <h3>Gagal memuat dashboard</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <section className="welcome-section">
        <div>
          <span className="eyebrow">
            OVERVIEW
          </span>

          <h2>
            Ringkasan laundry hari ini
          </h2>

          <p>
            Pantau order dan operasional laundry
            kamu dari satu tempat.
          </p>
        </div>

        <Link
          to="/orders"
          className="primary-button"
        >
          Lihat Orders
        </Link>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            ▣
          </div>

          <div>
            <span>Total Orders</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            ◷
          </div>

          <div>
            <span>Sedang Diproses</span>
            <strong>{stats.active}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            ✓
          </div>

          <div>
            <span>Siap Diambil</span>
            <strong>{stats.ready}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            Rp
          </div>

          <div>
            <span>Total Nilai Order</span>
            <strong>
              {formatRupiah(stats.revenue)}
            </strong>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Order Terbaru</h3>
              <p>
                Order terakhir yang masuk.
              </p>
            </div>

            <Link to="/orders">
              Lihat semua
            </Link>
          </div>

          <div className="order-list">
            {recentOrders.length === 0 ? (
              <div className="panel-empty">
                Belum ada order.
              </div>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders?id=${order.id}`}
                  className="order-row"
                >
                  <div className="order-row-main">
                    <strong>
                      {order.orderNumber}
                    </strong>

                    <span>
                      {order.customer?.name ||
                        "Customer"}
                    </span>
                  </div>

                  <div className="order-row-right">
                    <strong>
                      {formatRupiah(
                        order.total,
                      )}
                    </strong>

                    <Badge
                      className={
                        ORDER_STATUS_CLASS[
                          order.status
                        ]
                      }
                    >
                      {
                        ORDER_STATUS_LABEL[
                          order.status
                        ]
                      }
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Pembayaran</h3>
              <p>
                Status pembayaran order.
              </p>
            </div>
          </div>

          <div className="payment-summary">
            <div>
              <span>Belum lunas</span>
              <strong>
                {stats.unpaid}
              </strong>
            </div>

            <div>
              <span>Total order</span>
              <strong>
                {stats.total}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Aktivitas Terbaru</h3>
            <p>
              Aktivitas berdasarkan order terakhir.
            </p>
          </div>
        </div>

        <div className="activity-list">
          {recentOrders.map((order) => (
            <div
              className="activity-item"
              key={order.id}
            >
              <div className="activity-dot" />

              <div>
                <strong>
                  {order.orderNumber}
                </strong>

                <span>
                  {ORDER_STATUS_LABEL[
                    order.status
                  ]}{" "}
                  •{" "}
                  {formatDateTime(
                    order.createdAt,
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}