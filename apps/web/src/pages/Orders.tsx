import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getOrders,
  type Order,
} from "../api/client";

interface OrdersProps {
  onOpenOrder?: (order: Order) => void;
}

const statusLabels: Record<
  Order["status"],
  string
> = {
  RECEIVED: "Diterima",
  WASHING: "Dicuci",
  DRYING: "Dikeringkan",
  IRONING: "Disetrika",
  READY: "Siap Diambil",
  PICKED_UP: "Selesai",
  CANCELLED: "Dibatalkan",
};

function formatRupiah(
  value: number | string
) {
  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }
  ).format(Number(value));
}

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

export default function Orders({
  onOpenOrder,
}: OrdersProps) {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | Order["status"]>(
      "ALL"
    );

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getOrders();

        setOrders(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data order"
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const filteredOrders =
    useMemo(() => {
      const keyword =
        search.trim().toLowerCase();

      return orders.filter((order) => {
        const matchesSearch =
          !keyword ||
          order.orderNumber
            .toLowerCase()
            .includes(keyword) ||
          order.customer.name
            .toLowerCase()
            .includes(keyword) ||
          (
            order.customer.nickname ?? ""
          )
            .toLowerCase()
            .includes(keyword) ||
          order.customer.phone
            .includes(keyword);

        const matchesStatus =
          statusFilter === "ALL" ||
          order.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      });
    }, [
      orders,
      search,
      statusFilter,
    ]);

  return (
    <main className="orders-page">
      <header className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>
            Kelola semua pesanan laundry.
          </p>
        </div>

        <div className="orders-count">
          {filteredOrders.length} order
        </div>
      </header>

      <section className="orders-toolbar">
        <input
          type="search"
          placeholder="Cari nomor order, customer, atau nomor HP..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as
                | "ALL"
                | Order["status"]
            )
          }
        >
          <option value="ALL">
            Semua Status
          </option>

          {Object.entries(
            statusLabels
          ).map(
            ([status, label]) => (
              <option
                key={status}
                value={status}
              >
                {label}
              </option>
            )
          )}
        </select>
      </section>

      {loading && (
        <section className="orders-state">
          <div className="spinner" />
          <p>
            Memuat order...
          </p>
        </section>
      )}

      {!loading && error && (
        <section className="orders-state orders-error">

          <div className="customers-state-icon">
            ⚠️
          </div>

          <strong>
            Gagal memuat order
          </strong>

          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Coba Lagi
          </button>
        </section>
      )}

      {!loading &&
        !error &&
        filteredOrders.length === 0 && (
          <section className="orders-state">
            <div className="orders-empty-icon">
              📦
            </div>

            <strong>
              Tidak ada order
            </strong>

            <p>
              Belum ada order yang
              sesuai dengan pencarian
              atau filter.
            </p>
          </section>
        )}

      {!loading &&
        !error &&
        filteredOrders.length > 0 && (
          <section className="orders-list">
            {filteredOrders.map(
              (order) => {
                const customerName =
                  order.customer
                    .nickname ||
                  order.customer.name;

                return (
                  <button
                    type="button"
                    className="order-card"
                    key={order.id}
                    onClick={() =>
                      onOpenOrder?.(
                        order
                      )
                    }
                  >
                    <div className="order-card-top">
                      <div>
                        <strong>
                          {
                            order.orderNumber
                          }
                        </strong>

                        <span>
                          {formatDate(
                            order.createdAt
                          )}
                        </span>
                      </div>

                      <span
                        className={`order-status status-${order.status.toLowerCase()}`}
                      >
                        {
                          statusLabels[
                            order.status
                          ]
                        }
                      </span>
                    </div>

                    <div className="order-card-customer">
                      <div className="customer-avatar">
                        {customerName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {customerName}
                        </strong>

                        <span>
                          {
                            order.customer
                              .phone
                          }
                        </span>
                      </div>
                    </div>

                    <div className="order-card-bottom">
                      <span>
                        {order.items.length}{" "}
                        item
                        {order.items.length !==
                        1
                          ? "s"
                          : ""}
                      </span>

                      <strong>
                        {formatRupiah(
                          order.total
                        )}
                      </strong>
                    </div>
                  </button>
                );
              }
            )}
          </section>
        )}
    </main>
  );
}