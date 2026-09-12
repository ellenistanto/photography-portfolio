import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Camera, MapPin, Calendar, 
  Briefcase, MessageCircle, Mail, Maximize2, Share2, 
  Check, ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import { API_BASE } from '../config/api';

export default function ProjectDetailPage({ portfolioData }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Scroll to top when page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // Find project from loaded portfolio data
  const project = useMemo(() => {
    if (!portfolioData?.projects) return null;
    return portfolioData.projects.find(p => p.slug === slug || p.id === slug);
  }, [portfolioData, slug]);

  // Find adjacent projects for next/prev navigation
  const { prevProject, nextProject } = useMemo(() => {
    if (!portfolioData?.projects || !project) return { prevProject: null, nextProject: null };
    const list = portfolioData.projects;
    const currentIndex = list.findIndex(p => p.id === project.id);
    if (currentIndex === -1) return { prevProject: null, nextProject: null };

    const prev = currentIndex > 0 ? list[currentIndex - 1] : null;
    const next = currentIndex < list.length - 1 ? list[currentIndex + 1] : null;
    return { prevProject: prev, nextProject: next };
  }, [portfolioData, project]);

  // Update document title for SEO
  useEffect(() => {
    if (project) {
      const photographerName = portfolioData?.profile?.name || 'Ellen Istanto';
      document.title = `${project.title} — ${photographerName}`;
    }
    return () => {
      document.title = portfolioData?.profile?.name 
        ? `${portfolioData.profile.name} — Photography Portfolio`
        : 'Photography Portfolio';
    };
  }, [project, portfolioData]);

  // Lightbox keyboard controls
  useEffect(() => {
    if (!lightboxOpen || !project?.photos) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % project.photos.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + project.photos.length) % project.photos.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, project?.photos]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project?.title,
        text: project?.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!project) {
    return (
      <div className="project-detail-notfound">
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 16 }}>Project Tidak Ditemukan</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
            Halaman project yang Anda cari mungkin telah diubah atau belum dipublikasikan.
          </p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const profile = portfolioData?.profile || {};
  const photos = project.photos || [];
  const activePhoto = photos[lightboxIndex];

  // WhatsApp inquiry URL generator
  const waNumber = profile.whatsapp || '';
  const waText = encodeURIComponent(`Halo ${profile.name || 'Ellen'}, saya melihat project "${project.title}" di portofolio Anda dan tertarik berdiskusi untuk kebutuhan fotografi serupa.`);
  const waUrl = waNumber ? `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${waText}` : null;

  return (
    <div className="project-detail-wrapper">
      {/* ── Sticky Top Bar ── */}
      <header className="project-detail-topbar">
        <div className="container project-detail-topbar-inner">
          <button 
            onClick={() => navigate('/')} 
            className="project-back-btn"
            aria-label="Kembali ke Portofolio"
          >
            <ArrowLeft size={18} />
            <span>Semua Karya</span>
          </button>

          <nav className="project-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Beranda</Link>
            <span className="crumb-sep">/</span>
            <Link to="/#projects">Projects</Link>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">{project.title}</span>
          </nav>

          <div className="project-topbar-actions">
            <button 
              onClick={handleShare} 
              className="project-share-btn"
              title="Bagikan Project"
            >
              {copied ? <Check size={16} style={{ color: 'var(--accent-emerald)' }} /> : <Share2 size={16} />}
              <span className="share-text">{copied ? 'Tersalin!' : 'Bagikan'}</span>
            </button>

            {waUrl && (
              <a 
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-cta-btn"
              >
                <MessageCircle size={15} />
                <span>Inquiry Project</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="project-detail-main">
        {/* ── Hero Section ── */}
        <section className="project-hero-section">
          <div className="container">
            {/* Meta Eyebrow */}
            <div className="project-hero-eyebrow">
              <span className="project-badge category">
                {project.categoryLabel || project.category}
              </span>
              {project.year && (
                <span className="project-hero-year-pill">
                  <Calendar size={13} style={{ marginRight: 5 }} />
                  {project.year}
                </span>
              )}
            </div>

            {/* Main Title */}
            <h1 className="project-hero-title">{project.title}</h1>

            {/* Quick Meta Grid */}
            <div className="project-hero-meta-grid">
              {project.client && (
                <div className="meta-card">
                  <span className="meta-card-label">Client / Partner</span>
                  <div className="meta-card-value">
                    <Briefcase size={14} className="meta-icon" />
                    <span>{project.client}</span>
                  </div>
                </div>
              )}

              {project.location && (
                <div className="meta-card">
                  <span className="meta-card-label">Lokasi Dokumentasi</span>
                  <div className="meta-card-value">
                    <MapPin size={14} className="meta-icon" />
                    <span>{project.location}</span>
                  </div>
                </div>
              )}

              <div className="meta-card">
                <span className="meta-card-label">Total Koleksi Foto</span>
                <div className="meta-card-value">
                  <Camera size={14} className="meta-icon" />
                  <span>{photos.length} Frames Terkurasi</span>
                </div>
              </div>
            </div>

            {/* Cinematic Cover Banner */}
            <div className="project-hero-banner">
              <img 
                src={project.coverImage} 
                alt={project.title} 
                className="project-hero-img"
              />
              <div className="project-hero-gradient" />
            </div>
          </div>
        </section>

        {/* ── Story / Editorial Narrative ── */}
        {project.description && (
          <section className="project-story-section">
            <div className="container project-story-container">
              <div className="project-story-eyebrow">
                <span>The Narrative & Vision</span>
              </div>
              <div className="project-story-content">
                {project.description.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="project-story-p">{paragraph}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Photo Gallery Section ── */}
        <section className="project-gallery-section" id="gallery">
          <div className="container">
            <div className="project-gallery-header">
              <div className="project-gallery-title-box">
                <h2 className="project-gallery-title">Visual Showcase</h2>
                <p className="project-gallery-subtitle">
                  Klik foto mana saja untuk melihat dalam resolusi tinggi & detail penuh.
                </p>
              </div>
              <span className="project-gallery-count-badge">
                {photos.length} Foto
              </span>
            </div>

            {photos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                Belum ada foto yang ditambahkan ke dalam project ini.
              </div>
            ) : (
              <div className="project-photos-grid">
                {photos.map((photo, index) => {
                  const aspectClass = photo.aspect === 'portrait' ? 'is-portrait' : photo.aspect === 'square' ? 'is-square' : 'is-landscape';

                  return (
                    <figure 
                      key={photo.id || index}
                      className={`project-photo-item ${aspectClass}`}
                      onClick={() => handleOpenLightbox(index)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Lihat foto: ${photo.title || `Foto ${index + 1}`}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenLightbox(index);
                        }
                      }}
                    >
                      <div className="project-photo-img-box">
                        <img 
                          src={photo.thumb || photo.image} 
                          alt={photo.title || project.title}
                          loading="lazy"
                          decoding="async"
                          className="project-photo-img"
                        />
                        <div className="project-photo-overlay">
                          <div className="project-photo-caption-box">
                            {photo.title && (
                              <h4 className="project-photo-title">{photo.title}</h4>
                            )}
                            {photo.caption && (
                              <p className="project-photo-caption">{photo.caption}</p>
                            )}
                          </div>
                          <div className="project-photo-zoom-btn">
                            <Maximize2 size={16} />
                          </div>
                        </div>
                      </div>
                    </figure>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Project Navigation (Prev / Next) ── */}
        <section className="project-nav-section">
          <div className="container">
            <div className="project-nav-grid">
              {prevProject ? (
                <Link to={`/project/${prevProject.slug}`} className="project-nav-card prev">
                  <div className="project-nav-dir">
                    <ChevronLeft size={16} />
                    <span>Project Sebelumnya</span>
                  </div>
                  <h4 className="project-nav-title">{prevProject.title}</h4>
                  <span className="project-nav-cat">{prevProject.categoryLabel || prevProject.category}</span>
                </Link>
              ) : <div />}

              {nextProject ? (
                <Link to={`/project/${nextProject.slug}`} className="project-nav-card next">
                  <div className="project-nav-dir">
                    <span>Project Selanjutnya</span>
                    <ChevronRight size={16} />
                  </div>
                  <h4 className="project-nav-title">{nextProject.title}</h4>
                  <span className="project-nav-cat">{nextProject.categoryLabel || nextProject.category}</span>
                </Link>
              ) : <div />}
            </div>
          </div>
        </section>

        {/* ── Call to Action Banner ── */}
        <section className="project-cta-section">
          <div className="container">
            <div className="project-cta-box">
              <div className="project-cta-content">
                <span className="project-cta-tag">Creative Collaboration</span>
                <h3 className="project-cta-title">
                  Ingin Mewujudkan Dokumentasi Serupa untuk Event atau Brand Anda?
                </h3>
                <p className="project-cta-desc">
                  Hubungi langsung untuk konsultasi kebutuhan visual, konsep pemotretan, ketersediaan jadwal, atau penawaran rate card.
                </p>
              </div>
              <div className="project-cta-actions">
                {waUrl && (
                  <a 
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <MessageCircle size={18} />
                    <span>WhatsApp Langsung</span>
                  </a>
                )}
                {profile.email && (
                  <a 
                    href={`mailto:${profile.email}?subject=${encodeURIComponent(`Inquiry Fotografi: Kolaborasi Project Serupa ${project.title}`)}`}
                    className="btn-secondary"
                  >
                    <Mail size={18} />
                    <span>Kirim Email</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Lightbox Modal ── */}
      {lightboxOpen && activePhoto && (
        <div 
          className="project-lightbox-overlay" 
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          {/* Top Controls */}
          <div className="project-lightbox-top" onClick={e => e.stopPropagation()}>
            <span className="lightbox-counter">
              {lightboxIndex + 1} / {photos.length}
            </span>
            <button 
              onClick={() => setLightboxOpen(false)}
              className="lightbox-close-btn"
              aria-label="Tutup foto"
            >
              <X size={22} />
            </button>
          </div>

          {/* Image & Arrows Container */}
          <div className="project-lightbox-body" onClick={e => e.stopPropagation()}>
            {photos.length > 1 && (
              <button 
                className="lightbox-arrow-btn prev"
                onClick={() => setLightboxIndex(prev => (prev - 1 + photos.length) % photos.length)}
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft size={30} />
              </button>
            )}

            <div className="lightbox-img-wrapper">
              <img 
                src={activePhoto.image || activePhoto.thumb} 
                alt={activePhoto.title || project.title}
                className="lightbox-active-img"
              />
            </div>

            {photos.length > 1 && (
              <button 
                className="lightbox-arrow-btn next"
                onClick={() => setLightboxIndex(prev => (prev + 1) % photos.length)}
                aria-label="Foto selanjutnya"
              >
                <ChevronRight size={30} />
              </button>
            )}
          </div>

          {/* Caption bar */}
          {(activePhoto.title || activePhoto.caption) && (
            <div className="project-lightbox-caption-bar" onClick={e => e.stopPropagation()}>
              {activePhoto.title && <div className="lightbox-cap-title">{activePhoto.title}</div>}
              {activePhoto.caption && <div className="lightbox-cap-text">{activePhoto.caption}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
