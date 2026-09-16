import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { usePortfolioData } from './hooks/usePortfolioData';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ClientsCloud from './components/ClientsCloud';
import OverviewSection from './components/OverviewSection';
import ProjectsSection from './components/ProjectsSection';
import FilterBar from './components/FilterBar';
import MasonryGallery from './components/MasonryGallery';
import ConnectSection from './components/ConnectSection';
import LightboxModal from './components/LightboxModal';
import Footer from './components/Footer';
import ProjectDetailPage from './components/ProjectDetailPage';

// Lazy-load admin to keep initial bundle small
import AdminApp from './admin/AdminApp';

// ── Portfolio Page ────────────────────────────────────────────────────────────
function PortfolioPage() {
  const { data, loading } = usePortfolioData();

  const [currentCategory, setCurrentCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Filter photos based on selected category
  const filteredPhotos = useMemo(() => {
    if (!data.photos) return [];
    if (currentCategory === 'all') {
      return data.photos;
    }
    return data.photos.filter(p => p.category === currentCategory);
  }, [currentCategory, data.photos]);

  // Curated Overview Photos (in order of overview.photoIds)
  const overviewPhotos = useMemo(() => {
    if (!data.photos || data.photos.length === 0) return [];
    const photoIds = data.overview?.photoIds;
    if (Array.isArray(photoIds) && photoIds.length > 0) {
      const mapped = photoIds
        .map(id => data.photos.find(p => p.id === id))
        .filter(Boolean);
      if (mapped.length > 0) return mapped;
    }
    // Fallback: collect photos marked with isOverview: true
    return data.photos.filter(p => p.isOverview);
  }, [data.photos, data.overview]);

  // Scroll handler for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (catId) => {
    setCurrentCategory(catId);
  };

  const handleOpenLightbox = (index) => {
    setLightboxPhotos(filteredPhotos);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleOpenOverviewLightbox = (photo, index) => {
    setLightboxPhotos(overviewPhotos);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  const handleNextPhoto = () => {
    if (lightboxPhotos.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % lightboxPhotos.length);
  };

  const handlePrevPhoto = () => {
    if (lightboxPhotos.length === 0) return;
    setLightboxIndex((prev) => (prev - 1 + lightboxPhotos.length) % lightboxPhotos.length);
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="portfolio-app">
      {/* Header & Navigation */}
      <Navbar
        profile={data.profile}
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
        onScrollToSection={scrollToSection}
      />

      <main>
        {/* Hero Section */}
        <Hero
          profile={data.profile}
          onExploreClick={() => scrollToSection('filterSection')}
          onContactClick={() => scrollToSection('connect')}
        />

        {/* Collaborating Artists & Brands */}
        <ClientsCloud clients={data.clients} />

        {/* Curated Overview Section */}
        <OverviewSection
          overview={data.overview}
          photos={overviewPhotos}
          onPhotoClick={handleOpenOverviewLightbox}
        />

        {/* Featured Projects & Series */}
        <ProjectsSection projects={data.projects} />

        {/* Category Filter Tabs */}
        <FilterBar
          categories={data.categories}
          currentCategory={currentCategory}
          onSelectCategory={handleSelectCategory}
          totalCount={filteredPhotos.length}
        />

        {/* Responsive Masonry Gallery */}
        <MasonryGallery
          photos={filteredPhotos}
          loading={loading}
          onPhotoClick={handleOpenLightbox}
        />

        {/* Connect, About, Milestones & Contact */}
        <ConnectSection
          profile={data.profile}
          stats={data.stats}
          milestones={data.milestones}
        />
      </main>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        photos={lightboxPhotos}
        currentIndex={lightboxIndex}
        onClose={handleCloseLightbox}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
      />

      {/* Floating Back to Top Button */}
      <button
        className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
        onClick={handleBackToTop}
        aria-label="Back to Top"
      >
        <ArrowUp size={20} />
      </button>

      {/* Footer */}
      <Footer
        profile={data.profile}
        onSelectCategory={handleSelectCategory}
        onScrollToSection={scrollToSection}
      />
    </div>
  );
}

function ProjectDetailPageWrapper() {
  const { data } = usePortfolioData();
  return <ProjectDetailPage portfolioData={data} />;
}

// ── Root App with Routing ─────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      {/* Admin dashboard — only accessible at /admin */}
      <Route path="/admin/*" element={<AdminApp />} />
      {/* Dedicated Project Page */}
      <Route path="/project/:slug" element={<ProjectDetailPageWrapper />} />
      {/* Portfolio — everything else */}
      <Route path="/*" element={<PortfolioPage />} />
    </Routes>
  );
}
