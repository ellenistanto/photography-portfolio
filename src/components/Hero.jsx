import React from 'react';

export default function Hero({ profile }) {
  const heroImage = profile?.heroImage;
  const name = profile?.name || 'Ellen Istanto';

  // Lead headline: e.g. "I’m Ellen Istanto, a photographer based in Indonesia."
  const isOldDefaultTagline = profile?.tagline === "Concerts, Portraits, Travel, and Human moments in between.";
  const headline = (profile?.tagline && !isOldDefaultTagline)
    ? profile.tagline
    : `I’m ${name}, a photographer based in Indonesia.`;

  // Bio description below headline
  const defaultBio = "Drawn to moments charged with emotion, I work between motion and stillness — on stage, in portraits, and through travel narratives. My images are shaped by storytelling, restraint, and a pursuit of visuals that feel honest and lasting.";
  const bio = profile?.shortBio || defaultBio;

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
          <h1 className="hero-lead">
            {headline}
          </h1>
          <p className="hero-bio">
            {bio}
          </p>
        </div>
      </div>
    </section>
  );
}
