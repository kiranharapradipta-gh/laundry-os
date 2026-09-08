import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import {
  createService,
  type CreateServiceInput,
} from "../../services/api/services";

const UNIT_OPTIONS = [
  { value: "kg", label: "Kg" },
  { value: "pcs", label: "Pcs" },
  { value: "item", label: "Item" },
  { value: "meter", label: "Meter" },
  { value: "liter", label: "Liter" },
];

export function CreateService() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const numericPrice = Number(price);

    if (!cleanName) {
      setError("Nama service wajib diisi.");
      return;
    }

    if (!price || !Number.isFinite(numericPrice) || numericPrice < 0) {
      setError("Harga service tidak valid.");
      return;
    }

    const input: CreateServiceInput = {
      name: cleanName,
      price: numericPrice,
      unit,
    };

    const cleanDescription = description.trim();

    if (cleanDescription) {
      input.description = cleanDescription;
    }

    try {
      setSubmitting(true);
      setError("");

      await createService(input);

      navigate("/services");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal membuat service.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h2>Tambah Service</h2>
          <p>Tambahkan layanan laundry baru.</p>
        </div>
      </div>

      <Card>
        <form className="form-stack" onSubmit={handleSubmit}>
          <Input
            label="Nama Service"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Contoh: Cuci Kering"
            disabled={submitting}
          />

          <Input
            label="Deskripsi"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Contoh: Cuci dan kering"
            disabled={submitting}
          />

          <Input
            label="Harga"
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="Contoh: 7000"
            disabled={submitting}
          />

          <Select
            label="Satuan"
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            options={UNIT_OPTIONS}
            disabled={submitting}
          />

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/services")}
              disabled={submitting}
            >
              Batal
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? "Menyimpan..." : "Simpan Service"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}