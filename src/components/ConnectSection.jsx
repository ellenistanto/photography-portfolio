import React from 'react';
import { Mail, Instagram, PhoneCall } from 'lucide-react';

export default function ConnectSection({ profile = {}, stats = [], showStats = true }) {
  const safeProfile = profile || {};
  const aboutLong = Array.isArray(safeProfile.aboutLong)
    ? safeProfile.aboutLong.filter(p => typeof p === 'string' && p.trim())
    : [];
  const whatsapp = typeof safeProfile.whatsapp === 'string' ? safeProfile.whatsapp.trim() : '';
  const email = typeof safeProfile.email === 'string' ? safeProfile.email.trim() : '';
  const instagram = typeof safeProfile.instagram === 'string' ? safeProfile.instagram.trim() : '';
  const headline = typeof safeProfile.aboutHeadline === 'string' ? safeProfile.aboutHeadline.trim() : '';

  const hasAbout = Boolean(headline) || aboutLong.length > 0;
  const hasStats = Boolean(showStats) && Array.isArray(stats) && stats.length > 0;
  const hasContact = Boolean(whatsapp || email || instagram);

  // Jika seluruh konten Connect/About masih kosong, sembunyikan section
  if (!hasAbout && !hasStats && !hasContact) {
    return null;
  }

  return (
    <section className="connect-section" id="connect">
      <div className="container">
        
        {/* About Text */}
        {hasAbout && (
          <div className="about-text-content">
            {headline && <h2 className="about-headline">{headline}</h2>}
            
            {aboutLong.map((para, idx) => (
              <p key={idx} className="about-paragraph">{para}</p>
            ))}
          </div>
        )}

        {/* Numbers / Stats Grid */}
        {hasStats && (
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
        {hasContact && (
          <div className="contact-block">
            <div className="contact-info-col">
              <h3>Let's work together.</h3>
              <p>
                Available for concert touring, artist portraits, commercial editorial, and travel assignments worldwide.
              </p>

              <div className="quick-contact-list">
                {/* WhatsApp Quick Button */}
                {whatsapp && (
                  <a 
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Halo ${safeProfile.name || ''}, saya tertarik untuk bekerja sama dalam project fotografi.`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="contact-card-btn"
                  >
                    <div className="contact-card-icon whatsapp">
                      <PhoneCall size={20} />
                    </div>
                    <div className="contact-card-text">
                      <span className="contact-card-label">Direct WhatsApp</span>
                      <span className="contact-card-value">+{whatsapp.slice(0,2)} {whatsapp.slice(2,5)}-{whatsapp.slice(5,9)}-{whatsapp.slice(9)}</span>
                    </div>
                  </a>
                )}

                {/* Email Quick Button */}
                {email && (
                  <a href={`mailto:${email}`} className="contact-card-btn">
                    <div className="contact-card-icon">
                      <Mail size={20} />
                    </div>
                    <div className="contact-card-text">
                      <span className="contact-card-label">Email Inquiry</span>
                      <span className="contact-card-value">{email}</span>
                    </div>
                  </a>
                )}

                {/* Instagram Quick Button */}
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="contact-card-btn">
                    <div className="contact-card-icon">
                      <Instagram size={20} />
                    </div>
                    <div className="contact-card-text">
                      <span className="contact-card-label">Follow on Instagram</span>
                      <span className="contact-card-value">@{instagram.split('/').filter(Boolean).pop()}</span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
