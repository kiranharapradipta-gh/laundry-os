import { useEffect, useState } from "react";
import { Button, Card, Input } from "../../components/ui";
import { updateBusiness } from "../../services/api/settings";
import type {
  SettingsBusiness,
  SettingsData,
} from "../../types/settings";

interface Props {
  settings: SettingsData;
  onUpdated: (business: SettingsBusiness) => void;
  onError: (message: string) => void;
}

export default function BusinessSettings({
  settings,
  onUpdated,
  onError,
}: Props) {
  const [name, setName] = useState(
    settings.business.name,
  );
  const [phone, setPhone] = useState(
    settings.business.phone ?? "",
  );
  const [address, setAddress] = useState(
    settings.business.address ?? "",
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(settings.business.name);
    setPhone(settings.business.phone ?? "");
    setAddress(settings.business.address ?? "");
  }, [settings]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSaving(true);

      const updated = await updateBusiness({
        name: name.trim(),
        phone: phone.trim() || null,
        address: address.trim() || null,
      });

      onUpdated(updated);
    } catch (err) {
      onError(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui informasi laundry.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title">
          <div className="settings-section-icon">
            🏪
          </div>

          <div>
            <h2>Informasi Laundry</h2>
            <p>
              Informasi bisnis yang digunakan di
              aplikasi.
            </p>
          </div>
        </div>
      </div>

      <Card className="settings-card">
        <form
          className="settings-form"
          onSubmit={handleSubmit}
        >
          <div className="settings-form-grid">
            <Input
              label="Nama Laundry"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />

            <Input
              label="Nomor Telepon"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
            />

            <div className="settings-field-full">
              <label className="settings-textarea-field">
                <span>Alamat</span>

                <textarea
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  rows={5}
                  placeholder="Masukkan alamat laundry"
                />
              </label>
            </div>
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

      <Card className="settings-info-card">
        <div className="settings-info-icon">
          ✦
        </div>

        <div>
          <strong>Business ID</strong>
          <span>
            {settings.business.id}
          </span>
        </div>
      </Card>
    </div>
  );
}