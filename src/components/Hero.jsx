import React from 'react';

export default function Hero({ profile }) {
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
          <h1 className="hero-title">
            {name}
          </h1>
          
          <p className="hero-statement">
            {profile?.shortBio || "Concerts, portraits, travel, and the human moments in between."}
          </p>
        </div>
      </div>
    </section>
  );
}
