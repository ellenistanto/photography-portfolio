import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { API_BASE } from '../config/api';

/**
 * AdminApp — handles auth state and renders either Login or Dashboard
 * Mounted when the URL path starts with /admin
 */
export default function AdminApp() {
  const [token, setToken] = useState(null);
  const [checking, setChecking] = useState(true);

  // On mount: check for existing valid token in localStorage
  useEffect(() => {
    async function checkAuth() {
      const stored = localStorage.getItem('admin_token');
      const exp = localStorage.getItem('admin_token_exp');

      // Quick expiry check (client side)
      if (!stored || !exp || Date.now() > Number(exp)) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_token_exp');
        setChecking(false);
        return;
      }

      // Verify token against the server
      try {
        const res = await fetch(`${API_BASE}/api/auth/verify`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${stored}` },
        });
        if (res.ok) {
          setToken(stored);
        } else {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_token_exp');
        }
      } catch {
        // Server unreachable — trust local token for now (offline mode)
        setToken(stored);
      } finally {
        setChecking(false);
      }
    }

    checkAuth();
  }, []);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  if (checking) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0f', color: '#8888a8', fontFamily: 'Inter, sans-serif', gap: 12
      }}>
        <div style={{
          width: 20, height: 20, border: '2px solid rgba(255,255,255,0.1)',
          borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.7s linear infinite'
        }} />
        <span>Checking session…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!token) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard token={token} onLogout={handleLogout} />;
}
