import React from 'react';

export default function Footer({ profile, onSelectCategory, onScrollToSection }) {
  const currentYear = new Date().getFullYear();
  const displayName = profile?.name?.toLowerCase() || 'portfolio';

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h4>{displayName}</h4>
            <p>Documenting concerts, portraits, travel, and the human pulse across Indonesia and beyond.</p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h5>Navigation</h5>
              <ul>
                <li>
                  <button onClick={() => { onSelectCategory('all'); onScrollToSection('home'); }}>
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => { onSelectCategory('concerts'); onScrollToSection('gallerySection'); }}>
                    Music & Concert
                  </button>
                </li>
                <li>
                  <button onClick={() => { onSelectCategory('portraits'); onScrollToSection('gallerySection'); }}>
                    Portraits
                  </button>
                </li>
                <li>
                  <button onClick={() => { onSelectCategory('people-places'); onScrollToSection('gallerySection'); }}>
                    People & Places
                  </button>
                </li>
                <li>
                  <button onClick={() => { onSelectCategory('brands'); onScrollToSection('gallerySection'); }}>
                    Brands & Products
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Connect</h5>
              <ul>
                {profile?.instagram && (
                  <li>
                    <a href={profile.instagram} target="_blank" rel="noopener noreferrer">
                      Instagram
                    </a>
                  </li>
                )}
                {profile?.whatsapp && (
                  <li>
                    <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  </li>
                )}
                {profile?.email && (
                  <li>
                    <a href={`mailto:${profile.email}`}>
                      Email
                    </a>
                  </li>
                )}
                <li>
                  <button onClick={() => onScrollToSection('connect')}>
                    Contact Form
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} {profile?.name || 'Portfolio'}. All rights reserved.</p>
          <p>Crafted with precision & passion for visual storytelling.</p>
        </div>
      </div>
    </footer>
  );
}
