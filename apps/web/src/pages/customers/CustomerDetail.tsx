import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Badge,
  Button,
  Card,
  EmptyState,
  Loading,
  Pagination,
  Table,
} from "../../components/ui";

import { getCustomer } from "../../services/api/customers";
import { getOrders } from "../../services/api";
import type { Customer } from "../../types/customer";
import type { Order } from "../../types/order";

import {
  getOrderStatusLabel,
  getOrderStatusVariant,
} from "../../utils/order";

import { formatCurrency, formatDate } from "../../utils/format";

export function CustomerDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadCustomer = useCallback(async () => {
    if (!id) {
      setError("ID pelanggan tidak valid.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getCustomer(id);
      setCustomer(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data pelanggan.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadOrders = useCallback(async () => {
    if (!id) return;

    try {
      setOrderLoading(true);
      setOrderError("");

      const result = await getOrders({
        customerId: id,
        page,
        limit,
      });

      setOrders(result.data);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
    } catch (err) {
      setOrders([]);
      setTotal(0);
      setTotalPages(0);

      setOrderError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil riwayat order.",
      );
    } finally {
      setOrderLoading(false);
    }
  }, [id, page, limit]);

  useEffect(() => {
    void loadCustomer();
  }, [loadCustomer]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  if (loading) {
    return (
      <div className="page">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Card>
          <EmptyState
            title="Pelanggan tidak ditemukan"
            description={error}
            action={
              <Button
                variant="secondary"
                onClick={() => navigate("/customers")}
              >
                Kembali ke Pelanggan
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="page">
        <Card>
          <EmptyState
            title="Data tidak tersedia"
            description="Data pelanggan tidak ditemukan."
            action={
              <Button
                variant="secondary"
                onClick={() => navigate("/customers")}
              >
                Kembali
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="page customer-detail-page">
      <div className="page-header">
        <div>
          <button
            type="button"
            className="back-link"
            onClick={() => navigate("/customers")}
          >
            ← Kembali ke Pelanggan
          </button>

          <h1>{customer.name}</h1>

          <p>Detail informasi pelanggan dan riwayat transaksinya.</p>
        </div>

        <Button
          variant="secondary"
          onClick={() =>
            navigate(`/customers/${customer.id}/edit`)
          }
        >
          Edit Pelanggan
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => navigate(`/orders/new?customerId=${customer.id}`)}
        >
          + Buat Order
        </Button>
      </div>

      <div className="customer-detail-layout">
        {/* ================================
            CUSTOMER PROFILE
        ================================= */}

        <Card>
          <div className="customer-profile">
            <div className="customer-avatar">
              {customer.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2>{customer.name}</h2>

              {customer.nickname && (
                <span>@{customer.nickname}</span>
              )}
            </div>
          </div>

          <div className="customer-info-list">
            <div className="customer-info-item">
              <span>Nomor HP</span>
              <strong>{customer.phone}</strong>
            </div>

            <div className="customer-info-item">
              <span>Nickname</span>
              <strong>{customer.nickname || "-"}</strong>
            </div>

            <div className="customer-info-item">
              <span>Terdaftar</span>
              <strong>
                {customer.createdAt
                  ? formatDate(customer.createdAt)
                  : "-"}
              </strong>
            </div>
          </div>
        </Card>

        {/* ================================
            ORDER HISTORY
        ================================= */}

        <Card>
          <div className="customer-section-header">
            <div>
              <h2>Riwayat Order</h2>

              <p>
                {total > 0
                  ? `${total} order ditemukan untuk pelanggan ini.`
                  : "Belum ada order untuk pelanggan ini."}
              </p>
            </div>
          </div>

          {orderError ? (
            <EmptyState
              title="Gagal memuat riwayat order"
              description={orderError}
              action={
                <Button
                  variant="secondary"
                  onClick={() => void loadOrders()}
                >
                  Coba Lagi
                </Button>
              }
            />
          ) : (
            <>
              <Table<Order>
                loading={orderLoading}
                data={orders}
                rowKey={(order) => order.id}
                empty={
                  <EmptyState
                    title="Belum ada order"
                    description="Pelanggan ini belum memiliki riwayat order."
                    action={
                      <Button
                        onClick={() =>
                          navigate(
                            `/orders/new?customerId=${customer.id}`,
                          )
                        }
                      >
                        + Buat Order
                      </Button>
                    }
                  />
                }
                columns={[
                  {
                    key: "orderNumber",
                    label: "Order",
                    render: (order) => (
                      <button
                        type="button"
                        className="order-link"
                        onClick={() =>
                          navigate(`/orders/${order.id}`)
                        }
                      >
                        <strong>#{order.orderNumber}</strong>
                        <span>{formatDate(order.createdAt)}</span>
                      </button>
                    ),
                  },
                  {
                    key: "status",
                    label: "Status",
                    render: (order) => (
                      <Badge
                        variant={getOrderStatusVariant(order.status)}
                      >
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    ),
                  },
                  {
                    key: "items",
                    label: "Item",
                    render: (order) =>
                      `${order.items?.length ?? 0} item`,
                  },
                  {
                    key: "total",
                    label: "Total",
                    render: (order) =>
                      formatCurrency(order.total),
                  },
                ]}
              />

              {total > 0 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  limit={limit}
                  onPageChange={setPage}
                  onLimitChange={(nextLimit) => {
                    setLimit(nextLimit);
                    setPage(1);
                  }}
                />
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}