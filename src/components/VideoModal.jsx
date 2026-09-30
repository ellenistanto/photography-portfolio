import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { parseVideoSource } from '../utils/videoUtils';

export default function VideoModal({
  isOpen,
  videos = [],
  currentIndex = 0,
  onClose,
  onNext,
  onPrev,
}) {
  const video = videos[currentIndex];

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'ArrowRight' && onNext) {
        onNext();
      }
      if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !video) return null;

  const parsed = parseVideoSource(video.videoUrl);
  const isPortrait = video.aspect === 'portrait';
  const isSquare = video.aspect === 'square';

  return (
    <div
      className="video-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={video.title || 'Video Player'}
      onClick={onClose}
    >
      <div
        className={`video-modal-container ${isPortrait ? 'is-portrait' : isSquare ? 'is-square' : 'is-landscape'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="video-modal-header">
          <div className="video-modal-meta-header">
            <span className="video-modal-badge">{video.categoryLabel || video.category || 'Motion'}</span>
            <h3 className="video-modal-title">{video.title}</h3>
          </div>
          <button
            className="video-modal-close-btn"
            onClick={onClose}
            aria-label="Tutup pemutar video"
          >
            <X size={22} />
          </button>
        </div>

        {/* Video Player Frame */}
        <div className="video-modal-player-wrapper">
          {parsed.isEmbeddable ? (
            <iframe
              src={parsed.embedUrl}
              title={video.title}
              className="video-modal-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              src={video.videoUrl}
              controls
              autoPlay
              playsInline
              className="video-modal-native"
            />
          )}

          {/* Prev / Next Navigation Arrows */}
          {videos.length > 1 && (
            <>
              <button
                className="video-modal-nav-btn prev"
                onClick={onPrev}
                aria-label="Video sebelumnya"
              >
                <ChevronLeft size={26} />
              </button>
              <button
                className="video-modal-nav-btn next"
                onClick={onNext}
                aria-label="Video berikutnya"
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}
        </div>

        {/* Footer Meta Details */}
        {(video.client || video.year || video.description) && (
          <div className="video-modal-footer">
            <div className="video-modal-footer-credits">
              {video.client && <span className="video-modal-client">{video.client}</span>}
              {video.year && <span className="video-modal-year">• {video.year}</span>}
            </div>
            {video.description && (
              <p className="video-modal-description">{video.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
