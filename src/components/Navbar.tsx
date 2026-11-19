import React from 'react';
import { config } from '../config';
import { useMusic } from '../context/MusicContext';

export type ScreenId = 'welcome' | 'secret' | 'story' | 'puzzle' | 'surprise';

interface NavbarProps {
  currentScreen: ScreenId;
  unlockedScreens: Set<ScreenId>;
  onNavigate: (screen: ScreenId) => void;
  onOpenPhotoGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  unlockedScreens,
  onNavigate,
  onOpenPhotoGuide,
}) => {
  const { isPlaying, togglePlay } = useMusic();

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F2]/90 backdrop-blur-md border-b border-[#C8A96B]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => onNavigate('welcome')}
          className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#49383D] hover:text-[#C98598] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
          aria-label="Go to Welcome Screen"
        >
          <span className="text-[#C98598]" aria-hidden="true">🌹</span>
          <span>{config.websiteName}</span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#49383D]/80">
          <button
            onClick={() => onNavigate('welcome')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentScreen === 'welcome'
                ? 'text-[#C98598] font-semibold underline decoration-[#C8A96B] underline-offset-8'
                : 'hover:text-[#C98598]'
            }`}
          >
            Welcome
          </button>

          <button
            onClick={() => onNavigate('secret')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentScreen === 'secret'
                ? 'text-[#C98598] font-semibold underline decoration-[#C8A96B] underline-offset-8'
                : 'hover:text-[#C98598]'
            }`}
          >
            Secret Gate
          </button>

          <button
            onClick={() => {
              if (unlockedScreens.has('story')) onNavigate('story');
            }}
            disabled={!unlockedScreens.has('story')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              !unlockedScreens.has('story')
                ? 'text-[#49383D]/30 cursor-not-allowed'
                : currentScreen === 'story'
                ? 'text-[#C98598] font-semibold underline decoration-[#C8A96B] underline-offset-8 cursor-pointer'
                : 'hover:text-[#C98598] cursor-pointer'
            }`}
          >
            Our Story
          </button>

          <button
            onClick={() => {
              if (unlockedScreens.has('puzzle')) onNavigate('puzzle');
            }}
            disabled={!unlockedScreens.has('puzzle')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              !unlockedScreens.has('puzzle')
                ? 'text-[#49383D]/30 cursor-not-allowed'
                : currentScreen === 'puzzle'
                ? 'text-[#C98598] font-semibold underline decoration-[#C8A96B] underline-offset-8 cursor-pointer'
                : 'hover:text-[#C98598] cursor-pointer'
            }`}
          >
            Photo Puzzle
          </button>

          <button
            onClick={() => {
              if (unlockedScreens.has('surprise')) onNavigate('surprise');
            }}
            disabled={!unlockedScreens.has('surprise')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              !unlockedScreens.has('surprise')
                ? 'text-[#49383D]/30 cursor-not-allowed'
                : currentScreen === 'surprise'
                ? 'text-[#C98598] font-semibold underline decoration-[#C8A96B] underline-offset-8 cursor-pointer'
                : 'hover:text-[#C98598] cursor-pointer'
            }`}
          >
            Final Surprise
          </button>
        </nav>

        {/* Zone 3: Music player control & Photo Guide */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Music Toggle Pill */}
          <button
            onClick={togglePlay}
            className={`inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer border shadow-2xs ${
              isPlaying
                ? 'bg-[#E9B8C4]/20 border-[#C98598] text-[#49383D] ring-1 ring-[#C98598]/30'
                : 'bg-white border-[#C8A96B]/40 text-[#49383D]/70 hover:bg-[#FFF9F2]'
            }`}
            title={isPlaying ? 'Pause background music' : 'Play background music'}
            aria-label={isPlaying ? 'Pause Alfaaz song' : 'Play Alfaaz song'}
          >
            {isPlaying ? (
              <>
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-3 bg-[#C98598] animate-pulse" />
                  <span className="w-0.5 h-2 bg-[#C98598] animate-pulse delay-75" />
                  <span className="w-0.5 h-3.5 bg-[#C98598] animate-pulse delay-150" />
                </span>
                <span className="font-serif font-medium">Alfaaz 🎵</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-[#C8A96B]" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span className="font-serif">Play Song</span>
              </>
            )}
          </button>

          {/* Guide Button */}
          <button
            onClick={onOpenPhotoGuide}
            className="hidden sm:inline-block px-3 py-1.5 text-xs font-medium text-[#49383D] bg-white border border-[#C8A96B]/40 rounded-full hover:bg-[#FFF9F2] hover:border-[#C8A96B] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            aria-label="View photo setup guide"
          >
            Photo Guide
          </button>
        </div>
      </div>
    </header>
  );
};
