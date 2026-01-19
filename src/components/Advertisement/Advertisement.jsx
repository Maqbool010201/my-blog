'use client';
import { useState, useEffect } from 'react';

export default function Advertisement({ page, position, adData, pageSlug, className = "" }) {
  const [ad, setAd] = useState(adData || null);
  const [isLoading, setIsLoading] = useState(!adData);

  useEffect(() => {
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

  // فکس: لوڈنگ کے دوران ہائٹ کو کم سے کم رکھیں تاکہ ہیرو کے نیچے فالتو جگہ نہ بنے
  if (isLoading) {
    return <div className={`ad-placeholder min-h-[10px] md:min-h-[100px] bg-transparent ${className}`} />;
  }

  // اگر اشتہار نہیں ہے تو مکمل null واپس کریں تاکہ جگہ خالی ہو جائے
  if (!ad) return null;

  return (
    <div className={`ad-wrapper overflow-hidden flex justify-center w-full ${className}`}>
      {ad.linkUrl ? (
        <a 
          href={ad.linkUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full max-w-full"
        >
          {/* ایڈ کا مواد: ہم نے اضافی مارجن ہٹا دیے ہیں */}
          <div 
            className="ad-content shadow-sm hover:shadow-md transition-shadow mx-auto"
            dangerouslySetInnerHTML={{ __html: ad.html }} 
          />
        </a>
      ) : (
        <div 
          className="ad-content mx-auto"
          dangerouslySetInnerHTML={{ __html: ad.html }} 
        />
      )}
    </div>
  );
}