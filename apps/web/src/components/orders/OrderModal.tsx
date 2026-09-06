import { useEffect, useMemo, useState } from "react";
import type { Customer } from "../../../types/customer";
import type { LaundryService } from "../../../types/service";
import type { StorageLocation } from "../../../types/storage";
import type { CreateOrderInput, CreateOrderItemInput } from "../../../types/order";
import Modal from "../Modal";
import { formatRupiah } from "../../../utils/format";

interface Props {
  open: boolean;
  customers: Customer[];
  services: LaundryService[];
  storageLocations: StorageLocation[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (input: CreateOrderInput) => Promise<void>;
  onCreateCustomer?: () => void;
}

interface FormItem extends CreateOrderItemInput {
  tempId: string;
}

function createItem(): FormItem {
  return {
    tempId: crypto.randomUUID(),
    serviceId: "",
    description: "",
    quantity: 1,
    weight: null,
    condition: "",
    notes: "",
  };
}

export default function OrderModal({
  open,
  customers,
  services,
  storageLocations,
  loading = false,
  onClose,
  onSubmit,
  onCreateCustomer,
}: Props) {
  const [customerId, setCustomerId] = useState("");
  const [storageLocationId, setStorageLocationId] = useState("");
  const [discount, setDiscount] = useState("");
  const [items, setItems] = useState<FormItem[]>([createItem()]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setCustomerId("");
    setStorageLocationId("");
    setDiscount("");
    setItems([createItem()]);
    setError("");
  }, [open]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const service = services.find(
        (service) => service.id === item.serviceId,
      );

      const price = Number(service?.price ?? 0);
      const quantity = Number(item.quantity ?? 1);

      return sum + price * quantity;
    }, 0);
  }, [items, services]);

  const discountValue = Math.max(0, Number(discount) || 0);
  const total = Math.max(0, subtotal - discountValue);

  function updateItem(
    tempId: string,
    field: keyof CreateOrderItemInput,
    value: string | number | null,
  ) {
    setItems((current) =>
      current.map((item) =>
        item.tempId === tempId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function addItem() {
    setItems((current) => [...current, createItem()]);
  }

  function removeItem(tempId: string) {
    setItems((current) => {
      if (current.length === 1) return current;

      return current.filter((item) => item.tempId !== tempId);
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!customerId) {
      setError("Pilih pelanggan terlebih dahulu.");
      return;
    }

    if (!items.length) {
      setError("Minimal ada satu item order.");
      return;
    }

    const invalidItem = items.find(
      (item) => !item.serviceId || !item.description.trim(),
    );

    if (invalidItem) {
      setError("Lengkapi layanan dan deskripsi setiap item.");
      return;
    }

    const payload: CreateOrderInput = {
      customerId,
      storageLocationId: storageLocationId || null,
      discount: discountValue || null,
      items: items.map(({ tempId, ...item }) => ({
        ...item,
        quantity: Number(item.quantity || 1),
        weight:
          item.weight === null || item.weight === undefined
            ? null
            : Number(item.weight),
        description: item.description.trim(),
        condition: item.condition?.trim() || undefined,
        notes: item.notes?.trim() || undefined,
      })),
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal membuat order.",
      );
    }
  }

  return (
    <Modal
      open={open}
      title="Buat Order Baru"
      onClose={onClose}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="order-form">
        {error && <div className="form-error">{error}</div>}

        <div className="form-section">
          <div className="form-section-heading">
            <div>
              <h3>Pelanggan</h3>
              <p>Pilih pelanggan yang melakukan laundry.</p>
            </div>
          </div>

          <div className="form-grid form-grid-2">
            <label className="form-field">
              <span>Pelanggan *</span>

              <select
                value={customerId}
                onChange={(event) =>
                  setCustomerId(event.target.value)
                }
              >
                <option value="">Pilih pelanggan</option>

                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} — {customer.phone}
                  </option>
                ))}
              </select>
            </label>

            {onCreateCustomer && (
              <div className="customer-create-box">
                <span>Belum punya pelanggan?</span>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={onCreateCustomer}
                >
                  + Tambah Pelanggan
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-heading">
            <div>
              <h3>Item Laundry</h3>
              <p>Tambahkan layanan yang dipesan.</p>
            </div>

            <button
              type="button"
              className="button button-secondary button-small"
              onClick={addItem}
            >
              + Tambah Item
            </button>
          </div>

          <div className="order-items-form">
            {items.map((item, index) => {
              const service = services.find(
                (service) => service.id === item.serviceId,
              );

              const itemTotal =
                Number(service?.price ?? 0) *
                Number(item.quantity || 1);

              return (
                <div
                  className="order-item-card"
                  key={item.tempId}
                >
                  <div className="order-item-header">
                    <strong>Item {index + 1}</strong>

                    {items.length > 1 && (
                      <button
                        type="button"
                        className="remove-item"
                        onClick={() => removeItem(item.tempId)}
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  <div className="form-grid form-grid-2">
                    <label className="form-field">
                      <span>Layanan *</span>

                      <select
                        value={item.serviceId}
                        onChange={(event) =>
                          updateItem(
                            item.tempId,
                            "serviceId",
                            event.target.value,
                          )
                        }
                      >
                        <option value="">
                          Pilih layanan
                        </option>

                        {services
                          .filter((service) => service.isActive)
                          .map((service) => (
                            <option
                              key={service.id}
                              value={service.id}
                            >
                              {service.name} —{" "}
                              {formatRupiah(
                                Number(service.price),
                              )}
                              {service.unit
                                ? ` / ${service.unit}`
                                : ""}
                            </option>
                          ))}
                      </select>
                    </label>

                    <label className="form-field">
                      <span>Deskripsi *</span>

                      <input
                        value={item.description}
                        onChange={(event) =>
                          updateItem(
                            item.tempId,
                            "description",
                            event.target.value,
                          )
                        }
                        placeholder="Contoh: Baju & celana"
                      />
                    </label>

                    <label className="form-field">
                      <span>Quantity</span>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity ?? 1}
                        onChange={(event) =>
                          updateItem(
                            item.tempId,
                            "quantity",
                            Number(event.target.value),
                          )
                        }
                      />
                    </label>

                    <label className="form-field">
                      <span>Berat (kg)</span>

                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.weight ?? ""}
                        onChange={(event) =>
                          updateItem(
                            item.tempId,
                            "weight",
                            event.target.value
                              ? Number(event.target.value)
                              : null,
                          )
                        }
                        placeholder="Opsional"
                      />
                    </label>

                    <label className="form-field">
                      <span>Kondisi</span>

                      <input
                        value={item.condition ?? ""}
                        onChange={(event) =>
                          updateItem(
                            item.tempId,
                            "condition",
                            event.target.value,
                          )
                        }
                        placeholder="Contoh: Noda, luntur"
                      />
                    </label>

                    <label className="form-field">
                      <span>Catatan</span>

                      <input
                        value={item.notes ?? ""}
                        onChange={(event) =>
                          updateItem(
                            item.tempId,
                            "notes",
                            event.target.value,
                          )
                        }
                        placeholder="Catatan tambahan"
                      />
                    </label>
                  </div>

                  <div className="item-price-preview">
                    <span>Subtotal item</span>
                    <strong>{formatRupiah(itemTotal)}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-section">
          <div className="form-grid form-grid-2">
            <label className="form-field">
              <span>Lokasi Penyimpanan</span>

              <select
                value={storageLocationId}
                onChange={(event) =>
                  setStorageLocationId(event.target.value)
                }
              >
                <option value="">
                  Tidak ditentukan
                </option>

                {storageLocations
                  .filter((location) => location.isActive)
                  .map((location) => (
                    <option
                      key={location.id}
                      value={location.id}
                    >
                      {[
                        location.zone,
                        location.rack,
                        location.shelf,
                        location.slot,
                      ]
                        .filter(Boolean)
                        .join(" / ")}
                    </option>
                  ))}
              </select>
            </label>

            <label className="form-field">
              <span>Diskon</span>

              <input
                type="number"
                min="0"
                value={discount}
                onChange={(event) =>
                  setDiscount(event.target.value)
                }
                placeholder="0"
              />
            </label>
          </div>
        </div>

        <div className="order-summary">
          <div>
            <span>Subtotal</span>
            <strong>{formatRupiah(subtotal)}</strong>
          </div>

          <div>
            <span>Diskon</span>
            <strong>- {formatRupiah(discountValue)}</strong>
          </div>

          <div className="order-summary-total">
            <span>Total</span>
            <strong>{formatRupiah(total)}</strong>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="button button-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </button>

          <button
            type="submit"
            className="button button-primary"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Buat Order"}
          </button>
        </div>
      </form>
    </Modal>
  );
}