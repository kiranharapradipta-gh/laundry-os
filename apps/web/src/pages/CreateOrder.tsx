import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createOrder,
  getServices,
  getStorageLocations,
  type Customer,
  type Service,
  type StorageLocation,
} from "../api/client";

interface CreateOrderProps {
  customer: Customer;
  onBack: () => void;
  onCreated: (order: any) => void;
}

interface OrderItemForm {
  id: string;
  serviceId: string;
  description: string;
  quantity: string;
  notes: string;
}

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }
  ).format(value);
}

export default function CreateOrder({
  customer,
  onBack,
  onCreated,
}: CreateOrderProps) {
  const [services, setServices] =
    useState<Service[]>([]);

  const [storageLocations, setStorageLocations] =
    useState<StorageLocation[]>([]);

  const [loadingData, setLoadingData] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [storageLocationId, setStorageLocationId] =
    useState("");

  const [discount, setDiscount] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [items, setItems] =
    useState<OrderItemForm[]>([
      {
        id: crypto.randomUUID(),
        serviceId: "",
        description: "",
        quantity: "1",
        notes: "",
      },
    ]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingData(true);
        setError("");

        const [
          serviceData,
          storageData,
        ] = await Promise.all([
          getServices(),
          getStorageLocations(),
        ]);

        setServices(
          serviceData.filter(
            (service) => service.isActive
          )
        );

        setStorageLocations(
          storageData.filter(
            (storage) => storage.isActive
          )
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data"
        );
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, []);

  function updateItem(
    id: string,
    field: keyof OrderItemForm,
    value: string
  ) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        serviceId: "",
        description: "",
        quantity: "1",
        notes: "",
      },
    ]);
  }

  function removeItem(id: string) {
    setItems((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  }

  function getServicePrice(
    serviceId: string
  ) {
    const service = services.find(
      (item) => item.id === serviceId
    );

    return service
      ? Number(service.price)
      : 0;
  }

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => {
        const quantity =
          Number(item.quantity) || 0;

        const price =
          getServicePrice(
            item.serviceId
          );

        return (
          total +
          price * quantity
        );
      },
      0
    );
  }, [items, services]);

  const numericDiscount =
    Number(discount) || 0;

  const total = Math.max(
    0,
    subtotal - numericDiscount
  );

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");

    if (items.length === 0) {
      setError(
        "Order harus memiliki minimal satu item."
      );
      return;
    }

    for (const item of items) {
      if (!item.serviceId) {
        setError(
          "Pilih service untuk semua item."
        );
        return;
      }

      if (!item.description.trim()) {
        setError(
          "Deskripsi item wajib diisi."
        );
        return;
      }

      const quantity =
        Number(item.quantity);

      if (
        !Number.isFinite(quantity) ||
        quantity <= 0
      ) {
        setError(
          "Quantity harus lebih dari 0."
        );
        return;
      }
    }

    if (
      numericDiscount < 0
    ) {
      setError(
        "Discount tidak valid."
      );
      return;
    }

    if (
      numericDiscount > subtotal
    ) {
      setError(
        "Discount tidak boleh lebih besar dari subtotal."
      );
      return;
    }

    try {
      setSaving(true);

      const order =
        await createOrder({
          customerId: customer.id,

          ...(storageLocationId && {
            storageLocationId,
          }),

          ...(numericDiscount > 0 && {
            discount:
              numericDiscount,
          }),

          ...(notes.trim() && {
            notes: notes.trim(),
          }),

          items: items.map(
            (item) => ({
              serviceId:
                item.serviceId,

              description:
                item.description.trim(),

              quantity:
                Number(item.quantity),

              ...(item.notes.trim() && {
                notes:
                  item.notes.trim(),
              }),
            })
          ),
        });

      onCreated(order);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal membuat order"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loadingData) {
    return (
      <main className="create-order-page">
        <div className="page-loading">
          <div className="spinner" />
          <p>
            Menyiapkan form order...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="create-order-page">
      <header className="create-order-header">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          ← Kembali
        </button>

        <div>
          <h1>Buat Order</h1>
          <p>
            Tambahkan pesanan customer.
          </p>
        </div>
      </header>

      <section className="selected-customer-card">
        <div className="customer-avatar">
          {(customer.nickname ||
            customer.name)
            .charAt(0)
            .toUpperCase()}
        </div>

        <div>
          <span>Customer</span>

          <strong>
            {customer.nickname ||
              customer.name}
          </strong>

          <small>
            {customer.name}
            {" · "}
            {customer.phone}
          </small>
        </div>
      </section>

      {error && (
        <div className="create-order-error">
          <strong>Gagal</strong>
          <span>{error}</span>
        </div>
      )}

      <form
        className="create-order-form"
        onSubmit={handleSubmit}
      >
        <section className="create-order-section">
          <div className="section-heading">
            <div>
              <h2>Item Pesanan</h2>
              <p>
                Tambahkan pakaian atau barang
                customer.
              </p>
            </div>
          </div>

          <div className="order-items-form">
            {items.map(
              (item, index) => {
                const selectedService =
                  services.find(
                    (service) =>
                      service.id ===
                      item.serviceId
                  );

                const itemTotal =
                  getServicePrice(
                    item.serviceId
                  ) *
                  (Number(
                    item.quantity
                  ) || 0);

                return (
                  <div
                    className="order-item-form-card"
                    key={item.id}
                  >
                    <div className="item-form-header">
                      <strong>
                        Item {index + 1}
                      </strong>

                      {items.length >
                        1 && (
                        <button
                          type="button"
                          className="remove-item-button"
                          onClick={() =>
                            removeItem(
                              item.id
                            )
                          }
                        >
                          Hapus
                        </button>
                      )}
                    </div>

                    <label>
                      <span>Service</span>

                      <select
                        value={
                          item.serviceId
                        }
                        onChange={(event) =>
                          updateItem(
                            item.id,
                            "serviceId",
                            event.target.value
                          )
                        }
                      >
                        <option value="">
                          Pilih service
                        </option>

                        {services.map(
                          (service) => (
                            <option
                              key={
                                service.id
                              }
                              value={
                                service.id
                              }
                            >
                              {service.name} —{" "}
                              {formatCurrency(
                                Number(
                                  service.price
                                )
                              )}
                              /{" "}
                              {service.unit}
                            </option>
                          )
                        )}
                      </select>
                    </label>

                    {selectedService && (
                      <div className="selected-service-info">
                        <span>
                          Harga
                        </span>

                        <strong>
                          {formatCurrency(
                            Number(
                              selectedService.price
                            )
                          )}
                          {" / "}
                          {
                            selectedService.unit
                          }
                        </strong>
                      </div>
                    )}

                    <label>
                      <span>
                        Deskripsi Item
                      </span>

                      <input
                        type="text"
                        value={
                          item.description
                        }
                        onChange={(event) =>
                          updateItem(
                            item.id,
                            "description",
                            event.target.value
                          )
                        }
                        placeholder="Contoh: Baju hitam"
                      />
                    </label>

                    <div className="item-form-grid">
                      <label>
                        <span>
                          Quantity
                        </span>

                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={
                            item.quantity
                          }
                          onChange={(event) =>
                            updateItem(
                              item.id,
                              "quantity",
                              event.target.value
                            )
                          }
                        />
                      </label>

                      <div className="item-total-preview">
                        <span>
                          Subtotal
                        </span>

                        <strong>
                          {formatCurrency(
                            itemTotal
                          )}
                        </strong>
                      </div>
                    </div>

                    <label>
                      <span>
                        Catatan
                        <small>
                          {" "}
                          (opsional)
                        </small>
                      </span>

                      <textarea
                        value={
                          item.notes
                        }
                        onChange={(event) =>
                          updateItem(
                            item.id,
                            "notes",
                            event.target.value
                          )
                        }
                        placeholder="Contoh: noda di bagian lengan"
                        rows={2}
                      />
                    </label>
                  </div>
                );
              }
            )}
          </div>

          <button
            type="button"
            className="add-item-button"
            onClick={addItem}
          >
            + Tambah Item
          </button>
        </section>

        <section className="create-order-section">
          <div className="section-heading">
            <div>
              <h2>Penyimpanan</h2>
              <p>
                Tentukan lokasi penyimpanan
                order.
              </p>
            </div>
          </div>

          <select
            value={storageLocationId}
            onChange={(event) =>
              setStorageLocationId(
                event.target.value
              )
            }
          >
            <option value="">
              Pilih lokasi penyimpanan
            </option>

            {storageLocations.map(
              (location) => {
                const parts = [
                  location.zone,
                  location.rack,
                  location.shelf,
                  location.slot,
                ].filter(Boolean);

                return (
                  <option
                    key={location.id}
                    value={location.id}
                  >
                    {parts.length
                      ? parts.join(" / ")
                      : location.id}
                  </option>
                );
              }
            )}
          </select>
        </section>

        <section className="create-order-section">
          <div className="section-heading">
            <div>
              <h2>Pembayaran</h2>
              <p>
                Atur discount jika ada.
              </p>
            </div>
          </div>

          <label>
            <span>
              Discount
            </span>

            <input
              type="number"
              min="0"
              value={discount}
              onChange={(event) =>
                setDiscount(
                  event.target.value
                )
              }
              placeholder="0"
            />
          </label>

          <label>
            <span>
              Catatan Order
              <small>
                {" "}
                (opsional)
              </small>
            </span>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              placeholder="Catatan tambahan untuk order"
              rows={3}
            />
          </label>
        </section>

        <section className="order-total-card">
          <div>
            <span>Subtotal</span>
            <strong>
              {formatCurrency(
                subtotal
              )}
            </strong>
          </div>

          <div>
            <span>Discount</span>
            <strong>
              -{" "}
              {formatCurrency(
                numericDiscount
              )}
            </strong>
          </div>

          <div className="order-total-final">
            <span>Total</span>
            <strong>
              {formatCurrency(total)}
            </strong>
          </div>
        </section>

        <button
          type="submit"
          className="create-order-submit"
          disabled={
            saving ||
            items.length === 0
          }
        >
          {saving
            ? "Membuat Order..."
            : "Buat Order"}
        </button>
      </form>
    </main>
  );
}