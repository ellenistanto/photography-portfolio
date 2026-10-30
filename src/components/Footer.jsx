import React from 'react';

export default function Footer({ profile }) {
  const currentYear = new Date().getFullYear();
  const name = profile?.name?.trim() || 'Portfolio';
  const location = profile?.location?.trim();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-bottom">
          <p>&copy; {currentYear} {name}. All rights reserved.</p>
          {location && <p>{location}</p>}
        </div>
      </div>
    </footer>
  );
}
