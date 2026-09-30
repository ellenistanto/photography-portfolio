import React, { useState, useRef, useMemo } from 'react';
import { Play } from 'lucide-react';
import { parseVideoSource } from '../utils/videoUtils';

function VideoCard({ video, index, onVideoClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const videoRef = useRef(null);

  const parsed = parseVideoSource(video.videoUrl);
  const posterSrc = video.coverImage || parsed.defaultThumbnail;
  const isDirect = video.videoType === 'direct' || !parsed.isEmbeddable;
  const hoverPreviewSrc = video.previewVideoUrl || (isDirect ? video.videoUrl : null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hoverPreviewSrc && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverPreviewSrc && videoRef.current) {
      videoRef.current.pause();
    }
  };

  const isPortrait = video.aspect === 'portrait';
  const isSquare = video.aspect === 'square';

  return (
    <article
      className={`video-card ${isPortrait ? 'aspect-portrait' : isSquare ? 'aspect-square' : 'aspect-landscape'}`}
      tabIndex={0}
      role="button"
      aria-label={`Tonton video: ${video.title}`}
      onClick={() => onVideoClick(index)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onVideoClick(index);
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="video-card-media-wrapper">
        {/* Poster image */}
        {posterSrc ? (
          <img
            src={posterSrc}
            alt={video.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`video-card-poster ${imageLoaded ? 'loaded' : ''} ${isHovered && hoverPreviewSrc ? 'faded' : ''}`}
          />
        ) : (
          <div className="video-card-placeholder">
            <span>Video Motion</span>
          </div>
        )}

        {/* Hover preview muted video loop if direct or preview URL exists */}
        {hoverPreviewSrc && (
          <video
            ref={videoRef}
            src={hoverPreviewSrc}
            muted
            loop
            playsInline
            preload="none"
            className={`video-card-preview-video ${isHovered ? 'visible' : ''}`}
          />
        )}

        {/* Play Button Overlay */}
        <div className={`video-card-play-btn ${isHovered ? 'hovered' : ''}`}>
          <Play size={20} fill="currentColor" strokeWidth={0} />
        </div>

        {/* Category & Format Badges */}
        <div className="video-card-badges">
          <span className="video-card-badge">
            {video.categoryLabel || video.category || 'Motion'}
          </span>
          {video.aspect === 'portrait' && (
            <span className="video-card-badge format-badge">9:16 REEL</span>
          )}
        </div>

        {/* Card Overlay Meta Details */}
        <div className="video-card-meta">
          <h3 className="video-card-title">{video.title}</h3>
          <div className="video-card-submeta">
            {video.client && <span className="video-card-client">{video.client}</span>}
            {video.year && <span className="video-card-year">• {video.year}</span>}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function VideoSection({ videos = [], onVideoClick }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Extract unique categories from videos
  const categories = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    const map = new Map();
    map.set('all', 'All Works');
    videos.forEach(v => {
      if (v.category) {
        map.set(v.category, v.categoryLabel || v.category);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [videos]);

  const filteredVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    if (selectedCategory === 'all') return videos;
    return videos.filter(v => v.category === selectedCategory);
  }, [videos, selectedCategory]);

  if (!videos || videos.length === 0) {
    return null; // If no videos configured, don't show empty block
  }

  return (
    <section className="video-section" id="videoSection">
      <div className="video-section-header">
        <div className="video-section-tagline">MOTION & VISUALS</div>
        <h2 className="video-section-title">Selected Motion Works</h2>
        <p className="video-section-desc">
          Live stage documentation, creative campaigns, and intimate narrative frames captured in motion.
        </p>

        {/* Category Pills (if more than 1 category) */}
        {categories.length > 2 && (
          <div className="video-category-pills">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`video-category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="video-grid">
        {filteredVideos.map((video, index) => (
          <VideoCard
            key={video.id || index}
            video={video}
            index={index}
            onVideoClick={() => {
              // Pass the index within filteredVideos or find original index
              const originalIndex = videos.findIndex(v => v.id === video.id);
              onVideoClick(originalIndex >= 0 ? originalIndex : index);
            }}
          />
        ))}
      </div>
    </section>
  );
}
