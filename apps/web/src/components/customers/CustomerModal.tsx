import { useEffect, useState } from "react";
import type { CreateCustomerInput, Customer, UpdateCustomerInput } from "../../types/customer";
import Modal from "../ui/Modal";

interface Props {
  open: boolean;
  customer?: Customer | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateCustomerInput | UpdateCustomerInput,
  ) => Promise<void>;
}

export default function CustomerModal({
  open,
  customer,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const editing = Boolean(customer);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setName(customer?.name ?? "");
    setPhone(customer?.phone ?? "");
    setNickname(customer?.nickname ?? "");
    setError("");
  }, [open, customer]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

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
      if (editing && customer) {
        await onSubmit({
          name: cleanName,
          phone: cleanPhone,
          nickname: cleanNickname || undefined,
        });
      } else {
        await onSubmit({
          name: cleanName,
          phone: cleanPhone,
          nickname: cleanNickname || undefined,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan pelanggan.",
      );
    }
  }

  return (
    <Modal
      open={open}
      title={editing ? "Edit Pelanggan" : "Tambah Pelanggan"}
      onClose={onClose}
      size="md"
    >
      <form className="customer-form" onSubmit={handleSubmit}>
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="customer-form-intro">
          <div className="customer-form-avatar">
            {(name || "?").charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>
              {editing
                ? "Perbarui data pelanggan"
                : "Pelanggan baru"}
            </strong>

            <span>
              Data ini akan digunakan untuk membuat dan
              mengelola order.
            </span>
          </div>
        </div>

        <div className="form-field">
          <span>Nama *</span>

          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Contoh: Budi Santoso"
            autoFocus
          />
        </div>

        <div className="form-field">
          <span>Nomor HP *</span>

          <input
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            placeholder="Contoh: 081234567890"
            inputMode="tel"
          />
        </div>

        <div className="form-field">
          <span>Nama Panggilan</span>

          <input
            value={nickname}
            onChange={(event) =>
              setNickname(event.target.value)
            }
            placeholder="Contoh: Budi"
          />
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="button button-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </button>

          <button
            type="submit"
            className="button button-primary"
            disabled={loading}
          >
            {loading
              ? "Menyimpan..."
              : editing
                ? "Simpan Perubahan"
                : "Tambah Pelanggan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}