import "./OrderStatusConfirmModal.css";
import type { OrderStatus } from "../../types/order";

interface OrderStatusConfirmModalProps {
  open: boolean;
  currentStatus: OrderStatus;
  nextStatus: OrderStatus | null;
  orderNumber: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  RECEIVED: "Diterima",
  WASHING: "Dicuci",
  DRYING: "Dikeringkan",
  IRONING: "Disetrika",
  READY: "Siap Diambil",
  PICKED_UP: "Selesai",
  CANCELLED: "Dibatalkan",
};

export default function OrderStatusConfirmModal({
  open,
  currentStatus,
  nextStatus,
  orderNumber,
  loading = false,
  onClose,
  onConfirm,
}: OrderStatusConfirmModalProps) {
  if (!open || !nextStatus) return null;

  const nextLabel = ORDER_STATUS_LABEL[nextStatus];

  return (
    <div
      className="order-status-confirm-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !loading
        ) {
          onClose();
        }
      }}
    >
      <div
        className="order-status-confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-status-confirm-title"
      >
        <div className="order-status-confirm-icon">
          ✓
        </div>

        <div className="order-status-confirm-content">
          <h3 id="order-status-confirm-title">
            Ubah Status Order?
          </h3>

          <p>
            Order{" "}
            <strong>{orderNumber}</strong>{" "}
            akan diubah menjadi{" "}
            <strong>{nextLabel}</strong>.
          </p>

          <div className="order-status-confirm-change">
            <div>
              <span>Status sekarang</span>
              <strong>
                {ORDER_STATUS_LABEL[currentStatus]}
              </strong>
            </div>

            <span className="order-status-confirm-arrow">
              →
            </span>

            <div>
              <span>Status berikutnya</span>
              <strong>
                {nextLabel}
              </strong>
            </div>
          </div>
        </div>

        <div className="order-status-confirm-actions">
          <button
            type="button"
            className="button button-secondary"
            disabled={loading}
            onClick={onClose}
          >
            Kembali
          </button>

          <button
            type="button"
            className="button button-primary"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading
              ? "Memproses..."
              : `Ya, Tandai ${nextLabel}`}
          </button>
        </div>
      </div>
    </div>
  );
}