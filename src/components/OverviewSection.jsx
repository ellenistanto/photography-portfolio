import React from 'react';
import { Sparkles, Maximize2, ArrowUpRight } from 'lucide-react';

export default function OverviewSection({ overview, photos, onPhotoClick }) {
  // If disabled by admin or no photos selected, don't render
  if (overview?.enabled === false || !photos || photos.length === 0) {
    return null;
  }

  const title = overview?.title || 'Selected Works';
  const subtitle = overview?.subtitle || 'Curated highlights & moments in between';

  return (
    <section className="overview-section" id="overview">
      <div className="container">
        {/* Section Header */}
        <div className="overview-header">
          <div className="overview-eyebrow">
            <Sparkles size={14} className="overview-sparkle-icon" />
            <span>Curated Highlights</span>
          </div>
          <div className="overview-title-row">
            <h2 className="overview-title">{title}</h2>
            <p className="overview-subtitle">{subtitle}</p>
          </div>
        </div>

        {/* Overview Editorial Grid */}
        <div className="overview-grid">
          {photos.map((photo, index) => {
            // First item or items with portrait aspect get featured presentation
            const isFeaturedCard = index === 0 && photos.length > 2;

            return (
              <article
                key={photo.id}
                className={`overview-card ${isFeaturedCard ? 'overview-card-featured' : ''}`}
                tabIndex={0}
                role="button"
                aria-label={`View selected photo: ${photo.title}`}
                onClick={() => onPhotoClick(photo, index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onPhotoClick(photo, index);
                  }
                }}
              >
                <div className="overview-img-container">
                  <img
                    src={photo.image || photo.thumb}
                    alt={photo.title}
                    loading="lazy"
                    decoding="async"
                    className="overview-img"
                  />
                  <div className="overview-overlay"></div>

                  {/* Top Badge */}
                  <div className="overview-top-badge">
                    <span className="overview-pill">
                      {photo.categoryLabel || photo.category}
                    </span>
                    {photo.year && (
                      <span className="overview-year-tag">{photo.year}</span>
                    )}
                  </div>

                  {/* Bottom Meta Info */}
                  <div className="overview-card-content">
                    {photo.client && (
                      <p className="overview-client">{photo.client}</p>
                    )}
                    <h3 className="overview-card-title">{photo.title}</h3>
                    {photo.description && (
                      <p className="overview-card-desc">{photo.description}</p>
                    )}
                  </div>

                  {/* Interactive Expand Icon */}
                  <div className="overview-zoom-btn" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
