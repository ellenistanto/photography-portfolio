/**
 * ====================================================================
 * MARTINUS RAGITA PORTFOLIO - CORE APPLICATION LOGIC
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Verifikasi ketersediaan PORTFOLIO_DATA
  if (typeof PORTFOLIO_DATA === 'undefined') {
    console.error('PORTFOLIO_DATA tidak ditemukan! Pastikan data/portfolio-data.js dimuat dengan benar.');
    return;
  }

  // --- STATE ---
  let currentCategory = 'all';
  let filteredPhotos = [];
  let currentLightboxIndex = 0;

  // --- DOM ELEMENTS ---
  const siteHeader = document.getElementById('siteHeader');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const clientsCloud = document.getElementById('clientsCloud');
  const filterTabs = document.getElementById('filterTabs');
  const photoCountLabel = document.getElementById('photoCountLabel');
  const masonryGrid = document.getElementById('masonryGrid');
  const statsGrid = document.getElementById('statsGrid');
  const timelineTrack = document.getElementById('timelineTrack');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const currentYearSpan = document.getElementById('currentYear');
  
  // Lightbox DOM
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCounter = document.getElementById('lightboxCounter');

  // Contact Form DOM
  const contactForm = document.getElementById('portfolioContactForm');
  const formFeedback = document.getElementById('formFeedback');

  // Set Current Year in Footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ==================================================================
  // 1. RENDER CLIENTS / COLLABORATORS
  // ==================================================================
  function renderClients() {
    if (!clientsCloud || !PORTFOLIO_DATA.clients) return;
    clientsCloud.innerHTML = PORTFOLIO_DATA.clients.map(client => `
      <span class="client-tag">${escapeHtml(client)}</span>
    `).join('');
  }

  // ==================================================================
  // 2. RENDER CATEGORY FILTER BUTTONS
  // ==================================================================
  function renderFilterTabs() {
    if (!filterTabs || !PORTFOLIO_DATA.categories) return;
    filterTabs.innerHTML = PORTFOLIO_DATA.categories.map(cat => `
      <button class="filter-btn ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
        ${escapeHtml(cat.name)}
      </button>
    `).join('');

    // Attach click events
    filterTabs.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');
        setCategory(cat, true);
      });
    });
  }

  // ==================================================================
  // 3. RENDER MASONRY GALLERY PHOTOS
  // ==================================================================
  function renderGallery() {
    if (!masonryGrid || !PORTFOLIO_DATA.photos) return;

    if (currentCategory === 'all') {
      filteredPhotos = PORTFOLIO_DATA.photos;
      if (photoCountLabel) {
        photoCountLabel.textContent = `Showing all ${filteredPhotos.length} works`;
      }
    } else {
      filteredPhotos = PORTFOLIO_DATA.photos.filter(p => p.category === currentCategory);
      const catObj = PORTFOLIO_DATA.categories.find(c => c.id === currentCategory);
      const catName = catObj ? catObj.name : currentCategory;
      if (photoCountLabel) {
        photoCountLabel.textContent = `Showing ${filteredPhotos.length} works in ${catName}`;
      }
    }

    // Add fade-in animation to grid
    masonryGrid.classList.remove('fade-in');
    void masonryGrid.offsetWidth; // trigger reflow
    masonryGrid.classList.add('fade-in');

    if (filteredPhotos.length === 0) {
      masonryGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <p style="font-size: 1.1rem;">Belum ada foto dalam kategori ini.</p>
        </div>
      `;
      return;
    }

    masonryGrid.innerHTML = filteredPhotos.map((photo, index) => `
      <article class="gallery-item" data-index="${index}" tabindex="0" role="button" aria-label="View photo: ${escapeHtml(photo.title)}">
        <div class="gallery-img-wrapper">
          <img 
            src="${photo.thumb || photo.image}" 
            alt="${escapeHtml(photo.title)}" 
            loading="lazy"
            decoding="async"
            width="800"
            height="600"
          >
          <div class="gallery-meta-overlay">
            <span class="gallery-meta-badge">${escapeHtml(photo.categoryLabel || photo.category)} • ${photo.year || ''}</span>
            <h3 class="gallery-meta-title">${escapeHtml(photo.title)}</h3>
            <p class="gallery-meta-client">${escapeHtml(photo.client || '')}</p>
          </div>
          <div class="gallery-zoom-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </div>
        </div>
      </article>
    `).join('');

    // Attach click and keyboard events to gallery items
    masonryGrid.querySelectorAll('.gallery-item').forEach(item => {
      const idx = parseInt(item.getAttribute('data-index'), 10);
      
      item.addEventListener('click', () => {
        openLightbox(idx);
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(idx);
        }
      });
    });
  }

  // ==================================================================
  // 4. SET CATEGORY (FILTER & NAVIGATION SYNC)
  // ==================================================================
  function setCategory(catId, updateHash = false) {
    currentCategory = catId;

    // Update active class on filter buttons
    if (filterTabs) {
      filterTabs.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-category') === catId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // Update active class on desktop nav links
    document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-link').forEach(link => {
      const linkCat = link.getAttribute('data-category');
      if (linkCat === catId) {
        link.classList.add('active');
      } else if (linkCat) {
        link.classList.remove('active');
      }
    });

    renderGallery();

    if (updateHash) {
      if (catId === 'all') {
        history.replaceState(null, '', '#gallerySection');
      } else {
        history.replaceState(null, '', `#${catId}`);
      }
    }
  }

  // ==================================================================
  // 5. RENDER STATS & NUMBER COUNTER ANIMATION
  // ==================================================================
  function renderStats() {
    if (!statsGrid || !PORTFOLIO_DATA.stats) return;

    statsGrid.innerHTML = PORTFOLIO_DATA.stats.map((stat, idx) => `
      <div class="stat-card">
        <div class="stat-number-wrapper">
          <span class="stat-number" data-target="${stat.number}" id="statNum${idx}">0</span>
          <span class="stat-suffix">${stat.suffix || '+'}</span>
        </div>
        <p class="stat-label">${escapeHtml(stat.label)}</p>
      </div>
    `).join('');

    // Observe stats entering viewport for count-up animation
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          obs.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsGrid);
  }

  function animateCounters() {
    const counterElements = document.querySelectorAll('.stat-number');
    const duration = 1800; // 1.8 seconds

    counterElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * target);
        
        el.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ==================================================================
  // 6. RENDER TIMELINE MILESTONES
  // ==================================================================
  function renderTimeline() {
    if (!timelineTrack || !PORTFOLIO_DATA.milestones) return;

    timelineTrack.innerHTML = PORTFOLIO_DATA.milestones.map(m => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <span class="timeline-year">${escapeHtml(m.year)}</span>
        <h3 class="timeline-title">${escapeHtml(m.title)}</h3>
        <p class="timeline-desc">${escapeHtml(m.description)}</p>
      </div>
    `).join('');
  }

  // ==================================================================
  // 7. LIGHTBOX CONTROLLER
  // ==================================================================
  function openLightbox(index) {
    if (!filteredPhotos || filteredPhotos.length === 0) return;
    currentLightboxIndex = index;
    updateLightboxContent();

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const photo = filteredPhotos[currentLightboxIndex];
    if (!photo) return;

    // Fade effect during switch
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.96)';

    setTimeout(() => {
      lightboxImg.src = photo.image;
      lightboxImg.alt = photo.title;
      lightboxTitle.textContent = `${photo.title} (${photo.year || ''})`;
      lightboxDesc.textContent = photo.description || `${photo.client || ''} — ${photo.categoryLabel || ''}`;
      lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${filteredPhotos.length}`;

      lightboxImg.onload = () => {
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      };
    }, 120);
  }

  function nextPhoto() {
    if (filteredPhotos.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredPhotos.length;
    updateLightboxContent();
  }

  function prevPhoto() {
    if (filteredPhotos.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    updateLightboxContent();
  }

  // Lightbox Event Listeners
  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextPhoto);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevPhoto);

  // Close when clicking outside image
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-body') || e.target.classList.contains('lightbox-image-container')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });

  // Touch Swipe Gesture for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance < 0) {
        nextPhoto(); // Swipe left -> Next
      } else {
        prevPhoto(); // Swipe right -> Prev
      }
    }
  }

  // ==================================================================
  // 8. HEADER SCROLL & BACK TO TOP
  // ==================================================================
  function handleScroll() {
    const scrollY = window.scrollY;

    // Header blur effect
    if (scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==================================================================
  // 9. MOBILE DRAWER NAVIGATION
  // ==================================================================
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Auto close drawer when clicking a link
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileDrawer.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ==================================================================
  // 10. CATEGORY STORY CARDS CLICK LISTENER
  // ==================================================================
  document.querySelectorAll('.story-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-category');
      if (cat) {
        setCategory(cat, true);
        const filterEl = document.getElementById('filterSection');
        if (filterEl) {
          filterEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Nav links category click
  document.querySelectorAll('[data-category]').forEach(elem => {
    elem.addEventListener('click', (e) => {
      const cat = elem.getAttribute('data-category');
      if (cat) {
        setCategory(cat, true);
        const galleryEl = document.getElementById('filterSection');
        if (galleryEl && !elem.classList.contains('filter-btn')) {
          galleryEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ==================================================================
  // 11. HASH ROUTING INITIALIZATION
  // ==================================================================
  function checkHashRoute() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;

    if (hash === 'connect') {
      const connectEl = document.getElementById('connect');
      if (connectEl) connectEl.scrollIntoView({ behavior: 'smooth' });
    } else if (['all', 'concerts', 'portraits', 'people-places', 'brands'].includes(hash)) {
      setCategory(hash, false);
      const galleryEl = document.getElementById('filterSection');
      if (galleryEl) galleryEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  window.addEventListener('hashchange', checkHashRoute);

  // ==================================================================
  // 12. CONTACT FORM SUBMISSION
  // ==================================================================
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const service = document.getElementById('formService').value;
      const message = document.getElementById('formMessage').value.trim();

      // Show feedback
      if (formFeedback) {
        formFeedback.classList.add('success');
        formFeedback.innerHTML = `
          <strong>Terima kasih, ${escapeHtml(name)}!</strong> Pesan Anda untuk layanan <em>${escapeHtml(service)}</em> telah terkirim. Martinus akan segera membalas ke ${escapeHtml(email)}.
        `;
      }

      // Reset form
      contactForm.reset();

      // Scroll slightly to make sure feedback is visible
      if (formFeedback) {
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // ==================================================================
  // HELPER: ESCAPE HTML
  // ==================================================================
  function escapeHtml(text) {
    if (!text) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  // ==================================================================
  // INITIALIZE EVERYTHING
  // ==================================================================
  renderClients();
  renderFilterTabs();
  renderGallery();
  renderStats();
  renderTimeline();
  checkHashRoute();
  handleScroll();
});
