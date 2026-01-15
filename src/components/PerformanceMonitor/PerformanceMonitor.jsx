"use client";

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if ('connection' in navigator) {
      console.log('Network type:', navigator.connection.effectiveType);
    }

    // Monitor LCP
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });

    return () => observer.disconnect();
  }, []);

  return null;
}