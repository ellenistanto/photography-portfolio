import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';

export default function MasonryGallery({ photos, onPhotoClick, loading = false }) {
  const [expandedId, setExpandedId] = useState(null);

  // Tampilkan skeleton shimmer saat pertama kali memuat foto
  if (loading && (!photos || photos.length === 0)) {
    return (
      <section className="gallery-section container" id="gallerySection">
        <div className="masonry-grid gallery-skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`gallery-skeleton-card skeleton-card-${i}`}>
              <div className="skeleton-shimmer"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <section className="gallery-section container" id="gallerySection">
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.1rem' }}>Belum ada foto dalam kategori ini.</p>
        </div>
      </section>
    );
  }

  const handleClick = (photo, index) => {
    // Mobile: toggle text reveal below photo (no lightbox)
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none) and (max-width: 768px)').matches) {
      setExpandedId(prev => (prev === photo.id ? null : photo.id));
      return;
    }
    // Desktop: open lightbox
    onPhotoClick(index);
  };

  return (
    <section className="gallery-section container" id="gallerySection">
      <div className="masonry-grid fade-in">
        {photos.map((photo, index) => {
          const isExpanded = expandedId === photo.id;
          return (
            <article 
              key={photo.id}
              className={`gallery-item ${isExpanded ? 'caption-expanded' : ''}`}
              tabIndex={0}
              role="button"
              aria-label={`View photo: ${photo.title}`}
              onClick={() => handleClick(photo, index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick(photo, index);
                }
              }}
            >
              <div className="gallery-img-wrapper">
                <img 
                  src={photo.thumb || photo.image} 
                  alt={photo.title}
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="600"
                />
                {/* Desktop hover overlay */}
                <div className="gallery-meta-overlay">
                  <span className="gallery-meta-badge">
                    {photo.categoryLabel || photo.category} • {photo.year || ''}
                  </span>
                  <h3 className="gallery-meta-title">{photo.title}</h3>
                  <p className="gallery-meta-client">{photo.client || ''}</p>
                </div>
                <div className="gallery-zoom-icon" aria-hidden="true">
                  <Maximize2 size={18} />
                </div>
              </div>
              {/* Mobile: caption below photo — hidden unless expanded */}
              <div className="gallery-caption-below">
                <span className="gallery-meta-badge">
                  {photo.categoryLabel || photo.category} • {photo.year || ''}
                </span>
                <h3 className="gallery-meta-title">{photo.title}</h3>
                <p className="gallery-meta-client">{photo.client || ''}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
