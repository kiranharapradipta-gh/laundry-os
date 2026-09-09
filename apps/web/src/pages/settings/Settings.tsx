import { useEffect, useState } from "react";
import { Card } from "../../components/ui";
import { getSettings, updateOperationalSettings } from "../../services/api/settings";
import type { OperationalSettings as OperationalSettingsType, SettingsData } from "../../types/settings";

import ProfileSettings from "./ProfileSettings";
import BusinessSettings from "./BusinessSettings";
import SecuritySettings from "./SecuritySettings";
import PasswordModal from "./PasswordModal";
import OperationalSettings from "./OperationalSettings";

type SettingsSection =
  | "profile"
  | "business"
  | "security";

const sections: Array<{
  id: SettingsSection;
  icon: string;
  title: string;
  description: string;
}> = [
  {
    id: "profile",
    icon: "👤",
    title: "Profile",
    description: "Informasi akun",
  },
  {
    id: "business",
    icon: "🏪",
    title: "Informasi Laundry",
    description: "Profil bisnis",
  },
  {
    id: "security",
    icon: "🔒",
    title: "Keamanan",
    description: "Password & akses",
  },
];

export function Settings() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");

  const [settings, setSettings] =
    useState<SettingsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [operational, setOperational] = useState<OperationalSettingsType | null>(null);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const data = await getSettings();

      setOperational(data.business.settings);

      setSettings(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat pengaturan.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSettings();
  }, []);

  function showMessage(text: string) {
    setMessage(text);

    window.setTimeout(() => {
      setMessage("");
    }, 4000);
  }

  function showError(text: string) {
    setError(text);

    window.setTimeout(() => {
      setError("");
    }, 5000);
  }

  async function handleOperationalSave(
    input: Parameters<typeof updateOperationalSettings>[0],
  ) {
    try {
      setError("");
      setMessage("");

      const data = await updateOperationalSettings(input);

      setSettings((current) =>
        current
          ? {
              ...current,
              business: {
                ...current.business,
                settings: data,
              },
            }
          : current,
      );

      setMessage("Pengaturan operasional berhasil diperbarui.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui pengaturan operasional",
      );

      throw err;
    }
  }

  if (loading) {
    return (
      <section className="page settings-page">
        <div className="settings-header">
          <div>
            <span className="settings-eyebrow">
              Application Settings
            </span>

            <h1>Settings</h1>

            <p>
              Kelola akun dan informasi laundry kamu.
            </p>
          </div>
        </div>

        <Card className="settings-loading">
          <div className="settings-loading-spinner" />
          <span>Memuat pengaturan...</span>
        </Card>
      </section>
    );
  }

  if (!settings) {
    return (
      <section className="page settings-page">
        <div className="settings-header">
          <div>
            <span className="settings-eyebrow">
              Application Settings
            </span>

            <h1>Settings</h1>
          </div>
        </div>

        <div className="settings-alert settings-alert-error">
          {error || "Pengaturan tidak tersedia."}
        </div>
      </section>
    );
  }

  return (
    <section className="page settings-page">
      <div className="settings-header">
        <div>
          <span className="settings-eyebrow">
            Application Settings
          </span>

          <h1>Settings</h1>

          <p>
            Kelola akun, informasi laundry, dan keamanan
            aplikasi.
          </p>
        </div>
      </div>

      {(message || error) && (
        <div
          className={`settings-alert ${
            error
              ? "settings-alert-error"
              : "settings-alert-success"
          }`}
        >
          <span className="settings-alert-icon">
            {error ? "!" : "✓"}
          </span>

          <span>{error || message}</span>
        </div>
      )}

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <div className="settings-sidebar-title">
            Pengaturan
          </div>

          <nav className="settings-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`settings-nav-item ${
                  activeSection === section.id
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setActiveSection(section.id);
                  setError("");
                  setMessage("");
                }}
              >
                <span className="settings-nav-icon">
                  {section.icon}
                </span>

                <span className="settings-nav-content">
                  <strong>{section.title}</strong>
                  <small>{section.description}</small>
                </span>

                <span className="settings-nav-arrow">
                  →
                </span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="settings-content">
          {activeSection === "profile" && (
            <ProfileSettings
              settings={settings}
              onUpdated={(data) => {
                setSettings(data);
                showMessage(
                  "Profile berhasil diperbarui.",
                );
              }}
              onError={showError}
            />
          )}

          {activeSection === "business" && (
            <BusinessSettings
              settings={settings}
              onUpdated={(business) => {
                setSettings((current) =>
                  current
                    ? {
                        ...current,
                        business,
                      }
                    : current,
                );

                showMessage(
                  "Informasi laundry berhasil diperbarui.",
                );
              }}
              onError={showError}
            />
          )}

          {activeSection === "security" && (
            <SecuritySettings
              settings={settings}
              onChangePassword={() => {
                setError("");
                setMessage("");
                setShowPasswordModal(true);
              }}
            />
          )}
        </main>

        <OperationalSettings
          settings={operational}
          onSaved={handleOperationalSave}
        />
      </div>

      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {
            setShowPasswordModal(false);
            showMessage(
              "Password berhasil diperbarui.",
            );
          }}
          onError={showError}
        />
      )}
    </section>
  );
}