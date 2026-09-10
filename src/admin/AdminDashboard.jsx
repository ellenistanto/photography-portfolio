import React, { useState, useEffect, useCallback } from 'react';
import './admin.css';

import ProfileEditor from './sections/ProfileEditor';
import StatsEditor from './sections/StatsEditor';
import PhotosEditor from './sections/PhotosEditor';
import ClientsEditor from './sections/ClientsEditor';
import MilestonesEditor from './sections/MilestonesEditor';
import CategoriesEditor from './sections/CategoriesEditor';
import { API_BASE } from '../config/api';

// ── Toast System ──────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`admin-toast ${type}`} role="alert">
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 16 }}
      >
        ×
      </button>
    </div>
  );
}

// ── Navigation config ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'profile',     icon: '👤', label: 'Profile' },
  { id: 'stats',       icon: '📊', label: 'Statistics' },
  { id: 'photos',      icon: '🖼️', label: 'Gallery Photos' },
  { id: 'clients',     icon: '🤝', label: 'Clients' },
  { id: 'milestones',  icon: '🗓️', label: 'Milestones' },
  { id: 'categories',  icon: '🏷️', label: 'Categories' },
];

export default function AdminDashboard({ token, onLogout }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Fetch portfolio data
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/portfolio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Fetch failed');
      const json = await res.json();
      setData(json);
      setApiConnected(true);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toast helpers
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Section renderer
  const renderSection = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12, color: 'var(--admin-text-muted)' }}>
          <div className="admin-spinner" />
          <span>Loading portfolio data…</span>
        </div>
      );
    }

    if (!apiConnected) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 300, gap: 14, color: 'var(--admin-text-muted)', textAlign: 'center', padding: 32
        }}>
          <div style={{ fontSize: 48 }}>🔌</div>
          <h3 style={{ color: 'var(--admin-text)', marginBottom: 4 }}>Cannot connect to backend server</h3>
          <p style={{ fontSize: 14, maxWidth: 400, lineHeight: 1.5 }}>
            Make sure your backend server is running on <code style={{ color: 'var(--admin-accent-hover)' }}>{API_BASE}</code>.
            Check your <code>.env</code> file and run <code>npm start</code> in the <code>server/</code> folder.
          </p>
          <button className="admin-btn admin-btn-ghost" onClick={fetchData}>🔄 Retry Connection</button>
        </div>
      );
    }

    const commonProps = { data, token, onSaved: fetchData, onToast: addToast };

    switch (activeSection) {
      case 'profile':    return <ProfileEditor    {...commonProps} />;
      case 'stats':      return <StatsEditor      {...commonProps} />;
      case 'photos':     return <PhotosEditor     {...commonProps} />;
      case 'clients':    return <ClientsEditor    {...commonProps} />;
      case 'milestones': return <MilestonesEditor {...commonProps} />;
      case 'categories': return <CategoriesEditor {...commonProps} />;
      default:           return <ProfileEditor    {...commonProps} />;
    }
  };

  const activeNav = NAV_ITEMS.find(n => n.id === activeSection);

  return (
    <div className="admin-root">
      <div className="admin-layout">

        {/* ── Sidebar ── */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <div className="admin-sidebar-brand">
              <div className="admin-sidebar-brand-icon">📸</div>
              <div>
                <div className="admin-sidebar-brand-text">Admin Dashboard</div>
                <div className="admin-sidebar-brand-sub">Ellen Istanto Photography</div>
              </div>
            </div>
          </div>

          <nav className="admin-sidebar-nav">
            <div className="admin-nav-section-label">Content</div>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                className={`admin-nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="admin-nav-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-sidebar-link"
              id="preview-portfolio-link"
            >
              <span>🌐</span>
              <span>View Portfolio</span>
            </a>
            <button
              id="logout-btn"
              className="admin-sidebar-link danger"
              onClick={() => {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_token_exp');
                onLogout();
              }}
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="admin-main">
          {/* Topbar */}
          <div className="admin-topbar">
            <span className="admin-topbar-title">
              {activeNav?.icon} {activeNav?.label}
            </span>
            <div className="admin-topbar-right">
              <span className={`admin-badge ${apiConnected ? 'success' : 'warning'}`}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                {apiConnected ? 'Database Connected' : 'Offline — Using Local Data'}
              </span>
            </div>
          </div>

          {/* Section Content */}
          <div className="admin-content">
            {renderSection()}
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <div className="admin-toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
