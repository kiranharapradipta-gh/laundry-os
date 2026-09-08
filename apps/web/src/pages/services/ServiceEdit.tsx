import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Card,
  Input,
  Loading,
  Select,
} from "../../components/ui";

import {
  getService,
  updateService,
} from "../../services/api/services";

import type { UpdateServiceInput } from "../../types/service";

const UNIT_OPTIONS = [
  { value: "kg", label: "Kg" },
  { value: "pcs", label: "Pcs" },
  { value: "item", label: "Item" },
  { value: "meter", label: "Meter" },
  { value: "liter", label: "Liter" },
];

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Aktif" },
  { value: "INACTIVE", label: "Nonaktif" },
];

export function ServiceEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [status, setStatus] = useState("ACTIVE");

  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
  }>({});

  const [error, setError] = useState("");

  const loadService = useCallback(async () => {
    if (!id) {
      setError("ID service tidak ditemukan.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const service = await getService(id);

      setName(service.name);
      setDescription(service.description ?? "");
      setPrice(String(service.price));
      setUnit(service.unit ?? "kg");
      setStatus(service.isActive ? "ACTIVE" : "INACTIVE");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data service.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadService();
  }, [loadService]);

  function validate() {
    const nextErrors: {
      name?: string;
      price?: string;
    } = {};

    const cleanName = name.trim();
    const numericPrice = Number(price);

    if (!cleanName) {
      nextErrors.name = "Nama service wajib diisi.";
    }

    if (!price.trim()) {
      nextErrors.price = "Harga wajib diisi.";
    } else if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      nextErrors.price = "Harga tidak valid.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!id || !validate()) {
      return;
    }

    const input: UpdateServiceInput = {
      name: name.trim(),
      price: Number(price),
      unit,
      isActive: status === "ACTIVE",
    };

    const cleanDescription = description.trim();

    if (cleanDescription) {
      input.description = cleanDescription;
    } else {
      input.description = "";
    }

    try {
      setSaving(true);
      setError("");

      await updateService(id, input);

      navigate("/services");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui service.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <Card>
          <Loading text="Memuat service..." />
        </Card>
      </div>
    );
  }

  if (error && !name) {
    return (
      <div className="page">
        <Card className="page-error">
          <div className="page-error-content">
            <strong>Gagal memuat service</strong>
            <p>{error}</p>
          </div>

          <Button
            variant="secondary"
            onClick={() => void loadService()}
          >
            Coba Lagi
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate("/services")}
          >
            Kembali
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <button
            type="button"
            className="back-link"
            onClick={() => navigate("/services")}
          >
            ← Kembali ke Services
          </button>

          <h1>Edit Service</h1>

          <p>
            Perbarui informasi dan status layanan laundry.
          </p>
        </div>
      </div>

      <Card className="form-card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-section-title">
              <h2>Informasi Service</h2>

              <p>
                Ubah informasi layanan sesuai kebutuhan.
              </p>
            </div>

            <Input
              label="Nama Service"
              name="name"
              placeholder="Contoh: Cuci Kering"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              error={errors.name}
              disabled={saving}
            />

            <Input
              label="Deskripsi"
              name="description"
              placeholder="Contoh: Cuci dan kering pakaian"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              disabled={saving}
            />

            <div className="form-row">
              <Input
                label="Harga"
                name="price"
                type="number"
                min="0"
                step="1"
                placeholder="Contoh: 7000"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                error={errors.price}
                disabled={saving}
              />

              <Select
                label="Satuan"
                name="unit"
                value={unit}
                onChange={(event) =>
                  setUnit(event.target.value)
                }
                options={UNIT_OPTIONS}
                disabled={saving}
              />
            </div>

            <Select
              label="Status Service"
              name="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              options={STATUS_OPTIONS}
              disabled={saving}
            />
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/services")}
              disabled={saving}
            >
              Batal
            </Button>

            <Button
              type="submit"
              loading={saving}
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}