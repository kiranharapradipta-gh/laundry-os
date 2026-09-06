import {
  useEffect,
  useState,
} from "react";

import {
  createStorageLocation,
  getStorageLocations,
  updateStorageLocation,
  type StorageLocation,
} from "../api/client";

interface StorageForm {
  zone: string;
  rack: string;
  shelf: string;
  slot: string;
}

const emptyForm: StorageForm = {
  zone: "",
  rack: "",
  shelf: "",
  slot: "",
};

function getLocationName(
  location: StorageLocation
) {
  const parts = [
    location.zone,
    location.rack,
    location.shelf,
    location.slot,
  ].filter(Boolean);

  return parts.length > 0
    ? parts.join(" / ")
    : "Lokasi tanpa nama";
}

export default function Storage() {
  const [locations, setLocations] =
    useState<StorageLocation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingLocation, setEditingLocation] =
    useState<StorageLocation | null>(null);

  const [form, setForm] =
    useState<StorageForm>(emptyForm);

  async function loadLocations() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getStorageLocations();

      setLocations(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil lokasi storage"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLocations();
  }, []);

  function openCreateModal() {
    setEditingLocation(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  }

  function openEditModal(
    location: StorageLocation
  ) {
    setEditingLocation(location);

    setForm({
      zone: location.zone ?? "",
      rack: location.rack ?? "",
      shelf: location.shelf ?? "",
      slot: location.slot ?? "",
    });

    setError("");
    setShowModal(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingLocation(null);
    setForm(emptyForm);
  }

  function handleChange(
    field: keyof StorageForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const hasLocation =
      form.zone.trim() ||
      form.rack.trim() ||
      form.shelf.trim() ||
      form.slot.trim();

    if (!hasLocation) {
      setError(
        "Minimal satu bagian lokasi harus diisi."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingLocation) {
        await updateStorageLocation(
          editingLocation.id,
          {
            zone: form.zone.trim(),
            rack: form.rack.trim(),
            shelf: form.shelf.trim(),
            slot: form.slot.trim(),
          }
        );
      } else {
        await createStorageLocation({
          zone: form.zone.trim(),
          rack: form.rack.trim(),
          shelf: form.shelf.trim(),
          slot: form.slot.trim(),
        });
      }

      closeModal();
      await loadLocations();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan lokasi"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(
    location: StorageLocation
  ) {
    try {
      setError("");

      await updateStorageLocation(
        location.id,
        {
          isActive: !location.isActive,
        }
      );

      await loadLocations();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengubah status lokasi"
      );
    }
  }

  return (
    <section className="storage-page">
      <div className="storage-page-header">
        <div>
          <h1>Penyimpanan</h1>
          <p>
            Kelola lokasi penyimpanan laundry.
          </p>
        </div>

        <button
          type="button"
          className="storage-add-button"
          onClick={openCreateModal}
        >
          <span>+</span>
          Tambah Lokasi
        </button>
      </div>

      {error && (
        <div className="storage-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="storage-empty">
          Memuat lokasi...
        </div>
      ) : locations.length === 0 ? (
        <div className="storage-empty">
          <div className="storage-empty-icon">
            🗄️
          </div>

          <h2>Belum ada lokasi</h2>

          <p>
            Tambahkan lokasi penyimpanan
            pertama untuk mulai mengatur
            barang laundry.
          </p>

          <button
            type="button"
            className="storage-add-button"
            onClick={openCreateModal}
          >
            + Tambah Lokasi
          </button>
        </div>
      ) : (
        <div className="storage-grid">
          {locations.map((location) => (
            <article
              className={`storage-card ${
                !location.isActive
                  ? "inactive"
                  : ""
              }`}
              key={location.id}
            >
              <div className="storage-card-top">
                <div className="storage-icon">
                  🗄️
                </div>

                <span
                  className={`storage-status ${
                    location.isActive
                      ? "active"
                      : "inactive"
                  }`}
                >
                  {location.isActive
                    ? "Aktif"
                    : "Nonaktif"}
                </span>
              </div>

              <h2>
                {getLocationName(location)}
              </h2>

              <div className="storage-card-details">
                {location.zone && (
                  <div>
                    <span>Zona</span>
                    <strong>
                      {location.zone}
                    </strong>
                  </div>
                )}

                {location.rack && (
                  <div>
                    <span>Rak</span>
                    <strong>
                      {location.rack}
                    </strong>
                  </div>
                )}

                {location.shelf && (
                  <div>
                    <span>Shelf</span>
                    <strong>
                      {location.shelf}
                    </strong>
                  </div>
                )}

                {location.slot && (
                  <div>
                    <span>Slot</span>
                    <strong>
                      {location.slot}
                    </strong>
                  </div>
                )}
              </div>

              <div className="storage-card-actions">
                <button
                  type="button"
                  onClick={() =>
                    openEditModal(location)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleToggleActive(
                      location
                    )
                  }
                >
                  {location.isActive
                    ? "Nonaktifkan"
                    : "Aktifkan"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showModal && (
        <div
          className="storage-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="storage-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="storage-modal-header">
              <div>
                <h2>
                  {editingLocation
                    ? "Edit Lokasi"
                    : "Tambah Lokasi"}
                </h2>

                <p>
                  Tentukan posisi penyimpanan
                  laundry.
                </p>
              </div>

              <button
                type="button"
                className="storage-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="storage-form"
            >
              <label>
                <span>Zona</span>
                <input
                  value={form.zone}
                  onChange={(event) =>
                    handleChange(
                      "zone",
                      event.target.value
                    )
                  }
                  placeholder="Contoh: Zona A"
                />
              </label>

              <label>
                <span>Rak</span>
                <input
                  value={form.rack}
                  onChange={(event) =>
                    handleChange(
                      "rack",
                      event.target.value
                    )
                  }
                  placeholder="Contoh: Rak 01"
                />
              </label>

              <label>
                <span>Shelf</span>
                <input
                  value={form.shelf}
                  onChange={(event) =>
                    handleChange(
                      "shelf",
                      event.target.value
                    )
                  }
                  placeholder="Contoh: Shelf 02"
                />
              </label>

              <label>
                <span>Slot</span>
                <input
                  value={form.slot}
                  onChange={(event) =>
                    handleChange(
                      "slot",
                      event.target.value
                    )
                  }
                  placeholder="Contoh: 03"
                />
              </label>

              {error && (
                <div className="storage-form-error">
                  {error}
                </div>
              )}

              <div className="storage-modal-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Menyimpan..."
                    : editingLocation
                    ? "Simpan Perubahan"
                    : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}