import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LightboxModal({ 
  isOpen, 
  photos, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev 
}) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onNext, onPrev, onClose]);

  if (!isOpen || !photos || photos.length === 0) return null;

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
