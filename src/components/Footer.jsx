import React, { useMemo } from 'react';

export default function Footer({ 
  profile, 
  categories = [], 
  photos = [], 
  onSelectCategory, 
  onScrollToSection 
}) {
  const currentYear = new Date().getFullYear();
  const displayName = profile?.name?.toLowerCase() || 'portfolio';

  // 3 Kategori teratas dengan jumlah foto terbanyak (sama seperti Navbar di atas)
  const topCategories = useMemo(() => {
    if (!categories || categories.length === 0) {
      return [
        { id: 'concerts', name: 'Music & Concert' },
        { id: 'portraits', name: 'Portraits' },
        { id: 'people-places', name: 'People & Places' },
      ];
    }

    // Filter keluar opsi 'all'
    const validCats = categories.filter(c => c.id !== 'all');

    // Hitung jumlah foto per kategori
    const counts = {};
    validCats.forEach(c => { counts[c.id] = 0; });

    if (photos && Array.isArray(photos)) {
      photos.forEach(p => {
        if (p.category && counts[p.category] !== undefined) {
          counts[p.category] += 1;
        }
      });
    }

    // Urutkan terbanyak (descending) lalu ambil 3 teratas
    return [...validCats]
      .sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0))
      .slice(0, 3);
  }, [categories, photos]);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h4>{displayName}</h4>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h5>Navigation</h5>
              <ul>
                <li>
                  <button onClick={() => { onSelectCategory('all'); onScrollToSection('home'); }}>
                    Home
                  </button>
                </li>
                {topCategories.map((cat) => (
                  <li key={cat.id}>
                    <button onClick={() => { onSelectCategory(cat.id); onScrollToSection('gallerySection'); }}>
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h5>Connect</h5>
              <ul>
                {profile?.instagram && (
                  <li>
                    <a href={profile.instagram} target="_blank" rel="noopener noreferrer">
                      Instagram
                    </a>
                  </li>
                )}
                {profile?.whatsapp && (
                  <li>
                    <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  </li>
                )}
                {profile?.email && (
                  <li>
                    <a href={`mailto:${profile.email}`}>
                      Email
                    </a>
                  </li>
                )}
              </ul>
            </div>
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
