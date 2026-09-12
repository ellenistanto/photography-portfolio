import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Camera, MapPin, Calendar } from 'lucide-react';

export default function ProjectsSection({ projects = [] }) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="projects-section container" id="projects">
      {/* Section Header */}
      <div className="section-header-row">
        <div>
          <div className="section-eyebrow">
            <Layers size={14} className="section-eyebrow-icon" />
            <span>Featured Series & Stories</span>
          </div>
          <h2 className="section-main-title">Curated Projects</h2>
        </div>
        <p className="section-description">
          Dokumentasi menyeluruh untuk pameran, tur panggung, dan kampanye komersial yang dirangkum dalam satu kesatuan cerita visual.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.map((project, index) => {
          const photoCount = project.photos ? project.photos.length : 0;

          return (
            <article key={project.id || index} className="project-card">
              <Link 
                to={`/project/${project.slug}`} 
                className="project-card-link"
                aria-label={`Lihat project: ${project.title}`}
              >
                {/* Image Container */}
                <div className="project-card-media">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="project-card-img"
                  />
                  <div className="project-card-overlay" />
                  
                  {/* Top Badges */}
                  <div className="project-card-top-badges">
                    <span className="project-badge category">
                      {project.categoryLabel || project.category || 'Story'}
                    </span>
                    {photoCount > 0 && (
                      <span className="project-badge count">
                        <Camera size={12} />
                        {photoCount} Frames
                      </span>
                    )}
                  </div>

                  {/* Hover Icon Indicator */}
                  <div className="project-card-arrow-pill">
                    <span>Lihat Cerita</span>
                    <ArrowRight size={15} />
                  </div>
                </div>

                {/* Card Content */}
                <div className="project-card-body">
                  <div className="project-card-meta-line">
                    {project.client && (
                      <span className="project-card-client">{project.client}</span>
                    )}
                    {project.year && (
                      <span className="project-card-dot-sep">•</span>
                    )}
                    {project.year && (
                      <span className="project-card-year">
                        <Calendar size={11} style={{ marginRight: 4 }} />
                        {project.year}
                      </span>
                    )}
                    {project.location && (
                      <span className="project-card-dot-sep">•</span>
                    )}
                    {project.location && (
                      <span className="project-card-location">
                        <MapPin size={11} style={{ marginRight: 3 }} />
                        {project.location}
                      </span>
                    )}
                  </div>

                  <h3 className="project-card-title">{project.title}</h3>

                  {project.summary && (
                    <p className="project-card-summary">{project.summary}</p>
                  )}

                  <div className="project-card-cta">
                    <span className="project-card-cta-text">Buka Halaman Project</span>
                    <ArrowRight size={16} className="project-card-cta-arrow" />
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
