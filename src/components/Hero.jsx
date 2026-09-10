import React from 'react';
import { ArrowDown } from 'lucide-react';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920&q=80';

export default function Hero({ profile, onExploreClick, onContactClick }) {
  const name = profile?.name || 'Photographer';
  const heroImage = profile?.heroImage || DEFAULT_HERO_IMAGE;

  return (
    <section className="hero-section" id="home">
      <div 
        className="hero-background"
        style={{ backgroundImage: `url('${heroImage}')` }}
      ></div>
      <div className="hero-overlay"></div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span>Photographer & Visual Storyteller</span>
          </div>
          
          <h1 className="hero-title">
            {name} — <span className="highlight">Concerts, Portraits, Travel,</span> & Human Moments.
          </h1>
          
          <p className="hero-statement">
            {profile?.shortBio || "Drawn to moments charged with emotion, I work between motion and stillness — capturing the raw frenzy of arena stages and the quiet authenticity of human connection."}
          </p>

          <div className="hero-actions">
            <button onClick={onExploreClick} className="btn-primary">
              <span>View Works</span>
              <ArrowDown size={16} />
            </button>
            <button onClick={onContactClick} className="btn-secondary">
              <span>About & Contact</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
