'use client';
import { useState, useEffect } from 'react';

export default function Advertisement({ page, position, adData, pageSlug, className = "" }) {
  const [ad, setAd] = useState(adData || null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false); // To ensure we don't unload it once loaded

  useEffect(() => {
    if (!adData && page && position && isVisible && !hasLoaded) {
      // Add pageSlug to the query parameters
      const url = `/api/advertisements?pageType=${page}&position=${position}&isActive=true${pageSlug ? `&pageSlug=${pageSlug}` : ''}`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setAd(data[0]);
            setHasLoaded(true);
          }
        })
        .catch(() => setAd(null));
    }
  }, [adData, page, position, pageSlug, isVisible, hasLoaded]);

  // If adData is provided directly (SSR), we still might want to defer rendering the HTML if it has scripts,
  // but for CLS reasons, we often render immediately. 
  // However, for high TBT, deferring script execution is key.
  useEffect(() => {
    if (adData) setHasLoaded(true);
  }, [adData]);

  // Intersection Observer to detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Load 200px before it comes into view
    );

    const el = document.getElementById(`ad-${page}-${position}`);
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [page, position]);

  // Determine if we have content to show
  const showContent = (isVisible || adData) && ad;

  return (
    <div
      id={`ad-${page}-${position}`}
      className={`${className} ${showContent ? 'ad-wrapper min-h-[50px]' : 'ad-placeholder'}`}
      style={!showContent ? { minHeight: '1px' } : undefined}
    >
      {showContent && (
        ad.linkUrl ? (
          <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer">
            <div dangerouslySetInnerHTML={{ __html: ad.html }} />
          </a>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: ad.html }} />
        )
      )}
    </div>
  );
}