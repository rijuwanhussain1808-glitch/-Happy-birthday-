import React from 'react';

interface PhotoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoGuideModal: React.FC<PhotoGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#49383D]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[#FFF9F2] rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#C8A96B] soft-card-shadow relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-[#49383D] flex items-center justify-center text-sm font-bold shadow-xs hover:bg-[#FFF9F2] cursor-pointer border border-[#C8A96B]/30 transition-colors"
          aria-label="Close photo guide"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex items-center gap-2 text-[#C8A96B] mb-2 text-xs font-semibold uppercase tracking-wider">
          <span>🌹</span>
          <span>Rihan & Sarena's Photo Map</span>
        </div>

        <h3 className="text-2xl font-serif font-bold text-[#49383D] mb-4">
          All 8 Photos Successfully Placed ✨
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-[#49383D]/85 leading-relaxed">
          <p>
            Your photos are now placed in their specific locations throughout the website:
          </p>

          <div className="space-y-2 border-t border-[#C8A96B]/20 pt-3">
            <div className="p-2.5 bg-white/60 rounded-lg border border-[#C8A96B]/20">
              <strong className="text-[#49383D] block font-medium">1. Couple Portrait in Purple (photo1.jpg)</strong>
              <span className="text-[#49383D]/75 text-xs">
                Main memory on Our Story screen and the interactive 3×3 sliding photo puzzle.
              </span>
            </div>

            <div className="p-2.5 bg-white/60 rounded-lg border border-[#C8A96B]/20">
              <strong className="text-[#49383D] block font-medium">2. Forehead Kiss in B&W (photo6.jpg)</strong>
              <span className="text-[#49383D]/75 text-xs">
                Atmospheric backdrop for the Secret Gate and featured in the Final Surprise Keepsake Gallery.
              </span>
            </div>

            <div className="p-2.5 bg-white/60 rounded-lg border border-[#C8A96B]/20">
              <strong className="text-[#49383D] block font-medium">3. Sarena's 6 Solo Portraits (photo2 – photo8)</strong>
              <span className="text-[#49383D]/75 text-xs">
                Pink Saree, Assamese Japi, Floral Smile, Afternoon Glow, Soft Blink, and Red Gingham Collage featured in "A Little World of You" and the full-screen swipeable slider.
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#E9B8C4]/20 rounded-xl border border-[#C98598]/30 text-xs">
            <strong>Customizing Captions:</strong>
            <p className="mt-1">
              To edit any caption, quote, or note, open <code className="bg-white/70 px-1 py-0.5 rounded text-[#C98598] font-mono">src/config.ts</code>. Everything is cleanly organized!
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#49383D] hover:bg-[#34272b] text-white text-xs sm:text-sm font-medium rounded-full cursor-pointer transition-colors shadow-xs"
          >
            Wonderful, got it!
          </button>
        </div>
      </div>
    </div>
  );
};
