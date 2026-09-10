import React, { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE } from '../../config/api';

function ConfirmDialog({ title, text, onConfirm, onCancel }) {
  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal admin-confirm-dialog" onClick={e => e.stopPropagation()}>
        <div className="admin-confirm-icon">🗑️</div>
        <div className="admin-confirm-title">{title}</div>
        <div className="admin-confirm-text">{text}</div>
        <div className="admin-confirm-actions">
          <button className="admin-btn admin-btn-ghost" onClick={onCancel}>Cancel</button>
          <button id="confirm-delete-btn" className="admin-btn admin-btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function PhotoModal({ photo, categories, token, onClose, onSave, onToast }) {
  const [form, setForm] = useState({
    title: '', category: 'concerts', categoryLabel: '', year: '',
    client: '', aspect: 'portrait', image: '', thumb: '', description: '',
  });
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'url'
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (photo) {
      setForm({ ...photo });
      // If photo already has an external or local image, detect mode
      if (photo.image && photo.image.startsWith('http') && !photo.image.includes('/uploads/')) {
        setInputMode('url');
      } else {
        setInputMode('upload');
      }
    }
  }, [photo]);

  const handleChange = (field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'category') {
        const cat = categories.find(c => c.id === value);
        if (cat) updated.categoryLabel = cat.name;
      }
      if (field === 'image' && !prev.thumb) {
        updated.thumb = value;
      }
      return updated;
    });
  };

  // Upload handler for File object
  const processUpload = useCallback(async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onToast?.('Hanya file gambar yang diperbolehkan (JPG, PNG, WEBP, GIF, AVIF)', 'error');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      onToast?.('Ukuran file maksimal 20MB', 'error');
      return;
    }

    setUploading(true);
    setUploadProgress(25);
    setPreviewError(false);

    const formData = new FormData();
    formData.append('file', file);

    const progressTimer = setTimeout(() => setUploadProgress(70), 200);

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      clearTimeout(progressTimer);
      setUploadProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload gagal');
      }

      const result = await res.json();
      const uploadedUrl = result.url;

      // Auto detect image dimensions & aspect ratio
      const img = new Image();
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        let detectedAspect = 'landscape';
        if (ratio < 0.85) detectedAspect = 'portrait';
        else if (ratio <= 1.15) detectedAspect = 'square';

        setForm(prev => ({
          ...prev,
          image: uploadedUrl,
          thumb: uploadedUrl,
          aspect: detectedAspect,
          title: prev.title || (() => {
            const base = file.name
              .replace(/\.[^/.]+$/, '')
              .replace(/[-_]+/g, ' ')
              .trim();
            return base.charAt(0).toUpperCase() + base.slice(1);
          })(),
        }));
      };
      img.onerror = () => {
        setForm(prev => ({
          ...prev,
          image: uploadedUrl,
          thumb: uploadedUrl,
        }));
      };
      img.src = uploadedUrl;

      onToast?.('✅ Foto berhasil diunggah!', 'success');
    } catch (err) {
      onToast?.(`❌ ${err.message}`, 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [token, onToast]);

  // Handle drag & drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processUpload(e.target.files[0]);
    }
  };

  // Clipboard paste support (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            processUpload(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processUpload]);

  const handleSubmit = async () => {
    if (!form.title || !form.category || !form.image) {
      onToast?.('Harap lengkapi judul, kategori, dan foto', 'error');
      return;
    }
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const availableCategories = categories.filter(c => c.id !== 'all');

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">{photo?.id ? '✏️ Edit Photo' : '➕ Add New Photo'}</h3>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="admin-tabs-segmented">
          <button
            type="button"
            className={`admin-tab-seg-btn ${inputMode === 'upload' ? 'active' : ''}`}
            onClick={() => setInputMode('upload')}
          >
            📤 Upload File (Drag & Drop)
          </button>
          <button
            type="button"
            className={`admin-tab-seg-btn ${inputMode === 'url' ? 'active' : ''}`}
            onClick={() => setInputMode('url')}
          >
            🔗 External Image URL
          </button>
        </div>

        {/* Upload Mode Area */}
        {inputMode === 'upload' && (
          <div style={{ marginBottom: 18 }}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            {form.image ? (
              <div className="admin-dropzone-preview">
                <img
                  src={form.image}
                  alt="Preview"
                  onError={() => setPreviewError(true)}
                />
                <div className="admin-dropzone-preview-overlay">
                  <button
                    type="button"
                    className="admin-dropzone-remove-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    🔄 Ganti Foto
                  </button>
                  <button
                    type="button"
                    className="admin-dropzone-remove-btn"
                    onClick={() => handleChange('image', '')}
                  >
                    ✕ Hapus
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`admin-dropzone ${isDragging ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <>
                    <div className="admin-spinner" style={{ width: 32, height: 32 }} />
                    <div className="admin-dropzone-text">Mengunggah foto… ({uploadProgress}%)</div>
                    <div className="admin-upload-progress">
                      <div className="admin-upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="admin-dropzone-icon">📥</div>
                    <div className="admin-dropzone-text">
                      <strong>Tarik & lepas foto</strong> ke sini, atau klik untuk browse
                    </div>
                    <div className="admin-dropzone-subtext">
                      Mendukung JPG, PNG, WEBP, GIF, AVIF (Maks. 20MB)
                    </div>
                    <div className="admin-dropzone-badges">
                      <span className="admin-dropzone-badge">⚡ Auto-detect ratio</span>
                      <span className="admin-dropzone-badge">📋 Support Ctrl+V paste</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* URL Mode Area */}
        {inputMode === 'url' && (
          <div style={{ marginBottom: 18 }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Image URL * (full-size)</label>
              <input
                id="photo-image"
                className="admin-form-input"
                value={form.image}
                onChange={e => {
                  handleChange('image', e.target.value);
                  setPreviewError(false);
                }}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            {form.image && (
              <div className="admin-dropzone-preview" style={{ maxHeight: 180 }}>
                <img
                  src={form.image}
                  alt="Preview"
                  onError={() => setPreviewError(true)}
                />
              </div>
            )}
          </div>
        )}

        {/* Photo Info Form Fields */}
        <div className="admin-form-row" style={{ marginBottom: 14 }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Title *</label>
            <input
              id="photo-title"
              className="admin-form-input"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="Photo title"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Category *</label>
            <select
              id="photo-category"
              className="admin-form-select"
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
            >
              {availableCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-form-row" style={{ marginBottom: 14 }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Year</label>
            <input
              id="photo-year"
              className="admin-form-input"
              value={form.year}
              onChange={e => handleChange('year', e.target.value)}
              placeholder="2024"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Aspect Ratio</label>
            <select
              id="photo-aspect"
              className="admin-form-select"
              value={form.aspect}
              onChange={e => handleChange('aspect', e.target.value)}
            >
              <option value="portrait">Portrait (tall)</option>
              <option value="landscape">Landscape (wide)</option>
              <option value="square">Square</option>
            </select>
          </div>
        </div>

        <div className="admin-form-group" style={{ marginBottom: 14 }}>
          <label className="admin-form-label">Client / Project Name</label>
          <input
            id="photo-client"
            className="admin-form-input"
            value={form.client}
            onChange={e => handleChange('client', e.target.value)}
            placeholder="e.g. Joyland Festival, Synchronize Fest"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Description (optional)</label>
          <textarea
            id="photo-description"
            className="admin-form-textarea"
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={2}
            placeholder="Short description shown in lightbox..."
          />
        </div>

        <div className="admin-save-bar">
          <button className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            id="photo-save-btn"
            className="admin-btn admin-btn-accent"
            onClick={handleSubmit}
            disabled={saving || uploading || !form.title || !form.image}
          >
            {saving ? (
              <><span className="admin-spinner" style={{ width: 14, height: 14 }} /> Saving…</>
            ) : (
              '💾 Save Photo'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PhotosEditor({ data, token, onSaved, onToast }) {
  const [photos, setPhotos] = useState([]);
  const [filterCat, setFilterCat] = useState('all');
  const [modalPhoto, setModalPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Drag & drop reorder state
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    if (data?.photos) {
      setPhotos([...data.photos].sort((a, b) => a.order - b.order));
    }
  }, [data]);

  const categories = data?.categories || [];

  const isReorderable = filterCat === 'all' && !searchTerm;

  const displayed = photos.filter(p => {
    const matchCat = filterCat === 'all' || p.category === filterCat;
    const matchSearch = !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = () => {
    setModalPhoto(null);
    setShowModal(true);
  };

  const handleEdit = (photo) => {
    setModalPhoto(photo);
    setShowModal(true);
  };

  const handleSavePhoto = async (form) => {
    try {
      const isEdit = !!form.id;
      const url = isEdit
        ? `${API_BASE}/api/portfolio/photos/${form.id}`
        : `${API_BASE}/api/portfolio/photos`;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }

      onToast(isEdit ? '✅ Photo updated!' : '✅ Photo added!', 'success');
      setShowModal(false);
      onSaved();
    } catch (err) {
      onToast(`❌ ${err.message}`, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/photos/${confirmId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed');

      onToast('🗑️ Photo deleted', 'success');
      setConfirmId(null);
      onSaved();
    } catch (err) {
      onToast(`❌ ${err.message}`, 'error');
      setConfirmId(null);
    }
  };

  // Reorder drag handlers
  const handleDragStart = (e, index) => {
    if (!isReorderable) return;
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleCardDragOver = (e, index) => {
    if (!isReorderable || draggedIdx === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleCardDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (!isReorderable || draggedIdx === null || draggedIdx === dropIndex) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const reordered = [...photos];
    const [movedItem] = reordered.splice(draggedIdx, 1);
    reordered.splice(dropIndex, 0, movedItem);

    // Re-index order
    const updated = reordered.map((item, idx) => ({ ...item, order: idx }));
    setPhotos(updated);
    setDraggedIdx(null);
    setDragOverIdx(null);

    // Save batch to server
    try {
      setReordering(true);
      const res = await fetch(`${API_BASE}/api/portfolio/photos/reorder/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: updated.map(p => p.id) }),
      });

      if (!res.ok) throw new Error('Failed to save order');
      onToast('✅ Urutan foto berhasil disimpan!', 'success');
      onSaved();
    } catch (err) {
      onToast(`❌ Gagal menyimpan urutan: ${err.message}`, 'error');
    } finally {
      setReordering(false);
    }
  };

  // Move up/down single step (accessible reorder)
  const handleMoveStep = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const reordered = [...photos];
    const [movedItem] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, movedItem);

    const updated = reordered.map((item, idx) => ({ ...item, order: idx }));
    setPhotos(updated);

    try {
      const res = await fetch(`${API_BASE}/api/portfolio/photos/reorder/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: updated.map(p => p.id) }),
      });
      if (!res.ok) throw new Error('Failed to save order');
      onToast('✅ Urutan foto diperbarui!', 'success');
      onSaved();
    } catch (err) {
      onToast(`❌ ${err.message}`, 'error');
    }
  };

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">🖼️ Gallery Photos</h2>
        <p className="admin-section-desc">
          Kelola foto portofolio kamu. Tambah dengan tarik & lepas (Drag & Drop), atur urutan posisi foto, atau edit detailnya.
        </p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          id="photos-search"
          className="admin-form-input"
          style={{ maxWidth: 220, marginBottom: 0 }}
          placeholder="🔍 Search photos…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          id="photos-filter-cat"
          className="admin-form-select"
          style={{ maxWidth: 180, marginBottom: 0 }}
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <span style={{ color: 'var(--admin-text-muted)', fontSize: 13 }}>
          {displayed.length} of {photos.length} photos
        </span>

        <button
          id="add-photo-btn"
          className="admin-btn admin-btn-accent"
          style={{ marginLeft: 'auto' }}
          onClick={handleAdd}
        >
          ➕ Add Photo
        </button>
      </div>

      {/* Tip Banner */}
      {isReorderable && photos.length > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: 8,
          padding: '8px 14px',
          fontSize: 12,
          color: 'var(--admin-accent-hover)',
          marginBottom: 16,
        }}>
          <span>✨</span>
          <span>
            <strong>Drag & Drop Aktif:</strong> Tarik kartu foto atau gunakan tombol panah (⬆/⬇) untuk mengubah urutan tampil di galeri.
          </span>
        </div>
      )}

      {/* Photo Grid */}
      {displayed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--admin-text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
          <p>{searchTerm || filterCat !== 'all' ? 'No photos match your filter.' : 'No photos yet. Add your first one!'}</p>
        </div>
      ) : (
        <div className="admin-photo-grid">
          {displayed.map((photo, index) => {
            const isDraggingThis = draggedIdx === index;
            const isDragOverThis = dragOverIdx === index;

            return (
              <div
                key={photo.id}
                className={`admin-photo-card ${isDraggingThis ? 'is-dragging' : ''} ${isDragOverThis ? 'is-drag-over' : ''}`}
                draggable={isReorderable}
                onDragStart={e => handleDragStart(e, index)}
                onDragOver={e => handleCardDragOver(e, index)}
                onDrop={e => handleCardDrop(e, index)}
                onDragEnd={() => { setDraggedIdx(null); setDragOverIdx(null); }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    className="admin-photo-card-thumb"
                    src={photo.thumb || photo.image}
                    alt={photo.title}
                    loading="lazy"
                    onError={e => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="67"/>'; }}
                  />

                  {/* Reorder handle badge */}
                  {isReorderable && (
                    <div
                      className="admin-photo-card-handle"
                      title="Tarik untuk geser urutan"
                      style={{
                        position: 'absolute',
                        top: 6,
                        left: 6,
                        background: 'rgba(15, 15, 20, 0.75)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: 4,
                        fontSize: 12,
                        padding: '2px 6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span>⠿</span>
                      <span style={{ fontSize: 11, opacity: 0.8 }}>#{index + 1}</span>
                    </div>
                  )}

                  {/* Move up / down buttons */}
                  {isReorderable && (
                    <div style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      display: 'flex',
                      gap: 3,
                    }}>
                      {index > 0 && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          style={{ padding: '2px 6px', height: 22, fontSize: 10, background: 'rgba(15,15,20,0.85)' }}
                          onClick={(e) => { e.stopPropagation(); handleMoveStep(index, -1); }}
                          title="Geser ke atas"
                        >
                          ⬆
                        </button>
                      )}
                      {index < photos.length - 1 && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          style={{ padding: '2px 6px', height: 22, fontSize: 10, background: 'rgba(15,15,20,0.85)' }}
                          onClick={(e) => { e.stopPropagation(); handleMoveStep(index, 1); }}
                          title="Geser ke bawah"
                        >
                          ⬇
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="admin-photo-card-body">
                  <div className="admin-photo-card-title">{photo.title}</div>
                  <div className="admin-photo-card-meta">
                    {photo.categoryLabel} · {photo.year}
                    {photo.client && <> · {photo.client}</>}
                  </div>
                  <div className="admin-photo-card-actions">
                    <button
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleEdit(photo)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => setConfirmId(photo.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Photo Modal */}
      {showModal && (
        <PhotoModal
          photo={modalPhoto}
          categories={categories}
          token={token}
          onToast={onToast}
          onClose={() => setShowModal(false)}
          onSave={handleSavePhoto}
        />
      )}

      {/* Confirm Delete */}
      {confirmId && (
        <ConfirmDialog
          title="Delete Photo?"
          text={`This will permanently remove "${photos.find(p => p.id === confirmId)?.title}" from your portfolio.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
