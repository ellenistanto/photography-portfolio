import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../config/api';

export default function CategoriesEditor({ data, token, onSaved, onToast }) {
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.categories) setCategories(data.categories.map(c => ({ ...c })));
  }, [data]);

  const handleChange = (index, field, value) => {
    setCategories(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAdd = () => {
    const newId = `cat_${Date.now()}`;
    setCategories(prev => [...prev, { id: newId, name: '' }]);
  };

  const handleDelete = (index) => {
    // Prevent deleting 'all' category
    if (categories[index]?.id === 'all') {
      onToast('⚠️ Cannot delete the "All Works" category', 'error');
      return;
    }
    setCategories(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const filtered = categories.filter(c => c.id.trim() && c.name.trim());
    
    // Ensure 'all' is always first
    const allIndex = filtered.findIndex(c => c.id === 'all');
    if (allIndex === -1) {
      filtered.unshift({ id: 'all', name: 'All Works' });
    } else if (allIndex > 0) {
      const [allCat] = filtered.splice(allIndex, 1);
      filtered.unshift(allCat);
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/categories`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categories: filtered }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }

      onToast('✅ Categories saved!', 'success');
      setCategories(filtered);
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
        <h2 className="admin-section-title">🏷️ Gallery Categories</h2>
        <p className="admin-section-desc">
          Manage filter tabs in the gallery. The <strong>"All Works"</strong> category is always kept as the first tab.
        </p>
      </div>

      <div className="admin-card">
        <div className="admin-list-editor">
          {categories.map((cat, idx) => (
            <div key={cat.id} className="admin-list-item">
              <span style={{ fontSize: 12, color: 'var(--admin-text-dim)', minWidth: 24, textAlign: 'right' }}>
                {idx + 1}.
              </span>
              <div style={{ display: 'flex', gap: 8, flex: 1 }}>
                <input
                  id={`cat-id-${idx}`}
                  className="admin-list-item-text"
                  value={cat.id}
                  onChange={e => handleChange(idx, 'id', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="category-id"
                  disabled={cat.id === 'all'}
                  style={{
                    maxWidth: 140,
                    fontFamily: 'monospace',
                    fontSize: 12,
                    color: 'var(--admin-text-muted)',
                    opacity: cat.id === 'all' ? 0.5 : 1,
                  }}
                />
                <span style={{ color: 'var(--admin-text-dim)', alignSelf: 'center' }}>→</span>
                <input
                  id={`cat-name-${idx}`}
                  className="admin-list-item-text"
                  value={cat.name}
                  onChange={e => handleChange(idx, 'name', e.target.value)}
                  placeholder="Category Display Name"
                  disabled={cat.id === 'all'}
                  style={{ opacity: cat.id === 'all' ? 0.5 : 1 }}
                />
              </div>
              {cat.id === 'all' ? (
                <span style={{ fontSize: 11, color: 'var(--admin-text-dim)', padding: '0 8px' }}>🔒 Fixed</span>
              ) : (
                <button
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={() => handleDelete(idx)}
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>

        <button id="add-category-btn" className="admin-add-btn" onClick={handleAdd}>
          ➕ Add Category
        </button>

        <p style={{ fontSize: 12, color: 'var(--admin-text-dim)', marginTop: 12, lineHeight: 1.5 }}>
          <strong>Tip:</strong> Category IDs are used to match photos to categories. If you rename an ID, update the photos in that category too.
        </p>
      </div>

      <div className="admin-save-bar">
        <button
          id="categories-save-btn"
          className="admin-btn admin-btn-accent"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <><span className="admin-spinner" style={{ width: 14, height: 14 }} /> Saving…</> : '💾 Save Categories'}
        </button>
      </div>
    </div>
  );
}
