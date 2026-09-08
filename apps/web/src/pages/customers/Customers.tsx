import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  EmptyState,
  Input,
  Loading,
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

  return (
    <div className="page customers-page">
      <div className="page-header">
        <div>
          <h1>Pelanggan</h1>
          <p>Kelola data pelanggan laundry kamu.</p>
        </div>

        <Button onClick={() => navigate("/customers/new")}>
          + Pelanggan Baru
        </Button>
      </div>

      <Card>
        <form className="customer-search" onSubmit={handleSearch}>
          <Input
            placeholder="Cari nama, nickname, atau nomor HP..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />

          <Button type="submit">
            Cari
          </Button>

          {search && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSearchInput("");
                setSearch("");
              }}
            >
              Reset
            </Button>
          )}
        </form>
      </Card>

      {error && (
        <Card>
          <div className="page-error">
            <strong>Gagal memuat pelanggan</strong>
            <span>{error}</span>

            <Button
              variant="secondary"
              onClick={() => void loadCustomers()}
            >
              Coba Lagi
            </Button>
          </div>
        </Card>
      )}

      <Card className="customers-table-card">
        {loading ? (
          <Loading />
        ) : customers.length === 0 ? (
          <EmptyState
            title="Belum ada pelanggan"
            description={
              search
                ? `Tidak ada pelanggan yang cocok dengan "${search}".`
                : "Tambahkan pelanggan pertama untuk mulai membuat order."
            }
            action={
              !search ? (
                <Button onClick={() => navigate("/customers/new")}>
                  Tambah Pelanggan
                </Button>
              ) : undefined
            }
          />
        ) : (
          <Table
            columns={[
              {
                key: "name",
                label: "Pelanggan",
                render: (customer) => (
                  <div className="customer-name-cell">
                    <strong>{customer.name}</strong>

                    {customer.nickname && (
                      <span>@{customer.nickname}</span>
                    )}
                  </div>
                ),
              },
              {
                key: "phone",
                label: "No. HP",
                render: (customer) => customer.phone || "-",
              },
              {
                key: "createdAt",
                label: "Terdaftar",
                render: (customer) =>
                  customer.createdAt
                    ? formatDate(customer.createdAt)
                    : "-",
              },
              {
                key: "actions",
                label: "",
                render: (customer) => (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigate(`/customers/${customer.id}`)
                    }
                  >
                    Detail
                  </Button>
                ),
              },
            ]}
            data={customers}
            rowKey={(customer) => customer.id}
          />
        )}
      </Card>
    </div>
  );
}