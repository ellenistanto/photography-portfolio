import React from 'react';
import { Maximize2 } from 'lucide-react';

export default function MasonryGallery({ photos, onPhotoClick }) {
  if (!photos || photos.length === 0) {
    return (
      <section className="gallery-section container" id="gallerySection">
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.1rem' }}>Belum ada foto dalam kategori ini.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-section container" id="gallerySection">
      <div className="masonry-grid fade-in">
        {photos.map((photo, index) => (
          <article 
            key={photo.id}
            className="gallery-item"
            tabIndex={0}
            role="button"
            aria-label={`View photo: ${photo.title}`}
            onClick={() => onPhotoClick(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPhotoClick(index);
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
          </article>
        ))}
      </div>
    </section>
  );
}
