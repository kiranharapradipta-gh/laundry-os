import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Loading,
  Select,
} from "../../components/ui";
import {
  getOrder,
  updateOrderStatus,
} from "../../services/api/orders";
import type { Order, OrderStatus } from "../../types/order";
import { formatCurrency, formatDateTime } from "../../utils/format";
import {
  getNextOrderStatuses,
  getOrderStatusLabel,
  getOrderStatusVariant,
} from "../../utils/order";

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");

  const loadOrder = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const result = await getOrder(id);

      setOrder(result);
      setSelectedStatus("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil detail order.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  async function handleStatusUpdate() {
    if (!order || !selectedStatus) return;

    try {
      setUpdating(true);
      setUpdateError("");

      const updatedOrder = await updateOrderStatus(
        order.id,
        selectedStatus,
      );

      setOrder(updatedOrder);
      setSelectedStatus("");
    } catch (err) {
      setUpdateError(
        err instanceof Error
          ? err.message
          : "Gagal mengubah status order.",
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="page order-detail-page">
        <Loading />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page order-detail-page">
        <Button
          variant="secondary"
          onClick={() => navigate("/orders")}
        >
          ← Kembali
        </Button>

        <Card>
          <EmptyState
            title="Order tidak ditemukan"
            description={error || "Data order tidak tersedia."}
          />
        </Card>
      </div>
    );
  }

  const nextStatuses = getNextOrderStatuses(order.status);

  const statusOptions = nextStatuses.map((status) => ({
    value: status,
    label: getOrderStatusLabel(status),
  }));

  return (
    <div className="page order-detail-page" style={{ marginTop: 10 }}>
      <div className="order-detail-topbar">
        <div>
          <Link to="/orders" className="back-link">
            ← Kembali ke Orders
          </Link>

          <div className="order-detail-title">
            <div>
              <span className="eyebrow">Order</span>
              <h2>#{order.orderNumber}</h2>
            </div>

            <Badge variant={getOrderStatusVariant(order.status)}>
              {getOrderStatusLabel(order.status)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="order-detail-grid">
        <Card className="order-detail-main">
          <div className="section-header">
            <div>
              <h3>Detail Laundry</h3>
              <p>
                Informasi item yang diterima dari pelanggan.
              </p>
            </div>
          </div>

          {order.items && order.items.length > 0 ? (
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div
                  className="order-item"
                  key={item.id}
                >
                  <div className="order-item-number">
                    {index + 1}
                  </div>

                  <div className="order-item-content">
                    <strong>
                      {item.description || "Item laundry"}
                    </strong>

                    {item.service?.name && (
                      <span>
                        Layanan: {item.service.name}
                      </span>
                    )}

                    {item.notes && (
                      <span>
                        Catatan: {item.notes}
                      </span>
                    )}
                  </div>

                  <div className="order-item-meta">
                    {item.quantity != null && (
                      <span>
                        {item.quantity} pcs
                      </span>
                    )}

                    {item.weight != null && (
                      <span>
                        {item.weight} kg
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Tidak ada item"
              description="Order ini belum memiliki item laundry."
            />
          )}

          <div className="order-total-box">
            <div>
              <span>Subtotal</span>
              <strong>
                {formatCurrency(order.subtotal)}
              </strong>
            </div>

            <div>
              <span>Diskon</span>
              <strong>
                {formatCurrency(order.discount)}
              </strong>
            </div>

            <div className="order-grand-total">
              <span>Total</span>
              <strong>
                {formatCurrency(order.total)}
              </strong>
            </div>
          </div>
        </Card>

        <div className="order-detail-sidebar">
          <Card>
            <div className="section-header">
              <div>
                <h3>Pelanggan</h3>
                <p>Informasi pelanggan order.</p>
              </div>
            </div>

            <div className="customer-detail">
              <strong>
                {order.customer?.name ?? "Tanpa nama"}
              </strong>

              {order.customer?.nickname && (
                <span>
                  {order.customer.nickname}
                </span>
              )}

              {order.customer?.phone && (
                <span>
                  {order.customer.phone}
                </span>
              )}
            </div>
          </Card>

          <Card>
            <div className="section-header">
              <div>
                <h3>Status Order</h3>
                <p>
                  Perbarui progress laundry.
                </p>
              </div>
            </div>

            {updateError && (
              <div className="order-update-error">
                {updateError}
              </div>
            )}

            {nextStatuses.length > 0 ? (
              <div className="status-update-row">
                <div className="status-select-wrapper">
                  <Select
                    label="Status berikutnya"
                    value={selectedStatus}
                    options={[
                      {
                        value: "",
                        label: "Pilih status",
                      },
                      ...statusOptions,
                    ]}
                    onChange={(event) =>
                      setSelectedStatus(
                        event.target.value as OrderStatus | "",
                      )
                    }
                  />
                </div>

                <Button
                  variant="primary"
                  className="status-update-button"
                  disabled={!selectedStatus || updating}
                  onClick={() => void handleStatusUpdate()}
                >
                  {updating ? "Menyimpan..." : "Update Status"}
                </Button>
              </div>
            ) : (
              <div className="status-finished">
                <Badge
                  variant={getOrderStatusVariant(order.status)}
                >
                  {getOrderStatusLabel(order.status)}
                </Badge>

                <p>
                  Order ini sudah berada di status akhir.
                </p>
              </div>
            )}
          </Card>

          <Card>
            <div className="section-header">
              <div>
                <h3>Timeline</h3>
                <p>Waktu penting order.</p>
              </div>
            </div>

            <div className="order-timeline">
              <div>
                <span>Dibuat</span>
                <strong>
                  {formatDateTime(order.createdAt)}
                </strong>
              </div>

              {order.receivedAt && (
                <div>
                  <span>Diterima</span>
                  <strong>
                    {formatDateTime(order.receivedAt)}
                  </strong>
                </div>
              )}

              {order.readyAt && (
                <div>
                  <span>Siap diambil</span>
                  <strong>
                    {formatDateTime(order.readyAt)}
                  </strong>
                </div>
              )}

              {order.pickedUpAt && (
                <div>
                  <span>Diambil</span>
                  <strong>
                    {formatDateTime(order.pickedUpAt)}
                  </strong>
                </div>
              )}

              {order.cancelledAt && (
                <div>
                  <span>Dibatalkan</span>
                  <strong>
                    {formatDateTime(order.cancelledAt)}
                  </strong>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}