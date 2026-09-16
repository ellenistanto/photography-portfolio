import React from 'react';
import { Mail, Instagram, PhoneCall } from 'lucide-react';

export default function ConnectSection({ profile, stats, showStats = true }) {
  return (
    <section className="connect-section" id="connect">
      <div className="container">
        
        {/* About Text */}
        <div className="about-text-content">
          <h2 className="about-headline">Preserving the feeling as much as the sight.</h2>
          
          {profile.aboutLong.map((para, idx) => (
            <p key={idx} className="about-paragraph">{para}</p>
          ))}
        </div>

        {/* Numbers / Stats Grid */}
        {showStats && Array.isArray(stats) && stats.length > 0 && (
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
        )}

        {/* Direct Contact Block */}
        <div className="contact-block">
          <div className="contact-info-col">
            <h3>Let's work together.</h3>
            <p>
              Available for concert touring, artist portraits, commercial editorial, and travel assignments worldwide.
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
        </div>

      </div>
    </section>
  );
}

