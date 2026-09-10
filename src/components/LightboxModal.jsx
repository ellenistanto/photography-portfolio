import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LightboxModal({ 
  isOpen, 
  photos, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev 
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeScrollIndex, setActiveScrollIndex] = useState(currentIndex);
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
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
      if (e.key === 'Escape') onClose();
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
  }, [isOpen, onNext, onPrev, onClose, isMobile]);

  // Auto-scroll to selected photo when opened on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      setActiveScrollIndex(currentIndex);
      const timer = setTimeout(() => {
        const target = itemRefs.current[currentIndex];
        if (target) {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentIndex, isMobile]);

  if (!isOpen || !photos || photos.length === 0) return null;

  // Track active photo as user scrolls down on mobile
  const handleMobileScroll = () => {
    if (!containerRef.current || !itemRefs.current.length) return;
    const containerTop = containerRef.current.getBoundingClientRect().top;
    
    let closestIndex = activeScrollIndex;
    let minDistance = Infinity;

    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top - containerTop - 60);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeScrollIndex) {
      setActiveScrollIndex(closestIndex);
    }
  };

  // ── MOBILE LAYOUT: Vertical Scroll Feed ──
  if (isMobile) {
    const currentActivePhoto = photos[activeScrollIndex] || photos[currentIndex] || photos[0];
    return (
      <div 
        className="lightbox-modal active lightbox-modal-mobile" 
        role="dialog" 
        aria-modal="true" 
        aria-label="Photo Lightbox"
      >
        {/* Sticky Mobile Header */}
        <div className="lightbox-mobile-header">
          <div className="lightbox-mobile-title-wrap">
            <span className="lightbox-mobile-category">
              {currentActivePhoto.categoryLabel || 'Portfolio'}
            </span>
            <span className="lightbox-mobile-counter">
              {activeScrollIndex + 1} / {photos.length}
            </span>
          </div>
          <button 
            className="lightbox-close-btn" 
            onClick={onClose}
            aria-label="Close Lightbox"
          >
            <X size={22} />
          </button>
        </div>

        {/* Vertical Scroll List of Photos */}
        <div 
          className="lightbox-vertical-scroll" 
          ref={containerRef}
          onScroll={handleMobileScroll}
        >
          {photos.map((item, idx) => (
            <article 
              key={item.id || idx} 
              id={`lightbox-photo-${idx}`}
              className="lightbox-vertical-item"
              ref={(el) => (itemRefs.current[idx] = el)}
            >
              <div className="lightbox-vertical-img-wrap">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="lightbox-vertical-img"
                  loading={Math.abs(idx - currentIndex) <= 2 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
              <div className="lightbox-vertical-caption">
                <div className="lightbox-vertical-meta-row">
                  <span className="lightbox-vertical-badge">
                    {item.categoryLabel || item.category}
                  </span>
                  <span className="lightbox-vertical-year">{item.year}</span>
                </div>
                <h3 className="lightbox-vertical-title">{item.title}</h3>
                {item.client && (
                  <p className="lightbox-vertical-client">{item.client}</p>
                )}
                {item.description && (
                  <p className="lightbox-vertical-desc">{item.description}</p>
                )}
              </div>
            </article>
          ))}
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
