import React, { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE } from '../../config/api';
import { parseVideoSource } from '../../utils/videoUtils';

function ConfirmDialog({ title, text, onConfirm, onCancel }) {
  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal admin-confirm-dialog" onClick={e => e.stopPropagation()}>
        <div className="admin-confirm-title">{title}</div>
        <div className="admin-confirm-text">{text}</div>
        <div className="admin-confirm-actions">
          <button className="admin-btn admin-btn-ghost" onClick={onCancel}>Cancel</button>
          <button id="confirm-delete-video-btn" className="admin-btn admin-btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'All Videos' },
  { id: 'music-video', name: 'Music & Concert' },
  { id: 'commercial', name: 'Commercial & Brand' },
  { id: 'documentary', name: 'Documentary & Narrative' },
  { id: 'reels', name: 'Vertical & Social' },
];

function VideoModal({ video, token, onClose, onSave, onToast }) {
  const [form, setForm] = useState(() => ({
    title: '',
    category: 'music-video',
    categoryLabel: 'Music & Concert',
    client: '',
    videoUrl: '',
    videoType: 'youtube',
    aspect: 'landscape',
    coverImage: '',
    previewVideoUrl: '',
    description: '',
    isFeatured: false,
  }));

  const [coverInputMode, setCoverInputMode] = useState('auto'); // 'auto' | 'upload' | 'url'
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (video) {
      setForm({
        ...video,
        aspect: video.aspect || 'landscape',
        category: video.category || 'music-video',
        categoryLabel: video.categoryLabel || 'Music & Concert',
      });
      if (video.coverImage) {
        if (video.coverImage.includes('youtube.com') || video.coverImage.includes('googleusercontent.com')) {
          setCoverInputMode('auto');
        } else if (video.coverImage.startsWith('http') && !video.coverImage.includes('/uploads/')) {
          setCoverInputMode('url');
        } else {
          setCoverInputMode('upload');
        }
      }
    }
  }, [video]);

  const parsedVideo = parseVideoSource(form.videoUrl);

  const handleChange = (field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };

      if (field === 'videoUrl') {
        const parsed = parseVideoSource(value);
        updated.videoType = parsed.type;
        // If auto mode or no custom thumbnail yet, auto-populate YouTube/Drive thumbnail
        if (parsed.defaultThumbnail && (!prev.coverImage || coverInputMode === 'auto')) {
          updated.coverImage = parsed.defaultThumbnail;
        }
      }

      if (field === 'category') {
        const found = DEFAULT_CATEGORIES.find(c => c.id === value);
        if (found) updated.categoryLabel = found.name;
      }

      return updated;
    });
  };

  // Upload handler for custom cover file
  const processUpload = useCallback(async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onToast?.('Hanya file gambar yang diperbolehkan untuk cover (JPG, PNG, WEBP, GIF, AVIF)', 'error');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      onToast?.('Ukuran file maksimal 20MB', 'error');
      return;
    }

    setUploading(true);
    setUploadProgress(25);

    try {
      const formData = new FormData();
      formData.append('image', file);

      setUploadProgress(55);

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      setUploadProgress(90);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Gagal mengunggah thumbnail');
      }

      const data = await res.json();
      const uploadedUrl = data.url;

      setForm(prev => ({
        ...prev,
        coverImage: uploadedUrl,
      }));

      onToast?.('Cover thumbnail berhasil diunggah!', 'success');
    } catch (err) {
      onToast?.(err.message, 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [token, onToast]);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.videoUrl.trim()) {
      onToast?.('Harap lengkapi judul video dan URL video', 'error');
      return;
    }

    setSaving(true);
    try {
      const parsed = parseVideoSource(form.videoUrl);
      const { year: _year, ...restForm } = form;
      const cleanForm = {
        ...restForm,
        title: form.title.trim(),
        videoUrl: form.videoUrl.trim(),
        videoType: parsed.type,
        coverImage: form.coverImage || parsed.defaultThumbnail || '',
      };
      await onSave(cleanForm);
    } finally {
      setSaving(false);
    }
  };

  const getProviderBadge = (type) => {
    switch (type) {
      case 'youtube': return { label: 'YouTube', color: '#ff0000' };
      case 'vimeo': return { label: 'Vimeo', color: '#1ab7ea' };
      case 'drive': return { label: 'Google Drive', color: '#0f9d58' };
      default: return { label: 'Direct Video (MP4)', color: '#8b5cf6' };
    }
  };

  const providerBadge = getProviderBadge(parsedVideo.type);

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">{video?.id ? 'Edit Video' : 'Add New Video'}</h3>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Video URL Input */}
        <div className="admin-form-group" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label className="admin-form-label" style={{ marginBottom: 0 }}>
              Video URL <span style={{ color: 'var(--admin-danger)' }}>*</span>
            </label>
            {form.videoUrl.trim() && (
              <span style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: providerBadge.color,
                fontWeight: 600,
                border: `1px solid ${providerBadge.color}40`,
              }}>
                {providerBadge.label}
              </span>
            )}
          </div>
          <input
            id="video-url-input"
            className="admin-form-input"
            value={form.videoUrl}
            onChange={e => handleChange('videoUrl', e.target.value)}
            placeholder="e.g. https://www.youtube.com/watch?v=... atau https://vimeo.com/... atau file .mp4"
            required
          />
          <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 4 }}>
            Mendukung link YouTube, YouTube Shorts, Vimeo, Google Drive, atau link video MP4/WebM.
          </div>
        </div>

        {/* Live Preview Box */}
        {form.videoUrl.trim() && (
          <div style={{
            background: 'var(--admin-bg-secondary)',
            border: '1px solid var(--admin-border)',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: 8 }}>
              Video Preview
            </div>
            <div style={{
              position: 'relative',
              paddingTop: form.aspect === 'portrait' ? '125%' : form.aspect === 'square' ? '100%' : '56.25%',
              borderRadius: 6,
              overflow: 'hidden',
              background: '#000',
            }}>
              {parsedVideo.isEmbeddable ? (
                <iframe
                  src={parsedVideo.embedUrl}
                  title="Video preview"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={form.videoUrl}
                  controls
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Title */}
        <div className="admin-form-group" style={{ marginBottom: 14 }}>
          <label className="admin-form-label">
            Video Title <span style={{ color: 'var(--admin-danger)' }}>*</span>
          </label>
          <input
            id="video-title-input"
            className="admin-form-input"
            value={form.title}
            onChange={e => handleChange('title', e.target.value)}
            placeholder="e.g. Hindia — Menari Dengan Bayangan (Live Visuals)"
            required
          />
        </div>

        {/* Category & Aspect Ratio Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 14 }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Category</label>
            <select
              id="video-category-select"
              className="admin-form-select"
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
            >
              {DEFAULT_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Aspect Ratio</label>
            <select
              id="video-aspect-select"
              className="admin-form-select"
              value={form.aspect}
              onChange={e => handleChange('aspect', e.target.value)}
            >
              <option value="landscape">Landscape (16:9 Cinema / Stage)</option>
              <option value="portrait">Portrait (9:16 Vertical Reel / Shorts)</option>
              <option value="square">Square (1:1 Feed)</option>
            </select>
          </div>
        </div>

        {/* Client */}
        <div className="admin-form-group" style={{ marginBottom: 14 }}>
          <label className="admin-form-label">Client / Artist / Label</label>
          <input
            id="video-client-input"
            className="admin-form-input"
            value={form.client}
            onChange={e => handleChange('client', e.target.value)}
            placeholder="e.g. Hindia / Sun Eaters / Uniqlo"
          />
        </div>

        {/* Cover Thumbnail Section */}
        <div className="admin-form-group" style={{ marginBottom: 14 }}>
          <label className="admin-form-label">Cover Poster / Thumbnail</label>
          
          <div className="admin-tabs-segmented" style={{ marginBottom: 10 }}>
            <button
              type="button"
              className={`admin-tab-seg-btn ${coverInputMode === 'auto' ? 'active' : ''}`}
              onClick={() => {
                setCoverInputMode('auto');
                if (parsedVideo.defaultThumbnail) {
                  handleChange('coverImage', parsedVideo.defaultThumbnail);
                }
              }}
            >
              Auto ({parsedVideo.type === 'youtube' ? 'YouTube HD' : 'Provider'})
            </button>
            <button
              type="button"
              className={`admin-tab-seg-btn ${coverInputMode === 'upload' ? 'active' : ''}`}
              onClick={() => setCoverInputMode('upload')}
            >
              Upload Custom Image
            </button>
            <button
              type="button"
              className={`admin-tab-seg-btn ${coverInputMode === 'url' ? 'active' : ''}`}
              onClick={() => setCoverInputMode('url')}
            >
              Image URL
            </button>
          </div>

          {coverInputMode === 'upload' && (
            <div
              className={`admin-upload-zone admin-upload-zone-compact ${isDragging ? 'is-drag-over' : ''} ${uploading ? 'is-uploading' : ''}`}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
              onDrop={e => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) processUpload(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer', textAlign: 'center', padding: '16px' }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  if (e.target.files?.[0]) processUpload(e.target.files[0]);
                }}
              />
              <div style={{ fontSize: 13, color: 'var(--admin-text-primary)' }}>
                {uploading ? `Uploading… ${uploadProgress}%` : 'Tarik & lepas cover di sini atau klik untuk memilih file'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 4 }}>
                Maksimal 20MB (JPG, PNG, WEBP)
              </div>
            </div>
          )}

          {coverInputMode === 'url' && (
            <input
              className="admin-form-input"
              value={form.coverImage}
              onChange={e => handleChange('coverImage', e.target.value)}
              placeholder="https://..."
            />
          )}

          {/* Current Cover Preview */}
          {form.coverImage && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, padding: 8, background: 'var(--admin-bg-secondary)', borderRadius: 6 }}>
              <img
                src={form.coverImage}
                alt="Cover Preview"
                style={{ width: 80, height: 48, objectFit: 'cover', borderRadius: 4 }}
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--admin-text-primary)' }}>Cover Thumbnail Terpasang</div>
                <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {form.coverImage}
                </div>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => handleChange('coverImage', '')}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Optional Teaser/Hover Preview MP4 URL */}
        <div className="admin-form-group" style={{ marginBottom: 14 }}>
          <label className="admin-form-label">
            Short Hover Teaser Video URL <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--admin-text-muted)' }}>(Optional preview clip)</span>
          </label>
          <input
            className="admin-form-input"
            value={form.previewVideoUrl}
            onChange={e => handleChange('previewVideoUrl', e.target.value)}
            placeholder="e.g. https://.../short-teaser.mp4 (Otomatis diputar halus saat kursor diarahkan ke kartu)"
          />
        </div>

        {/* Description */}
        <div className="admin-form-group" style={{ marginBottom: 16 }}>
          <label className="admin-form-label">Description / Synopsis (optional)</label>
          <textarea
            className="admin-form-textarea"
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={2}
            placeholder="Cerita singkat atau catatan kreatif di balik video ini..."
          />
        </div>

        {/* Save Bar */}
        <div className="admin-save-bar">
          <button className="admin-btn admin-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            id="video-save-btn"
            className="admin-btn admin-btn-accent"
            onClick={handleSubmit}
            disabled={saving || uploading || !form.title.trim() || !form.videoUrl.trim()}
          >
            {saving ? (
              <><span className="admin-spinner" style={{ width: 14, height: 14 }} /> Saving…</>
            ) : (
              'Save Video'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VideosEditor({ data, token, onSaved, onToast }) {
  const [videos, setVideos] = useState([]);
  const [filterCat, setFilterCat] = useState('all');
  const [modalVideo, setModalVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Drag & drop state
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [_reordering, setReordering] = useState(false);

  useEffect(() => {
    if (data?.videos) {
      setVideos([...data.videos].sort((a, b) => (a.order || 0) - (b.order || 0)));
    }
  }, [data]);

  const isReorderable = filterCat === 'all' && !searchTerm;

  const displayed = videos.filter(v => {
    const matchCat = filterCat === 'all' || v.category === filterCat;
    const matchSearch = !searchTerm ||
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.client?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = () => {
    setModalVideo(null);
    setShowModal(true);
  };

  const handleEdit = (video) => {
    setModalVideo(video);
    setShowModal(true);
  };

  const handleSaveVideo = async (form) => {
    try {
      const isEdit = !!form.id;
      const url = isEdit
        ? `${API_BASE}/api/portfolio/videos/${form.id}`
        : `${API_BASE}/api/portfolio/videos`;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Gagal menyimpan video');
      }

      onToast(isEdit ? 'Video berhasil diperbarui!' : 'Video berhasil ditambahkan!', 'success');
      setShowModal(false);
      onSaved();
    } catch (err) {
      onToast(err.message, 'error');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/videos/${confirmId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Gagal menghapus video');

      onToast('Video berhasil dihapus', 'success');
      setConfirmId(null);
      onSaved();
    } catch (err) {
      onToast(err.message, 'error');
      setConfirmId(null);
    }
  };

  // Drag & drop reorder handlers
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

    const reordered = [...videos];
    const [movedItem] = reordered.splice(draggedIdx, 1);
    reordered.splice(dropIndex, 0, movedItem);

    const updated = reordered.map((item, idx) => ({ ...item, order: idx }));
    setVideos(updated);
    setDraggedIdx(null);
    setDragOverIdx(null);

    try {
      setReordering(true);
      const res = await fetch(`${API_BASE}/api/portfolio/videos/reorder/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: updated.map(v => v.id) }),
      });

      if (!res.ok) throw new Error('Gagal menyimpan urutan');
      onToast('Urutan video berhasil disimpan!', 'success');
      onSaved();
    } catch (err) {
      onToast(`Gagal menyimpan urutan: ${err.message}`, 'error');
    } finally {
      setReordering(false);
    }
  };

  const handleMoveStep = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= videos.length) return;

    const reordered = [...videos];
    const [movedItem] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, movedItem);

    const updated = reordered.map((item, idx) => ({ ...item, order: idx }));
    setVideos(updated);

    try {
      const res = await fetch(`${API_BASE}/api/portfolio/videos/reorder/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: updated.map(v => v.id) }),
      });
      if (!res.ok) throw new Error('Gagal menyimpan urutan');
      onToast('Urutan video diperbarui!', 'success');
      onSaved();
    } catch (err) {
      onToast(err.message, 'error');
    }
  };

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Motion & Video Portfolio</h2>
        <p className="admin-section-desc">
          Kelola portofolio karya video dan visual bergerak kamu. Masukkan link YouTube, Vimeo, Google Drive, atau MP4 langsung beserta cover thumbnail.
        </p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          id="videos-search"
          className="admin-form-input"
          style={{ maxWidth: 220, marginBottom: 0 }}
          placeholder="Cari video…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          id="videos-filter-cat"
          className="admin-form-select"
          style={{ maxWidth: 190, marginBottom: 0 }}
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
        >
          {DEFAULT_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <span style={{ color: 'var(--admin-text-muted)', fontSize: 13 }}>
          {displayed.length} of {videos.length} videos
        </span>

        <button
          id="add-video-btn"
          className="admin-btn admin-btn-accent"
          style={{ marginLeft: 'auto' }}
          onClick={handleAdd}
        >
          + Add Video
        </button>
      </div>

      {/* Reorder Tip Banner */}
      {isReorderable && videos.length > 1 && (
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
          <span>
            <strong>Drag & Drop Aktif:</strong> Tarik kartu video atau gunakan tombol Up/Down untuk mengatur urutan tayang di website.
          </span>
        </div>
      )}

      {/* Video Cards Grid */}
      {displayed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--admin-text-muted)' }}>
          <p>{searchTerm || filterCat !== 'all' ? 'Tidak ada video yang sesuai dengan filter.' : 'Belum ada video. Tambahkan portofolio video pertama kamu!'}</p>
        </div>
      ) : (
        <div className="admin-photo-grid">
          {displayed.map((video, index) => {
            const isDraggingThis = draggedIdx === index;
            const isDragOverThis = dragOverIdx === index;
            const parsed = parseVideoSource(video.videoUrl);
            const thumbSrc = video.coverImage || parsed.defaultThumbnail;

            return (
              <div
                key={video.id}
                className={`admin-photo-card ${isDraggingThis ? 'is-dragging' : ''} ${isDragOverThis ? 'is-drag-over' : ''}`}
                draggable={isReorderable}
                onDragStart={e => handleDragStart(e, index)}
                onDragOver={e => handleCardDragOver(e, index)}
                onDrop={e => handleCardDrop(e, index)}
                onDragEnd={() => { setDraggedIdx(null); setDragOverIdx(null); }}
              >
                <div style={{ position: 'relative' }}>
                  {thumbSrc ? (
                    <img
                      className="admin-photo-card-thumb"
                      src={thumbSrc}
                      alt={video.title}
                      loading="lazy"
                      onError={e => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="67"/>'; }}
                    />
                  ) : (
                    <div style={{
                      height: 120,
                      background: '#1a1a24',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--admin-text-muted)',
                      fontSize: 12,
                    }}>
                      No Cover Image
                    </div>
                  )}

                  {/* Play badge overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    pointerEvents: 'none',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>

                  {/* Order & Type Badges */}
                  <div style={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    display: 'flex',
                    gap: 4,
                  }}>
                    {isReorderable && (
                      <span style={{
                        background: 'rgba(15, 15, 20, 0.85)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: 4,
                        fontSize: 11,
                        padding: '2px 6px',
                        color: 'var(--admin-text-primary)',
                      }}>
                        #{index + 1}
                      </span>
                    )}
                    <span style={{
                      background: 'rgba(15, 15, 20, 0.85)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: 4,
                      fontSize: 10,
                      padding: '2px 6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: 'var(--admin-accent-hover)',
                    }}>
                      {video.videoType || parsed.type}
                    </span>
                  </div>

                  {/* Move Up/Down */}
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
                          onClick={e => { e.stopPropagation(); handleMoveStep(index, -1); }}
                          title="Geser ke atas"
                        >
                          Up
                        </button>
                      )}
                      {index < videos.length - 1 && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          style={{ padding: '2px 6px', height: 22, fontSize: 10, background: 'rgba(15,15,20,0.85)' }}
                          onClick={e => { e.stopPropagation(); handleMoveStep(index, 1); }}
                          title="Geser ke bawah"
                        >
                          Down
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="admin-photo-card-body">
                  <div className="admin-photo-card-title" title={video.title}>
                    {video.title}
                  </div>
                  <div className="admin-photo-card-meta">
                    <span className="admin-photo-card-cat">{video.categoryLabel || video.category}</span>
                    {video.client && <span> • {video.client}</span>}
                  </div>

                  <div className="admin-photo-card-actions" style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => handleEdit(video)}
                      style={{ flex: 1 }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => setConfirmId(video.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Video Modal */}
      {showModal && (
        <VideoModal
          video={modalVideo}
          token={token}
          onClose={() => setShowModal(false)}
          onSave={handleSaveVideo}
          onToast={onToast}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {confirmId && (
        <ConfirmDialog
          title="Delete Video"
          text="Yakin ingin menghapus video ini dari portofolio? Tindakan ini tidak dapat dibatalkan."
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
