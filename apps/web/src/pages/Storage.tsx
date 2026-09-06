import { useEffect, useMemo, useState } from "react";
import type {
  CreateStorageInput,
  StorageLocation,
  UpdateStorageInput,
} from "../types/storage";
import {
  createStorage,
  getStorageLocations,
  updateStorage,
} from "../api/storage.api";
import "../styles/storage.css";
import StorageTable from "../components/storage/StorageTable";
import StorageModal from "../components/storage/StorageModal";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function Storage() {
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<StorageLocation | null>(null);

  async function loadStorage() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getStorageLocations(true);

      setLocations(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data storage.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStorage();
  }, []);

  const filteredLocations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return locations.filter((location) => {
      const query = search.trim().toLowerCase();

      if (!query) {
        return true;
      }

      const assignment = location.assignments?.[0];

      return [
        location.zone,
        location.rack,
        location.shelf,
        location.slot,
        location.id,

        assignment?.order?.orderNumber,

        assignment?.order?.customer?.name,
        assignment?.order?.customer?.nickname,
        assignment?.order?.customer?.phone,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(keyword),
        );
    });
  }, [locations, search, showInactive]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredLocations.length / pageSize,
    ),
  );

  const paginatedLocations =
    filteredLocations.slice(
      (page - 1) * pageSize,
      page * pageSize,
    );

  const activeCount = locations.filter(
    (location) => location.isActive,
  ).length;

  const inactiveCount =
    locations.length - activeCount;

  const occupiedCount = locations.filter(
    (location) =>
      (location.assignments?.length ?? 0) > 0,
  ).length;

  const emptyCount =
    locations.length - occupiedCount;

  function openCreateModal() {
    setEditingLocation(null);
    setShowModal(true);
  }

  function openEditModal(
    location: StorageLocation,
  ) {
    setEditingLocation(location);
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    setEditingLocation(null);
  }

  async function handleSubmit(
    data:
      | CreateStorageInput
      | UpdateStorageInput,
  ) {
    setSaving(true);

    try {
      if (editingLocation) {
        const updated =
          await updateStorage(
            editingLocation.id,
            data as UpdateStorageInput,
          );

        setLocations((current) =>
          current.map((location) =>
            location.id === updated.id
              ? updated
              : location,
          ),
        );
      } else {
        const created =
          await createStorage(
            data as CreateStorageInput,
          );

        setLocations((current) => [
          created,
          ...current,
        ]);
      }

      await loadStorage();

      setShowModal(false);
      setEditingLocation(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(
    location: StorageLocation,
  ) {
    const nextStatus = !location.isActive;

    try {
      const updated =
        await updateStorage(location.id, {
          isActive: nextStatus,
        });

      setLocations((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengubah status storage.",
      );
    }
  }

  function handleSearch(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setSearch(event.target.value);
    setPage(1);
  }

  function handlePageSizeChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    setPageSize(Number(event.target.value));
    setPage(1);
  }

  return (
    <div className="storage-page">
      <div className="storage-page-header">
        <div>
          <div className="storage-eyebrow">
            INVENTORY
          </div>

          <h1>Storage</h1>

          <p>
            Kelola lokasi penyimpanan pakaian
            pelanggan.
          </p>
        </div>

        <button
          type="button"
          className="storage-add-btn"
          onClick={openCreateModal}
        >
          <span>+</span>
          Tambah Lokasi
        </button>
      </div>

      <div className="storage-stats">
        <div className="storage-stat-card">
          <div className="storage-stat-icon">
            📦
          </div>

          <div>
            <span>Total Lokasi</span>
            <strong>{locations.length}</strong>
          </div>
        </div>

        <div className="storage-stat-card">
          <div className="storage-stat-icon">
            ✓
          </div>

          <div>
            <span>Lokasi Aktif</span>
            <strong>{activeCount}</strong>
          </div>
        </div>

        <div className="storage-stat-card">
          <div className="storage-stat-icon">
            ◌
          </div>

          <div>
            <span>Lokasi Nonaktif</span>
            <strong>{inactiveCount}</strong>
          </div>
        </div>

        <div className="storage-stat-card">
          <div className="storage-stat-icon">
            ●
          </div>

          <div>
            <span>Terisi</span>
            <strong>{occupiedCount}</strong>
          </div>
        </div>

        <div className="storage-stat-card">
          <div className="storage-stat-icon">
            ○
          </div>

          <div>
            <span>Kosong</span>
            <strong>{emptyCount}</strong>
          </div>
        </div>

        <div className="storage-stat-card">
          <div className="storage-stat-icon">
            ◇
          </div>

          <div>
            <span>Ditampilkan</span>
            <strong>
              {filteredLocations.length}
            </strong>
          </div>
        </div>
      </div>

      <div className="storage-toolbar">
        <div className="storage-search">
          <span>⌕</span>

          <input
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder="Cari zone, rak, shelf, slot..."
          />
        </div>

        <label className="storage-inactive-toggle">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(event) => {
              setShowInactive(
                event.target.checked,
              );
              setPage(1);
            }}
          />

          <span>
            Tampilkan nonaktif
          </span>
        </label>
      </div>

      {error && (
        <div className="storage-error">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}

      <div className="storage-card">
        {loading ? (
          <div className="storage-state">
            <div className="storage-spinner" />
            <strong>
              Memuat storage...
            </strong>
            <span>
              Tunggu sebentar.
            </span>
          </div>
        ) : filteredLocations.length ===
          0 ? (
          <div className="storage-state">
            <div className="storage-empty-icon">
              📦
            </div>

            <strong>
              {search
                ? "Lokasi tidak ditemukan"
                : "Belum ada lokasi storage"}
            </strong>

            <span>
              {search
                ? "Coba gunakan kata kunci lain."
                : "Tambahkan lokasi pertama untuk mulai mengatur storage."}
            </span>

            {!search && (
              <button
                type="button"
                onClick={openCreateModal}
              >
                + Tambah Lokasi
              </button>
            )}
          </div>
        ) : (
          <>
            <StorageTable
              locations={paginatedLocations}
              onEdit={openEditModal}
              onToggle={handleToggle}
            />

            <div className="storage-pagination">
              <div className="storage-pagination-info">
                Menampilkan{" "}
                <strong>
                  {Math.min(
                    (page - 1) * pageSize + 1,
                    filteredLocations.length,
                  )}
                </strong>{" "}
                –{" "}
                <strong>
                  {Math.min(
                    page * pageSize,
                    filteredLocations.length,
                  )}
                </strong>{" "}
                dari{" "}
                <strong>
                  {filteredLocations.length}
                </strong>
              </div>

              <div className="storage-pagination-controls">
                <label>
                  <span>Per halaman</span>

                  <select
                    value={pageSize}
                    onChange={
                      handlePageSizeChange
                    }
                  >
                    {PAGE_SIZE_OPTIONS.map(
                      (size) => (
                        <option
                          key={size}
                          value={size}
                        >
                          {size}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(1, current - 1),
                    )
                  }
                >
                  ‹
                </button>

                <span className="storage-page-number">
                  {page} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    page >= totalPages
                  }
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        totalPages,
                        current + 1,
                      ),
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

      <StorageModal
        open={showModal}
        location={editingLocation}
        loading={saving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}