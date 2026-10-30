import React from 'react';

export default function Hero({ profile }) {
  const heroImage = profile?.heroImage;
  const name = profile?.name?.trim();
  const headline = profile?.tagline?.trim() || (name ? `I’m ${name}, a photographer based in Indonesia.` : '');
  const bio = profile?.shortBio?.trim() || '';

  // Jika belum ada heroImage, headline, maupun bio, sembunyikan hero section
  if (!headline && !bio && !heroImage) {
    return null;
  }

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
          {headline && (
            <h1 className="hero-lead">
              {headline}
            </h1>
          )}
          {bio && (
            <p className="hero-bio">
              {bio}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
