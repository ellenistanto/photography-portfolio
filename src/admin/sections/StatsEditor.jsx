import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../config/api';

export default function StatsEditor({ data, token, onSaved, onToast }) {
  const [stats, setStats] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.stats) setStats(data.stats.map(s => ({ ...s })));
    if (typeof data?.showStats === 'boolean') {
      setShowStats(data.showStats);
    }
  }, [data]);

  const handleChange = (index, field, value) => {
    setStats(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: field === 'number' ? Number(value) : value };
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/stats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stats, showStats }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }

      onToast('Statistics saved successfully', 'success');
      onSaved();
    } catch (err) {
      onToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Statistics</h2>
        <p className="admin-section-desc">Atur angka pencapaian dan status penampilannya di portfolio.</p>
      </div>

      {/* Visibility Toggle */}
      <div
        className="admin-toggle-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'var(--admin-bg-secondary)',
          borderRadius: 8,
          border: '1px solid var(--admin-border)',
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--admin-text-primary)' }}>
            Tampilkan Statistik di Halaman Depan
          </div>
          <div style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: 2 }}>
            {showStats
              ? 'Seksi statistik dan angka pencapaian saat ini aktif ditampilkan di portfolio.'
              : 'Seksi statistik disembunyikan dari portfolio tanpa menghapus data angka.'}
          </div>
        </div>
        <label className="admin-switch">
          <input
            type="checkbox"
            checked={showStats}
            onChange={e => setShowStats(e.target.checked)}
            id="stats-show-toggle"
          />
          <span className="admin-slider round"></span>
        </label>
      </div>

      <div className="admin-card" style={{ opacity: showStats ? 1 : 0.75, transition: 'opacity 0.2s ease' }}>
        <div className="admin-stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="admin-stat-card">
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: 'var(--admin-accent-hover)',
                  marginBottom: 12,
                  letterSpacing: '-1px'
                }}
              >
                {stat.number}{stat.suffix}
              </div>

              <div className="admin-form-row" style={{ marginBottom: 10 }}>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-form-label">Number</label>
                  <input
                    id={`stat-number-${idx}`}
                    className="admin-form-input"
                    type="number"
                    min={0}
                    value={stat.number}
                    onChange={e => handleChange(idx, 'number', e.target.value)}
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-form-label">Suffix</label>
                  <input
                    id={`stat-suffix-${idx}`}
                    className="admin-form-input"
                    value={stat.suffix}
                    onChange={e => handleChange(idx, 'suffix', e.target.value)}
                    placeholder="+"
                    maxLength={5}
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-form-label">Label</label>
                <input
                  id={`stat-label-${idx}`}
                  className="admin-form-input"
                  value={stat.label}
                  onChange={e => handleChange(idx, 'label', e.target.value)}
                  placeholder="Years Behind The Lens"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-save-bar">
        <button
          id="stats-save-btn"
          className="admin-btn admin-btn-accent"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <><span className="admin-spinner" style={{ width: 14, height: 14 }} /> Saving…</> : 'Save Statistics'}
        </button>
      </div>
    </div>
  );
}
