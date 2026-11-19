import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  fallbackSubtitle,
  fallbackSrc,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    // If we were trying the primary src and fallbackSrc is available, try fallbackSrc
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !currentSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center p-6 bg-[#FFF9F2] border border-[#C8A96B]/30 rounded-2xl ${className}`}
        role="img"
        aria-label={alt || fallbackTitle || 'Romantic keepsake'}
      >
        <div className="w-12 h-12 mb-3 rounded-full bg-[#E9B8C4]/20 border border-[#C8A96B]/40 flex items-center justify-center text-[#C98598]">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <p className="font-serif text-lg font-semibold text-[#49383D]">
          {fallbackTitle || 'A Special Memory'}
        </p>
        <p className="text-xs text-[#C98598] mt-1 max-w-[220px]">
          {fallbackSubtitle || 'Awaiting your personal photo'}
        </p>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt || 'Personal memory'}
      className={className}
      referrerPolicy="no-referrer"
      onError={handleError}
      {...props}
    />
  );
};
