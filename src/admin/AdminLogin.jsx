import React, { useState } from 'react';
import './admin.css';
import { API_BASE } from '../config/api';

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Check your password.');
        return;
      }

      // Store JWT in localStorage
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_token_exp', String(Date.now() + 24 * 60 * 60 * 1000));
      onLoginSuccess(data.token);
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-root">
      <div className="admin-login-page">
        <div className="admin-login-bg" />

        <div className="admin-login-card">
          <div className="admin-login-logo">
            <div className="admin-login-logo-icon">📸</div>
            <div>
              <div className="admin-login-title">Admin Dashboard</div>
              <div className="admin-login-subtitle">Ellen Istanto Photography</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="admin-error-msg" role="alert">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="admin-password">
                Admin Password
              </label>
              <input
                id="admin-password"
                type="password"
                className={`admin-form-input ${error ? 'has-error' : ''}`}
                placeholder="Enter your admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                autoFocus
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              id="admin-login-btn"
              className="admin-btn-primary"
              disabled={loading || !password.trim()}
            >
              {loading ? (
                <>
                  <span className="admin-spinner" style={{ width: 16, height: 16 }} />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>🔐</span>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <p style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: 'var(--admin-text-dim)' }}>
            Protected access — this page is not linked publicly
          </p>
        </div>
      </div>
    </div>
  );
}
