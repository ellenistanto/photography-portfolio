import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, Edit, Trash2, ExternalLink, MoveUp, MoveDown, 
  Upload, Link as LinkIcon, Image, Camera, Check, AlertCircle, X 
} from 'lucide-react';
import { API_BASE } from '../../config/api';

function ConfirmDialog({ title, text, onConfirm, onCancel }) {
  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal admin-confirm-dialog" onClick={e => e.stopPropagation()}>
        <div className="admin-confirm-icon">🗑️</div>
        <div className="admin-confirm-title">{title}</div>
        <div className="admin-confirm-text">{text}</div>
        <div className="admin-confirm-actions">
          <button className="admin-btn admin-btn-ghost" onClick={onCancel}>Batal</button>
          <button id="confirm-delete-project-btn" className="admin-btn admin-btn-danger" onClick={onConfirm}>Hapus Project</button>
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ project, categories = [], token, onClose, onSave, onToast }) {
  const isEditing = Boolean(project?.id);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'brands',
    categoryLabel: 'Brands & Products',
    client: '',
    year: new Date().getFullYear().toString(),
    location: '',
    coverImage: '',
    summary: '',
    description: '',
    photos: [],
    isFeatured: true,
  });

  const [coverMode, setCoverMode] = useState('upload'); // 'upload' | 'url'
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);

  // New photo inside project form
  const [newPhoto, setNewPhoto] = useState({
    image: '',
    title: '',
    caption: '',
    aspect: 'landscape',
  });
  const [photoInputMode, setPhotoInputMode] = useState('upload');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoProgress, setPhotoProgress] = useState(0);

  const [saving, setSaving] = useState(false);

  const coverFileInputRef = useRef(null);
  const photoFileInputRef = useRef(null);

  // Helper slugify
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  useEffect(() => {
    if (project) {
      setForm({
        ...project,
        photos: project.photos || [],
        isFeatured: project.isFeatured !== undefined ? project.isFeatured : true,
      });
      if (project.coverImage && project.coverImage.startsWith('http') && !project.coverImage.includes('/uploads/')) {
        setCoverMode('url');
      } else {
        setCoverMode('upload');
      }
    }
  }, [project]);

  const handleTitleChange = (val) => {
    setForm(prev => ({
      ...prev,
      title: val,
      slug: isEditing ? prev.slug : generateSlug(val),
    }));
  };

  const handleCategoryChange = (val) => {
    const cat = categories.find(c => c.id === val);
    setForm(prev => ({
      ...prev,
      category: val,
      categoryLabel: cat ? cat.name : val,
    }));
  };

  // Convert Google Drive link to direct display link
  const sanitizeImageUrl = (val) => {
    if (typeof val !== 'string') return val;
    const driveMatch = val.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || val.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1] && (val.includes('drive.google.com') || val.includes('docs.google.com'))) {
      return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
    }
    return val;
  };

  // Upload handler for cover image
  const handleCoverUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onToast?.('Harap pilih file gambar (JPG, PNG, WEBP, AVIF)', 'error');
      return;
    }

    setUploadingCover(true);
    setCoverProgress(30);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      setCoverProgress(90);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload cover gagal');
      }

      const result = await res.json();
      setForm(prev => ({ ...prev, coverImage: result.url }));
      onToast?.('Cover image berhasil diunggah', 'success');
    } catch (err) {
      onToast?.(err.message, 'error');
    } finally {
      setUploadingCover(false);
      setCoverProgress(0);
    }
  };

  // Upload handler for individual project photo
  const handlePhotoUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onToast?.('Harap pilih file gambar', 'error');
      return;
    }

    setUploadingPhoto(true);
    setPhotoProgress(30);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      setPhotoProgress(90);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload foto gagal');
      }

      const result = await res.json();
      
      // Auto detect aspect ratio
      const img = new window.Image();
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        let detected = 'landscape';
        if (ratio < 0.85) detected = 'portrait';
        else if (ratio <= 1.15) detected = 'square';

        setNewPhoto(prev => ({
          ...prev,
          image: result.url,
          aspect: detected,
        }));
      };
      img.src = result.url;

      setNewPhoto(prev => ({ ...prev, image: result.url }));
      onToast?.('Foto berhasil diunggah, siap ditambahkan ke project', 'success');
    } catch (err) {
      onToast?.(err.message, 'error');
    } finally {
      setUploadingPhoto(false);
      setPhotoProgress(0);
    }
  };

  // Add photo to project list
  const handleAddPhotoToProject = () => {
    if (!newPhoto.image) {
      onToast?.('Harap masukkan atau unggah foto terlebih dahulu', 'error');
      return;
    }

    const item = {
      id: `pp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      image: sanitizeImageUrl(newPhoto.image),
      thumb: sanitizeImageUrl(newPhoto.image),
      title: newPhoto.title || '',
      caption: newPhoto.caption || '',
      aspect: newPhoto.aspect || 'landscape',
      order: form.photos.length,
    };

    setForm(prev => ({
      ...prev,
      photos: [...prev.photos, item],
    }));

    // Reset new photo form
    setNewPhoto({
      image: '',
      title: '',
      caption: '',
      aspect: 'landscape',
    });
    onToast?.('Foto ditambahkan ke dalam daftar project', 'success');
  };

  // Remove photo from project
  const handleRemovePhoto = (photoId) => {
    setForm(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== photoId),
    }));
  };

  // Move photo up/down
  const handleMovePhoto = (index, direction) => {
    const newPhotos = [...form.photos];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newPhotos.length) return;

    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[targetIndex];
    newPhotos[targetIndex] = temp;

    setForm(prev => ({ ...prev, photos: newPhotos }));
  };

  // Submit project
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      onToast?.('Judul project wajib diisi', 'error');
      return;
    }
    if (!form.coverImage) {
      onToast?.('Gambar cover project wajib diunggah atau diisi URL-nya', 'error');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        coverImage: sanitizeImageUrl(form.coverImage),
        slug: generateSlug(form.slug || form.title),
      };

      const url = isEditing
        ? `${API_BASE}/api/portfolio/projects/${project.id}`
        : `${API_BASE}/api/portfolio/projects`;

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menyimpan project');
      }

      onToast?.(isEditing ? 'Project berhasil diperbarui!' : 'Project baru berhasil dibuat!', 'success');
      onSave?.();
      onClose();
    } catch (err) {
      onToast?.(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div 
        className="admin-modal" 
        style={{ maxWidth: 840, width: '95%' }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <h3 className="admin-modal-title">
              {isEditing ? `Edit Project: ${project.title}` : 'Buat Project Baru'}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2 }}>
              Satu kesatuan project foto (seperti Dokumentasi Pameran Mobil, Konser Tour, atau Seri Komersial).
            </p>
          </div>
          <button className="admin-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-project-form">
          {/* Row 1: Title & Slug */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Judul Project *</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="Contoh: GIIAS 2024 — Auto Show Documentation"
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">URL Slug *</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="giias-2024-auto-show"
                value={form.slug}
                onChange={e => setForm(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                required
              />
            </div>
          </div>

          {/* Row 2: Category, Client, Year, Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Kategori</label>
              <select
                className="admin-form-input"
                value={form.category}
                onChange={e => handleCategoryChange(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Client / Partner</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="Toyota / GIIAS"
                value={form.client}
                onChange={e => setForm(prev => ({ ...prev, client: e.target.value }))}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Tahun / Tanggal</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="2024"
                value={form.year}
                onChange={e => setForm(prev => ({ ...prev, year: e.target.value }))}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Lokasi</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="ICE BSD City"
                value={form.location}
                onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          {/* Row 3: Cover Image */}
          <div className="admin-form-group" style={{ background: 'var(--admin-surface-2)', padding: 16, borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <label className="admin-form-label" style={{ margin: 0 }}>Cover Image Project *</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  className={`admin-btn admin-btn-xs ${coverMode === 'upload' ? 'admin-btn-accent' : 'admin-btn-ghost'}`}
                  onClick={() => setCoverMode('upload')}
                >
                  <Upload size={12} style={{ marginRight: 4 }} /> Upload File
                </button>
                <button
                  type="button"
                  className={`admin-btn admin-btn-xs ${coverMode === 'url' ? 'admin-btn-accent' : 'admin-btn-ghost'}`}
                  onClick={() => setCoverMode('url')}
                >
                  <LinkIcon size={12} style={{ marginRight: 4 }} /> URL Gambar
                </button>
              </div>
            </div>

            {coverMode === 'upload' ? (
              <div>
                <input
                  type="file"
                  ref={coverFileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handleCoverUpload(e.target.files?.[0])}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  style={{ width: '100%', padding: '14px', borderStyle: 'dashed' }}
                  onClick={() => coverFileInputRef.current?.click()}
                  disabled={uploadingCover}
                >
                  {uploadingCover ? `Mengunggah Cover (${coverProgress}%)…` : 'Pilih File Gambar Cover (JPG, PNG, WEBP)'}
                </button>
              </div>
            ) : (
              <input
                type="url"
                className="admin-form-input"
                placeholder="https://... atau link Google Drive"
                value={form.coverImage}
                onChange={e => setForm(prev => ({ ...prev, coverImage: e.target.value }))}
              />
            )}

            {form.coverImage && (
              <div style={{ marginTop: 10, position: 'relative', width: '100%', maxHeight: 180, overflow: 'hidden', borderRadius: 8 }}>
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  style={{ width: '100%', height: 180, objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-danger admin-btn-xs"
                  style={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={() => setForm(prev => ({ ...prev, coverImage: '' }))}
                >
                  Hapus Cover
                </button>
              </div>
            )}
          </div>

          {/* Row 4: Summary & Narrative Story */}
          <div className="admin-form-group">
            <label className="admin-form-label">Ringkasan Singkat (Summary untuk Card di Beranda)</label>
            <textarea
              className="admin-form-input"
              rows={2}
              placeholder="Ringkasan 1-2 kalimat yang menarik pengunjung..."
              value={form.summary}
              onChange={e => setForm(prev => ({ ...prev, summary: e.target.value }))}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Cerita / Narasi Editorial Project</label>
            <textarea
              className="admin-form-input"
              rows={5}
              placeholder="Ceritakan konsep pemotretan, tantangan pencahayaan, pendekatan visual, atau detail teknis (pisahkan antar paragraf dengan baris baru)..."
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Featured Toggle */}
          <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Tampilkan di Bagian Featured Beranda</div>
              <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Project akan muncul di grid utama portfolio beranda</div>
            </div>
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={e => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
              />
              <span className="admin-slider" />
            </label>
          </div>

          {/* Row 5: PHOTOS IN PROJECT MANAGER */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--admin-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700 }}>Foto-foto dalam Project ({form.photos.length})</h4>
                <p style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                  Kelola galeri foto yang menjadi bagian dari dokumentasi project ini.
                </p>
              </div>
            </div>

            {/* List of current project photos */}
            {form.photos.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
                {form.photos.map((photo, idx) => (
                  <div 
                    key={photo.id || idx}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: 'var(--admin-surface-2)', padding: '10px 14px',
                      borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border)'
                    }}
                  >
                    <img 
                      src={photo.thumb || photo.image} 
                      alt="" 
                      style={{ width: 56, height: 42, objectFit: 'cover', borderRadius: 6, background: '#000' }} 
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {photo.title || `Foto #${idx + 1}`}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {photo.caption || 'Tanpa keterangan'} • Rasio: {photo.aspect || 'landscape'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost admin-btn-xs"
                        disabled={idx === 0}
                        onClick={() => handleMovePhoto(idx, -1)}
                        title="Geser ke atas"
                      >
                        <MoveUp size={12} />
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost admin-btn-xs"
                        disabled={idx === form.photos.length - 1}
                        onClick={() => handleMovePhoto(idx, 1)}
                        title="Geser ke bawah"
                      >
                        <MoveDown size={12} />
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger admin-btn-xs"
                        onClick={() => handleRemovePhoto(photo.id)}
                        title="Hapus foto dari project"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', background: 'var(--admin-surface-2)', borderRadius: 8, color: 'var(--admin-text-muted)', marginBottom: 16 }}>
                Belum ada foto yang ditambahkan ke project ini. Tambahkan foto di bawah ini.
              </div>
            )}

            {/* Form to add a photo to this project */}
            <div style={{ background: 'var(--admin-surface-2)', padding: 16, borderRadius: 'var(--admin-radius-sm)', border: '1px dashed var(--admin-border)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>+ Tambah Foto ke Project</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    className={`admin-btn admin-btn-xs ${photoInputMode === 'upload' ? 'admin-btn-accent' : 'admin-btn-ghost'}`}
                    onClick={() => setPhotoInputMode('upload')}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    className={`admin-btn admin-btn-xs ${photoInputMode === 'url' ? 'admin-btn-accent' : 'admin-btn-ghost'}`}
                    onClick={() => setPhotoInputMode('url')}
                  >
                    Input URL
                  </button>
                </div>
              </div>

              {photoInputMode === 'upload' ? (
                <div>
                  <input
                    type="file"
                    ref={photoFileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => handlePhotoUpload(e.target.files?.[0])}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost"
                    style={{ width: '100%', padding: '10px', marginBottom: 10 }}
                    onClick={() => photoFileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                  >
                    {uploadingPhoto ? `Mengunggah Foto (${photoProgress}%)…` : 'Pilih File Gambar Foto'}
                  </button>
                </div>
              ) : (
                <input
                  type="url"
                  className="admin-form-input"
                  placeholder="URL Gambar Foto..."
                  style={{ marginBottom: 10 }}
                  value={newPhoto.image}
                  onChange={e => setNewPhoto(prev => ({ ...prev, image: e.target.value }))}
                />
              )}

              {newPhoto.image && (
                <div style={{ marginBottom: 10 }}>
                  <img
                    src={newPhoto.image}
                    alt="Preview"
                    style={{ width: '100%', height: 120, objectFit: 'contain', background: '#000', borderRadius: 6 }}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="Judul foto (opsional)..."
                  value={newPhoto.title}
                  onChange={e => setNewPhoto(prev => ({ ...prev, title: e.target.value }))}
                />
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="Keterangan / caption..."
                  value={newPhoto.caption}
                  onChange={e => setNewPhoto(prev => ({ ...prev, caption: e.target.value }))}
                />
                <select
                  className="admin-form-input"
                  value={newPhoto.aspect}
                  onChange={e => setNewPhoto(prev => ({ ...prev, aspect: e.target.value }))}
                >
                  <option value="landscape">Landscape (Horizontal)</option>
                  <option value="portrait">Portrait (Vertikal)</option>
                  <option value="square">Square (1:1)</option>
                </select>
              </div>

              <button
                type="button"
                className="admin-btn admin-btn-accent"
                style={{ marginTop: 12, width: '100%' }}
                onClick={handleAddPhotoToProject}
                disabled={!newPhoto.image}
              >
                + Tambahkan Foto ke Daftar Project
              </button>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="admin-save-bar" style={{ marginTop: 24 }}>
            <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>
              Batal
            </button>
            <button 
              type="submit" 
              className="admin-btn admin-btn-accent"
              disabled={saving}
            >
              {saving ? 'Menyimpan…' : isEditing ? 'Simpan Perubahan Project' : 'Buat Project Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsEditor({ data, token, onSaved, onToast }) {
  const projects = data?.projects || [];
  const categories = data?.categories || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [reordering, setReordering] = useState(false);

  const handleOpenNew = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingProject(proj);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;

    try {
      const res = await fetch(`${API_BASE}/api/portfolio/projects/${deletingProject.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menghapus project');
      }

      onToast?.(`Project "${deletingProject.title}" berhasil dihapus`, 'success');
      setDeletingProject(null);
      onSaved?.();
    } catch (err) {
      onToast?.(err.message, 'error');
    }
  };

  const handleReorder = async (fromIndex, direction) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= projects.length) return;

    setReordering(true);
    const updated = [...projects];
    const item = updated.splice(fromIndex, 1)[0];
    updated.splice(toIndex, 0, item);

    try {
      const res = await fetch(`${API_BASE}/api/portfolio/projects/reorder/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: updated.map(p => p.id) }),
      });

      if (!res.ok) throw new Error('Gagal mengatur urutan');
      onToast?.('Urutan project berhasil diperbarui', 'success');
      onSaved?.();
    } catch (err) {
      onToast?.(err.message, 'error');
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="admin-projects-editor">
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--admin-text)' }}>
            Manajemen Project & Dokumentasi ({projects.length})
          </h2>
          <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: 4 }}>
            Kelola halaman khusus dokumentasi pameran, konser, atau kampanye foto yang berdiri sendiri.
          </p>
        </div>

        <button 
          id="add-new-project-btn" 
          className="admin-btn admin-btn-accent"
          onClick={handleOpenNew}
        >
          <Plus size={16} style={{ marginRight: 6 }} />
          Tambah Project Baru
        </button>
      </div>

      {/* Projects Grid List */}
      {projects.length === 0 ? (
        <div style={{ 
          background: 'var(--admin-surface)', 
          border: '1px dashed var(--admin-border)', 
          borderRadius: 'var(--admin-radius)', 
          padding: '60px 20px', 
          textAlign: 'center' 
        }}>
          <Camera size={36} style={{ color: 'var(--admin-text-dim)', marginBottom: 12 }} />
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Belum Ada Project</h3>
          <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginBottom: 20 }}>
            Buat halaman dokumentasi komprehensif pertama Anda (seperti Dokumentasi Pameran Otomotif).
          </p>
          <button className="admin-btn admin-btn-accent" onClick={handleOpenNew}>
            <Plus size={15} style={{ marginRight: 6 }} /> Buat Project Pertama
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {projects.map((proj, idx) => (
            <div 
              key={proj.id || idx}
              style={{
                background: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)',
                borderRadius: 'var(--admin-radius)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'all 0.2s',
              }}
            >
              {/* Cover Thumbnail */}
              <div style={{ position: 'relative', width: 90, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#000' }}>
                <img 
                  src={proj.coverImage} 
                  alt="" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>

              {/* Info Body */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--admin-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {proj.title}
                  </h4>
                  {proj.isFeatured && (
                    <span className="admin-badge success" style={{ fontSize: 11, padding: '2px 8px' }}>
                      Featured
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'var(--admin-text-muted)' }}>
                  <span>🏷️ {proj.categoryLabel || proj.category}</span>
                  {proj.client && <span>🏢 {proj.client}</span>}
                  {proj.year && <span>📅 {proj.year}</span>}
                  <span>📷 {proj.photos ? proj.photos.length : 0} Frames</span>
                  <span style={{ color: 'var(--admin-accent-hover)' }}>🔗 /project/{proj.slug}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {/* Reorder buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button
                    className="admin-btn admin-btn-ghost admin-btn-xs"
                    disabled={idx === 0 || reordering}
                    onClick={() => handleReorder(idx, -1)}
                    title="Naikkan urutan"
                  >
                    <MoveUp size={11} />
                  </button>
                  <button
                    className="admin-btn admin-btn-ghost admin-btn-xs"
                    disabled={idx === projects.length - 1 || reordering}
                    onClick={() => handleReorder(idx, 1)}
                    title="Turunkan urutan"
                  >
                    <MoveDown size={11} />
                  </button>
                </div>

                {/* Live Preview Button */}
                <a
                  href={`/project/${proj.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  title="Lihat Halaman Live"
                >
                  <ExternalLink size={14} style={{ marginRight: 4 }} />
                  Live
                </a>

                {/* Edit Button */}
                <button
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => handleOpenEdit(proj)}
                  title="Edit Data & Foto Project"
                >
                  <Edit size={14} style={{ marginRight: 4 }} />
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={() => setDeletingProject(proj)}
                  title="Hapus Project"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Edit / Add Project */}
      {modalOpen && (
        <ProjectModal
          project={editingProject}
          categories={categories}
          token={token}
          onClose={() => setModalOpen(false)}
          onSave={onSaved}
          onToast={onToast}
        />
      )}

      {/* Confirm Delete Dialog */}
      {deletingProject && (
        <ConfirmDialog
          title="Hapus Project?"
          text={`Apakah Anda yakin ingin menghapus project "${deletingProject.title}" beserta seluruh foto di dalamnya? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingProject(null)}
        />
      )}
    </div>
  );
}
