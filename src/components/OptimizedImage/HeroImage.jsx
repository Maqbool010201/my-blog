// src/components/OptimizedImage/HeroImage.jsx - UPDATED
import Image from 'next/image';

// Generate proper blur placeholder
const generateBlurDataURL = () => {
  return "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";
};

export default function HeroImage({ 
  src, 
  alt, 
  className = "",
  isHero = false // Add this flag
}) {
  // Convert PNG to WebP if not already
  const optimizedSrc = src?.replace('.png', '.webp') || "/images/blog/placeholder.webp";
  
  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={1920}
      height={1080}
      className={`object-cover ${className}`}
      priority={isHero} // Only true for hero images
      sizes={isHero ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
      quality={isHero ? 80 : 75}
      placeholder="blur"
      blurDataURL={generateBlurDataURL()}
      loading={isHero ? "eager" : "lazy"}
    />
  );
}