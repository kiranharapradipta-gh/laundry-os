import {
  useState,
} from "react";

import type { FormEvent } from "react"

import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../app/AuthContext";

export function Login() {
  const {
    login,
    isAuthenticated,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from =
    (
      location.state as
        | { from?: string }
        | null
        | undefined
    )?.from ?? "/dashboard";

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!phone.trim()) {
      setError("Nomor HP wajib diisi.");
      return;
    }

    if (!password) {
      setError("Password wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);

      await login({
        phone: phone.trim(),
        password,
      });

      navigate(from, {
        replace: true,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login gagal. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-mark">
            L
          </div>

          <div>
            <h1>LaundryOS</h1>
            <p>
              Laundry management system
            </p>
          </div>
        </div>

        <div className="login-heading">
          <h2>Selamat datang 👋</h2>

          <p>
            Masuk ke akun LaundryOS kamu untuk
            melanjutkan.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <Input
            label="Nomor HP"
            type="tel"
            placeholder="Contoh: 08123456789"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            autoComplete="tel"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="current-password"
          />

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            // size="lg"
            // fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Memproses..."
              : "Masuk"}
          </Button>
        </form>

        <div className="login-footer">
          LaundryOS
        </div>
      </div>
    </div>
  );
}