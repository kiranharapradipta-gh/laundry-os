import {
  useCallback,
  useState,
} from "react";

import QRScanner from "../components/QRScanner";

import {
  pickupOrderByQr,
  scanOrderQr,
  type ScannedOrder,
} from "../api/client";

export default function Pickup() {
  const [order, setOrder] =
    useState<ScannedOrder | null>(null);

  const [scanning, setScanning] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [pickupLoading, setPickupLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [qrToken, setQrToken] =
    useState("");

  const handleScan = useCallback(
    async (token: string) => {
      setScanning(false);
      setLoading(true);
      setError("");
      setQrToken(token);

      try {
        const data =
          await scanOrderQr(token);

        setOrder(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "QR tidak valid"
        );

        setScanning(true);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  function handleScanAgain() {
    setOrder(null);
    setError("");
    setQrToken("");
    setScanning(true);
  }

  async function handlePickup() {
    if (!qrToken) {
      return;
    }

    const confirmed =
      window.confirm(
        `Konfirmasi pickup order ${order?.orderNumber}?`
      );

    if (!confirmed) {
      return;
    }

    setPickupLoading(true);
    setError("");

    try {
      await pickupOrderByQr(qrToken);

      setOrder(null);
      setQrToken("");
      setScanning(false);

      alert(
        "Order berhasil diambil customer."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal memproses pickup"
      );
    } finally {
      setPickupLoading(false);
    }
  }

  return (
    <main className="pickup-page">
      {/* <header className="pickup-header">
        <div>
          <h1>Pickup Order</h1>

          <p>
            Scan QR Order customer untuk
            mengambil pesanan.
          </p>
        </div>
      </header> */}

      {error && (
        <div className="pickup-error">
          <strong>QR tidak valid</strong>
          <span>{error}</span>
        </div>
      )}

      {scanning && (
        <QRScanner onScan={handleScan} />
        // <section className="scanner-card">
        //   <div className="scanner-title">
        //     <span>📷</span>

        //     <div>
        //       <h2>Scan QR Order</h2>

        //       <p>
        //         Arahkan kamera ke QR yang
        //         diberikan customer.
        //       </p>
        //     </div>
        //   </div>

        //   <QRScanner onScan={handleScan} />
        // </section>
      )}

      {loading && (
        <section className="pickup-loading">
          <div className="spinner" />

          <p>
            Memvalidasi QR Order...
          </p>
        </section>
      )}

      {order && !loading && (
        <section className="order-result">
          <div className="valid-badge">
            <span>✓</span>

            <div>
              <strong>QR VALID</strong>

              <small>
                Order siap diambil
              </small>
            </div>
          </div>

          <div className="order-info">
            <div className="info-row">
              <span>Nomor Order</span>

              <strong>
                {order.orderNumber}
              </strong>
            </div>

            <div className="info-row">
              <span>Customer</span>

              <strong>
                {order.customer.nickname ||
                  order.customer.name}
              </strong>
            </div>

            <div className="info-row">
              <span>Status</span>

              <strong>
                {order.status}
              </strong>
            </div>
          </div>

          <div className="storage-card">
            <div className="storage-title">
              📦 Lokasi Penyimpanan
            </div>

            {order.storage ? (
              <div className="storage-grid">
                <div>
                  <span>Zone</span>
                  <strong>
                    {order.storage.zone ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>Rack</span>
                  <strong>
                    {order.storage.rack ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>Shelf</span>
                  <strong>
                    {order.storage.shelf ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>Slot</span>
                  <strong>
                    {order.storage.slot ||
                      "-"}
                  </strong>
                </div>
              </div>
            ) : (
              <p className="no-storage">
                Lokasi penyimpanan tidak
                ditemukan.
              </p>
            )}
          </div>

          <div className="items-card">
            <h3>Item Pesanan</h3>

            {order.items.map(
              (item, index) => (
                <div
                  className="item-row"
                  key={index}
                >
                  <div>
                    <strong>
                      {item.description}
                    </strong>

                    {item.service && (
                      <small>
                        {item.service.name}
                      </small>
                    )}
                  </div>

                  <span>
                    × {item.quantity}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="pickup-actions">
            <button
              type="button"
              className="scan-again-button"
              onClick={handleScanAgain}
              disabled={pickupLoading}
            >
              Scan Lagi
            </button>

            <button
              type="button"
              className="pickup-button"
              onClick={handlePickup}
              disabled={pickupLoading}
            >
              {pickupLoading
                ? "Memproses..."
                : "Ambil Pesanan"}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}