import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function LightboxModal({ 
  isOpen, 
  photos, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev 
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Detect mobile screen (<= 768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keyboard navigation for desktop & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen && isMobile) {
          if (document.fullscreenElement) document.exitFullscreen();
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
      if (!isMobile) {
        if (e.key === 'ArrowRight') onNext();
        if (e.key === 'ArrowLeft') onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onNext, onPrev, onClose, isMobile, isFullscreen]);

  if (!isOpen || !photos || photos.length === 0) return null;

  const handleFullscreen = () => {
    const el = document.getElementById('mobile-photo-viewer');
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Listen for fullscreen change (e.g. user presses Esc in fullscreen)
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // ── MOBILE LAYOUT: Single photo with title+desc + fullscreen option ──
  if (isMobile) {
    const photo = photos[currentIndex] || photos[0];
    if (!photo) return null;

    return (
      <div 
        id="mobile-photo-viewer"
        className="lightbox-modal active lightbox-modal-mobile" 
        role="dialog" 
        aria-modal="true" 
        aria-label="Photo Lightbox"
      >
        {/* Header */}
        <div className="lightbox-mobile-header">
          <span className="lightbox-mobile-category">
            {photo.categoryLabel || photo.category || 'Portfolio'}
          </span>
          <div className="lightbox-mobile-actions">
            <button 
              className="lightbox-mobile-action-btn"
              onClick={handleFullscreen}
              aria-label="Toggle fullscreen"
            >
              <Maximize2 size={18} />
            </button>
            <button 
              className="lightbox-close-btn" 
              onClick={onClose}
              aria-label="Close Lightbox"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Single Photo */}
        <div className="lightbox-mobile-single">
          <div className="lightbox-mobile-img-wrap">
            <img 
              src={photo.image} 
              alt={photo.title} 
              className="lightbox-mobile-img"
              decoding="async"
            />
          </div>

          {/* Caption below photo */}
          <div className="lightbox-mobile-caption">
            <div className="lightbox-vertical-meta-row">
              <span className="lightbox-vertical-badge">
                {photo.categoryLabel || photo.category}
              </span>
              {photo.year && (
                <span className="lightbox-vertical-year">{photo.year}</span>
              )}
            </div>
            <h3 className="lightbox-vertical-title">{photo.title}</h3>
            {photo.client && (
              <p className="lightbox-vertical-client">{photo.client}</p>
            )}
            {photo.description && (
              <p className="lightbox-vertical-desc">{photo.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── DESKTOP LAYOUT: Centered Single Photo with Arrows ──
  const photo = photos[currentIndex];
  if (!photo) return null;

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchEndX.current - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) onNext();
      else onPrev();
    }
  };

  return (
    <div 
      className="lightbox-modal active" 
      role="dialog" 
      aria-modal="true" 
      aria-label="Photo Lightbox"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="lightbox-header">
        <span className="lightbox-counter">
          {currentIndex + 1} / {photos.length}
        </span>
        <button 
          className="lightbox-close-btn" 
          onClick={onClose}
          aria-label="Close Lightbox"
        >
          <X size={24} />
        </button>
      </div>

      <div className="lightbox-body" onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
        <button 
          className="lightbox-nav-btn lightbox-prev" 
          onClick={onPrev}
          aria-label="Previous photo"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="lightbox-image-container">
          <img 
            src={photo.image} 
            alt={photo.title} 
            className="lightbox-img"
          />
        </div>

        <button 
          className="lightbox-nav-btn lightbox-next" 
          onClick={onNext}
          aria-label="Next photo"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <div className="lightbox-footer">
        <h4 className="lightbox-caption-title">{photo.title} ({photo.year})</h4>
        <p className="lightbox-caption-desc">
          {photo.description || `${photo.client || ''} — ${photo.categoryLabel || ''}`}
        </p>
      </div>
    </div>
  );
}

