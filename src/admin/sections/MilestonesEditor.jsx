import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../config/api';

const EMPTY_MILESTONE = { year: '', title: '', description: '' };

export default function MilestonesEditor({ data, token, onSaved, onToast }) {
  const [milestones, setMilestones] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.milestones) setMilestones(data.milestones.map(m => ({ ...m })));
  }, [data]);

  const handleChange = (index, field, value) => {
    setMilestones(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAdd = () => {
    setMilestones(prev => [...prev, { ...EMPTY_MILESTONE }]);
  };

  const handleDelete = (index) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    setMilestones(prev => {
      const updated = [...prev];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      return updated;
    });
  };

  const handleMoveDown = (index) => {
    setMilestones(prev => {
      if (index === prev.length - 1) return prev;
      const updated = [...prev];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      return updated;
    });
  };

  const handleSave = async () => {
    const filtered = milestones.filter(m => m.year.trim() && m.title.trim());
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/milestones`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ milestones: filtered }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }

      onToast('✅ Career milestones saved!', 'success');
      setMilestones(filtered);
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
        <h2 className="admin-section-title">🗓️ Career Milestones</h2>
        <p className="admin-section-desc">Edit your career journey timeline. Drag to reorder using the arrows.</p>
      </div>

      <div className="admin-card">
        <div className="admin-milestone-list">
          {milestones.map((m, idx) => (
            <div key={idx} className="admin-milestone-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--admin-accent)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, flexShrink: 0
                }}>
                  {idx + 1}
                </span>
                <div style={{ flex: 1 }} />
                <button
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => handleMoveUp(idx)}
                  disabled={idx === 0}
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => handleMoveDown(idx)}
                  disabled={idx === milestones.length - 1}
                  title="Move down"
                >
                  ▼
                </button>
                <button
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={() => handleDelete(idx)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>

              <div className="admin-form-row" style={{ marginBottom: 10 }}>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-form-label">Year / Period</label>
                  <input
                    id={`milestone-year-${idx}`}
                    className="admin-form-input"
                    value={m.year}
                    onChange={e => handleChange(idx, 'year', e.target.value)}
                    placeholder="2024 or Now & Beyond"
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-form-label">Title *</label>
                  <input
                    id={`milestone-title-${idx}`}
                    className="admin-form-input"
                    value={m.title}
                    onChange={e => handleChange(idx, 'title', e.target.value)}
                    placeholder="Festival & Arena Stages"
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginBottom: 0 }}>
                <label className="admin-form-label">Description</label>
                <textarea
                  id={`milestone-desc-${idx}`}
                  className="admin-form-textarea"
                  value={m.description}
                  onChange={e => handleChange(idx, 'description', e.target.value)}
                  rows={2}
                  placeholder="Brief description of this milestone..."
                />
              </div>
            </div>
          ))}
        </div>

        <button id="add-milestone-btn" className="admin-add-btn" onClick={handleAdd}>
          ➕ Add Milestone
        </button>
      </div>

      <div className="admin-save-bar">
        <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
          Entries without year or title will be skipped
        </span>
        <button
          id="milestones-save-btn"
          className="admin-btn admin-btn-accent"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <><span className="admin-spinner" style={{ width: 14, height: 14 }} /> Saving…</> : '💾 Save Milestones'}
        </button>
      </div>
    </div>
  );
}
