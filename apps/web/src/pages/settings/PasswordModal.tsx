import { useState } from "react";
import { Button, Input } from "../../components/ui";
import { changePassword } from "../../services/api/settings";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function PasswordModal({
  onClose,
  onSuccess,
  onError,
}: Props) {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [saving, setSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      onError(
        "Konfirmasi password tidak cocok.",
      );
      return;
    }

    if (newPassword.length < 6) {
      onError(
        "Password baru minimal 6 karakter.",
      );
      return;
    }

    try {
      setSaving(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      onSuccess();
    } catch (err) {
      onError(
        err instanceof Error
          ? err.message
          : "Gagal mengubah password.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="settings-modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="settings-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="settings-modal-header">
          <div>
            <span className="settings-modal-eyebrow">
              Security
            </span>

            <h3>Ubah password</h3>

            <p>
              Pastikan password baru mudah kamu ingat
              tetapi sulit ditebak.
            </p>
          </div>

          <button
            type="button"
            className="settings-modal-close"
            onClick={onClose}
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        <form
          className="settings-form"
          onSubmit={handleSubmit}
        >
          <Input
            label="Password lama"
            type="password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            required
          />

          <Input
            label="Password baru"
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            minLength={6}
            required
          />

          <Input
            label="Konfirmasi password"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            minLength={6}
            required
          />

          <div className="settings-password-hint">
            <span>✓</span>
            <p>
              Password minimal 6 karakter.
            </p>
          </div>

          <div className="settings-modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Batal
            </Button>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Menyimpan..."
                : "Simpan password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}