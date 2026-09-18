import React from 'react';

export default function Footer({ profile }) {
  const currentYear = new Date().getFullYear();
  const displayName = profile?.name?.toLowerCase() || 'portfolio';

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h4>{displayName}</h4>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} {profile?.name || 'Portfolio'}. All rights reserved.</p>
          <p>Yogyakarta, Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
