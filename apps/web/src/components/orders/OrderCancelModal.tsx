import "./OrderCancelModal.css";

interface OrderCancelModalProps {
  open: boolean;
  orderNumber: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function OrderCancelModal({
  open,
  orderNumber,
  loading = false,
  onClose,
  onConfirm,
}: OrderCancelModalProps) {
  if (!open) return null;

  return (
    <div
      className="order-cancel-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        className="order-cancel-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-cancel-title"
      >
        <div className="order-cancel-icon">
          !
        </div>

        <div className="order-cancel-content">
          <h3 id="order-cancel-title">
            Batalkan Order?
          </h3>

          <p>
            Kamu akan membatalkan order{" "}
            <strong>{orderNumber}</strong>.
          </p>

          <div className="order-cancel-warning">
            <strong>Perhatian</strong>

            <span>
              Order yang sudah dibatalkan tidak dapat
              dikembalikan ke status sebelumnya.
            </span>
          </div>
        </div>

        <div className="order-cancel-actions">
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
            className="button button-danger"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "Membatalkan..." : "Ya, Batalkan"}
          </button>
        </div>
      </div>
    </div>
  );
}