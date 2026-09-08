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
    <div className="page">
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
        <form className="toolbar" onSubmit={handleSearch}>
          <div className="toolbar-main">
            <Input
              placeholder="Cari nama, nickname, atau nomor HP..."
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
            />
          </div>

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
        </form>
      </Card>

      {error && (
        <Card className="page-error">
          <div className="page-error-content">
            <strong>Gagal memuat pelanggan</strong>
            <p>{error}</p>
          </div>

          <Button
            variant="secondary"
            onClick={() => void loadCustomers()}
          >
            Coba Lagi
          </Button>
        </Card>
      )}

      <Card className="no-padding">
        <div className="section-header table-section-header">
          <div className="section-header-content">
            <h3>Daftar Pelanggan</h3>
            <p>{customers.length} pelanggan</p>
          </div>
        </div>

        <Table<Customer>
          columns={[
            {
              key: "name",
              label: "Pelanggan",
              render: (customer) => (
                <div className="table-primary">
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
              render: (customer) =>
                customer.phone || "-",
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
          loading={loading}
          empty={
            <EmptyState
              title="Belum ada pelanggan"
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
                    Tambah Pelanggan
                  </Button>
                ) : undefined
              }
            />
          }
        />
      </Card>
    </div>
  );
}