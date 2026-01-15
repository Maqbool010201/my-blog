'use client';
import { useState, useEffect } from 'react';

export default function Advertisement({ page, position, adData, pageSlug, className = "" }) {
  const [ad, setAd] = useState(adData || null);
  const [isLoading, setIsLoading] = useState(!adData);

  useEffect(() => {
    // اگر ڈیٹا پہلے سے موجود ہے تو فیچ کرنے کی ضرورت نہیں
    if (adData) {
        setAd(adData);
        setIsLoading(false);
        return;
    }
    
    if (!page || !position) return;

    const fetchAd = async () => {
      try {
        const url = `/api/advertisements?pageType=${page}&position=${position}&isActive=true${pageSlug ? `&pageSlug=${pageSlug}` : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        
        setAd(Array.isArray(data) && data.length > 0 ? data[0] : null);
      } catch (error) {
        console.error("Ad loading failed:", error);
        setAd(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAd();
  }, [adData, page, position, pageSlug]);

  // لوڈنگ کے دوران ایک خالی جگہ (Placeholder) دکھائیں تاکہ Layout Shift نہ ہو
  if (isLoading) {
    return <div className={`ad-placeholder min-h-[100px] bg-gray-50 animate-pulse ${className}`} />;
  }

  if (!ad) return null;

  return (
    <div className={`ad-wrapper overflow-hidden flex justify-center ${className}`}>
      {ad.linkUrl ? (
        <a 
          href={ad.linkUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full"
        >
          {/* ایڈ کا مواد */}
          <div 
            className="ad-content shadow-sm hover:shadow-md transition-shadow"
            dangerouslySetInnerHTML={{ __html: ad.html }} 
          />
        </a>
      ) : (
        <div 
          className="ad-content"
          dangerouslySetInnerHTML={{ __html: ad.html }} 
        />
      )}
    </div>
  );
}