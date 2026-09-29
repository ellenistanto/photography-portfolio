import React, { useState, useEffect, useCallback } from 'react';
import './admin.css';

import ProfileEditor from './sections/ProfileEditor';
import StatsEditor from './sections/StatsEditor';
import PhotosEditor from './sections/PhotosEditor';
import ClientsEditor from './sections/ClientsEditor';
import MilestonesEditor from './sections/MilestonesEditor';
import CategoriesEditor from './sections/CategoriesEditor';
import OverviewEditor from './sections/OverviewEditor';
import { API_BASE } from '../config/api';
import { updatePortfolioCache } from '../hooks/usePortfolioData';

// ── Hamburger Icon ─────────────────────────────────────────────────────────────
function HamburgerIcon({ open }) {
  return (
    <svg className={`admin-hamburger-icon ${open ? 'open' : ''}`} width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect className="bar bar-1" x="2" y="5" width="18" height="2" rx="1" fill="currentColor" />
      <rect className="bar bar-2" x="2" y="10" width="18" height="2" rx="1" fill="currentColor" />
      <rect className="bar bar-3" x="2" y="15" width="18" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

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
  { id: 'profile',     label: 'Profile & Bio' },
  { id: 'overview',    label: 'Overview Highlights' },
  { id: 'photos',      label: 'Gallery Photos' },
  { id: 'stats',       label: 'Key Statistics' },
  { id: 'clients',     label: 'Clients & Partners' },
  { id: 'milestones',  label: 'Career Milestones' },
  { id: 'categories',  label: 'Gallery Categories' },
];

export default function AdminDashboard({ token, onLogout }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      updatePortfolioCache(json);
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
          <span style={{ fontSize: 13 }}>Loading portfolio data…</span>
        </div>
      );
    }

    if (!apiConnected) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 300, gap: 14, color: 'var(--admin-text-muted)', textAlign: 'center', padding: 32
        }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--admin-text-primary)', marginBottom: 4 }}>
            Backend Server Unreachable
          </div>
          <p style={{ fontSize: 13, maxWidth: 440, lineHeight: 1.6, color: 'var(--admin-text-muted)' }}>
            Ensure your backend is running at <code style={{ color: 'var(--admin-text-primary)' }}>{API_BASE}</code>.
            Verify your server configuration or restart the service.
          </p>
          <button className="admin-btn admin-btn-ghost" onClick={fetchData} style={{ marginTop: 8 }}>
            Retry Connection
          </button>
        </div>
      );
    }

    const commonProps = { data, token, onSaved: fetchData, onToast: addToast };

    switch (activeSection) {
      case 'profile':    return <ProfileEditor    {...commonProps} />;
      case 'overview':   return <OverviewEditor   {...commonProps} />;
      case 'photos':     return <PhotosEditor     {...commonProps} />;
      case 'stats':      return <StatsEditor      {...commonProps} />;
      case 'clients':    return <ClientsEditor    {...commonProps} />;
      case 'milestones': return <MilestonesEditor {...commonProps} />;
      case 'categories': return <CategoriesEditor {...commonProps} />;
      default:           return <ProfileEditor    {...commonProps} />;
    }
  };

  const activeNav = NAV_ITEMS.find(n => n.id === activeSection);

  const handleNavClick = (id) => {
    setActiveSection(id);
    setSidebarOpen(false); // close sidebar on mobile after selection
  };

  return (
    <div className="admin-root">
      <div className="admin-layout">

        {/* ── Mobile Sidebar Overlay ── */}
        {sidebarOpen && (
          <div
            className="admin-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Sidebar ── */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-header">
            <div className="admin-sidebar-brand">
              <span className="admin-sidebar-brand-name">Ellen Istanto</span>
              <span className="admin-sidebar-brand-badge">CMS</span>
            </div>
          </div>

          <nav className="admin-sidebar-nav">
            <div className="admin-nav-section-label">Sections</div>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                className={`admin-nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
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
              <span>Live Portfolio</span>
              <span style={{ marginLeft: 'auto', fontSize: 13, opacity: 0.7 }}>↗</span>
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
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="admin-main">
          {/* Topbar */}
          <div className="admin-topbar">
            <div className="admin-topbar-left">
              <button
                id="sidebar-toggle-btn"
                className="admin-hamburger-btn"
                onClick={() => setSidebarOpen(prev => !prev)}
                aria-label="Toggle navigation"
              >
                <HamburgerIcon open={sidebarOpen} />
              </button>
              <h2 className="admin-topbar-title">{activeNav?.label}</h2>
            </div>
            <div className="admin-topbar-right">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="admin-topbar-link"
              >
                <span>Live Site</span>
                <span style={{ fontSize: 13, opacity: 0.7 }}>↗</span>
              </a>
              <button
                className="admin-topbar-signout"
                onClick={() => {
                  localStorage.removeItem('admin_token');
                  localStorage.removeItem('admin_token_exp');
                  onLogout();
                }}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Offline alert banner if server drops */}
          {!loading && !apiConnected && (
            <div className="admin-offline-banner" role="alert">
              <span>Connection lost to backend ({API_BASE}).</span>
              <button onClick={fetchData} className="admin-offline-retry">Retry</button>
            </div>
          )}

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
