import { useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { API_BASE } from '../config/api';

const CACHE_KEY = 'portfolio_data_cache_v3';

/**
 * Mendapatkan initial state secara sinkron untuk mencegah layout shift
 * dan MENCEGAH kemunculan foto dummy saat web pertama kali dibuka di Vercel.
 */
function getInitialData() {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed) {
          return {
            data: {
              ...parsed,
              projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : (PORTFOLIO_DATA.projects || []),
            },
            isCached: true
          };
        }
      }
    } catch (e) {
      console.warn('[Portfolio] Gagal membaca cache lokal:', e);
    }
  }

  // Jika belum ada cache: JANGAN masukkan foto dummy!
  return {
    data: {
      profile: {
        name: PORTFOLIO_DATA.profile?.name || 'Ellen Istanto',
        tagline: PORTFOLIO_DATA.profile?.tagline || '',
        shortBio: PORTFOLIO_DATA.profile?.shortBio || '',
        aboutLong: PORTFOLIO_DATA.profile?.aboutLong || [],
        location: PORTFOLIO_DATA.profile?.location || '',
        email: PORTFOLIO_DATA.profile?.email || '',
        whatsapp: PORTFOLIO_DATA.profile?.whatsapp || '',
        instagram: PORTFOLIO_DATA.profile?.instagram || '',
        youtube: PORTFOLIO_DATA.profile?.youtube || '',
        behance: PORTFOLIO_DATA.profile?.behance || '',
        photo: PORTFOLIO_DATA.profile?.photo || '',
        avatar: PORTFOLIO_DATA.profile?.avatar || '',
        heroImage: '', // Kosongkan saat loading awal agar foto dummy tidak muncul
      },
      categories: PORTFOLIO_DATA.categories || [],
      photos: [], // Kosongkan agar foto dummy tidak ditampilkan saat loading awal
      projects: PORTFOLIO_DATA.projects || [],
      stats: PORTFOLIO_DATA.stats || [],
      clients: PORTFOLIO_DATA.clients || [],
      milestones: PORTFOLIO_DATA.milestones || [],
      overview: PORTFOLIO_DATA.overview || {
        enabled: true,
        title: 'Selected Works',
        subtitle: 'Curated highlights & moments in between',
        photoIds: [],
      }
    },
    isCached: false
  };
}

/**
 * Custom hook: Mengambil data portofolio dari API dengan cache lokal.
 * Menjamin foto dummy tidak pernah muncul saat web dibuka di Vercel.
 */
export function usePortfolioData() {
  const [initial] = useState(() => getInitialData());
  const [data, setData] = useState(initial.data);
  const [loading, setLoading] = useState(!initial.isCached);
  const [fromApi, setFromApi] = useState(initial.isCached);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/api/portfolio`, {
          signal: AbortSignal.timeout(8000), // 8s timeout
        });

        if (!res.ok) throw new Error(`API responded with ${res.status}`);

        const apiData = await res.json();
        if (!cancelled) {
          const mergedData = {
            ...apiData,
            projects: (Array.isArray(apiData.projects) && apiData.projects.length > 0)
              ? apiData.projects
              : (PORTFOLIO_DATA.projects || []),
          };
          setData(mergedData);
          setFromApi(true);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(mergedData));
          } catch (e) {
            // LocalStorage quota / private mode
          }
        }
      } catch (err) {
        console.warn('[Portfolio] API unavailable, fallback check:', err.message);
        if (!cancelled) {
          // Jika sudah ada data atau foto sebelumnya, pertahankan
          setData((prev) => {
            if (prev && Array.isArray(prev.photos) && prev.photos.length > 0) {
              return {
                ...prev,
                projects: prev.projects && prev.projects.length > 0 ? prev.projects : (PORTFOLIO_DATA.projects || []),
              };
            }
            // Hanya fallback ke PORTFOLIO_DATA jika koneksi benar-benar error dan belum ada data
            return PORTFOLIO_DATA;
          });
          setFromApi(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, fromApi };
}

/**
 * Helper untuk menghapus atau memperbarui cache (digunakan oleh Admin)
 */
export function clearPortfolioCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {}
}

export function updatePortfolioCache(newData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
  } catch (e) {}
}

export { API_BASE };
