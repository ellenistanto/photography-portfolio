import React, { useState, useEffect, useCallback } from 'react';
import './admin.css';

import ProfileEditor from './sections/ProfileEditor';
import StatsEditor from './sections/StatsEditor';
import PhotosEditor from './sections/PhotosEditor';
import ClientsEditor from './sections/ClientsEditor';
import MilestonesEditor from './sections/MilestonesEditor';
import CategoriesEditor from './sections/CategoriesEditor';
import OverviewEditor from './sections/OverviewEditor';
import ProjectsEditor from './sections/ProjectsEditor';
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
  { id: 'profile',     label: 'Profile' },
  { id: 'projects',    label: 'Projects & Series' },
  { id: 'overview',    label: 'Overview / Highlights' },
  { id: 'photos',      label: 'Gallery Photos' },
  { id: 'stats',       label: 'Statistics' },
  { id: 'clients',     label: 'Clients' },
  { id: 'milestones',  label: 'Milestones' },
  { id: 'categories',  label: 'Categories' },
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
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--admin-text)', marginBottom: 4 }}>Cannot connect to backend server</div>
          <p style={{ fontSize: 14, maxWidth: 400, lineHeight: 1.5 }}>
            Make sure your backend server is running on <code style={{ color: 'var(--admin-accent-hover)' }}>{API_BASE}</code>.
            Check your <code>.env</code> file and run <code>npm start</code> in the <code>server/</code> folder.
          </p>
          <button className="admin-btn admin-btn-ghost" onClick={fetchData}>Retry Connection</button>
        </div>
      );
    }

    const commonProps = { data, token, onSaved: fetchData, onToast: addToast };

    switch (activeSection) {
      case 'profile':    return <ProfileEditor    {...commonProps} />;
      case 'projects':   return <ProjectsEditor   {...commonProps} />;
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
              <div className="admin-sidebar-brand-dot" />
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
              View Portfolio
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
              Logout
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
              <span className="admin-topbar-title">{activeNav?.label}</span>
            </div>
            <div className="admin-topbar-right">
              <span className={`admin-badge ${apiConnected ? 'success' : 'warning'}`}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                <span className="admin-badge-text">{apiConnected ? 'Connected' : 'Offline'}</span>
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
