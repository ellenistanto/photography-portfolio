import React, { useState } from 'react';
import { Mail, Send, Instagram, PhoneCall } from 'lucide-react';

export default function ConnectSection({ profile, stats, milestones }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: 'concert',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    // Reset form after short delay
    setTimeout(() => {
      setFormState({ name: '', email: '', service: 'concert', message: '' });
    }, 4000);
  };

  return (
    <section className="connect-section" id="connect">
      <div className="container">
        
        {/* About Profile Grid */}
        <div className="about-grid">
          <div className="about-photo-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85" 
              alt={profile.name} 
              className="about-photo" 
              loading="lazy" 
            />
            <div className="about-photo-badge">
              <h4 className="about-badge-name">{profile.name}</h4>
              <p className="about-badge-title">Visual Storyteller & Photographer — {profile.location}</p>
            </div>
          </div>

          <div className="about-text-content">
            <p className="section-eyebrow">About the Artist</p>
            <h2 className="about-headline">Preserving the feeling as much as the sight.</h2>
            
            {profile.aboutLong.map((para, idx) => (
              <p key={idx} className="about-paragraph">{para}</p>
            ))}
          </div>
        </div>

        {/* Numbers / Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-number-wrapper">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-suffix">{stat.suffix}</span>
              </div>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Milestones / Timeline */}
        <div className="timeline-container">
          <div className="section-header">
            <p className="section-eyebrow">The Journey</p>
            <h2 className="section-title">Career Milestones</h2>
            <p className="section-subtitle">
              How a passion for analog grit grew into a decade of stadium stages and editorial campaigns.
            </p>
          </div>

          <div className="timeline-track">
            {milestones.map((m, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-dot"></div>
                <span className="timeline-year">{m.year}</span>
                <h3 className="timeline-title">{m.title}</h3>
                <p className="timeline-desc">{m.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Contact & Form Block */}
        <div className="contact-block">
          <div className="contact-info-col">
            <p className="section-eyebrow">Connect & Collaborate</p>
            <h3>Let’s Create Something Unforgettable.</h3>
            <p>
              Available for live concert touring, artist portraits, commercial editorial lookbooks, and travel assignments worldwide. Reach out directly via WhatsApp or send an email inquiry.
            </p>

            <div className="quick-contact-list">
              {/* WhatsApp Quick Button */}
              {profile.whatsapp && (
                <a 
                  href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(`Halo ${profile.name}, saya tertarik untuk bekerja sama dalam project fotografi.`)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="contact-card-btn"
                >
                  <div className="contact-card-icon whatsapp">
                    <PhoneCall size={20} />
                  </div>
                  <div className="contact-card-text">
                    <span className="contact-card-label">Direct WhatsApp</span>
                    <span className="contact-card-value">+{profile.whatsapp.slice(0,2)} {profile.whatsapp.slice(2,5)}-{profile.whatsapp.slice(5,9)}-{profile.whatsapp.slice(9)}</span>
                  </div>
                </a>
              )}

              {/* Email Quick Button */}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="contact-card-btn">
                  <div className="contact-card-icon">
                    <Mail size={20} />
                  </div>
                  <div className="contact-card-text">
                    <span className="contact-card-label">Email Inquiry</span>
                    <span className="contact-card-value">{profile.email}</span>
                  </div>
                </a>
              )}

              {/* Instagram Quick Button */}
              {profile.instagram && (
                <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="contact-card-btn">
                  <div className="contact-card-icon">
                    <Instagram size={20} />
                  </div>
                  <div className="contact-card-text">
                    <span className="contact-card-label">Follow on Instagram</span>
                    <span className="contact-card-value">@{profile.instagram.split('/').filter(Boolean).pop()}</span>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="contact-form-col">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="formName" className="form-label">Your Name</label>
                <input 
                  type="text" 
                  id="formName" 
                  className="form-input" 
                  placeholder="e.g. Maya Indah" 
                  required
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="formEmail" className="form-label">Email Address</label>
                <input 
                  type="email" 
                  id="formEmail" 
                  className="form-input" 
                  placeholder="e.g. maya@example.com" 
                  required
                  value={formState.email}
                  onChange={e => setFormState({ ...formState, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="formService" className="form-label">Service Required</label>
                <select 
                  id="formService" 
                  className="form-select"
                  value={formState.service}
                  onChange={e => setFormState({ ...formState, service: e.target.value })}
                >
                  <option value="concert">Concert & Live Stage Documentation</option>
                  <option value="portrait">Artist & Personal Portrait Session</option>
                  <option value="commercial">Commercial / Brand Campaign</option>
                  <option value="travel">Travel & Editorial Assignment</option>
                  <option value="other">Other Inquiries</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="formMessage" className="form-label">Message Details</label>
                <textarea 
                  id="formMessage" 
                  className="form-textarea" 
                  placeholder="Tell me about your project, dates, and creative expectations..." 
                  required
                  value={formState.message}
                  onChange={e => setFormState({ ...formState, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="form-submit-btn">
                <span>Send Message</span>
                <Send size={15} />
              </button>

              {formSubmitted && (
                <div className="form-feedback success">
                  <strong>Terima kasih!</strong> Pesan Anda telah terkirim. {profile?.name || 'Kami'} akan segera merespons via email atau WhatsApp.
                </div>
              )}
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
