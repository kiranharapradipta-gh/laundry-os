import {
  useEffect,
  useState,
} from "react";

import {
  getOrderById,
  updateOrderStatus,
  type Order,
} from "../api/client";

interface OrderDetailProps {
  orderId: string;
  onBack: () => void;
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

const nextStatuses: Record<
  Order["status"],
  Order["status"][]
> = {
  RECEIVED: ["WASHING", "CANCELLED"],
  WASHING: ["DRYING", "CANCELLED"],
  DRYING: ["IRONING", "CANCELLED"],
  IRONING: ["READY", "CANCELLED"],
  READY: ["PICKED_UP", "CANCELLED"],
  PICKED_UP: [],
  CANCELLED: [],
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
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

export default function OrderDetail({
  orderId,
  onBack,
}: OrderDetailProps) {
  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadOrder() {
    try {
      setLoading(true);
      setError("");

      const data = await getOrderById(orderId);

      console.log('data:', data)

      setOrder(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil detail order"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  async function handleStatusChange(
    status: Order["status"]
  ) {
    if (!order || updating) {
      return;
    }

    const label =
      statusLabels[status];

    const confirmed =
      window.confirm(
        `Ubah status order menjadi "${label}"?`
      );

    if (!confirmed) {
      return;
    }

    setUpdating(true);
    setError("");

    try {
      // const updated =
      await updateOrderStatus(
        order.id,
        status
      );

      const updated = await getOrderById(orderId);

      console.log('updated:', updated)

      setOrder(updated);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengubah status order"
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <main className="order-detail-page">
        <section className="order-detail-state">
          <div className="spinner" />
          <p>
            Memuat detail order...
          </p>
        </section>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="order-detail-page">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          ← Kembali
        </button>

        <section className="order-detail-state order-detail-error">
          <strong>
            Gagal memuat order
          </strong>

          <p>{error}</p>

          <button
            type="button"
            onClick={loadOrder}
          >
            Coba Lagi
          </button>
        </section>
      </main>
    );
  }

  if (!order) {
    return <h1>No order</h1>;
  }

  const customerName =
    order.customer?.nickname ||
    order.customer?.name;

  const availableStatuses =
    nextStatuses[order.status];

  const activeStorage =
    order.storageAssignments?.find(
      (assignment) =>
        assignment.releasedAt === null
    );

  return (
    <main className="order-detail-page">
      <header className="order-detail-header">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          ← Kembali
        </button>

        <div className="order-detail-title">
          <div>
            <span>Order</span>

            <h1>
              {order.orderNumber}
            </h1>
          </div>

          <span
            className={`order-status status-${order.status.toLowerCase()}`}
          >
            {statusLabels[order.status]}
          </span>
        </div>
      </header>

      {error && (
        <div className="order-detail-error-banner">
          {error}
        </div>
      )}

      {/* CUSTOMER */}

      <section className="detail-card">
        <div className="detail-card-header">
          <h2>Customer</h2>
        </div>

        <div className="detail-customer">
          <div className="detail-customer-avatar">
            {customerName?.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>
              {customerName}
            </strong>

            <span>
              {order.customer?.phone}
            </span>

            {order.customer?.nickname &&
              order.customer?.nickname !==
                order.customer?.name && (
                <small>
                  Nama: {order.customer?.name}
                </small>
              )}
          </div>
        </div>
      </section>

      {/* ORDER SUMMARY */}

      <section className="detail-card">
        <div className="detail-card-header">
          <h2>Ringkasan Order</h2>

          <span>
            {formatDate(
              order.createdAt
            )}
          </span>
        </div>

        <div className="detail-summary">
          <div>
            <span>Subtotal</span>
            <strong>
              {formatRupiah(
                order.subtotal
              )}
            </strong>
          </div>

          <div>
            <span>Diskon</span>
            <strong>
              -{" "}
              {formatRupiah(
                order.discount
              )}
            </strong>
          </div>

          <div className="detail-total">
            <span>Total</span>
            <strong>
              {formatRupiah(
                order.total
              )}
            </strong>
          </div>

          <div>
            <span>Sudah Dibayar</span>
            <strong>
              {formatRupiah(
                order.paidAmount
              )}
            </strong>
          </div>

          <div>
            <span>Status Pembayaran</span>
            <strong>
              {order.paymentStatus}
            </strong>
          </div>
          
          <div>
            <span>Catatan: </span>
            <strong>
              {order.notes}
            </strong>
          </div>
        </div>
      </section>

      {/* ITEMS */}

      <section className="detail-card">
        <div className="detail-card-header">
          <h2>Item Pesanan</h2>

          <span>
            {order.items?.length} item
          </span>
        </div>

        <div className="detail-items">
          {order.items?.map(
            (item, index) => (
              <article
                className="detail-item"
                key={item.id}
              >
                <div className="detail-item-number">
                  {index + 1}
                </div>

                <div className="detail-item-content">
                  <div className="detail-item-main">
                    <div>
                      <strong>
                        {item.description}
                      </strong>

                      {item.service && (
                        <span>
                          {item.service.name}
                        </span>
                      )}
                    </div>

                    <strong>
                      {formatRupiah(
                        item.subtotal
                      )}
                    </strong>
                  </div>

                  <div className="detail-item-meta">
                    <span>
                      Qty: {item.quantity}
                    </span>

                    <span>
                      Harga:{" "}
                      {formatRupiah(
                        item.unitPrice
                      )}
                    </span>
                  </div>

                  {item.notes && (
                    <div className="detail-item-notes">
                      <span>Catatan</span>
                      <p>
                        {item.notes}
                      </p>
                    </div>
                  )}

                  {item.photos &&
                    item.photos.length >
                      0 && (
                      <div className="detail-item-photos">
                        {item.photos.map(
                          (photo) => (
                            <div
                              className="item-photo"
                              key={photo.id}
                            >
                              {photo.url ? (
                                <img
                                  src={
                                    photo.url
                                  }
                                  alt={
                                    item.description
                                  }
                                />
                              ) : (
                                <span>
                                  📷
                                </span>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              </article>
            )
          )}
        </div>
      </section>

      {/* STORAGE */}

      <section className="detail-card">
        <div className="detail-card-header">
          <h2>Lokasi Penyimpanan</h2>
        </div>

        {activeStorage ? (
          <div className="detail-storage">
            <div>
              <span>Zone</span>
              <strong>
                {
                  activeStorage
                    .storageLocation
                    .zone || "-"
                }
              </strong>
            </div>

            <div>
              <span>Rack</span>
              <strong>
                {
                  activeStorage
                    .storageLocation
                    .rack || "-"
                }
              </strong>
            </div>

            <div>
              <span>Shelf</span>
              <strong>
                {
                  activeStorage
                    .storageLocation
                    .shelf || "-"
                }
              </strong>
            </div>

            <div>
              <span>Slot</span>
              <strong>
                {
                  activeStorage
                    .storageLocation
                    .slot || "-"
                }
              </strong>
            </div>
          </div>
        ) : (
          <div className="detail-no-storage">
            📦 Tidak ada lokasi penyimpanan
            aktif.
          </div>
        )}
      </section>

      {/* STATUS HISTORY */}

      <section className="detail-card">
        <div className="detail-card-header">
          <h2>Riwayat Status</h2>
        </div>

        <div className="status-timeline">
          {order.statusHistory?.map(
            (history) => (
              <div
                className="timeline-item"
                key={history.id}
              >
                <div className="timeline-marker">
                  <span />
                </div>

                <div className="timeline-content">
                  <strong>
                    {
                      statusLabels[
                        history.toStatus as Order["status"]
                      ] ||
                        history.toStatus
                    }
                  </strong>

                  <span>
                    {formatDate(
                      history.createdAt
                    )}
                  </span>

                  {history.note && (
                    <p>
                      {history.note}
                    </p>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ACTION */}

      {availableStatuses.length >
        0 && (
        <section className="detail-card detail-actions-card">
          <div className="detail-card-header">
            <h2>Update Status</h2>
          </div>

          <div className="detail-actions">
            {availableStatuses.map(
              (status) => (
                <button
                  type="button"
                  key={status}
                  className={
                    status ===
                    "CANCELLED"
                      ? "detail-action danger"
                      : "detail-action"
                  }
                  disabled={updating}
                  onClick={() =>
                    handleStatusChange(
                      status
                    )
                  }
                >
                  {updating
                    ? "Memproses..."
                    : statusLabels[
                        status
                      ]}
                </button>
              )
            )}
          </div>
        </section>
      )}
    </main>
  );
}