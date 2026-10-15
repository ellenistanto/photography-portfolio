import React, { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { usePortfolioData } from './hooks/usePortfolioData';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ClientsCloud from './components/ClientsCloud';
import OverviewSection from './components/OverviewSection';
import MasonryGallery from './components/MasonryGallery';
import VideoSection from './components/VideoSection';
import ConnectSection from './components/ConnectSection';
import Footer from './components/Footer';

// Code-split modals and admin to keep critical portfolio bundle minimal
const LightboxModal = lazy(() => import('./components/LightboxModal'));
const VideoModal = lazy(() => import('./components/VideoModal'));
const AdminApp = lazy(() => import('./admin/AdminApp'));

// ── Portfolio Page ────────────────────────────────────────────────────────────
function PortfolioPage() {
  const { data, loading } = usePortfolioData();
  const lenisRef = useRef(null);

  const [currentCategory, setCurrentCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Video Lightbox State
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModalIndex, setVideoModalIndex] = useState(0);

  // Initialize Lenis smooth inertia scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      infinite: false,
    });
    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Sync modal open/close with Lenis scroll lock
  useEffect(() => {
    if (lightboxOpen || videoModalOpen) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [lightboxOpen, videoModalOpen]);

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

  const scrollToSection = (sectionId) => {
    if (lenisRef.current) {
      if (sectionId === 'home') {
        lenisRef.current.scrollTo(0, { duration: 1.2 });
      } else {
        lenisRef.current.scrollTo('#' + sectionId, { offset: -30, duration: 1.2 });
      }
    } else {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
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

  // Video modal handlers
  const handleOpenVideoModal = (index) => {
    setVideoModalIndex(index);
    setVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setVideoModalOpen(false);
  };

  const handleNextVideo = () => {
    if (!data.videos || data.videos.length === 0) return;
    setVideoModalIndex((prev) => (prev + 1) % data.videos.length);
  };

  const handlePrevVideo = () => {
    if (!data.videos || data.videos.length === 0) return;
    setVideoModalIndex((prev) => (prev - 1 + data.videos.length) % data.videos.length);
  };

  return (
    <div className="portfolio-app">
      {/* Header & Navigation */}
      <Navbar
        profile={data.profile}
        categories={data.categories}
        photos={data.photos}
        videos={data.videos}
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
        onScrollToSection={scrollToSection}
      />

      <main>
        {/* Hero Section */}
        <Hero
          profile={data.profile}
        />

        {/* Collaborating Artists & Brands */}
        <ClientsCloud clients={data.clients} />

        {/* Curated Overview Section */}
        <OverviewSection
          overview={data.overview}
          photos={overviewPhotos}
          onPhotoClick={handleOpenOverviewLightbox}
        />

        {/* Responsive Masonry Gallery */}
        <MasonryGallery
          photos={filteredPhotos}
          loading={loading}
          onPhotoClick={handleOpenLightbox}
        />

        {/* Motion & Video Portfolio Section */}
        <VideoSection
          videos={data.videos}
          onVideoClick={handleOpenVideoModal}
        />

        {/* Connect, About, Milestones & Contact */}
        <ConnectSection
          profile={data.profile}
          stats={data.stats}
          showStats={data.showStats !== false}
        />
      </main>

      {/* Lightbox Modal for Photos (Lazy loaded on demand) */}
      {lightboxOpen && (
        <Suspense fallback={null}>
          <LightboxModal
            isOpen={lightboxOpen}
            photos={lightboxPhotos}
            currentIndex={lightboxIndex}
            onClose={handleCloseLightbox}
            onNext={handleNextPhoto}
            onPrev={handlePrevPhoto}
          />
        </Suspense>
      )}

      {/* Video Lightbox Modal (Lazy loaded on demand) */}
      {videoModalOpen && (
        <Suspense fallback={null}>
          <VideoModal
            isOpen={videoModalOpen}
            videos={data.videos}
            currentIndex={videoModalIndex}
            onClose={handleCloseVideoModal}
            onNext={handleNextVideo}
            onPrev={handlePrevVideo}
          />
        </Suspense>
      )}

      {/* Footer */}
      <Footer
        profile={data.profile}
      />
    </div>
  );
}

// ── Root App with Routing ─────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      {/* Admin dashboard — only downloaded when visiting /admin */}
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c', color: '#a1a1aa' }}>
              <div className="admin-spinner" style={{ width: 24, height: 24 }}></div>
            </div>
          }>
            <AdminApp />
          </Suspense>
        }
      />
      {/* Portfolio — everything else */}
      <Route path="/*" element={<PortfolioPage />} />
    </Routes>
  );
}
