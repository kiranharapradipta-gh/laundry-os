import {
  useEffect,
  useState,
} from "react";

import {
  getCustomerById,
  updateCustomer,
  type Customer,
} from "../api/client";

interface CustomerDetailProps {
  customerId: string;
  onBack: () => void;
  onCreateOrder: (customer: Customer) => void;
}

export default function CustomerDetail({
  customerId,
  onBack,
  onCreateOrder,
}: CustomerDetailProps) {
  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [name, setName] =
    useState("");

  const [nickname, setNickname] =
    useState("");

  async function loadCustomer() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCustomerById(
          customerId
        );

      setCustomer(data);

      setPhone(data.phone);
      setName(data.name);
      setNickname(
        data.nickname ?? ""
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil customer"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  function startEditing() {
    if (!customer) {
      return;
    }

    setPhone(customer.phone);
    setName(customer.name);
    setNickname(
      customer.nickname ?? ""
    );

    setSaveError("");
    setEditing(true);
  }

  function cancelEditing() {
    if (!customer) {
      return;
    }

    setPhone(customer.phone);
    setName(customer.name);
    setNickname(
      customer.nickname ?? ""
    );

    setSaveError("");
    setEditing(false);
  }

  async function handleSave(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!phone.trim()) {
      setSaveError(
        "Nomor WhatsApp wajib diisi"
      );
      return;
    }

    if (!name.trim()) {
      setSaveError(
        "Nama customer wajib diisi"
      );
      return;
    }

    try {
      setSaving(true);
      setSaveError("");

      const updated =
        await updateCustomer(
          customerId,
          {
            phone: phone.trim(),
            name: name.trim(),
            nickname:
              nickname.trim(),
          }
        );

      setCustomer(updated);
      setEditing(false);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Gagal mengupdate customer"
      );
    } finally {
      setSaving(false);
    }
  }

  function formatDate(
    value: string
  ) {
    return new Intl.DateTimeFormat(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ).format(new Date(value));
  }

  if (loading) {
    return (
      <main className="customer-detail-page">
        <section className="customer-detail-state">
          <div className="spinner" />

          <p>
            Memuat customer...
          </p>
        </section>
      </main>
    );
  }

  if (error || !customer) {
    return (
      <main className="customer-detail-page">
        <button
          type="button"
          className="customer-back-button"
          onClick={onBack}
        >
          ← Kembali
        </button>

        <section className="customer-detail-state customer-detail-error">
          <div className="customers-state-icon">
            ⚠️
          </div>

          <strong>
            Gagal memuat customer
          </strong>

          <p>
            {error ||
              "Customer tidak ditemukan"}
          </p>

          <button
            type="button"
            onClick={loadCustomer}
          >
            Coba Lagi
          </button>
        </section>
      </main>
    );
  }

  const displayName =
    customer.nickname ||
    customer.name;

  return (
    <main className="customer-detail-page">
      <header className="customer-detail-header">

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            type="button"
            className="customer-back-button"
            onClick={onBack}
          >
            ← Kembali
          </button>

          <button
            type="button"
            className="create-order-button"
            onClick={() => {
              onCreateOrder(customer);
            }}
          >
            + Buat Order
          </button>
        </div>

        <div className="customer-detail-heading">
          <div className="customer-detail-avatar">
            {displayName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <span>Customer</span>

            <h1>{displayName}</h1>

            {customer.nickname &&
              customer.nickname !==
                customer.name && (
                <p>
                  {customer.name}
                </p>
              )}
          </div>
        </div>
      </header>

      <section className="customer-detail-card">
        <div className="customer-detail-card-header">
          <div>
            <h2>Informasi Customer</h2>

            <p>
              Data customer yang
              tersimpan di LaundryOS.
            </p>
          </div>

          {!editing && (
            <button
              type="button"
              className="customer-edit-button"
              onClick={startEditing}
            >
              Edit
            </button>
          )}
        </div>

        {!editing ? (
          <div className="customer-info-list">
            <div className="customer-info-row">
              <span>Nama</span>
              <strong>
                {customer.name}
              </strong>
            </div>

            <div className="customer-info-row">
              <span>Nickname</span>
              <strong>
                {customer.nickname ||
                  "-"}
              </strong>
            </div>

            <div className="customer-info-row">
              <span>Nomor WhatsApp</span>
              <strong>
                {customer.phone}
              </strong>
            </div>

            <div className="customer-info-row">
              <span>Terdaftar Sejak</span>
              <strong>
                {formatDate(
                  customer.createdAt
                )}
              </strong>
            </div>
          </div>
        ) : (
          <form
            className="customer-edit-form"
            onSubmit={handleSave}
          >
            <div className="customer-form-group">
              <label htmlFor="edit-customer-phone">
                Nomor WhatsApp
              </label>

              <input
                id="edit-customer-phone"
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                disabled={saving}
              />
            </div>

            <div className="customer-form-group">
              <label htmlFor="edit-customer-name">
                Nama
              </label>

              <input
                id="edit-customer-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                disabled={saving}
              />
            </div>

            <div className="customer-form-group">
              <label htmlFor="edit-customer-nickname">
                Nickname
              </label>

              <input
                id="edit-customer-nickname"
                type="text"
                placeholder="Opsional"
                value={nickname}
                onChange={(event) =>
                  setNickname(
                    event.target.value
                  )
                }
                disabled={saving}
              />
            </div>

            {saveError && (
              <div className="customer-form-error">
                {saveError}
              </div>
            )}

            <div className="customer-form-actions">
              <button
                type="button"
                className="customer-cancel-button"
                onClick={
                  cancelEditing
                }
                disabled={saving}
              >
                Batal
              </button>

              <button
                type="submit"
                className="customer-save-button"
                disabled={saving}
              >
                {saving
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="customer-detail-card">
        <div className="customer-detail-card-header">
          <div>
            <h2>Riwayat Order</h2>

            <p>
              Riwayat pesanan customer
              akan ditampilkan di sini.
            </p>
          </div>
        </div>

        <div className="customer-order-placeholder">
          <div>
            📦
          </div>

          <strong>
            Riwayat order
          </strong>

          <span>
            Kita sambungkan ke order
            customer di tahap berikutnya.
          </span>
        </div>
      </section>
    </main>
  );
}