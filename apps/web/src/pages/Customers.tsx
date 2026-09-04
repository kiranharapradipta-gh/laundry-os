import {
  useEffect,
  useState,
} from "react";

import {
  createCustomer,
  getCustomers,
  type Customer,
} from "../api/client";

interface CustomersProps {
  onOpenCustomer?: (
    customer: Customer
  ) => void;
}

export default function Customers({
  onOpenCustomer,
}: CustomersProps) {
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [createError, setCreateError] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [name, setName] =
    useState("");

  const [nickname, setNickname] =
    useState("");

  async function loadCustomers(
    keyword?: string
  ) {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCustomers(keyword);

      setCustomers(data);
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
    const timer =
      window.setTimeout(() => {
        loadCustomers(search);
      }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search]);

  function openCreateModal() {
    setPhone("");
    setName("");
    setNickname("");
    setCreateError("");
    setShowCreateModal(true);
  }

  function closeCreateModal() {
    if (creating) {
      return;
    }

    setShowCreateModal(false);
  }

  async function handleCreate(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!phone.trim()) {
      setCreateError(
        "Nomor WhatsApp wajib diisi"
      );
      return;
    }

    if (!name.trim()) {
      setCreateError(
        "Nama customer wajib diisi"
      );
      return;
    }

    try {
      setCreating(true);
      setCreateError("");

      await createCustomer({
        phone: phone.trim(),
        name: name.trim(),
        ...(nickname.trim() && {
          nickname: nickname.trim(),
        }),
      });

      setShowCreateModal(false);

      setPhone("");
      setName("");
      setNickname("");

      await loadCustomers(search);
    } catch (error) {
      setCreateError(
        error instanceof Error
          ? error.message
          : "Gagal membuat customer"
      );
    } finally {
      setCreating(false);
    }
  }

  function formatDate(
    value: string
  ) {
    return new Intl.DateTimeFormat(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(value));
  }

  return (
    <main className="customers-page">
      <header className="customers-header">
        <div>
          <h1>Customers</h1>

          <p>
            Kelola semua customer laundry.
          </p>
        </div>
      </header>

      <section className="customers-toolbar">
        <div className="customer-search">
          <span>⌕</span>

          <input
            type="search"
            placeholder="Cari nama, nickname, atau nomor HP..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
            >
              ×
            </button>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <div className="customers-count">
            {loading
              ? "Memuat..."
              : `${customers.length} customer`}
          </div>

          <div>
            <button
              type="button"
              className="add-customer-button"
              onClick={openCreateModal}
            >
              <span>+</span>
              Customer
            </button>
          </div>
        </div>

      </section>

      {loading && (
        <section className="customers-state">
          <div className="spinner" />

          <p>
            Memuat customer...
          </p>
        </section>
      )}

      {!loading && error && (
        <section className="customers-state customers-error">
          <div className="customers-state-icon">
            ⚠️
          </div>

          <strong>
            Gagal memuat customer
          </strong>

          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              loadCustomers(search)
            }
          >
            Coba Lagi
          </button>
        </section>
      )}

      {!loading &&
        !error &&
        customers.length === 0 && (
          <section className="customers-state">
            <div className="customers-state-icon">
              👥
            </div>

            <strong>
              {search
                ? "Customer tidak ditemukan"
                : "Belum ada customer"}
            </strong>

            <p>
              {search
                ? "Coba gunakan kata kunci pencarian lain."
                : "Tambahkan customer pertama kamu."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={openCreateModal}
              >
                + Tambah Customer
              </button>
            )}
          </section>
        )}

      {!loading &&
        !error &&
        customers.length > 0 && (
          <section className="customers-list">
            {customers.map(
              (customer) => {
                const displayName =
                  customer.nickname ||
                  customer.name;

                return (
                  <button
                    type="button"
                    className="customer-card"
                    key={customer.id}
                    onClick={() =>
                      onOpenCustomer?.(
                        customer
                      )
                    }
                  >
                    <div className="customer-card-avatar">
                      {displayName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="customer-card-content">
                      <div className="customer-card-main">
                        <strong>
                          {displayName}
                        </strong>

                        {customer.nickname &&
                          customer.nickname !==
                            customer.name && (
                            <span>
                              {customer.name}
                            </span>
                          )}
                      </div>

                      <div className="customer-card-meta">
                        <span>
                          📱 {customer.phone}
                        </span>

                        <span>
                          Customer sejak{" "}
                          {formatDate(
                            customer.createdAt
                          )}
                        </span>
                      </div>
                    </div>

                    <span className="customer-card-arrow">
                      →
                    </span>
                  </button>
                );
              }
            )}
          </section>
        )}

      {showCreateModal && (
        <div
          className="customer-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeCreateModal();
            }
          }}
        >
          <section className="customer-modal">
            <div className="customer-modal-header">
              <div>
                <h2>
                  Tambah Customer
                </h2>

                <p>
                  Daftarkan customer baru.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={creating}
              >
                ×
              </button>
            </div>

            <form
              className="customer-form"
              onSubmit={handleCreate}
            >
              <div className="customer-form-group">
                <label htmlFor="customer-phone">
                  Nomor WhatsApp
                </label>

                <input
                  id="customer-phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value
                    )
                  }
                  disabled={creating}
                  autoFocus
                />
              </div>

              <div className="customer-form-group">
                <label htmlFor="customer-name">
                  Nama
                </label>

                <input
                  id="customer-name"
                  type="text"
                  placeholder="Nama lengkap customer"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  disabled={creating}
                />
              </div>

              <div className="customer-form-group">
                <label htmlFor="customer-nickname">
                  Nickname
                  <span>Opsional</span>
                </label>

                <input
                  id="customer-nickname"
                  type="text"
                  placeholder="Nama panggilan"
                  value={nickname}
                  onChange={(event) =>
                    setNickname(
                      event.target.value
                    )
                  }
                  disabled={creating}
                />
              </div>

              {createError && (
                <div className="customer-form-error">
                  {createError}
                </div>
              )}

              <div className="customer-form-actions">
                <button
                  type="button"
                  className="customer-cancel-button"
                  onClick={
                    closeCreateModal
                  }
                  disabled={creating}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="customer-save-button"
                  disabled={creating}
                >
                  {creating
                    ? "Menyimpan..."
                    : "Simpan Customer"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}