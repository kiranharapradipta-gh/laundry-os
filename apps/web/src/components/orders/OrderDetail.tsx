import { useMemo, useState } from "react";
import OrderStatusBadge from "./OrderStatusBadge";
import type { Order, OrderStatus } from "../../types/order";
import { getNextStatus, ORDER_STATUS_LABEL } from "../../utils/order";
import Modal from "../ui/Modal";
import { formatDateTime, formatRupiah } from "../../utils/format";
import OrderCancelModal from "../orders/OrderCancelModal";
import OrderStatusConfirmModal from "../orders/OrderStatusConfirmModal";

interface Props {
  order: Order | null;
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onStatusUpdate: (
    orderId: string,
    status: OrderStatus,
    note?: string,
  ) => Promise<void>;
}

export default function OrderDetail({
  order,
  open,
  loading = false,
  onClose,
  onStatusUpdate,
}: Props) {
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showStatusConfirmModal, setShowStatusConfirmModal] = useState(false);

  const nextStatus = useMemo(
    () => (order ? getNextStatus(order.status) : null),
    [order],
  );

  if (!order) return null;

  async function handleStatusUpdate(status: OrderStatus | null) {
    if (!order || !status) return null;
    try {
      setUpdating(true);

      await onStatusUpdate(
        order.id,
        status,
        note.trim() || undefined,
      );

      setNote("");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <Modal
      open={open}
      title={`Order #${order.orderNumber}`}
      onClose={onClose}
      size="lg"
    >
      <div className="order-detail">
        <div className="detail-top">
          <div>
            <span className="detail-label">Status</span>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="detail-date">
            Dibuat {formatDateTime(order.createdAt)}
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-title">
            <h3>Pelanggan</h3>
          </div>

          <div className="customer-detail">
            <div className="customer-avatar customer-avatar-large">
              {(order.customer?.name || "?")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {order.customer?.name || "Pelanggan"}
              </strong>

              <span>{order.customer?.phone || "-"}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-title">
            <h3>Item Laundry</h3>
          </div>

          <div className="detail-items">
            {order.items?.map((item) => (
              <div className="detail-item" key={item.id}>
                <div>
                  <strong>
                    {item.service?.name || item.description}
                  </strong>

                  <span>
                    {item.description}
                    {item.weight
                      ? ` • ${item.weight} kg`
                      : ""}
                    {item.quantity > 1
                      ? ` • ${item.quantity}x`
                      : ""}
                  </span>

                  {item.notes && (
                    <small>{item.notes}</small>
                  )}
                </div>

                <strong>
                  {formatRupiah(Number(item.subtotal))}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-info-card">
            <span>Subtotal</span>
            <strong>
              {formatRupiah(Number(order.subtotal))}
            </strong>
          </div>

          <div className="detail-info-card">
            <span>Diskon</span>
            <strong>
              {formatRupiah(Number(order.discount))}
            </strong>
          </div>

          <div className="detail-info-card detail-info-card-total">
            <span>Total</span>
            <strong>
              {formatRupiah(Number(order.total))}
            </strong>
          </div>

          <div className="detail-info-card">
            <span>Pembayaran</span>
            <strong>
              {order.paymentStatus === "PAID"
                ? "Lunas"
                : order.paymentStatus === "PARTIAL"
                  ? "Sebagian"
                  : "Belum bayar"}
            </strong>
          </div>
        </div>

        {order.storageAssignments?.length ? (
          <div className="detail-section">
            <div className="detail-section-title">
              <h3>Penyimpanan</h3>
            </div>

            {order.storageAssignments.map((assignment) => (
              <div
                className="storage-assignment"
                key={assignment.id}
              >
                <div>
                  <strong>
                    {[
                      assignment.storageLocation?.zone,
                      assignment.storageLocation?.rack,
                      assignment.storageLocation?.shelf,
                      assignment.storageLocation?.slot,
                    ]
                      .filter(Boolean)
                      .join(" / ") || "-"}
                  </strong>
                </div>

                <span>
                  {formatDateTime(assignment.assignedAt)}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="detail-section">
          <div className="detail-section-title">
            <h3>Riwayat Status</h3>
          </div>

          <div className="status-history">
            {order.statusHistory?.map((history) => (
              <div
                className="status-history-item"
                key={history.id}
              >
                <div className="history-dot" />

                <div>
                  <strong>
                    {ORDER_STATUS_LABEL[history.status]}
                  </strong>

                  <span>
                    {formatDateTime(history.createdAt)}
                  </span>

                  {history.note && (
                    <small>{history.note}</small>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {nextStatus && (
          <div className="status-update-box">
            <div>
              <span className="detail-label">
                Update status
              </span>

              <strong>
                → {ORDER_STATUS_LABEL[nextStatus]}
              </strong>
            </div>

            <input
              value={note}
              onChange={(event) =>
                setNote(event.target.value)
              }
              placeholder="Catatan opsional"
            />

            <button
              type="button"
              className="button button-primary"
              disabled={updating || loading}
              onClick={() => setShowStatusConfirmModal(true)}
            >
              {updating
                ? "Memproses..."
                : `Tandai ${ORDER_STATUS_LABEL[nextStatus]}`}
            </button>
          </div>
        )}

        {(order.status === "READY" ||
          order.status === "RECEIVED" ||
          order.status === "WASHING" ||
          order.status === "DRYING" ||
          order.status === "IRONING") && (
          <div className="cancel-order-box">
            <button
              type="button"
              className="button button-danger-outline"
              disabled={updating || loading}
              onClick={() => setShowCancelModal(true)}
            >
              Batalkan Order
            </button>
          </div>
        )}

        <div className="modal-footer">
          <button
            type="button"
            className="button button-secondary"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
      <OrderStatusConfirmModal
        open={showStatusConfirmModal}
        currentStatus={order.status}
        nextStatus={nextStatus}
        orderNumber={order.orderNumber}
        loading={updating}
        onClose={() => setShowStatusConfirmModal(false)}
        onConfirm={async () => {
          await handleStatusUpdate(nextStatus);
          setShowStatusConfirmModal(false);
        }}
      />
      <OrderCancelModal
        open={showCancelModal}
        orderNumber={order.orderNumber}
        loading={updating}
        onClose={() => setShowCancelModal(false)}
        onConfirm={async () => {
          await handleStatusUpdate("CANCELLED");
          setShowCancelModal(false);
        }}
      />
    </Modal>
  );
}