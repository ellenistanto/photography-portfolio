import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../config/api';

export default function ProfileEditor({ data, token, onSaved, onToast }) {
  const [form, setForm] = useState({
    name: '', tagline: '', shortBio: '',
    aboutLong: ['', ''],
    location: '', email: '', whatsapp: '', instagram: '', youtube: '', behance: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.profile) {
      setForm({
        ...data.profile,
        aboutLong: data.profile.aboutLong?.length >= 2
          ? data.profile.aboutLong
          : [...(data.profile.aboutLong || []), ''],
      });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAboutChange = (index, value) => {
    setForm(prev => {
      const updated = [...(prev.aboutLong || [])];
      updated[index] = value;
      return { ...prev, aboutLong: updated };
    });
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
        <p className="admin-section-desc">Update your name, bio, and contact information shown on the portfolio.</p>
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
