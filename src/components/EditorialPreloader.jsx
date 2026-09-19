import React, { useState, useEffect } from 'react';

const PRELOADER_KEY = 'portfolio_preloader_seen';

export default function EditorialPreloader({ profile }) {
  const [phase, setPhase] = useState(() => {
    // Check if user has already seen preloader in this session
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('intro') === '1') {
        return 'active'; // allow preview via ?intro=1
      }
      const hasSeen = sessionStorage.getItem(PRELOADER_KEY);
      if (hasSeen) return 'hidden';
    }
    return 'active';
  });

  const name = profile?.name || 'Ellen Istanto';

  useEffect(() => {
    if (phase === 'hidden') return;

    // Lock body scroll during preloader
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Step 1: Text element fades in smoothly
    const t1 = setTimeout(() => {
      setPhase('content-in');
    }, 60);

    // Step 2: Text fades out subtly
    const t2 = setTimeout(() => {
      setPhase('content-out');
    }, 1350);

    // Step 3: Curtain slides up with luxury editorial easing
    const t3 = setTimeout(() => {
      setPhase('curtain-up');
    }, 1700);

    // Step 4: Finish & unmount from DOM
    const t4 = setTimeout(() => {
      setPhase('hidden');
      document.body.style.overflow = prevOverflow || '';
      try {
        sessionStorage.setItem(PRELOADER_KEY, 'true');
      } catch (e) {
        // Safe fallback if sessionStorage is restricted
      }
    }, 2450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      document.body.style.overflow = prevOverflow || '';
    };
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div 
      className={`editorial-preloader phase-${phase}`}
      aria-hidden={phase === 'hidden'}
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="preloader-backdrop">
        <div className="preloader-content">
          <span className="preloader-eyebrow">PORTFOLIO</span>
          <h1 className="preloader-name">{name}</h1>
          <div className="preloader-divider">
            <span className="preloader-line"></span>
          </div>
          <p className="preloader-subtext">Selected Moments &amp; Narratives</p>
        </div>
      </div>
    </div>
  );
}
