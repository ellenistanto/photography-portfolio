import React, { useState } from 'react';

function GalleryCard({ photo, index, onPhotoClick }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <article 
      className={`gallery-item ${loaded ? 'photo-loaded' : 'photo-loading'}`}
      style={{ animationDelay: `${Math.min(index * 35, 350)}ms` }}
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
          onLoad={() => setLoaded(true)}
          ref={(el) => {
            if (el && el.complete && !loaded) {
              setLoaded(true);
            }
          }}
          className={`gallery-img ${loaded ? 'loaded' : 'loading'}`}
        />
        {/* Desktop hover overlay */}
        <div className="gallery-meta-overlay">
          <span className="gallery-meta-badge">
            {photo.categoryLabel || photo.category}
          </span>
          <h3 className="gallery-meta-title">{photo.title}</h3>
          <p className="gallery-meta-client">{photo.client || ''}</p>
        </div>
      </div>
    </article>
  );
}

export default function MasonryGallery({ photos, onPhotoClick, loading = false }) {
  // Tampilkan skeleton shimmer saat pertama kali memuat foto
  if (loading && (!photos || photos.length === 0)) {
    return (
      <section className="gallery-section" id="gallerySection">
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
      <section className="gallery-section" id="gallerySection">
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.1rem' }}>Belum ada foto dalam kategori ini.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-section" id="gallerySection">
      <div className="masonry-grid">
        {photos.map((photo, index) => (
          <GalleryCard 
            key={photo.id}
            photo={photo}
            index={index}
            onPhotoClick={onPhotoClick}
          />
        ))}
      </div>
    </section>
  );
}
