import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, ArrowUp, ArrowDown, Check, Search, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { API_BASE } from '../../config/api';
import { updatePortfolioCache } from '../../hooks/usePortfolioData';

export default function OverviewEditor({ data, token, onSaved, onToast }) {
  const [enabled, setEnabled] = useState(true);
  const [title, setTitle] = useState('Selected Works');
  const [subtitle, setSubtitle] = useState('Curated highlights & moments in between');
  const [overviewPhotoIds, setOverviewPhotoIds] = useState([]);
  const [saving, setSaving] = useState(false);

  // Modal selector state
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState('all');

  // Drag & drop state for overview items
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const allPhotos = data?.photos || [];
  const categories = data?.categories || [];

  // Initialize from props
  useEffect(() => {
    if (data?.overview) {
      setEnabled(data.overview.enabled !== false);
      setTitle(data.overview.title || 'Selected Works');
      setSubtitle(data.overview.subtitle || 'Curated highlights & moments in between');
      if (Array.isArray(data.overview.photoIds)) {
        setOverviewPhotoIds(data.overview.photoIds);
      } else {
        // Fallback: collect photos that have isOverview: true
        const initialIds = (data.photos || []).filter(p => p.isOverview).map(p => p.id);
        setOverviewPhotoIds(initialIds);
      }
    } else if (data?.photos) {
      const initialIds = data.photos.filter(p => p.isOverview).map(p => p.id);
      setOverviewPhotoIds(initialIds);
    }
  }, [data]);

  // Compute selected photo objects in exact order of overviewPhotoIds
  const selectedPhotos = overviewPhotoIds
    .map(id => allPhotos.find(p => p.id === id))
    .filter(Boolean);

  // Move item up/down
  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= overviewPhotoIds.length) return;
    const newIds = [...overviewPhotoIds];
    const [moved] = newIds.splice(index, 1);
    newIds.splice(targetIdx, 0, moved);
    setOverviewPhotoIds(newIds);
  };

  // Remove single photo from overview
  const handleRemove = (photoId) => {
    setOverviewPhotoIds(prev => prev.filter(id => id !== photoId));
  };

  // Toggle selection in the picker modal
  const handleTogglePickerPhoto = (photoId) => {
    setOverviewPhotoIds(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });
  };

  // Drag handlers
  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    setDragOverIdx(index);
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    const newIds = [...overviewPhotoIds];
    const [moved] = newIds.splice(draggedIdx, 1);
    newIds.splice(targetIdx, 0, moved);
    setOverviewPhotoIds(newIds);
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  // Save changes to backend
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        enabled,
        title: title.trim() || 'Selected Works',
        subtitle: subtitle.trim(),
        photoIds: overviewPhotoIds,
      };

      const res = await fetch(`${API_BASE}/api/portfolio/overview`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Failed to save overview');
      }

      const updated = await res.json();
      if (data) {
        const fullUpdated = {
          ...data,
          overview: updated.overview,
          photos: updated.photos || data.photos,
        };
        updatePortfolioCache(fullUpdated);
      }

      onToast('✅ Overview berhasil diperbarui!', 'success');
      onSaved?.();
    } catch (err) {
      console.error('Save overview error:', err);
      onToast(`❌ ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Filtered photos for the picker modal
  const pickerList = allPhotos.filter(photo => {
    const matchCat = pickerCategory === 'all' || photo.category === pickerCategory;
    const matchSearch = !pickerSearch ||
      photo.title.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      photo.client?.toLowerCase().includes(pickerSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="admin-section-content">
      {/* Header Bar */}
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Overview (Halaman Depan)</h2>
          <p className="admin-section-subtitle">
            Pilih dan urutkan foto-foto terbaik yang ingin Anda tampilkan secara khusus di halaman utama website.
          </p>
        </div>

        <button
          className="admin-btn admin-btn-accent"
          onClick={handleSave}
          disabled={saving}
          id="overview-save-btn"
        >
          {saving ? (
            <><span className="admin-spinner" style={{ width: 14, height: 14 }} /> Menyimpan…</>
          ) : (
            '💾 Simpan Overview'
          )}
        </button>
      </div>

      {/* Overview General Settings Card */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} style={{ color: 'var(--accent-red)' }} />
          Pengaturan Seksi Overview
        </h3>

        <div style={{ marginTop: 16 }}>
          {/* Toggle Enable/Disable */}
          <div className="admin-toggle-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--admin-bg-secondary)', borderRadius: 8, marginBottom: 18 }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--admin-text-primary)' }}>Tampilkan Seksi Overview di Halaman Depan</div>
              <div style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                Jika dimatikan, seksi overview akan disembunyikan tanpa menghapus daftar foto yang sudah Anda pilih.
              </div>
            </div>
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={enabled}
                onChange={e => setEnabled(e.target.checked)}
                id="overview-enabled-switch"
              />
              <span className="admin-slider round"></span>
            </label>
          </div>

          {/* Title & Subtitle inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Judul Seksi (*Title*)</label>
              <input
                type="text"
                className="admin-form-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Contoh: Selected Works / Curated Highlights"
                id="overview-title-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Subjudul Seksi (*Subtitle*)</label>
              <input
                type="text"
                className="admin-form-input"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="Contoh: Curated highlights & moments in between"
                id="overview-subtitle-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Photos Card */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
          <div>
            <h3 className="admin-card-title" style={{ margin: 0 }}>
              Foto Pilihan ({selectedPhotos.length} Terpilih)
            </h3>
            <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', margin: '4px 0 0 0' }}>
              💡 Disarankan memilih <strong>3 hingga 8 foto</strong> agar kurasi terlihat eksklusif dan loading tetap instan. Geser untuk mengatur urutan.
            </p>
          </div>

          <button
            type="button"
            className="admin-btn admin-btn-accent"
            onClick={() => setShowPicker(true)}
            id="overview-open-picker-btn"
          >
            <Plus size={16} />
            <span>Pilih Foto dari Galeri</span>
          </button>
        </div>

        {/* Selected Photos List */}
        {selectedPhotos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--admin-bg-secondary)', borderRadius: 10, border: '1px dashed var(--admin-border)' }}>
            <ImageIcon size={44} style={{ color: 'var(--admin-text-muted)', opacity: 0.6, marginBottom: 12 }} />
            <h4 style={{ color: 'var(--admin-text-primary)', marginBottom: 6 }}>Belum Ada Foto Overview</h4>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: 14, maxWidth: 460, margin: '0 auto 16px auto' }}>
              Klik tombol di bawah untuk memilih foto-foto unggulan dari galeri yang ingin Anda sorot di halaman depan.
            </p>
            <button
              type="button"
              className="admin-btn admin-btn-accent"
              onClick={() => setShowPicker(true)}
            >
              <Plus size={16} />
              <span>Pilih Foto Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="overview-selected-list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {selectedPhotos.map((photo, index) => {
              const isDraggingThis = draggedIdx === index;
              const isDragOverThis = dragOverIdx === index;

              return (
                <div
                  key={photo.id}
                  className={`overview-item-row ${isDraggingThis ? 'is-dragging' : ''} ${isDragOverThis ? 'is-drag-over' : ''}`}
                  draggable
                  onDragStart={e => handleDragStart(e, index)}
                  onDragOver={e => handleDragOver(e, index)}
                  onDrop={e => handleDrop(e, index)}
                  onDragEnd={() => { setDraggedIdx(null); setDragOverIdx(null); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '10px 14px',
                    background: 'var(--admin-bg-secondary)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 8,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Order Number & Drag Handle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--admin-text-muted)', cursor: 'grab' }} title="Tarik untuk geser urutan">
                    <span style={{ fontSize: 16 }}>⠿</span>
                    <span style={{ fontWeight: 700, fontSize: 13, minWidth: 20 }}>#{index + 1}</span>
                  </div>

                  {/* Thumbnail */}
                  <img
                    src={photo.thumb || photo.image}
                    alt={photo.title}
                    style={{
                      width: 56,
                      height: 42,
                      objectFit: 'cover',
                      borderRadius: 4,
                      background: 'var(--admin-bg-primary)',
                      border: '1px solid var(--admin-border)'
                    }}
                  />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--admin-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {photo.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
                      <span className="admin-badge" style={{ padding: '1px 6px', fontSize: 11 }}>
                        {photo.categoryLabel || photo.category}
                      </span>
                      {photo.client && <span>• {photo.client}</span>}
                      {photo.year && <span>• {photo.year}</span>}
                    </div>
                  </div>

                  {/* Move Up / Down Buttons */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      title="Geser ke atas"
                      style={{ padding: '4px 8px' }}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === selectedPhotos.length - 1}
                      title="Geser ke bawah"
                      style={{ padding: '4px 8px' }}
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    style={{ color: '#ef4444', padding: '4px 8px' }}
                    onClick={() => handleRemove(photo.id)}
                    title="Hapus dari Overview"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visual Photo Picker Modal */}
      {showPicker && (
        <div className="admin-modal-overlay" onClick={() => setShowPicker(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: 840, width: '92vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--admin-border)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, color: 'var(--admin-text-primary)' }}>
                  Pilih Foto untuk Overview
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--admin-text-muted)' }}>
                  Centang foto yang ingin ditampilkan di halaman depan ({overviewPhotoIds.length} terpilih).
                </p>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={() => setShowPicker(false)}
                style={{ fontSize: 20, padding: '4px 10px' }}
              >
                ×
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div style={{ display: 'flex', gap: 10, padding: '14px 0', borderBottom: '1px solid var(--admin-border)', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--admin-text-muted)' }} />
                <input
                  type="text"
                  className="admin-form-input"
                  style={{ paddingLeft: 36, height: 38 }}
                  placeholder="Cari foto berdasarkan judul atau klien..."
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                />
              </div>

              <select
                className="admin-form-select"
                style={{ width: 'auto', minWidth: 150, height: 38 }}
                value={pickerCategory}
                onChange={e => setPickerCategory(e.target.value)}
              >
                <option value="all">Semua Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Photos Grid for Selection */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 4px', minHeight: 280 }}>
              {pickerList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--admin-text-muted)' }}>
                  <p>Tidak ada foto yang cocok dengan filter pencarian.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
                  {pickerList.map(photo => {
                    const isSelected = overviewPhotoIds.includes(photo.id);
                    return (
                      <div
                        key={photo.id}
                        onClick={() => handleTogglePickerPhoto(photo.id)}
                        style={{
                          position: 'relative',
                          borderRadius: 8,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: isSelected ? '2px solid var(--accent-red)' : '1px solid var(--admin-border)',
                          background: 'var(--admin-bg-secondary)',
                          transform: isSelected ? 'scale(0.98)' : 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <img
                          src={photo.thumb || photo.image}
                          alt={photo.title}
                          style={{
                            width: '100%',
                            height: 120,
                            objectFit: 'cover',
                            display: 'block',
                            opacity: isSelected ? 1 : 0.85,
                          }}
                        />

                        {/* Selected Checkmark Badge */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 26,
                            height: 26,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isSelected ? 'var(--accent-red)' : 'rgba(15,15,20,0.7)',
                            color: '#fff',
                            border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.4)',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {isSelected && <Check size={16} strokeWidth={3} />}
                        </div>

                        {/* Title Bar */}
                        <div style={{ padding: '8px 10px', background: 'var(--admin-bg-secondary)' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {photo.title}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                            {photo.categoryLabel || photo.category}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--admin-border)' }}>
              <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
                {overviewPhotoIds.length} foto terpilih untuk Overview
              </span>
              <button
                type="button"
                className="admin-btn admin-btn-accent"
                onClick={() => setShowPicker(false)}
              >
                ✓ Selesai Memilih
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
