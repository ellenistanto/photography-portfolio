import React from 'react';

export default function Footer({ profile }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-bottom">
          <p>&copy; {currentYear} {profile?.name || 'Portfolio'}. All rights reserved.</p>
          <p>Yogyakarta, Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
