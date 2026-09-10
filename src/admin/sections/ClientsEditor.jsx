import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../config/api';

export default function ClientsEditor({ data, token, onSaved, onToast }) {
  const [clients, setClients] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.clients) setClients([...data.clients]);
  }, [data]);

  const handleChange = (index, value) => {
    setClients(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAdd = () => {
    setClients(prev => [...prev, '']);
  };

  const handleDelete = (index) => {
    setClients(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const filtered = clients.filter(c => c.trim() !== '');
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/clients`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clients: filtered }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }

      onToast('✅ Clients saved!', 'success');
      setClients(filtered);
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
        <h2 className="admin-section-title">🤝 Clients & Collaborations</h2>
        <p className="admin-section-desc">Manage the list of clients and partners displayed in the scrolling marquee.</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">
          Client Names <span style={{ color: 'var(--admin-text-muted)', fontWeight: 400 }}>({clients.length} total)</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginBottom: 14 }}>
          Each name appears in the scrolling cloud. Use uppercase for brand names.
        </p>

        <div className="admin-list-editor">
          {clients.map((client, idx) => (
            <div key={idx} className="admin-list-item">
              <span style={{ color: 'var(--admin-text-dim)', fontSize: 12, minWidth: 24, textAlign: 'right' }}>
                {idx + 1}.
              </span>
              <input
                id={`client-${idx}`}
                className="admin-list-item-text"
                value={client}
                onChange={e => handleChange(idx, e.target.value)}
                placeholder="CLIENT NAME"
              />
              <button
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={() => handleDelete(idx)}
                aria-label={`Delete ${client}`}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <button id="add-client-btn" className="admin-add-btn" onClick={handleAdd}>
          ➕ Add Client
        </button>
      </div>

      <div className="admin-save-bar">
        <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
          Empty entries will be removed on save
        </span>
        <button
          id="clients-save-btn"
          className="admin-btn admin-btn-accent"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <><span className="admin-spinner" style={{ width: 14, height: 14 }} /> Saving…</> : '💾 Save Clients'}
        </button>
      </div>
    </div>
  );
}
