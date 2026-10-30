import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

function GalleryCard({ photo, index, onPhotoClick }) {
  const [loaded, setLoaded] = useState(false);
  const [cardRef, isVisible] = useScrollReveal({
    threshold: 0.02,
    rootMargin: '0px 0px 60px 0px',
    once: true,
  });

  const staggerDelay = (index % 3) * 30;
  const imgWidth = 800;
  const imgHeight = photo.aspect === 'portrait' ? 1000 : photo.aspect === 'square' ? 800 : 533;

  return (
    <article 
      ref={cardRef}
      className={`gallery-item ${isVisible ? 'is-visible' : ''} ${loaded ? 'photo-loaded' : 'photo-loading'}`}
      style={{
        transitionDelay: isVisible ? `${staggerDelay}ms` : '0ms'
      }}
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
          loading={index < 3 ? "eager" : "lazy"}
          fetchPriority={index < 2 ? "high" : "auto"}
          decoding="async"
          width={imgWidth}
          height={imgHeight}
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
          <p style={{ fontSize: '1.1rem' }}>Belum ada karya foto yang ditambahkan.</p>
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
