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
      <div className="page-header">
        <div>
          <h2>Orders</h2>

          <p>
            Kelola semua pesanan laundry.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate("/orders/new")}
        >
          + Order Baru
        </Button>
      </div>

      <Card className="orders-toolbar">
        <form
          className="orders-search"
          onSubmit={handleSearchSubmit}
        >
          <Input
            placeholder="Cari nomor order, nama, atau nomor HP..."
            value={searchInput}
            onChange={(event) =>
              setSearchInput(
                event.target.value,
              )
            }
          />

          <Button
            type="submit"
            variant="secondary"
          >
            Cari
          </Button>
        </form>

        <div className="orders-filter">
          <Select
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(event) =>
              handleStatusChange(
                event.target.value,
              )
            }
          />
        </div>
      </Card>

      {error && (
        <Card className="orders-error">
          <div>
            <strong>
              Gagal memuat orders
            </strong>

            <p>{error}</p>
          </div>

          <Button
            variant="secondary"
            onClick={() => void loadOrders()}
          >
            Coba Lagi
          </Button>
        </Card>
      )}

      <Card className="orders-card">
        <div className="orders-card-header">
          <div>
            <h3>Daftar Orders</h3>

            <span>
              {total} total order
            </span>
          </div>
        </div>

        <Table
          columns={columns}
          data={orders}
          rowKey={(order) => order.id}
          loading={loading}
          empty={
            <EmptyState
              title="Belum ada order"
              description={
                search || status !== "ALL"
                  ? "Tidak ada order yang sesuai dengan filter."
                  : "Belum ada pesanan laundry."
              }
            />
          }
        />

        {!loading &&
          totalPages > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={
                handleLimitChange
              }
            />
          )}
      </Card>
    </div>
  );
}