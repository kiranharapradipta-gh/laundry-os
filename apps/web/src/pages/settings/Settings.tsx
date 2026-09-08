import { useEffect, useState } from "react";

import { Button, Card, Input } from "../../components/ui";

import {
  changePassword,
  getSettings,
  updateBusiness,
  updateProfile,
} from "../../services/api/settings";

import type { SettingsData } from "../../types/settings";
import { useAuth } from "../../app/AuthContext";

export function Settings() {

  const { refreshUser } = useAuth();

  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  const [profileSaving, setProfileSaving] = useState(false);
  const [businessSaving, setBusinessSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [business, setBusiness] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    void loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const data = await getSettings();

      setSettings(data);

      setProfile({
        name: data.name ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
      });

      setBusiness({
        name: data.business.name ?? "",
        phone: data.business.phone ?? "",
        address: data.business.address ?? "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil pengaturan",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setProfileSaving(true);
      setError("");
      setMessage("");

      const data = await updateProfile({
        name: profile.name,
        phone: profile.phone,
        email: profile.email || null,
      });

      await refreshUser();

      setSettings((current) =>
        current
          ? {
              ...current,
              ...data,
            }
          : current,
      );

      setMessage("Profile berhasil diperbarui.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui profile",
      );
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleBusinessSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setBusinessSaving(true);
      setError("");
      setMessage("");

      const data = await updateBusiness({
        name: business.name,
        phone: business.phone || null,
        address: business.address || null,
      });

      setSettings((current) =>
        current
          ? {
              ...current,
              business: data,
            }
          : current,
      );

      setMessage("Informasi laundry berhasil diperbarui.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui informasi laundry",
      );
    } finally {
      setBusinessSaving(false);
    }
  }

  async function handlePasswordSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (password.newPassword !== password.confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      setPasswordSaving(true);
      setError("");
      setMessage("");

      await changePassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordModal(false);
      setMessage("Password berhasil diubah.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengubah password",
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="page settings-page">
        <div className="page-header">
          <div>
            <h2>Settings</h2>
            <p>Kelola akun dan informasi laundry.</p>
          </div>
        </div>

        <Card>
          <div className="settings-loading">
            Memuat pengaturan...
          </div>
        </Card>
      </section>
    );
  }

  if (!settings) {
    return (
      <section className="page settings-page">
        <div className="page-header">
          <div>
            <h2>Settings</h2>
            <p>Kelola akun dan informasi laundry.</p>
          </div>
        </div>

        <Card>
          <div className="settings-error">
            {error || "Pengaturan tidak tersedia."}
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="page settings-page">
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p>
            Kelola akun, informasi laundry, dan keamanan akun.
          </p>
        </div>
      </div>

      {(message || error) && (
        <div
          className={`settings-alert ${
            error ? "settings-alert-error" : "settings-alert-success"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="settings-sections">
        <Card>
          <div className="settings-card-header">
            <div>
              <h3>Profile</h3>
              <p>Informasi akun yang sedang digunakan.</p>
            </div>

            <span className="settings-role">
              {settings.role}
            </span>
          </div>

          <form
            className="settings-form"
            onSubmit={handleProfileSubmit}
          >
            <div className="settings-form-grid">
              <Input
                label="Nama"
                value={profile.name}
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    name: event.target.value,
                  })
                }
                required
              />

              <Input
                label="Nomor HP"
                value={profile.phone}
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    phone: event.target.value,
                  })
                }
                required
              />

              <Input
                label="Email"
                type="email"
                value={profile.email}
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    email: event.target.value,
                  })
                }
              />

              <Input
                label="Role"
                value={settings.role}
                disabled
              />
            </div>

            <div className="settings-form-actions">
              <Button
                type="submit"
                disabled={profileSaving}
              >
                {profileSaving ? "Menyimpan..." : "Simpan perubahan"}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <div className="settings-card-header">
            <div>
              <h3>Informasi Laundry</h3>
              <p>
                Informasi bisnis yang tampil di aplikasi.
              </p>
            </div>
          </div>

          <form
            className="settings-form"
            onSubmit={handleBusinessSubmit}
          >
            <div className="settings-form-grid">
              <Input
                label="Nama Laundry"
                value={business.name}
                onChange={(event) =>
                  setBusiness({
                    ...business,
                    name: event.target.value,
                  })
                }
                required
              />

              <Input
                label="Nomor Telepon"
                value={business.phone}
                onChange={(event) =>
                  setBusiness({
                    ...business,
                    phone: event.target.value,
                  })
                }
              />

              <div className="settings-field-full">
                <label>
                  <span>Alamat</span>

                  <textarea
                    value={business.address}
                    onChange={(event) =>
                      setBusiness({
                        ...business,
                        address: event.target.value,
                      })
                    }
                    rows={4}
                    placeholder="Masukkan alamat laundry"
                  />
                </label>
              </div>
            </div>

            <div className="settings-form-actions">
              <Button
                type="submit"
                disabled={businessSaving}
              >
                {businessSaving
                  ? "Menyimpan..."
                  : "Simpan perubahan"}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <div className="settings-security">
            <div>
              <h3>Password</h3>
              <p>
                Ganti password akun untuk menjaga keamanan
                akses Anda.
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={() => {
                setError("");
                setMessage("");
                setShowPasswordModal(true);
              }}
            >
              Ubah password
            </Button>
          </div>
        </Card>
      </div>

      {showPasswordModal && (
        <div
          className="settings-modal-backdrop"
          onMouseDown={() => setShowPasswordModal(false)}
        >
          <div
            className="settings-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="settings-modal-header">
              <div>
                <h3>Ubah password</h3>
                <p>
                  Masukkan password lama dan password baru.
                </p>
              </div>

              <button
                type="button"
                className="settings-modal-close"
                onClick={() => setShowPasswordModal(false)}
                aria-label="Tutup"
              >
                ×
              </button>
            </div>

            <form
              className="settings-form"
              onSubmit={handlePasswordSubmit}
            >
              <Input
                label="Password lama"
                type="password"
                value={password.currentPassword}
                onChange={(event) =>
                  setPassword({
                    ...password,
                    currentPassword: event.target.value,
                  })
                }
                required
              />

              <Input
                label="Password baru"
                type="password"
                value={password.newPassword}
                onChange={(event) =>
                  setPassword({
                    ...password,
                    newPassword: event.target.value,
                  })
                }
                minLength={6}
                required
              />

              <Input
                label="Konfirmasi password"
                type="password"
                value={password.confirmPassword}
                onChange={(event) =>
                  setPassword({
                    ...password,
                    confirmPassword: event.target.value,
                  })
                }
                minLength={6}
                required
              />

              <div className="settings-modal-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Batal
                </Button>

                <Button
                  type="submit"
                  disabled={passwordSaving}
                >
                  {passwordSaving
                    ? "Menyimpan..."
                    : "Simpan password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}