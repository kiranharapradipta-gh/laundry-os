import { useEffect, useState } from "react";
import type { CreateServiceInput, LaundryService, UpdateServiceInput } from "../../types/service";
import Modal from "../ui/Modal";
import { formatRupiah } from "../../utils/format";

interface ServiceModalProps {
  open: boolean;
  service?: LaundryService | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateServiceInput | UpdateServiceInput,
  ) => Promise<void>;
}

export default function ServiceModal({
  open,
  service,
  loading = false,
  onClose,
  onSubmit,
}: ServiceModalProps) {
  const isEdit = Boolean(service);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setName(service?.name ?? "");
    setDescription(service?.description ?? "");
    setPrice(
      service?.price !== undefined && service?.price !== null
        ? String(service.price)
        : "",
    );
    setUnit(service?.unit ?? "");
    setIsActive(service?.isActive ?? true);
    setError("");
  }, [open, service]);

  function handlePriceChange(value: string) {
    const numeric = value.replace(/\D/g, "");
    setPrice(numeric);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nama layanan wajib diisi.");
      return;
    }

    const numericPrice = Number(price);

    if (!price || Number.isNaN(numericPrice) || numericPrice < 0) {
      setError("Harga layanan tidak valid.");
      return;
    }

    try {
      if (isEdit) {
        await onSubmit({
          name: name.trim(),
          description: description.trim(),
          price: numericPrice,
          unit: unit.trim(),
          isActive,
        });
      } else {
        await onSubmit({
          name: name.trim(),
          description: description.trim(),
          price: numericPrice,
          unit: unit.trim(),
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan layanan.",
      );
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit Layanan" : "Tambah Layanan"}
      onClose={onClose}
    >
      <form className="service-form" onSubmit={handleSubmit}>
        {error && <div className="service-form-error">{error}</div>}

        <div className="service-form-group">
          <label htmlFor="service-name">Nama layanan</label>

          <input
            id="service-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Contoh: Cuci Kering"
            autoFocus
          />
        </div>

        <div className="service-form-group">
          <label htmlFor="service-description">
            Deskripsi <span>(opsional)</span>
          </label>

          <textarea
            id="service-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Contoh: Cuci, kering dan lipat"
            rows={3}
          />
        </div>

        <div className="service-form-row">
          <div className="service-form-group">
            <label htmlFor="service-price">Harga</label>

            <div className="service-price-input">
              <span>Rp</span>

              <input
                id="service-price"
                type="text"
                inputMode="numeric"
                value={
                  price
                    ? new Intl.NumberFormat("id-ID").format(
                        Number(price),
                      )
                    : ""
                }
                onChange={(event) =>
                  handlePriceChange(event.target.value)
                }
                placeholder="10.000"
              />
            </div>

            {price && (
              <small>
                {formatRupiah(Number(price))}
              </small>
            )}
          </div>

          <div className="service-form-group">
            <label htmlFor="service-unit">
              Satuan <span>(opsional)</span>
            </label>

            <input
              id="service-unit"
              type="text"
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              placeholder="kg / pcs / meter"
            />
          </div>
        </div>

        {isEdit && (
          <label className="service-active-toggle">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) =>
                setIsActive(event.target.checked)
              }
            />

            <span>
              <strong>Layanan aktif</strong>
              <small>
                Layanan nonaktif tidak digunakan untuk order baru.
              </small>
            </span>
          </label>
        )}

        <div className="service-form-actions">
          <button
            type="button"
            className="service-cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </button>

          <button
            type="submit"
            className="service-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Tambah Layanan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}