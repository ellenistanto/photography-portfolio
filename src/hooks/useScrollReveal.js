import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to trigger entrance animations when an element enters the viewport.
 * Uses native IntersectionObserver. Automatically disconnects once triggered
 * to avoid unnecessary scroll listeners and re-renders.
 */
export function useScrollReveal({
  threshold = 0.02,
  rootMargin = '0px 0px 60px 0px',
  once = true,
} = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Fallback if IntersectionObserver is unsupported or during SSR
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(el);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return [elementRef, isVisible];
}
