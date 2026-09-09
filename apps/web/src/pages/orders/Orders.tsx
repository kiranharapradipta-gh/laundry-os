import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Pagination,
  Select,
  Table,
  type TableColumn,
} from "../../components/ui/";

import {
  getOrders,
} from "../../services/api/orders";

import type {
  Order,
  OrderStatus,
} from "../../types/order";

import {
  formatCurrency,
  formatDate,
} from "../../utils/format";

import {
  getOrderStatusLabel,
  getOrderStatusVariant,
  ORDER_STATUSES,
} from "../../utils/order";
import { useNavigate } from "react-router-dom";

// const LIMIT_OPTIONS = [
//   {
//     value: "5",
//     label: "5",
//   },
//   {
//     value: "10",
//     label: "10",
//   },
//   {
//     value: "20",
//     label: "20",
//   },
// ];

const STATUS_OPTIONS = [
  {
    value: "ALL",
    label: "Semua status",
  },
  ...ORDER_STATUSES.map((status) => ({
    value: status.value,
    label: status.label,
  })),
];

export function Orders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<OrderStatus | "ALL">("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getOrders({
        page,
        limit,
        search,
        status,
      });

      setOrders(result.data);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data orders.",
      );

      setOrders([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  function handleSearchSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleStatusChange(
    value: string,
  ) {
    setPage(1);
    setStatus(
      value as OrderStatus | "ALL",
    );
  }

  function handleLimitChange(
    nextLimit: number,
  ) {
    setPage(1);
    setLimit(nextLimit);
  }

  const columns: TableColumn<Order>[] = [
    {
      key: "orderNumber",
      label: "Order",
      render: (order) => (
        <button
          type="button"
          className="order-link"
          onClick={() => navigate(`/orders/${order.id}`)}
        >
          <strong>
            #{order.orderNumber}
          </strong>

          <span>
            {formatDate(order.createdAt)}
          </span>
        </button>
      ),
    },

    {
      key: "customer",
      label: "Pelanggan",
      render: (order) => (
        <div className="order-customer-cell">
          <strong>
            {order.customer?.name ?? "Tanpa nama"}
          </strong>

          {order.customer?.phone && (
            <span>
              {order.customer.phone}
            </span>
          )}
        </div>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (order) => (
        <Badge
          variant={getOrderStatusVariant(
            order.status,
          )}
        >
          {getOrderStatusLabel(
            order.status,
          )}
        </Badge>
      ),
    },

    {
      key: "items",
      label: "Item",
      render: (order) => (
        <span>
          {order.items?.length ?? 0} item
        </span>
      ),
    },

    {
      key: "total",
      label: "Total",
      render: (order) => (
        <strong>
          {formatCurrency(order.total)}
        </strong>
      ),
    },
  ];

  return (
    <div className="page orders-page">
      <div className="orders-container">
        {/* HEADER */}
        <section className="orders-hero">
          <div className="orders-hero-content">
            <span className="orders-eyebrow">ORDERS</span>

            <h1>Orders</h1>

            <p>
              Kelola pesanan laundry, pantau status, dan
              proses order dengan lebih mudah.
            </p>
          </div>

          <Button
            variant="primary"
            className="orders-primary-button"
            onClick={() => navigate("/orders/new")}
          >
            <span className="orders-button-icon">+</span>
            Order Baru
          </Button>
        </section>

        {/* TOOLBAR */}
        <Card className="orders-toolbar-card">
          <form
            className="orders-toolbar"
            onSubmit={handleSearchSubmit}
          >
            <div className="orders-search">
              <span className="orders-search-icon">⌕</span>

              <Input
                placeholder="Cari nomor order, nama, atau nomor HP..."
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(event.target.value)
                }
              />
            </div>

            <div className="orders-toolbar-actions">
              <Button
                type="submit"
                variant="secondary"
              >
                Cari
              </Button>

              <div className="orders-status-filter">
                <Select
                  label="Status"
                  value={status}
                  options={STATUS_OPTIONS}
                  onChange={(event) =>
                    handleStatusChange(event.target.value)
                  }
                />
              </div>
            </div>
          </form>
        </Card>

        {/* ERROR */}
        {error && (
          <Card className="orders-error-card">
            <div className="orders-error-content">
              <div className="orders-error-icon">!</div>

              <div>
                <strong>Gagal memuat orders</strong>
                <p>{error}</p>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => void loadOrders()}
            >
              Coba Lagi
            </Button>
          </Card>
        )}

        {/* SUMMARY */}
        <section className="orders-summary">
          <div className="orders-summary-item">
            <span>Total order</span>

            <strong>
              {loading ? "—" : total}
            </strong>
          </div>

          <div className="orders-summary-item">
            <span>Halaman</span>

            <strong>
              {loading
                ? "—"
                : `${page} / ${totalPages || 1}`}
            </strong>
          </div>

          {(search || status !== "ALL") && (
            <div className="orders-active-filter">
              <span>Filter aktif</span>

              {search && (
                <span className="orders-filter-chip">
                  “{search}”
                </span>
              )}

              {status !== "ALL" && (
                <span className="orders-filter-chip">
                  {STATUS_OPTIONS.find(
                    (option) => option.value === status
                  )?.label || status}
                </span>
              )}
            </div>
          )}
        </section>

        {/* TABLE */}
        <Card className="no-padding orders-table-card">
          <div className="orders-table-header">
            <div>
              <span className="orders-table-eyebrow">
                ORDER MANAGEMENT
              </span>

              <h2>Daftar Orders</h2>

              <p>
                Semua pesanan laundry yang terdaftar di bisnis kamu.
              </p>
            </div>

            <span className="orders-table-count">
              {loading
                ? "Memuat..."
                : `${orders.length} ditampilkan`}
            </span>
          </div>

          <div className="orders-table-wrapper">
            <Table
              columns={columns}
              data={orders}
              rowKey={(order) => order.id}
              loading={loading}
              empty={
                <EmptyState
                  title={
                    search || status !== "ALL"
                      ? "Order tidak ditemukan"
                      : "Belum ada order"
                  }
                  description={
                    search || status !== "ALL"
                      ? "Tidak ada order yang sesuai dengan filter."
                      : "Belum ada pesanan laundry."
                  }
                />
              }
            />
          </div>

          {!loading && totalPages > 0 && (
            <div className="orders-pagination">
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                limit={limit}
                onPageChange={setPage}
                onLimitChange={handleLimitChange}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}