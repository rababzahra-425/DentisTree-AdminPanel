import React, { useState } from "react";
import "./Logiin.css";
import logoIcon from "../assets/logo.png";
import logoText from "../assets/ClinicName.png";
import { API_BASE, authFetch, ensureCsrf } from "../api";

function Login({ onLogin, apiBase = API_BASE }) {
  const [username, setUsername]       = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await ensureCsrf();
      const res = await authFetch("/auth/login/", {
        method: "POST",
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onLogin(data.user || data);
      } else {
        let msg = "Invalid username or password.";
        try {
          const err = await res.json();
          msg = err.detail || err.error || err.message || msg;
        } catch { /* ignore */ }
        if (res.status === 401) {
          msg += " If you forgot it, run: python reset_admin_sqlite.py in the project folder.";
        }
        setError(msg);
      }
    } catch {
      setError(
        "Cannot reach the server. Make sure the Django backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="clinic-brand-container">
            <img src={logoIcon} alt="Logo Icon" className="brand-icon" />
            <img src={logoText} alt="Dentistree" className="brand-text-img" />
          </div>
          <div className="header-divider"></div>
          <h2>Welcome Back</h2>
          <p className="subtitle">Log in to manage your clinic appointments</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-badge">{error}</div>}

          <div className="input-group">
            <label>ADMIN USERNAME</label>
            <input
              type="text"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>PASSWORD</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? "Signing in…" : "Log In to Dashboard"}
          </button>

          {/* <p className="login-hint">
            Default admin (after reset): <strong>admin</strong> / <strong>admin123</strong>
         </p> */}
        </form>
      </div>
    </div>
  );
}

export default Login;
