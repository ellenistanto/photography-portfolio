import { useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { API_BASE } from '../config/api';

/**
 * Custom hook: Fetch portfolio data from the API.
 * Falls back to local portfolioData.js if API is unreachable.
 */
export function usePortfolioData() {
  const [data, setData] = useState(PORTFOLIO_DATA);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

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
          setData(apiData);
          setFromApi(true);
        }
      } catch (err) {
        // Silently fall back to local data — visitor won't notice
        console.warn('[Portfolio] API unavailable, using local data:', err.message);
        if (!cancelled) {
          setData(PORTFOLIO_DATA);
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

export { API_BASE };
