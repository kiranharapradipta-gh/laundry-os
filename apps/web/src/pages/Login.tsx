import type { FormEvent } from "react";

import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { user, login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");

    if (!phone.trim() || !password) {
      setError("Nomor HP dan password wajib diisi.");
      return;
    }

    try {
      setSubmitting(true);

      await login(phone.trim(), password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login gagal.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="login-logo">L</div>

          <div>
            <h1>LaundryOS</h1>
            <p>Kelola laundry lebih mudah.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="phone">Nomor HP</label>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              placeholder="08xxxxxxxxxx"
              autoComplete="tel"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Masukkan password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </section>
    </main>
  );
}