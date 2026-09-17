import React, { useState, useEffect, useMemo } from 'react';

export default function Navbar({ 
  profile, 
  categories = [], 
  photos = [], 
  currentCategory, 
  onSelectCategory, 
  onScrollToSection 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3 Kategori teratas dengan jumlah foto terbanyak
  const topCategories = useMemo(() => {
    if (!categories || categories.length === 0) {
      return [
        { id: 'concerts', name: 'Music & Concert' },
        { id: 'portraits', name: 'Portraits' },
        { id: 'people-places', name: 'People & Places' },
      ];
    }

    // Filter keluar opsi 'all'
    const validCats = categories.filter(c => c.id !== 'all');

    // Hitung jumlah foto per kategori
    const counts = {};
    validCats.forEach(c => { counts[c.id] = 0; });

    if (photos && Array.isArray(photos)) {
      photos.forEach(p => {
        if (p.category && counts[p.category] !== undefined) {
          counts[p.category] += 1;
        }
      });
    }

    // Urutkan terbanyak (descending) lalu ambil 3 teratas
    return [...validCats]
      .sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0))
      .slice(0, 3);
  }, [categories, photos]);

  const handleCategoryClick = (catId) => {
    onSelectCategory(catId);
    setIsMobileOpen(false);
    onScrollToSection('gallerySection');
  };

  const handleNavClick = (sectionId) => {
    setIsMobileOpen(false);
    onScrollToSection(sectionId);
  };

  const displayName = profile?.name?.toLowerCase() || 'portfolio';

  return (
    <>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="brand-logo"
            aria-label={`${profile?.name || 'Home'}`}
          >
            <span>{displayName}</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            <button 
              onClick={() => { onSelectCategory('all'); handleNavClick('home'); }} 
              className={`nav-link ${currentCategory === 'all' ? 'active' : ''}`}
            >
              HOME
            </button>
            
            {topCategories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)} 
                className={`nav-link ${currentCategory === cat.id ? 'active' : ''}`}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}

            <button 
              onClick={() => handleNavClick('connect')} 
              className="nav-link"
            >
              CONNECT
            </button>
          </nav>


          {/* Mobile Hamburger Button */}
          <button 
            className={`hamburger-btn ${isMobileOpen ? 'active' : ''}`}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${isMobileOpen ? 'active' : ''}`}>
        <nav className="mobile-nav-links" aria-label="Mobile Navigation">
          <button 
            onClick={() => { onSelectCategory('all'); handleNavClick('home'); }} 
            className={`mobile-nav-link ${currentCategory === 'all' ? 'active' : ''}`}
          >
            Home
          </button>

          {topCategories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)} 
              className={`mobile-nav-link ${currentCategory === cat.id ? 'active' : ''}`}
            >
              {cat.name}
            </button>
          ))}

          <button 
            onClick={() => handleNavClick('connect')} 
            className="mobile-nav-link"
          >
            Connect / About
          </button>
        </nav>

        <div className="mobile-footer-info">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{profile?.email}</p>
          <div className="mobile-socials">
            {profile?.instagram && (
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="mobile-social-icon">
                Instagram
              </a>
            )}
            {profile?.whatsapp && (
              <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" className="mobile-social-icon">
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
