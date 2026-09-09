import { useEffect, useState } from "react";

import type {
  OperationalSettings as OperationalSettingsType,
  UpdateOperationalSettingsInput,
} from "../../types/settings";

interface OperationalSettingsProps {
  settings: OperationalSettingsType | null;
  onSaved: (input: UpdateOperationalSettingsInput) => Promise<void>;
}

const DAYS = [
  { value: 1, label: "Sen" },
  { value: 2, label: "Sel" },
  { value: 3, label: "Rab" },
  { value: 4, label: "Kam" },
  { value: 5, label: "Jum" },
  { value: 6, label: "Sab" },
  { value: 7, label: "Min" },
];

const DEFAULT_SETTINGS: UpdateOperationalSettingsInput = {
  openingTime: "08:00",
  closingTime: "21:00",
  operatingDays: [1, 2, 3, 4, 5, 6],
  processingDays: 2,
  allowOrderCancellation: true,
  confirmBeforeDelete: true,
};

export default function OperationalSettings({
  settings,
  onSaved,
}: OperationalSettingsProps) {
  const [openingTime, setOpeningTime] = useState(
    DEFAULT_SETTINGS.openingTime,
  );

  const [closingTime, setClosingTime] = useState(
    DEFAULT_SETTINGS.closingTime,
  );

  const [operatingDays, setOperatingDays] = useState<number[]>(
    DEFAULT_SETTINGS.operatingDays ?? [],
  );

  const [processingDays, setProcessingDays] = useState(
    DEFAULT_SETTINGS.processingDays,
  );

  const [allowOrderCancellation, setAllowOrderCancellation] = useState(
    DEFAULT_SETTINGS.allowOrderCancellation,
  );

  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(
    DEFAULT_SETTINGS.confirmBeforeDelete,
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!settings) {
      return;
    }

    setOpeningTime(settings.openingTime);
    setClosingTime(settings.closingTime);
    setOperatingDays(settings.operatingDays);
    setProcessingDays(settings.processingDays);
    setAllowOrderCancellation(settings.allowOrderCancellation);
    setConfirmBeforeDelete(settings.confirmBeforeDelete);
  }, [settings]);

  function toggleDay(day: number) {
    setOperatingDays((current) => {
      if (current.includes(day)) {
        return current.filter((value) => value !== day);
      }

      return [...current, day].sort((a, b) => a - b);
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (operatingDays.length === 0) {
      setError("Minimal pilih satu hari operasional.");
      return;
    }

    if (processingDays! < 1 || processingDays! > 30) {
      setError("Estimasi pengerjaan harus antara 1 sampai 30 hari.");
      return;
    }

    try {
      setSaving(true);

      await onSaved({
        openingTime,
        closingTime,
        operatingDays,
        processingDays,
        allowOrderCancellation,
        confirmBeforeDelete,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan pengaturan operasional.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className="settings-operational-card"
      onSubmit={handleSubmit}
    >
      <div className="settings-operational-header">
        <div>
          <h2>Operasional</h2>
          <p>
            Atur jam buka, hari operasional, dan aturan dasar laundry.
          </p>
        </div>
      </div>

      <div className="settings-operational-section">
        <div className="settings-operational-section-title">
          <h3>Jam operasional</h3>
          <p>
            Tentukan jam layanan laundry setiap hari.
          </p>
        </div>

        <div className="settings-operational-grid">
          <div className="settings-operational-field">
            <label htmlFor="opening-time">
              Jam buka
            </label>

            <input
              id="opening-time"
              type="time"
              value={openingTime}
              onChange={(event) =>
                setOpeningTime(event.target.value)
              }
            />
          </div>

          <div className="settings-operational-field">
            <label htmlFor="closing-time">
              Jam tutup
            </label>

            <input
              id="closing-time"
              type="time"
              value={closingTime}
              onChange={(event) =>
                setClosingTime(event.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className="settings-operational-section">
        <div className="settings-operational-section-title">
          <h3>Hari operasional</h3>
          <p>
            Pilih hari ketika laundry menerima pesanan.
          </p>
        </div>

        <div className="settings-days">
          {DAYS.map((day) => {
            const active = operatingDays.includes(day.value);

            return (
              <button
                key={day.value}
                type="button"
                className={`settings-day ${
                  active ? "is-active" : ""
                }`}
                aria-pressed={active}
                onClick={() => toggleDay(day.value)}
              >
                {day.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="settings-operational-section">
        <div className="settings-operational-section-title">
          <h3>Estimasi pengerjaan</h3>
          <p>
            Durasi default pengerjaan pesanan dalam hari.
          </p>
        </div>

        <div className="settings-operational-field settings-operational-field-small">
          <label htmlFor="processing-days">
            Estimasi pengerjaan
          </label>

          <div className="settings-input-with-suffix">
            <input
              id="processing-days"
              type="number"
              min={1}
              max={30}
              value={processingDays || ""}
              onChange={(event) => {
                const value = event.target.value;

                setProcessingDays(
                  value === "" ? 0 : Number(value)
                );
              }}
            />

            <span>hari</span>
          </div>
        </div>
      </div>

      <div className="settings-operational-section">
        <div className="settings-operational-section-title">
          <h3>Aturan pesanan</h3>
          <p>
            Kontrol perilaku dasar saat mengelola pesanan.
          </p>
        </div>

        <div className="settings-options">
          <label className="settings-option">
            <div className="settings-option-content">
              <strong>
                Izinkan pembatalan pesanan
              </strong>

              <span>
                Pengguna dapat membatalkan pesanan yang
                belum selesai.
              </span>
            </div>

            <input
              type="checkbox"
              checked={allowOrderCancellation}
              onChange={(event) =>
                setAllowOrderCancellation(
                  event.target.checked
                )
              }
            />

            <span className="settings-toggle" />
          </label>

          <label className="settings-option">
            <div className="settings-option-content">
              <strong>
                Konfirmasi sebelum menghapus
              </strong>

              <span>
                Tampilkan konfirmasi sebelum data dihapus.
              </span>
            </div>

            <input
              type="checkbox"
              checked={confirmBeforeDelete}
              onChange={(event) =>
                setConfirmBeforeDelete(
                  event.target.checked
                )
              }
            />

            <span className="settings-toggle" />
          </label>
        </div>
      </div>

      {error && (
        <div
          className="settings-operational-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="settings-operational-footer">
        <button
          type="submit"
          className="settings-save-button"
          disabled={saving}
        >
          {saving
            ? "Menyimpan..."
            : "Simpan perubahan"}
        </button>
      </div>
    </form>
  );
}