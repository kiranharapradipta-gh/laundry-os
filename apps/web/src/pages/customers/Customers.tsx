import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  EmptyState,
  Input,
  Table,
} from "../../components/ui";

import { getCustomers } from "../../services/api/customers";
import type { Customer } from "../../types/customer";
import { formatDate } from "../../utils/format";

export function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomers(search);

      setCustomers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data pelanggan.",
      );
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchInput.trim());
  }

  function handleResetSearch() {
    setSearchInput("");
    setSearch("");
  }

  return (
    <div className="page customers-page">
      <div className="customers-container">
        {/* HEADER */}
        <section className="customers-hero">
          <div className="customers-hero-content">
            <span className="customers-eyebrow">CUSTOMERS</span>

            <h1>Pelanggan</h1>

            <p>
              Kelola data pelanggan, nomor kontak, dan riwayat
              pelanggan laundry kamu.
            </p>
          </div>

          <Button
            className="customers-primary-button"
            onClick={() => navigate("/customers/new")}
          >
            <span className="customers-button-icon">+</span>
            Pelanggan Baru
          </Button>
        </section>

        {/* SEARCH */}
        <Card className="customer-search-card">
          <form
            className="customer-search-form"
            onSubmit={handleSearch}
          >
            <div className="customer-search-field">
              <span className="customer-search-icon">
                ⌕
              </span>

              <Input
                placeholder="Cari nama, nickname, atau nomor HP..."
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(event.target.value)
                }
              />
            </div>

            <div className="customer-search-actions">
              <Button type="submit">
                Cari
              </Button>

              {search && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleResetSearch}
                >
                  Reset
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* ERROR */}
        {error && (
          <Card className="customer-error-card">
            <div className="customer-error-content">
              <div className="customer-error-icon">!</div>

              <div>
                <strong>Gagal memuat pelanggan</strong>
                <p>{error}</p>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => void loadCustomers()}
            >
              Coba Lagi
            </Button>
          </Card>
        )}

        {/* SUMMARY */}
        <section className="customer-summary">
          <div className="customer-summary-item">
            <span className="customer-summary-label">
              Total pelanggan
            </span>

            <strong>
              {loading ? "—" : customers.length}
            </strong>
          </div>

          {search && (
            <div className="customer-summary-item customer-summary-search">
              <span className="customer-summary-label">
                Hasil pencarian
              </span>

              <strong>
                {loading ? "—" : customers.length}
              </strong>

              <span className="customer-summary-query">
                “{search}”
              </span>
            </div>
          )}
        </section>

        {/* TABLE */}
        <Card className="no-padding customer-table-card">
          <div className="customer-table-header">
            <div>
              <span className="customer-table-eyebrow">
                CUSTOMER LIST
              </span>

              <h2>Daftar Pelanggan</h2>

              <p>
                Data pelanggan yang terdaftar di bisnis kamu.
              </p>
            </div>

            <span className="customer-table-count">
              {loading ? "Memuat..." : `${customers.length} pelanggan`}
            </span>
          </div>

          <div className="customer-table-wrapper">
            <Table<Customer>
              columns={[
                {
                  key: "name",
                  label: "Pelanggan",
                  render: (customer) => (
                    <div className="table-primary customer-table-primary">
                      <button
                        type="button"
                        className="customer-name-link"
                        onClick={() =>
                          navigate(`/customers/${customer.id}`)
                        }
                      >
                        {customer.name}
                      </button>

                      {customer.nickname && (
                        <span className="customer-nickname">
                          @{customer.nickname}
                        </span>
                      )}
                    </div>
                  ),
                },

                {
                  key: "phone",
                  label: "No. HP",
                  render: (customer) => (
                    <span className="customer-phone">
                      {customer.phone || "Belum ditambahkan"}
                    </span>
                  ),
                },

                {
                  key: "createdAt",
                  label: "Terdaftar",
                  render: (customer) => (
                    <span className="customer-date">
                      {customer.createdAt
                        ? formatDate(customer.createdAt)
                        : "-"}
                    </span>
                  ),
                },
              ]}
              data={customers}
              rowKey={(customer) => customer.id}
              loading={loading}
              empty={
                <EmptyState
                  title={
                    search
                      ? "Pelanggan tidak ditemukan"
                      : "Belum ada pelanggan"
                  }
                  description={
                    search
                      ? `Tidak ada pelanggan yang cocok dengan "${search}".`
                      : "Tambahkan pelanggan pertama untuk mulai membuat order."
                  }
                  action={
                    !search ? (
                      <Button
                        onClick={() =>
                          navigate("/customers/new")
                        }
                      >
                        + Tambah Pelanggan
                      </Button>
                    ) : undefined
                  }
                />
              }
            />
          </div>
        </Card>
      </div>
    </div>
  );
}