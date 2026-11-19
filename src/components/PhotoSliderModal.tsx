import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeImage } from './SafeImage';
import { getNextIndex, getPrevIndex, getSwipeDirection } from '../utils/slider';

interface PhotoItem {
  id: number;
  src: string;
  fallbackSrc: string;
  caption: string;
  alt: string;
}

interface PhotoSliderModalProps {
  photos: PhotoItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoSliderModal: React.FC<PhotoSliderModalProps> = ({
  photos,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Sync initialIndex when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => getNextIndex(prev, photos.length));
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => getPrevIndex(prev, photos.length));
  }, [photos.length]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const direction = getSwipeDirection(touchStartXRef.current, touchEndXRef.current, 45);
      if (direction === 'left') {
        handleNext();
      } else if (direction === 'right') {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#49383D]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 overflow-hidden animate-fadeIn select-none"
      role="dialog"
      aria-modal="true"
      aria-label="A Little World of You - Fullscreen Gallery"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="w-full max-w-5xl mx-auto flex items-center justify-between z-20 pb-2 border-b border-[#C8A96B]/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-[#C98598] text-sm">🌹</span>
          <span className="font-serif text-lg text-white font-medium">A Little World of You</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[#C8A96B] font-mono tracking-widest tabular-nums bg-white/10 px-3 py-1 rounded-full border border-[#C8A96B]/30">
            {currentIndex + 1} / {photos.length}
          </span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 focus-visible:ring-2 focus-visible:ring-[#C8A96B]"
            aria-label="Close fullscreen view"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Slide Viewing Area */}
      <div
        className="relative flex-1 flex items-center justify-center py-4 w-full max-w-4xl mx-auto"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous Button (Desktop/Tablet) */}
        <button
          onClick={handlePrev}
          className="hidden sm:flex absolute left-0 z-30 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white items-center justify-center transition-all cursor-pointer border border-[#C8A96B]/40 shadow-lg -translate-x-4 md:-translate-x-8"
          aria-label="Previous photo"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Center Image Container */}
        <div className="flex flex-col items-center justify-center max-h-[72vh] w-full">
          <div className="relative max-h-[60vh] sm:max-h-[64vh] rounded-2xl overflow-hidden bg-[#FFF9F2] border-2 border-[#C8A96B]/40 shadow-2xl transition-all duration-300">
            <SafeImage
              key={currentPhoto.id}
              src={currentPhoto.src}
              fallbackSrc={currentPhoto.fallbackSrc}
              alt={currentPhoto.alt}
              className="max-h-[60vh] sm:max-h-[64vh] w-auto object-contain mx-auto transition-opacity duration-300"
              fallbackTitle={`Sarena · Moment 0${currentIndex + 1}`}
            />
          </div>

          {/* Caption */}
          <div className="mt-4 text-center max-w-xl px-4">
            <p className="font-serif italic text-lg sm:text-xl text-[#FFF9F2] tracking-wide">
              “{currentPhoto.caption}”
            </p>
            <p className="text-[11px] text-[#C8A96B] mt-1 font-mono">
              Frame 0{currentIndex + 1} · Swipe or tap arrows to explore
            </p>
          </div>
        </div>

        {/* Next Button (Desktop/Tablet) */}
        <button
          onClick={handleNext}
          className="hidden sm:flex absolute right-0 z-30 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white items-center justify-center transition-all cursor-pointer border border-[#C8A96B]/40 shadow-lg translate-x-4 md:translate-x-8"
          aria-label="Next photo"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Bottom Thumbnail Strip / Indicators */}
      <div
        className="w-full max-w-md mx-auto flex items-center justify-center gap-3 pt-2 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {photos.map((photo, idx) => (
          <button
            key={photo.id}
            onClick={() => setCurrentIndex(idx)}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
              idx === currentIndex
                ? 'border-[#C8A96B] scale-110 ring-2 ring-[#C98598]/50 shadow-md'
                : 'border-white/20 opacity-50 hover:opacity-80'
            }`}
            aria-label={`Jump to photo ${idx + 1}`}
          >
            <SafeImage
              src={photo.src}
              fallbackSrc={photo.fallbackSrc}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
