import { Button, Card } from "../../components/ui";
import type { SettingsData } from "../../types/settings";

interface Props {
  settings: SettingsData;
  onChangePassword: () => void;
}

export default function SecuritySettings({
  settings,
  onChangePassword,
}: Props) {
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <div className="settings-section-title">
          <div className="settings-section-icon">
            🔒
          </div>

          <div>
            <h2>Keamanan</h2>
            <p>
              Kelola password dan akses akun kamu.
            </p>
          </div>
        </div>
      </div>

      <Card className="settings-card">
        <div className="settings-security-row">
          <div className="settings-security-icon">
            🔑
          </div>

          <div className="settings-security-info">
            <strong>Password</strong>

            <span>
              Gunakan password yang kuat dan jangan
              dibagikan kepada orang lain.
            </span>
          </div>

          <Button
            variant="secondary"
            onClick={onChangePassword}
          >
            Ubah password
          </Button>
        </div>
      </Card>

      <Card className="settings-card">
        <div className="settings-security-details">
          <div className="settings-security-detail">
            <span>Nama akun</span>
            <strong>{settings.name}</strong>
          </div>

          <div className="settings-security-detail">
            <span>Role</span>
            <strong>
              {settings.role === "OWNER"
                ? "Owner"
                : "Employee"}
            </strong>
          </div>

          <div className="settings-security-detail">
            <span>Business</span>
            <strong>{settings.business.name}</strong>
          </div>
        </div>
      </Card>

      <Card className="settings-card settings-danger">
        <div>
          <span className="settings-danger-label">
            DANGER ZONE
          </span>

          <h3>Akses akun</h3>

          <p>
            Fitur pengelolaan session dan penghapusan
            akun akan tersedia pada tahap berikutnya.
          </p>
        </div>
      </Card>
    </div>
  );
}