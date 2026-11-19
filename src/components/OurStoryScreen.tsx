import React, { useState } from 'react';
import { config } from '../config';
import { SafeImage } from './SafeImage';
import { PhotoSliderModal } from './PhotoSliderModal';
import { ScrollRevealSection } from './ScrollRevealSection';
import { calculateStaggerDelay } from '../utils/scrollReveal';

interface OurStoryScreenProps {
  onProceedToPuzzle: () => void;
}

export const OurStoryScreen: React.FC<OurStoryScreenProps> = ({ onProceedToPuzzle }) => {
  // State for opening full-screen swipeable slider on Sarena gallery photos
  const [sliderIndex, setSliderIndex] = useState<number | null>(null);

  // Optional couple photo modal view
  const [isCoupleModalOpen, setIsCoupleModalOpen] = useState(false);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {/* Header */}
      <ScrollRevealSection className="text-center max-w-2xl mx-auto mb-14" delayMs={0} threshold={0.05}>
        <span className="text-xs uppercase tracking-widest text-[#C8A96B] font-medium">
          Chapter I · Cherished Moments
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#49383D] mt-2 mb-4 [text-wrap:balance]">
          {config.storyScreen.heading}
        </h2>
        <p className="text-base sm:text-lg text-[#49383D]/80 italic font-serif [text-wrap:balance]">
          “{config.storyScreen.introText}”
        </p>

        {/* Quiet known context narrative */}
        <div className="mt-6 p-4 rounded-2xl bg-white/60 border border-[#C8A96B]/20 text-xs sm:text-sm text-[#49383D]/75 leading-relaxed">
          From a simple connection on Instagram to long, quiet laughter across video screens, every shared moment has brought its own warmth.
        </div>
      </ScrollRevealSection>

      {/* SECTION A: MAIN COUPLE MEMORY (Photo 1 only) */}
      <ScrollRevealSection className="mb-20" delayMs={80} threshold={0.1}>
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-4 sm:p-6 border border-[#C8A96B]/30 soft-card-shadow">
          <div
            onClick={() => setIsCoupleModalOpen(true)}
            className="group relative overflow-hidden rounded-2xl bg-[#FFF9F2] aspect-[3/4] sm:aspect-[4/5] border border-[#C8A96B]/20 flex items-center justify-center cursor-pointer"
          >
            <SafeImage
              src={config.photos.couplePhoto.src}
              fallbackSrc={config.photos.couplePhoto.fallbackSrc}
              alt={config.photos.couplePhoto.alt}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              fallbackTitle={config.photos.couplePhoto.title}
              fallbackSubtitle="Upload couple photo to public/images/photo1.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
              <span className="text-xs text-white font-medium">Tap to view full frame</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <h3 className="font-serif text-2xl font-bold text-[#49383D]">
              {config.photos.couplePhoto.title}
            </h3>
            <p className="text-sm sm:text-base text-[#C98598] font-serif italic mt-1 [text-wrap:balance]">
              “{config.photos.couplePhoto.caption}”
            </p>
            <p className="text-[11px] text-[#49383D]/50 mt-2">
              Our shared frame · The puzzle ahead is crafted from this exact moment
            </p>
          </div>
        </div>
      </ScrollRevealSection>

      {/* SECTION B: SARENA PHOTO GALLERY (Photos 2, 3, 4, 5) */}
      <div className="mb-16">
        <ScrollRevealSection className="text-center max-w-xl mx-auto mb-10" delayMs={0} threshold={0.1}>
          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#49383D]">
            {config.storyScreen.galleryHeading}
          </h3>
          <p className="text-xs sm:text-sm text-[#49383D]/70 mt-1">
            {config.storyScreen.gallerySubtitle}
          </p>
          <p className="text-[11px] text-[#C8A96B] mt-1 font-mono">
            Tap any photo to open full-screen immersive swipe gallery
          </p>
        </ScrollRevealSection>

        {/* 2x3 or 3x2 Responsive Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {config.photos.sarenaGallery.map((item, index) => (
            <ScrollRevealSection
              key={item.id}
              delayMs={calculateStaggerDelay(index, 90)}
              threshold={0.1}
            >
              <div
                onClick={() => setSliderIndex(index)}
                className="group bg-white rounded-2xl p-4 border border-[#C8A96B]/25 soft-card-shadow soft-card-hover cursor-pointer h-full flex flex-col justify-between"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSliderIndex(index);
                  }
                }}
                aria-label={`Open full-screen view of Frame 0${index + 1}`}
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#FFF9F2] border border-[#C8A96B]/15 relative">
                  <SafeImage
                    src={item.src}
                    fallbackSrc={item.fallbackSrc}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    fallbackTitle={`Sarena · Moment 0${index + 1}`}
                    fallbackSubtitle={`public/images/photo${item.id}.jpg`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-4">
                    <span className="text-xs text-white font-medium">Tap for full screen</span>
                    <span className="text-[11px] text-white/80 font-mono">0{index + 1} / 0{config.photos.sarenaGallery.length}</span>
                  </div>
                </div>

                <div className="mt-4 px-1 text-center">
                  <p className="font-serif italic text-base text-[#49383D]">
                    “{item.caption}”
                  </p>
                  <span className="text-[11px] text-[#C8A96B] mt-1 block font-mono">
                    Frame 0{index + 1} · Tap to explore
                  </span>
                </div>
              </div>
            </ScrollRevealSection>
          ))}
        </div>
      </div>

      {/* Primary Action Button */}
      <ScrollRevealSection className="text-center pt-8 border-t border-[#C8A96B]/20" delayMs={100} threshold={0.1}>
        <p className="text-sm text-[#49383D]/70 mb-4 font-serif italic">
          Ready to put the pieces together?
        </p>
        <button
          onClick={onProceedToPuzzle}
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#C98598] hover:bg-[#b77487] text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-base sm:text-lg"
        >
          <span>{config.storyScreen.nextButtonText}</span>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </ScrollRevealSection>

      {/* Full-Screen Swipeable Gallery Modal Slider */}
      <PhotoSliderModal
        photos={config.photos.sarenaGallery}
        initialIndex={sliderIndex ?? 0}
        isOpen={sliderIndex !== null}
        onClose={() => setSliderIndex(null)}
      />

      {/* Single Lightbox Modal for Couple Photo */}
      {isCoupleModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#49383D]/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn"
          onClick={() => setIsCoupleModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Couple Photo Full View"
        >
          <div
            className="bg-[#FFF9F2] rounded-3xl p-4 sm:p-6 max-w-2xl w-full border border-[#C8A96B] soft-card-shadow relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsCoupleModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-[#49383D] flex items-center justify-center text-sm font-bold shadow-xs cursor-pointer border border-[#C8A96B]/30 hover:bg-[#FFF9F2] transition-colors"
              aria-label="Close photo view"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="aspect-[3/4] sm:aspect-[4/5] max-h-[75vh] rounded-2xl overflow-hidden bg-white mb-4 border border-[#C8A96B]/20 flex items-center justify-center">
              <SafeImage
                src={config.photos.couplePhoto.src}
                fallbackSrc={config.photos.couplePhoto.fallbackSrc}
                alt={config.photos.couplePhoto.alt}
                className="w-full h-full object-contain"
                fallbackTitle={config.photos.couplePhoto.title}
              />
            </div>
            <div className="text-center">
              <h4 className="font-serif text-xl font-bold text-[#49383D]">
                {config.photos.couplePhoto.title}
              </h4>
              <p className="font-serif italic text-base text-[#C98598] mt-1">
                “{config.photos.couplePhoto.caption}”
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
