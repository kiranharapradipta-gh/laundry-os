import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScan: (token: string) => void;
  disabled?: boolean;
}

export default function QRScanner({
  onScan,
  disabled = false,
}: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedRef = useRef(false);

  const [decoded, setdecoded] = useState('');

  useEffect(() => {
    if (disabled) {
      return;
    }

    let cancelled = false;

    scannedRef.current = false;

    const element = document.getElementById("qr-reader");

    if (!element) {
      console.error("Element #qr-reader tidak ditemukan");
      return;
    }

    element.innerHTML = "";

    const scanner = new Html5Qrcode("qr-reader");

    scannerRef.current = scanner;

    async function startScanner() {
      try {
        await scanner.start(
          {
            facingMode: "environment",
          },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },
          async (decodedText) => {
            if (cancelled || scannedRef.current) {
              return;
            }

            setdecoded(decodedText)

            scannedRef.current = true;

            try {
              if (scanner.isScanning) {
                await scanner.stop();
              }
            } catch (error) {
              console.warn(
                "Gagal menghentikan scanner:",
                error
              );
            }

            if (!cancelled) {
              onScan(decodedText);
            }
          },
          () => {
            // QR belum terbaca
          }
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Gagal menjalankan QR scanner:",
            error
          );
        }
      }
    }

    startScanner();

    return () => {
      cancelled = true;

      if (scannerRef.current === scanner) {
        scannerRef.current = null;
      }

      if (scanner.isScanning) {
        scanner
          .stop()
          .catch(() => {});
      }

      try {
        scanner.clear();
      } catch {
        // ignore
      }
    };
  }, [disabled, onScan]);

  return (
    <div className="qr-scanner-wrapper">
      <div id="qr-reader" />
      {decoded}
      <p className="qr-scanner-hint">
        Arahkan kamera ke QR Order customer
      </p>
    </div>
  );
}