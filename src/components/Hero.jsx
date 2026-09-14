import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function Hero({ profile, onExploreClick, onContactClick }) {
  const name = profile?.name || 'Ellen Istanto';
  const heroImage = profile?.heroImage;

  return (
    <section className="hero-section" id="home">
      {heroImage ? (
        <div 
          className="hero-background"
          style={{ backgroundImage: `url('${heroImage}')` }}
        ></div>
      ) : (
        <div className="hero-background hero-background-placeholder"></div>
      )}
      <div className="hero-overlay"></div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span>Photographer</span>
          </div>
          
          <h1 className="hero-title">
            {name}
          </h1>
          
          <p className="hero-statement">
            {profile?.shortBio || "Concerts, portraits, travel, and the human moments in between."}
          </p>

          <div className="hero-actions">
            <button onClick={onExploreClick} className="btn-primary">
              <span>View Works</span>
              <ArrowDown size={16} />
            </button>
            <button onClick={onContactClick} className="btn-secondary">
              <span>Contact</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
