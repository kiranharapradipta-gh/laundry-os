import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  Input,
} from "../../components/ui";

import { createCustomer } from "../../services/api/customers";

export function CreateCustomer() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanNickname = nickname.trim();

    if (!cleanName) {
      setError("Nama pelanggan wajib diisi.");
      return;
    }

    if (!cleanPhone) {
      setError("Nomor HP wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const customer = await createCustomer({
        name: cleanName,
        phone: cleanPhone,
        ...(cleanNickname ? { nickname: cleanNickname } : {}),
      });

      navigate(`/customers/${customer.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal membuat pelanggan.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page create-customer-page">
      <div className="page-header">
        <div>
          <button
            type="button"
            className="back-link"
            onClick={() => navigate("/customers")}
          >
            ← Kembali ke Pelanggan
          </button>

          <h1>Tambah Pelanggan</h1>
          <p>Tambahkan pelanggan baru ke database.</p>
        </div>
      </div>

      <Card className="customer-form-card">
        <form onSubmit={handleSubmit}>
          <div className="customer-form-header">
            <div className="customer-form-icon">
              +
            </div>

            <div>
              <h2>Informasi Pelanggan</h2>
              <p>
                Isi informasi dasar pelanggan yang akan disimpan ke database.
              </p>
            </div>
          </div>

          <div className="customer-form-fields">
            <Input
              label="Nama"
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={loading}
            />

            <Input
              label="Nomor HP"
              type="tel"
              placeholder="Contoh: 081234567890"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={loading}
            />

            <Input
              label="Nickname"
              placeholder="Opsional"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              disabled={loading}
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
              onClick={() => navigate("/customers")}
              disabled={loading}
            >
              Batal
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Pelanggan"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}