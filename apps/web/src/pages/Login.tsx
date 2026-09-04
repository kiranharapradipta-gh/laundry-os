import {
  useState,
} from "react";

import {
  login,
  type AuthUser,
} from "../api/client";

import type {
  FormEvent,
} from "react";

interface LoginProps {
  onLogin: (user: AuthUser) => void;
}

export default function Login({
  onLogin,
}: LoginProps) {
  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!phone || !password) {
      setError(
        "Nomor HP dan password wajib diisi"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login(
        phone,
        password
      );

      onLogin(result.user);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login gagal"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <h1>LaundryOS</h1>
          <p>
            Login untuk mengakses sistem
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >
          <div className="form-group">
            <label htmlFor="phone">
              Nomor HP
            </label>

            <input
              id="phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Memproses..."
              : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}