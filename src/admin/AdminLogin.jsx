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
          <div className="admin-login-header">
            <h1 className="admin-login-brand">Ellen Istanto</h1>
            <p className="admin-login-sub">Studio Content Management</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && (
              <div className="admin-error-msg" role="alert">
                <span>{error}</span>
              </div>
            )}

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                className={`admin-form-input ${error ? 'has-error' : ''}`}
                placeholder="Enter password"
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
                  <span className="admin-spinner" style={{ width: 14, height: 14 }} />
                  <span>Signing in…</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <a href="/" className="admin-login-return-link">
              ← Return to portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
