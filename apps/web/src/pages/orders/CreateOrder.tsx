import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  Input,
  Select,
} from "../../components/ui";
import { getCustomers } from "../../services/api/customers";
import { createOrder } from "../../services/api/orders";
import { getServices } from "../../services/api/services";
import type { Customer } from "../../types/customer";
import type { Service } from "../../types/service";
import { formatCurrency } from "../../utils/format";

interface OrderItemForm {
  serviceId: string;
  description: string;
  quantity: number;
  notes: string;
}

function createEmptyItem(): OrderItemForm {
  return {
    serviceId: "",
    description: "",
    quantity: 1,
    notes: "",
  };
}

export function CreateOrder() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<OrderItemForm[]>([
    createEmptyItem(),
  ]);
  const [discount, setDiscount] = useState("0");

  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const customerIdFromUrl = searchParams.get("customerId");

  const loadCustomer = useCallback(async () => {
    try {
      setLoadingData(true);
      setError("");

      const [customerData, serviceData] =
        await Promise.all([
          getCustomers(),
          getServices(),
        ]);

      setCustomers(customerData);
      setServices(serviceData);

      if (customerIdFromUrl) {
        const customerExists = customerData.some(
          (customer) => customer.id === customerIdFromUrl,
        );

        if (customerExists) {
          setCustomerId(customerIdFromUrl);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat data order.",
      );
    } finally {
      setLoadingData(false);
    }
  }, [])

  useEffect(() => {
    void loadCustomer();
  }, []);

  const customerOptions = useMemo(
    () => [
      {
        value: "",
        label: "Pilih pelanggan",
      },
      ...customers.map((customer) => ({
        value: customer.id,
        label: `${customer.name} — ${customer.phone}`,
      })),
    ],
    [customers],
  );

  const serviceOptions = useMemo(
    () => [
      {
        value: "",
        label: "Pilih layanan",
      },
      ...services.map((service) => ({
        value: service.id,
        label: `${service.name} — ${formatCurrency(
          Number(service.price),
        )}/${service.unit ?? "kg"}`,
      })),
    ],
    [services],
  );

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const service = services.find(
        (service) => service.id === item.serviceId,
      );

      if (!service) return total;

      return (
        total +
        Number(service.price) * item.quantity
      );
    }, 0);
  }, [items, services]);

  const discountAmount = Math.max(
    0,
    Number(discount) || 0,
  );

  const total = Math.max(
    0,
    subtotal - discountAmount,
  );

  function updateItem(
    index: number,
    field: keyof OrderItemForm,
    value: string | number,
  ) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function addItem() {
    setItems((current) => [
      ...current,
      createEmptyItem(),
    ]);
  }

  function removeItem(index: number) {
    setItems((current) =>
      current.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!customerId) {
      setError("Pelanggan wajib dipilih.");
      return;
    }

    if (items.length === 0) {
      setError("Minimal satu item harus ditambahkan.");
      return;
    }

    for (const item of items) {
      if (!item.serviceId) {
        setError("Semua item harus memiliki layanan.");
        return;
      }

      if (!item.description.trim()) {
        setError(
          "Deskripsi semua item harus diisi.",
        );
        return;
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        setError(
          "Quantity harus lebih besar dari 0.",
        );
        return;
      }
    }

    if (discountAmount > subtotal) {
      setError(
        "Diskon tidak boleh lebih besar dari subtotal.",
      );
      return;
    }

    try {
      setSubmitting(true);

      const order = await createOrder({
        customerId,
        discount: discountAmount,
        items: items.map((item) => ({
          serviceId: item.serviceId,
          description: item.description.trim(),
          quantity: item.quantity,
          ...(item.notes.trim()
            ? { notes: item.notes.trim() }
            : {}),
        })),
      });

      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal membuat order.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingData) {
    return (
      <div className="page">
        <Card className="create-order-loading">
          Memuat data pelanggan dan layanan...
        </Card>
      </div>
    );
  }

  return (
    <div className="page create-order-page">
      <div className="page-header">
        <div>
          <button
            type="button"
            className="back-link"
            onClick={() => navigate("/orders")}
          >
            ← Kembali ke Orders
          </button>

          <h2>Order Baru</h2>
          <p>
            Buat pesanan laundry baru untuk pelanggan.
          </p>
        </div>
      </div>

      {error && (
        <Card className="create-order-error">
          {error}
        </Card>
      )}

      <form
        className="create-order-layout"
        onSubmit={handleSubmit}
      >
        <div className="create-order-main">
          <Card>
            <div className="section-header">
              <div>
                <h3>Pelanggan</h3>
                <p>
                  Pilih pelanggan yang membuat order.
                </p>
              </div>
            </div>

            <div className="create-order-section-body">
              <Select
                label="Pelanggan"
                value={customerId}
                options={customerOptions}
                onChange={(event) =>
                  setCustomerId(event.target.value)
                }
              />
            </div>
          </Card>

          <Card>
            <div className="section-header">
              <div>
                <h3>Item Laundry</h3>
                <p>
                  Tambahkan layanan yang dipesan.
                </p>
              </div>
            </div>

            <div className="create-order-items">
              {items.map((item, index) => (
                <div
                  className="create-order-item"
                  key={index}
                >
                  <div className="create-order-item-header">
                    <strong>
                      Item {index + 1}
                    </strong>

                    {items.length > 1 && (
                      <button
                        type="button"
                        className="remove-item-button"
                        onClick={() =>
                          removeItem(index)
                        }
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  <div className="create-order-item-fields">
                    <Select
                      label="Layanan"
                      value={item.serviceId}
                      options={serviceOptions}
                      onChange={(event) =>
                        updateItem(
                          index,
                          "serviceId",
                          event.target.value,
                        )
                      }
                    />

                    <Input
                      label="Deskripsi"
                      placeholder="Contoh: Baju dan celana"
                      value={item.description}
                      onChange={(event) =>
                        updateItem(
                          index,
                          "description",
                          event.target.value,
                        )
                      }
                    />

                    <Input
                      label="Quantity"
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(
                          index,
                          "quantity",
                          Number(event.target.value),
                        )
                      }
                    />

                    <Input
                      label="Catatan"
                      placeholder="Opsional"
                      value={item.notes}
                      onChange={(event) =>
                        updateItem(
                          index,
                          "notes",
                          event.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={addItem}
              >
                + Tambah Item
              </Button>
            </div>
          </Card>
        </div>

        <div className="create-order-sidebar">
          <Card>
            <div className="section-header">
              <div>
                <h3>Ringkasan</h3>
                <p>
                  Total order sebelum disimpan.
                </p>
              </div>
            </div>

            <div className="order-summary">
              <div>
                <span>Subtotal</span>
                <strong>
                  {formatCurrency(subtotal)}
                </strong>
              </div>

              <div className="discount-field">
                <Input
                  label="Diskon"
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(event) =>
                    setDiscount(event.target.value)
                  }
                />
              </div>

              <div className="order-summary-total">
                <span>Total</span>
                <strong>
                  {formatCurrency(total)}
                </strong>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="create-order-submit"
              >
                {submitting
                  ? "Menyimpan..."
                  : "Simpan Order"}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}