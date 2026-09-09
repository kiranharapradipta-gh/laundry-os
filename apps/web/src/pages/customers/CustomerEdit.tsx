import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Card,
  Input,
  Loading,
} from "../../components/ui";

import {
  getCustomer,
  updateCustomer,
} from "../../services/api/customers";

import type {
  Customer,
  UpdateCustomerInput,
} from "../../types/customer";

export function CustomerEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [customer, setCustomer] = useState<Customer | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const loadCustomer = useCallback(async () => {
    if (!id) {
      setError("ID pelanggan tidak valid.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getCustomer(id);

      setCustomer(data);
      setName(data.name);
      setPhone(data.phone);
      setNickname(data.nickname ?? "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data pelanggan.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadCustomer();
  }, [loadCustomer]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      setFormError("ID pelanggan tidak valid.");
      return;
    }

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanNickname = nickname.trim();

    if (!cleanName) {
      setFormError("Nama pelanggan wajib diisi.");
      return;
    }

    if (!cleanPhone) {
      setFormError("Nomor HP wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const input: UpdateCustomerInput = {
        name: cleanName,
        phone: cleanPhone,
      };

      if (cleanNickname) {
        input.nickname = cleanNickname;
      }

      await updateCustomer(id, input);

      navigate(`/customers/${id}`);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui pelanggan.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <Loading />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="page">
        <Card>
          <div className="error-state">
            <h2>Gagal memuat pelanggan</h2>
            <p>{error || "Data pelanggan tidak ditemukan."}</p>

            <Button
              variant="secondary"
              onClick={() => navigate("/customers")}
            >
              Kembali ke Pelanggan
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="page customer-form-page">
      <div className="page-header">
        <div>
          <button
            type="button"
            className="back-link"
            onClick={() => navigate(`/customers/${customer.id}`)}
          >
            ← Kembali ke Detail
          </button>

          <h1>Edit Pelanggan</h1>

          <p>
            Perbarui informasi pelanggan yang tersimpan.
          </p>
        </div>
      </div>

      <Card className="customer-form-card">
        <form
          className="customer-form"
          onSubmit={handleSubmit}
        >
          <div className="customer-form-header">
            <div className="customer-form-icon">
              {customer.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2>Informasi Pelanggan</h2>
              <p>
                Perbarui informasi dasar pelanggan di bawah ini.
              </p>
            </div>
          </div>

          <div className="customer-form-fields">
            <Input
              label="Nama"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Contoh: Budi Santoso"
              disabled={saving}
            />

            <Input
              label="Nomor HP"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Contoh: 081234567890"
              disabled={saving}
            />

            <Input
              label="Nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Contoh: Budi"
              disabled={saving}
            />
          </div>

          {formError && (
            <div className="form-error">
              {formError}
            </div>
          )}

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              disabled={saving}
              onClick={() =>
                navigate(`/customers/${customer.id}`)
              }
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