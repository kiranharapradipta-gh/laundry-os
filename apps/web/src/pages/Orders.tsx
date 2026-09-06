import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";

import { getOrders, createOrder, updateOrderStatus } from "../api/orders.api";
import { getCustomers } from "../api/customers.api";
import { getServices } from "../api/services.api";

import type { Order, OrderStatus, CreateOrderInput } from "../types/order";
import type { Customer } from "../types/customer";
import type { LaundryService } from "../types/service";
import type { StorageLocation } from "../types/storage";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_FLOW,
} from "../utils/order";
import { formatRupiah } from "../utils/format";

import "../styles/orders.css";
import { getStorageLocations } from "../api/storage.api";
import OrderTable from "../components/ui/orders/OrderTable";
import OrderModal from "../components/ui/orders/OrderModal";
import OrderDetail from "../components/ui/orders/OrderDetail";

const PAGE_SIZES = [5, 10, 20];

type StatusFilter = "ALL" | OrderStatus;

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<LaundryService[]>([]);
  const [storageLocations, setStorageLocations] = useState<
    StorageLocation[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    null,
  );

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [
        ordersData,
        customersData,
        servicesData,
        storageData,
      ] = await Promise.all([
        getOrders(),
        getCustomers(),
        getServices(),
        getStorageLocations(),
      ]);

      setOrders(ordersData);
      setCustomers(customersData);
      setServices(servicesData);
      setStorageLocations(storageData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data orders.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    const orderId = searchParams.get("id");

    if (!orderId) {
      setSelectedOrder(null);
      return;
    }

    const localOrder = orders.find(
      (order) => order.id === orderId,
    );

    if (localOrder) {
      setSelectedOrder(localOrder);
    }
  }, [searchParams, orders]);

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return [...orders]
      .filter((order) => {
        if (status === "ALL") return true;

        return order.status === status;
      })
      .filter((order) => {
        if (!keyword) return true;

        const orderNumber =
          order.orderNumber?.toLowerCase() || "";

        const customerName =
          order.customer?.name?.toLowerCase() || "";

        const customerPhone =
          order.customer?.phone?.toLowerCase() || "";

        return (
          orderNumber.includes(keyword) ||
          customerName.includes(keyword) ||
          customerPhone.includes(keyword)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );
  }, [orders, search, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / pageSize),
  );

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const stats = useMemo(() => {
    const active = orders.filter(
      (order) =>
        !["PICKED_UP", "CANCELLED"].includes(order.status),
    );

    const ready = orders.filter(
      (order) => order.status === "READY",
    );

    const revenue = orders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0,
    );

    const unpaid = orders.filter(
      (order) => order.paymentStatus !== "PAID",
    );

    return {
      total: orders.length,
      active: active.length,
      ready: ready.length,
      revenue,
      unpaid: unpaid.length,
    };
  }, [orders]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatus(value: StatusFilter) {
    setStatus(value);
    setPage(1);
  }

  function handlePageSize(value: number) {
    setPageSize(value);
    setPage(1);
  }

  function openOrder(order: Order) {
    setSelectedOrder(order);

    setSearchParams({
      id: order.id,
    });
  }

  function closeOrder() {
    setSelectedOrder(null);
    setSearchParams({});
  }

  async function handleCreateOrder(
    input: CreateOrderInput,
  ) {
    setCreateLoading(true);

    try {
      const created = await createOrder(input);

      setOrders((current) => [created, ...current]);
      setShowCreateModal(false);
      setPage(1);

      openOrder(created);
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleStatusUpdate(
    orderId: string,
    nextStatus: OrderStatus,
    note?: string,
  ) {
    const updated = await updateOrderStatus(orderId, {
      status: nextStatus,
      note,
    });

    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? updated : order,
      ),
    );

    setSelectedOrder(updated);
  }

  return (
    <div className="orders-page">
      <div className="page-heading">
        <div>
          <div className="breadcrumb">
            Dashboard <span>/</span> Orders
          </div>

          <h1>Orders</h1>

          <p>
            Kelola pesanan laundry, status pengerjaan, dan
            pembayaran.
          </p>
        </div>

        <button
          type="button"
          className="button button-primary button-create-order"
          onClick={() => setShowCreateModal(true)}
        >
          <span>+</span>
          Buat Order
        </button>
      </div>

      <div className="orders-stat-grid">
        <div className="order-stat-card">
          <div className="order-stat-icon">▣</div>
          <div>
            <span>Total Order</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="order-stat-icon">◷</div>
          <div>
            <span>Sedang Diproses</span>
            <strong>{stats.active}</strong>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="order-stat-icon">✓</div>
          <div>
            <span>Siap Diambil</span>
            <strong>{stats.ready}</strong>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="order-stat-icon">Rp</div>
          <div>
            <span>Total Nilai Order</span>
            <strong>{formatRupiah(stats.revenue)}</strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="page-error">
          <div>
            <strong>Gagal memuat data</strong>
            <span>{error}</span>
          </div>

          <button
            type="button"
            className="button button-secondary"
            onClick={() => void loadData()}
          >
            Coba Lagi
          </button>
        </div>
      )}

      <div className="orders-card">
        <div className="orders-toolbar">
          <div className="orders-search">
            <span>⌕</span>

            <input
              value={search}
              onChange={(event) =>
                handleSearch(event.target.value)
              }
              placeholder="Cari order, pelanggan, atau nomor HP..."
            />

            {search && (
              <button
                type="button"
                onClick={() => handleSearch("")}
              >
                ×
              </button>
            )}
          </div>

          <div className="orders-toolbar-actions">
            <select
              value={status}
              onChange={(event) =>
                handleStatus(
                  event.target.value as StatusFilter,
                )
              }
            >
              <option value="ALL">Semua Status</option>

              {ORDER_STATUS_FLOW.map((item) => (
                <option key={item} value={item}>
                  {ORDER_STATUS_LABEL[item]}
                </option>
              ))}

              <option value="CANCELLED">
                Dibatalkan
              </option>
            </select>

            <button
              type="button"
              className="refresh-button"
              onClick={() => void loadData()}
              disabled={loading}
              title="Refresh"
            >
              ↻
            </button>
          </div>
        </div>

        {loading ? (
          <div className="orders-loading">
            <Spinner />
            <span>Memuat orders...</span>
          </div>
        ) : paginatedOrders.length === 0 ? (
          <EmptyState
            title={
              search || status !== "ALL"
                ? "Order tidak ditemukan"
                : "Belum ada order"
            }
            description={
              search || status !== "ALL"
                ? "Coba ubah pencarian atau filter status."
                : "Buat order pertama untuk mulai mengelola laundry."
            }
          />
        ) : (
          <>
            <OrderTable
              orders={paginatedOrders}
              onSelect={openOrder}
            />

            <div className="orders-pagination">
              <div className="pagination-info">
                Menampilkan{" "}
                <strong>
                  {(page - 1) * pageSize + 1}
                </strong>{" "}
                -{" "}
                <strong>
                  {Math.min(
                    page * pageSize,
                    filteredOrders.length,
                  )}
                </strong>{" "}
                dari{" "}
                <strong>{filteredOrders.length}</strong>{" "}
                order
              </div>

              <div className="pagination-controls">
                <select
                  value={pageSize}
                  onChange={(event) =>
                    handlePageSize(
                      Number(event.target.value),
                    )
                  }
                >
                  {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size} / halaman
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((current) => current - 1)
                  }
                >
                  ‹
                </button>

                <span>
                  {page} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((current) => current + 1)
                  }
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <OrderModal
        open={showCreateModal}
        customers={customers}
        services={services}
        storageLocations={storageLocations}
        loading={createLoading}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateOrder}
        onCreateCustomer={() => {
          // Nanti bisa kita buka Customer modal langsung.
          window.location.href = "/customers";
        }}
      />

      <OrderDetail
        open={Boolean(selectedOrder)}
        order={selectedOrder}
        onClose={closeOrder}
        onStatusUpdate={handleStatusUpdate}
      />

      <div className="orders-footer-hint">
        <Link to="/customers">
          Kelola pelanggan →
        </Link>

        <Link to="/services">
          Kelola layanan →
        </Link>

        <Link to="/storage">
          Kelola penyimpanan →
        </Link>
      </div>
    </div>
  );
}