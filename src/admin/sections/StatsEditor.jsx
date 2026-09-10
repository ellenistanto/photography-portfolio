import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../config/api';

export default function StatsEditor({ data, token, onSaved, onToast }) {
  const [stats, setStats] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.stats) setStats(data.stats.map(s => ({ ...s })));
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
        body: JSON.stringify({ stats }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }

      onToast('✅ Statistics saved!', 'success');
      onSaved();
    } catch (err) {
      onToast(`❌ ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">📊 Statistics</h2>
        <p className="admin-section-desc">Update the four counter numbers displayed on your portfolio.</p>
      </div>

      <div className="admin-card">
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
          {saving ? <><span className="admin-spinner" style={{ width: 14, height: 14 }} /> Saving…</> : '💾 Save Statistics'}
        </button>
      </div>
    </div>
  );
}
