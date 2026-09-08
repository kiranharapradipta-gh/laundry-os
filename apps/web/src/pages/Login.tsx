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
      <div className="login-container">
        <div className="login-brand">
          <div className="login-brand-mark">
            L
          </div>

          <div className="login-brand-text">
            <span className="login-brand-name">
              LaundryOS
            </span>
            <span className="login-brand-tagline">
              Laundry management made simple
            </span>
          </div>
        </div>

        <div className="login-content">
          <div className="login-heading">
            <span className="login-eyebrow">
              WELCOME BACK
            </span>

            <h1>
              Selamat datang
              <span>👋</span>
            </h1>

            <p>
              Masuk untuk mengelola laundry
              kamu dengan lebih mudah.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="login-field">
              <Input
                label="Nomor HP"
                type="tel"
                placeholder="08123456789"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                autoComplete="tel"
              />
            </div>

            <div className="login-field">
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
            </div>

            {error && (
              <div className="login-error">
                <span className="login-error-icon">
                  !
                </span>

                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="login-loading">
                  <span className="login-spinner" />
                  Memproses...
                </span>
              ) : (
                <>
                  Masuk
                  <span className="login-button-arrow">
                    →
                  </span>
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="login-footer">
          <span className="login-footer-dot" />
          LaundryOS
          <span>•</span>
          <span>2026</span>
        </div>
      </div>
    </div>
  );
}