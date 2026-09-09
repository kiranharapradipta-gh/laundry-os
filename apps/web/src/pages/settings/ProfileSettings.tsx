import { useEffect, useState } from "react";
import { Button, Card, Input } from "../../components/ui";
import { updateProfile } from "../../services/api/settings";
import type { SettingsData } from "../../types/settings";

interface Props {
  settings: SettingsData;
  onUpdated: (settings: SettingsData) => void;
  onError: (message: string) => void;
}

export default function ProfileSettings({
  settings,
  onUpdated,
  onError,
}: Props) {
  const [name, setName] = useState(settings.name);
  const [phone, setPhone] = useState(settings.phone ?? "");
  const [email, setEmail] = useState(settings.email ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(settings.name);
    setPhone(settings.phone ?? "");
    setEmail(settings.email ?? "");
  }, [settings]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSaving(true);

      const updated = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
      });

      onUpdated(updated);
    } catch (err) {
      onError(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase())
    .join("");

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title">
          <div className="settings-section-icon">
            👤
          </div>

          <div>
            <h2>Profile</h2>
            <p>
              Kelola informasi akun yang digunakan
              untuk mengakses aplikasi.
            </p>
          </div>
        </div>
      </div>

      <Card className="settings-card">
        <div className="settings-profile-preview">
          <div className="settings-avatar">
            {initials || "U"}
          </div>

          <div>
            <strong>{name || "Pengguna"}</strong>

            <span>
              {settings.role === "OWNER"
                ? "Owner"
                : "Employee"}
            </span>
          </div>

          <span className="settings-role">
            {settings.role}
          </span>
        </div>

        <form
          className="settings-form"
          onSubmit={handleSubmit}
        >
          <div className="settings-form-grid">
            <Input
              label="Nama"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />

            <Input
              label="Nomor HP"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              required
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

            <Input
              label="Role"
              value={
                settings.role === "OWNER"
                  ? "Owner"
                  : "Employee"
              }
              disabled
            />
          </div>

          <div className="settings-form-actions">
            <Button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Menyimpan..."
                : "Simpan perubahan"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}