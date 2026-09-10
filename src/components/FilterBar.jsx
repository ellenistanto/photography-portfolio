import React from 'react';

export default function FilterBar({ categories, currentCategory, onSelectCategory, totalCount }) {
  const currentCatObj = categories.find(c => c.id === currentCategory);
  const currentCatName = currentCatObj ? currentCatObj.name : 'Works';

  return (
    <section className="filter-section" id="filterSection">
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
