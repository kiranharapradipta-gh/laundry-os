import { useEffect, useMemo, useState } from "react";
import {
  createService,
  getServices,
  updateService,
} from "../api/services.api";
import type {
  CreateServiceInput,
  LaundryService,
  UpdateServiceInput,
} from "../types/service";
import { formatRupiah } from "../utils/format";
import "../styles/services.css";
import ServiceTable from "../components/services/ServiceTable";
import ServiceModal from "../components/services/ServiceModal";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function Services() {
  const [services, setServices] = useState<LaundryService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] =
    useState<LaundryService | null>(null);

  async function loadServices() {
    try {
      setLoading(true);
      setError("");

      const data = await getServices(true);
      setServices(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data layanan.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !keyword ||
        service.name.toLowerCase().includes(keyword) ||
        service.description?.toLowerCase().includes(keyword) ||
        service.unit?.toLowerCase().includes(keyword);

      const matchesStatus =
        showInactive || service.isActive;

      return matchesSearch && matchesStatus;
    });
  }, [services, search, showInactive]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / pageSize),
  );

  const paginatedServices = filteredServices.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const activeCount = services.filter(
    (service) => service.isActive,
  ).length;

  const inactiveCount = services.length - activeCount;

  const averagePrice =
    services.length > 0
      ? services.reduce(
          (total, service) => total + Number(service.price),
          0,
        ) / services.length
      : 0;

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handlePageSize(value: number) {
    setPageSize(value);
    setPage(1);
  }

  function openCreateModal() {
    setEditingService(null);
    setModalOpen(true);
  }

  function openEditModal(service: LaundryService) {
    setEditingService(service);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingService(null);
  }

  async function handleSubmit(
    data: CreateServiceInput | UpdateServiceInput,
  ) {
    try {
      setSaving(true);

      if (editingService) {
        const updated = await updateService(
          editingService.id,
          data as UpdateServiceInput,
        );

        setServices((current) =>
          current.map((service) =>
            service.id === updated.id ? updated : service,
          ),
        );
      } else {
        const created = await createService(
          data as CreateServiceInput,
        );

        setServices((current) => [created, ...current]);
      }

      setModalOpen(false);
      setEditingService(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(service: LaundryService) {
    const action = service.isActive
      ? "menonaktifkan"
      : "mengaktifkan";

    const confirmed = window.confirm(
      `Yakin ingin ${action} layanan "${service.name}"?`,
    );

    if (!confirmed) return;

    try {
      const updated = await updateService(service.id, {
        isActive: !service.isActive,
      });

      setServices((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      );
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Gagal mengubah status layanan.",
      );
    }
  }

  return (
    <div className="services-page">
      <div className="services-page-header">
        <div>
          <span className="services-eyebrow">MASTER DATA</span>
          <h1>Layanan</h1>
          <p>
            Kelola jenis layanan laundry dan harga yang digunakan
            pada order.
          </p>
        </div>

        <button
          type="button"
          className="services-add-btn"
          onClick={openCreateModal}
        >
          <span>+</span>
          Tambah Layanan
        </button>
      </div>

      <div className="services-stats">
        <div className="service-stat-card">
          <div className="service-stat-icon">◈</div>
          <div>
            <span>Total Layanan</span>
            <strong>{services.length}</strong>
          </div>
        </div>

        <div className="service-stat-card">
          <div className="service-stat-icon">✓</div>
          <div>
            <span>Layanan Aktif</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="service-stat-card">
          <div className="service-stat-icon">○</div>
          <div>
            <span>Nonaktif</span>
            <strong>{inactiveCount}</strong>
          </div>
        </div>

        <div className="service-stat-card">
          <div className="service-stat-icon">Rp</div>
          <div>
            <span>Rata-rata Harga</span>
            <strong>{formatRupiah(averagePrice)}</strong>
          </div>
        </div>
      </div>

      <div className="services-panel">
        <div className="services-toolbar">
          <div className="services-search">
            <span>⌕</span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                handleSearch(event.target.value)
              }
              placeholder="Cari layanan..."
            />
          </div>

          <label className="services-show-inactive">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(event) => {
                setShowInactive(event.target.checked);
                setPage(1);
              }}
            />

            Tampilkan nonaktif
          </label>
        </div>

        {loading ? (
          <div className="services-state">
            <div className="services-spinner" />
            <span>Memuat layanan...</span>
          </div>
        ) : error ? (
          <div className="services-state services-state-error">
            <strong>Gagal memuat layanan</strong>
            <span>{error}</span>

            <button
              type="button"
              onClick={loadServices}
            >
              Coba Lagi
            </button>
          </div>
        ) : paginatedServices.length === 0 ? (
          <div className="services-state">
            <div className="services-empty-icon">◌</div>

            <strong>
              {search
                ? "Layanan tidak ditemukan"
                : "Belum ada layanan"}
            </strong>

            <span>
              {search
                ? "Coba gunakan kata kunci lain."
                : "Tambahkan layanan pertama untuk mulai membuat order."}
            </span>

            {!search && (
              <button
                type="button"
                onClick={openCreateModal}
              >
                Tambah Layanan
              </button>
            )}
          </div>
        ) : (
          <>
            <ServiceTable
              services={paginatedServices}
              onEdit={openEditModal}
              onToggle={handleToggle}
            />

            <div className="services-pagination">
              <div className="services-pagination-info">
                Menampilkan{" "}
                <strong>
                  {(page - 1) * pageSize + 1}
                </strong>
                {"–"}
                <strong>
                  {Math.min(
                    page * pageSize,
                    filteredServices.length,
                  )}
                </strong>{" "}
                dari{" "}
                <strong>{filteredServices.length}</strong>{" "}
                layanan
              </div>

              <div className="services-pagination-controls">
                <select
                  value={pageSize}
                  onChange={(event) =>
                    handlePageSize(
                      Number(event.target.value),
                    )
                  }
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} / halaman
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(1, current - 1),
                    )
                  }
                >
                  ‹
                </button>

                <span>
                  {page} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((current) =>
                      Math.min(totalPages, current + 1),
                    )
                  }
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <ServiceModal
        open={modalOpen}
        service={editingService}
        loading={saving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}