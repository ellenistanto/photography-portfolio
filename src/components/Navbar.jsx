import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

export default function Navbar({ profile, currentCategory, onSelectCategory, onScrollToSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (catId) => {
    onSelectCategory(catId);
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
    onScrollToSection('gallerySection');
  };

  const handleNavClick = (sectionId) => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
    onScrollToSection(sectionId);
  };

  const displayName = profile?.name?.toLowerCase() || 'portfolio';

  return (
    <>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
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
            
            <button 
              onClick={() => handleCategoryClick('concerts')} 
              className={`nav-link ${currentCategory === 'concerts' ? 'active' : ''}`}
            >
              MUSIC & CONCERT
            </button>

            {/* Dropdown Menu */}
            <div 
              className={`has-dropdown ${isDropdownOpen ? 'open' : ''}`}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button 
                className="nav-link dropdown-toggle" 
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>BEYOND THE STAGE</span>
                <ChevronDown className="dropdown-arrow" />
              </button>
              
              <div className="dropdown-menu">
                <button 
                  onClick={() => handleCategoryClick('portraits')} 
                  className={`dropdown-item ${currentCategory === 'portraits' ? 'active' : ''}`}
                >
                  Portraits
                </button>
                <button 
                  onClick={() => handleCategoryClick('people-places')} 
                  className={`dropdown-item ${currentCategory === 'people-places' ? 'active' : ''}`}
                >
                  People & Places
                </button>
                <button 
                  onClick={() => handleCategoryClick('brands')} 
                  className={`dropdown-item ${currentCategory === 'brands' ? 'active' : ''}`}
                >
                  Brands & Products
                </button>
              </div>
            </div>

            <button 
              onClick={() => handleNavClick('projects')} 
              className="nav-link"
            >
              PROJECTS
            </button>

            <button 
              onClick={() => handleNavClick('connect')} 
              className="nav-link"
            >
              CONNECT
            </button>
          </nav>

          {/* Nav CTA Button */}
          <button 
            onClick={() => handleNavClick('connect')} 
            className="nav-cta-btn"
          >
            <span>Get in Touch</span>
          </button>

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
          <button 
            onClick={() => handleCategoryClick('concerts')} 
            className={`mobile-nav-link ${currentCategory === 'concerts' ? 'active' : ''}`}
          >
            Music & Concert
          </button>

          <button 
            onClick={() => handleNavClick('projects')} 
            className="mobile-nav-link"
          >
            Projects & Series
          </button>

          <div className="mobile-group">
            <span className="mobile-nav-link" style={{ color: 'var(--text-muted)', fontSize: '1.15rem' }}>
              Beyond the Stage
            </span>
            <div className="mobile-sublinks">
              <button 
                onClick={() => handleCategoryClick('portraits')} 
                className={`mobile-sublink ${currentCategory === 'portraits' ? 'active' : ''}`}
              >
                Portraits
              </button>
              <button 
                onClick={() => handleCategoryClick('people-places')} 
                className={`mobile-sublink ${currentCategory === 'people-places' ? 'active' : ''}`}
              >
                People & Places
              </button>
              <button 
                onClick={() => handleCategoryClick('brands')} 
                className={`mobile-sublink ${currentCategory === 'brands' ? 'active' : ''}`}
              >
                Brands & Products
              </button>
            </div>
          </div>

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
