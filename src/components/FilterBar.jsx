import React, { useState, useEffect } from 'react';

export default function FilterBar({ categories, currentCategory, onSelectCategory, totalCount }) {
  const currentCatObj = categories.find(c => c.id === currentCategory);
  const currentCatName = currentCatObj ? currentCatObj.name : 'Works';
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Shrink after scrolling past 200px
      setCompact(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={`filter-section ${compact ? 'compact' : ''}`} id="filterSection">
      <div className="container filter-container">
        <div className="filter-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${cat.id === currentCategory ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <span className="gallery-stats-label">
          {currentCategory === 'all' 
            ? `Showing all ${totalCount} works` 
            : `Showing ${totalCount} works in ${currentCatName}`}
        </span>
      </div>
    </section>
  );
}
