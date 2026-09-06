import { useEffect, useState } from "react";
import type { CreateStorageInput, StorageLocation, UpdateStorageInput } from "../../types/storage";
import Modal from "../ui/Modal";

interface StorageModalProps {
  open: boolean;
  location?: StorageLocation | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateStorageInput | UpdateStorageInput,
  ) => Promise<void>;
}

export default function StorageModal({
  open,
  location,
  loading = false,
  onClose,
  onSubmit,
}: StorageModalProps) {
  const isEdit = Boolean(location);

  const [zone, setZone] = useState("");
  const [rack, setRack] = useState("");
  const [shelf, setShelf] = useState("");
  const [slot, setSlot] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setZone(location?.zone || "");
    setRack(location?.rack || "");
    setShelf(location?.shelf || "");
    setSlot(location?.slot || "");
    setError("");
  }, [open, location]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const values = {
      zone: zone.trim(),
      rack: rack.trim(),
      shelf: shelf.trim(),
      slot: slot.trim(),
    };

    const hasValue = Object.values(values).some(Boolean);

    if (!hasValue) {
      setError(
        "Minimal isi salah satu bagian lokasi.",
      );
      return;
    }

    try {
      setError("");

      await onSubmit(values);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan lokasi.",
      );
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        isEdit
          ? "Edit Lokasi Storage"
          : "Tambah Lokasi Storage"
      }
    >
      <form
        className="storage-form"
        onSubmit={handleSubmit}
      >
        <div className="storage-form-intro">
          <div className="storage-form-icon">
            📦
          </div>

          <div>
            <h3>
              {isEdit
                ? "Perbarui lokasi"
                : "Buat lokasi baru"}
            </h3>

            <p>
              Tentukan posisi penyimpanan laundry
              berdasarkan zone, rak, shelf, dan slot.
            </p>
          </div>
        </div>

        {error && (
          <div className="storage-form-error">
            {error}
          </div>
        )}

        <div className="storage-form-grid">
          <label className="storage-field">
            <span>Zone</span>

            <input
              value={zone}
              onChange={(event) =>
                setZone(event.target.value)
              }
              placeholder="Contoh: A"
              maxLength={50}
            />
          </label>

          <label className="storage-field">
            <span>Rak</span>

            <input
              value={rack}
              onChange={(event) =>
                setRack(event.target.value)
              }
              placeholder="Contoh: 01"
              maxLength={50}
            />
          </label>

          <label className="storage-field">
            <span>Shelf</span>

            <input
              value={shelf}
              onChange={(event) =>
                setShelf(event.target.value)
              }
              placeholder="Contoh: 02"
              maxLength={50}
            />
          </label>

          <label className="storage-field">
            <span>Slot</span>

            <input
              value={slot}
              onChange={(event) =>
                setSlot(event.target.value)
              }
              placeholder="Contoh: 03"
              maxLength={50}
            />
          </label>
        </div>

        <div className="storage-preview">
          <span>Preview lokasi</span>

          <strong>
            {[
              zone.trim(),
              rack.trim(),
              shelf.trim(),
              slot.trim(),
            ]
              .filter(Boolean)
              .join(" / ") || "Belum diisi"}
          </strong>
        </div>

        <div className="storage-modal-actions">
          <button
            type="button"
            className="storage-cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </button>

          <button
            type="submit"
            className="storage-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Tambah Lokasi"}
          </button>
        </div>
      </form>
    </Modal>
  );
}