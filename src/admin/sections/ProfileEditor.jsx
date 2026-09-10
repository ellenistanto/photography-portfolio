import React, { useState, useEffect, useRef } from 'react';
import { API_BASE } from '../../config/api';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920&q=80';

export default function ProfileEditor({ data, token, onSaved, onToast }) {
  const [form, setForm] = useState({
    name: '', tagline: '', shortBio: '',
    aboutLong: ['', ''],
    location: '', email: '', whatsapp: '', instagram: '', youtube: '', behance: '',
    photo: '', avatar: '', heroImage: '',
  });
  const [saving, setSaving] = useState(false);

  // Profile photo states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoInputMode, setPhotoInputMode] = useState('upload'); // 'upload' | 'url'
  const [previewError, setPreviewError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Hero overlay photo states
  const [heroInputMode, setHeroInputMode] = useState('upload'); // 'upload' | 'url'
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadProgress, setHeroUploadProgress] = useState(0);
  const [heroPreviewError, setHeroPreviewError] = useState(false);
  const [heroIsDragging, setHeroIsDragging] = useState(false);
  const heroFileInputRef = useRef(null);

  useEffect(() => {
    if (data?.profile) {
      setForm({
        ...data.profile,
        aboutLong: data.profile.aboutLong?.length >= 2
          ? data.profile.aboutLong
          : [...(data.profile.aboutLong || []), ''],
        photo: data.profile.photo || data.profile.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
        avatar: data.profile.avatar || data.profile.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85",
        heroImage: data.profile.heroImage || DEFAULT_HERO_IMAGE,
      });
    }
  }, [data]);

  const handleChange = (field, value) => {
    let finalVal = value;
    // Auto convert Google Drive links to direct viewable links
    if ((field === 'photo' || field === 'avatar' || field === 'heroImage') && typeof value === 'string') {
      const driveMatch = value.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || value.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1] && (value.includes('drive.google.com') || value.includes('docs.google.com'))) {
        finalVal = `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
      }
    }

    setForm(prev => {
      const updated = { ...prev, [field]: finalVal };
      if (field === 'photo') updated.avatar = finalVal;
      if (field === 'avatar') updated.photo = finalVal;
      return updated;
    });
  };

  const handleAboutChange = (index, value) => {
    setForm(prev => {
      const updated = [...(prev.aboutLong || [])];
      updated[index] = value;
      return { ...prev, aboutLong: updated };
    });
  };

  // Upload handler for File object
  const processUpload = async (file, targetField = 'photo') => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onToast('Hanya file gambar yang diperbolehkan (JPG, PNG, WEBP, GIF, AVIF)', 'error');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      onToast('Ukuran file maksimal 20MB', 'error');
      return;
    }

    const isHero = targetField === 'heroImage';
    if (isHero) {
      setHeroUploading(true);
      setHeroUploadProgress(25);
      setHeroPreviewError(false);
    } else {
      setUploading(true);
      setUploadProgress(25);
      setPreviewError(false);
    }

    const formData = new FormData();
    formData.append('file', file);
    const progressTimer = setTimeout(() => {
      if (isHero) setHeroUploadProgress(70);
      else setUploadProgress(70);
    }, 200);

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      clearTimeout(progressTimer);
      if (isHero) setHeroUploadProgress(100);
      else setUploadProgress(100);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }

      const result = await res.json();
      handleChange(targetField, result.url);
      onToast(isHero ? '✅ Foto overlay hero berhasil diunggah!' : '✅ Foto profil berhasil diunggah!', 'success');
    } catch (err) {
      onToast(`❌ ${err.message}`, 'error');
    } finally {
      if (isHero) {
        setHeroUploading(false);
        setHeroUploadProgress(0);
      } else {
        setUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/profile`, {
        method: 'PUT',
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

      onToast('✅ Profile saved successfully!', 'success');
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
        <h2 className="admin-section-title">👤 Profile</h2>
        <p className="admin-section-desc">Update your name, bio, profile photo, and contact information shown on the portfolio.</p>
      </div>

      {/* Identity */}
      <div className="admin-card">
        <h3 className="admin-card-title">🪪 Identity</h3>
        <div className="admin-form-row" style={{ marginBottom: 16 }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Full Name</label>
            <input
              id="profile-name"
              className="admin-form-input"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Ellen Istanto"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Location</label>
            <input
              id="profile-location"
              className="admin-form-input"
              value={form.location}
              onChange={e => handleChange('location', e.target.value)}
              placeholder="Yogyakarta, Indonesia"
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Tagline (Hero Section)</label>
          <input
            id="profile-tagline"
            className="admin-form-input"
            value={form.tagline}
            onChange={e => handleChange('tagline', e.target.value)}
            placeholder="Concerts, Portraits, Travel..."
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Short Bio (shown below tagline)</label>
          <textarea
            id="profile-short-bio"
            className="admin-form-textarea"
            value={form.shortBio}
            onChange={e => handleChange('shortBio', e.target.value)}
            rows={3}
            placeholder="I'm a photographer based in..."
          />
        </div>
      </div>

      {/* Hero Background & Overlay Photo */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
          <div>
            <h3 className="admin-card-title">🌄 Hero Background & Overlay Photo (Halaman Utama)</h3>
            <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginBottom: 0 }}>
              Foto latar belakang atmosferik di bagian teratas website dengan dark gradient overlay.
            </p>
          </div>
          {form.heroImage && form.heroImage !== DEFAULT_HERO_IMAGE && (
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              style={{ fontSize: '0.78rem', padding: '5px 10px' }}
              onClick={() => {
                handleChange('heroImage', DEFAULT_HERO_IMAGE);
                onToast('Foto hero direset ke default', 'info');
              }}
            >
              ↺ Reset Default
            </button>
          )}
        </div>

        {/* Mode Selector Tabs */}
        <div className="admin-tabs-segmented" style={{ marginBottom: 14 }}>
          <button
            type="button"
            className={`admin-tab-seg-btn ${heroInputMode === 'upload' ? 'active' : ''}`}
            onClick={() => setHeroInputMode('upload')}
          >
            📤 Upload File (Drag & Drop)
          </button>
          <button
            type="button"
            className={`admin-tab-seg-btn ${heroInputMode === 'url' ? 'active' : ''}`}
            onClick={() => setHeroInputMode('url')}
          >
            🔗 External Image URL / Google Drive
          </button>
        </div>

        {/* Upload Mode Area */}
        {heroInputMode === 'upload' && (
          <div style={{ marginBottom: 16 }}>
            <input
              type="file"
              ref={heroFileInputRef}
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processUpload(e.target.files[0], 'heroImage');
                }
              }}
            />

            {form.heroImage ? (
              <div className="admin-dropzone-preview" style={{ maxHeight: 260, maxWidth: '100%' }}>
                <img
                  src={form.heroImage}
                  alt="Hero Overlay Preview"
                  onError={() => setHeroPreviewError(true)}
                  style={{ maxHeight: 260, width: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
                />
                <div className="admin-dropzone-preview-overlay">
                  <button
                    type="button"
                    className="admin-dropzone-remove-btn"
                    onClick={() => heroFileInputRef.current?.click()}
                  >
                    🔄 Ganti Foto
                  </button>
                  <button
                    type="button"
                    className="admin-dropzone-remove-btn"
                    onClick={() => handleChange('heroImage', '')}
                  >
                    ✕ Hapus
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`admin-dropzone ${heroIsDragging ? 'drag-active' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setHeroIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setHeroIsDragging(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setHeroIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    processUpload(e.dataTransfer.files[0], 'heroImage');
                  }
                }}
                onClick={() => heroFileInputRef.current?.click()}
              >
                {heroUploading ? (
                  <>
                    <div className="admin-spinner" style={{ width: 32, height: 32 }} />
                    <div className="admin-dropzone-text">Mengunggah foto hero… ({heroUploadProgress}%)</div>
                    <div className="admin-upload-progress">
                      <div className="admin-upload-progress-bar" style={{ width: `${heroUploadProgress}%` }} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="admin-dropzone-icon">🌄</div>
                    <div className="admin-dropzone-text">
                      <strong>Tarik & lepas foto hero background</strong> ke sini, atau klik untuk browse
                    </div>
                    <div className="admin-dropzone-subtext">
                      Disarankan rasio landscape / lebar (16:9 atau min. 1920px lebar). Maks. 20MB.
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* URL Mode Area */}
        {heroInputMode === 'url' && (
          <div style={{ marginBottom: 16 }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Hero Background Image URL</label>
              <input
                id="profile-hero-image-url"
                className="admin-form-input"
                value={form.heroImage || ''}
                onChange={(e) => {
                  handleChange('heroImage', e.target.value);
                  setHeroPreviewError(false);
                }}
                placeholder="https://... atau link Google Drive"
              />
              <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted, #888)', marginTop: 6, lineHeight: 1.4 }}>
                💡 <strong>Tips:</strong> Bisa paste link Google Drive biasa (otomatis dikonversi), ImgBB, Unsplash, dsb.
              </p>
            </div>

            {form.heroImage && (
              <div className="admin-dropzone-preview" style={{ maxHeight: 260, maxWidth: '100%' }}>
                <img
                  src={form.heroImage}
                  alt="Hero Preview"
                  onError={() => setHeroPreviewError(true)}
                  style={{ maxHeight: 260, width: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
                />
              </div>
            )}

            {heroPreviewError && form.heroImage && (
              <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 6, color: '#fca5a5', fontSize: '0.8rem', marginTop: 8 }}>
                ⚠️ Gambar gagal dimuat. Jika menggunakan Google Drive, pastikan izin file diset ke <strong>&quot;Siapa saja yang memiliki link&quot; (Public)</strong>.
              </div>
            )}
          </div>
        )}

        {/* Live Overlay Simulation Preview */}
        {form.heroImage && !heroPreviewError && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              👁️ Simulasi Tampilan Hero Overlay di Halaman Utama:
            </div>
            <div style={{
              position: 'relative',
              width: '100%',
              height: 140,
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid var(--admin-border, rgba(255,255,255,0.1))',
              background: '#0a0a0a',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url('${form.heroImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 30%',
                filter: 'brightness(0.35) contrast(1.1)',
              }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.85) 100%), linear-gradient(to bottom, rgba(10, 10, 10, 0.2) 0%, rgba(10, 10, 10, 0.95) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 16px',
              }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 2, color: 'var(--admin-accent, #c9a96e)', marginBottom: 2 }}>
                  Atmosphere & Stillness
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
                  {form.name || 'Ellen Istanto'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {form.tagline || 'Concerts, Portraits, Travel...'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* About the Artist Photo */}
      <div className="admin-card">
        <h3 className="admin-card-title">📸 About the Artist Photo</h3>
        <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginBottom: 14 }}>
          Foto potret Anda yang tampil di bagian <strong>About the Artist / The Journey</strong> pada halaman utama portfolio.
        </p>

        {/* Mode Selector Tabs */}
        <div className="admin-tabs-segmented" style={{ marginBottom: 14 }}>
          <button
            type="button"
            className={`admin-tab-seg-btn ${photoInputMode === 'upload' ? 'active' : ''}`}
            onClick={() => setPhotoInputMode('upload')}
          >
            📤 Upload File (Drag & Drop)
          </button>
          <button
            type="button"
            className={`admin-tab-seg-btn ${photoInputMode === 'url' ? 'active' : ''}`}
            onClick={() => setPhotoInputMode('url')}
          >
            🔗 External Image URL / Google Drive
          </button>
        </div>

        {/* Upload Mode Area */}
        {photoInputMode === 'upload' && (
          <div style={{ marginBottom: 16 }}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processUpload(e.target.files[0]);
                }
              }}
            />

            {form.photo ? (
              <div className="admin-dropzone-preview" style={{ maxHeight: 260, maxWidth: 380 }}>
                <img
                  src={form.photo}
                  alt="Profile Preview"
                  onError={() => setPreviewError(true)}
                  style={{ maxHeight: 260, objectFit: 'cover' }}
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
                    onClick={() => handleChange('photo', '')}
                  >
                    ✕ Hapus
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`admin-dropzone ${isDragging ? 'drag-active' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    processUpload(e.dataTransfer.files[0]);
                  }
                }}
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
                    <div className="admin-dropzone-icon">📷</div>
                    <div className="admin-dropzone-text">
                      <strong>Tarik & lepas foto profil</strong> ke sini, atau klik untuk browse
                    </div>
                    <div className="admin-dropzone-subtext">
                      Mendukung JPG, PNG, WEBP, GIF, AVIF (Maks. 20MB)
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* URL Mode Area */}
        {photoInputMode === 'url' && (
          <div style={{ marginBottom: 16 }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Profile Photo URL</label>
              <input
                id="profile-photo-url"
                className="admin-form-input"
                value={form.photo || ''}
                onChange={(e) => {
                  handleChange('photo', e.target.value);
                  setPreviewError(false);
                }}
                placeholder="https://... atau link Google Drive"
              />
              <p style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted, #888)', marginTop: 6, lineHeight: 1.4 }}>
                💡 <strong>Tips:</strong> Bisa paste link Google Drive biasa (otomatis dikonversi), ImgBB, Unsplash, dsb.
              </p>
            </div>

            {form.photo && (
              <div className="admin-dropzone-preview" style={{ maxHeight: 260, maxWidth: 380 }}>
                <img
                  src={form.photo}
                  alt="Profile Preview"
                  onError={() => setPreviewError(true)}
                  style={{ maxHeight: 260, objectFit: 'cover' }}
                />
              </div>
            )}

            {previewError && form.photo && (
              <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 6, color: '#fca5a5', fontSize: '0.8rem', marginTop: 8 }}>
                ⚠️ Gambar gagal dimuat. Jika menggunakan Google Drive, pastikan izin file diset ke <strong>&quot;Siapa saja yang memiliki link&quot; (Public)</strong>.
              </div>
            )}
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="admin-card">
        <h3 className="admin-card-title">📖 About Section (Long Bio)</h3>
        <p style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginBottom: 14 }}>
          Two paragraphs shown in the About/Connect section of the portfolio.
        </p>

        <div className="admin-form-group">
          <label className="admin-form-label">Paragraph 1</label>
          <textarea
            id="profile-about-1"
            className="admin-form-textarea"
            value={form.aboutLong?.[0] || ''}
            onChange={e => handleAboutChange(0, e.target.value)}
            rows={4}
            placeholder="First paragraph of your about story..."
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Paragraph 2</label>
          <textarea
            id="profile-about-2"
            className="admin-form-textarea"
            value={form.aboutLong?.[1] || ''}
            onChange={e => handleAboutChange(1, e.target.value)}
            rows={4}
            placeholder="Second paragraph..."
          />
        </div>
      </div>

      {/* Contact */}
      <div className="admin-card">
        <h3 className="admin-card-title">📬 Contact & Social Links</h3>
        <div className="admin-form-row" style={{ marginBottom: 16 }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Email</label>
            <input
              id="profile-email"
              className="admin-form-input"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="you@email.com"
              type="email"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">WhatsApp (with country code, no +)</label>
            <input
              id="profile-whatsapp"
              className="admin-form-input"
              value={form.whatsapp}
              onChange={e => handleChange('whatsapp', e.target.value)}
              placeholder="6289xxxxxxxx"
            />
          </div>
        </div>

        <div className="admin-form-row" style={{ marginBottom: 16 }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Instagram URL</label>
            <input
              id="profile-instagram"
              className="admin-form-input"
              value={form.instagram}
              onChange={e => handleChange('instagram', e.target.value)}
              placeholder="https://instagram.com/username"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">YouTube URL</label>
            <input
              id="profile-youtube"
              className="admin-form-input"
              value={form.youtube}
              onChange={e => handleChange('youtube', e.target.value)}
              placeholder="https://youtube.com/@channel"
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Behance URL</label>
          <input
            id="profile-behance"
            className="admin-form-input"
            value={form.behance}
            onChange={e => handleChange('behance', e.target.value)}
            placeholder="https://behance.net/username"
          />
        </div>
      </div>

      <div className="admin-save-bar">
        <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>Changes are saved to the database</span>
        <button
          id="profile-save-btn"
          className="admin-btn admin-btn-accent"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <><span className="admin-spinner" style={{ width: 14, height: 14 }} /> Saving…</> : '💾 Save Profile'}
        </button>
      </div>
    </div>
  );
}
