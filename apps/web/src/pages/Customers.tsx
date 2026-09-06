import { useEffect, useMemo, useState } from "react";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
} from "../api/customers.api";

import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../types/customer";

import "../styles/customers.css";
import CustomerTable from "../components/customers/CustomerTable";
import CustomerModal from "../components/customers/CustomerModal";

const PAGE_SIZES = [5, 10, 20];

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(
    [],
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomers();

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
  }

  useEffect(() => {
    void loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name
          .toLowerCase()
          .includes(keyword) ||
        customer.phone
          .toLowerCase()
          .includes(keyword) ||
        customer.nickname
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [customers, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / pageSize),
  );

  const visibleCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredCustomers.slice(
      start,
      start + pageSize,
    );
  }, [filteredCustomers, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function openCreate() {
    setEditingCustomer(null);
    setShowModal(true);
  }

  function openEdit(customer: Customer) {
    setEditingCustomer(customer);
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setEditingCustomer(null);
  }

  async function handleSubmit(
    data: CreateCustomerInput | UpdateCustomerInput,
  ) {
    setSaving(true);

    try {
      if (editingCustomer) {
        const updated = await updateCustomer(
          editingCustomer.id,
          data,
        );

        setCustomers((current) =>
          current.map((customer) =>
            customer.id === updated.id
              ? updated
              : customer,
          ),
        );
      } else {
        const created = await createCustomer(
          data as CreateCustomerInput,
        );

        setCustomers((current) => [
          created,
          ...current,
        ]);

        setPage(1);
      }

      setShowModal(false);
      setEditingCustomer(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="customers-page">
      <div className="page-heading">
        <div>
          <div className="breadcrumb">
            Dashboard <span>/</span> Customers
          </div>

          <h1>Pelanggan</h1>

          <p>
            Kelola data pelanggan laundry kamu.
          </p>
        </div>

        <button
          type="button"
          className="button button-primary"
          onClick={openCreate}
        >
          <span>+</span>
          Tambah Pelanggan
        </button>
      </div>

      <div className="customers-stats">
        <div className="customer-stat">
          <div className="customer-stat-icon">
            👤
          </div>

          <div>
            <span>Total Pelanggan</span>
            <strong>{customers.length}</strong>
          </div>
        </div>

        <div className="customer-stat">
          <div className="customer-stat-icon">
            🔎
          </div>

          <div>
            <span>Hasil Pencarian</span>
            <strong>
              {search
                ? filteredCustomers.length
                : "-"}
            </strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="page-error">
          <div>
            <strong>Gagal memuat pelanggan</strong>
            <span>{error}</span>
          </div>

          <button
            type="button"
            className="button button-secondary"
            onClick={() => void loadCustomers()}
          >
            Coba Lagi
          </button>
        </div>
      )}

      <div className="customers-card">
        <div className="customers-toolbar">
          <div className="customers-search">
            <span>⌕</span>

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Cari nama, nomor HP, atau panggilan..."
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
              >
                ×
              </button>
            )}
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={() => void loadCustomers()}
            disabled={loading}
          >
            ↻
          </button>
        </div>

        {loading ? (
          <div className="customers-loading">
            <Spinner />
            <span>Memuat pelanggan...</span>
          </div>
        ) : visibleCustomers.length === 0 ? (
          <EmptyState
            title={
              search
                ? "Pelanggan tidak ditemukan"
                : "Belum ada pelanggan"
            }
            description={
              search
                ? "Coba gunakan kata pencarian lain."
                : "Tambahkan pelanggan pertama kamu."
            }
          />
        ) : (
          <>
            <CustomerTable
              customers={visibleCustomers}
              onEdit={openEdit}
            />

            <div className="customers-pagination">
              <div>
                Menampilkan{" "}
                <strong>
                  {(page - 1) * pageSize + 1}
                </strong>{" "}
                -{" "}
                <strong>
                  {Math.min(
                    page * pageSize,
                    filteredCustomers.length,
                  )}
                </strong>{" "}
                dari{" "}
                <strong>
                  {filteredCustomers.length}
                </strong>
              </div>

              <div className="pagination-controls">
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(
                      Number(event.target.value),
                    );
                    setPage(1);
                  }}
                >
                  {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size} / halaman
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((value) => value - 1)
                  }
                >
                  ‹
                </button>

                <span>
                  {page} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((value) => value + 1)
                  }
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <CustomerModal
        open={showModal}
        customer={editingCustomer}
        loading={saving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}